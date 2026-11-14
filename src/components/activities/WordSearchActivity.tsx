"use client";

import React, { useState } from "react";
import { SAMPLE_WORD_SEARCH } from "@/curriculum/data/activities";
import { useAppStore } from "@/lib/store/useAppStore";
import { Check, Sparkles, Award, RotateCcw, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";

export function WordSearchActivity({ onComplete }: { onComplete?: () => void }) {
  const { a11y, recordQuestionAttempt } = useAppStore();
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedWordInfo, setSelectedWordInfo] = useState<{ word: string; hint: string } | null>(null);

  const words = SAMPLE_WORD_SEARCH.words;
  const grid = SAMPLE_WORD_SEARCH.grid;

  const handleFoundToggle = (wordObj: { word: string; hint: string }) => {
    setSelectedWordInfo(wordObj);
    if (!foundWords.includes(wordObj.word)) {
      const nextFound = [...foundWords, wordObj.word];
      setFoundWords(nextFound);

      recordQuestionAttempt("word-search", `Found: ${wordObj.word}`, "vocabulary", true, 0);

      if (!a11y.reducedMotion) {
        try {
          confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
        } catch (e) {}
      }

      if (nextFound.length === words.length) {
        onComplete?.();
      }
    }
  };

  const handleReset = () => {
    setFoundWords([]);
    setSelectedWordInfo(null);
  };

  const isAllFound = foundWords.length === words.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          <h4 className="font-black text-slate-900 text-sm sm:text-base">Academic Vocabulary Word Search</h4>
          <p className="text-xs text-slate-500">Tap words from the checklist below to inspect and discover them in the grid!</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-quest-700 bg-quest-50 px-2.5 py-1 rounded-full border border-quest-200 text-xs">
            {foundWords.length} / {words.length} Found
          </span>
          <button
            onClick={handleReset}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
            title="Reset Word Search"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Letter Grid */}
      <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 inline-block mx-auto max-w-full overflow-x-auto">
        <div className="grid grid-cols-8 gap-1 sm:gap-1.5 min-w-[280px]">
          {grid.map((row, rIdx) =>
            row.map((letter, cIdx) => {
              // Highlight row if word is found
              const isFound =
                (rIdx === 0 && foundWords.includes("FRACTION")) ||
                (rIdx === 1 && cIdx < 5 && foundWords.includes("SLOPE")) ||
                (rIdx === 2 && cIdx < 6 && foundWords.includes("ENERGY")) ||
                (rIdx === 3 && foundWords.includes("PHISHING")) ||
                (rIdx === 4 && foundWords.includes("GRADIENT")) ||
                (rIdx === 7 && cIdx < 7 && foundWords.includes("MASTERY"));

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-black text-xs sm:text-sm select-none transition ${
                    isFound
                      ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-sm scale-95"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-quest-300"
                  }`}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Target Word Checklist */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Target Vocabulary (Click to uncover definition):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {words.map((w) => {
            const isFound = foundWords.includes(w.word);
            return (
              <button
                key={w.word}
                onClick={() => handleFoundToggle(w)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  isFound
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span>{w.word}</span>
                {isFound ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discovered Word Definition Info Box */}
      {selectedWordInfo && (
        <div className="p-3.5 bg-violet-50 border border-violet-200 rounded-xl text-xs text-violet-900 space-y-1 animate-in fade-in">
          <div className="flex items-center space-x-1.5 font-black text-violet-800">
            <BookOpen className="w-4 h-4 text-violet-600" />
            <span>Definition: {selectedWordInfo.word}</span>
          </div>
          <p className="text-violet-700 leading-relaxed">{selectedWordInfo.hint}</p>
        </div>
      )}

      {/* Completion Banner */}
      {isAllFound && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1 text-emerald-900 animate-in zoom-in-95">
          <span className="font-black text-sm block">🎉 Vocabulary Explorer Mastered!</span>
          <p className="text-xs text-emerald-700">
            You found all {words.length} curriculum vocabulary terms and reinforced their definitions!
          </p>
        </div>
      )}
    </div>
  );
}
