import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { HistoryPoint, Platform, HeadlineStats, TopContentItem, VideoAnalyticsData } from "../types";
import { formatNumber } from "../utils/mockGenerator";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  Video,
  Eye,
  Clock,
  UserPlus,
  Compass,
  ThumbsUp,
  Percent,
} from "lucide-react";

interface GrowthChartProps {
  history: HistoryPoint[];
  platform: Platform;
  stats?: HeadlineStats;
  topContent?: TopContentItem[];
  videoAnalytics?: VideoAnalyticsData | null;
}

type TimeframeOption = "7d" | "28d" | "90d";
type MetricTab = "views" | "watchTime" | "subscribers" | "impressions";
type PerformanceMode = "auto" | "good" | "bad";

export const GrowthChart: React.FC<GrowthChartProps> = ({
  history,
  platform,
  stats,
  topContent = [],
  videoAnalytics,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("28d");
  const [activeMetric, setActiveMetric] = useState<MetricTab>("views");
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>("auto");

  // 1. Channel Baseline & Recent Uploads Analytics
  const channelAvgViews = useMemo(() => {
    if (!stats) return 500_000;
    return Math.max(1000, Math.round(stats.totalViews / Math.max(1, stats.postsCount)));
  }, [stats]);

  const recentUploadMetrics = useMemo(() => {
    if (videoAnalytics) {
      const vidLikes = videoAnalytics.likes || 0;
      const vidViews = Math.max(1, videoAnalytics.views || 1);
      const likeRate = Number(((vidLikes / vidViews) * 100).toFixed(1));
      return {
        avgViews: videoAnalytics.views,
        avgLikes: vidLikes,
        likeRate,
        avgEngagement: videoAnalytics.engagementRate || 1.8,
      };
    }

    if (!topContent || topContent.length === 0) {
      return {
        avgViews: channelAvgViews,
        avgLikes: Math.round(channelAvgViews * 0.035),
        likeRate: 3.5,
        avgEngagement: stats?.engagementRate || 2.8,
      };
    }

    const sample = topContent.slice(0, 4);
    const sumViews = sample.reduce((acc, v) => acc + (v.views || 0), 0);
    const sumLikes = sample.reduce((acc, v) => acc + (v.likes || 0), 0);
    const avgViews = Math.round(sumViews / sample.length);
    const avgLikes = Math.round(sumLikes / sample.length);
    const likeRate = Number(((avgLikes / Math.max(1, avgViews)) * 100).toFixed(1));
    const avgEngagement = Number(
      (sample.reduce((acc, v) => acc + (v.engagementRate || 0), 0) / sample.length).toFixed(1)
    );
    return { avgViews, avgLikes, likeRate, avgEngagement };
  }, [topContent, videoAnalytics, channelAvgViews, stats?.engagementRate]);

  // 2. Naturally detected performance delta from real data
  const { naturalDelta, isNaturallyPositive, naturalViewsDelta, naturalLikesDelta } = useMemo(() => {
    // If stats already contains trajectory data from server:
    if (stats?.trajectoryPercent !== undefined) {
      const pDelta = stats.trajectoryPercent;
      const vDelta = stats.viewsHealth?.deltaPercent ?? pDelta;
      const lDelta = stats.likesHealth?.deltaPercent ?? ((recentUploadMetrics.likeRate - 3.5) / 3.5) * 100;
      return {
        naturalDelta: pDelta,
        isNaturallyPositive: pDelta >= 0,
        naturalViewsDelta: vDelta,
        naturalLikesDelta: lDelta,
      };
    }

    // If videoAnalytics is provided with comparative benchmark
    if (videoAnalytics?.vsChannelAverage) {
      const vDelta = parseFloat(videoAnalytics.vsChannelAverage.viewsDeltaPercent.replace("%", "")) || -54;
      const lRatio = videoAnalytics.likeRatio ?? recentUploadMetrics.likeRate;
      const lDelta = ((lRatio - 3.5) / 3.5) * 100;
      const composite = Number(((vDelta * 0.7) + (lDelta * 0.3)).toFixed(1));
      return {
        naturalDelta: composite,
        isNaturallyPositive: composite >= 0,
        naturalViewsDelta: vDelta,
        naturalLikesDelta: lDelta,
      };
    }

    // From channel stats and recent uploads
    const vDeltaRaw = ((recentUploadMetrics.avgViews - channelAvgViews) / Math.max(1, channelAvgViews)) * 100;
    const vDelta = Math.max(-85, Math.min(180, Number(vDeltaRaw.toFixed(1))));
    const lDeltaRaw = ((recentUploadMetrics.likeRate - 3.5) / 3.5) * 100;
    const lDelta = Math.max(-85, Math.min(150, Number(lDeltaRaw.toFixed(1))));
    const composite = Number(((vDelta * 0.65) + (lDelta * 0.35)).toFixed(1));

    return {
      naturalDelta: composite,
      isNaturallyPositive: composite >= 0,
      naturalViewsDelta: vDelta,
      naturalLikesDelta: lDelta,
    };
  }, [stats, videoAnalytics, recentUploadMetrics, channelAvgViews]);

  // 3. Resolved effective performance state (User override or Auto)
  const isGoodPerformance =
    performanceMode === "good"
      ? true
      : performanceMode === "bad"
      ? false
      : isNaturallyPositive;

  // 4. Resolved dynamic percentage
  const effectiveDeltaPercent = useMemo(() => {
    if (performanceMode === "good") {
      return naturalDelta > 0 ? naturalDelta : Math.max(24.5, Math.abs(naturalDelta) || 38.4);
    }
    if (performanceMode === "bad") {
      return naturalDelta < 0 ? naturalDelta : -Math.max(18.5, Math.abs(naturalDelta) || 24.6);
    }
    return naturalDelta;
  }, [performanceMode, naturalDelta]);

  const effectiveViewsDelta = useMemo(() => {
    if (performanceMode === "good") {
      return naturalViewsDelta > 0 ? naturalViewsDelta : 38.4;
    }
    if (performanceMode === "bad") {
      return naturalViewsDelta < 0 ? naturalViewsDelta : -34.5;
    }
    return naturalViewsDelta;
  }, [performanceMode, naturalViewsDelta]);

  const effectiveLikesDelta = useMemo(() => {
    if (performanceMode === "good") {
      return naturalLikesDelta > 0 ? naturalLikesDelta : 18.2;
    }
    if (performanceMode === "bad") {
      return naturalLikesDelta < 0 ? naturalLikesDelta : -28.4;
    }
    return naturalLikesDelta;
  }, [performanceMode, naturalLikesDelta]);

  const absPerfDelta = Math.abs(effectiveDeltaPercent).toFixed(1);

  const daysSlice = timeframe === "7d" ? 7 : timeframe === "28d" ? 28 : 90;

  // Generate dynamic date range string
  const dateRangeString = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (daysSlice - 1));
    const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", opt)} – ${end.toLocaleDateString("en-US", { ...opt, year: "numeric" })}`;
  }, [daysSlice]);

  // Base metrics from stats
  const baseTotalViews = stats?.totalViews || 2400000;
  const totalSubscribers = stats?.followers || 14200000;

  // Multiplier scaling based on effective delta
  const performanceMultiplier = isGoodPerformance 
    ? Math.min(2.2, 1 + Math.abs(effectiveDeltaPercent) / 100)
    : Math.max(0.38, 1 - Math.abs(effectiveDeltaPercent) / 100);

  // Approximate period metrics
  const periodViews = Math.round(
    baseTotalViews * (daysSlice === 7 ? 0.04 : daysSlice === 28 ? 0.16 : 0.48)
  );
  const periodWatchHours = Math.round(periodViews * 0.075);
  const periodSubGain = Math.round(
    totalSubscribers * (daysSlice === 7 ? 0.003 : daysSlice === 28 ? 0.012 : 0.035)
  );
  const periodImpressions = Math.round(periodViews * 11.4);

  // Dynamic Metric Tab Definitions
  const viewsTabDelta = `${effectiveViewsDelta >= 0 ? "+" : ""}${effectiveViewsDelta.toFixed(1)}%`;
  const watchTimeTabDelta = `${isGoodPerformance ? "+" : "-"}${(Math.abs(effectiveDeltaPercent) * 0.88).toFixed(1)}%`;
  const subscribersTabDelta = `${isGoodPerformance ? "+" : "-"}${(Math.abs(effectiveDeltaPercent) * 0.95).toFixed(1)}%`;
  const impressionsTabDelta = `${isGoodPerformance ? "+" : "-"}${(Math.abs(effectiveDeltaPercent) * 0.82).toFixed(1)}%`;

  const metricTabs = [
    {
      id: "views" as MetricTab,
      label: "Views",
      icon: Eye,
      value: formatNumber(Math.round(periodViews * performanceMultiplier)),
      delta: viewsTabDelta,
      subtext: effectiveViewsDelta >= 0 ? "more than typical" : "less than typical",
    },
    {
      id: "watchTime" as MetricTab,
      label: "Watch time (hours)",
      icon: Clock,
      value: `${formatNumber(Math.round(periodWatchHours * (isGoodPerformance ? 1.34 : 0.78)))} hrs`,
      delta: watchTimeTabDelta,
      subtext: isGoodPerformance ? "more than typical" : "less than typical",
    },
    {
      id: "subscribers" as MetricTab,
      label: "Subscribers",
      icon: UserPlus,
      value: `${isGoodPerformance ? "+" : ""}${formatNumber(Math.round(periodSubGain * (isGoodPerformance ? 1.45 : 0.65)))}`,
      delta: subscribersTabDelta,
      subtext: isGoodPerformance ? "more than typical" : "less than typical",
    },
    {
      id: "impressions" as MetricTab,
      label: "Impressions",
      icon: Compass,
      value: formatNumber(Math.round(periodImpressions * (isGoodPerformance ? 1.31 : 0.79))),
      delta: impressionsTabDelta,
      subtext: isGoodPerformance ? "more than typical" : "less than typical",
    },
  ];

  // Build sequential daily points with typical corridor and actual trajectory
  const chartData = useMemo(() => {
    const today = new Date();
    const points = [];
    const baseDailyViews = Math.max(1000, Math.round(periodViews / daysSlice));

    // Map videos into days for upload markers
    const videoMap = new Map<number, TopContentItem>();
    if (topContent && topContent.length > 0) {
      topContent.slice(0, 3).forEach((vid, idx) => {
        const dayOffset = Math.min(daysSlice - 2, 3 + idx * Math.floor(daysSlice / 3.5));
        videoMap.set(dayOffset, vid);
      });
    }

    const perfRatio = Math.abs(effectiveDeltaPercent) / 100;

    for (let i = daysSlice - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const fullDate = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Typical Corridor Benchmark (25th to 75th percentile range)
      const typicalMid = baseDailyViews;
      const typicalLow = Math.round(typicalMid * 0.78);
      const typicalHigh = Math.round(typicalMid * 1.22);

      const progress = (daysSlice - 1 - i) / Math.max(1, daysSlice - 1); // 0 at start, 1 at recent

      let actualVal = typicalMid;
      const uploadedVideo = videoMap.get(i);

      if (isGoodPerformance) {
        // Growth trajectory climbing up with upload surges
        const growthCurve = Math.pow(progress, 0.85) * (0.35 + perfRatio * 0.65);
        const surge = uploadedVideo ? 0.35 : 0;
        actualVal = Math.round(
          typicalMid * (1.05 + growthCurve + surge + Math.sin(i * 0.6) * 0.08)
        );
      } else {
        // Decreasing trajectory slumping down below typical corridor
        const declineCurve = Math.pow(progress, 0.9) * (0.2 + perfRatio * 0.6);
        actualVal = Math.round(
          typicalMid * (0.95 - declineCurve + Math.cos(i * 0.5) * 0.06)
        );
      }

      // Convert actual value depending on selected metric
      let metricValue = actualVal;
      let metricTypicalLow = typicalLow;
      let metricTypicalHigh = typicalHigh;

      if (activeMetric === "watchTime") {
        metricValue = Math.round(actualVal * 0.075);
        metricTypicalLow = Math.round(typicalLow * 0.075);
        metricTypicalHigh = Math.round(typicalHigh * 0.075);
      } else if (activeMetric === "subscribers") {
        metricValue = Math.round(actualVal * 0.005);
        metricTypicalLow = Math.round(typicalLow * 0.005);
        metricTypicalHigh = Math.round(typicalHigh * 0.005);
      } else if (activeMetric === "impressions") {
        metricValue = Math.round(actualVal * 11.4);
        metricTypicalLow = Math.round(typicalLow * 11.4);
        metricTypicalHigh = Math.round(typicalHigh * 11.4);
      }

      points.push({
        date: dateLabel,
        fullDate,
        value: metricValue,
        typicalLow: metricTypicalLow,
        typicalHigh: metricTypicalHigh,
        typicalMid: Math.round((metricTypicalLow + metricTypicalHigh) / 2),
        isAboveTypical: metricValue > metricTypicalHigh,
        isBelowTypical: metricValue < metricTypicalLow,
        videoUpload: uploadedVideo ? uploadedVideo.title : null,
      });
    }

    return points;
  }, [daysSlice, periodViews, isGoodPerformance, activeMetric, topContent, effectiveDeltaPercent]);

  // Line Colors depending on performance state
  const lineColor = isGoodPerformance ? "#059669" : "#DC2626"; // Emerald for Good / Growing Up, Red for Bad / Decreasing Down
  const gradientId = isGoodPerformance ? "growthUpGrad" : "growthDownGrad";

  return (
    <div
      id="youtube-studio-growth-chart-card"
      className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs"
    >
      {/* 1. Header: YouTube Studio Analytics Title & Performance Controls */}
      <div className="flex flex-col gap-4 pb-5 border-b border-[#E5E7EB]">
        {/* Top Row: Title, Engine Badge, and Interactive Simulation/Timeframe Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#111827] tracking-tight whitespace-nowrap">
              Channel Performance Trajectory
            </h2>
            <span className="text-xs font-medium text-[#5B5CE2] bg-[#EEF2FF] border border-[#E0E7FF] rounded-md px-2 py-0.5 whitespace-nowrap">
              YouTube Studio Engine
            </span>
          </div>

          {/* Interactive Controls: Mode Switcher + Timeframe Selector */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Performance Simulation Selector */}
            <div className="flex items-center bg-[#F3F4F6] rounded-xl p-1 border border-[#E5E7EB] text-xs">
              <button
                id="btn-perf-good"
                onClick={() => setPerformanceMode("good")}
                title="Demonstrate Good Performance (Growing Up)"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  performanceMode === "good"
                    ? "bg-[#059669] text-white shadow-xs"
                    : "text-[#4B5563] hover:text-[#059669] hover:bg-[#E5E7EB]"
                }`}
              >
                <TrendingUp className="h-3 w-3" />
                <span>Good (Growing ↗)</span>
              </button>

              <button
                id="btn-perf-bad"
                onClick={() => setPerformanceMode("bad")}
                title="Demonstrate Bad Performance (Decreasing Down)"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  performanceMode === "bad"
                    ? "bg-[#DC2626] text-white shadow-xs"
                    : "text-[#4B5563] hover:text-[#DC2626] hover:bg-[#E5E7EB]"
                }`}
              >
                <TrendingDown className="h-3 w-3" />
                <span>Bad (Down ↘)</span>
              </button>

              <button
                id="btn-perf-auto"
                onClick={() => setPerformanceMode("auto")}
                title="Auto-detect based on channel's live metrics"
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  performanceMode === "auto"
                    ? "bg-white text-[#111827] font-semibold border border-[#E5E7EB] shadow-xs"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <span>Auto</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                    isNaturallyPositive ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#FEF2F2] text-[#DC2626]"
                  }`}
                >
                  {isNaturallyPositive ? `+${Math.abs(naturalDelta).toFixed(0)}%` : `-${Math.abs(naturalDelta).toFixed(0)}%`}
                </span>
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center bg-[#F3F4F6] rounded-xl p-1 border border-[#E5E7EB] text-xs">
              <Calendar className="h-3.5 w-3.5 text-[#6B7280] ml-2 mr-1" />
              {(["7d", "28d", "90d"] as TimeframeOption[]).map((tf) => (
                <button
                  key={tf}
                  id={`btn-timeframe-${tf}`}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    timeframe === tf
                      ? "bg-white text-[#111827] font-semibold border border-[#E5E7EB] shadow-xs"
                      : "text-[#4B5563] hover:text-[#111827]"
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row: Horizontal Trajectory Metrics Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {/* Dynamic Performance Status Badge */}
          <span
            id="performance-status-pill"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold border transition-all shrink-0 whitespace-nowrap ${
              isGoodPerformance
                ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
                : "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
            }`}
          >
            {isGoodPerformance ? (
              <>
                <TrendingUp className="h-3.5 w-3.5 text-[#059669]" />
                <span>Growing Up: +{absPerfDelta}% Above Typical</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3.5 w-3.5 text-[#DC2626]" />
                <span>Decreasing Down: -{absPerfDelta}% Below Typical</span>
              </>
            )}
          </span>

          {/* Dynamic Real-time Metric Breakdown Chips */}
          <span
            id="metric-chip-views"
            className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg border transition shrink-0 whitespace-nowrap ${
              effectiveViewsDelta >= 0
                ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                : "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Views:</span>
            <span className="font-bold">{effectiveViewsDelta >= 0 ? "+" : ""}{effectiveViewsDelta.toFixed(1)}%</span>
            <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${
              effectiveViewsDelta >= 0 ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#FEE2E2] text-[#DC2626]"
            }`}>
              {effectiveViewsDelta >= 0 ? "Above Avg" : "Below Avg"}
            </span>
          </span>

          <span
            id="metric-chip-likes"
            className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg border transition shrink-0 whitespace-nowrap ${
              effectiveLikesDelta >= 0
                ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                : "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Like Ratio:</span>
            <span className="font-bold">{recentUploadMetrics.likeRate}%</span>
            <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${
              effectiveLikesDelta >= 0 ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#FEE2E2] text-[#DC2626]"
            }`}>
              {effectiveLikesDelta >= 0 ? "+" : ""}{effectiveLikesDelta.toFixed(1)}%
            </span>
          </span>

          <span
            id="metric-chip-engagement"
            className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg border transition shrink-0 whitespace-nowrap ${
              recentUploadMetrics.avgEngagement >= 2.5
                ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                : "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
            }`}
          >
            <Percent className="h-3 w-3" />
            <span>Engagement:</span>
            <span className="font-bold">{recentUploadMetrics.avgEngagement}%</span>
            <span className={`text-[10px] px-1 py-0.5 rounded font-semibold ${
              recentUploadMetrics.avgEngagement >= 2.5 ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#FEE2E2] text-[#DC2626]"
            }`}>
              {recentUploadMetrics.avgEngagement >= 2.5 ? "Healthy" : "Low"}
            </span>
          </span>
        </div>

        {/* Dynamic Explanatory Text */}
        <p className="text-xs text-[#4B5563] leading-relaxed max-w-3xl">
          {isGoodPerformance ? (
            <span>
              <strong className="text-[#059669]">Great job!</strong> Your channel performance is{" "}
              <strong className="text-[#111827]">growing up (+{absPerfDelta}%)</strong> and outperforming the typical benchmark range. Views on recent uploads (~{formatNumber(recentUploadMetrics.avgViews)}) and like-to-view ratios ({recentUploadMetrics.likeRate}%) are driving strong organic browse traffic.
            </span>
          ) : (
            <span>
              <strong className="text-[#DC2626]">Attention:</strong> Performance is{" "}
              <strong className="text-[#111827]">decreasing down (-{absPerfDelta}%)</strong> and tracking below the typical benchmark range. Reduced views on recent uploads (~{formatNumber(recentUploadMetrics.avgViews)} vs ~{formatNumber(channelAvgViews)} channel baseline) and a lower like-to-view ratio ({recentUploadMetrics.likeRate}% vs 3.5% typical) have slowed momentum.
            </span>
          )}
        </p>
      </div>

      {/* 2. YouTube Studio Metric Cards Strip (Clickable Tabs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-5">
        {metricTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMetric === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id)}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition group cursor-pointer ${
                isActive
                  ? isGoodPerformance
                    ? "bg-[#ECFDF5] border-[#A7F3D0] shadow-xs"
                    : "bg-[#FEF2F2] border-[#FECACA] shadow-xs"
                  : "bg-[#F8FAFC] border-[#E5E7EB] hover:bg-[#F1F5F9] hover:border-[#D1D5DB]"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                <span className="font-medium group-hover:text-[#111827] transition">
                  {tab.label}
                </span>
                <Icon className={`h-4 w-4 ${isActive ? (isGoodPerformance ? "text-[#059669]" : "text-[#DC2626]") : "text-[#9CA3AF]"}`} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight font-mono my-0.5">
                {tab.value}
              </div>
              <div
                className={`text-xs font-semibold flex items-center gap-1 ${
                  isGoodPerformance ? "text-[#059669]" : "text-[#DC2626]"
                }`}
              >
                <span>{tab.delta}</span>
                <span className="text-[11px] text-[#6B7280] font-normal">
                  {tab.subtext}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. The Recharts Canvas with Typical Corridor and Growing Up / Decreasing Down Curve */}
      <div className="relative h-[320px] w-full">
        {/* Date range subtitle */}
        <div className="absolute top-2 right-4 z-10 flex items-center gap-3 text-xs text-[#6B7280]">
          <span className="hidden sm:inline font-mono text-[#5B5CE2] bg-[#EEF2FF] border border-[#E0E7FF] px-2 py-0.5 rounded">
            {dateRangeString}
          </span>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1 text-[#6B7280]">
              <span className="h-1.5 w-4 border-b border-dashed border-[#9CA3AF] inline-block" />
              <span>Typical Range</span>
            </span>
            <span className="flex items-center gap-1 font-semibold" style={{ color: lineColor }}>
              <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: lineColor }} />
              <span>{isGoodPerformance ? "Surging Up" : "Declining Down"}</span>
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 25, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="growthUpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="growthDownGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tickMargin={8}
            />

            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatNumber(val)}
            />

            <Tooltip content={<YouTubeStudioCustomTooltip isGood={isGoodPerformance} />} />

            {/* Typical Performance Benchmark Envelope (Dotted boundary lines) */}
            <Line
              type="monotone"
              dataKey="typicalHigh"
              name="Typical High"
              stroke="#9CA3AF"
              strokeDasharray="4 4"
              strokeWidth={1.2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="typicalLow"
              name="Typical Low"
              stroke="#CBD5E1"
              strokeDasharray="4 4"
              strokeWidth={1.2}
              dot={false}
            />

            {/* Main Active Performance Trajectory (Grows up or decreases down) */}
            <Area
              type="monotone"
              dataKey="value"
              name={activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}
              stroke={lineColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 5, fill: lineColor, stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Chart Footer Legend & Explanation */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3 text-xs text-[#6B7280]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: lineColor }} />
            <span className="font-semibold text-[#111827]">
              {isGoodPerformance ? "Growing Up Trajectory" : "Decreasing Down Trajectory"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B7280]">
            <span className="h-0.5 w-3 border-b border-dashed border-[#9CA3AF] inline-block" />
            <span>Gray Corridor: Typical channel baseline ({daysSlice} day window)</span>
          </div>
        </div>

        <div className="text-[11px] text-[#9CA3AF]">
          Updated live with YouTube Studio telemetry
        </div>
      </div>
    </div>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isGood: boolean;
}

const YouTubeStudioCustomTooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  isGood,
}) => {
  if (active && payload && payload.length) {
    const point = payload.find((p) => p.dataKey === "value")?.payload;
    if (!point) return null;

    const actualVal = point.value;
    const typLow = point.typicalLow;
    const typHigh = point.typicalHigh;
    const isAbove = point.isAboveTypical;
    const isBelow = point.isBelowTypical;

    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-lg min-w-[220px]">
        <div className="text-xs font-semibold text-[#111827] mb-2 border-b border-[#E5E7EB] pb-1.5">
          {point.fullDate}
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#6B7280] flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: isGood ? "#059669" : "#DC2626" }}
              />
              <span>Actual:</span>
            </span>
            <span className="font-mono font-bold text-[#111827] text-sm">
              {actualVal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-[#6B7280]">Typical Range:</span>
            <span className="font-mono text-[#4B5563]">
              {typLow.toLocaleString()} – {typHigh.toLocaleString()}
            </span>
          </div>

          {/* Performance verdict badge */}
          <div className="pt-1.5 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#6B7280]">Status:</span>
            {isAbove ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                <TrendingUp className="h-3 w-3" />
                <span>Above typical (+38%)</span>
              </span>
            ) : isBelow ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                <TrendingDown className="h-3 w-3" />
                <span>Below typical (-25%)</span>
              </span>
            ) : (
              <span className="text-[11px] text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded">
                Within typical range
              </span>
            )}
          </div>

          {point.videoUpload && (
            <div className="mt-2 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] p-2 text-[11px] text-[#4B5563]">
              <div className="flex items-center gap-1 font-semibold text-[#5B5CE2]">
                <Video className="h-3 w-3" />
                <span>Video Published</span>
              </div>
              <div className="truncate text-[#111827] mt-0.5">{point.videoUpload}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
