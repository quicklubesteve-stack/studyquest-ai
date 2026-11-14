"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Sparkles, Flame, Award, BookOpen, User, RefreshCw, Bot } from "lucide-react";
import { AITutorModal } from "@/components/tutor/AITutorModal";

export function Header({ onOpenOnboarding }: { onOpenOnboarding?: () => void }) {
  const { profile, progress, setActiveLesson, resetAllProgress } = useAppStore();
  const [showTutor, setShowTutor] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Slogan */}
          <button
            onClick={() => setActiveLesson(null)}
            className="flex items-center space-x-3 text-left focus:outline-none focus:ring-2 focus:ring-quest-500 rounded-lg p-1"
            title="Return to StudyQuest Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-quest-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-quest-700 to-indigo-700 bg-clip-text text-transparent">
                StudyQuest AI
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Learn Your Way. Play Your Way. Grow Every Day.
              </p>
            </div>
          </button>

          {/* Gamification Stats: Streak, XP, Level, AI Tutor & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Streak Counter */}
            <div
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold"
              title={`${progress.streakDays} day study streak!`}
              aria-label={`Streak: ${progress.streakDays} days`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{progress.streakDays}d</span>
            </div>

            {/* Total XP & Level */}
            <div
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full text-xs font-bold"
              title={`Level ${progress.level} (${progress.xp} XP total)`}
              aria-label={`Level ${progress.level}, ${progress.xp} experience points`}
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Lvl {progress.level}</span>
              <span className="text-indigo-400 hidden md:inline">|</span>
              <span className="text-indigo-600 hidden md:inline">{progress.xp} XP</span>
            </div>

            {/* Quick AI Companion Trigger */}
            <button
              onClick={() => setShowTutor(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-quest-600 text-white rounded-full text-xs font-bold shadow-sm hover:from-violet-700 hover:to-quest-700 transition focus:outline-none focus:ring-2 focus:ring-violet-400"
              title="Open AI Study Companion"
              aria-label="Open AI Study Companion"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI Tutor</span>
            </button>

            {/* Account Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-700 border border-slate-200 transition focus:outline-none focus:ring-2 focus:ring-quest-500"
                aria-label="User Account Settings"
                aria-expanded={showSettingsDropdown}
              >
                <User className="w-4 h-4" />
              </button>

              {showSettingsDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{profile.name}</p>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {profile.educationTier.replace("_", " ")} • {profile.learningPreference}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowSettingsDropdown(false);
                      onOpenOnboarding?.();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-quest-50 flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4 text-quest-600" />
                    <span>Change Learning Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowSettingsDropdown(false);
                      if (confirm("Reset all progress, streaks, and preferences to start fresh?")) {
                        resetAllProgress();
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4 text-rose-500" />
                    <span>Reset All Data</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* AI Tutor Modal */}
      {showTutor && <AITutorModal onClose={() => setShowTutor(false)} />}
    </>
  );
}
