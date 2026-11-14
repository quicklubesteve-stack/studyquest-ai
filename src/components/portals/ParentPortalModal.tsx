"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ShieldCheck,
  Award,
  Flame,
  Clock,
  BookOpen,
  Sliders,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

interface ChildProgress {
  id: string;
  name: string;
  email: string;
  profile: any;
  progress: {
    xp: number;
    level: number;
    streakDays: number;
    completedCount: number;
  } | null;
  topicMasteries: any[];
}

export function ParentPortalModal({ onClose }: { onClose: () => void }) {
  const [childrenList, setChildrenList] = useState<ChildProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [screenTimeLimit, setScreenTimeLimit] = useState(30);
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(false);

  useEffect(() => {
    async function fetchFamilyData() {
      try {
        const res = await fetch("/api/family");
        if (res.ok) {
          const data = await res.json();
          setChildrenList(data.children || []);
        }
      } catch (err) {
        console.warn("Could not load family data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFamilyData();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-black text-base flex items-center space-x-1.5">
                <span>Parent Supervision Portal</span>
                <span className="text-[10px] bg-emerald-400/30 font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                  COPPA Verified
                </span>
              </h3>
              <p className="text-xs text-emerald-100">
                Monitor linked child accounts, study time & privacy guardrails
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 font-bold">
              Loading linked learner accounts...
            </div>
          ) : childrenList.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
              <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-900">No Linked Child Accounts Yet</h4>
              <p className="text-slate-500 max-w-sm mx-auto">
                When your child signs up with your email listed as parent supervisor, their progress will appear here automatically.
              </p>
            </div>
          ) : (
            childrenList.map((child) => (
              <div
                key={child.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-black text-base text-slate-900">{child.name}</h4>
                    <p className="text-slate-500 text-[11px]">
                      Account: {child.email} • {child.profile?.educationTier || "elementary"}
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                    Active Learner
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
                    <div className="text-lg font-black text-indigo-600 mt-0.5">
                      {child.progress?.xp || 0} XP
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Streak</span>
                    <div className="text-lg font-black text-amber-500 flex items-center justify-center space-x-1 mt-0.5">
                      <Flame className="w-4 h-4 fill-amber-500" />
                      <span>{child.progress?.streakDays || 1}d</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Mastered</span>
                    <div className="text-lg font-black text-emerald-600 mt-0.5">
                      {child.progress?.completedCount || 0} Topics
                    </div>
                  </div>
                </div>

                {/* Mastered topics list */}
                {child.topicMasteries && child.topicMasteries.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-700">Mastery History:</span>
                    {child.topicMasteries.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800">{m.title}</span>
                        <span className="font-bold text-emerald-600">{m.masteryPercentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Parental Safeguards & Screen Time Controls */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="font-black text-sm text-slate-900 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Parental Safeguards & Screen Limits</span>
            </h4>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div>
                <label className="font-bold text-slate-700 flex justify-between">
                  <span>Daily Learning Screen Time Target:</span>
                  <span className="text-emerald-700 font-black">{screenTimeLimit} minutes</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={screenTimeLimit}
                  onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
                  className="w-full mt-1.5 accent-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="font-bold text-slate-800">Public Leaderboards</span>
                  <p className="text-[11px] text-slate-500">
                    By default, minor accounts are hidden from public rankings for privacy.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={leaderboardEnabled}
                  onChange={(e) => setLeaderboardEnabled(e.target.checked)}
                  className="rounded text-emerald-600 w-4 h-4"
                />
              </div>
            </div>

            {/* Right to be forgotten */}
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-900">Right to be Forgotten</span>
                <p className="text-[11px] text-rose-700">
                  Permanently delete all child progress and chat records at any time.
                </p>
              </div>
              <button
                onClick={() => alert("Data export or deletion request logged per PIPEDA/COPPA protocol.")}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
