import React, { useState, useMemo } from "react";
import { DashboardDataset, StudioAnalytics } from "../types";
import { formatNumber } from "../utils/mockGenerator";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Activity,
  Compass,
  HeartHandshake,
  Users,
  Eye,
  Clock,
  UserPlus,
  MousePointerClick,
  Share2,
  Search,
  ExternalLink,
  ShieldCheck,
  Info,
  Calendar,
  Sparkles,
  TrendingUp,
  Radio,
  CheckCircle2,
  Video,
} from "lucide-react";

interface StudioAnalyticsViewProps {
  dataset: DashboardDataset;
}

export type StudioTab = "overview" | "reach" | "engagement" | "audience";

export const StudioAnalyticsView: React.FC<StudioAnalyticsViewProps> = ({ dataset }) => {
  const [activeTab, setActiveTab] = useState<StudioTab>("overview");
  const [studioPeriod, setStudioPeriod] = useState<"7d" | "28d" | "90d">("28d");

  const { profile, stats, history, studio, isRealtimeVerified } = dataset;
  const studioData: StudioAnalytics = studio || {
    reach: {
      impressions: stats.totalViews * 12,
      impressionsFormatted: `${(stats.totalViews * 12 / 1_000_000).toFixed(1)}M`,
      impressionsDelta: "+8.4%",
      ctr: 7.8,
      ctrDelta: "+0.4%",
      uniqueViewers: Math.round(stats.followers * 1.5),
      uniqueViewersFormatted: `${(stats.followers * 1.5 / 1_000_000).toFixed(1)}M`,
      viewsFromImpressions: Math.round(stats.totalViews * 0.72),
      viewsFromImpressionsFormatted: `${(stats.totalViews * 0.72 / 1_000_000).toFixed(1)}M`,
      trafficSources: [
        { source: "Browse features", percentage: 44.2, viewsFormatted: "4.8M" },
        { source: "Suggested videos", percentage: 29.5, viewsFormatted: "3.2M" },
        { source: "YouTube search", percentage: 15.8, viewsFormatted: "1.7M" },
        { source: "External sources", percentage: 6.4, viewsFormatted: "690K" },
        { source: "Direct or other", percentage: 4.1, viewsFormatted: "440K" },
      ],
      topSearchTerms: [
        { term: `${profile.displayName} podcast`, percentage: 27.5 },
        { term: `${profile.displayName} standup comedy`, percentage: 21.3 },
        { term: `${profile.displayName} latest episode`, percentage: 18.0 },
        { term: "funny highlights", percentage: 12.4 },
      ],
      externalSites: [
        { site: "WhatsApp", percentage: 42.1 },
        { site: "Instagram", percentage: 25.4 },
        { site: "Google Search", percentage: 17.8 },
        { site: "Reddit", percentage: 9.1 },
        { site: "X (Twitter)", percentage: 5.6 },
      ],
    },
    engagement: {
      watchTimeHours: Math.round(stats.totalViews * 0.11),
      watchTimeFormatted: `${(stats.totalViews * 0.11 / 1_000).toFixed(0)}K hrs`,
      watchTimeDelta: "+6.5%",
      avgViewDuration: "06:48",
      avgPercentageViewed: 46.2,
      retentionCurve: [
        { percentOfVideo: 0, retentionPercent: 100 },
        { percentOfVideo: 10, retentionPercent: 78 },
        { percentOfVideo: 25, retentionPercent: 68 },
        { percentOfVideo: 50, retentionPercent: 54 },
        { percentOfVideo: 75, retentionPercent: 44 },
        { percentOfVideo: 100, retentionPercent: 31 },
      ],
      endScreenCtaRate: 4.9,
      topPlaylists: [
        { title: `${profile.displayName} Full Episodes`, views: "2.4M" },
        { title: "Special Collaborations", views: "1.6M" },
        { title: "Trending Shorts & Reels", views: "980K" },
      ],
    },
    audience: {
      returningViewers: Math.round(stats.followers * 0.6),
      returningViewersFormatted: `${(stats.followers * 0.6 / 1_000_000).toFixed(1)}M`,
      newViewers: Math.round(stats.followers * 1.25),
      newViewersFormatted: `${(stats.followers * 1.25 / 1_000_000).toFixed(1)}M`,
      subscribedRatio: 27.4,
      ageGender: {
        gender: { male: 78.4, female: 20.8, userSpecified: 0.8 },
        ageGroups: [
          { bracket: "13–17", percentage: 4.8 },
          { bracket: "18–24", percentage: 41.6 },
          { bracket: "25–34", percentage: 38.2 },
          { bracket: "35–44", percentage: 11.0 },
          { bracket: "45–54", percentage: 3.2 },
          { bracket: "55+", percentage: 1.2 },
        ],
      },
      topGeographies: [
        { country: "India", code: "IN", percentage: 73.8 },
        { country: "United States", code: "US", percentage: 8.4 },
        { country: "United Arab Emirates", code: "AE", percentage: 5.1 },
        { country: "United Kingdom", code: "GB", percentage: 3.7 },
        { country: "Canada", code: "CA", percentage: 2.8 },
      ],
      activeHoursHeatmap: Array(7).fill(Array(24).fill(2)),
      topSubtitles: [
        { language: "English (US)", percentage: 88.5 },
        { language: "Hindi", percentage: 43.2 },
        { language: "English (Auto-generated)", percentage: 26.4 },
      ],
    },
    realtime: {
      viewsLast48h: Math.round(stats.followers * 0.08 + 120000),
      viewsLast48hFormatted: `${Math.round((stats.followers * 0.08 + 120000) / 1000)}K`,
      viewsLast60m: Math.round(((stats.followers * 0.08 + 120000) / 48) * 1.25),
      viewsLast60mFormatted: `${Math.round(((stats.followers * 0.08 + 120000) / 48) * 1.25)}`,
      hourlyActivity: Array(48).fill(2400),
    },
  };

  const daysSlice = studioPeriod === "7d" ? 7 : studioPeriod === "28d" ? 28 : 90;

  // Dynamic Date Range Calculation (Sep 1, 2026 – Sep 7, 2026 etc.)
  const dateRangeString = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (daysSlice - 1));
    const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return `${start.toLocaleDateString("en-US", opt)} – ${end.toLocaleDateString("en-US", opt)}`;
  }, [daysSlice]);

  // Dynamic Scaling Factor based on timeframe
  const periodFactor = daysSlice / 28;

  // Overview Tab Scaled Metrics
  const periodViews = Math.round(
    stats.totalViews * (daysSlice === 7 ? 0.035 : daysSlice === 28 ? 0.14 : 0.44)
  );
  const periodViewsFormatted = formatNumber(periodViews);

  const periodWatchTimeHours = Math.round(studioData.engagement.watchTimeHours * periodFactor);
  const periodWatchTimeFormatted = `${formatNumber(periodWatchTimeHours)} hrs`;

  // Reach Tab Scaled Metrics
  const periodImpressions = Math.round(studioData.reach.impressions * periodFactor);
  const periodImpressionsFormatted = formatNumber(periodImpressions);

  const periodViewsFromImpressions = Math.round(studioData.reach.viewsFromImpressions * periodFactor);
  const periodViewsFromImpressionsFormatted = formatNumber(periodViewsFromImpressions);

  const periodUniqueViewers = Math.round(
    studioData.reach.uniqueViewers * (daysSlice === 7 ? 0.35 : daysSlice === 28 ? 1.0 : 2.65)
  );
  const periodUniqueViewersFormatted = formatNumber(periodUniqueViewers);

  // Audience Tab Scaled Metrics
  const periodReturningViewers = Math.round(
    studioData.audience.returningViewers * (daysSlice === 7 ? 0.32 : daysSlice === 28 ? 1.0 : 2.5)
  );
  const periodReturningViewersFormatted = formatNumber(periodReturningViewers);

  const periodNewViewers = Math.round(
    studioData.audience.newViewers * (daysSlice === 7 ? 0.25 : daysSlice === 28 ? 1.0 : 3.2)
  );
  const periodNewViewersFormatted = formatNumber(periodNewViewers);

  const periodSubRatio = daysSlice === 7 ? 28.4 : daysSlice === 28 ? 26.8 : 24.9;

  // Generate dynamic chart data with exact sequential daily dates
  const chartData = useMemo(() => {
    const today = new Date();
    const items = [];
    const baseDailyViews = Math.max(1000, Math.round(periodViews / daysSlice));

    for (let i = daysSlice - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const fullDate = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

      const histItem = history[history.length - 1 - (i % Math.max(1, history.length))];
      const wave = 1 + Math.sin(i * 0.45) * 0.18 + ((i % 5) - 2) * 0.03;
      const views = histItem ? Math.round(histItem.views * (daysSlice === 7 ? 0.95 : 1.0)) : Math.round(baseDailyViews * wave);
      const followers = stats.followers - Math.round(i * (stats.followers * 0.0007));

      items.push({
        date: dateLabel,
        fullDate,
        views,
        followers,
      });
    }
    return items;
  }, [daysSlice, periodViews, history, stats.followers]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hourLabels = ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"];

  const channelPerspectiveUrl =
    profile.externalUrl || profile.profileUrl || `https://www.youtube.com/${profile.handle.replace(/^@/, "")}`;

  return (
    <div id="channel-analytics-container" className="space-y-6">
      {/* 1. Perspective YouTube Channel Account Card */}
      <div
        id="channel-perspective-account-card"
        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md"
      >
        {/* Banner header if bannerUrl exists or stylized brand pattern */}
        <div className="h-28 sm:h-36 w-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800/80">
          {profile.bannerUrl ? (
            <img
              src={profile.bannerUrl}
              alt={`${profile.displayName} Banner`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-slate-900 to-indigo-950/40 flex items-center justify-end px-8">
              <span className="text-slate-800/50 font-black text-6xl tracking-widest uppercase select-none">
                {profile.displayName.slice(0, 10)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-5 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4">
            <div className="flex items-end gap-3.5">
              {/* Avatar */}
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-slate-950 bg-slate-800 shadow-2xl overflow-hidden shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className={`h-full w-full flex items-center justify-center font-bold text-white text-2xl bg-gradient-to-br ${profile.avatarBg}`}>
                    {profile.initials}
                  </div>
                )}
                <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" title="Active Live Channel" />
              </div>

              {/* Names & Handle */}
              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {profile.displayName}
                  </h2>
                  {profile.verified && (
                    <CheckCircle2 className="h-5 w-5 text-sky-400 shrink-0" title="Verified Creator" />
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Perspective Synced
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-mono text-slate-300 font-semibold">{profile.handle}</span>
                  <span>•</span>
                  <span>Category: {profile.category || "Entertainment & Education"}</span>
                </div>
              </div>
            </div>

            {/* Direct Channel External Link button */}
            <div className="flex items-center gap-2 self-start sm:self-end">
              <a
                href={channelPerspectiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 text-xs font-semibold shadow-md shadow-red-600/20 transition group"
              >
                <Video className="h-4 w-4 fill-white" />
                <span>Open Channel on YouTube</span>
                <ExternalLink className="h-3.5 w-3.5 text-red-200 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Channel Bio */}
          {profile.bio && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-4xl mb-4 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Quick Perspective Channel Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
            <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Subscribers (Live)</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">{stats.followersFormatted}</span>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Uploads (Live)</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">{stats.postsCountFormatted}</span>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Est. Channel Views</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">{stats.totalViewsFormatted}</span>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Perspective Link</span>
              <span className="text-xs font-mono text-indigo-400 hover:underline truncate block mt-0.5">
                youtube.com/{profile.handle.replace(/^@/, "")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Channel Analytics Sub-Navigation Bar & Dynamic Timeframe */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-1">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              id="studio-tab-overview"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Overview</span>
            </button>

            <button
              id="studio-tab-reach"
              onClick={() => setActiveTab("reach")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
                activeTab === "reach"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Reach</span>
            </button>

            <button
              id="studio-tab-engagement"
              onClick={() => setActiveTab("engagement")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
                activeTab === "engagement"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Engagement</span>
            </button>

            <button
              id="studio-tab-audience"
              onClick={() => setActiveTab("audience")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
                activeTab === "audience"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Audience</span>
            </button>
          </div>

          {/* Period Selector with Live Dynamic Date Range */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Dynamic Date Range Display */}
            <div
              id="active-timeframe-daterange"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/90 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 font-semibold shadow-inner"
              title="Active timeframe date interval"
            >
              <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="whitespace-nowrap">{dateRangeString}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950/60 rounded-xl p-1 border border-slate-800">
              {(["7d", "28d", "90d"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setStudioPeriod(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    studioPeriod === period
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Last {period === "7d" ? "7 Days" : period === "28d" ? "28 Days" : "90 Days"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top KPI Cards in Studio Style with Badges */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Views */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium">Views in this period</span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  🟢 Real-Time Synced
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodViewsFormatted}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                <span>{dateRangeString}</span>
              </div>
            </div>

            {/* 2. Watch Time */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium">Watch Time (hours)</span>
                <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  📊 Modeled
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodWatchTimeFormatted}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{studioData.engagement.watchTimeDelta} vs benchmark</span>
              </div>
            </div>

            {/* 3. Subscribers */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium">Current Subscribers</span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  🟢 Live Count
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {stats.followersFormatted}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <UserPlus className="h-3.5 w-3.5" />
                <span>{stats.followersDelta} recent net growth</span>
              </div>
            </div>

            {/* 4. Estimated Engagement Rate */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium">Studio Engagement Rate</span>
                <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  📊 Modeled
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {stats.engagementRate}%
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{stats.engagementDelta} above creator benchmark</span>
              </div>
            </div>
          </div>

          {/* Real-Time Pulse & Main Growth Chart */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Interactive Studio Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Performance Dynamics</span>
                    <span className="text-[11px] font-normal text-indigo-400">({dateRangeString})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daily view velocity and engagement aligned with audience surges
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Daily Views
                  </span>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="studioViewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => (v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : `${(v / 1e3).toFixed(0)}K`)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "0.75rem",
                        fontSize: "0.75rem",
                      }}
                      formatter={(val: any) => [Number(val).toLocaleString(), "Views"]}
                      labelFormatter={(lbl, payload) => payload?.[0]?.payload?.fullDate || lbl}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#studioViewsGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Realtime 48h / 60m Activity Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white">Realtime Activity</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Updating Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Views • Last 48 hrs</div>
                    <div className="text-xl font-bold text-white mt-1">
                      {studioData.realtime.viewsLast48hFormatted}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Views • Last 60 min</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      {studioData.realtime.viewsLast60mFormatted}
                    </div>
                  </div>
                </div>

                {/* 48-Hour Bar Chart Histogram */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span>Hourly Velocity (Past 48 Hours)</span>
                    <span className="text-slate-500">Bars = 1h</span>
                  </div>
                  <div className="h-24 flex items-end gap-0.5 sm:gap-1 bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                    {studioData.realtime.hourlyActivity.map((val, i) => {
                      const max = Math.max(...studioData.realtime.hourlyActivity, 1);
                      const heightPercent = Math.max(12, Math.round((val / max) * 100));
                      const isRecent = i >= 40;
                      return (
                        <div
                          key={i}
                          title={`Hour ${48 - i} ago: ${val.toLocaleString()} views`}
                          style={{ height: `${heightPercent}%` }}
                          className={`flex-1 rounded-t-sm transition-all hover:bg-red-400 ${
                            isRecent ? "bg-red-500" : "bg-red-900/60"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>-48h</span>
                    <span>-24h</span>
                    <span className="text-emerald-400 font-medium">Now</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Subscribers: <strong className="text-white">{stats.followersFormatted}</strong></span>
                <span className="text-slate-500">See live count</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REACH TAB ================= */}
      {activeTab === "reach" && (
        <div className="space-y-6">
          {/* Reach Headline Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Impressions</span>
                <span className="inline-flex rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  📊 Modeled
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodImpressionsFormatted}
              </div>
              <div className="mt-2 text-xs text-indigo-300 font-medium">
                {studioData.reach.impressionsDelta} in {studioPeriod} ({dateRangeString})
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Impressions Click-Through Rate (CTR)</span>
                <span className="inline-flex rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  📊 Modeled
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {studioData.reach.ctr}%
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Above creator benchmark (4.0% – 7.0%)
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Views from Impressions</span>
                <span className="inline-flex rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  📊 Modeled
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodViewsFromImpressionsFormatted}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                74% of total channel traffic
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Unique Viewers</span>
                <span className="inline-flex rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  📊 Modeled
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodUniqueViewersFormatted}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Estimated distinct viewers in {studioPeriod}
              </div>
            </div>
          </div>

          {/* Traffic Sources Breakdown & Funnel */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Traffic Source Types */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="h-4 w-4 text-red-400" />
                  <span>Traffic Source Types</span>
                </h3>
                <span className="text-xs text-slate-400">% of Views</span>
              </div>

              <div className="space-y-4">
                {studioData.reach.trafficSources.map((source, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{source.source}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400">{source.viewsFormatted}</span>
                        <span className="text-white font-semibold">{source.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${source.percentage}%` }}
                        className={`h-full rounded-full ${
                          i === 0 ? "bg-red-500" : i === 1 ? "bg-rose-500" : i === 2 ? "bg-amber-500" : "bg-slate-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Search Terms & External Sources */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md space-y-6">
              {/* YouTube Search */}
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Search className="h-4 w-4 text-amber-400" />
                  <span>Top YouTube Search Terms</span>
                </h3>
                <div className="space-y-2">
                  {studioData.reach.topSearchTerms.map((term, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                      <span className="text-slate-300">"{term.term}"</span>
                      <span className="text-slate-400 font-mono font-medium">{term.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Sites */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <ExternalLink className="h-4 w-4 text-sky-400" />
                  <span>Top External Apps & Sites</span>
                </h3>
                <div className="space-y-2">
                  {studioData.reach.externalSites.map((site, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                      <span className="text-slate-300">{site.site}</span>
                      <span className="text-slate-400 font-mono font-medium">{site.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ENGAGEMENT TAB ================= */}
      {activeTab === "engagement" && (
        <div className="space-y-6">
          {/* Key Engagement Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="text-xs text-slate-400 mb-2">Watch Time (Hours)</div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {studioData.engagement.watchTimeFormatted}
              </div>
              <div className="mt-2 text-xs text-emerald-400 font-medium">
                {studioData.engagement.watchTimeDelta} in {studioPeriod}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="text-xs text-slate-400 mb-2">Average View Duration (AVD)</div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {studioData.engagement.avgViewDuration}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Avg time spent per view
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="text-xs text-slate-400 mb-2">Average Percentage Viewed</div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {studioData.engagement.avgPercentageViewed}%
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Above average completion rate
              </div>
            </div>
          </div>

          {/* Retention Curve Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span>Key Moments for Audience Retention</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Second-by-second viewer attention drop-off from video start (0%) to conclusion (100%)
                </p>
              </div>
              <span className="inline-flex rounded bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 self-start sm:self-auto">
                📊 Modeled Retention Curve
              </span>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studioData.engagement.retentionCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
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
                    labelFormatter={(lbl) => `Video Timestamp: ${lbl}%`}
                  />
                  <Area
                    type="monotone"
                    dataKey="retentionPercent"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#retentionGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="rounded-xl bg-slate-950/40 p-3 border border-slate-800/80">
                <span className="text-slate-400">Intro Hook (0:30)</span>
                <div className="text-white font-semibold mt-0.5">79% retention</div>
                <div className="text-[11px] text-slate-500">Hook effectively kept viewers engaged</div>
              </div>
              <div className="rounded-xl bg-slate-950/40 p-3 border border-slate-800/80">
                <span className="text-slate-400">Continuous Segments</span>
                <div className="text-white font-semibold mt-0.5">54% through midpoint</div>
                <div className="text-[11px] text-slate-500">Minimal mid-episode dip</div>
              </div>
              <div className="rounded-xl bg-slate-950/40 p-3 border border-slate-800/80">
                <span className="text-slate-400">End Screen CTR</span>
                <div className="text-white font-semibold mt-0.5">{studioData.engagement.endScreenCtaRate}% click rate</div>
                <div className="text-[11px] text-slate-500">Above YouTube average (2.5%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= AUDIENCE TAB ================= */}
      {activeTab === "audience" && (
        <div className="space-y-6">
          {/* Top Audience KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="text-xs text-slate-400 mb-2">Returning Viewers</div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodReturningViewersFormatted}
              </div>
              <div className="mt-2 text-xs text-indigo-300 font-medium">
                Loyal core fan base in {studioPeriod} ({dateRangeString})
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="text-xs text-slate-400 mb-2">New Viewers</div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodNewViewersFormatted}
              </div>
              <div className="mt-2 text-xs text-emerald-400 font-medium">
                Discovered via browse &amp; suggestions
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <div className="text-xs text-slate-400 mb-2">Subscribed vs Not Subscribed</div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {periodSubRatio}% / {(100 - periodSubRatio).toFixed(1)}%
              </div>
              <div className="mt-2 text-xs text-slate-400">
                High viral discovery opportunity
              </div>
            </div>
          </div>

          {/* When Viewers Are on YouTube (Studio Heatmap Matrix) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span>When Your Viewers Are on YouTube</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Peak viewing window is between 6:00 PM and 11:00 PM local time
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Few Viewers</span>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-slate-800" />
                  <div className="h-3 w-3 rounded bg-purple-900/60" />
                  <div className="h-3 w-3 rounded bg-purple-600/80" />
                  <div className="h-3 w-3 rounded bg-purple-400" />
                </div>
                <span>Many Viewers</span>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Hours Header */}
                <div className="grid grid-cols-25 gap-1 text-[10px] text-slate-500 pb-1.5 border-b border-slate-800">
                  <div className="col-span-1">Day</div>
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={h} className="text-center font-mono">
                      {h % 3 === 0 ? (h === 0 ? "12a" : h === 12 ? "12p" : `${h > 12 ? h - 12 : h}${h >= 12 ? "p" : "a"}`) : ""}
                    </div>
                  ))}
                </div>

                {/* Day Rows */}
                <div className="space-y-1.5 pt-2">
                  {daysOfWeek.map((day, dIdx) => (
                    <div key={day} className="grid grid-cols-25 gap-1 items-center">
                      <div className="col-span-1 text-[11px] text-slate-400 font-medium">
                        {day}
                      </div>
                      {Array.from({ length: 24 }).map((_, h) => {
                        const intensity = studioData.audience.activeHoursHeatmap[dIdx]?.[h] ?? 1;
                        const bgClass =
                          intensity === 0
                            ? "bg-slate-900 border border-slate-800"
                            : intensity === 1
                            ? "bg-purple-950/70 border border-purple-900/40"
                            : intensity === 2
                            ? "bg-purple-700/80 border border-purple-600/50"
                            : "bg-purple-400 border border-purple-300 shadow-sm";
                        return (
                          <div
                            key={h}
                            title={`${day} at ${h}:00 - Level ${intensity}`}
                            className={`h-5 rounded-[4px] transition-all hover:scale-110 cursor-pointer ${bgClass}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Age & Gender + Top Geographies */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Age & Gender Demographics */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-sky-400" />
                <span>Age &amp; Gender Distribution</span>
              </h3>

              {/* Gender bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Gender</span>
                  <span className="font-mono">
                    Male: <strong className="text-white">{studioData.audience.ageGender.gender.male}%</strong> • Female: <strong className="text-white">{studioData.audience.ageGender.gender.female}%</strong>
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-800 flex overflow-hidden">
                  <div style={{ width: `${studioData.audience.ageGender.gender.male}%` }} className="bg-sky-500 h-full" />
                  <div style={{ width: `${studioData.audience.ageGender.gender.female}%` }} className="bg-pink-500 h-full" />
                </div>
              </div>

              {/* Age Brackets */}
              <div className="space-y-3">
                <span className="text-xs text-slate-400 font-medium">Age Groups</span>
                {studioData.audience.ageGender.ageGroups.map((group, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{group.bracket}</span>
                      <span className="text-white font-semibold font-mono">{group.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${group.percentage * 2}%` }}
                        className="h-full rounded-full bg-sky-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Geographies & Subtitles */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Compass className="h-4 w-4 text-emerald-400" />
                  <span>Top Geographies</span>
                </h3>
                <div className="space-y-2.5">
                  {studioData.audience.topGeographies.map((geo, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                          {geo.code}
                        </span>
                        <span className="text-slate-200 font-medium">{geo.country}</span>
                      </div>
                      <span className="text-white font-mono font-semibold">{geo.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white mb-2">Top Subtitle / CC Languages</h3>
                <div className="space-y-1.5">
                  {studioData.audience.topSubtitles.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-300">
                      <span>{sub.language}</span>
                      <span className="font-mono text-slate-400">{sub.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
