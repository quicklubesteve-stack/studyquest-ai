import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchMaterialGrounding } from "@/lib/materials/extractor";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/materials/[id]/ask
 * Answers learner inquiries grounded in the document text with verifiable citations.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
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
        { error: "Forbidden: You do not have access to query this document." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        { error: "A non-empty query is required." },
        { status: 400 }
      );
    }

    const result = searchMaterialGrounding(
      material.fileName,
      material.extractedText,
      query
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/materials/[id]/ask error:", error);
    return NextResponse.json(
      { error: "Failed to answer grounded document question." },
      { status: 500 }
    );
  }
}
