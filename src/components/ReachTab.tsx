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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-indigo-400" />
              <span>Impressions</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
              <ArrowUpRight className="h-3 w-3" />
              {reach.impressionsDelta}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {impressionsFormatted}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{reach.impressionsDelta}</span>
            <span>vs previous {period === "7d" ? "7 days" : period === "28d" ? "28 days" : "90 days"}</span>
          </div>
        </div>

        {/* Card 2: CTR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <MousePointerClick className="h-3.5 w-3.5 text-rose-400" />
              <span>Impressions CTR</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
              {reach.ctrDelta}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {reach.ctr}%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Above typical creator benchmark (4.0% – 7.0%)
          </div>
        </div>

        {/* Card 3: Views from Impressions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>Views from Impressions</span>
            </span>
            <span className="inline-flex rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              74% of views
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {viewsFromImpressionsFormatted}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            High algorithm distribution health
          </div>
        </div>

        {/* Card 4: Unique Viewers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sky-400" />
              <span>Unique Viewers</span>
            </span>
            <span className="inline-flex rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/20">
              Audience Reach
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {uniqueViewersFormatted}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Estimated distinct viewers in this window
          </div>
        </div>
      </div>

      {/* 2. Main Traffic Source Breakdown (Recharts Chart + List) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Visual Chart & Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="h-4 w-4 text-indigo-400" />
                <span>Traffic Source Types Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                How viewers discover this channel's content across YouTube's algorithm
              </p>
            </div>

            {/* Quick Filter Pill */}
            <div className="flex items-center gap-1 bg-slate-950/80 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setActiveTrafficView("all")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  activeTrafficView === "all"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setActiveTrafficView("search")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  activeTrafficView === "search"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTrafficView("external")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  activeTrafficView === "external"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 60]}
                  unit="%"
                  stroke="#64748b"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  width={110}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#fff",
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
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            {reach.trafficSources.map((source, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: TRAFFIC_COLORS[i % TRAFFIC_COLORS.length] }}
                    />
                    <span className="text-slate-300 font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">{source.viewsFormatted} views</span>
                    <span className="text-white font-bold">{source.percentage}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Impressions Funnel</span>
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                YouTube Algorithm
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Shows how effectively thumbnail impressions convert into video clicks and viewer watch time.
            </p>

            {/* Funnel Steps */}
            <div className="space-y-3">
              {/* Step 1: Impressions */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3">
                <div className="flex justify-between text-xs text-indigo-300 mb-1">
                  <span className="font-semibold">1. Total Impressions</span>
                  <span className="font-mono font-bold text-white">{impressionsFormatted}</span>
                </div>
                <div className="text-[11px] text-slate-400">100% video thumbnails shown to users</div>
              </div>

              {/* Connector Arrow */}
              <div className="flex justify-center -my-1 text-slate-600 text-xs">↓ {reach.ctr}% CTR</div>

              {/* Step 2: Views from impressions */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
                <div className="flex justify-between text-xs text-rose-300 mb-1">
                  <span className="font-semibold">2. Views from Impressions</span>
                  <span className="font-mono font-bold text-white">{viewsFromImpressionsFormatted}</span>
                </div>
                <div className="text-[11px] text-slate-400">Viewers who clicked thumbnail</div>
              </div>

              {/* Connector Arrow */}
              <div className="flex justify-center -my-1 text-slate-600 text-xs">↓ Avg 6m 48s duration</div>

              {/* Step 3: Total Watch Time */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
                <div className="flex justify-between text-xs text-emerald-300 mb-1">
                  <span className="font-semibold">3. Watch Time Generated</span>
                  <span className="font-mono font-bold text-white">{studio.engagement.watchTimeFormatted}</span>
                </div>
                <div className="text-[11px] text-slate-400">Total watch hours accrued</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Algorithm Insight:</strong> High browse features (44.6%) indicate thumbnails and titles strongly satisfy YouTube's Home recommendation network.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Top Search Terms & External Sources Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* YouTube Search Terms Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="h-4 w-4 text-amber-400" />
              <span>Top YouTube Search Terms</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">% of Search Traffic</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {reach.topSearchTerms.map((term, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-slate-500 w-4 font-semibold">#{i + 1}</span>
                  <span className="text-slate-200 font-medium">"{term.term}"</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <div className="h-1.5 w-16 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                    <div
                      style={{ width: `${term.percentage * 3}%` }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-amber-300 font-bold w-12 text-right">{term.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Sites & Apps Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-sky-400" />
              <span>External Apps & Websites Traffic</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">% of External Traffic</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {reach.externalSites.map((site, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-slate-500 w-4 font-semibold">#{i + 1}</span>
                  <span className="text-slate-200 font-medium">{site.site}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <div className="h-1.5 w-16 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                    <div
                      style={{ width: `${site.percentage * 2}%` }}
                      className="h-full bg-sky-400 rounded-full"
                    />
                  </div>
                  <span className="text-sky-300 font-bold w-12 text-right">{site.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
