"use client";

import React, { useState } from "react";
import { FillBlankChallenge } from "@/types";
import { useAppStore } from "@/lib/store/useAppStore";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";

export function FillInTheBlankActivity({
  challenge,
  onComplete,
}: {
  challenge: FillBlankChallenge;
  onComplete?: () => void;
}) {
  const { a11y, recordQuestionAttempt } = useAppStore();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selectedWord?.toLowerCase() === challenge.blankAnswer.toLowerCase();

  const handleCheck = () => {
    if (!selectedWord) return;
    setHasChecked(true);

    const success = selectedWord.toLowerCase() === challenge.blankAnswer.toLowerCase();
    recordQuestionAttempt(
      `fillblank-${challenge.id}`,
      "Fill in the Blank Challenge",
      "general",
      success,
      showHint ? 1 : 0
    );

    if (success && !a11y.reducedMotion) {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    }

    if (success) {
      onComplete?.();
    }
  };

  const handleRetry = () => {
    setSelectedWord(null);
    setHasChecked(false);
    setShowHint(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-black uppercase tracking-wider text-quest-700 bg-quest-50 px-2.5 py-1 rounded-full border border-quest-200">
          Sentence Completion
        </span>
        {challenge.hint && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need a Hint?</span>
          </button>
        )}
      </div>

      {/* Sentence with Blank Drop Zone */}
      <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-lg leading-relaxed text-slate-800 font-medium">
        <span>{challenge.sentenceParts[0]} </span>
        <span
          className={`inline-block px-3 py-1 rounded-lg border-2 font-bold min-w-[100px] text-center mx-1 transition ${
            selectedWord
              ? hasChecked
                ? isCorrect
                  ? "bg-emerald-100 border-emerald-500 text-emerald-900"
                  : "bg-rose-100 border-rose-500 text-rose-900"
                : "bg-indigo-50 border-indigo-500 text-indigo-900"
              : "bg-white border-dashed border-slate-300 text-slate-400"
          }`}
        >
          {selectedWord || "_______"}
        </span>
        <span> {challenge.sentenceParts[1]}</span>
      </div>

      {/* Optional Hint Banner */}
      {showHint && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2 animate-in fade-in">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Hint: {challenge.hint}</span>
        </div>
      )}

      {/* Options Bank */}
      {!hasChecked && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Select the word that fits:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {challenge.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedWord(opt)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                  selectedWord === opt
                    ? "bg-quest-600 border-quest-700 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Banner (Post Check) */}
      {hasChecked && (
        <div
          className={`p-4 rounded-xl text-xs leading-relaxed space-y-2 border animate-in fade-in ${
            isCorrect
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center space-x-2 font-black text-sm">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Well Done! That's correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Not quite — let's learn why!</span>
              </>
            )}
          </div>
          <p>{challenge.explanation}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-end space-x-2 pt-1">
        {hasChecked ? (
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        ) : (
          <button
            onClick={handleCheck}
            disabled={!selectedWord}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
              selectedWord
                ? "bg-quest-600 hover:bg-quest-700 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Check Answer
          </button>
        )}
      </div>
    </div>
  );
}
