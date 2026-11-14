import { TopicMastery } from "@/types";

export interface ScoreResult {
  earnedXP: number;
  isCorrect: boolean;
  hintsUsed: number;
  newMasteryPercentage: number;
  newBoxLevel: number;
  nextReviewDate: string;
}

export const BASE_QUESTION_XP = 50;
export const HINT_PENALTY_XP = 12;
export const MIN_QUESTION_XP = 15;

/**
 * Deterministic XP calculator based on attempts and hints.
 * Guarantees consistent rewards without non-deterministic swings.
 */
export function calculateQuestionXP(isCorrect: boolean, hintsUsed: number): number {
  if (!isCorrect) return 0;
  const penalizedXP = BASE_QUESTION_XP - hintsUsed * HINT_PENALTY_XP;
  return Math.max(MIN_QUESTION_XP, penalizedXP);
}

/**
 * Calculates current user level from cumulative XP.
 * Standard RPG quadratic curve: Level N requires 100 * N^1.5 XP.
 */
export function calculateLevel(totalXP: number): { level: number; progressPercent: number; xpForNextLevel: number } {
  if (totalXP <= 0) return { level: 1, progressPercent: 0, xpForNextLevel: 100 };

  let level = 1;
  let requiredXP = 100;
  let previousThreshold = 0;

  while (totalXP >= requiredXP) {
    level++;
    previousThreshold = requiredXP;
    requiredXP = Math.round(100 * Math.pow(level, 1.5));
  }

  const currentLevelProgress = totalXP - previousThreshold;
  const currentLevelSpan = requiredXP - previousThreshold;
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / currentLevelSpan) * 100));

  return {
    level,
    progressPercent,
    xpForNextLevel: requiredXP,
  };
}

/**
 * Leitner spaced repetition interval calculator in days.
 */
export function getLeitnerIntervalDays(boxLevel: number): number {
  switch (boxLevel) {
    case 1:
      return 1;
    case 2:
      return 3;
    case 3:
      return 7;
    case 4:
      return 14;
    case 5:
    default:
      return 30;
  }
}

/**
 * Calculates next ISO review date based on box level.
 */
export function calculateNextReviewDate(boxLevel: number, fromDate: Date = new Date()): string {
  const days = getLeitnerIntervalDays(boxLevel);
  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
}

/**
 * Evaluates a lesson or quiz attempt and updates mastery deterministically.
 */
export function evaluateAttempt(
  currentMastery: TopicMastery | undefined,
  lessonId: string,
  title: string,
  subjectId: string,
  isCorrect: boolean,
  hintsUsed: number,
  now: Date = new Date()
): ScoreResult {
  const current = currentMastery || {
    lessonId,
    title,
    subjectId,
    masteryPercentage: 0,
    lastPracticed: now.toISOString(),
    nextReviewDate: calculateNextReviewDate(1, now),
    attemptsCount: 0,
    boxLevel: 1,
  };

  const earnedXP = calculateQuestionXP(isCorrect, hintsUsed);

  let masteryDelta = 0;
  let newBoxLevel = current.boxLevel;

  if (isCorrect) {
    if (hintsUsed === 0) {
      masteryDelta = 25;
      newBoxLevel = Math.min(5, current.boxLevel + 1);
    } else if (hintsUsed === 1) {
      masteryDelta = 18;
      newBoxLevel = Math.min(5, current.boxLevel + 1);
    } else {
      masteryDelta = 10;
      // Box level stays the same with multiple hints
    }
  } else {
    masteryDelta = -10;
    newBoxLevel = 1; // Demote to Box 1 for immediate review
  }

  const newMasteryPercentage = Math.max(0, Math.min(100, current.masteryPercentage + masteryDelta));
  const nextReviewDate = calculateNextReviewDate(newBoxLevel, now);

  return {
    earnedXP,
    isCorrect,
    hintsUsed,
    newMasteryPercentage,
    newBoxLevel,
    nextReviewDate,
  };
}

/**
 * Evaluates streak progression across calendar days.
 */
export function evaluateStreak(
  currentStreak: number,
  lastActiveIso: string | undefined,
  todayDate: string // YYYY-MM-DD
): number {
  if (!lastActiveIso) {
    return 1;
  }

  const lastActiveDate = lastActiveIso.split("T")[0];
  if (lastActiveDate === todayDate) {
    return currentStreak; // Already logged today
  }

  const lastDate = new Date(lastActiveDate);
  const today = new Date(todayDate);
  const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return currentStreak + 1;
  } else if (diffDays > 1) {
    return 1; // Reset streak if missed days
  }

  return currentStreak;
}
