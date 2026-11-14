"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Lesson, QuizQuestion } from "@/types";
import {
  ArrowLeft,
  Sparkles,
  HelpCircle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Award,
  RotateCcw,
  Volume2,
  Eye,
  BookOpen,
  ChevronRight,
  Flame,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

export function LessonViewer({ lesson }: { lesson: Lesson }) {
  const {
    profile,
    a11y,
    recordQuestionAttempt,
    completeLesson,
    setActiveLesson,
    loadSampleLessonById,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"lesson" | "activity" | "quiz">("lesson");

  // Interactive Activity State
  const [counterCount, setCounterCount] = useState(0);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([0, 1, 2]);
  const [particleTemp, setParticleTemp] = useState<"cold" | "warm" | "hot">("warm");
  const [slopeM, setSlopeM] = useState(2);
  const [interceptB, setInterceptB] = useState(-1);
  const [lossEpoch, setLossEpoch] = useState(15);
  const [foundFlags, setFoundFlags] = useState<string[]>([]);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [totalEarnedXP, setTotalEarnedXP] = useState(0);

  const currentQ: QuizQuestion = lesson.quiz[currentQuestionIndex];

  // Trigger celebration confetti
  const triggerConfetti = () => {
    if (a11y.reducedMotion) return;
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Fallback
    }
  };

  // Check answer
  const handleSubmitAnswer = () => {
    if (selectedChoiceIndex === null) return;

    const correct = selectedChoiceIndex === currentQ.correctIndex;
    setIsAnswerCorrect(correct);
    setHasSubmitted(true);

    const { earnedXP } = recordQuestionAttempt(
      lesson.id,
      lesson.title,
      lesson.subjectId,
      correct,
      hintsRevealed
    );

    if (correct) {
      setTotalEarnedXP((prev) => prev + earnedXP);
      triggerConfetti();
    }
  };

  // Next question or finish
  const handleNextQuestion = () => {
    if (currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoiceIndex(null);
      setHintsRevealed(0);
      setHasSubmitted(false);
      setIsAnswerCorrect(false);
    } else {
      completeLesson(lesson.id);
      setLessonFinished(true);
      triggerConfetti();
    }
  };

  const handleRetryQuestion = () => {
    setSelectedChoiceIndex(null);
    setHasSubmitted(false);
    setIsAnswerCorrect(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveLesson(null)}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-quest-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {lesson.courseTitle}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-quest-100 text-quest-800 uppercase tracking-wider">
            {lesson.tier.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-gradient-to-r from-quest-600 via-indigo-600 to-violet-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg mb-6">
        <h1 className="text-2xl sm:text-3xl font-black mb-2">{lesson.title}</h1>
        <p className="text-xs sm:text-sm text-quest-100 max-w-3xl leading-relaxed">
          {lesson.summary}
        </p>

        {/* Learning Preference Adaptation Bar */}
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between text-xs text-quest-100 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Adapted for:</span>
            <span className="capitalize bg-white/20 px-2 py-0.5 rounded text-white font-medium">
              {profile.learningPreference.replace("_", " ")} Mode
            </span>
            <span className="text-quest-200">• ~{lesson.estimatedMinutes} mins</span>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-black/20 p-1 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("lesson")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                activeTab === "lesson" ? "bg-white text-slate-900 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Lesson</span>
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                activeTab === "activity" ? "bg-white text-slate-900 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Interactive Activity</span>
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                activeTab === "quiz" ? "bg-white text-slate-900 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>3. Quest Quiz ({lesson.quiz.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Core Lesson Content */}
      {activeTab === "lesson" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {/* Visual Summary Card for Visual Learners */}
            {lesson.visualSummary && (
              <div className="mb-6 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-start space-x-3 text-xs sm:text-sm text-indigo-950">
                <Eye className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-900">Visual Blueprint:</span>
                  <p className="mt-1 text-slate-700">{lesson.visualSummary}</p>
                </div>
              </div>
            )}

            {/* Audio Narration Prompt for Audio Learners */}
            {lesson.audioNarration && (
              <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs sm:text-sm text-emerald-950">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900">Spoken Walkthrough:</span>
                    <p className="text-slate-700 italic">"{lesson.audioNarration}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Markdown Body */}
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base">
              <div className="whitespace-pre-line">{lesson.contentMarkdown}</div>
            </div>

            {/* Key Takeaways */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-quest-600" />
                <span>Key Takeaways for Mastery:</span>
              </h3>
              <ul className="space-y-2">
                {lesson.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setActiveTab("activity")}
                className="px-6 py-3 bg-quest-600 hover:bg-quest-700 text-white font-black text-xs sm:text-sm rounded-xl flex items-center space-x-2 shadow-md transition"
              >
                <span>Try the Interactive Activity</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Activity */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-quest-600 uppercase tracking-widest">
              Hands-On Simulation
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">{lesson.activity.title}</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {lesson.activity.instruction}
            </p>
          </div>

          {/* Activity 1: Kindergarten Animal Counter */}
          {lesson.activity.type === "interactive_counter" && (
            <div className="text-center py-6 bg-amber-50/50 rounded-2xl border border-amber-200">
              <p className="text-sm font-bold text-amber-900 mb-4">
                Tap the animals to count them into the pond!
              </p>
              <div className="flex items-center justify-center space-x-4 mb-6">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isCounted = num <= counterCount;
                  return (
                    <button
                      key={num}
                      onClick={() => setCounterCount(num)}
                      className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition transform active:scale-90 border-2 ${
                        isCounted
                          ? "bg-amber-400 border-amber-500 shadow-md scale-105"
                          : "bg-white border-dashed border-amber-300 opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Count animal number ${num}`}
                    >
                      {lesson.activity.data.itemEmoji}
                    </button>
                  );
                })}
              </div>

              <div className="text-2xl font-black text-amber-900">
                You have counted: <span className="text-amber-600">{counterCount}</span> ducklings!
              </div>

              {counterCount === 5 && (
                <div className="mt-4 text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl inline-block animate-bounce">
                  🎉 Fantastic counting! You've counted all 5 ducklings!
                </div>
              )}
            </div>
          )}

          {/* Activity 2: Fraction Pizza Pie */}
          {lesson.activity.type === "fraction_pie" && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-around gap-6">
              {/* SVG Pizza with 8 slices */}
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="46" fill="#fcd34d" stroke="#b45309" strokeWidth="3" />
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const angle = (i * 360) / 8;
                    const rad = (angle * Math.PI) / 180;
                    const x = 50 + 46 * Math.cos(rad);
                    const y = 50 + 46 * Math.sin(rad);
                    const isSelected = selectedSlices.includes(i);
                    return (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={x}
                        y2={y}
                        stroke="#b45309"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-3xl">🍕</span>
                </div>
              </div>

              {/* Slices selector & fraction display */}
              <div className="space-y-4 max-w-xs text-center md:text-left">
                <h3 className="font-black text-slate-900 text-base">Select Your Slices:</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((sliceIndex) => {
                    const isSelected = selectedSlices.includes(sliceIndex);
                    return (
                      <button
                        key={sliceIndex}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSlices(selectedSlices.filter((s) => s !== sliceIndex));
                          } else {
                            setSelectedSlices([...selectedSlices, sliceIndex]);
                          }
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition ${
                          isSelected
                            ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        Slice {sliceIndex + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-semibold">Fraction Selected:</div>
                  <div className="text-3xl font-black text-quest-700 my-1">
                    {selectedSlices.length} / 8
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Numerator = <strong>{selectedSlices.length}</strong> (slices selected)
                    <br />
                    Denominator = <strong>8</strong> (total slices)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity 3: Particle Simulator (Matter) */}
          {lesson.activity.type === "particle_sim" && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">Thermal State:</span>
                <div className="flex space-x-2">
                  {(["cold", "warm", "hot"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setParticleTemp(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                        particleTemp === t
                          ? "bg-cyan-500 text-slate-950 font-black"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {t === "cold" ? "Solid (Ice)" : t === "warm" ? "Liquid (Water)" : "Gas (Steam)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated Particle Chamber */}
              <div className="h-48 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
                <div
                  className={`grid grid-cols-6 gap-4 ${
                    particleTemp === "cold"
                      ? "gap-2 animate-pulse"
                      : particleTemp === "warm"
                      ? "gap-5 animate-bounce"
                      : "gap-8 animate-ping"
                  }`}
                >
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full shadow-lg ${
                        particleTemp === "cold"
                          ? "bg-blue-400"
                          : particleTemp === "warm"
                          ? "bg-cyan-300"
                          : "bg-amber-400"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                {particleTemp === "cold" &&
                  "Solid state: High density, tightly bonded particles vibrating in fixed positions."}
                {particleTemp === "warm" &&
                  "Liquid state: Moderate thermal energy, particles sliding and flowing past one another."}
                {particleTemp === "hot" &&
                  "Gas state: High kinetic energy, particles dispersed and colliding rapidly in free space."}
              </p>
            </div>
          )}

          {/* Activity 4: High School Slope Slider */}
          {lesson.activity.type === "slope_slider" && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold uppercase">Equation:</div>
                  <div className="text-2xl font-black text-quest-700 mt-1">
                    y = {slopeM}x {interceptB >= 0 ? `+ ${interceptB}` : `- ${Math.abs(interceptB)}`}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 flex justify-between">
                    <span>Slope (m = Rise / Run):</span>
                    <span className="text-quest-600 font-black">{slopeM}</span>
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={slopeM}
                    onChange={(e) => setSlopeM(Number(e.target.value))}
                    className="w-full mt-1.5 accent-quest-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 flex justify-between">
                    <span>y-Intercept (b = (0, b)):</span>
                    <span className="text-quest-600 font-black">{interceptB}</span>
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={interceptB}
                    onChange={(e) => setInterceptB(Number(e.target.value))}
                    className="w-full mt-1.5 accent-quest-600"
                  />
                </div>
              </div>

              {/* Cartesian Coordinate Plane Representation */}
              <div className="h-56 bg-white border border-slate-300 rounded-xl relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 divide-x divide-y divide-slate-100" />
                <div className="absolute w-full h-[1.5px] bg-slate-400" />
                <div className="absolute h-full w-[1.5px] bg-slate-400" />
                <div
                  className="absolute w-full h-[2.5px] bg-quest-600 transform origin-center transition-transform duration-200"
                  style={{
                    transform: `translateY(${-interceptB * 12}px) rotate(${-Math.atan(slopeM) * (180 / Math.PI)}deg)`,
                  }}
                />
                <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono">
                  (x, y) plane
                </span>
              </div>
            </div>
          )}

          {/* Activity 5: AI Paradigms Flowchart */}
          {lesson.activity.type === "flowchart" && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
                System Logic Comparison
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Classical Symbolic AI
                  </span>
                  <div className="mt-3 font-mono text-xs text-slate-800 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>Data + Explicit Rules</div>
                    <div className="text-indigo-600 font-bold">⬇ Execution Engine</div>
                    <div>= Deductive Answers</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Statistical Machine Learning
                  </span>
                  <div className="mt-3 font-mono text-xs text-slate-800 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>Input Data + Labeled Answers</div>
                    <div className="text-emerald-600 font-bold">⬇ Optimization Loss Loop</div>
                    <div>= Learned Statistical Rules (Weights)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity 6: Overfitting Diagnostic Curve */}
          {lesson.activity.type === "loss_curve" && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Epoch Loss Visualizer</h4>
                  <p className="text-xs text-slate-400">Drag to inspect where generalization breaks down.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-800 px-3 py-1 rounded-full text-cyan-400">
                  Epoch: {lossEpoch} / 50
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="50"
                value={lossEpoch}
                onChange={(e) => setLossEpoch(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <span className="text-[11px] text-slate-400">Training Loss:</span>
                  <div className="text-xl font-mono font-black text-emerald-400">
                    {(1 / (1 + lossEpoch * 0.12)).toFixed(3)}
                  </div>
                  <span className="text-[10px] text-slate-500">Steadily decreasing</span>
                </div>

                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <span className="text-[11px] text-slate-400">Validation Loss:</span>
                  <div
                    className={`text-xl font-mono font-black ${
                      lossEpoch > 25 ? "text-rose-400" : "text-cyan-400"
                    }`}
                  >
                    {(lossEpoch <= 25
                      ? 1 / (1 + lossEpoch * 0.1)
                      : 0.28 + (lossEpoch - 25) * 0.02
                    ).toFixed(3)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {lossEpoch > 25 ? "⚠️ Overfitting! Noise memorization" : "Good Generalization"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Activity 7: Email Inspector */}
          {lesson.activity.type === "email_inspector" && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <p className="text-xs text-slate-600">
                Click on the 3 deceptive security red flags in this fraudulent alert:
              </p>

              <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500 font-bold">From:</span>
                  <button
                    onClick={() => {
                      if (!foundFlags.includes("Mismatched sender domain")) {
                        setFoundFlags([...foundFlags, "Mismatched sender domain"]);
                      }
                    }}
                    className={`px-2 py-1 rounded font-mono font-bold transition ${
                      foundFlags.includes("Mismatched sender domain")
                        ? "bg-rose-100 text-rose-700 border border-rose-300"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    support@service-apple-recovery-center.net 🚩
                  </button>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500 font-bold">Subject:</span>
                  <button
                    onClick={() => {
                      if (!foundFlags.includes("Urgent panic language")) {
                        setFoundFlags([...foundFlags, "Urgent panic language"]);
                      }
                    }}
                    className={`px-2 py-1 rounded font-bold transition ${
                      foundFlags.includes("Urgent panic language")
                        ? "bg-rose-100 text-rose-700 border border-rose-300"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    URGENT: Your account will be DELETED within 2 hours! 🚩
                  </button>
                </div>

                <div className="pt-2 text-slate-800 leading-relaxed">
                  <p>Dear customer, we detected unusual logins from another country.</p>
                  <p className="mt-2">
                    <button
                      onClick={() => {
                        if (!foundFlags.includes("Demands password verification")) {
                          setFoundFlags([...foundFlags, "Demands password verification"]);
                        }
                      }}
                      className={`font-bold underline transition ${
                        foundFlags.includes("Demands password verification")
                          ? "bg-rose-100 text-rose-700 px-1 rounded"
                          : "text-blue-600"
                      }`}
                    >
                      Click here immediately to verify your password and unlock your account. 🚩
                    </button>
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-700">
                Red flags detected: <span className="text-rose-600">{foundFlags.length} / 3</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab("quiz")}
              className="px-6 py-3 bg-quest-600 hover:bg-quest-700 text-white font-black text-xs sm:text-sm rounded-xl flex items-center space-x-2 shadow-md transition"
            >
              <span>Test Knowledge on Quiz</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Quiz Runner */}
      {activeTab === "quiz" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {!lessonFinished ? (
            <div className="space-y-6">
              {/* Question Index & Difficulty Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1} of {lesson.quiz.length}
                </span>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {currentQ.difficulty}
                </span>
              </div>

              {/* Prompt */}
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentQ.prompt}
              </h2>

              {/* Choices */}
              <div className="space-y-3">
                {currentQ.choices.map((choice, idx) => {
                  const isSelected = selectedChoiceIndex === idx;
                  let choiceClass = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";

                  if (hasSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      choiceClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                    } else if (isSelected && !isAnswerCorrect) {
                      choiceClass = "border-rose-400 bg-rose-50 text-rose-950 line-through";
                    }
                  } else if (isSelected) {
                    choiceClass = "border-quest-600 bg-quest-50 text-slate-900 font-bold shadow-sm";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !hasSubmitted && setSelectedChoiceIndex(idx)}
                      disabled={hasSubmitted}
                      className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between text-xs sm:text-sm ${choiceClass}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{choice}</span>
                      </div>
                      {hasSubmitted && idx === currentQ.correctIndex && (
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hints Section */}
              {!hasSubmitted && currentQ.hints && currentQ.hints.length > 0 && (
                <div className="pt-2">
                  {hintsRevealed < currentQ.hints.length ? (
                    <button
                      onClick={() => setHintsRevealed((prev) => prev + 1)}
                      className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>
                        Need a Hint? ({hintsRevealed}/{currentQ.hints.length} used)
                      </span>
                    </button>
                  ) : null}

                  {hintsRevealed > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950">
                      {currentQ.hints.slice(0, hintsRevealed).map((hint, hIdx) => (
                        <div key={hIdx} className="flex items-start space-x-2">
                          <span className="font-bold text-amber-700 shrink-0">Hint {hIdx + 1}:</span>
                          <span>{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback and Explanation Display after Submission */}
              {hasSubmitted && (
                <div
                  className={`p-5 rounded-xl border-2 animate-in fade-in ${
                    isAnswerCorrect
                      ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                      : "bg-rose-50 border-rose-300 text-rose-950"
                  }`}
                >
                  <div className="flex items-center space-x-2 font-black text-sm mb-2">
                    {isAnswerCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>Excellent work! Correct answer!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Not quite, but mistakes help us learn!</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {currentQ.explanation}
                  </p>

                  {currentQ.sourceReference && (
                    <p className="text-[11px] text-slate-500 mt-2 italic">
                      Curriculum Standard: {currentQ.sourceReference}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400">
                  {hintsRevealed > 0 && `(-${hintsRevealed * 12} XP hint penalty applied)`}
                </span>

                <div className="flex items-center space-x-3">
                  {!hasSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedChoiceIndex === null}
                      className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-md transition ${
                        selectedChoiceIndex !== null
                          ? "bg-quest-600 hover:bg-quest-700"
                          : "bg-slate-300 cursor-not-allowed"
                      }`}
                    >
                      Check Answer
                    </button>
                  ) : !isAnswerCorrect ? (
                    <button
                      onClick={handleRetryQuestion}
                      className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center space-x-1.5 transition shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retry Question</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 transition shadow-md"
                    >
                      <span>
                        {currentQuestionIndex < lesson.quiz.length - 1
                          ? "Next Question"
                          : "Complete Quest"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Lesson Finished Card */
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 mx-auto flex items-center justify-center text-white shadow-xl">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-quest-600 bg-quest-100 px-3 py-1 rounded-full">
                  Quest Complete!
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  Congratulations, {profile.name}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  You have successfully completed <strong>"{lesson.title}"</strong> and advanced your mastery!
                </p>
              </div>

              {/* Rewards Summary */}
              <div className="inline-flex items-center space-x-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase">XP Awarded</span>
                  <div className="text-2xl font-black text-indigo-600">+{totalEarnedXP + 100}</div>
                </div>
                <div className="h-8 w-[1px] bg-slate-200" />
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase">Topic Mastery</span>
                  <div className="text-2xl font-black text-emerald-600">+25%</div>
                </div>
                <div className="h-8 w-[1px] bg-slate-200" />
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase">Streak Active</span>
                  <div className="text-2xl font-black text-amber-500 flex items-center justify-center space-x-1">
                    <Flame className="w-5 h-5 fill-amber-500" />
                    <span>Active</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-6 py-3 bg-quest-600 hover:bg-quest-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
