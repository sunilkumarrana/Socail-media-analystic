import React, { useState } from "react";
import { StudioAnalytics, Platform } from "../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Compass,
  Search,
  ExternalLink,
  Eye,
  MousePointerClick,
  Users,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Filter,
  Sparkles,
} from "lucide-react";

interface ReachTabProps {
  studio: StudioAnalytics;
  platform?: Platform;
  period?: "7d" | "28d" | "90d";
  onPeriodChange?: (period: "7d" | "28d" | "90d") => void;
}

const TRAFFIC_COLORS = [
  "#6366f1", // Indigo - Browse
  "#ec4899", // Pink - Suggested
  "#f59e0b", // Amber - Search
  "#10b981", // Emerald - External
  "#8b5cf6", // Violet - Channel pages
  "#64748b", // Slate - Direct / other
];

export const ReachTab: React.FC<ReachTabProps> = ({
  studio,
  period = "28d",
  onPeriodChange,
}) => {
  const [activeTrafficView, setActiveTrafficView] = useState<"all" | "search" | "external">("all");

  const { reach } = studio;

  // Scale data slightly based on selected period
  const periodMultiplier = period === "7d" ? 0.25 : period === "90d" ? 3.1 : 1.0;
  const impressions = Math.round(reach.impressions * periodMultiplier);
  const impressionsFormatted =
    impressions >= 1_000_000
      ? `${(impressions / 1_000_000).toFixed(1)}M`
      : impressions >= 1_000
      ? `${(impressions / 1_000).toFixed(0)}K`
      : impressions.toString();

  const viewsFromImpressions = Math.round(reach.viewsFromImpressions * periodMultiplier);
  const viewsFromImpressionsFormatted =
    viewsFromImpressions >= 1_000_000
      ? `${(viewsFromImpressions / 1_000_000).toFixed(1)}M`
      : viewsFromImpressions >= 1_000
      ? `${(viewsFromImpressions / 1_000).toFixed(0)}K`
      : viewsFromImpressions.toString();

  const uniqueViewers = Math.round(reach.uniqueViewers * periodMultiplier);
  const uniqueViewersFormatted =
    uniqueViewers >= 1_000_000
      ? `${(uniqueViewers / 1_000_000).toFixed(1)}M`
      : uniqueViewers >= 1_000
      ? `${(uniqueViewers / 1_000).toFixed(0)}K`
      : uniqueViewers.toString();

  // Traffic Source chart data
  const trafficChartData = reach.trafficSources.map((item, idx) => ({
    name: item.source.replace(" / feed", "").replace(" web & shares", ""),
    percentage: item.percentage,
    views: item.viewsFormatted,
    fill: TRAFFIC_COLORS[idx % TRAFFIC_COLORS.length],
  }));

  // External traffic chart data
  const externalChartData = reach.externalSites.map((item) => ({
    name: item.site,
    percentage: item.percentage,
  }));

  return (
    <div className="space-y-6">
      {/* 1. Reach Headline KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Impressions */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-[#5B5CE2]" />
              <span>Impressions</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#5B5CE2] border border-[#E0E7FF]">
              <ArrowUpRight className="h-3 w-3" />
              {reach.impressionsDelta}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {impressionsFormatted}
          </div>
          <div className="mt-2 text-xs text-[#6B7280] flex items-center gap-1">
            <span className="text-[#059669] font-semibold">{reach.impressionsDelta}</span>
            <span>vs previous {period === "7d" ? "7 days" : period === "28d" ? "28 days" : "90 days"}</span>
          </div>
        </div>

        {/* Card 2: CTR */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <MousePointerClick className="h-3.5 w-3.5 text-[#DC2626]" />
              <span>Impressions CTR</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-semibold text-[#DC2626] border border-[#FECACA]">
              {reach.ctrDelta}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {reach.ctr}%
          </div>
          <div className="mt-2 text-xs text-[#6B7280]">
            Above typical creator benchmark (4.0% – 7.0%)
          </div>
        </div>

        {/* Card 3: Views from Impressions */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-[#059669]" />
              <span>Views from Impressions</span>
            </span>
            <span className="inline-flex rounded bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#059669] border border-[#A7F3D0]">
              74% of views
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {viewsFromImpressionsFormatted}
          </div>
          <div className="mt-2 text-xs text-[#6B7280]">
            High algorithm distribution health
          </div>
        </div>

        {/* Card 4: Unique Viewers */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#5B5CE2]" />
              <span>Unique Viewers</span>
            </span>
            <span className="inline-flex rounded bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#5B5CE2] border border-[#E0E7FF]">
              Audience Reach
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {uniqueViewersFormatted}
          </div>
          <div className="mt-2 text-xs text-[#6B7280]">
            Estimated distinct viewers in this window
          </div>
        </div>
      </div>

      {/* 2. Main Traffic Source Breakdown (Recharts Chart + List) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Visual Chart & Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#5B5CE2]" />
                <span>Traffic Source Types Breakdown</span>
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                How viewers discover this channel's content across YouTube's algorithm
              </p>
            </div>

            {/* Quick Filter Pill */}
            <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-xl p-1 border border-[#E5E7EB]">
              <button
                onClick={() => setActiveTrafficView("all")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTrafficView === "all"
                    ? "bg-white text-[#111827] shadow-xs"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setActiveTrafficView("search")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTrafficView === "search"
                    ? "bg-white text-[#111827] shadow-xs"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTrafficView("external")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTrafficView === "external"
                    ? "bg-white text-[#111827] shadow-xs"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                External
              </button>
            </div>
          </div>

          {/* Recharts Horizontal Bar Chart for Traffic Sources */}
          <div className="h-[230px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trafficChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 60]}
                  unit="%"
                  stroke="#6B7280"
                  fontSize={11}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#4B5563"
                  fontSize={11}
                  width={110}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#111827",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(val: any, _name: any, item: any) => [
                    `${val}% (${item.payload.views} views)`,
                    "Share of Traffic",
                  ]}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {trafficChartData.map((entry, index) => (
                    <Cell key={`traffic-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Progress Bars List */}
          <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
            {reach.trafficSources.map((source, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: TRAFFIC_COLORS[i % TRAFFIC_COLORS.length] }}
                    />
                    <span className="text-[#374151] font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[#6B7280]">{source.viewsFormatted} views</span>
                    <span className="text-[#111827] font-bold">{source.percentage}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#F3F4F6] overflow-hidden">
                  <div
                    style={{
                      width: `${source.percentage}%`,
                      backgroundColor: TRAFFIC_COLORS[i % TRAFFIC_COLORS.length],
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Conversion Funnel Card */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#059669]" />
                <span>Impressions Funnel</span>
              </h3>
              <span className="text-[10px] text-[#5B5CE2] bg-[#EEF2FF] border border-[#E0E7FF] px-2 py-0.5 rounded">
                YouTube Algorithm
              </span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Shows how effectively thumbnail impressions convert into video clicks and viewer watch time.
            </p>

            {/* Funnel Steps */}
            <div className="space-y-3">
              {/* Step 1: Impressions */}
              <div className="rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] p-3">
                <div className="flex justify-between text-xs text-[#5B5CE2] mb-1">
                  <span className="font-semibold">1. Total Impressions</span>
                  <span className="font-mono font-bold text-[#111827]">{impressionsFormatted}</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">100% video thumbnails shown to users</div>
              </div>

              {/* Connector Arrow */}
              <div className="flex justify-center -my-1 text-[#9CA3AF] text-xs">↓ {reach.ctr}% CTR</div>

              {/* Step 2: Views from impressions */}
              <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3">
                <div className="flex justify-between text-xs text-[#DC2626] mb-1">
                  <span className="font-semibold">2. Views from Impressions</span>
                  <span className="font-mono font-bold text-[#111827]">{viewsFromImpressionsFormatted}</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">Viewers who clicked thumbnail</div>
              </div>

              {/* Connector Arrow */}
              <div className="flex justify-center -my-1 text-[#9CA3AF] text-xs">↓ Avg 6m 48s duration</div>

              {/* Step 3: Total Watch Time */}
              <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="flex justify-between text-xs text-[#059669] mb-1">
                  <span className="font-semibold">3. Watch Time Generated</span>
                  <span className="font-mono font-bold text-[#111827]">{studio.engagement.watchTimeFormatted}</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">Total watch hours accrued</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] p-3 border border-[#E5E7EB] text-xs text-[#4B5563] flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#111827]">Algorithm Insight:</strong> High browse features (44.6%) indicate thumbnails and titles strongly satisfy YouTube's Home recommendation network.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Top Search Terms & External Sources Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* YouTube Search Terms Breakdown */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Search className="h-4 w-4 text-amber-500" />
              <span>Top YouTube Search Terms</span>
            </h3>
            <span className="text-xs text-[#6B7280] font-mono">% of Search Traffic</span>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {reach.topSearchTerms.map((term, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#9CA3AF] w-4 font-semibold">#{i + 1}</span>
                  <span className="text-[#374151] font-medium">"{term.term}"</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <div className="h-1.5 w-16 rounded-full bg-[#F3F4F6] overflow-hidden hidden sm:block">
                    <div
                      style={{ width: `${term.percentage * 3}%` }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                  <span className="text-[#111827] font-bold w-12 text-right">{term.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Sites & Apps Breakdown */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-[#5B5CE2]" />
              <span>External Apps & Websites Traffic</span>
            </h3>
            <span className="text-xs text-[#6B7280] font-mono">% of External Traffic</span>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {reach.externalSites.map((site, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#9CA3AF] w-4 font-semibold">#{i + 1}</span>
                  <span className="text-[#374151] font-medium">{site.site}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <div className="h-1.5 w-16 rounded-full bg-[#F3F4F6] overflow-hidden hidden sm:block">
                    <div
                      style={{ width: `${site.percentage * 2}%` }}
                      className="h-full bg-[#5B5CE2] rounded-full"
                    />
                  </div>
                  <span className="text-[#111827] font-bold w-12 text-right">{site.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
