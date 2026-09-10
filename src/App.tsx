import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { SearchBar } from "./components/SearchBar";
import { ProfileHeader } from "./components/ProfileHeader";
import { StatCards } from "./components/StatCards";
import { GrowthChart } from "./components/GrowthChart";
import { TopContentTable } from "./components/TopContentTable";
import { EngagementDonut } from "./components/EngagementDonut";
import { AiInsightCard } from "./components/AiInsightCard";
import { ConnectModal } from "./components/ConnectModal";
import { CompareView } from "./components/CompareView";
import { StudioAnalyticsView } from "./components/StudioAnalyticsView";
import { SkeletonDashboard } from "./components/SkeletonDashboard";
import { EmptyLandingState } from "./components/EmptyLandingState";
import { ReachTab } from "./components/ReachTab";
import { EngagementTab } from "./components/EngagementTab";
import { AudienceTab } from "./components/AudienceTab";
import { VideoAndChannelAnalytics } from "./components/VideoAndChannelAnalytics";
import { Platform, DashboardDataset, TopContentItem, VideoAnalyticsData } from "./types";
import { generateMockStats, nudgeStats, formatNumber } from "./utils/mockGenerator";
import { RotateCcw, LayoutDashboard, Compass, HeartHandshake, Users, Tv, Radio } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "studio" | "compare">("dashboard");
  const [hasSearched, setHasSearched] = useState<boolean>(false); // Start empty on overview page: user inputs URL/name first!
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentPlatform, setCurrentPlatform] = useState<Platform>("youtube");
  const [dataset, setDataset] = useState<DashboardDataset | null>(null);

  // AI Insight State
  const [aiInsight, setAiInsight] = useState<string>("");
  const [aiSource, setAiSource] = useState<string>("");
  const [aiModelName, setAiModelName] = useState<string>("");
  const [isGeneratingInsight, setIsGeneratingInsight] = useState<boolean>(false);

  // Near-real-time refresh state
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Connect Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  // Dashboard Subtab & Period State
  const [dashboardTab, setDashboardTab] = useState<"overview" | "video-analytics" | "reach" | "engagement" | "audience">("overview");
  const [dashboardPeriod, setDashboardPeriod] = useState<"7d" | "28d" | "90d">("28d");

  // Fetch AI insight from server-side Gemini endpoint
  const requestAiInsight = useCallback(
    async (dataToAnalyze: DashboardDataset) => {
      setIsGeneratingInsight(true);
      try {
        const response = await fetch("/api/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            handle: dataToAnalyze.profile.handle,
            platform: dataToAnalyze.profile.platform,
            stats: dataToAnalyze.stats,
            topPosts: dataToAnalyze.topContent,
            engagement: dataToAnalyze.engagement,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setAiInsight(data.insight);
        setAiSource(data.source);
        if (data.modelName) setAiModelName(data.modelName);
      } catch (err) {
        console.warn("Using local fallback insight due to network/API status:", err);
        // Resilient fallback insight text
        const pName =
          dataToAnalyze.profile.platform.charAt(0).toUpperCase() +
          dataToAnalyze.profile.platform.slice(1);
        setAiInsight(
          `${dataToAnalyze.profile.handle} displays resilient organic growth momentum on ${pName} with a ${dataToAnalyze.stats.followersDelta} audience velocity over trailing periods. Engagement rates hold comfortably at ${dataToAnalyze.stats.engagementRate}%, indicating an active core community that consistently amplifies top releases. To sustain this trajectory, diversifying formats into high-retention episodic series is recommended.`
        );
        setAiSource("simulated_analyst");
        setAiModelName("Intelligence Benchmark Engine");
      } finally {
        setIsGeneratingInsight(false);
      }
    },
    []
  );

  // Initial AI insight call on mount
  useEffect(() => {
    if (dataset && !aiInsight) {
      requestAiInsight(dataset);
    }
  }, [dataset, aiInsight, requestAiInsight]);

  // Handle Search Submission
  const handleSearch = async (input: string, platform: Platform) => {
    setIsLoading(true);
    setCurrentInput(input);
    setCurrentPlatform(platform);

    const isYouTube =
      platform === "youtube" ||
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
          setDataset(liveData);
          setHasSearched(true);
          setIsLoading(false);
          if (liveData.videoAnalytics) {
            setDashboardTab("video-analytics");
          } else {
            setDashboardTab("overview");
          }
          requestAiInsight(liveData);
          return;
        }
      } catch (err) {
        console.warn("YouTube live lookup fallback:", err);
      }
    }

    // Default or fallback generator
    setTimeout(() => {
      const newDataset = generateMockStats(input, platform);
      setDataset(newDataset);
      setHasSearched(true);
      setIsLoading(false);
      requestAiInsight(newDataset);
    }, 450);
  };

  // Manual Live Refresh
  const handleManualRefresh = async () => {
    if (!dataset) return;
    setIsRefreshing(true);
    const isYouTube =
      currentPlatform === "youtube" ||
      currentInput.includes("youtube.com") ||
      currentInput.includes("youtu.be");

    if (isYouTube && currentInput) {
      try {
        const res = await fetch("/api/youtube-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: currentInput }),
        });
        if (res.ok) {
          const liveData = await res.json();
          setDataset(liveData);
          setIsRefreshing(false);
          return;
        }
      } catch (err) {
        console.warn("YouTube live refresh fallback:", err);
      }
    }

    setTimeout(() => {
      setDataset((prev) => (prev ? nudgeStats(prev) : prev));
      setIsRefreshing(false);
    }, 350);
  };

  // Auto-refresh interval (every 30 seconds)
  useEffect(() => {
    if (isAutoRefreshEnabled) {
      autoRefreshTimerRef.current = setInterval(async () => {
        const isYouTube =
          currentPlatform === "youtube" ||
          currentInput.includes("youtube.com") ||
          currentInput.includes("youtu.be");

        if (isYouTube && currentInput) {
          try {
            const res = await fetch("/api/youtube-lookup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: currentInput }),
            });
            if (res.ok) {
              const liveData = await res.json();
              setDataset(liveData);
              return;
            }
          } catch (e) {
            // fallback nudge
          }
        }
        setDataset((prev) => (prev ? nudgeStats(prev) : prev));
      }, 30000);
    } else {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    }

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    };
  }, [isAutoRefreshEnabled, currentInput, currentPlatform]);

  const handleResetToLanding = () => {
    setHasSearched(false);
    setDataset(null);
    setCurrentInput("");
    setDashboardTab("overview");
  };

  // Handle video analysis when user clicks to analyze a specific video
  const handleAnalyzeVideo = async (item: TopContentItem) => {
    setIsLoading(true);

    const isYouTube =
      item.videoUrl?.includes("youtube.com") ||
      item.videoUrl?.includes("youtu.be") ||
      item.id.startsWith("live-");

    if (isYouTube && item.videoUrl) {
      try {
        const res = await fetch("/api/youtube-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: item.videoUrl }),
        });
        if (res.ok) {
          const liveData = await res.json();
          if (liveData.videoAnalytics) {
            setDataset(liveData);
            setDashboardTab("video-analytics");
            setIsLoading(false);
            requestAiInsight(liveData);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
        }
      } catch (err) {
        console.warn("YouTube video analysis lookup fallback:", err);
      }
    }

    // Dynamic Video Analytics creation for this specific item
    let videoId = item.id.replace(/^live-/, "");
    if (item.videoUrl) {
      const match = item.videoUrl.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
      if (match) videoId = match[1];
    }
    if (!videoId || videoId.startsWith("content-")) {
      videoId = "kJQP7kiw5Fk";
    }

    const chAvgViews = dataset?.stats?.totalViews
      ? Math.max(1000, Math.round(dataset.stats.totalViews / Math.max(1, dataset.stats.postsCount)))
      : 250000;

    const isViewsHigher = item.views >= chAvgViews;
    const viewsMultiplier = (item.views / Math.max(1, chAvgViews)).toFixed(1) + "x";
    const rawViewsDelta = Math.round(((item.views - chAvgViews) / Math.max(1, chAvgViews)) * 100);
    const viewsDeltaPercent = `${rawViewsDelta >= 0 ? "+" : ""}${rawViewsDelta}%`;

    const channelER = dataset?.stats?.engagementRate || 3.5;
    const isEngagementHigher = item.engagementRate >= channelER;
    const rawEngDelta = Number((item.engagementRate - channelER).toFixed(1));
    const engagementDeltaPercent = `${rawEngDelta >= 0 ? "+" : ""}${rawEngDelta}%`;

    const viewsPerHour = Math.max(60, Math.round(item.views / 48));
    const likeRatio = Number(
      Math.min(99.4, 94.5 + Math.min(5.0, (item.likes / Math.max(1, item.views)) * 100)).toFixed(1)
    );

    const generatedVideoAnalytics: VideoAnalyticsData = {
      videoId,
      title: item.title,
      videoUrl: item.videoUrl || `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: item.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      publishedDate: item.publishedDate,
      duration: item.durationOrLength || "16:42",
      descriptionSnippet: `Full performance diagnostics, retention curve telemetry, and traffic distribution for "${item.title}". Benchmarked against channel averages.`,
      tags: [item.type, "Audience Retention", "Virality", "Creator Performance", "Traffic Analysis"],
      views: item.views,
      viewsFormatted: item.viewsFormatted,
      viewsPerHour,
      viewsPerHourFormatted: `${formatNumber(viewsPerHour)}/hr`,
      likes: item.likes,
      likesFormatted: item.likesFormatted,
      likeRatio,
      comments: item.comments,
      commentsFormatted: item.commentsFormatted,
      shares: item.shares,
      sharesFormatted: item.sharesFormatted,
      engagementRate: item.engagementRate,
      viralScore: Math.min(98, Math.round(55 + (item.views > 1000000 ? 35 : item.views / 35000))),
      avgViewDuration: "12:15",
      avgPercentageViewed: 58.4,
      retentionCurve: [
        { percentOfVideo: 0, retentionPercent: 100, timeLabel: "0:00" },
        { percentOfVideo: 10, retentionPercent: 88, timeLabel: "Hook" },
        { percentOfVideo: 25, retentionPercent: 79, timeLabel: "Segment 1" },
        { percentOfVideo: 50, retentionPercent: 66, timeLabel: "Midpoint" },
        { percentOfVideo: 75, retentionPercent: 55, timeLabel: "Climax" },
        { percentOfVideo: 90, retentionPercent: 46, timeLabel: "Summary" },
        { percentOfVideo: 100, retentionPercent: 34, timeLabel: "Outro" },
      ],
      trafficSources: [
        { source: "Browse features (Home/Sub feed)", percentage: 54.2, viewsFormatted: formatNumber(Math.round(item.views * 0.542)) },
        { source: "Suggested videos (Up next)", percentage: 28.6, viewsFormatted: formatNumber(Math.round(item.views * 0.286)) },
        { source: "YouTube / Platform Search", percentage: 11.4, viewsFormatted: formatNumber(Math.round(item.views * 0.114)) },
        { source: "External links & social shares", percentage: 3.8, viewsFormatted: formatNumber(Math.round(item.views * 0.038)) },
        { source: "Direct or other", percentage: 2.0, viewsFormatted: formatNumber(Math.round(item.views * 0.02)) },
      ],
      topSearchTerms: [
        { term: item.title.slice(0, 32), percentage: 44.5 },
        { term: `${dataset?.profile.displayName || "creator"} breakdown`, percentage: 24.2 },
        { term: `${item.title.split(" ")[0]} full analysis`, percentage: 18.3 },
        { term: "viral reaction highlights", percentage: 13.0 },
      ],
      vsChannelAverage: {
        viewsDeltaPercent,
        viewsMultiplier,
        engagementDeltaPercent,
        isViewsHigher,
        isEngagementHigher,
      },
    };

    if (dataset) {
      const updated = {
        ...dataset,
        videoAnalytics: generatedVideoAnalytics,
      };
      setDataset(updated);
      requestAiInsight(updated);
    }

    setDashboardTab("video-analytics");
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        lastUpdated={dataset?.lastUpdated || "Just now"}
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        setIsAutoRefreshEnabled={setIsAutoRefreshEnabled}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        isRealtimeVerified={dataset?.isRealtimeVerified}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "compare" ? (
          /* Compare Accounts View */
          <CompareView
            initialHandleA={dataset?.profile.rawInput || currentInput || "youtube.com/@mkbhd"}
            initialPlatformA={dataset?.profile.platform || currentPlatform}
          />
        ) : activeTab === "studio" ? (
          /* Channel Analytics & Creator Telemetry View */
          <div>
            {/* Show Top Search Bar only after an account has been loaded */}
            {hasSearched && (
              <div className="relative mb-6">
                <SearchBar
                  currentHandle={currentInput}
                  currentPlatform={currentPlatform}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />

                <button
                  onClick={handleResetToLanding}
                  title="Return to empty search invitation"
                  className="absolute -top-6 right-0 text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Analyze Another Channel</span>
                </button>
              </div>
            )}

            {!hasSearched ? (
              /* Empty Landing State - user inputs URL/account name first! */
              <EmptyLandingState
                onSearch={handleSearch}
                onSelectSample={(handle, platform) => handleSearch(handle, platform)}
                isLoading={isLoading}
              />
            ) : isLoading ? (
              /* Loading Skeletons */
              <SkeletonDashboard />
            ) : dataset ? (
              <StudioAnalyticsView dataset={dataset} />
            ) : null}
          </div>
        ) : (
          /* Dashboard Overview View */
          <div>
            {/* Show Top Search Bar only after an account has been loaded */}
            {hasSearched && (
              <div className="relative mb-6">
                <SearchBar
                  currentHandle={currentInput}
                  currentPlatform={currentPlatform}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />

                <button
                  onClick={handleResetToLanding}
                  title="Return to empty search invitation"
                  className="absolute -top-6 right-0 text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Analyze Another Channel</span>
                </button>
              </div>
            )}

            {!hasSearched ? (
              /* Empty Landing State - user inputs URL/account name first! */
              <EmptyLandingState
                onSearch={handleSearch}
                onSelectSample={(handle, platform) => handleSearch(handle, platform)}
                isLoading={isLoading}
              />
            ) : isLoading ? (
              /* Loading Skeletons */
              <SkeletonDashboard />
            ) : dataset ? (
              /* Dashboard Data Grid */
              <div className="space-y-6">
                {/* 1. Profile Header */}
                <ProfileHeader
                  profile={dataset.profile}
                  onCompareThis={() => setActiveTab("compare")}
                />

                {/* Dashboard Subtabs Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                    {dataset.videoAnalytics && (
                      <button
                        id="dashboard-subtab-video"
                        onClick={() => setDashboardTab("video-analytics")}
                        className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                          dashboardTab === "video-analytics"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                        }`}
                      >
                        <Tv className="h-3.5 w-3.5" />
                        <span>Video &amp; Channel Comparison</span>
                      </button>
                    )}

                    <button
                      id="dashboard-subtab-overview"
                      onClick={() => setDashboardTab("overview")}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                        dashboardTab === "overview"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      <span>Overview</span>
                    </button>

                    <button
                      id="dashboard-subtab-reach"
                      onClick={() => setDashboardTab("reach")}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                        dashboardTab === "reach"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <Compass className="h-3.5 w-3.5" />
                      <span>Reach</span>
                      <span className="hidden md:inline-block text-[10px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded font-normal">
                        Traffic Sources
                      </span>
                    </button>

                    <button
                      id="dashboard-subtab-engagement"
                      onClick={() => setDashboardTab("engagement")}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                        dashboardTab === "engagement"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <HeartHandshake className="h-3.5 w-3.5" />
                      <span>Engagement</span>
                      <span className="hidden md:inline-block text-[10px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded font-normal">
                        AVD &amp; Rates
                      </span>
                    </button>

                    <button
                      id="dashboard-subtab-audience"
                      onClick={() => setDashboardTab("audience")}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                        dashboardTab === "audience"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Audience</span>
                      <span className="hidden md:inline-block text-[10px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded font-normal">
                        Demographics
                      </span>
                    </button>
                  </div>

                  {/* Time Period Selector (for Reach, Engagement, Audience) */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="flex items-center gap-1 bg-slate-900/80 rounded-xl p-1 border border-slate-800 text-xs">
                      <button
                        onClick={() => setDashboardPeriod("7d")}
                        className={`px-2.5 py-1 font-medium rounded-lg transition ${
                          dashboardPeriod === "7d"
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        7 Days
                      </button>
                      <button
                        onClick={() => setDashboardPeriod("28d")}
                        className={`px-2.5 py-1 font-medium rounded-lg transition ${
                          dashboardPeriod === "28d"
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        28 Days
                      </button>
                      <button
                        onClick={() => setDashboardPeriod("90d")}
                        className={`px-2.5 py-1 font-medium rounded-lg transition ${
                          dashboardPeriod === "90d"
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        90 Days
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtab Contents */}
                {dashboardTab === "video-analytics" && dataset.videoAnalytics && (
                  <VideoAndChannelAnalytics
                    dataset={dataset}
                    videoAnalytics={dataset.videoAnalytics}
                    onAnalyzeVideo={handleAnalyzeVideo}
                  />
                )}

                {dashboardTab === "overview" && (
                  <div className="space-y-6">
                    {/* Video Analysis Active Banner */}
                    {dataset.videoAnalytics && (
                      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                            <Tv className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white flex items-center gap-1.5">
                              <span>Video Diagnostics:</span>
                              <span className="text-slate-300 font-normal truncate max-w-[280px] sm:max-w-md">
                                {dataset.videoAnalytics.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {dataset.videoAnalytics.viewsFormatted} views • {dataset.videoAnalytics.viewsPerHourFormatted} • {dataset.videoAnalytics.likeRatio}% positive
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setDashboardTab("video-analytics")}
                          className="shrink-0 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Open Side-by-Side View</span>
                          <Tv className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      </div>
                    )}

                    {/* 2. Headline Stat Cards */}
                    <StatCards stats={dataset.stats} platform={dataset.profile.platform} />

                    {/* 3. AI Insight Summary Panel (Gemini API) */}
                    <AiInsightCard
                      insight={aiInsight}
                      source={aiSource}
                      modelName={aiModelName}
                      isLoading={isGeneratingInsight}
                      onRegenerate={() => requestAiInsight(dataset)}
                      handle={dataset.profile.handle}
                      platform={dataset.profile.platform}
                    />

                    {/* 4 & 5. YouTube Studio Growth Trend Chart & Engagement Breakdown */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <GrowthChart
                          history={dataset.history}
                          platform={dataset.profile.platform}
                          stats={dataset.stats}
                          topContent={dataset.topContent}
                          videoAnalytics={dataset.videoAnalytics}
                        />
                      </div>
                      <div>
                        <EngagementDonut
                          engagement={dataset.engagement}
                          platform={dataset.profile.platform}
                        />
                      </div>
                    </div>

                    {/* 6. Top Content Table */}
                    <TopContentTable
                      content={dataset.topContent}
                      platform={dataset.profile.platform}
                      onAnalyzeVideo={handleAnalyzeVideo}
                    />

                    {/* Bottom Callout for OAuth Connection */}
                    <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Unlock Private Creator Telemetry
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Need retention curves, second-by-second drop-off graphs, or audience demographics?
                        </p>
                      </div>
                      <button
                        onClick={() => setIsConnectModalOpen(true)}
                        className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                      >
                        Connect Your Account
                      </button>
                    </div>
                  </div>
                )}

                {dashboardTab === "reach" && dataset.studio && (
                  <ReachTab
                    studio={dataset.studio}
                    platform={dataset.profile.platform}
                    period={dashboardPeriod}
                    onPeriodChange={setDashboardPeriod}
                  />
                )}

                {dashboardTab === "engagement" && dataset.studio && (
                  <EngagementTab
                    studio={dataset.studio}
                    platform={dataset.profile.platform}
                    period={dashboardPeriod}
                    onPeriodChange={setDashboardPeriod}
                  />
                )}

                {dashboardTab === "audience" && dataset.studio && (
                  <AudienceTab
                    studio={dataset.studio}
                    platform={dataset.profile.platform}
                    period={dashboardPeriod}
                    onPeriodChange={setDashboardPeriod}
                  />
                )}
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SocialPulse Prototype — Demonstrating social analytics UI/UX with deterministic simulation.
          </p>
          <p className="text-slate-400">
            Powered by Google AI Studio & Gemini 3.8 Flash
          </p>
        </div>
      </footer>

      {/* Connect Account Explainer Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
