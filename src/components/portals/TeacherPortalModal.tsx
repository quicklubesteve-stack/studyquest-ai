"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Share2,
  Copy,
  Plus,
} from "lucide-react";

interface ClassroomData {
  id: string;
  name: string;
  gradeLevel: string;
  code: string;
  studentCount: number;
  students: {
    id: string;
    name: string;
    email: string;
    level: number;
    xp: number;
    streak: number;
    averageMastery: number;
    topicsCount: number;
  }[];
}

export function TeacherPortalModal({ onClose }: { onClose: () => void }) {
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function fetchClassrooms() {
      try {
        const res = await fetch("/api/classroom");
        if (res.ok) {
          const data = await res.json();
          setClassrooms(data.classrooms || []);
        }
      } catch (err) {
        console.warn("Could not load classroom data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClassrooms();
  }, []);

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base flex items-center space-x-1.5">
                <span>Teacher & Educator Portal</span>
                <span className="text-[10px] bg-white/20 font-bold px-2 py-0.5 rounded-full">
                  Instructor Suite
                </span>
              </h3>
              <p className="text-xs text-amber-100">
                Manage classroom cohorts, monitor student mastery & assign learning quests
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
              Loading classroom and student roster...
            </div>
          ) : classrooms.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-black text-base text-slate-900">Create Your First Classroom</h4>
              <p className="text-slate-500 max-w-md mx-auto">
                Invite students to join your cohort with a simple class code. Track mastery across fractions, science, and algebra.
              </p>
              <button
                onClick={() => alert("Classroom creation wizard")}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm transition"
              >
                + New Classroom
              </button>
            </div>
          ) : (
            classrooms.map((c) => (
              <div key={c.id} className="space-y-4">
                {/* Class Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-base text-slate-900">{c.name}</h4>
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        {c.gradeLevel}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {c.studentCount} Active Students Enrolled
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-600">Student Join Code:</span>
                    <button
                      onClick={() => copyClassCode(c.code)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-amber-50 rounded-xl font-mono font-black text-amber-800 text-xs flex items-center space-x-1.5 transition shadow-sm"
                      title="Click to copy join code"
                    >
                      <span>{c.code}</span>
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedCode && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                  </div>
                </div>

                {/* Roster Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <th className="p-3">Student Name</th>
                        <th className="p-3 text-center">Level / XP</th>
                        <th className="p-3 text-center">Streak</th>
                        <th className="p-3 text-center">Avg Mastery</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {c.students.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-bold text-slate-900">
                            <div>{st.name}</div>
                            <span className="text-[10px] text-slate-400 font-normal">{st.email}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="font-black text-indigo-700">Lvl {st.level}</span>
                            <span className="text-slate-400 text-[10px] ml-1">({st.xp} XP)</span>
                          </td>
                          <td className="p-3 text-center font-bold text-amber-600">
                            {st.streak} Days 🔥
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center space-x-1.5">
                              <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full rounded-full"
                                  style={{ width: `${st.averageMastery}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-800">{st.averageMastery}%</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              On Track
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
