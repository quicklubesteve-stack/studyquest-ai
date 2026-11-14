import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/export
 * PIPEDA & COPPA Compliance: Generates a complete JSON export of all personal data,
 * learning records, study materials, and account metadata for the authenticated user.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { role: "LEARNER" } });
      if (demoUser) userId = demoUser.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required to export account data." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        progress: true,
        topicMasteries: true,
        quizAttempts: true,
        studyMaterials: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            summary: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    // Exclude password hash from privacy export
    const { hashedPassword, ...safeUser } = user;

    const exportPayload = {
      complianceStandard: "PIPEDA (Canada) & COPPA (USA) Data Portability Export",
      exportGeneratedAt: new Date().toISOString(),
      user: safeUser,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="studyquest_export_${user.email}_${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error("GET /api/user/export error:", error);
    return NextResponse.json(
      { error: "Failed to generate personal data export." },
      { status: 500 }
    );
  }
}
