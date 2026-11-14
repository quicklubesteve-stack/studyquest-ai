"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
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
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "tutor" | "user";
  text: string;
  timestamp: string;
  hints?: string[];
  workedExample?: string;
  citations?: string[];
}

export function AITutorModal({ onClose }: { onClose: () => void }) {
  const { profile, activeLesson, a11y } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize tutor greeting tailored to active context & age group
  useEffect(() => {
    let initialGreeting = "";
    if (activeLesson) {
      initialGreeting = `Hello ${profile.name}! I am your StudyQuest AI Tutor. We're currently studying "${activeLesson.title}". How can I guide your discovery today? Would you like a hint, an analogy, or a quick check-question?`;
    } else {
      if (profile.educationTier === "kindergarten") {
        initialGreeting = `Hi little friend! 🌟 I'm Questie, your animal math and learning buddy! What fun puzzle should we play today?`;
      } else if (profile.educationTier === "elementary") {
        initialGreeting = `Welcome adventurer! Ready for today's quest? I can give you hints, explain tricky steps with pizza slices or experiments, or test your skills!`;
      } else if (profile.educationTier === "college") {
        initialGreeting = `Greetings. I'm your AI Academic Companion. I'm ready to scaffold your understanding of machine learning foundations, algorithmic complexities, and statistical proofs. What concept would you like to deconstruct?`;
      } else {
        initialGreeting = `Welcome! I'm your StudyQuest AI Companion. I'm here to explain concepts clearly at your preferred pace without confusing jargon. How can I assist you today?`;
      }
    }

    setMessages([
      {
        id: "greet-1",
        sender: "tutor",
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        citations: activeLesson ? [activeLesson.courseTitle] : undefined,
      },
    ]);
  }, [activeLesson, profile.educationTier, profile.name]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Text-To-Speech synthesizer
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#$`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = a11y.speechRate || 1.0;

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
      alert("Browser speech recognition is not supported on this device/browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

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
    }
  };

  // Socratic Response Engine
  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate Socratic pedagogical reasoning
    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("fraction") || (activeLesson && activeLesson.id.includes("fraction"))) {
        reply =
          "Think of a pizza! If you have 8 equal slices and you give 3 away, the top number (numerator) counts what you gave away (3), while the bottom number (denominator) always tells you the total equal pieces (8). How many slices are left in the box?";
      } else if (lower.includes("count") || (activeLesson && activeLesson.id.includes("count"))) {
        reply =
          "Let's count together! 1, 2, 3, 4, 5! Touch each animal on your screen once. What number comes right after 4?";
      } else if (lower.includes("slope") || lower.includes("y = mx + b") || (activeLesson && activeLesson.id.includes("slope"))) {
        reply =
          "In the equation y = mx + b, 'm' is your slope (rise over run) and 'b' is where your line crosses the vertical y-axis. If m = 2 and b = 3, what is y when x = 0?";
      } else if (lower.includes("gradient") || lower.includes("overfit") || (activeLesson && activeLesson.id.includes("gradient"))) {
        reply =
          "When training loss keeps decreasing toward zero but validation error starts rising, the model is memorizing training noise instead of generalizing. What regularization technique or stopping rule would you suggest applying here?";
      } else if (lower.includes("phish") || lower.includes("scam") || (activeLesson && activeLesson.id.includes("phishing"))) {
        reply =
          "Phishing emails love to manufacture artificial urgency! Always inspect the true sender address after the '@' symbol and never click unknown links. If your bank sends an urgent email, what is the safest way to log in?";
      } else {
        reply = `That is a wonderful question! Rather than simply giving you the end answer, let's explore it step by step. What do you already know about this topic, or where do you feel stuck?`;
      }

      const tutorReply: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        citations: activeLesson ? [activeLesson.courseTitle, "StudyQuest Grounded Curriculum"] : undefined,
      };

      setMessages((prev) => [...prev, tutorReply]);
      setIsTyping(false);

      if (a11y.audioEnabled) {
        speakText(reply);
      }
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-dialog-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[620px] flex flex-col border border-slate-200 overflow-hidden">
        {/* Tutor Header */}
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-quest-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
              <Bot className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 id="tutor-dialog-title" className="font-black text-base flex items-center space-x-1.5">
                <span>Personal AI Socratic Tutor</span>
                <span className="text-[10px] bg-emerald-400/30 text-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                  Active
                </span>
              </h3>
              <p className="text-xs text-violet-100">
                {activeLesson ? `Grounded in: ${activeLesson.title}` : `Tuned for: ${profile.educationTier.replace("_", " ")}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (messages.length > 0) {
                  const last = messages[messages.length - 1];
                  speakText(last.text);
                }
              }}
              className={`p-2 rounded-lg transition ${
                isSpeaking ? "bg-amber-400 text-slate-950" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isSpeaking ? "Stop Speaking" : "Read Last Message Aloud"}
              aria-label={isSpeaking ? "Stop Speaking" : "Read Last Message Aloud"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close AI Tutor dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isTutor = msg.sender === "tutor";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isTutor ? "items-start" : "items-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isTutor
                      ? "bg-white text-slate-900 border border-slate-200/80 rounded-tl-sm"
                      : "bg-quest-600 text-white rounded-tr-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Grounding & Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                      <span>Curriculum Reference: {msg.citations.join(" • ")}</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2 px-1">
              <Sparkles className="w-4 h-4 text-violet-500 animate-spin" />
              <span>StudyQuest AI is formulating a Socratic hint...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Socratic Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-bold shrink-0">Quick Ask:</span>
          <button
            onClick={() => {
              setInputVal("Can you explain this in simpler words with an everyday example?");
            }}
            className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
          >
            Explain in simpler words
          </button>
          <button
            onClick={() => {
              setInputVal("Can you give me a progressive hint without spoiling the answer?");
            }}
            className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
          >
            Give me a hint
          </button>
          <button
            onClick={() => {
              setInputVal("Ask me a check-question so I can explain it back to you!");
            }}
            className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 transition"
          >
            Quiz my understanding
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          {/* Voice Input Button */}
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition ${
              isListening
                ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak your question"}
            aria-label={isListening ? "Listening... click to stop" : "Speak your question"}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isListening
                ? "Listening to your voice..."
                : "Ask a question, ask for a hint, or explain your thinking..."
            }
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
          />

          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className={`p-2.5 rounded-xl text-white transition shadow-sm ${
              inputVal.trim()
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
