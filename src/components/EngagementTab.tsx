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
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#059669]" />
              <span>Watch Time</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#059669] border border-[#A7F3D0]">
              <ArrowUpRight className="h-3 w-3" />
              {engagement.watchTimeDelta}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {engagement.watchTimeFormatted}
          </div>
          <div className="mt-2 text-xs text-[#6B7280]">
            Total viewer watch duration in {period === "7d" ? "7 days" : period === "28d" ? "28 days" : "90 days"}
          </div>
        </div>

        {/* Card 2: Average View Duration (AVD) */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#5B5CE2]" />
              <span>Average View Duration (AVD)</span>
            </span>
            <span className="inline-flex rounded bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#5B5CE2] border border-[#E0E7FF]">
              +38% vs Typical
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {engagement.avgViewDuration}
          </div>
          <div className="mt-2 text-xs text-[#6B7280]">
            Typical range: 04:15 – 05:30
          </div>
        </div>

        {/* Card 3: Average Percentage Viewed (APV) */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-[#5B5CE2]" />
              <span>Avg Percentage Viewed</span>
            </span>
            <span className="inline-flex rounded bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#5B5CE2] border border-[#E0E7FF]">
              High Retention
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {engagement.avgPercentageViewed}%
          </div>
          <div className="mt-2 text-xs text-[#6B7280]">
            Top tier completion for longform video
          </div>
        </div>

        {/* Card 4: Overall Interaction Rate */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-[#DC2626]" />
              <span>Interaction Rate</span>
            </span>
            <span className="inline-flex rounded bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-semibold text-[#DC2626] border border-[#FECACA]">
              Active Community
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
            {interactionRates.overallRate}%
          </div>
          <div className="mt-2 text-xs text-[#6B7280]">
            Likes, comments &amp; shares per view
          </div>
        </div>
      </div>

      {/* 2. Interaction Rates Showcase & Matrix */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-[#DC2626]" />
              <span>Viewer Interaction Rates Matrix</span>
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Deep telemetry on how actively viewers interact, comment, share, and navigate via end screens
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1.5 border border-[#E5E7EB] text-xs text-[#4B5563]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Benchmark: Top 10% YouTube Creators</span>
          </div>
        </div>

        {/* 6-Card Interaction Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* 1. Likes per 1k views */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 hover:border-[#D1D5DB] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-1.5">
              <span className="text-[11px] font-medium">Likes / 1k</span>
              <ThumbsUp className="h-3.5 w-3.5 text-[#5B5CE2]" />
            </div>
            <div className="text-xl font-bold text-[#111827] font-mono">
              {interactionRates.likesPerKViews}
            </div>
            <div className="text-[10px] text-[#059669] font-medium mt-1">
              +42% above benchmark
            </div>
          </div>

          {/* 2. Comments velocity */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 hover:border-[#D1D5DB] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-1.5">
              <span className="text-[11px] font-medium">Comments / 1k</span>
              <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-[#111827] font-mono">
              {interactionRates.commentsPerKViews}
            </div>
            <div className="text-[10px] text-[#059669] font-medium mt-1">
              High conversation rate
            </div>
          </div>

          {/* 3. Shares velocity */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 hover:border-[#D1D5DB] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-1.5">
              <span className="text-[11px] font-medium">Shares / 1k</span>
              <Share2 className="h-3.5 w-3.5 text-[#5B5CE2]" />
            </div>
            <div className="text-xl font-bold text-[#111827] font-mono">
              {interactionRates.sharesPerKViews}
            </div>
            <div className="text-[10px] text-[#059669] font-medium mt-1">
              Viral referral factor
            </div>
          </div>

          {/* 4. End Screen Element CTR */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 hover:border-[#D1D5DB] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-1.5">
              <span className="text-[11px] font-medium">End Screen CTR</span>
              <MousePointerClick className="h-3.5 w-3.5 text-[#DC2626]" />
            </div>
            <div className="text-xl font-bold text-[#111827] font-mono">
              {interactionRates.endScreenRate}%
            </div>
            <div className="text-[10px] text-[#6B7280] mt-1">
              2.1x YouTube avg (2.5%)
            </div>
          </div>

          {/* 5. Info Cards CTR */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 hover:border-[#D1D5DB] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-1.5">
              <span className="text-[11px] font-medium">Cards CTR</span>
              <Info className="h-3.5 w-3.5 text-[#5B5CE2]" />
            </div>
            <div className="text-xl font-bold text-[#111827] font-mono">
              {interactionRates.cardClickRate}%
            </div>
            <div className="text-[10px] text-[#6B7280] mt-1">
              In-video link clicks
            </div>
          </div>

          {/* 6. Save to playlist rate */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 hover:border-[#D1D5DB] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-1.5">
              <span className="text-[11px] font-medium">Saves / Library</span>
              <Bookmark className="h-3.5 w-3.5 text-[#059669]" />
            </div>
            <div className="text-xl font-bold text-[#111827] font-mono">
              {interactionRates.saveToPlaylistRate}%
            </div>
            <div className="text-[10px] text-[#059669] font-medium mt-1">
              High replay value
            </div>
          </div>
        </div>

        {/* Interaction Rates vs Platform Benchmarks Bar Chart */}
        <div className="pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-[#111827]">
              Interaction Metrics vs Platform Benchmark Averages
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#5B5CE2]" />
                <span className="text-[#6B7280]">This Channel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB]" />
                <span className="text-[#6B7280]">YouTube Avg</span>
              </div>
            </div>
          </div>

          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="metric" stroke="#6B7280" fontSize={11} axisLine={{ stroke: "#E5E7EB" }} />
                <YAxis stroke="#6B7280" fontSize={11} axisLine={{ stroke: "#E5E7EB" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#111827",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(val: any, name: any) => [
                    `${val}`,
                    name === "channel" ? "This Channel" : "YouTube Avg",
                  ]}
                />
                <Bar dataKey="channel" fill="#5B5CE2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" fill="#D1D5DB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Key Moments for Audience Retention Chart */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#059669]" />
              <span>Key Moments for Audience Retention</span>
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Second-by-second viewer attention curve from video start (0%) to conclusion (100%)
            </p>
          </div>
          <span className="inline-flex rounded bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#059669] border border-[#A7F3D0] self-start sm:self-auto">
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
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="percentOfVideo"
                stroke="#6B7280"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={11}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
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
                formatter={(val: any) => [`${val}%`, "Audience Still Watching"]}
                labelFormatter={(lbl) => `Video Timestamp: ${lbl}% into video`}
              />
              <Area
                type="monotone"
                dataKey="retentionPercent"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#retentionGradEng)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Retention Analysis Breakdown Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
            <div className="text-[#6B7280] font-medium">Intro Hook (First 30 Seconds)</div>
            <div className="text-[#059669] font-bold text-sm mt-0.5">78% Retention</div>
            <p className="text-[11px] text-[#6B7280] mt-1">
              Exceptional pacing prevents early drop-off and qualifies for high search rank.
            </p>
          </div>

          <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
            <div className="text-[#6B7280] font-medium">Continuous Midpoint Retention</div>
            <div className="text-[#111827] font-bold text-sm mt-0.5">54% at 50% Mark</div>
            <p className="text-[11px] text-[#6B7280] mt-1">
              Flat trajectory confirms audience finds the entire runtime valuable with no major dips.
            </p>
          </div>

          <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
            <div className="text-[#6B7280] font-medium">End Screen CTA Handoff</div>
            <div className="text-[#DC2626] font-bold text-sm mt-0.5">{interactionRates.endScreenRate}% Click Rate</div>
            <p className="text-[11px] text-[#6B7280] mt-1">
              Strong end-screen prompts direct satisfied viewers directly into another episode.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Top Playlists & Series Driving Watch Time */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 mb-4">
          <Bookmark className="h-4 w-4 text-[#059669]" />
          <span>Top Playlists Driving Cumulative Watch Time</span>
        </h3>

        <div className="divide-y divide-[#E5E7EB]">
          {engagement.topPlaylists.map((playlist, i) => (
            <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#9CA3AF] w-4 font-semibold">#{i + 1}</span>
                <span className="text-[#374151] font-medium">{playlist.title}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[#059669] font-bold">{playlist.views}</span>
                <span className="text-[#9CA3AF]">views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
