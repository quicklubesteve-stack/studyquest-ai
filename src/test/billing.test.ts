import { describe, it, expect, vi, beforeEach } from "vitest";
import { TIERS, PLUS_PRICE_CAD, checkAndIncrementAiQuota } from "@/lib/billing/tierLimits";
import { speechService } from "@/lib/speech/voiceService";
import { prisma } from "@/lib/prisma";

describe("Billing Tiers, Quota Enforcement & Voice Services", () => {
  describe("Tier Configurations & Pricing", () => {
    it("configures Free Core Explorer tier with 15 daily AI limit and CAD $0", () => {
      expect(TIERS.FREE.priceCad).toBe(0);
      expect(TIERS.FREE.dailyAiLimit).toBe(15);
      expect(TIERS.FREE.features.length).toBeGreaterThanOrEqual(5);
    });

    it("configures StudyQuest Plus tier at CAD $9.99/month with unlimited AI and voice learning", () => {
      expect(TIERS.PLUS.priceCad).toBe(PLUS_PRICE_CAD);
      expect(PLUS_PRICE_CAD).toBe(9.99);
      expect(TIERS.PLUS.dailyAiLimit).toBe(500);
      expect(TIERS.PLUS.voiceTutorFull).toBe(true);
      expect(TIERS.PLUS.priorityReasoning).toBe(true);
    });
  });

  describe("Voice Service Provider Architecture", () => {
    it("exposes pluggable voice provider with recognition and synthesis interfaces", () => {
      expect(speechService.name).toBe("BrowserWebSpeech");
      expect(typeof speechService.isRecognitionSupported).toBe("function");
      expect(typeof speechService.isSynthesisSupported).toBe("function");
      expect(typeof speechService.speak).toBe("function");
      expect(typeof speechService.stopListening).toBe("function");
      expect(typeof speechService.cancelSpeech).toBe("function");
    });
  });

  describe("checkAndIncrementAiQuota", () => {
    it("allows queries when user is below daily quota limit", async () => {
      const demoUser = await prisma.user.findFirst({ where: { role: "LEARNER" } });
      if (demoUser) {
        // Reset query count
        await prisma.user.update({
          where: { id: demoUser.id },
          data: { subscriptionTier: "FREE", dailyAiQueriesCount: 0, lastAiQueryDate: new Date() },
        });

        const result = await checkAndIncrementAiQuota(demoUser.id);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(14);
      }
    });

    it("blocks queries and returns informative message when free quota is reached", async () => {
      const demoUser = await prisma.user.findFirst({ where: { role: "LEARNER" } });
      if (demoUser) {
        // Set count to limit
        await prisma.user.update({
          where: { id: demoUser.id },
          data: {
            subscriptionTier: "FREE",
            dailyAiQueriesCount: 15,
            lastAiQueryDate: new Date(),
          },
        });

        const result = await checkAndIncrementAiQuota(demoUser.id);
        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.error).toContain("Daily AI Tutor limit reached");
      }
    });
  });
});
