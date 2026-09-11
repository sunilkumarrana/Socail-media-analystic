import React, { useState, useMemo } from "react";
import { DashboardDataset, StudioAnalytics } from "../types";
import { formatNumber } from "../utils/mockGenerator";
import { ReachTab } from "./ReachTab";
import { EngagementTab } from "./EngagementTab";
import { AudienceTab } from "./AudienceTab";
import { HighDemandContentSection } from "./HighDemandContentSection";
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
  TrendingDown,
  Radio,
  CheckCircle2,
  Video,
  Link2,
  Layers,
} from "lucide-react";

// Sanitize jokey placeholder phrases like "subscribe for a cookie :)"
function cleanBioText(bio?: string): string {
  if (!bio) return "";
  let text = bio.replace(/subscribe for a cookie\s*:\s*\)/gi, "").replace(/🍪/g, "").trim();
  if (text.startsWith("Accomplish something impossible or")) {
    text = "Accomplish something impossible.";
  }
  return text;
}

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
        className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs"
      >
        {/* Clean channel banner image without dark gradient overlays */}
        <div className="h-28 sm:h-36 w-full relative overflow-hidden bg-[#F1F5F9] border-b border-[#E5E7EB]">
          {profile.bannerUrl ? (
            <img
              src={profile.bannerUrl}
              alt={`${profile.displayName} Banner`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-full w-full bg-[#F1F5F9]" />
          )}
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-white bg-[#F3F4F6] shadow-xs overflow-hidden shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-white text-2xl bg-[#5B5CE2]">
                    {profile.initials}
                  </div>
                )}
              </div>

              {/* Names & Handle */}
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                    {profile.displayName}
                  </h2>
                  {profile.verified && (
                    <span title="Verified Channel" className="flex items-center text-[#2563EB]">
                      <CheckCircle2 className="h-4 w-4 fill-[#2563EB]/15" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-0.5">
                  <span className="font-mono text-[#4B5563]">{profile.handle}</span>
                  {profile.category && (
                    <>
                      <span>•</span>
                      <span>{profile.category}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right-aligned outline button */}
            <div className="self-start sm:self-end">
              <a
                href={channelPerspectiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#374151] hover:text-[#111827] px-3.5 py-1.5 text-xs font-medium transition shadow-xs cursor-pointer"
              >
                <span>Open Channel</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#6B7280]" />
              </a>
            </div>
          </div>

          {/* Clean channel bio */}
          {cleanBioText(profile.bio) && (
            <p className="text-xs sm:text-sm text-[#4B5563] line-clamp-2 max-w-3xl mb-4 leading-relaxed">
              {cleanBioText(profile.bio)}
            </p>
          )}

          {/* Consistent 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[#E5E7EB]">
            {/* Card 1: Subscribers */}
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:p-4.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] mb-2">
                <span>Subscribers</span>
                <Users className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] font-mono">
                {stats.followersFormatted}
              </div>
              <div className="mt-2 text-[11px] text-[#6B7280] font-medium">
                {stats.followersDelta} vs last 30d
              </div>
            </div>

            {/* Card 2: Total Uploads */}
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:p-4.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] mb-2">
                <span>Total Uploads</span>
                <Video className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] font-mono">
                {stats.postsCountFormatted}
              </div>
              <div className="mt-2 text-[11px] text-[#6B7280] font-medium">
                {stats.postsDelta} published
              </div>
            </div>

            {/* Card 3: Channel Views */}
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:p-4.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] mb-2">
                <span>Channel Views</span>
                <Eye className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] font-mono">
                {stats.totalViewsFormatted}
              </div>
              <div className="mt-2 text-[11px] text-[#6B7280] font-medium">
                {stats.viewsDelta} vs last 30d
              </div>
            </div>

            {/* Card 4: Channel Handle */}
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:p-4.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] mb-2">
                <span>Channel Handle</span>
                <Link2 className="h-4 w-4 text-[#6B7280]" />
              </div>
              <a
                href={channelPerspectiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] hover:text-[#5B5CE2] font-mono truncate block"
              >
                @{profile.handle.replace(/^@/, "")}
              </a>
              <div className="mt-2 text-[11px] text-[#6B7280] font-medium truncate">
                youtube.com/{profile.handle.replace(/^@/, "")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Channel Analytics Sub-Navigation Bar & Dynamic Timeframe */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-1">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              id="studio-tab-overview"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#5B5CE2] text-white shadow-xs"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Overview</span>
            </button>

            <button
              id="studio-tab-reach"
              onClick={() => setActiveTab("reach")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "reach"
                  ? "bg-[#5B5CE2] text-white shadow-xs"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Reach</span>
            </button>

            <button
              id="studio-tab-engagement"
              onClick={() => setActiveTab("engagement")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "engagement"
                  ? "bg-[#5B5CE2] text-white shadow-xs"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Engagement</span>
            </button>

            <button
              id="studio-tab-audience"
              onClick={() => setActiveTab("audience")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "audience"
                  ? "bg-[#5B5CE2] text-white shadow-xs"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl text-xs text-[#5B5CE2] font-semibold"
              title="Active timeframe date interval"
            >
              <Calendar className="h-3.5 w-3.5 text-[#5B5CE2] shrink-0" />
              <span className="whitespace-nowrap">{dateRangeString}</span>
            </div>

            <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-xl p-1 border border-[#E5E7EB]">
              {(["7d", "28d", "90d"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setStudioPeriod(period)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                    studioPeriod === period
                      ? "bg-white text-[#111827] font-semibold shadow-xs"
                      : "text-[#6B7280] hover:text-[#111827]"
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
          {/* Top KPI Cards in Studio Style - Clean, Consistent, No Redundant Badges */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Views */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-medium">
                <span>Period Views</span>
                <Eye className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
                {periodViewsFormatted}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
                <Calendar className="h-3.5 w-3.5 text-[#9CA3AF]" />
                <span>{dateRangeString}</span>
              </div>
            </div>

            {/* 2. Watch Time */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-medium">
                <span>Watch Time (hours)</span>
                <Clock className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
                {periodWatchTimeFormatted}
              </div>
              <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                stats.viewsDeltaPositive ? "text-[#059669]" : "text-[#DC2626]"
              }`}>
                {stats.viewsDeltaPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{stats.viewsDeltaPositive ? studioData.engagement.watchTimeDelta : `-${studioData.engagement.watchTimeDelta.replace("+", "")}`} vs benchmark</span>
              </div>
            </div>

            {/* 3. Subscribers */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-medium">
                <span>Subscribers</span>
                <Users className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
                {stats.followersFormatted}
              </div>
              <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                stats.followersDeltaPositive ? "text-[#059669]" : "text-[#DC2626]"
              }`}>
                <UserPlus className="h-3.5 w-3.5" />
                <span>{stats.followersDelta} net growth</span>
              </div>
            </div>

            {/* 4. Estimated Engagement Rate */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-medium">
                <span>Engagement Rate</span>
                <TrendingUp className="h-4 w-4 text-[#6B7280]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight font-mono">
                {stats.engagementRate}%
              </div>
              <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                stats.engagementDeltaPositive ? "text-[#059669]" : "text-[#DC2626]"
              }`}>
                {stats.engagementDeltaPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{stats.engagementDelta} vs benchmark</span>
              </div>
            </div>
          </div>

          {/* Real-Time Pulse & Main Growth Chart */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Interactive Studio Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#111827] tracking-tight flex items-center gap-2">
                    <span>Performance Dynamics</span>
                    <span className="text-[11px] font-normal text-[#5B5CE2]">({dateRangeString})</span>
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Daily view velocity and engagement aligned with audience surges
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#4B5563] bg-[#F3F4F6] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                    <span className="h-2 w-2 rounded-full bg-[#5B5CE2]" />
                    Daily Views
                  </span>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="studioViewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B5CE2" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#5B5CE2" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => (v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : `${(v / 1e3).toFixed(0)}K`)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "0.75rem",
                        fontSize: "0.75rem",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                        color: "#111827",
                      }}
                      formatter={(val: any) => [Number(val).toLocaleString(), "Views"]}
                      labelFormatter={(lbl, payload) => payload?.[0]?.payload?.fullDate || lbl}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#5B5CE2"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#studioViewsGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Realtime 48h / 60m Activity Panel */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#5B5CE2]" />
                    <h3 className="text-sm font-bold text-[#111827] tracking-tight">Realtime Activity</h3>
                  </div>
                  <span className="text-[11px] text-[#6B7280] font-medium">
                    Continuous
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="rounded-xl bg-[#F9FAFB] p-3.5 border border-[#E5E7EB]">
                    <div className="text-[11px] text-[#6B7280] font-medium">Views • Last 48 hrs</div>
                    <div className="text-xl sm:text-2xl font-bold text-[#111827] font-mono mt-1">
                      {studioData.realtime.viewsLast48hFormatted}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F9FAFB] p-3.5 border border-[#E5E7EB]">
                    <div className="text-[11px] text-[#6B7280] font-medium">Views • Last 60 min</div>
                    <div className="text-xl sm:text-2xl font-bold text-[#111827] font-mono mt-1">
                      {studioData.realtime.viewsLast60mFormatted}
                    </div>
                  </div>
                </div>

                {/* 48-Hour Bar Chart Histogram */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-2">
                    <span>Hourly Velocity (Past 48 Hours)</span>
                    <span className="text-[#9CA3AF]">Bars = 1h</span>
                  </div>
                  <div className="h-24 flex items-end gap-0.5 sm:gap-1 bg-[#F9FAFB] p-2 rounded-xl border border-[#E5E7EB]">
                    {studioData.realtime.hourlyActivity.map((val, i) => {
                      const max = Math.max(...studioData.realtime.hourlyActivity, 1);
                      const heightPercent = Math.max(12, Math.round((val / max) * 100));
                      const isRecent = i >= 40;
                      return (
                        <div
                          key={i}
                          title={`Hour ${48 - i} ago: ${val.toLocaleString()} views`}
                          style={{ height: `${heightPercent}%` }}
                          className={`flex-1 rounded-t-xs transition-all hover:opacity-80 ${
                            isRecent ? "bg-[#5B5CE2]" : "bg-[#C7D2FE]"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1.5">
                    <span>-48h</span>
                    <span>-24h</span>
                    <span className="text-[#059669] font-medium">Now</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-[11px] text-[#6B7280] flex items-center justify-between">
                <span>Subscribers: <strong className="text-[#111827]">{stats.followersFormatted}</strong></span>
                <span className="text-[#9CA3AF]">See live count</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REACH TAB ================= */}
      {activeTab === "reach" && (
        <ReachTab
          studio={studioData}
          platform={dataset.profile.platform}
          period={studioPeriod}
          onPeriodChange={setStudioPeriod}
        />
      )}

      {/* ================= ENGAGEMENT TAB ================= */}
      {activeTab === "engagement" && (
        <EngagementTab
          studio={studioData}
          platform={dataset.profile.platform}
          period={studioPeriod}
          onPeriodChange={setStudioPeriod}
        />
      )}

      {/* ================= AUDIENCE TAB ================= */}
      {activeTab === "audience" && (
        <AudienceTab
          studio={studioData}
          platform={dataset.profile.platform}
          period={studioPeriod}
          onPeriodChange={setStudioPeriod}
        />
      )}

      {/* ================= HIGH-DEMAND CONTENT & VIEWER RATING INTELLIGENCE ================= */}
      <HighDemandContentSection dataset={dataset} />
    </div>
  );
};
