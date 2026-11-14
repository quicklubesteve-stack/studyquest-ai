"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Crown,
  Sparkles,
  ShieldCheck,
  Download,
  Trash2,
  CreditCard,
  Zap,
  Info,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlanChanged?: () => void;
}

export default function PricingModal({ isOpen, onClose, onPlanChanged }: Props) {
  const [currentTier, setCurrentTier] = useState<"FREE" | "PLUS">("FREE");
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyRemaining, setDailyRemaining] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchBillingStatus();
    }
  }, [isOpen]);

  const fetchBillingStatus = async () => {
    try {
      const res = await fetch("/api/billing/status");
      if (res.ok) {
        const data = await res.json();
        setCurrentTier(data.tier || "FREE");
        setDailyUsed(data.dailyUsed || 0);
        setDailyRemaining(data.dailyRemaining !== undefined ? data.dailyRemaining : 15);
      }
    } catch (e) {
      console.warn("Failed to fetch billing status", e);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setStatusMessage(null);

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.redirectUrl) {
          if (data.testModeSimulated) {
            setStatusMessage("🎉 StudyQuest Plus activated in Stripe Test Mode!");
            setCurrentTier("PLUS");
            setDailyRemaining(500);
            if (onPlanChanged) onPlanChanged();
          } else {
            window.location.href = data.redirectUrl;
          }
        }
      } else {
        setStatusMessage(data.error || "Failed to initiate Stripe test checkout.");
      }
    } catch {
      setStatusMessage("Network error contacting billing service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    window.open("/api/user/export", "_blank");
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete your account, learning progress, and study materials? This action complies with PIPEDA and COPPA right-to-be-forgotten standards and cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        alert("Your account and all associated data have been permanently deleted.");
        window.location.reload();
      } else {
        alert("Failed to delete account.");
      }
    } catch {
      alert("Error deleting account.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 id="pricing-modal-title" className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>StudyQuest Plans & Privacy</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                Stripe Test Mode
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Transparent, non-coercive pricing. Essential educational curricula are always free forever.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Plans Modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium">
            {statusMessage}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Core Explorer (Free) */}
          <div
            className={`border rounded-3xl p-5 space-y-4 flex flex-col justify-between ${
              currentTier === "FREE"
                ? "border-emerald-400 bg-emerald-50/20 shadow-sm"
                : "border-slate-200 bg-white"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-black text-base text-slate-900">Core Explorer</h4>
                {currentTier === "FREE" && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-slate-900">Free Forever</div>
              <p className="text-xs text-slate-500">Essential curriculum for every grade level.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>All 7 multi-grade academic subjects</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Learning Arcade (6 interactive activities)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Leitner Spaced Repetition Center</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>15 daily AI Tutor interactions ({dailyRemaining} remaining today)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Upload up to 5 study documents (PDF/DOCX/TXT)</span>
              </li>
            </ul>

            <div className="text-xs font-bold text-slate-600 bg-slate-100 p-2.5 rounded-xl text-center">
              Active Core Plan
            </div>
          </div>

          {/* Card 2: StudyQuest Plus */}
          <div
            className={`border-2 rounded-3xl p-5 space-y-4 flex flex-col justify-between ${
              currentTier === "PLUS"
                ? "border-violet-500 bg-violet-50/30 shadow-md"
                : "border-quest-500 bg-white hover:border-quest-600 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-black text-base text-quest-900 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>StudyQuest Plus</span>
                </h4>
                {currentTier === "PLUS" ? (
                  <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full">
                    Active Plan
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-quest-600 text-white px-2 py-0.5 rounded-full">
                    Test Mode
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-slate-900">
                CAD $9.99 <span className="text-xs text-slate-500 font-normal">/ month</span>
              </div>
              <p className="text-xs text-slate-500">Unlimited power learning & AI voice mentoring.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span><strong>Unlimited AI Tutor</strong> interactions (no daily limits)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
                <span>Full real-time <strong>Voice Learning</strong> and spoken dialogue</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-quest-600 flex-shrink-0" />
                <span>Unlimited document uploads up to 25MB</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-quest-600 flex-shrink-0" />
                <span>Advanced parent telemetry & classroom teacher sync</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-quest-600 flex-shrink-0" />
                <span>Priority Socratic worked examples and deep explanations</span>
              </li>
            </ul>

            {currentTier === "PLUS" ? (
              <div className="text-xs font-bold text-violet-700 bg-violet-100 p-2.5 rounded-xl text-center">
                ✓ StudyQuest Plus Active
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-quest-600 to-violet-600 hover:from-quest-700 hover:to-violet-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isLoading ? "Connecting to Stripe..." : "Activate in Test Mode (CAD $9.99/mo)"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Privacy, Data Export & PIPEDA / COPPA Compliance Footer */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Privacy & Data Portability (PIPEDA & COPPA AA Standard)
            </span>
            <span className="text-[11px] text-slate-400">Zero child ads • Full data control</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Personal Data (JSON)</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Delete My Account & All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
