"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LessonViewer } from "@/components/lesson/LessonViewer";

export default function Home() {
  const { profile, activeLesson, isHydrated } = useAppStore();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Avoid flash before hydration completes
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-quest-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading StudyQuest AI...
          </p>
        </div>
      </div>
    );
  }

  const needsOnboarding = !profile.isOnboarded;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onOpenOnboarding={() => setShowOnboardingModal(true)} />

      <main id="main-content" className="flex-1 flex flex-col">
        {activeLesson ? (
          <LessonViewer lesson={activeLesson} />
        ) : (
          <Dashboard onOpenOnboarding={() => setShowOnboardingModal(true)} />
        )}
      </main>

      {(needsOnboarding || showOnboardingModal) && (
        <OnboardingWizard onComplete={() => setShowOnboardingModal(false)} />
      )}

      <Footer />
    </div>
  );
}
