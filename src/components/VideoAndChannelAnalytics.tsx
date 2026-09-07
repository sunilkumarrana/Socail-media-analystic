import React, { useState } from "react";
import { DashboardDataset, VideoAnalyticsData, TopContentItem } from "../types";
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

  // Video traffic data
  const trafficData = videoAnalytics.trafficSources.map((item, idx) => ({
    name: item.source.split(" (")[0],
    percentage: item.percentage,
    views: item.viewsFormatted,
    fill: ["#ef4444", "#f97316", "#3b82f6", "#10b981", "#8b5cf6"][idx % 5],
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
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-slate-900 to-indigo-950/40 p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-400 border border-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                Live Video Link Analyzed
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                • Synchronized side-by-side with channel intelligence
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 line-clamp-1">
              {videoAnalytics.title}
            </h2>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-stretch md:self-auto rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveViewMode("side-by-side")}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition ${
              activeViewMode === "side-by-side"
                ? "bg-red-600 text-white font-semibold shadow-md shadow-red-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveViewMode("video-only")}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition ${
              activeViewMode === "video-only"
                ? "bg-red-600 text-white font-semibold shadow-md shadow-red-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Video Deep Dive
          </button>
          <button
            onClick={() => setActiveViewMode("channel-only")}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition ${
              activeViewMode === "channel-only"
                ? "bg-red-600 text-white font-semibold shadow-md shadow-red-600/30"
                : "text-slate-400 hover:text-white"
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
            <div className="rounded-2xl border border-red-500/20 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                    <Tv className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Video Analytics
                      <span className="text-[10px] font-normal normal-case text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                        Target Media
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID: {videoAnalytics.videoId} • Published {videoAnalytics.publishedDate}
                    </p>
                  </div>
                </div>

                <a
                  href={videoAnalytics.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition group"
                >
                  <span>Open Video</span>
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </a>
              </div>

              {/* Video Player / Thumbnail Preview */}
              <div className="mt-4 relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-800 shadow-inner group">
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
                          Duration: {videoAnalytics.duration}
                        </span>
                        <span className="rounded-md bg-red-600/90 px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider shadow">
                          YouTube HD
                        </span>
                      </div>

                      {/* Play Button Overlay */}
                      <button
                        onClick={() => setIsPlayingEmbed(true)}
                        className="self-center flex items-center justify-center h-14 w-14 rounded-full bg-red-600/90 text-white shadow-2xl hover:scale-110 hover:bg-red-500 transition cursor-pointer"
                        title="Play preview"
                      >
                        <Play className="h-6 w-6 fill-white ml-0.5" />
                      </button>

                      <p className="text-xs font-semibold text-white line-clamp-1 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                        {videoAnalytics.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Headline KPIs Grid (4 metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {/* Metric 1: Views */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Live Views</span>
                    <Eye className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {videoAnalytics.viewsFormatted}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5 font-medium">
                    <Zap className="h-2.5 w-2.5" />
                    {videoAnalytics.viewsPerHourFormatted}
                  </div>
                </div>

                {/* Metric 2: Likes */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Likes</span>
                    <ThumbsUp className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {videoAnalytics.likesFormatted}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {videoAnalytics.likeRatio}% positive
                  </div>
                </div>

                {/* Metric 3: Comments */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Comments</span>
                    <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {videoAnalytics.commentsFormatted}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ~{videoAnalytics.sharesFormatted} shares
                  </div>
                </div>

                {/* Metric 4: Engagement Rate */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Engagement</span>
                    <Flame className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {videoAnalytics.engagementRate}%
                  </div>
                  <div className="text-[10px] text-purple-400 mt-0.5 font-medium">
                    Viral Score: {videoAnalytics.viralScore}/100
                  </div>
                </div>
              </div>

              {/* Video vs Channel Baseline Benchmark */}
              <div className="mt-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-slate-950 to-slate-950 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    Performance vs Channel Baseline
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Channel Avg: {Math.round(stats.totalViews / Math.max(1, stats.postsCount)) >= 1000000 
                      ? `${(stats.totalViews / Math.max(1, stats.postsCount) / 1000000).toFixed(1)}M` 
                      : `${Math.round(stats.totalViews / Math.max(1, stats.postsCount) / 1000)}K`} views/vid
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div
                      className={`h-7 w-7 rounded-md flex items-center justify-center ${
                        videoAnalytics.vsChannelAverage.isViewsHigher
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {videoAnalytics.vsChannelAverage.isViewsHigher ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {videoAnalytics.vsChannelAverage.viewsMultiplier} Views
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {videoAnalytics.vsChannelAverage.viewsDeltaPercent} vs average upload
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div
                      className={`h-7 w-7 rounded-md flex items-center justify-center ${
                        videoAnalytics.vsChannelAverage.isEngagementHigher
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {videoAnalytics.vsChannelAverage.engagementDeltaPercent} Engagement
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Channel benchmark: {stats.engagementRate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Audience Retention Curve */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-red-400" />
                      Audience Retention Curve
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Second-by-second drop-off for this video
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      {videoAnalytics.avgViewDuration}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Avg View ({videoAnalytics.avgPercentageViewed}%)
                    </div>
                  </div>
                </div>

                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retentionData}>
                      <defs>
                        <linearGradient id="vidRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                        formatter={(val: any) => [`${val}% retained`, "Retention"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="percent"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fill="url(#vidRetentionGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Video Traffic Sources Breakdown */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-red-400" />
                  Traffic Sources for this Video
                </h4>
                <div className="space-y-2.5">
                  {trafficData.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 truncate max-w-[200px]">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">{item.views} views</span>
                          <span className="font-semibold text-white">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
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
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Video Keywords & Categories</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {videoAnalytics.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-800/80 px-2 py-1 text-[11px] text-slate-300 border border-slate-700/60"
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
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Channel Analytics
                      <span className="text-[10px] font-normal normal-case text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                        Host Channel
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      {profile.handle} • Joined {profile.joinedYear}
                    </p>
                  </div>
                </div>

                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition group"
                >
                  <span>Visit Channel</span>
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </a>
              </div>

              {/* Channel Profile Banner & Identity */}
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80">
                {profile.bannerUrl ? (
                  <div className="h-20 sm:h-24 w-full overflow-hidden relative">
                    <img
                      src={profile.bannerUrl}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-16 w-full bg-gradient-to-r from-red-900/50 via-indigo-900/50 to-slate-900" />
                )}

                <div className="p-4 pt-2 flex items-center gap-3.5">
                  <div className="relative -mt-8 shrink-0">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="h-14 w-14 rounded-full border-2 border-slate-900 object-cover shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {profile.initials}
                      </div>
                    )}
                    {profile.verified && (
                      <CheckCircle2 className="absolute bottom-0 right-0 h-4 w-4 fill-blue-500 text-slate-900" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white truncate">
                        {profile.displayName}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {profile.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Channel Headline KPIs (4 metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {/* Metric 1: Subscribers */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Subscribers</span>
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {stats.followersFormatted}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">
                    {stats.followersDelta}
                  </div>
                </div>

                {/* Metric 2: Total Views */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Channel Views</span>
                    <Eye className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {stats.totalViewsFormatted}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">
                    {stats.viewsDelta}
                  </div>
                </div>

                {/* Metric 3: Total Uploads */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Uploads</span>
                    <Tv className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {stats.postsCountFormatted}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {stats.postsDelta} recently
                  </div>
                </div>

                {/* Metric 4: Avg Channel Engagement */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Channel Eng</span>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {stats.engagementRate}%
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">
                    {stats.engagementDelta}
                  </div>
                </div>
              </div>

              {/* Channel Realtime Activity (48h & 60m) */}
              {studio?.realtime && (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                      Channel Real-Time Activity
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Updating Live</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Views in Last 48 Hours</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {studio.realtime.viewsLast48hFormatted}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Views in Last 60 Mins</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {studio.realtime.viewsLast60mFormatted}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Channel 14-Day Growth Curve Mini Chart */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                      Channel Growth Trajectory
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      14-day subscriber growth trajectory
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    +{stats.followersDelta}
                  </span>
                </div>

                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={channelGrowthData}>
                      <defs>
                        <linearGradient id="chGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
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
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                        formatter={(val: any) => [val.toLocaleString(), "Subscribers"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="followers"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="url(#chGrowthGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Other Videos from this Creator */}
              {otherVideos.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-400" />
                    Other Videos from {profile.displayName}
                  </h4>
                  <div className="space-y-2.5">
                    {otherVideos.map((vid, idx) => {
                      const vidUrl = vid.videoUrl || `https://www.youtube.com/watch?v=${vid.id.replace(/^live-/, "")}`;
                      return (
                        <div
                          key={vid.id || idx}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition group"
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
                              <div className="h-full w-full bg-slate-800 flex items-center justify-center">
                                <Tv className="h-4 w-4 text-slate-500" />
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
                              className="text-xs font-semibold text-white truncate block hover:text-indigo-300 transition"
                            >
                              {vid.title}
                            </a>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>{vid.viewsFormatted} views</span>
                              <span>•</span>
                              <span>{vid.durationOrLength || "Video"}</span>
                              <span>•</span>
                              <a
                                href={vidUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-slate-400 hover:text-red-400 transition"
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
                              className="shrink-0 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
