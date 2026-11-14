"use client";

import React from "react";
import { X, ShieldAlert, Database, Server, Users, BookOpen } from "lucide-react";

export function AdminPortalModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-black text-base">StudyQuest Platform Admin</h3>
              <p className="text-[11px] text-slate-300">System health, role governance & security</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Database Engine</span>
              <div className="text-base font-black text-slate-900 mt-1 flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-quest-600" />
                <span>Prisma ORM (SQLite / PG)</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
                ● Connected & Synced
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Auth & Roles</span>
              <div className="text-base font-black text-slate-900 mt-1 flex items-center space-x-1.5">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>NextAuth Session JWT</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">
                4 Role Gateways Active
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900">Seeded System Roles:</h4>
            <div className="space-y-1.5 text-slate-600 text-[11px]">
              <div>• <strong>Learner</strong>: Access to curriculum quests, AI tutor, mastery scoring</div>
              <div>• <strong>Parent</strong>: COPPA child protection, linked child dashboard, screen limits</div>
              <div>• <strong>Teacher</strong>: Classroom management (QUEST4), student mastery roster</div>
              <div>• <strong>Admin</strong>: Complete platform and database monitoring</div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition"
            >
              Close Admin Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
