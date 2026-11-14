"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { SAMPLE_FLASHCARDS } from "@/curriculum/data/activities";
import { FlashcardChallengeActivity } from "./FlashcardChallengeActivity";
import {
  X,
  Sparkles,
  Calendar,
  Flame,
  Award,
  Layers,
  ArrowRight,
  BookOpen,
  CheckCircle,
} from "lucide-react";

export function SpacedRepetitionCenterModal({ onClose }: { onClose: () => void }) {
  const { progress, profile } = useAppStore();
  const [activeTab, setActiveTab] = useState<"review" | "boxes">("review");

  // Determine cards due for review based on Leitner scheduling
  const dueCards = SAMPLE_FLASHCARDS;

  const boxCounts = {
    box1: dueCards.filter((c) => c.boxLevel === 1).length,
    box2: dueCards.filter((c) => c.boxLevel === 2).length,
    box3: dueCards.filter((c) => c.boxLevel === 3).length,
    box4: dueCards.filter((c) => c.boxLevel >= 4).length,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spaced-rep-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-quest-700 to-violet-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 id="spaced-rep-title" className="font-black text-base sm:text-lg flex items-center space-x-2">
                <span>Spaced Repetition & Recall Center</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                  Leitner Box System
                </span>
              </h3>
              <p className="text-xs text-indigo-100">
                Scientifically scheduled reviews for permanent long-term memory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close Spaced Repetition Center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex space-x-1">
          <button
            onClick={() => setActiveTab("review")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeTab === "review"
                ? "bg-white text-quest-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-quest-600" />
            <span>Active Review Queue ({dueCards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("boxes")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeTab === "boxes"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Memory Box Stats</span>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "review" ? (
            <FlashcardChallengeActivity cards={dueCards} />
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed space-y-1">
                <span className="font-black block text-sm">How Leitner Spaced Repetition Works:</span>
                <p>
                  Every time you recall a card correctly, it advances to the next box and is reviewed less frequently. If you struggle, it returns to Box 1 for rapid reinforcement!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-600 block">Box 1 (Daily)</span>
                  <span className="text-xl font-black text-rose-900">{boxCounts.box1}</span>
                  <span className="text-[10px] text-rose-500 block">New / Tricky</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">Box 2 (Every 3d)</span>
                  <span className="text-xl font-black text-amber-900">{boxCounts.box2}</span>
                  <span className="text-[10px] text-amber-600 block">Developing</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Box 3 (Every 7d)</span>
                  <span className="text-xl font-black text-emerald-900">{boxCounts.box3}</span>
                  <span className="text-[10px] text-emerald-600 block">Solid</span>
                </div>
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-violet-600 block">Box 4 (Every 14d)</span>
                  <span className="text-xl font-black text-violet-900">{boxCounts.box4}</span>
                  <span className="text-[10px] text-violet-600 block">Mastered ⭐</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab("review")}
                  className="px-5 py-2.5 bg-quest-600 hover:bg-quest-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
                >
                  <span>Start Practice Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
