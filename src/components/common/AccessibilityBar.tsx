"use client";

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Eye, Type, Activity, Volume2, VolumeX } from "lucide-react";

export function AccessibilityBar() {
  const { a11y, updateA11y } = useAppStore();

  const cycleTextScale = () => {
    if (a11y.textScale === "normal") updateA11y({ textScale: "large" });
    else if (a11y.textScale === "large") updateA11y({ textScale: "xlarge" });
    else updateA11y({ textScale: "normal" });
  };

  return (
    <div
      role="region"
      aria-label="Accessibility settings bar"
      className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between border-b border-slate-800"
    >
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-quest-300">Accessibility Tools:</span>
      </div>

      <div className="flex items-center space-x-3 mt-1 sm:mt-0">
        <button
          onClick={() => updateA11y({ highContrast: !a11y.highContrast })}
          aria-pressed={a11y.highContrast}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
            a11y.highContrast ? "bg-amber-400 text-slate-950 font-bold" : "hover:bg-slate-800"
          }`}
          title="Toggle High Contrast Mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Contrast: {a11y.highContrast ? "High" : "Standard"}</span>
        </button>

        <button
          onClick={cycleTextScale}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-800 transition"
          title="Change text size"
          aria-label={`Current text size: ${a11y.textScale}. Click to cycle.`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text: {a11y.textScale.toUpperCase()}</span>
        </button>

        <button
          onClick={() => updateA11y({ reducedMotion: !a11y.reducedMotion })}
          aria-pressed={a11y.reducedMotion}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
            a11y.reducedMotion ? "bg-cyan-400 text-slate-950 font-bold" : "hover:bg-slate-800"
          }`}
          title="Toggle Reduced Motion"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Motion: {a11y.reducedMotion ? "Reduced" : "Normal"}</span>
        </button>

        <button
          onClick={() => updateA11y({ audioEnabled: !a11y.audioEnabled })}
          aria-pressed={a11y.audioEnabled}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
            a11y.audioEnabled ? "hover:bg-slate-800" : "bg-rose-500 text-white"
          }`}
          title="Toggle Audio Cues"
        >
          {a11y.audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>Audio: {a11y.audioEnabled ? "On" : "Muted"}</span>
        </button>
      </div>
    </div>
  );
}
