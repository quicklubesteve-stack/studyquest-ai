import { describe, it, expect } from "vitest";
import {
  calculateQuestionXP,
  calculateLevel,
  getLeitnerIntervalDays,
  evaluateAttempt,
  evaluateStreak,
  BASE_QUESTION_XP,
  HINT_PENALTY_XP,
  MIN_QUESTION_XP,
} from "@/lib/engine/scoring";

describe("Deterministic Scoring & Adaptive Engine", () => {
  it("calculates XP accurately with 0 hints used", () => {
    const xp = calculateQuestionXP(true, 0);
    expect(xp).toBe(BASE_QUESTION_XP);
  });

  it("applies deterministic penalty for hints without dropping below minimum XP", () => {
    const xp1 = calculateQuestionXP(true, 1);
    expect(xp1).toBe(BASE_QUESTION_XP - HINT_PENALTY_XP);

    const xpManyHints = calculateQuestionXP(true, 5);
    expect(xpManyHints).toBe(MIN_QUESTION_XP);
  });

  it("awards 0 XP for incorrect answers", () => {
    expect(calculateQuestionXP(false, 0)).toBe(0);
    expect(calculateQuestionXP(false, 2)).toBe(0);
  });

  it("computes user RPG levels on progressive curve", () => {
    expect(calculateLevel(0).level).toBe(1);
    expect(calculateLevel(50).level).toBe(1);
    expect(calculateLevel(100).level).toBe(2);
    expect(calculateLevel(500).level).toBeGreaterThan(2);
  });

  it("schedules spaced repetition with Leitner box progression", () => {
    expect(getLeitnerIntervalDays(1)).toBe(1);
    expect(getLeitnerIntervalDays(2)).toBe(3);
    expect(getLeitnerIntervalDays(3)).toBe(7);
    expect(getLeitnerIntervalDays(4)).toBe(14);
    expect(getLeitnerIntervalDays(5)).toBe(30);
  });

  it("evaluates correct attempts by boosting mastery and promoting Leitner box", () => {
    const result = evaluateAttempt(
      undefined,
      "test-lesson",
      "Test Lesson",
      "test-subject",
      true,
      0,
      new Date("2026-11-14T12:00:00Z")
    );

    expect(result.earnedXP).toBe(50);
    expect(result.newMasteryPercentage).toBe(25);
    expect(result.newBoxLevel).toBe(2);
    expect(result.nextReviewDate).toBe(new Date("2026-11-17T12:00:00Z").toISOString());
  });

  it("evaluates incorrect attempts by reducing mastery and demoting to Box 1", () => {
    const existing = {
      lessonId: "test-lesson",
      title: "Test Lesson",
      subjectId: "test-subject",
      masteryPercentage: 40,
      lastPracticed: "2026-11-14T00:00:00Z",
      nextReviewDate: "2026-11-20T00:00:00Z",
      attemptsCount: 2,
      boxLevel: 3,
    };

    const result = evaluateAttempt(
      existing,
      "test-lesson",
      "Test Lesson",
      "test-subject",
      false,
      0,
      new Date("2026-11-14T12:00:00Z")
    );

    expect(result.earnedXP).toBe(0);
    expect(result.newMasteryPercentage).toBe(30);
    expect(result.newBoxLevel).toBe(1);
    expect(result.nextReviewDate).toBe(new Date("2026-11-15T12:00:00Z").toISOString());
  });

  it("tracks streaks reliably across dates", () => {
    // Same day activity preserves current streak
    expect(evaluateStreak(3, "2026-11-14T08:00:00Z", "2026-11-14")).toBe(3);

    // Consecutive day activity increments streak
    expect(evaluateStreak(3, "2026-11-13T10:00:00Z", "2026-11-14")).toBe(4);

    // Missed day resets streak to 1
    expect(evaluateStreak(5, "2026-11-10T10:00:00Z", "2026-11-14")).toBe(1);
  });
});
