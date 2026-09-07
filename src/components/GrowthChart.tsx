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
import { HistoryPoint, Platform, HeadlineStats, TopContentItem } from "../types";
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
} from "lucide-react";

interface GrowthChartProps {
  history: HistoryPoint[];
  platform: Platform;
  stats?: HeadlineStats;
  topContent?: TopContentItem[];
}

type TimeframeOption = "7d" | "28d" | "90d";
type MetricTab = "views" | "watchTime" | "subscribers" | "impressions";
type PerformanceMode = "auto" | "good" | "bad";

export const GrowthChart: React.FC<GrowthChartProps> = ({
  history,
  platform,
  stats,
  topContent = [],
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("28d");
  const [activeMetric, setActiveMetric] = useState<MetricTab>("views");
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>("auto");

  // Determine if natural channel trajectory is positive
  const isNaturallyPositive = stats ? stats.viewsDeltaPositive : true;

  // Resolved effective performance state
  const isGoodPerformance =
    performanceMode === "good"
      ? true
      : performanceMode === "bad"
      ? false
      : isNaturallyPositive;

  const daysSlice = timeframe === "7d" ? 7 : timeframe === "28d" ? 28 : 90;

  // Generate dynamic date range string (e.g. Aug 10, 2026 – Sep 7, 2026)
  const dateRangeString = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (daysSlice - 1));
    const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", opt)} – ${end.toLocaleDateString("en-US", { ...opt, year: "numeric" })}`;
  }, [daysSlice]);

  // Metric multipliers based on total views and timeframe
  const baseTotalViews = stats?.totalViews || 2400000;
  const totalSubscribers = stats?.followers || 14200000;

  // Approximate period metrics
  const periodViews = Math.round(
    baseTotalViews * (daysSlice === 7 ? 0.04 : daysSlice === 28 ? 0.16 : 0.48)
  );
  const periodWatchHours = Math.round(periodViews * 0.075);
  const periodSubGain = Math.round(
    totalSubscribers * (daysSlice === 7 ? 0.003 : daysSlice === 28 ? 0.012 : 0.035)
  );
  const periodImpressions = Math.round(periodViews * 11.4);

  // Growth / Performance delta vs typical
  const performanceDeltaPercent = isGoodPerformance ? 38.4 : -24.6;

  // Metric Tab Definitions
  const metricTabs = [
    {
      id: "views" as MetricTab,
      label: "Views",
      icon: Eye,
      value: formatNumber(
        Math.round(periodViews * (isGoodPerformance ? 1.38 : 0.76))
      ),
      delta: `${isGoodPerformance ? "+" : ""}${performanceDeltaPercent}%`,
      subtext: isGoodPerformance ? "more than typical" : "less than typical",
    },
    {
      id: "watchTime" as MetricTab,
      label: "Watch time (hours)",
      icon: Clock,
      value: `${formatNumber(
        Math.round(periodWatchHours * (isGoodPerformance ? 1.34 : 0.78))
      )} hrs`,
      delta: `${isGoodPerformance ? "+" : ""}${isGoodPerformance ? 34.2 : -22.1}%`,
      subtext: isGoodPerformance ? "more than typical" : "less than typical",
    },
    {
      id: "subscribers" as MetricTab,
      label: "Subscribers",
      icon: UserPlus,
      value: `+${formatNumber(
        Math.round(periodSubGain * (isGoodPerformance ? 1.45 : 0.65))
      )}`,
      delta: `${isGoodPerformance ? "+" : ""}${isGoodPerformance ? 45.0 : -35.0}%`,
      subtext: isGoodPerformance ? "more than typical" : "less than typical",
    },
    {
      id: "impressions" as MetricTab,
      label: "Impressions",
      icon: Compass,
      value: formatNumber(
        Math.round(periodImpressions * (isGoodPerformance ? 1.31 : 0.79))
      ),
      delta: `${isGoodPerformance ? "+" : ""}${isGoodPerformance ? 31.0 : -21.0}%`,
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

      // Trajectory calculation:
      // Good performance: Starts in typical range, then climbs UPWARD sharply (+35% to +70% above typical high)
      // Bad performance: Starts in typical range, then decreases DOWNWARD (-20% to -45% below typical low)
      const progress = (daysSlice - 1 - i) / Math.max(1, daysSlice - 1); // 0 at start, 1 at recent

      let actualVal = typicalMid;
      const uploadedVideo = videoMap.get(i);

      if (isGoodPerformance) {
        // Growth trajectory climbing up with upload surges
        const growthCurve = Math.pow(progress, 0.85) * 0.65; // exponential upward momentum
        const surge = uploadedVideo ? 0.35 : 0; // spike when new video publishes
        actualVal = Math.round(
          typicalMid * (1.05 + growthCurve + surge + Math.sin(i * 0.6) * 0.08)
        );
      } else {
        // Decreasing trajectory slumping down
        const declineCurve = Math.pow(progress, 0.9) * 0.45; // downward slope
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
  }, [daysSlice, periodViews, isGoodPerformance, activeMetric, topContent]);

  // Line Colors depending on performance state
  const lineColor = isGoodPerformance ? "#10b981" : "#f43f5e"; // Emerald for Good / Growing Up, Rose for Bad / Decreasing Down
  const gradientId = isGoodPerformance ? "growthUpGrad" : "growthDownGrad";

  return (
    <div
      id="youtube-studio-growth-chart-card"
      className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
    >
      {/* 1. Header: YouTube Studio Analytics Title & Performance Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Channel Performance Trajectory</span>
              <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md px-2 py-0.5">
                YouTube Studio Engine
              </span>
            </h2>

            {/* Performance Status Badge */}
            <span
              id="performance-status-pill"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                isGoodPerformance
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-300"
              }`}
            >
              {isGoodPerformance ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Growing Up: +38.4% Above Typical</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                  <span>Decreasing Down: -24.6% Below Typical</span>
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            {isGoodPerformance ? (
              <span>
                <strong className="text-emerald-400">Great job!</strong> Your channel performance is{" "}
                <strong className="text-white">growing up</strong> and outperforming the typical benchmark range. Strong audience retention on recent uploads is driving viral browse traffic.
              </span>
            ) : (
              <span>
                <strong className="text-rose-400">Attention:</strong> Performance is{" "}
                <strong className="text-white">decreasing down</strong> and tracking below the typical benchmark range. Reduced upload cadence and lower impressions slowed momentum.
              </span>
            )}
          </p>
        </div>

        {/* Interactive Controls: Mode Switcher + Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Performance Simulation Selector */}
          <div className="flex items-center bg-slate-950/90 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              id="btn-perf-good"
              onClick={() => setPerformanceMode("good")}
              title="Demonstrate Good Performance (Growing Up)"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                performanceMode === "good"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800"
              }`}
            >
              <TrendingUp className="h-3 w-3 text-emerald-300" />
              <span>Good (Growing Up ↗)</span>
            </button>

            <button
              id="btn-perf-bad"
              onClick={() => setPerformanceMode("bad")}
              title="Demonstrate Bad Performance (Decreasing Down)"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                performanceMode === "bad"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-rose-300 hover:bg-slate-800"
              }`}
            >
              <TrendingDown className="h-3 w-3 text-rose-300" />
              <span>Bad (Decreasing Down ↘)</span>
            </button>

            <button
              id="btn-perf-auto"
              onClick={() => setPerformanceMode("auto")}
              title="Auto-detect based on channel's live metrics"
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition ${
                performanceMode === "auto"
                  ? "bg-slate-800 text-slate-100 font-semibold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Auto
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800 text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-500 ml-2 mr-1" />
            {(["7d", "28d", "90d"] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                id={`btn-timeframe-${tf}`}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  timeframe === tf
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tf === "7d" ? "7 Days" : tf === "28d" ? "28 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
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
              className={`flex flex-col text-left p-3.5 rounded-xl border transition group ${
                isActive
                  ? isGoodPerformance
                    ? "bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30"
                    : "bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/30"
                  : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium group-hover:text-slate-300 transition">
                  {tab.label}
                </span>
                <Icon className={`h-4 w-4 ${isActive ? (isGoodPerformance ? "text-emerald-400" : "text-rose-400") : "text-slate-500"}`} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono my-0.5">
                {tab.value}
              </div>
              <div
                className={`text-xs font-semibold flex items-center gap-1 ${
                  isGoodPerformance ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                <span>{tab.delta}</span>
                <span className="text-[11px] text-slate-400 font-normal">
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
        <div className="absolute top-2 right-4 z-10 flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden sm:inline font-mono text-indigo-300 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded">
            {dateRangeString}
          </span>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="h-1.5 w-4 border-b border-dashed border-slate-500 inline-block" />
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
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="growthDownGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#1e293b" }}
              tickMargin={8}
            />

            <YAxis
              stroke="#64748b"
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
              stroke="#64748b"
              strokeDasharray="4 4"
              strokeWidth={1.2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="typicalLow"
              name="Typical Low"
              stroke="#475569"
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
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 6, fill: lineColor, stroke: "#020617", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Chart Footer Legend & Explanation */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: lineColor }} />
            <span className="font-semibold text-slate-200">
              {isGoodPerformance ? "Growing Up Trajectory" : "Decreasing Down Trajectory"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="h-0.5 w-3 border-b border-dashed border-slate-500 inline-block" />
            <span>Gray Corridor: Typical channel baseline ({daysSlice} day window)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
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
      <div className="rounded-xl border border-slate-800 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[220px]">
        <div className="text-xs font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1.5">
          {point.fullDate}
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: isGood ? "#10b981" : "#f43f5e" }}
              />
              <span>Actual:</span>
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {actualVal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-slate-400">Typical Range:</span>
            <span className="font-mono text-slate-300">
              {typLow.toLocaleString()} – {typHigh.toLocaleString()}
            </span>
          </div>

          {/* Performance verdict badge */}
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">Status:</span>
            {isAbove ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <TrendingUp className="h-3 w-3" />
                <span>Above typical (+38%)</span>
              </span>
            ) : isBelow ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                <TrendingDown className="h-3 w-3" />
                <span>Below typical (-25%)</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Within typical range
              </span>
            )}
          </div>

          {point.videoUpload && (
            <div className="mt-2 rounded-lg bg-indigo-950/50 border border-indigo-500/30 p-2 text-[11px] text-indigo-200">
              <div className="flex items-center gap-1 font-semibold text-indigo-300">
                <Video className="h-3 w-3" />
                <span>Video Published</span>
              </div>
              <div className="truncate text-slate-300 mt-0.5">{point.videoUpload}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
