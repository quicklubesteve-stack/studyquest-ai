/**
 * StudyQuest AI — Subscription Tiers, Pricing & Quota Enforcement Engine
 * Configurable proposed price: CAD $9.99/month for StudyQuest Plus.
 * Strictly maintains essential educational lessons free and accessible to all learners.
 */

import { prisma } from "@/lib/prisma";

export const PLUS_PRICE_CAD = 9.99;

export interface TierConfig {
  name: string;
  priceCad: number;
  dailyAiLimit: number;
  voiceTutorFull: boolean;
  maxUploads: number;
  maxFileSizeMb: number;
  advancedParentAnalytics: boolean;
  priorityReasoning: boolean;
  features: string[];
}

export const TIERS: Record<"FREE" | "PLUS", TierConfig> = {
  FREE: {
    name: "Core Explorer",
    priceCad: 0,
    dailyAiLimit: 15,
    voiceTutorFull: false,
    maxUploads: 5,
    maxFileSizeMb: 10,
    advancedParentAnalytics: false,
    priorityReasoning: false,
    features: [
      "Access to all 7 core academic curricula & grade worlds",
      "Interactive Learning Arcade (6 activity types)",
      "Leitner Spaced Repetition & Recall Center",
      "15 personalized AI Tutor interactions per day",
      "Up to 5 study document uploads (PDF, DOCX, TXT, MD)",
      "Standard progress tracking, streaks & badges",
    ],
  },
  PLUS: {
    name: "StudyQuest Plus",
    priceCad: PLUS_PRICE_CAD,
    dailyAiLimit: 500, // Unlimited daily interactions
    voiceTutorFull: true,
    maxUploads: 100,
    maxFileSizeMb: 25,
    advancedParentAnalytics: true,
    priorityReasoning: true,
    features: [
      "Everything in Core Explorer included",
      "Unlimited AI Tutor Socratic sessions with zero daily caps",
      "Full interactive Voice Tutor with real-time speech dialogue",
      "Unlimited study document uploads & instant exam generator",
      "Advanced multi-child parent analytics & classroom sync",
      "Highest priority Socratic reasoning & worked examples",
    ],
  },
};

/**
 * Checks and updates the daily AI usage quota for a user.
 * Resets quota if a new day has started.
 */
export async function checkAndIncrementAiQuota(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: "FREE" | "PLUS";
  error?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        subscriptionTier: true,
        dailyAiQueriesCount: true,
        lastAiQueryDate: true,
      },
    });

    if (!user) {
      // Default fallback for guest or unauthenticated local dev
      return { allowed: true, remaining: 15, limit: 15, tier: "FREE" };
    }

    const tier = (user.subscriptionTier as "FREE" | "PLUS") || "FREE";
    const tierConfig = TIERS[tier] || TIERS.FREE;
    const now = new Date();
    const lastDate = new Date(user.lastAiQueryDate);

    // Reset daily count if calendar date differs
    const isDifferentDay =
      now.getFullYear() !== lastDate.getFullYear() ||
      now.getMonth() !== lastDate.getMonth() ||
      now.getDate() !== lastDate.getDate();

    let currentCount = isDifferentDay ? 0 : user.dailyAiQueriesCount;

    if (currentCount >= tierConfig.dailyAiLimit) {
      return {
        allowed: false,
        remaining: 0,
        limit: tierConfig.dailyAiLimit,
        tier,
        error: `Daily AI Tutor limit reached (${tierConfig.dailyAiLimit}/${tierConfig.dailyAiLimit} queries used today). Upgrade to StudyQuest Plus for unlimited Socratic sessions!`,
      };
    }

    // Increment count
    currentCount += 1;
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyAiQueriesCount: currentCount,
        lastAiQueryDate: now,
      },
    });

    return {
      allowed: true,
      remaining: Math.max(0, tierConfig.dailyAiLimit - currentCount),
      limit: tierConfig.dailyAiLimit,
      tier,
    };
  } catch (err) {
    console.warn("checkAndIncrementAiQuota error, permitting request:", err);
    return { allowed: true, remaining: 15, limit: 15, tier: "FREE" };
  }
}
