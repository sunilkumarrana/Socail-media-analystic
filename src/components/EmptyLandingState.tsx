import React, { useState } from "react";
import {
  Youtube,
  Search,
  Sparkles,
  BarChart2,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  ClipboardPaste,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Platform } from "../types";

interface EmptyLandingStateProps {
  onSearch?: (input: string, platform: Platform) => void;
  onSelectSample: (handle: string, platform: Platform) => void;
  isLoading?: boolean;
}

const FEATURED_PRESETS = [
  {
    name: "MKBHD",
    handle: "youtube.com/@mkbhd",
    platform: "youtube" as Platform,
    subscribers: "19.6M",
    category: "Tech & Reviews",
    avatarBg: "from-red-600 to-rose-700",
    initials: "MK",
  },
  {
    name: "MrBeast",
    handle: "youtube.com/@mrbeast",
    platform: "youtube" as Platform,
    subscribers: "380M",
    category: "Entertainment",
    avatarBg: "from-sky-500 to-blue-700",
    initials: "MB",
  },
  {
    name: "Apna College",
    handle: "youtube.com/@ApnaCollegeOfficial",
    platform: "youtube" as Platform,
    subscribers: "5.8M",
    category: "Coding & Education",
    avatarBg: "from-amber-500 to-orange-700",
    initials: "AC",
  },
  {
    name: "Veritasium",
    handle: "youtube.com/@veritasium",
    platform: "youtube" as Platform,
    subscribers: "16.4M",
    category: "Science & Engineering",
    avatarBg: "from-indigo-600 to-purple-700",
    initials: "VR",
  },
  {
    name: "TED-Ed",
    handle: "youtube.com/@TEDEd",
    platform: "youtube" as Platform,
    subscribers: "20.2M",
    category: "Education",
    avatarBg: "from-red-700 to-red-900",
    initials: "TE",
  },
];

export const EmptyLandingState: React.FC<EmptyLandingStateProps> = ({
  onSearch,
  onSelectSample,
  isLoading = false,
}) => {
  const [inputVal, setInputVal] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    if (onSearch) {
      onSearch(inputVal.trim(), "youtube");
    } else {
      onSelectSample(inputVal.trim(), "youtube");
    }
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputVal(text.trim());
        }
      }
    } catch {
      // clipboard access denied or unsupported in iframe
    }
  };

  return (
    <div id="overview-channel-entry-landing" className="py-6 sm:py-10">
      {/* Hero Container */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Real-Time Creator Analytics Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Enter Channel URL or Account Name
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Enter any YouTube channel URL, handle (e.g. <span className="text-indigo-300 font-mono">@mkbhd</span>), or creator name to unlock real-time subscriber counts, YouTube Studio-style performance curves, and AI intelligence.
        </p>
      </div>

      {/* Prominent URL / Account Name Input Box */}
      <div className="max-w-3xl mx-auto mb-8">
        <form
          onSubmit={handleFormSubmit}
          className="relative rounded-2xl border-2 border-indigo-500/50 bg-slate-900/95 p-2 sm:p-2.5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition-all focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center flex-1 pl-3 pr-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 mr-2.5">
                <Youtube className="h-5 w-5" />
              </div>
              <input
                id="landing-channel-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Paste channel URL or name: e.g. https://youtube.com/@mkbhd, @mrbeast, Apna College..."
                className="w-full bg-transparent py-2.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => setInputVal("")}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-slate-800 transition"
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                <span>Paste</span>
              </button>
            </div>

            <button
              id="landing-analyze-btn"
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Loading Data...</span>
                </>
              ) : (
                <>
                  <span>Analyze Channel</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Instant Quick-Select Featured Channels */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Or click an instant channel to load data:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {FEATURED_PRESETS.map((preset) => (
            <button
              key={preset.handle}
              onClick={() => {
                setInputVal(preset.handle);
                if (onSearch) {
                  onSearch(preset.handle, preset.platform);
                } else {
                  onSelectSample(preset.handle, preset.platform);
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-indigo-500/60 hover:bg-slate-800/90 px-3.5 py-2 text-xs font-medium text-slate-200 transition group shadow-sm"
            >
              <div
                className={`h-5 w-5 rounded-full bg-gradient-to-br ${preset.avatarBg} text-white flex items-center justify-center text-[9px] font-bold`}
              >
                {preset.initials}
              </div>
              <span className="font-semibold text-white group-hover:text-indigo-300 transition">
                {preset.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {preset.subscribers}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Capabilities Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">YouTube Studio Growth Curves</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tracks performance against typical channels: curves grow up sharply when performance is good and decrease down when traffic slows.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">Live YouTube Data Sync</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fetches live subscriber counts, total channel view counts, verified badge status, and upload velocity straight from YouTube.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">Gemini AI Executive Briefing</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generates strategic creator insights evaluating retention dynamics, upload cadence, and competitive positioning.
          </p>
        </div>
      </div>
    </div>
  );
};
