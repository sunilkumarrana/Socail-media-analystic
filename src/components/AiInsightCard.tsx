import React from "react";
import { Sparkles, RefreshCw, Bot, CheckCircle, ShieldCheck, Quote } from "lucide-react";

interface AiInsightCardProps {
  insight: string;
  source: string;
  isLoading: boolean;
  onRegenerate: () => void;
  handle: string;
  platform: string;
  lastGeneratedTime?: string;
  modelName?: string;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({
  insight,
  source,
  isLoading,
  onRegenerate,
  handle,
  platform,
  lastGeneratedTime,
  modelName,
}) => {
  return (
    <div
      id="ai-insight-panel"
      className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 p-5 shadow-xl sm:p-6 mb-6"
    >
      {/* Background glow accent */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                AI Performance Intelligence Briefing
              </h2>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                Analyst Note
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Evaluated using multi-metric velocity & engagement benchmarks
            </p>
          </div>
        </div>

        {/* Regenerate Button */}
        <button
          id="btn-regenerate-ai-insight"
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
          <span>{isLoading ? "Analyzing..." : "Regenerate Insight"}</span>
        </button>
      </div>

      {/* Narrative Summary Body */}
      <div className="relative rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 sm:p-5">
        <Quote className="absolute right-4 top-3 h-8 w-8 text-slate-800 pointer-events-none" />

        {isLoading ? (
          <div className="space-y-2.5 animate-pulse py-1">
            <div className="h-3.5 w-full rounded bg-slate-800" />
            <div className="h-3.5 w-5/6 rounded bg-slate-800" />
            <div className="h-3.5 w-4/6 rounded bg-slate-800" />
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {insight}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5 text-indigo-400" />
          <span>
            Model: <strong className="font-medium text-slate-300">{modelName || (source?.includes("gemini") ? "Gemini 3.8 Flash" : "Benchmark Engine")}</strong>
          </span>
          {source && (
            <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
              {source.includes("gemini") || source.startsWith("live") ? "Live API" : "Simulated"}
            </span>
          )}
        </div>

        <div className="text-slate-400">
          Generated only on-demand to optimize token usage
        </div>
      </div>
    </div>
  );
};
