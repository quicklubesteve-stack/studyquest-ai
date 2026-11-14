"use client";

import React, { useState } from "react";
import { Flashcard } from "@/types";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  RotateCcw,
  Sparkles,
  Volume2,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export function FlashcardChallengeActivity({
  cards,
  onComplete,
}: {
  cards: Flashcard[];
  onComplete?: (masteredCount: number) => void;
}) {
  const { a11y, recordQuestionAttempt } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, "again" | "good" | "easy">>({});

  const currentCard = cards[currentIndex];

  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#$`]/g, ""));
    utterance.rate = a11y.speechRate || 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleRate = (rating: "again" | "good" | "easy") => {
    const updated = { ...ratings, [currentCard.id]: rating };
    setRatings(updated);

    // Award XP via scoring engine for active recall
    const isSuccess = rating !== "again";
    recordQuestionAttempt(
      `flashcard-${currentCard.id}`,
      currentCard.category,
      "general",
      isSuccess,
      showHint ? 1 : 0
    );

    if (rating === "easy" && !a11y.reducedMotion) {
      try {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
      } catch (e) {}
    }

    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      const mastered = Object.values(updated).filter((r) => r === "easy" || r === "good").length;
      onComplete?.(mastered);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setCompleted(false);
    setRatings({});
  };

  if (completed) {
    const masteredCount = Object.values(ratings).filter((r) => r === "easy" || r === "good").length;
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-lg mx-auto border border-slate-200 shadow-md">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-xl font-black text-slate-900">Flashcard Review Complete!</h3>
        <p className="text-sm text-slate-600">
          You recalled <span className="font-black text-emerald-600">{masteredCount}</span> of{" "}
          <span className="font-bold">{cards.length}</span> key concepts. Your spaced repetition queue has been updated!
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Progress & Category Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-bold uppercase tracking-wider text-quest-700 bg-quest-50 px-2.5 py-1 rounded-full border border-quest-200">
          {currentCard.category}
        </span>
        <span className="font-semibold">
          Card {currentIndex + 1} of {cards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-quest-500 to-indigo-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard Component (3D Flip Effect) */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={isFlipped ? "Card back. Click to flip to front." : "Card front. Click to flip to back."}
        className="relative min-h-[220px] sm:min-h-[260px] bg-white rounded-2xl border-2 border-slate-200 hover:border-quest-400 p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-quest-200"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider">
            {isFlipped ? "Answer & Concept" : "Question / Prompt"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpeak(isFlipped ? currentCard.back : currentCard.front);
            }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="Read text aloud"
            aria-label="Read card text aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="my-auto text-center py-4">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>
          {!isFlipped && showHint && currentCard.hint && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left flex items-start space-x-2 animate-in fade-in">
              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Hint: {currentCard.hint}</span>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-1 font-medium">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Click or press Space to {isFlipped ? "see Question" : "reveal Answer"}</span>
        </div>
      </div>

      {/* Action / Rating Bar */}
      {!isFlipped ? (
        <div className="flex items-center justify-between pt-2">
          {currentCard.hint && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-amber-50 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need a Hint?</span>
            </button>
          )}
          <button
            onClick={() => setIsFlipped(true)}
            className="ml-auto px-5 py-2.5 bg-quest-600 hover:bg-quest-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Reveal Answer
          </button>
        </div>
      ) : (
        <div className="space-y-2 pt-2 animate-in fade-in">
          <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-wider">
            How well did you know this?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleRate("again")}
              className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex flex-col items-center"
            >
              <span>Need Practice</span>
              <span className="text-[10px] text-rose-500 font-normal">Box 1 (Review soon)</span>
            </button>
            <button
              onClick={() => handleRate("good")}
              className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition flex flex-col items-center"
            >
              <span>Getting It</span>
              <span className="text-[10px] text-amber-600 font-normal">Box 2 (In 3 days)</span>
            </button>
            <button
              onClick={() => handleRate("easy")}
              className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition flex flex-col items-center"
            >
              <span>Mastered! ⭐</span>
              <span className="text-[10px] text-emerald-600 font-normal">Box 3 (In 7 days)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
