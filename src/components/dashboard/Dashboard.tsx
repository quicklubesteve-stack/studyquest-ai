"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { SAMPLE_CURRICULUM } from "@/curriculum/data";
import { Lesson, EducationTier } from "@/types";
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Bot,
  Zap,
  Target,
  Layers,
  Crown,
  Search,
  Gamepad2,
} from "lucide-react";
import { AITutorModal } from "@/components/tutor/AITutorModal";
import { ActivityHubModal } from "@/components/activities/ActivityHubModal";
import { SpacedRepetitionCenterModal } from "@/components/activities/SpacedRepetitionCenterModal";
import StudyMaterialsModal from "@/components/materials/StudyMaterialsModal";

export function Dashboard({ onOpenOnboarding }: { onOpenOnboarding?: () => void }) {
  const { profile, progress, setActiveLesson, a11y, recordActivity } = useAppStore();
  const [selectedTierFilter, setSelectedTierFilter] = useState<EducationTier | "all">(
    profile.educationTier
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showTutor, setShowTutor] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showActivityHub, setShowActivityHub] = useState(false);
  const [showSpacedRepModal, setShowSpacedRepModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);

  // Identify next or first lesson to "Continue Learning"
  const allLessons: Lesson[] = SAMPLE_CURRICULUM.flatMap((cat) => cat.lessons);
  const uncompletedLesson =
    allLessons.find((l) => !progress.completedLessonIds.includes(l.id)) || allLessons[0];

  // Filter subjects by tier & search query
  const filteredCategories = SAMPLE_CURRICULUM.filter((cat) => {
    const matchesTier = selectedTierFilter === "all" || cat.tier === selectedTierFilter;
    const matchesSearch =
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.lessons.some((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTier && matchesSearch;
  });

  // Calculate daily goal progress
  const dailyPercent = Math.min(
    100,
    Math.round(((progress.completedLessonIds.length * 10) / profile.dailyStudyMinutes) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Welcome Banner & Age-Adapted Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-quest-700 via-indigo-700 to-violet-800 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-quest-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {profile.name}!</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Learn Your Way. Play Your Way. Grow Every Day.
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-quest-100 leading-relaxed max-w-xl">
            You're currently in the{" "}
            <strong className="text-white capitalize">
              {profile.educationTier.replace("_", " ")}
            </strong>{" "}
            learning world with a{" "}
            <strong className="text-white capitalize">{profile.learningPreference}</strong>{" "}
            focus. Let's conquer today's quest!
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveLesson(uncompletedLesson)}
              className="px-6 py-3 bg-white text-quest-900 hover:bg-quest-50 font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center space-x-2 focus:ring-2 focus:ring-white"
            >
              <Zap className="w-4 h-4 text-quest-600 fill-quest-600" />
              <span>Resume Current Quest: {uncompletedLesson.title.split(":")[0]}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowTutor(true)}
              className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md transition flex items-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </button>

            <button
              onClick={() => setShowActivityHub(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <Gamepad2 className="w-4 h-4 text-slate-900" />
              <span>Learning Arcade</span>
            </button>

            <button
              onClick={() => setShowMaterialsModal(true)}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>Study Notes Studio</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row: Daily Mission, Streak, Mastery Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Today's Mission */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-quest-600" />
              <span>Today's Mission</span>
            </span>
            <span className="text-xs font-bold text-quest-700 bg-quest-50 px-2.5 py-0.5 rounded-full">
              {profile.dailyStudyMinutes} min goal
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-black text-slate-900">{dailyPercent}%</span>
              <span className="text-xs text-slate-500 font-semibold">
                {progress.completedLessonIds.length} lessons finished
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-quest-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            Complete 1 more lesson to hit today's study target and extend your streak!
          </p>
        </div>

        {/* Card 2: Streak & Level */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Study Streak</span>
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Level {progress.level}
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span>{progress.streakDays} Days</span>
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Total XP: <strong>{progress.xp}</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Next Level Unlocks:</span>
            <span className="font-bold text-indigo-600">Advanced Badges</span>
          </div>
        </div>

        {/* Card 3: Spaced Repetition Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Spaced Repetition</span>
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Active Recall
            </span>
          </div>

          <div>
            <div className="text-2xl font-black text-slate-900">
              {Object.keys(progress.topicMasteries).length} Topics
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic Leitner box algorithm schedules optimal reviews before memory fades.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Active Recall:</span>
            <button
              onClick={() => setShowSpacedRepModal(true)}
              className="font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition"
            >
              Start Recall Drill →
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Catalog Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Curriculum & Learning Quests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Extensible modular curriculum spanning kindergarten through senior university levels.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-quest-500 transition"
            />
          </div>
        </div>

        {/* Tier Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs">
          {[
            { id: "all", label: "All Tiers" },
            { id: "kindergarten", label: "Kindergarten" },
            { id: "elementary", label: "Elementary" },
            { id: "high_school", label: "High School" },
            { id: "college", label: "College / University" },
            { id: "adult", label: "Adult & Senior" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTierFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition ${
                selectedTierFilter === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subject Categories & Lessons Grid */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-quest-50 text-quest-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{category.title}</h3>
                    <p className="text-xs text-slate-500">{category.description}</p>
                  </div>
                </div>

                <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {category.tier.replace("_", " ")}
                </span>
              </div>

              {/* Lessons within category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.lessons.map((lesson) => {
                  const isCompleted = progress.completedLessonIds.includes(lesson.id);
                  const mastery = progress.topicMasteries[lesson.id];

                  return (
                    <div
                      key={lesson.id}
                      className="border border-slate-200 hover:border-quest-500 rounded-xl p-5 transition bg-slate-50/50 hover:bg-white flex flex-col justify-between group shadow-sm hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] font-bold text-quest-600 uppercase tracking-wider">
                            {lesson.courseTitle}
                          </span>
                          {isCompleted ? (
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mastered</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>~{lesson.estimatedMinutes}m</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-1 group-hover:text-quest-700 transition">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {lesson.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        {mastery ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${mastery.masteryPercentage}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">
                              {mastery.masteryPercentage}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Not started yet</span>
                        )}

                        <button
                          onClick={() => setActiveLesson(lesson)}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-quest-600 group-hover:bg-quest-700 text-white shadow-sm flex items-center space-x-1 transition"
                        >
                          <span>{isCompleted ? "Review Quest" : "Start Quest"}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Tier Callout (Free vs Plus CAD $9.99/mo) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>StudyQuest Plus Membership (Configured: CAD $9.99/mo)</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Supercharge Your Learning Adventure with Plus
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All core lessons, games, quizzes, and spaced repetition remain <strong>100% Free</strong>. StudyQuest Plus unlocks real-time voice tutoring, personal study document uploads (PDF/DOCX), and multi-child family dashboards.
          </p>
        </div>

        <button
          onClick={() => setShowPricingModal(true)}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition shrink-0"
        >
          View Plans & Features
        </button>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">StudyQuest Plans</h3>
                <p className="text-xs text-slate-500">
                  Transparent, non-coercive pricing. Essential education is always free.
                </p>
              </div>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Free Plan */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <div>
                  <h4 className="font-black text-base text-slate-900">Core Explorer</h4>
                  <div className="text-2xl font-black text-slate-900 mt-1">Free Forever</div>
                  <p className="text-xs text-slate-500">Everything needed to learn and excel.</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>✓ Complete access to all 7+ sample grade subjects</li>
                  <li>✓ Interactive quizzes, games & activities</li>
                  <li>✓ Spaced repetition & Leitner box review</li>
                  <li>✓ Standard AI Socratic hints</li>
                  <li>✓ WCAG 2.2 AA accessibility tools</li>
                </ul>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg text-center">
                  Current Active Plan
                </div>
              </div>

              {/* Plus Plan */}
              <div className="border-2 border-quest-600 rounded-2xl p-5 space-y-4 bg-quest-50/30">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-base text-quest-900">StudyQuest Plus</h4>
                    <span className="text-[10px] font-bold bg-quest-600 text-white px-2 py-0.5 rounded-full">
                      Proposed
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    CAD $9.99 <span className="text-xs text-slate-500 font-normal">/ month</span>
                  </div>
                  <p className="text-xs text-slate-500">For accelerated, power learners & families.</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>✓ Everything in Core Explorer</li>
                  <li>✓ Advanced conversational voice tutor</li>
                  <li>✓ Upload PDF & DOCX notes for instant study packs</li>
                  <li>✓ Deep multi-child parent analytics</li>
                  <li>✓ Highest priority AI reasoning</li>
                </ul>
                <button
                  onClick={() => {
                    alert("Stripe Test Mode Integration is scheduled for Phase 6. All features remain open during Phase 1 testing!");
                    setShowPricingModal(false);
                  }}
                  className="w-full py-2 bg-quest-600 hover:bg-quest-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Explore in Test Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor Modal */}
      {showTutor && <AITutorModal onClose={() => setShowTutor(false)} />}

      {/* Learning Arcade Modal */}
      {showActivityHub && <ActivityHubModal onClose={() => setShowActivityHub(false)} />}

      {/* Spaced Repetition Center Modal */}
      {showSpacedRepModal && <SpacedRepetitionCenterModal onClose={() => setShowSpacedRepModal(false)} />}

      {/* Study Materials & Document Intelligence Modal */}
      {showMaterialsModal && (
        <StudyMaterialsModal
          isOpen={showMaterialsModal}
          onClose={() => setShowMaterialsModal(false)}
          educationTier={profile.educationTier}
          onEarnXP={(amount) => recordActivity(amount)}
        />
      )}
    </div>
  );
}
