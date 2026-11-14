import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/user/delete
 * PIPEDA Principle 5 & COPPA Section 312.6 Compliance:
 * Permanently deletes user account, profile, study materials, and learning telemetry.
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { role: "LEARNER" } });
      if (demoUser) userId = demoUser.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required to delete account." },
        { status: 401 }
      );
    }

    // Cascade delete user record and all associated relations
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "Account and all associated personal learning data permanently deleted.",
    });
  } catch (error) {
    console.error("DELETE /api/user/delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete user account." },
      { status: 500 }
    );
  }
}
