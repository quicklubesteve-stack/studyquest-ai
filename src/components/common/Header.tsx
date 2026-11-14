"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  User,
  RefreshCw,
  Bot,
  LogIn,
  LogOut,
  ShieldCheck,
  Users,
  ShieldAlert,
} from "lucide-react";
import { AITutorModal } from "@/components/tutor/AITutorModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { ParentPortalModal } from "@/components/portals/ParentPortalModal";
import { TeacherPortalModal } from "@/components/portals/TeacherPortalModal";
import { AdminPortalModal } from "@/components/portals/AdminPortalModal";

export function Header({ onOpenOnboarding }: { onOpenOnboarding?: () => void }) {
  const { data: session } = useSession();
  const { profile, progress, setActiveLesson, resetAllProgress } = useAppStore();

  const [showTutor, setShowTutor] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showParentPortal, setShowParentPortal] = useState(false);
  const [showTeacherPortal, setShowTeacherPortal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const userRole = (session?.user as any)?.role || "GUEST";
  const userName = session?.user?.name || profile.name;

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

          {/* Gamification Stats, Role Portals & Authentication */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Streak Counter */}
            <div
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold shrink-0"
              title={`${progress.streakDays} day study streak!`}
              aria-label={`Streak: ${progress.streakDays} days`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{progress.streakDays}d</span>
            </div>

            {/* Total XP & Level (hidden on narrow screens to avoid wrapping) */}
            <div
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full text-xs font-bold shrink-0"
              title={`Level ${progress.level} (${progress.xp} XP total)`}
              aria-label={`Level ${progress.level}, ${progress.xp} experience points`}
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Lvl {progress.level}</span>
              <span className="text-indigo-400 hidden md:inline">|</span>
              <span className="text-indigo-600 hidden md:inline">{progress.xp} XP</span>
            </div>

            {/* Role-Specific Portal Shortcut Buttons */}
            {userRole === "PARENT" && (
              <button
                onClick={() => setShowParentPortal(true)}
                className="px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-sm transition flex items-center space-x-1 shrink-0"
                title="Open Parent Supervision Portal"
                aria-label="Parent Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Parent Portal</span>
              </button>
            )}

            {userRole === "TEACHER" && (
              <button
                onClick={() => setShowTeacherPortal(true)}
                className="px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold shadow-sm transition flex items-center space-x-1 shrink-0"
                title="Open Teacher Classroom Portal"
                aria-label="Classroom Portal"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Classrooms</span>
              </button>
            )}

            {userRole === "ADMIN" && (
              <button
                onClick={() => setShowAdminPortal(true)}
                className="px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-sm transition flex items-center space-x-1 shrink-0"
                title="Open Admin Console"
                aria-label="Admin Portal"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Quick AI Companion Trigger */}
            <button
              onClick={() => setShowTutor(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-violet-600 to-quest-600 text-white rounded-full text-xs font-bold shadow-sm hover:from-violet-700 hover:to-quest-700 transition focus:outline-none focus:ring-2 focus:ring-violet-400 shrink-0"
              title="Ask AI"
              aria-label="Ask AI"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Sign In button or Profile Menu */}
            {!session ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-quest-600 text-quest-700 hover:bg-quest-50 rounded-full text-xs font-bold transition shadow-sm shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full hover:bg-slate-100 text-slate-800 border border-slate-200 transition focus:outline-none focus:ring-2 focus:ring-quest-500 text-xs font-bold"
                  aria-label="User Account Settings"
                  aria-expanded={showSettingsDropdown}
                >
                  <User className="w-3.5 h-3.5 text-quest-600" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{userName}</span>
                </button>

                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{session.user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-black px-2 py-0.5 rounded bg-quest-100 text-quest-800">
                        {userRole} Account
                      </span>
                    </div>

                    {userRole === "PARENT" && (
                      <button
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          setShowParentPortal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 flex items-center space-x-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Parent Portal</span>
                      </button>
                    )}

                    {userRole === "TEACHER" && (
                      <button
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          setShowTeacherPortal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-amber-50 flex items-center space-x-2"
                      >
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>Teacher Classroom</span>
                      </button>
                    )}

                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          setShowAdminPortal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-cyan-600" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        onOpenOnboarding?.();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-quest-50 flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4 text-quest-600" />
                      <span>Learning Preferences</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      <span>Sign Out</span>
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
                      <span>Reset Local Data</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {showTutor && <AITutorModal onClose={() => setShowTutor(false)} />}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {showParentPortal && <ParentPortalModal onClose={() => setShowParentPortal(false)} />}
      {showTeacherPortal && <TeacherPortalModal onClose={() => setShowTeacherPortal(false)} />}
      {showAdminPortal && <AdminPortalModal onClose={() => setShowAdminPortal(false)} />}
    </>
  );
}
