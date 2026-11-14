import React from "react";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-quest-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">StudyQuest AI</span>
            </div>
            <p className="text-slate-400 max-w-md">
              “Learn Your Way. Play Your Way. Grow Every Day.” An accessible, multi-generation educational platform built with adaptive AI guidance, interactive activities, and lifelong learning worlds.
            </p>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Designed with COPPA, PIPEDA & WCAG 2.2 AA child & privacy safeguards.</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Education Worlds</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Early Explorer (Kindergarten)</li>
              <li>Junior Adventurer (Elementary)</li>
              <li>Scholar Quest (High School)</li>
              <li>University Academy (College)</li>
              <li>Lifelong Studio (Adults & Seniors)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Pedagogy & Values</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Deterministic Mastery Scoring</li>
              <li>Socratic Inquiry Tutoring</li>
              <li>Spaced Repetition Review</li>
              <li>Non-Punitive Mistake Feedback</li>
              <li>100% Ad-Free Learning</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-400 space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} StudyQuest AI. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built with precision & passion for curious minds</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
