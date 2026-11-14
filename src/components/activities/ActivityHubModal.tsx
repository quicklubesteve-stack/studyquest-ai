"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  SAMPLE_FLASHCARDS,
  SAMPLE_MATCHING_PAIRS,
  SAMPLE_FILL_BLANKS,
  SAMPLE_SEQUENCE_PUZZLES,
  SAMPLE_MEMORY_CARDS,
} from "@/curriculum/data/activities";
import { FlashcardChallengeActivity } from "./FlashcardChallengeActivity";
import { MatchingGameActivity } from "./MatchingGameActivity";
import { FillInTheBlankActivity } from "./FillInTheBlankActivity";
import { DragAndDropPuzzleActivity } from "./DragAndDropPuzzleActivity";
import { MemoryGameActivity } from "./MemoryGameActivity";
import { WordSearchActivity } from "./WordSearchActivity";
import {
  Gamepad2,
  X,
  Layers,
  Sparkles,
  Puzzle,
  Type,
  Split,
  Eye,
  Search,
  ArrowLeft,
  Award,
} from "lucide-react";

type ActivityType =
  | "menu"
  | "flashcards"
  | "matching"
  | "fill_blank"
  | "sequence"
  | "memory"
  | "word_search";

export function ActivityHubModal({ onClose }: { onClose: () => void }) {
  const { profile } = useAppStore();
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>("menu");
  const [fillBlankIndex, setFillBlankIndex] = useState(0);

  const activities = [
    {
      type: "flashcards" as ActivityType,
      title: "Flashcard Challenge",
      desc: "3D flip cards with active recall rating & spaced repetition scheduling.",
      icon: Layers,
      color: "from-amber-500 to-orange-500",
      badge: "Active Recall",
    },
    {
      type: "matching" as ActivityType,
      title: "Concept Matching Game",
      desc: "Connect vocabulary terms, science states, and fraction percentages.",
      icon: Split,
      color: "from-blue-500 to-indigo-600",
      badge: "Visual Pair",
    },
    {
      type: "fill_blank" as ActivityType,
      title: "Sentence Completion",
      desc: "Fill in missing key terms to solidify academic definitions.",
      icon: Type,
      color: "from-emerald-500 to-teal-600",
      badge: "Context Mastery",
    },
    {
      type: "sequence" as ActivityType,
      title: "Sequence & Logic Puzzle",
      desc: "Order steps of scientific experiments, AI loops, and fraction magnitudes.",
      icon: Puzzle,
      color: "from-purple-500 to-violet-600",
      badge: "Logical Order",
    },
    {
      type: "memory" as ActivityType,
      title: "Memory Card Match",
      desc: "Flip and uncover hidden concept pairs in the minimum number of turns.",
      icon: Eye,
      color: "from-rose-500 to-pink-600",
      badge: "Visual Memory",
    },
    {
      type: "word_search" as ActivityType,
      title: "Vocabulary Word Search",
      desc: "Hunt for curriculum keywords and reveal their definitions & phonetics.",
      icon: Search,
      color: "from-cyan-500 to-blue-600",
      badge: "Vocabulary",
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-hub-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-quest-700 via-indigo-700 to-violet-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedActivity !== "menu" && (
              <button
                onClick={() => setSelectedActivity("menu")}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                title="Back to Activities Menu"
                aria-label="Back to Activities Menu"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 id="activity-hub-title" className="font-black text-base sm:text-lg flex items-center space-x-2">
                <span>Interactive Learning Arcade</span>
                <span className="text-[10px] bg-emerald-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                  All Grades
                </span>
              </h3>
              <p className="text-xs text-indigo-100">
                Playful challenges, active recall, and sensory puzzles for all learning styles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close Activity Arcade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[78vh] overflow-y-auto">
          {selectedActivity === "menu" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.type}
                    onClick={() => setSelectedActivity(act.type)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-quest-400 bg-white hover:bg-slate-50 transition text-left space-y-2 group shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-quest-700 bg-quest-50 px-2 py-0.5 rounded-full border border-quest-200">
                        {act.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm group-hover:text-quest-700 transition">
                        {act.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{act.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedActivity === "flashcards" && (
            <FlashcardChallengeActivity cards={SAMPLE_FLASHCARDS} />
          )}

          {selectedActivity === "matching" && (
            <MatchingGameActivity
              pairs={SAMPLE_MATCHING_PAIRS.science}
              title="States of Matter & Molecular Physics"
            />
          )}

          {selectedActivity === "fill_blank" && (
            <div className="space-y-4">
              <FillInTheBlankActivity challenge={SAMPLE_FILL_BLANKS[fillBlankIndex]} />
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                <span>
                  Challenge {fillBlankIndex + 1} of {SAMPLE_FILL_BLANKS.length}
                </span>
                <button
                  onClick={() =>
                    setFillBlankIndex((prev) => (prev + 1) % SAMPLE_FILL_BLANKS.length)
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                >
                  Next Challenge →
                </button>
              </div>
            </div>
          )}

          {selectedActivity === "sequence" && (
            <DragAndDropPuzzleActivity
              title={SAMPLE_SEQUENCE_PUZZLES[0].title}
              prompt={SAMPLE_SEQUENCE_PUZZLES[0].prompt}
              items={SAMPLE_SEQUENCE_PUZZLES[0].items}
            />
          )}

          {selectedActivity === "memory" && (
            <MemoryGameActivity
              cards={SAMPLE_MEMORY_CARDS}
              title="Science & Math Memory Matrix"
            />
          )}

          {selectedActivity === "word_search" && <WordSearchActivity />}
        </div>
      </div>
    </div>
  );
}
