"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  UserProfile,
  UserProgress,
  AccessibilitySettings,
  Lesson,
  TopicMastery,
  EducationTier,
  LearningPreference,
  GoalType,
} from "@/types";
import { evaluateAttempt, evaluateStreak, calculateLevel } from "@/lib/engine/scoring";
import { SAMPLE_CURRICULUM } from "@/curriculum/data";

const STORAGE_KEYS = {
  PROFILE: "studyquest_user_profile_v1",
  PROGRESS: "studyquest_user_progress_v1",
  A11Y: "studyquest_a11y_settings_v1",
};

const DEFAULT_PROFILE: UserProfile = {
  id: "guest-learner",
  name: "Adventurous Learner",
  educationTier: "elementary",
  selectedSubjects: ["elem-math", "middle-science"],
  learningGoal: "skill_building",
  dailyStudyMinutes: 15,
  learningPreference: "mixed",
  wantsPlacementQuiz: false,
  isOnboarded: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString(),
  todayMinutesSpent: 0,
  completedLessonIds: [],
  topicMasteries: {},
  achievements: [
    {
      id: "first_step",
      title: "First Steps",
      description: "Began your learning journey on StudyQuest AI",
      icon: "Compass",
      unlockedAt: new Date().toISOString(),
    },
  ],
};

const DEFAULT_A11Y: AccessibilitySettings = {
  highContrast: false,
  textScale: "normal",
  reducedMotion: false,
  speechRate: 1.0,
  audioEnabled: true,
};

interface AppContextType {
  profile: UserProfile;
  progress: UserProgress;
  a11y: AccessibilitySettings;
  activeLesson: Lesson | null;
  isHydrated: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateA11y: (updates: Partial<AccessibilitySettings>) => void;
  recordQuestionAttempt: (
    lessonId: string,
    lessonTitle: string,
    subjectId: string,
    isCorrect: boolean,
    hintsUsed: number
  ) => { earnedXP: number; newMastery: number };
  completeLesson: (lessonId: string) => void;
  setActiveLesson: (lesson: Lesson | null) => void;
  resetAllProgress: () => void;
  exportData: () => string;
  loadSampleLessonById: (lessonId: string) => Lesson | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [a11y, setA11y] = useState<AccessibilitySettings>(DEFAULT_A11Y);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  let session: any = null;
  try {
    const sessionRes = useSession();
    session = sessionRes?.data;
  } catch (e) {
    // Graceful fallback for unit test setups without SessionProvider
  }

