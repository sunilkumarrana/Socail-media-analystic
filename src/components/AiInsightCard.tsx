import React from "react";
import { Sparkles, RefreshCw, Bot, CheckCircle, ShieldCheck, Quote, ArrowUpRight, Palette } from "lucide-react";
import { QuickDesignPayload } from "../types";

interface AiInsightCardProps {
  insight: string;
  source: string;
  isLoading: boolean;
  onRegenerate: () => void;
  handle: string;
  platform: string;
  lastGeneratedTime?: string;
  modelName?: string;
  onTriggerQuickDesign?: (payload: QuickDesignPayload) => void;
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
  onTriggerQuickDesign,
}) => {
  return (
    <div
      id="ai-insight-panel"
      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-6 mb-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#5B5CE2] border border-[#E0E7FF]">
            <Sparkles className="h-4 w-4 text-[#5B5CE2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#111827] tracking-tight">
                AI Performance Intelligence Briefing
              </h2>
              <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#5B5CE2] border border-[#E0E7FF] uppercase tracking-wider">
                Analyst Note
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Evaluated using multi-metric velocity & engagement benchmarks
            </p>
          </div>
        </div>

        {/* Actions: Quick Design with Adobe Express & Regenerate */}
        <div className="flex items-center gap-2">
          {onTriggerQuickDesign && (
            <button
              id="btn-quick-design-from-insight"
              onClick={() => {
                const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;
                onTriggerQuickDesign({
                  headline: `${cleanHandle}: Growth & Retention Strategy`,
                  subtitle: insight.length > 100 ? `${insight.slice(0, 96)}...` : insight,
                  badgeText: "High Retention Strategy",
                  category: "youtube-thumbnail",
                  theme: "varsity-blue",
                  creatorHandle: handle,
                });
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#D1D5DB] transition shadow-xs cursor-pointer"
              title="Design a visual asset based on this insight with Adobe Express"
            >
              <Palette className="h-3.5 w-3.5 text-[#5B5CE2]" />
              <span>Create in Adobe Express</span>
              <ArrowUpRight className="h-3 w-3 text-[#9CA3AF]" />
            </button>
          )}

          <button
            id="btn-regenerate-ai-insight"
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#111827] transition hover:bg-[#E5E7EB] hover:border-[#D1D5DB] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-[#5B5CE2]" : "text-[#6B7280]"}`} />
            <span>{isLoading ? "Analyzing..." : "Regenerate Insight"}</span>
          </button>
        </div>
      </div>

      {/* Narrative Summary Body */}
      <div className="relative rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:p-5">
        <Quote className="absolute right-4 top-3 h-8 w-8 text-[#E2E8F0] pointer-events-none" />

        {isLoading ? (
          <div className="space-y-2.5 animate-pulse py-1">
            <div className="h-3.5 w-full rounded bg-[#E5E7EB]" />
            <div className="h-3.5 w-5/6 rounded bg-[#E5E7EB]" />
            <div className="h-3.5 w-4/6 rounded bg-[#E5E7EB]" />
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#374151] leading-relaxed font-normal">
            {insight}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5 text-[#5B5CE2]" />
          <span>
            Model: <strong className="font-medium text-[#374151]">{modelName || (source?.includes("gemini") ? "Gemini 3.8 Flash" : "Benchmark Engine")}</strong>
          </span>
          {source && (
            <span className="rounded bg-[#F3F4F6] border border-[#E5E7EB] px-1.5 py-0.5 text-[10px] text-[#4B5563]">
              {source.includes("gemini") || source.startsWith("live") ? "Live API" : "Simulated"}
            </span>
          )}
        </div>

        <div className="text-[#9CA3AF]">
          Generated only on-demand to optimize token usage
        </div>
      </div>
    </div>
  );
};
