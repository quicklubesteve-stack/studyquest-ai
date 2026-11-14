import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TIERS } from "@/lib/billing/tierLimits";

export const dynamic = "force-dynamic";

/**
 * GET /api/billing/status
 * Returns user subscription status, daily quota usage, and limits.
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
      return NextResponse.json({
        tier: "FREE",
        tierConfig: TIERS.FREE,
        dailyUsed: 0,
        dailyRemaining: TIERS.FREE.dailyAiLimit,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        dailyAiQueriesCount: true,
        lastAiQueryDate: true,
      },
    });

    const tier = (user?.subscriptionTier as "FREE" | "PLUS") || "FREE";
    const tierConfig = TIERS[tier] || TIERS.FREE;
    const dailyUsed = user?.dailyAiQueriesCount || 0;
    const dailyRemaining = Math.max(0, tierConfig.dailyAiLimit - dailyUsed);

    return NextResponse.json({
      tier,
      tierConfig,
      status: user?.subscriptionStatus || "active",
      dailyUsed,
      dailyRemaining,
    });
  } catch (error) {
    console.error("GET /api/billing/status error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve billing status" },
      { status: 500 }
    );
  }
}
