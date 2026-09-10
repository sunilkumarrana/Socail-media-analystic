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
    <div id="overview-channel-entry-landing" className="py-8 sm:py-12">
      {/* Hero Container */}
      <div className="max-w-4xl mx-auto text-center mb-8 px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-400 mb-4 shadow-xs">
          <Youtube className="h-3.5 w-3.5 text-red-500" />
          <span>YouTube Channel &amp; Video Intelligence</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white whitespace-nowrap text-center">
          Enter Channel URL or Account Name
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
          Search any YouTube channel by handle, URL, or creator name to inspect live studio analytics, audience retention, and growth curves.
        </p>
      </div>

      {/* Prominent URL / Account Name Input Box */}
      <div className="max-w-2xl mx-auto mb-8 px-4">
        <form
          onSubmit={handleFormSubmit}
          className="relative rounded-xl border border-slate-750 bg-slate-900/90 p-1.5 sm:p-2 shadow-lg shadow-black/20 backdrop-blur-sm transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center flex-1 pl-2.5 pr-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400 mr-2.5">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="landing-channel-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. youtube.com/@mkbhd, @mrbeast, or Veritasium..."
                className="w-full bg-transparent py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              {inputVal ? (
                <button
                  type="button"
                  onClick={() => setInputVal("")}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition cursor-pointer"
                >
                  <ClipboardPaste className="h-3.5 w-3.5" />
                  <span>Paste</span>
                </button>
              )}
            </div>

            <button
              id="landing-analyze-btn"
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Loading Data...</span>
                </>
              ) : (
                <>
                  <span>Analyze Channel</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Instant Quick-Select Featured Channels */}
      <div className="max-w-3xl mx-auto mb-12 px-4">
        <p className="text-xs font-medium text-slate-400 mb-3 text-center">
          Suggested creator channels:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
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
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors group cursor-pointer shadow-xs"
            >
              <div
                className="h-5 w-5 rounded-full bg-slate-800 text-slate-300 group-hover:text-white flex items-center justify-center text-[10px] font-semibold"
              >
                {preset.initials}
              </div>
              <span className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                {preset.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {preset.subscribers}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Capabilities Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto px-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xs transition hover:border-slate-750">
          <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mb-3">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
            Live Channel Growth
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tracks live subscriber delta, view velocities, and video upload cadence verified directly from YouTube.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xs transition hover:border-slate-750">
          <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mb-3">
            <BarChart2 className="h-4 w-4 text-indigo-400" />
          </div>
          <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
            Studio-Style Trajectory
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plots performance curves against typical channel baseline envelopes, mirroring YouTube Studio analytics.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xs transition hover:border-slate-750">
          <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mb-3">
            <BrainCircuit className="h-4 w-4 text-indigo-400" />
          </div>
          <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
            Demand &amp; Retention Telemetry
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Identifies high-demand topic opportunities, retention curve drop-offs, and audience search volume gaps.
          </p>
        </div>
      </div>
    </div>
  );
};
