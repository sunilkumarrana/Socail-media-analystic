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
import { Platform, DashboardDataset } from "./types";
import { generateMockStats, nudgeStats } from "./utils/mockGenerator";
import { RotateCcw } from "lucide-react";

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

  // Manual Nudge Refresh
  const handleManualRefresh = () => {
    if (!dataset) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setDataset((prev) => (prev ? nudgeStats(prev) : prev));
      setIsRefreshing(false);
    }, 350);
  };

  // Auto-refresh interval (every 30 seconds)
  useEffect(() => {
    if (isAutoRefreshEnabled) {
      autoRefreshTimerRef.current = setInterval(() => {
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
  }, [isAutoRefreshEnabled]);

  const handleResetToLanding = () => {
    setHasSearched(false);
    setDataset(null);
    setCurrentInput("");
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
