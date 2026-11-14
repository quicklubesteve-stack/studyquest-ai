"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { EducationTier, LearningPreference, GoalType } from "@/types";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  Headphones,
  BookOpen,
  Gamepad2,
  Layers,
  GraduationCap,
  Baby,
  Smile,
  ShieldCheck,
} from "lucide-react";

interface StepOption<T> {
  value: T;
  title: string;
  description: string;
  icon?: any;
}

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const { profile, updateProfile } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [tier, setTier] = useState<EducationTier>(profile.educationTier);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(profile.selectedSubjects);
  const [goal, setGoal] = useState<GoalType>(profile.learningGoal);
  const [studyMinutes, setStudyMinutes] = useState<number>(profile.dailyStudyMinutes);
  const [preference, setPreference] = useState<LearningPreference>(profile.learningPreference);
  const [placementQuiz, setPlacementQuiz] = useState<boolean>(profile.wantsPlacementQuiz);
  const [parentalConsentConfirmed, setParentalConsentConfirmed] = useState(false);

  const isChild = tier === "kindergarten" || tier === "elementary";

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save all preferences
      updateProfile({
        educationTier: tier,
        selectedSubjects,
        learningGoal: goal,
        dailyStudyMinutes: studyMinutes,
        learningPreference: preference,
        wantsPlacementQuiz: placementQuiz,
        isOnboarded: true,
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSubject = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectId));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center sm:p-4 overflow-hidden">
      <div className="bg-white sm:rounded-2xl shadow-2xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[92vh] flex flex-col border-0 sm:border border-slate-200 overflow-hidden animate-in fade-in">
        {/* Progress Bar & Header */}
        <div className="bg-gradient-to-r from-quest-600 via-indigo-600 to-violet-600 p-4 sm:p-6 text-white shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-black">
                Welcome to StudyQuest AI
              </span>
            </div>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
              Step {currentStep} of 6
            </span>
          </div>

          <h2 className="text-2xl font-black">
            {currentStep === 1 && "What is your education stage?"}
            {currentStep === 2 && "What subjects do you want to explore?"}
            {currentStep === 3 && "What is your main learning goal?"}
            {currentStep === 4 && "How much time would you like to study daily?"}
            {currentStep === 5 && "What is your preferred way to learn?"}
            {currentStep === 6 && "Would you like a diagnostic placement check?"}
          </h2>
          <p className="text-xs text-quest-100 mt-1">
            “Learn Your Way. Play Your Way. Grow Every Day.”
          </p>

          <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {/* STEP 1: Education Stage */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                StudyQuest personalizes vocabulary, interface size, and learning worlds to fit you best.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    value: "kindergarten" as EducationTier,
                    title: "Early Explorer",
                    description: "Preschool & Kindergarten (Ages 4-6)",
                    icon: Baby,
                  },
                  {
                    value: "elementary" as EducationTier,
                    title: "Junior Adventurer",
                    description: "Elementary School (Grades 1-5)",
                    icon: Smile,
                  },
                  {
                    value: "high_school" as EducationTier,
                    title: "Scholar",
                    description: "Middle & High School (Grades 6-12)",
                    icon: BookOpen,
                  },
                  {
                    value: "college" as EducationTier,
                    title: "Academy",
                    description: "College, University & Technical Prep",
                    icon: GraduationCap,
                  },
                  {
                    value: "adult" as EducationTier,
                    title: "Lifelong Learner",
                    description: "Adults & Seniors expanding skills",
                    icon: Sparkles,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = tier === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => setTier(item.value)}
                      className={`text-left p-4 rounded-xl border-2 transition flex items-start space-x-3 ${
                        isSelected
                          ? "border-quest-600 bg-quest-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-quest-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-quest-600" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Child Safeguard Notice */}
              {isChild && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900 mt-4">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Child Protection & Privacy Notice:</span>
                    <p className="mt-0.5 text-amber-800">
                      Under COPPA and Canadian privacy guidelines, minor learners receive full privacy safeguards: no public profiles, no unmonitored chat, and zero targeted advertising.
                    </p>
                    <label className="flex items-center space-x-2 mt-2 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={parentalConsentConfirmed}
                        onChange={(e) => setParentalConsentConfirmed(e.target.checked)}
                        className="rounded text-quest-600 focus:ring-quest-500"
                      />
                      <span>I am a parent/guardian, or learning under guardian supervision.</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Subjects */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Choose the areas you are excited to discover. You can unlock and switch subjects anytime!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "math", name: "Mathematics & Problem Solving", emoji: "📐" },
                  { id: "science", name: "Science & Nature Exploration", emoji: "🔬" },
                  { id: "cs_ai", name: "Computer Science & AI", emoji: "💻" },
                  { id: "reading", name: "Reading, Writing & Literature", emoji: "📚" },
                  { id: "history", name: "History & Global Cultures", emoji: "🌍" },
                  { id: "digital_life", name: "Digital Literacy & Online Safety", emoji: "🛡️" },
                ].map((s) => {
                  const isChecked = selectedSubjects.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSubject(s.id)}
                      className={`text-left p-3.5 rounded-xl border-2 transition flex items-center justify-between ${
                        isChecked
                          ? "border-quest-600 bg-quest-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl">{s.emoji}</span>
                        <span className="text-xs font-bold text-slate-900">{s.name}</span>
                      </div>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-quest-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Learning Goal */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                What drives your study adventure today?
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    value: "school_excellence" as GoalType,
                    title: "Academic & School Excellence",
                    desc: "Master class topics, ace upcoming homework, and build deep confidence.",
                  },
                  {
                    value: "skill_building" as GoalType,
                    title: "Practical Skills for Daily Life & Work",
                    desc: "Apply knowledge directly to projects, modern technology, and practical challenges.",
                  },
                  {
                    value: "exam_prep" as GoalType,
                    title: "Exam & Standardized Test Prep",
                    desc: "Targeted practice, timed questions, and error analysis.",
                  },
                  {
                    value: "curiosity" as GoalType,
                    title: "Pure Curiosity & Lifelong Joy",
                    desc: "Explore fascinating ideas at your own relaxed pace without stress.",
                  },
                ].map((item) => {
                  const isSelected = goal === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => setGoal(item.value)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition flex items-center justify-between ${
                        isSelected
                          ? "border-quest-600 bg-quest-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-quest-600 shrink-0 ml-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Daily Study Time */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Small consistent steps build mastery! How much time would you like to dedicate each day?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { mins: 5, label: "5 Minutes / Day", desc: "Quick bite-sized refreshers" },
                  { mins: 15, label: "15 Minutes / Day", desc: "Recommended daily sweet spot" },
                  { mins: 30, label: "30 Minutes / Day", desc: "Accelerated topic immersion" },
                  { mins: 45, label: "45+ Minutes / Day", desc: "Deep mastery & exam study" },
                ].map((item) => {
                  const isSelected = studyMinutes === item.mins;
                  return (
                    <button
                      key={item.mins}
                      onClick={() => setStudyMinutes(item.mins)}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        isSelected
                          ? "border-quest-600 bg-quest-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <h4 className="font-black text-slate-900 text-sm">{item.label}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Learning Preference */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                <span className="font-bold">Pedagogical Note:</span> Your preference personalizes your initial activity mix, but we weave together visual, auditory, reading, and hands-on elements because everyone learns best through variety. You can adjust this anytime!
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    value: "visual" as LearningPreference,
                    title: "Visual",
                    description: "Pictures, diagrams, color-coded summaries, animations, and visual puzzles.",
                    icon: Eye,
                  },
                  {
                    value: "audio" as LearningPreference,
                    title: "Audio & Discussion",
                    description: "Spoken explanations, verbal walk-throughs, read-aloud prompts, and discussion.",
                    icon: Headphones,
                  },
                  {
                    value: "reading_writing" as LearningPreference,
                    title: "Reading & Writing",
                    description: "Written lessons, guided stories, study notes, and structured summaries.",
                    icon: BookOpen,
                  },
                  {
                    value: "hands_on" as LearningPreference,
                    title: "Hands-on & Interactive",
                    description: "Simulations, sliders, interactive games, and learning by doing.",
                    icon: Gamepad2,
                  },
                  {
                    value: "mixed" as LearningPreference,
                    title: "Mixed (Balanced Combination)",
                    description: "A rich blend of visuals, spoken audio, text, and interactive challenges.",
                    icon: Layers,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = preference === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => setPreference(item.value)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition flex items-center justify-between ${
                        isSelected
                          ? "border-quest-600 bg-quest-50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg mt-0.5 ${
                            isSelected ? "bg-quest-600 text-white" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-quest-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Placement Quiz Option */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Would you like to take a short, 3-minute diagnostic placement quiz to calibrate your starting level, or jump straight into the recommended lessons?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPlacementQuiz(true)}
                  className={`p-5 rounded-xl border-2 text-left transition ${
                    placementQuiz
                      ? "border-quest-600 bg-quest-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-quest-700 bg-quest-100 px-2 py-0.5 rounded">
                      Calibrated Start
                    </span>
                    {placementQuiz && <CheckCircle2 className="w-5 h-5 text-quest-600" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Take Placement Check</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Answer 3 quick questions to help the adaptive engine recommend the ideal lesson difficulty.
                  </p>
                </button>

                <button
                  onClick={() => setPlacementQuiz(false)}
                  className={`p-5 rounded-xl border-2 text-left transition ${
                    !placementQuiz
                      ? "border-quest-600 bg-quest-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      Standard Start
                    </span>
                    {!placementQuiz && <CheckCircle2 className="w-5 h-5 text-quest-600" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Start from Foundations</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Jump straight to the curated foundation lessons for your chosen education stage.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              currentStep === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === 1 && isChild && !parentalConsentConfirmed}
            className={`px-6 py-2.5 rounded-xl text-xs font-black text-white flex items-center space-x-2 shadow-md transition ${
              currentStep === 1 && isChild && !parentalConsentConfirmed
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-quest-600 hover:bg-quest-700 focus:ring-2 focus:ring-quest-400"
            }`}
          >
            <span>{currentStep === 6 ? "Begin StudyQuest Adventure" : "Next Step"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
