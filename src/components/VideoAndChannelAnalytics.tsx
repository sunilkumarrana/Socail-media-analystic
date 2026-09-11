import React, { useState } from "react";
import { DashboardDataset, VideoAnalyticsData, TopContentItem } from "../types";
import { HighDemandContentSection } from "./HighDemandContentSection";
import {
  Play,
  TrendingUp,
  TrendingDown,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Clock,
  Zap,
  ExternalLink,
  Users,
  Compass,
  Radio,
  Tv,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Maximize2,
  BarChart3,
  Flame,
  Tag,
  Activity,
} from "lucide-react";
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

interface VideoAndChannelAnalyticsProps {
  dataset: DashboardDataset;
  videoAnalytics: VideoAnalyticsData;
  onAnalyzeVideo?: (item: TopContentItem) => void;
}

export const VideoAndChannelAnalytics: React.FC<VideoAndChannelAnalyticsProps> = ({
  dataset,
  videoAnalytics,
  onAnalyzeVideo,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<"side-by-side" | "video-only" | "channel-only">("side-by-side");
  const [isPlayingEmbed, setIsPlayingEmbed] = useState<boolean>(false);

  const { profile, stats, studio, topContent } = dataset;

  // Video retention curve data
  const retentionData = videoAnalytics.retentionCurve.map((item) => ({
    label: item.timeLabel,
    percent: item.retentionPercent,
  }));

  // Video traffic data - cohesive neutral / indigo shades
  const trafficData = videoAnalytics.trafficSources.map((item, idx) => ({
    name: item.source.split(" (")[0],
    percentage: item.percentage,
    views: item.viewsFormatted,
    fill: ["#5B5CE2", "#818cf8", "#94a3b8", "#cbd5e1", "#e2e8f0"][idx % 5],
  }));

  // Channel history sparkline data
  const channelGrowthData = dataset.history.slice(-14).map((h) => ({
    date: h.date,
    followers: h.followers,
    views: h.views,
  }));

  // Other videos by the same creator excluding this one
  const otherVideos = topContent
    .filter((v) => !v.id.includes(videoAnalytics.videoId) && v.title !== videoAnalytics.title)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#5B5CE2] border border-[#E0E7FF]">
            <Tv className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280]">
                Video Intelligence
              </span>
              <span className="text-xs text-[#9CA3AF] hidden sm:inline">
                • Synchronized side-by-side with channel metrics
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-[#111827] mt-0.5 line-clamp-1">
              {videoAnalytics.title}
            </h2>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-stretch md:self-auto rounded-xl bg-[#F3F4F6] p-1 border border-[#E5E7EB] text-xs font-medium">
          <button
            onClick={() => setActiveViewMode("side-by-side")}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeViewMode === "side-by-side"
                ? "bg-white text-[#111827] font-semibold shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveViewMode("video-only")}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeViewMode === "video-only"
                ? "bg-white text-[#111827] font-semibold shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            Video Deep Dive
          </button>
          <button
            onClick={() => setActiveViewMode("channel-only")}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeViewMode === "channel-only"
                ? "bg-white text-[#111827] font-semibold shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            Channel Overview
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div
        className={`grid gap-6 ${
          activeViewMode === "side-by-side"
            ? "grid-cols-1 xl:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* =========================================================================
            PANEL 1: VIDEO ANALYTICS (Specific Video)
           ========================================================================= */}
        {(activeViewMode === "side-by-side" || activeViewMode === "video-only") && (
          <div className="space-y-6">
            {/* Video Card Container */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#EEF2FF] text-[#5B5CE2] flex items-center justify-center font-bold">
                    <Tv className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Video Performance
                    </h3>
                    <p className="text-[11px] text-[#9CA3AF]">
                      ID: {videoAnalytics.videoId} • Published {videoAnalytics.publishedDate}
                    </p>
                  </div>
                </div>

                <a
                  href={videoAnalytics.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151] hover:text-[#111827] px-2.5 py-1 text-xs font-medium shadow-xs transition"
                >
                  <span>Open Video</span>
                  <ExternalLink className="h-3 w-3 text-[#9CA3AF]" />
                </a>
              </div>

              {/* Video Player / Thumbnail Preview */}
              <div className="mt-4 relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-[#E5E7EB] shadow-inner group">
                {isPlayingEmbed ? (
                  <iframe
                    src={`${videoAnalytics.embedUrl}?autoplay=1&rel=0`}
                    title={videoAnalytics.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={videoAnalytics.thumbnailUrl}
                      alt={videoAnalytics.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                          {videoAnalytics.duration}
                        </span>
                      </div>

                      {/* Play Button Overlay */}
                      <button
                        onClick={() => setIsPlayingEmbed(true)}
                        className="self-center flex items-center justify-center h-12 w-12 rounded-full bg-white/90 text-[#111827] border border-white shadow-xl hover:scale-105 transition cursor-pointer"
                        title="Play preview"
                      >
                        <Play className="h-5 w-5 fill-[#111827] ml-0.5" />
                      </button>

                      <p className="text-xs font-medium text-white line-clamp-1 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                        {videoAnalytics.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Headline KPIs Grid (4 metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {/* Metric 1: Views */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Views</span>
                    <Eye className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {videoAnalytics.viewsFormatted}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#059669] mt-0.5 font-medium">
                    <Zap className="h-2.5 w-2.5" />
                    {videoAnalytics.viewsPerHourFormatted}
                  </div>
                </div>

                {/* Metric 2: Likes */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Likes</span>
                    <ThumbsUp className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {videoAnalytics.likesFormatted}
                  </div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">
                    {videoAnalytics.likeRatio}% positive
                  </div>
                </div>

                {/* Metric 3: Comments */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Comments</span>
                    <MessageSquare className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {videoAnalytics.commentsFormatted}
                  </div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">
                    ~{videoAnalytics.sharesFormatted} shares
                  </div>
                </div>

                {/* Metric 4: Engagement Rate */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Engagement</span>
                    <TrendingUp className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {videoAnalytics.engagementRate}%
                  </div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5 font-medium">
                    Viral Score: {videoAnalytics.viralScore}/100
                  </div>
                </div>
              </div>

              {/* Video vs Channel Baseline Benchmark */}
              <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#111827] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#5B5CE2]" />
                    Performance vs Channel Baseline
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Channel Avg: {Math.round(stats.totalViews / Math.max(1, stats.postsCount)) >= 1000000 
                      ? `${(stats.totalViews / Math.max(1, stats.postsCount) / 1000000).toFixed(1)}M` 
                      : `${Math.round(stats.totalViews / Math.max(1, stats.postsCount) / 1000)}K`} views/vid
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                    <div
                      className={`h-7 w-7 rounded-md flex items-center justify-center ${
                        videoAnalytics.vsChannelAverage.isViewsHigher
                          ? "bg-[#ECFDF5] text-[#059669]"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {videoAnalytics.vsChannelAverage.isViewsHigher ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111827] font-mono">
                        {videoAnalytics.vsChannelAverage.viewsMultiplier} Views
                      </div>
                      <div className="text-[10px] text-[#6B7280]">
                        {videoAnalytics.vsChannelAverage.viewsDeltaPercent} vs average upload
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                    <div
                      className={`h-7 w-7 rounded-md flex items-center justify-center ${
                        videoAnalytics.vsChannelAverage.isEngagementHigher
                          ? "bg-[#ECFDF5] text-[#059669]"
                          : "bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111827] font-mono">
                        {videoAnalytics.vsChannelAverage.engagementDeltaPercent} Engagement
                      </div>
                      <div className="text-[10px] text-[#6B7280]">
                        Channel benchmark: {stats.engagementRate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Audience Retention Curve */}
              <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#5B5CE2]" />
                      Audience Retention Curve
                    </h4>
                    <p className="text-[11px] text-[#6B7280]">
                      Second-by-second drop-off for this video
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#111827] font-mono">
                      {videoAnalytics.avgViewDuration}
                    </div>
                    <div className="text-[10px] text-[#6B7280]">
                      Avg View ({videoAnalytics.avgPercentageViewed}%)
                    </div>
                  </div>
                </div>

                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retentionData}>
                      <defs>
                        <linearGradient id="vidRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5B5CE2" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#5B5CE2" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="#9CA3AF"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          fontSize: "11px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(val: any) => [`${val}% retained`, "Retention"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="percent"
                        stroke="#5B5CE2"
                        strokeWidth={2}
                        fill="url(#vidRetentionGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Video Traffic Sources Breakdown */}
              <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-[#5B5CE2]" />
                  Traffic Sources for this Video
                </h4>
                <div className="space-y-2.5">
                  {trafficData.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#374151] truncate max-w-[200px]">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#6B7280] text-[11px] font-mono">{item.views} views</span>
                          <span className="font-semibold text-[#111827] font-mono">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.fill,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Tags / Keywords */}
              {videoAnalytics.tags && videoAnalytics.tags.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
                    <Tag className="h-3.5 w-3.5 text-[#5B5CE2]" />
                    <span>Video Keywords & Categories</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {videoAnalytics.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white px-2 py-1 text-[11px] text-[#4B5563] border border-[#E5E7EB] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            PANEL 2: CHANNEL ANALYTICS (Host Channel)
           ========================================================================= */}
        {(activeViewMode === "side-by-side" || activeViewMode === "channel-only") && (
          <div className="space-y-6">
            {/* Channel Card Container */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#EEF2FF] text-[#5B5CE2] flex items-center justify-center font-bold">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Channel Analytics
                    </h3>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {profile.handle} • Joined {profile.joinedYear}
                    </p>
                  </div>
                </div>

                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151] hover:text-[#111827] px-2.5 py-1 text-xs font-medium shadow-xs transition"
                >
                  <span>Visit Channel</span>
                  <ExternalLink className="h-3 w-3 text-[#9CA3AF]" />
                </a>
              </div>

              {/* Channel Profile Banner & Identity */}
              <div className="mt-4 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB]">
                {profile.bannerUrl ? (
                  <div className="h-20 sm:h-24 w-full overflow-hidden relative">
                    <img
                      src={profile.bannerUrl}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-16 w-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
                )}

                <div className="p-4 pt-2 flex items-center gap-3.5">
                  <div className="relative -mt-8 shrink-0">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="h-14 w-14 rounded-xl border-2 border-white object-cover shadow-md"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-[#5B5CE2] border-2 border-white flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {profile.initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-[#111827] tracking-tight truncate">
                        {profile.displayName}
                      </h4>
                      {profile.verified && (
                        <CheckCircle2 className="h-4 w-4 text-[#5B5CE2] shrink-0" />
                      )}
                    </div>
                    {profile.bio && (
                      <p className="text-xs text-[#6B7280] truncate mt-0.5">
                        {profile.bio.replace(/subscribe for a cookie\s*:\s*\)/gi, "").trim()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Channel Headline KPIs (4 metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {/* Metric 1: Subscribers */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Subscribers</span>
                    <Users className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {stats.followersFormatted}
                  </div>
                  <div className="text-[10px] text-[#059669] mt-0.5 font-medium">
                    {stats.followersDelta}
                  </div>
                </div>

                {/* Metric 2: Total Views */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Channel Views</span>
                    <Eye className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {stats.totalViewsFormatted}
                  </div>
                  <div className="text-[10px] text-[#059669] mt-0.5 font-medium">
                    {stats.viewsDelta}
                  </div>
                </div>

                {/* Metric 3: Total Uploads */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Uploads</span>
                    <Tv className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {stats.postsCountFormatted}
                  </div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">
                    {stats.postsDelta} recently
                  </div>
                </div>

                {/* Metric 4: Avg Channel Engagement */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>Channel Eng</span>
                    <TrendingUp className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <div className="text-lg font-bold text-[#111827] font-mono">
                    {stats.engagementRate}%
                  </div>
                  <div className="text-[10px] text-[#059669] mt-0.5 font-medium">
                    {stats.engagementDelta}
                  </div>
                </div>
              </div>

              {/* Channel Realtime Activity (48h & 60m) */}
              {studio?.realtime && (
                <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#111827] flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-[#5B5CE2]" />
                      Channel Realtime Velocity
                    </span>
                    <span className="text-[11px] text-[#6B7280] font-medium">Continuous</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                      <div className="text-[11px] text-[#6B7280]">Views in Last 48 Hours</div>
                      <div className="text-base font-bold text-[#111827] font-mono mt-0.5">
                        {studio.realtime.viewsLast48hFormatted}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                      <div className="text-[11px] text-[#6B7280]">Views in Last 60 Mins</div>
                      <div className="text-base font-bold text-[#111827] font-mono mt-0.5">
                        {studio.realtime.viewsLast60mFormatted}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Channel 14-Day Growth Curve Mini Chart */}
              <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-[#5B5CE2]" />
                      Channel Growth Trajectory
                    </h4>
                    <p className="text-[11px] text-[#6B7280]">
                      14-day subscriber growth trajectory
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#059669]">
                    +{stats.followersDelta}
                  </span>
                </div>

                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={channelGrowthData}>
                      <defs>
                        <linearGradient id="chGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5B5CE2" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#5B5CE2" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={["auto", "auto"]}
                        tickFormatter={(v) =>
                          v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${Math.round(v / 1000)}K`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                          borderRadius: "8px",
                          fontSize: "11px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(val: any) => [val.toLocaleString(), "Subscribers"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="followers"
                        stroke="#5B5CE2"
                        strokeWidth={2}
                        fill="url(#chGrowthGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Other Videos from this Creator */}
              {otherVideos.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#5B5CE2]" />
                    Other Videos from {profile.displayName}
                  </h4>
                  <div className="space-y-2.5">
                    {otherVideos.map((vid, idx) => {
                      const vidUrl = vid.videoUrl || `https://www.youtube.com/watch?v=${vid.id.replace(/^live-/, "")}`;
                      return (
                        <div
                          key={vid.id || idx}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-slate-100/80 border border-[#E5E7EB] transition group"
                        >
                          <a
                            href={vidUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative h-11 w-18 rounded-lg overflow-hidden shrink-0 group/img block"
                            title="Watch video"
                          >
                            {vid.thumbnailUrl ? (
                              <img
                                src={vid.thumbnailUrl}
                                alt={vid.title}
                                className="h-full w-full object-cover group-hover/img:scale-105 transition duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="h-full w-full bg-[#E5E7EB] flex items-center justify-center">
                                <Tv className="h-4 w-4 text-[#9CA3AF]" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                              <Play className="h-3.5 w-3.5 fill-white text-white" />
                            </div>
                          </a>

                          <div className="min-w-0 flex-1">
                            <a
                              href={vidUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-[#111827] truncate block hover:text-[#5B5CE2] transition"
                            >
                              {vid.title}
                            </a>
                            <div className="flex items-center gap-2 text-[10px] text-[#6B7280] mt-0.5">
                              <span>{vid.viewsFormatted} views</span>
                              <span>•</span>
                              <span>{vid.durationOrLength || "Video"}</span>
                              <span>•</span>
                              <a
                                href={vidUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-[#6B7280] hover:text-red-500 transition"
                              >
                                <span>Watch</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>
                          </div>

                          {onAnalyzeVideo && (
                            <button
                              type="button"
                              onClick={() => onAnalyzeVideo(vid)}
                              className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#EEF2FF] hover:bg-[#5B5CE2] text-[#5B5CE2] hover:text-white border border-[#E0E7FF] text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Switch dashboard to analyze this video"
                            >
                              <BarChart3 className="h-3 w-3" />
                              <span>Analyse</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* High-Demand Content & Viewer Rating Intelligence at the bottom of Channel Analytics */}
              <HighDemandContentSection dataset={dataset} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
