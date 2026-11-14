import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  validateUploadSafety,
  extractTextFromBuffer,
  analyzeStudyMaterial,
} from "@/lib/materials/extractor";

export const dynamic = "force-dynamic";

/**
 * GET /api/materials
 * Lists all uploaded study materials owned by the authenticated user.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string })?.id;

    // Fallback in local/dev if unauthenticated: find or use default learner
    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { role: "LEARNER" },
      });
      if (demoUser) {
        userId = demoUser.id;
      } else {
        return NextResponse.json({ materials: [] });
      }
    }

    const materials = await prisma.studyMaterial.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ materials });
  } catch (error) {
    console.error("GET /api/materials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study materials" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/materials
 * Uploads, safely validates, extracts text, and generates study aids for a document.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { role: "LEARNER" },
      });
      if (demoUser) {
        userId = demoUser.id;
      } else {
        return NextResponse.json(
          { error: "Authentication required to upload study materials." },
          { status: 401 }
        );
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tier = (formData.get("educationTier") as string) || "high_school";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name || "uploaded-document.txt";

    // 1. Safety & Malware Validation
    const validation = validateUploadSafety(filename, buffer);
    if (!validation.valid || !validation.fileType) {
      return NextResponse.json(
        { error: validation.error || "File validation failed." },
        { status: 400 }
      );
    }

    // 2. Safe Text Extraction
    let extractedText = "";
    try {
      extractedText = await extractTextFromBuffer(buffer, validation.fileType);
    } catch (err: unknown) {
      return NextResponse.json(
        { error: `Text extraction error: ${err instanceof Error ? err.message : String(err)}` },
        { status: 422 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "The uploaded document contains no extractable text." },
        { status: 422 }
      );
    }

    // 3. Document Analysis, Flashcards, Quiz Questions, Notes, and Study Plan
    const analysis = analyzeStudyMaterial(extractedText, filename, tier);

    // 4. Save to Database with User Isolation
    const record = await prisma.studyMaterial.create({
      data: {
        userId,
        fileName: filename,
        fileType: validation.fileType,
        fileSize: buffer.length,
        extractedText,
        summary: analysis.summary,
        keyConcepts: JSON.stringify(analysis.keyConcepts),
        studyNotes: analysis.studyNotes,
        flashcards: JSON.stringify(analysis.flashcards),
        quizQuestions: JSON.stringify(analysis.quizQuestions),
        studyPlan: analysis.studyPlan,
      },
    });

    return NextResponse.json({
      success: true,
      material: {
        id: record.id,
        fileName: record.fileName,
        fileType: record.fileType,
        fileSize: record.fileSize,
        createdAt: record.createdAt,
        summary: analysis.summary,
        keyConcepts: analysis.keyConcepts,
        studyNotes: analysis.studyNotes,
        flashcards: analysis.flashcards,
        quizQuestions: analysis.quizQuestions,
        studyPlan: analysis.studyPlan,
        wordCount: analysis.wordCount,
        extractedTextLength: record.extractedText.length,
      },
    });
  } catch (error) {
    console.error("POST /api/materials error:", error);
    return NextResponse.json(
      { error: "Failed to process and analyze study material." },
      { status: 500 }
    );
  }
}
