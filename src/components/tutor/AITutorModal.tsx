"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { TutorMode, ChatMessage } from "@/lib/ai/types";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  RotateCcw,
  Sliders,
  GraduationCap,
  FileText,
  AlertTriangle,
} from "lucide-react";

const MODE_CONFIG: { mode: TutorMode; label: string; icon: any; hint: string }[] = [
  {
    mode: "socratic",
    label: "Socratic Hints",
    icon: Lightbulb,
    hint: "Asks guiding questions to help you solve problems yourself.",
  },
  {
    mode: "worked_example",
    label: "Worked Example",
    icon: FileText,
    hint: "Shows a step-by-step breakdown of a similar problem.",
  },
  {
    mode: "teach_the_ai",
    label: "Teach the AI",
    icon: GraduationCap,
    hint: "Explain what you've learned to the AI to solidify your mastery.",
  },
  {
    mode: "practice_generator",
    label: "Practice Challenge",
    icon: HelpCircle,
    hint: "Generates a customized question to test your understanding.",
  },
  {
    mode: "mistake_analysis",
    label: "Analyze Mistake",
    icon: RotateCcw,
    hint: "Non-judgmental review of why an answer was tricky.",
  },
];

export function AITutorModal({ onClose }: { onClose: () => void }) {
  const { profile, activeLesson, a11y, updateA11y } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [tutorMode, setTutorMode] = useState<TutorMode>("socratic");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(a11y.speechRate || 1.0);
  const [showVoiceControls, setShowVoiceControls] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize tutor greeting based on tier, mode, and active lesson
  useEffect(() => {
    let initialGreeting = "";
    if (activeLesson) {
      initialGreeting = `Hello ${profile.name}! I'm your StudyQuest AI companion for "${activeLesson.title}". How can I support your quest right now? You can ask for a progressive hint, see a worked example, or try explaining the concept to me!`;
    } else {
      if (profile.educationTier === "kindergarten") {
        initialGreeting = `Hi little adventurer! 🦊 I'm Questie! Let's count, sing, and discover fun puzzles together! What should we explore today? 🎈`;
      } else if (profile.educationTier === "elementary") {
        initialGreeting = `Hey ${profile.name}! Captain Quest here! Ready for today's learning quest? Remember: making mistakes is how our brain builds superpowers! How can I help?`;
      } else if (profile.educationTier === "high_school") {
        initialGreeting = `Welcome ${profile.name}. I'm your StudyQuest academic mentor. Whether you're working through equations, scientific models, or exam strategies, let's break it down together.`;
      } else if (profile.educationTier === "college") {
        initialGreeting = `Greetings. I'm your academic research mentor. Let's deconstruct the theoretical frameworks and empirical methods behind your current coursework.`;
      } else {
        initialGreeting = `Welcome to your lifelong study studio! I'm here to provide clear, practical explanations without unnecessary jargon. What would you like to explore?`;
      }
    }

    setMessages([
      {
        id: "greet-1",
        role: "model",
        content: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSocratic: true,
        suggestedActions: [
          "Give me a progressive hint",
          "Show me a worked example",
          "I want to explain it to you!",
        ],
        citation: activeLesson
          ? {
              topic: activeLesson.title,
              subject: activeLesson.subjectId,
              gradeLevel: activeLesson.tier,
            }
          : undefined,
      },
    ]);
  }, [activeLesson, profile.educationTier, profile.name]);

  // Escape key listener for accessible dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSpeaking && typeof window !== "undefined") {
          window.speechSynthesis?.cancel();
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isSpeaking]);

  // Scroll only the inner message stream (preserves window viewport scroll position)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Text-To-Speech synthesizer
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechError("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeechError(null);
    const cleanText = text.replace(/[*#$`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Browser Speech-To-Text Recognition
  const toggleListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Browser speech recognition is not supported on this device/browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setSpeechError("Speech recognition failed or was cancelled.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
      setSpeechError("Microphone access unavailable.");
    }
  };

  // Dispatch message to AI Tutor API
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputVal;
    if (!rawText.trim() || isTyping) return;

    const userText = rawText.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);
    setSpeechError(null);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          educationTier: profile.educationTier,
          learningPreference: profile.learningPreference,
          currentLessonId: activeLesson?.id,
          currentSubjectId: activeLesson?.subjectId,
          tutorMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSocratic: data.isSocratic,
        followUpQuestion: data.followUpQuestion,
        suggestedActions: data.suggestedActions,
        citation: data.curriculumCitation,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Auto-read aloud if user has enabled audio cues
      if (a11y.audioEnabled) {
        speakText(data.reply);
      }
    } catch (err) {
      console.warn("Tutor fetch fallback:", err);
      // Graceful offline fallback
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content: `I'm having a brief connection hiccup, but let's keep learning! Think of our core rule for ${activeLesson?.title || "this topic"}: what is the first clue you have?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSocratic: true,
        suggestedActions: ["Give me a hint", "Show a worked example", "Let's try again"],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-dialog-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[92vh] sm:h-[640px] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-quest-700 p-3.5 sm:p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 id="tutor-dialog-title" className="font-black text-sm sm:text-base flex items-center space-x-1.5">
                <span>Personal AI Socratic Tutor</span>
                <span className="text-[10px] bg-emerald-400/30 text-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-300/30 hidden xs:inline">
                  Grounded
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-violet-100 flex items-center space-x-1.5">
                <span>Tuned for: {profile.educationTier}</span>
                {activeLesson && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[160px] sm:max-w-[240px] font-semibold text-white">
                      {activeLesson.title}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {/* Voice Controls Toggle */}
            <button
              onClick={() => setShowVoiceControls(!showVoiceControls)}
              className={`p-2 rounded-lg transition text-xs font-bold flex items-center space-x-1 ${
                showVoiceControls ? "bg-white/30 text-white" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title="Voice & Speed Settings"
              aria-label="Voice & Speed Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Read Aloud Toggle */}
            <button
              onClick={() => {
                if (messages.length > 0) {
                  const lastModel = [...messages].reverse().find((m) => m.role === "model");
                  if (lastModel) speakText(lastModel.content);
                }
              }}
              className={`p-2 rounded-lg transition ${
                isSpeaking ? "bg-amber-400 text-slate-950" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
              aria-label={isSpeaking ? "Stop Speaking" : "Read Aloud"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (isSpeaking && typeof window !== "undefined") {
                  window.speechSynthesis?.cancel();
                }
                onClose();
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close AI Tutor dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Rate Control Bar (expandable) */}
        {showVoiceControls && (
          <div className="bg-violet-900/90 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-violet-800 animate-in slide-in-from-top-1">
            <span className="font-semibold text-violet-200">Speech Speed:</span>
            <div className="flex items-center space-x-1.5">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setSpeechRate(rate);
                    updateA11y({ speechRate: rate });
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                    speechRate === rate
                      ? "bg-white text-violet-900 shadow-sm"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tutor Mode Selector Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 p-1.5 sm:p-2 flex items-center space-x-1 overflow-x-auto shrink-0 scrollbar-none">
          {MODE_CONFIG.map(({ mode, label, icon: Icon, hint }) => {
            const isActive = tutorMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setTutorMode(mode)}
                title={hint}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? "bg-white text-violet-700 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-violet-600" : "text-slate-500"}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Speech Error Banner (if triggered) */}
        {speechError && (
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-xs text-amber-800 flex items-center space-x-2 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="flex-1">{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="text-amber-600 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Conversation Stream */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-slate-50/50"
          aria-live="polite"
        >
          {messages.map((msg) => {
            const isModel = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isModel ? "items-start" : "items-end"}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isModel
                      ? "bg-white text-slate-900 border border-slate-200/90 rounded-tl-sm"
                      : "bg-gradient-to-r from-violet-600 to-quest-600 text-white rounded-tr-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Follow-up Probing Question */}
                  {msg.followUpQuestion && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start space-x-1.5 text-xs font-semibold text-violet-700">
                      <HelpCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <span>{msg.followUpQuestion}</span>
                    </div>
                  )}

                  {/* Grounded Citation */}
                  {msg.citation && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center space-x-1.5">
                      <BookOpen className="w-3 h-3 text-violet-500 shrink-0" />
                      <span>
                        Curriculum: {msg.citation.topic} ({msg.citation.gradeLevel})
                      </span>
                    </div>
                  )}

                  {/* Interactive Next-Step Action Pills */}
                  {isModel && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(action)}
                          className="px-2.5 py-1 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 rounded-full text-[11px] font-bold transition flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3 text-violet-500" />
                          <span>{action}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs py-2 px-1 animate-pulse">
              <Sparkles className="w-4 h-4 text-violet-600 animate-spin" />
              <span>Formulating Socratic guidance...</span>
            </div>
          )}
        </div>

        {/* Quick Prompt Bar (Mode Specific) */}
        <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
          <span className="text-slate-500 font-bold shrink-0">Quick Action:</span>
          {tutorMode === "socratic" && (
            <>
              <button
                onClick={() => handleSendMessage("Can you give me a small hint to get started?")}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
              >
                💡 Give me a hint
              </button>
              <button
                onClick={() => handleSendMessage("Can you explain this with a real-world analogy?")}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
              >
                🍕 Everyday analogy
              </button>
            </>
          )}
          {tutorMode === "worked_example" && (
            <button
              onClick={() => handleSendMessage("Can you walk through a step-by-step example?")}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
            >
              📝 Show step-by-step example
            </button>
          )}
          {tutorMode === "teach_the_ai" && (
            <button
              onClick={() => handleSendMessage("Ask me a check-question so I can explain the answer back to you!")}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
            >
              🎓 Ask me a question to explain!
            </button>
          )}
          {tutorMode === "practice_generator" && (
            <button
              onClick={() => handleSendMessage("Generate a new practice challenge question for me!")}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
            >
              🎯 Generate practice challenge
            </button>
          )}
          {tutorMode === "mistake_analysis" && (
            <button
              onClick={() => handleSendMessage("Why was my last answer incorrect, and how should I think about it?")}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
            >
              🔍 Analyze my mistake
            </button>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0">
          {/* Speech-to-Text Button */}
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition shrink-0 ${
              isListening
                ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak your question (Web Speech API)"}
            aria-label={isListening ? "Listening... click to stop" : "Speak your question"}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={
              isListening
                ? "Listening... Speak your question now"
                : tutorMode === "teach_the_ai"
                ? "Explain the concept to the AI tutor..."
                : "Ask a question, request a hint, or explore an idea..."
            }
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() || isTyping}
            className={`p-2.5 rounded-xl text-white transition shadow-sm shrink-0 ${
              inputVal.trim() && !isTyping
                ? "bg-violet-600 hover:bg-violet-700 cursor-pointer"
                : "bg-slate-300 cursor-not-allowed"
            }`}
            aria-label="Send message to AI Tutor"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
