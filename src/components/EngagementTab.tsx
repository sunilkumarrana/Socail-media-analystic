import React, { useState } from "react";
import { StudioAnalytics, Platform } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Clock,
  HeartHandshake,
  Activity,
  ThumbsUp,
  MessageSquare,
  Share2,
  MousePointerClick,
  Bookmark,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Info,
} from "lucide-react";

interface EngagementTabProps {
  studio: StudioAnalytics;
  platform?: Platform;
  period?: "7d" | "28d" | "90d";
  onPeriodChange?: (period: "7d" | "28d" | "90d") => void;
}

export const EngagementTab: React.FC<EngagementTabProps> = ({
  studio,
  period = "28d",
}) => {
  const [selectedRetentionPoint, setSelectedRetentionPoint] = useState<number | null>(null);

  const { engagement } = studio;

  // Interaction rates default fallbacks if not populated
  const interactionRates = engagement.interactionRates || {
    overallRate: 6.8,
    likesPerKViews: 54.2,
    commentsPerKViews: 6.2,
    sharesPerKViews: 11.4,
    cardClickRate: 2.1,
    endScreenRate: engagement.endScreenCtaRate || 4.9,
    saveToPlaylistRate: 3.4,
  };

  // Comparative Interaction Rates Chart Data (Channel vs Benchmark)
  const comparisonData = [
    {
      metric: "Likes / 1k",
      channel: interactionRates.likesPerKViews,
      benchmark: 38.0,
      unit: "/1k",
    },
    {
      metric: "Comments / 1k",
      channel: interactionRates.commentsPerKViews,
      benchmark: 3.5,
      unit: "/1k",
    },
    {
      metric: "Shares / 1k",
      channel: interactionRates.sharesPerKViews,
      benchmark: 6.0,
      unit: "/1k",
    },
    {
      metric: "End Screen %",
      channel: interactionRates.endScreenRate,
      benchmark: 2.5,
      unit: "%",
    },
    {
      metric: "Cards %",
      channel: interactionRates.cardClickRate,
      benchmark: 1.2,
      unit: "%",
    },
    {
      metric: "Saves %",
      channel: interactionRates.saveToPlaylistRate,
      benchmark: 1.8,
      unit: "%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Engagement Headline KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Watch Time */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Watch Time</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="h-3 w-3" />
              {engagement.watchTimeDelta}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {engagement.watchTimeFormatted}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Total viewer watch duration in {period === "7d" ? "7 days" : period === "28d" ? "28 days" : "90 days"}
          </div>
        </div>

        {/* Card 2: Average View Duration (AVD) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
              <span>Average View Duration (AVD)</span>
            </span>
            <span className="inline-flex rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
              +38% vs Typical
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {engagement.avgViewDuration}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Typical range: 04:15 – 05:30
          </div>
        </div>

        {/* Card 3: Average Percentage Viewed (APV) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
              <span>Avg Percentage Viewed</span>
            </span>
            <span className="inline-flex rounded bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-400 border border-violet-500/20">
              High Retention
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {engagement.avgPercentageViewed}%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Top tier completion for longform video
          </div>
        </div>

        {/* Card 4: Overall Interaction Rate */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-rose-400" />
              <span>Interaction Rate</span>
            </span>
            <span className="inline-flex rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
              Active Community
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {interactionRates.overallRate}%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Likes, comments &amp; shares per view
          </div>
        </div>
      </div>

      {/* 2. Interaction Rates Showcase & Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-rose-400" />
              <span>Viewer Interaction Rates Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Deep telemetry on how actively viewers interact, comment, share, and navigate via end screens
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950/80 px-3 py-1.5 border border-slate-800 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Benchmark: Top 10% YouTube Creators</span>
          </div>
        </div>

        {/* 6-Card Interaction Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* 1. Likes per 1k views */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-medium">Likes / 1k</span>
              <ThumbsUp className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {interactionRates.likesPerKViews}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-1">
              +42% above benchmark
            </div>
          </div>

          {/* 2. Comments velocity */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-medium">Comments / 1k</span>
              <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {interactionRates.commentsPerKViews}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-1">
              High conversation rate
            </div>
          </div>

          {/* 3. Shares velocity */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-medium">Shares / 1k</span>
              <Share2 className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {interactionRates.sharesPerKViews}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-1">
              Viral referral factor
            </div>
          </div>

          {/* 4. End Screen Element CTR */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-medium">End Screen CTR</span>
              <MousePointerClick className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {interactionRates.endScreenRate}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              2.1x YouTube avg (2.5%)
            </div>
          </div>

          {/* 5. Info Cards CTR */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-medium">Cards CTR</span>
              <Info className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {interactionRates.cardClickRate}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              In-video link clicks
            </div>
          </div>

          {/* 6. Save to playlist rate */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-medium">Saves / Library</span>
              <Bookmark className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {interactionRates.saveToPlaylistRate}%
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-1">
              High replay value
            </div>
          </div>
        </div>

        {/* Interaction Rates vs Platform Benchmarks Bar Chart */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-300">
              Interaction Metrics vs Platform Benchmark Averages
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <span className="text-slate-400">This Channel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="text-slate-400">YouTube Avg</span>
              </div>
            </div>
          </div>

          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#fff",
                  }}
                  formatter={(val: any, name: any) => [
                    `${val}`,
                    name === "channel" ? "This Channel" : "YouTube Avg",
                  ]}
                />
                <Bar dataKey="channel" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" fill="#475569" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Key Moments for Audience Retention Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Key Moments for Audience Retention</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Second-by-second viewer attention curve from video start (0%) to conclusion (100%)
            </p>
          </div>
          <span className="inline-flex rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
            78% Hook Retention at 0:30
          </span>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={engagement.retentionCurve}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="retentionGradEng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="percentOfVideo"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "0.75rem",
                  fontSize: "0.75rem",
                }}
                formatter={(val: any) => [`${val}%`, "Audience Still Watching"]}
                labelFormatter={(lbl) => `Video Timestamp: ${lbl}% into video`}
              />
              <Area
                type="monotone"
                dataKey="retentionPercent"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#retentionGradEng)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Retention Analysis Breakdown Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
            <div className="text-slate-400 font-medium">Intro Hook (First 30 Seconds)</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5">78% Retention</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Exceptional pacing prevents early drop-off and qualifies for high search rank.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
            <div className="text-slate-400 font-medium">Continuous Midpoint Retention</div>
            <div className="text-white font-bold text-sm mt-0.5">54% at 50% Mark</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Flat trajectory confirms audience finds the entire runtime valuable with no major dips.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
            <div className="text-slate-400 font-medium">End Screen CTA Handoff</div>
            <div className="text-rose-400 font-bold text-sm mt-0.5">{interactionRates.endScreenRate}% Click Rate</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Strong end-screen prompts direct satisfied viewers directly into another episode.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Top Playlists & Series Driving Watch Time */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Bookmark className="h-4 w-4 text-emerald-400" />
          <span>Top Playlists Driving Cumulative Watch Time</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          {engagement.topPlaylists.map((playlist, i) => (
            <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500 w-4 font-semibold">#{i + 1}</span>
                <span className="text-slate-200 font-medium">{playlist.title}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-emerald-400 font-bold">{playlist.views}</span>
                <span className="text-slate-500">views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
