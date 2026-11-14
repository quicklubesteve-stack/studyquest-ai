"use client";

import React, { useState } from "react";
import { MemoryCard } from "@/types";
import { useAppStore } from "@/lib/store/useAppStore";
import { Award, RotateCcw, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export function MemoryGameActivity({
  cards,
  title = "Memory Match Challenge",
  onComplete,
}: {
  cards: MemoryCard[];
  title?: string;
  onComplete?: () => void;
}) {
  const { a11y, recordQuestionAttempt } = useAppStore();

  const [shuffledCards] = useState(() => {
    return [...cards].sort(() => 0.5 - Math.random());
  });

  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [turns, setTurns] = useState(0);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index)) return;
    const card = shuffledCards[index];
    if (matchedPairIds.includes(card.pairId)) return;

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setTurns((prev) => prev + 1);
      const firstCard = shuffledCards[nextFlipped[0]];
      const secondCard = shuffledCards[nextFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        const nextMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIndices([]);

        if (nextMatched.length * 2 === cards.length) {
          recordQuestionAttempt("memory-match", title, "general", true, 0);
          if (!a11y.reducedMotion) {
            try {
              confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
          }
          onComplete?.();
        }
      } else {
        // Mismatch — flip back
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const isComplete = matchedPairIds.length * 2 === cards.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <h4 className="font-black text-sm text-slate-800">{title}</h4>
        <div className="flex items-center space-x-3">
          <span className="font-semibold">Turns: {turns}</span>
          <span className="font-bold text-emerald-600">
            Matched: {matchedPairIds.length} / {cards.length / 2}
          </span>
        </div>
      </div>

      {isComplete ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-black text-emerald-900 text-lg">Memory Master!</h4>
          <p className="text-xs text-emerald-700">
            You matched all cards in {turns} turns!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {shuffledCards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index);
            const isMatched = matchedPairIds.includes(card.pairId);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={isMatched || isFlipped}
                className={`h-20 sm:h-24 rounded-xl border-2 font-bold text-xs sm:text-sm p-1.5 transition flex items-center justify-center text-center shadow-sm ${
                  isMatched
                    ? "bg-emerald-100 border-emerald-400 text-emerald-900 opacity-90 cursor-default"
                    : isFlipped
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                    : "bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200"
                }`}
                aria-label={isFlipped || isMatched ? card.content : `Hidden card ${index + 1}`}
              >
                {isFlipped || isMatched ? card.content : "?"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