  // Sync from remote database on login
  useEffect(() => {
    if (!session?.user) return;

    async function loadRemoteSync() {
      try {
        const res = await fetch("/api/sync");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile((prev) => ({
              ...prev,
              name: data.user.name,
              educationTier: data.profile.educationTier as any,
              learningPreference: data.profile.learningPreference as any,
              dailyStudyMinutes: data.profile.dailyStudyMinutes,
              learningGoal: data.profile.learningGoal as any,
              isOnboarded: true,
            }));
          }
          if (data.progress) {
            setProgress((prev) => ({
              ...prev,
              xp: data.progress.xp,
              level: data.progress.level,
              streakDays: data.progress.streakDays,
              completedLessonIds: data.progress.completedLessonIds || [],
              achievements: data.progress.achievements || prev.achievements,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not sync remote progress:", err);
      }
    }

    loadRemoteSync();
  }, [session?.user?.email]);

  // Debounced sync to database when user is authenticated
  useEffect(() => {
    if (!isHydrated || !session?.user) return;

    const timer = setTimeout(async () => {
      try {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            progress,
            topicMasteries: progress.topicMasteries,
          }),
        });
      } catch (e) {
        // Silent background sync error
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [progress, profile, isHydrated, session?.user]);

  // Hydrate state from localStorage safely on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const savedA11y = localStorage.getItem(STORAGE_KEYS.A11Y);

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      if (savedProgress) {
        const parsedProg: UserProgress = JSON.parse(savedProgress);
        // Refresh streak based on current date
        const todayStr = new Date().toISOString().split("T")[0];
        const updatedStreak = evaluateStreak(
          parsedProg.streakDays,
          parsedProg.lastActiveDate,
          todayStr
        );
        setProgress({
          ...parsedProg,
          streakDays: updatedStreak,
          lastActiveDate: new Date().toISOString(),
        });
      }
      if (savedA11y) {
        setA11y(JSON.parse(savedA11y));
      }
    } catch (err) {
      console.warn("Storage hydration notice (using defaults):", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync state to localStorage on updates
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error("Failed saving profile:", err);
    }
  }, [profile, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (err) {
      console.error("Failed saving progress:", err);
    }
  }, [progress, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.A11Y, JSON.stringify(a11y));
    } catch (err) {
      console.error("Failed saving accessibility settings:", err);
    }
  }, [a11y, isHydrated]);

  // Apply a11y classes to body document
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (a11y.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    if (a11y.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    root.classList.remove("text-scale-normal", "text-scale-large", "text-scale-xlarge");
    root.classList.add(`text-scale-${a11y.textScale}`);
  }, [a11y]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateA11y = (updates: Partial<AccessibilitySettings>) => {
    setA11y((prev) => ({ ...prev, ...updates }));
  };

  const recordQuestionAttempt = (
    lessonId: string,
    lessonTitle: string,
    subjectId: string,
    isCorrect: boolean,
    hintsUsed: number
  ) => {
    const existingMastery = progress.topicMasteries[lessonId];
    const score = evaluateAttempt(
      existingMastery,
      lessonId,
      lessonTitle,
      subjectId,
      isCorrect,
      hintsUsed
    );

    const updatedTotalXP = progress.xp + score.earnedXP;
    const { level } = calculateLevel(updatedTotalXP);

    const updatedMastery: TopicMastery = {
      lessonId,
      title: lessonTitle,
      subjectId,
      masteryPercentage: score.newMasteryPercentage,
      lastPracticed: new Date().toISOString(),
      nextReviewDate: score.nextReviewDate,
      attemptsCount: (existingMastery?.attemptsCount || 0) + 1,
      boxLevel: score.newBoxLevel,
    };

    setProgress((prev) => ({
      ...prev,
      xp: updatedTotalXP,
      level,
      topicMasteries: {
        ...prev.topicMasteries,
        [lessonId]: updatedMastery,
      },
    }));

    return { earnedXP: score.earnedXP, newMastery: score.newMasteryPercentage };
  };

  const completeLesson = (lessonId: string) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];

      const bonusXP = alreadyCompleted ? 20 : 100;
      const totalXP = prev.xp + bonusXP;
      const { level } = calculateLevel(totalXP);

      // Check for first lesson achievement
      let achievements = [...prev.achievements];
      if (!achievements.some((a) => a.id === "first_lesson_done")) {
        achievements.push({
          id: "first_lesson_done",
          title: "Quest Initiated!",
          description: "Completed your first interactive lesson.",
          icon: "Award",
          unlockedAt: new Date().toISOString(),
        });
      }

      return {
        ...prev,
        xp: totalXP,
        level,
        completedLessonIds: newCompleted,
        achievements,
      };
    });
  };

  const resetAllProgress = () => {
    setProfile(DEFAULT_PROFILE);
    setProgress(DEFAULT_PROGRESS);
    setA11y(DEFAULT_A11Y);
    setActiveLesson(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.A11Y);
    } catch (e) {
      console.warn("Storage reset exception:", e);
    }
  };

  const exportData = (): string => {
    return JSON.stringify(
      {
        profile,
        progress,
        a11y,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const loadSampleLessonById = (lessonId: string): Lesson | undefined => {
    for (const cat of SAMPLE_CURRICULUM) {
      const match = cat.lessons.find((l) => l.id === lessonId);
      if (match) return match;
    }
    return undefined;
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        progress,
        a11y,
        activeLesson,
        isHydrated,
        updateProfile,
        updateA11y,
        recordQuestionAttempt,
        completeLesson,
        setActiveLesson,
        resetAllProgress,
        exportData,
        loadSampleLessonById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
