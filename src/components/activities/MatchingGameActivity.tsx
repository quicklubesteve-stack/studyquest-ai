"use client";

import React, { useState } from "react";
import { MatchingPair } from "@/types";
import { useAppStore } from "@/lib/store/useAppStore";
import { Check, X, RotateCcw, Award, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export function MatchingGameActivity({
  pairs,
  title = "Concept Matching Challenge",
  onComplete,
}: {
  pairs: MatchingPair[];
  title?: string;
  onComplete?: () => void;
}) {
  const { a11y, recordQuestionAttempt } = useAppStore();
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mismatchedPair, setMismatchedPair] = useState<boolean>(false);
  const [attempts, setAttempts] = useState(0);

  // Shuffle the right side items deterministically
  const [shuffledRight] = useState(() => {
    return [...pairs].sort(() => 0.5 - Math.random());
  });

  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedLeft(id);
    if (selectedRight) {
      evaluateMatch(id, selectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedRight(id);
    if (selectedLeft) {
      evaluateMatch(selectedLeft, id);
    }
  };

  const evaluateMatch = (leftId: string, rightId: string) => {
    setAttempts((prev) => prev + 1);

    if (leftId === rightId) {
      // Correct match!
      const nextMatched = [...matchedIds, leftId];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMismatchedPair(false);

      if (!a11y.reducedMotion) {
        try {
          confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
        } catch (e) {}
      }

      if (nextMatched.length === pairs.length) {
        recordQuestionAttempt("matching-game", title, "general", true, 0);
        onComplete?.();
      }
    } else {
      // Mismatch
      setMismatchedPair(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setMismatchedPair(false);
      }, 700);
    }
  };

  const handleReset = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setMismatchedPair(false);
    setAttempts(0);
  };

  const isComplete = matchedIds.length === pairs.length;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <h4 className="font-black text-sm text-slate-800">{title}</h4>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">
            Matched: {matchedIds.length} / {pairs.length}
          </span>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
            title="Reset Game"
            aria-label="Reset Matching Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isComplete ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-black text-emerald-900 text-lg">Fantastic Matching!</h4>
          <p className="text-xs text-emerald-700">
            You successfully paired all {pairs.length} concepts in {attempts} total attempts!
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Left Column (Terms) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Select Term
            </span>
            {pairs.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedLeft === pair.id;

              return (
                <button
                  key={`left-${pair.id}`}
                  onClick={() => handleSelectLeft(pair.id)}
                  disabled={isMatched}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between min-h-[48px] ${
                    isMatched
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 cursor-default opacity-80"
                      : isSelected
                      ? mismatchedPair
                        ? "bg-rose-50 border-rose-400 text-rose-800 animate-shake"
                        : "bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <span>{pair.left}</span>
                  {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Right Column (Definitions/Matches) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Match Definition
            </span>
            {shuffledRight.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedRight === pair.id;

              return (
                <button
                  key={`right-${pair.id}`}
                  onClick={() => handleSelectRight(pair.id)}
                  disabled={isMatched}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs leading-relaxed transition flex items-center justify-between min-h-[48px] ${
                    isMatched
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold cursor-default opacity-80"
                      : isSelected
                      ? mismatchedPair
                        ? "bg-rose-50 border-rose-400 text-rose-800 animate-shake"
                        : "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <span>{pair.right}</span>
                  {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
