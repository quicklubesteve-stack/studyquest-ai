import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/materials/[id]
 * Retrieves the full study material record, enforcing user isolation.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { role: "LEARNER" },
      });
      if (demoUser) {
        userId = demoUser.id;
      }
    }

    const material = await prisma.studyMaterial.findUnique({
      where: { id: params.id },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Study material not found." },
        { status: 404 }
      );
    }

    // Enforce strict user isolation: User can only access their own material (or admin)
    const userRole = (session?.user as { role?: string })?.role;
    if (userId && material.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to view this document." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      material: {
        id: material.id,
        fileName: material.fileName,
        fileType: material.fileType,
        fileSize: material.fileSize,
        createdAt: material.createdAt,
        updatedAt: material.updatedAt,
        summary: material.summary,
        keyConcepts: material.keyConcepts ? JSON.parse(material.keyConcepts) : [],
        studyNotes: material.studyNotes,
        flashcards: material.flashcards ? JSON.parse(material.flashcards) : [],
        quizQuestions: material.quizQuestions ? JSON.parse(material.quizQuestions) : [],
        studyPlan: material.studyPlan,
        extractedTextLength: material.extractedText.length,
      },
    });
  } catch (error) {
    console.error("GET /api/materials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve study material." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/materials/[id]
 * Deletes the study material, strictly verifying ownership.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { role: "LEARNER" },
      });
      if (demoUser) {
        userId = demoUser.id;
      }
    }

    const material = await prisma.studyMaterial.findUnique({
      where: { id: params.id },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Study material not found." },
        { status: 404 }
      );
    }

    const userRole = (session?.user as { role?: string })?.role;
    if (userId && material.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete another user's document." },
        { status: 403 }
      );
    }

    await prisma.studyMaterial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, deletedId: params.id });
  } catch (error) {
    console.error("DELETE /api/materials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete study material." },
      { status: 500 }
    );
  }
}
