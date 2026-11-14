"use client";

import React, { useState } from "react";
import { SequencePuzzleItem } from "@/types";
import { useAppStore } from "@/lib/store/useAppStore";
import { ArrowUp, ArrowDown, Check, X, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";

export function DragAndDropPuzzleActivity({
  title,
  prompt,
  items,
  onComplete,
}: {
  title: string;
  prompt: string;
  items: SequencePuzzleItem[];
  onComplete?: () => void;
}) {
  const { a11y, recordQuestionAttempt } = useAppStore();

  // Shuffle items initially
  const [orderedItems, setOrderedItems] = useState(() => {
    return [...items].sort(() => 0.5 - Math.random());
  });

  const [hasChecked, setHasChecked] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (hasChecked) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedItems.length) return;

    const copy = [...orderedItems];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setOrderedItems(copy);
  };

  const handleCheck = () => {
    const allCorrect = orderedItems.every((item, idx) => item.correctIndex === idx);
    setIsAllCorrect(allCorrect);
    setHasChecked(true);

    recordQuestionAttempt("sequence-puzzle", title, "general", allCorrect, 0);

    if (allCorrect && !a11y.reducedMotion) {
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      onComplete?.();
    }
  };

  const handleReset = () => {
    setOrderedItems([...items].sort(() => 0.5 - Math.random()));
    setHasChecked(false);
    setIsAllCorrect(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4 max-w-xl mx-auto">
      <div>
        <h4 className="font-black text-slate-900 text-sm sm:text-base">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{prompt}</p>
      </div>

      {/* Ordered Items List with Accessible Up/Down Buttons */}
      <div className="space-y-2">
        {orderedItems.map((item, index) => {
          const isSlotCorrect = item.correctIndex === index;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex items-center justify-between transition min-h-[52px] ${
                hasChecked
                  ? isSlotCorrect
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-rose-50 border-rose-300 text-rose-900"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-black text-slate-600 shrink-0 shadow-sm">
                  {index + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold">{item.text}</span>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                {hasChecked ? (
                  isSlotCorrect ? (
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                      <Check className="w-3.5 h-3.5" />
                      <span>Correct</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                      <X className="w-3.5 h-3.5" />
                      <span>Misplaced</span>
                    </span>
                  )
                ) : (
                  <>
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Move Up"
                      aria-label={`Move ${item.text} up`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === orderedItems.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Move Down"
                      aria-label={`Move ${item.text} down`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Outcome Feedback Banner */}
      {hasChecked && (
        <div
          className={`p-4 rounded-xl text-xs space-y-1 border animate-in fade-in ${
            isAllCorrect
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <span className="font-bold block text-sm">
            {isAllCorrect ? "🎉 Perfect Sequence!" : "Almost there!"}
          </span>
          <p>
            {isAllCorrect
              ? "Every step is arranged in precise logical sequence."
              : "Some items are not in the right order yet. Use the arrow buttons to rearrange and retry!"}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        {hasChecked ? (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Order</span>
          </button>
        ) : (
          <button
            onClick={handleCheck}
            className="px-5 py-2.5 bg-quest-600 hover:bg-quest-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Check Sequence
          </button>
        )}
      </div>
    </div>
  );
}
