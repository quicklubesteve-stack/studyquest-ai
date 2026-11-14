"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"LEARNER" | "PARENT" | "TEACHER">("LEARNER");
  const [educationTier, setEducationTier] = useState("elementary");
  const [parentEmail, setParentEmail] = useState("");
  const [parentConsent, setParentConsent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isMinor = role === "LEARNER" && (educationTier === "kindergarten" || educationTier === "elementary");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage("An unexpected error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: demoEmail,
        password: "password123",
      });

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage("Could not sign in to demo account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isMinor && !parentConsent) {
      setErrorMessage("Parental consent is legally required for young learners under COPPA & PIPEDA.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          educationTier,
          parentEmail: isMinor ? parentEmail : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create account.");
      } else {
        // Automatically sign in upon successful registration
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        onClose();
      }
    } catch (err: any) {
      setErrorMessage("Registration failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm overflow-y-auto flex min-h-full items-center justify-center p-3 sm:p-4"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-quest-700 via-indigo-700 to-violet-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="font-black text-base">
                {mode === "signin" ? "Sign In to StudyQuest" : "Create Your Account"}
              </h3>
              <p className="text-[11px] text-quest-100">
                Sync progress across devices & access role portals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
          <button
            onClick={() => {
              setMode("signin");
              setErrorMessage("");
            }}
            className={`py-3 transition ${
              mode === "signin"
                ? "bg-white text-quest-700 border-b-2 border-quest-600 font-black shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setErrorMessage("");
            }}
            className={`py-3 transition ${
              mode === "signup"
                ? "bg-white text-quest-700 border-b-2 border-quest-600 font-black shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Create Free Account
          </button>
        </div>

        <div className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Accounts (for ease of review) */}
          {mode === "signin" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">
                1-Click Demo Accounts (Phase 2 Testing):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn("student@studyquest.ai")}
                  className="px-3 py-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 text-left transition flex items-center space-x-2 min-h-[44px]"
                >
                  <span>🎒 Alex (Student)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn("parent@studyquest.ai")}
                  className="px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700 text-left transition flex items-center space-x-2 min-h-[44px]"
                >
                  <span>👨‍👩‍👧 Sarah (Parent)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn("teacher@studyquest.ai")}
                  className="px-3 py-2 bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-xs font-bold text-amber-700 text-left transition flex items-center space-x-2 min-h-[44px]"
                >
                  <span>🍎 Mr. Henderson (Teacher)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn("admin@studyquest.ai")}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 text-left transition flex items-center space-x-2 min-h-[44px]"
                >
                  <span>⚙️ Platform Admin</span>
                </button>
              </div>
            </div>
          )}

          {/* FORM: Sign In */}
          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@studyquest.ai"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-quest-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-quest-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-quest-600 hover:bg-quest-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 text-xs mt-2"
              >
                <span>{isLoading ? "Signing In..." : "Sign In & Sync Progress"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* FORM: Sign Up */
            <form onSubmit={handleSignUp} className="space-y-3 text-xs">
              {/* Role Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">I am signing up as:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "LEARNER", label: "Learner", icon: GraduationCap },
                    { id: "PARENT", label: "Parent", icon: ShieldCheck },
                    { id: "TEACHER", label: "Teacher", icon: Users },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id as any)}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                          isSelected
                            ? "border-quest-600 bg-quest-50 text-quest-900 font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px]">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Explorer"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-quest-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-quest-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-quest-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Minor Parental Consent Check */}
              {isMinor && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-[11px] text-amber-900">
                  <div className="flex items-start space-x-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Parent / Guardian Verification (COPPA & PIPEDA)</span>
                  </div>
                  <input
                    type="email"
                    placeholder="Parent's email address (for account supervision)"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                  />
                  <label className="flex items-start space-x-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={parentConsent}
                      onChange={(e) => setParentConsent(e.target.checked)}
                      className="rounded text-quest-600 mt-0.5"
                    />
                    <span>I confirm parental authorization to create this learning account.</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-quest-600 hover:bg-quest-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 text-xs mt-3"
              >
                <span>{isLoading ? "Creating Account..." : "Create Free Account"}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
