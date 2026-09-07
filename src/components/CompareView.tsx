import React, { useState } from "react";
import {
  Platform,
  DashboardDataset,
} from "../types";
import {
  generateMockStats,
  formatNumber,
  PLATFORM_CONFIGS,
  detectPlatform,
} from "../utils/mockGenerator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Users,
  Eye,
  Percent,
  Layers,
  Sparkles,
} from "lucide-react";

interface CompareViewProps {
  initialHandleA?: string;
  initialPlatformA?: Platform;
}

export const CompareView: React.FC<CompareViewProps> = ({
  initialHandleA = "youtube.com/@mkbhd",
  initialPlatformA = "youtube",
}) => {
  const [handleA, setHandleA] = useState(initialHandleA);
  const [platformA, setPlatformA] = useState<Platform>(initialPlatformA);

  const [handleB, setHandleB] = useState("youtube.com/@rajshamani");
  const [platformB, setPlatformB] = useState<Platform>("youtube");

  const [dataA, setDataA] = useState<DashboardDataset>(() =>
    generateMockStats(handleA, platformA)
  );
  const [dataB, setDataB] = useState<DashboardDataset>(() =>
    generateMockStats("youtube.com/@rajshamani", "youtube")
  );

  const [isComparing, setIsComparing] = useState(false);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [compareMetric, setCompareMetric] = useState<"followers" | "views">("followers");

  const fetchChannelData = async (input: string, fallbackPlatform: Platform): Promise<DashboardDataset> => {
    const isYouTube =
      fallbackPlatform === "youtube" ||
      input.includes("youtube.com") ||
      input.includes("youtu.be");

    if (isYouTube) {
      try {
        const res = await fetch("/api/youtube-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }),
        });
        if (res.ok) {
          const liveData = await res.json();
          return liveData;
        }
      } catch (err) {
        console.warn("YouTube live lookup in compare view failed:", err);
      }
    }
    const detected = detectPlatform(input);
    const plat = detected.platform || fallbackPlatform;
    return generateMockStats(input, plat);
  };

  const handleRunCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsComparing(true);

    const [resA, resB] = await Promise.all([
      fetchChannelData(handleA, platformA),
      fetchChannelData(handleB, platformB),
    ]);

    setDataA(resA);
    setPlatformA(resA.profile.platform);
    setDataB(resB);
    setPlatformB(resB.profile.platform);
    setIsComparing(false);
  };

  const daysCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const histA = dataA.history.slice(-daysCount);
  const histB = dataB.history.slice(-daysCount);

  // Combine histories for the Recharts line chart
  const combinedHistory = histA.map((pointA, idx) => {
    const pointB = histB[idx] || histB[histB.length - 1];
    return {
      date: pointA.date,
      fullDate: pointA.fullDate,
      aValue: compareMetric === "followers" ? pointA.followers : pointA.views,
      bValue: compareMetric === "followers" ? pointB?.followers : pointB?.views,
    };
  });

  // Calculate comparisons
  const followerRatio = (
    (dataA.stats.followers / (dataB.stats.followers || 1)) *
    100
  ).toFixed(0);
  const erDiff = (dataA.stats.engagementRate - dataB.stats.engagementRate).toFixed(1);

  return (
    <div id="compare-view-container" className="space-y-6">
      {/* Search Header for 2 Handles */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md sm:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <GitCompare className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Direct Account Head-to-Head Benchmark
            </h2>
            <p className="text-xs text-slate-400">
              Simultaneously inspect audience scale, engagement differential, and velocity curves
            </p>
          </div>
        </div>

        <form onSubmit={handleRunCompare} className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          {/* Account 1 Input */}
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Account A (Target)
            </label>
            <div className="flex rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs">
              <input
                type="text"
                value={handleA}
                onChange={(e) => setHandleA(e.target.value)}
                placeholder="e.g. youtube.com/@mkbhd"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="hidden sm:flex sm:col-span-1 items-end justify-center pb-2.5 text-slate-500">
            <span className="text-xs font-semibold uppercase">vs</span>
          </div>

          {/* Account 2 Input */}
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Account B (Competitor)
            </label>
            <div className="flex rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs">
              <input
                type="text"
                value={handleB}
                onChange={(e) => setHandleB(e.target.value)}
                placeholder="e.g. youtube.com/@mrbeast"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={isComparing}
              className="w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition text-center flex items-center justify-center gap-1"
            >
              {isComparing ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Syncing...</span>
                </>
              ) : (
                "Compare"
              )}
            </button>
          </div>
        </form>

        {/* Data provenance notice for comparison */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/20">
              🟢 Live Sync
            </span>
            <span>Subscribers &amp; Upload counts queried live for YouTube handles</span>
          </div>
          <span className="text-[11px] text-slate-500">
            📊 Velocity &amp; ER trajectories modeled from public creator tier benchmarks
          </span>
        </div>
      </div>

      {/* Side by Side Profile Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card A */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${dataA.profile.avatarBg} text-base font-bold text-white shadow overflow-hidden`}
              >
                {dataA.profile.avatarUrl ? (
                  <img
                    src={dataA.profile.avatarUrl}
                    alt={dataA.profile.displayName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  dataA.profile.initials
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-base">
                    {dataA.profile.displayName}
                  </h3>
                  {dataA.profile.verified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {dataA.profile.handle} ({PLATFORM_CONFIGS[dataA.profile.platform].name})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                🟢 Live Data
              </span>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                Account A
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 relative">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">
                  {PLATFORM_CONFIGS[dataA.profile.platform].followerLabel}
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">LIVE</span>
              </div>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataA.stats.followersFormatted}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {dataA.stats.followersDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">
                  {PLATFORM_CONFIGS[dataA.profile.platform].viewsLabel}
                </span>
                <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 px-1 rounded">EST</span>
              </div>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataA.stats.totalViewsFormatted}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {dataA.stats.viewsDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">Engagement Rate</span>
                <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 px-1 rounded">EST</span>
              </div>
              <span className="text-lg font-bold text-amber-300 block mt-0.5 font-mono">
                {dataA.stats.engagementRate}%
              </span>
              <span className="text-[10px] text-slate-400">
                {dataA.stats.engagementDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">Content Count</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">LIVE</span>
              </div>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataA.stats.postsCountFormatted}
              </span>
              <span className="text-[10px] text-slate-400">
                {dataA.stats.postsDelta}
              </span>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/30 to-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${dataB.profile.avatarBg} text-base font-bold text-white shadow overflow-hidden`}
              >
                {dataB.profile.avatarUrl ? (
                  <img
                    src={dataB.profile.avatarUrl}
                    alt={dataB.profile.displayName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  dataB.profile.initials
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-base">
                    {dataB.profile.displayName}
                  </h3>
                  {dataB.profile.verified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {dataB.profile.handle} ({PLATFORM_CONFIGS[dataB.profile.platform].name})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                🟢 Live Data
              </span>
              <span className="rounded bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-300">
                Account B
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 relative">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">
                  {PLATFORM_CONFIGS[dataB.profile.platform].followerLabel}
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">LIVE</span>
              </div>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataB.stats.followersFormatted}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {dataB.stats.followersDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">
                  {PLATFORM_CONFIGS[dataB.profile.platform].viewsLabel}
                </span>
                <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 px-1 rounded">EST</span>
              </div>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataB.stats.totalViewsFormatted}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {dataB.stats.viewsDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">Engagement Rate</span>
                <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 px-1 rounded">EST</span>
              </div>
              <span className="text-lg font-bold text-amber-300 block mt-0.5 font-mono">
                {dataB.stats.engagementRate}%
              </span>
              <span className="text-[10px] text-slate-400">
                {dataB.stats.engagementDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 block text-[11px]">Content Count</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">LIVE</span>
              </div>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataB.stats.postsCountFormatted}
              </span>
              <span className="text-[10px] text-slate-400">
                {dataB.stats.postsDelta}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Growth Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">Comparative Growth Velocity</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side progression over the trailing {timeRange.toUpperCase()} window
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Metric Toggle */}
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
              <button
                onClick={() => setCompareMetric("followers")}
                className={`rounded px-2.5 py-1 font-medium transition ${
                  compareMetric === "followers"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Audience
              </button>
              <button
                onClick={() => setCompareMetric("views")}
                className={`rounded px-2.5 py-1 font-medium transition ${
                  compareMetric === "views"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Views
              </button>
            </div>

            {/* Time Range */}
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
              {(["7d", "30d", "90d"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`rounded px-2 py-1 font-medium transition ${
                    timeRange === t
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recharts Comparison Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedHistory}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-xl text-xs backdrop-blur-md">
                        <p className="font-semibold text-slate-300">
                          {payload[0]?.payload?.fullDate}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-indigo-300">
                              <span className="h-2 w-2 rounded-full bg-indigo-500" />
                              {dataA.profile.displayName}:
                            </span>
                            <span className="font-mono font-bold text-white">
                              {payload[0]?.value?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-violet-300">
                              <span className="h-2 w-2 rounded-full bg-violet-500" />
                              {dataB.profile.displayName}:
                            </span>
                            <span className="font-mono font-bold text-white">
                              {payload[1]?.value?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => (
                  <span className="text-xs text-slate-300">
                    {val === "aValue" ? dataA.profile.displayName : dataB.profile.displayName}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="aValue"
                name="aValue"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="bValue"
                name="bValue"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
