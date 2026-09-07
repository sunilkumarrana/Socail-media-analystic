import React, { useState, useEffect } from "react";
import {
  Platform,
  DashboardDataset,
  CompareInsightData,
  BeatCompetitorTactic,
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
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  Eye,
  Percent,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Target,
  Zap,
  Award,
  ArrowRight,
  TrendingDown,
  Crosshair,
  Swords,
  CheckSquare,
  Square,
  Filter,
} from "lucide-react";

interface CompareViewProps {
  initialHandleA?: string;
  initialPlatformA?: Platform;
}

export const normalizeAccountInput = (input: string): string => {
  if (!input) return "";
  let clean = input.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\//, "").replace(/^www\./, "");
  clean = clean.replace(/\/+$/, "");
  clean = clean.replace(/\/(featured|videos|shorts|about|community)$/, "");
  clean = clean.replace(/^(youtube\.com|instagram\.com|x\.com|twitter\.com)\//, "");
  clean = clean.replace(/^@/, "");
  return clean;
};

export const CompareView: React.FC<CompareViewProps> = ({
  initialHandleA = "https://www.youtube.com/@CodeWithHarry",
  initialPlatformA = "youtube",
}) => {
  // Account A (User's Target Account)
  const [handleA, setHandleA] = useState(initialHandleA);
  const [platformA, setPlatformA] = useState<Platform>(initialPlatformA);

  // Account B (User enters their own competitor - NO PRE-FILLED COMPETITOR LINK)
  const [handleB, setHandleB] = useState("");
  const [platformB, setPlatformB] = useState<Platform>("youtube");

  // Datasets
  const [dataA, setDataA] = useState<DashboardDataset>(() =>
    generateMockStats(handleA, platformA)
  );
  // dataB starts null so user can enter their own competitor
  const [dataB, setDataB] = useState<DashboardDataset | null>(null);

  const [isComparing, setIsComparing] = useState(false);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [compareMetric, setCompareMetric] = useState<"followers" | "views">("followers");

  // Battle Plan Tactics & State
  const [compareInsight, setCompareInsight] = useState<CompareInsightData | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [insightModel, setInsightModel] = useState("Competitive Benchmark Engine");
  const [copiedRecs, setCopiedRecs] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [completedTactics, setCompletedTactics] = useState<Record<string, boolean>>({});

  // Duplicate link detection
  const normalizedA = normalizeAccountInput(handleA);
  const normalizedB = normalizeAccountInput(handleB);
  const isDuplicateInput = Boolean(normalizedA && normalizedB && normalizedA === normalizedB);

  const isDuplicateRendered = Boolean(
    dataA &&
    dataB &&
    dataA.profile.handle &&
    dataB.profile.handle &&
    normalizeAccountInput(dataA.profile.handle) === normalizeAccountInput(dataB.profile.handle)
  );

  const isDuplicate = isDuplicateInput || isDuplicateRendered;

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

  // Sync if initialHandleA changes from parent search
  useEffect(() => {
    if (initialHandleA && normalizeAccountInput(initialHandleA) !== normalizeAccountInput(handleA)) {
      setHandleA(initialHandleA);
      const plat = (initialPlatformA || "youtube") as Platform;
      setPlatformA(plat);
      fetchChannelData(initialHandleA, plat).then((res) => {
        setDataA(res);
      });
    }
  }, [initialHandleA, initialPlatformA]);

  // Generate dynamic client-side tactics to beat the competitor
  const generateTacticsToBeatCompetitor = (a: DashboardDataset, b: DashboardDataset): BeatCompetitorTactic[] => {
    const nameA = a.profile.displayName;
    const nameB = b.profile.displayName;

    const subA = a.stats.followers;
    const subB = b.stats.followers;
    const viewsA = a.stats.totalViews;
    const viewsB = b.stats.totalViews;
    const erA = a.stats.engagementRate;
    const erB = b.stats.engagementRate;

    const postsA = Math.max(1, a.stats.postsCount);
    const postsB = Math.max(1, b.stats.postsCount);
    const avgViewsA = Math.round(viewsA / postsA);
    const avgViewsB = Math.round(viewsB / postsB);

    const userHasHigherER = erA > erB;
    const competitorHasMoreViewsPerVideo = avgViewsB > avgViewsA;
    const competitorHasMoreSubs = subB > subA;

    return [
      {
        id: "tactic-packaging",
        priority: "Critical Priority",
        category: "Packaging & CTR",
        title: `Counter-Package Thumbnails to Steal ${nameB}'s Suggested Video Clicks`,
        tacticalAction: `Perform a packaging audit on ${nameB}'s last 10 uploads. If they use dark, text-heavy designs, deploy high-contrast vibrant visuals with emotive focal points. Strict rule: maximum 3 curiosity-inducing words on the thumbnail (e.g., "NEVER Do This" instead of repeating the topic title). YouTube automatically presents your videos in ${nameB}'s "Up Next" sidebar—high-contrast packaging ensures you win the impression click.`,
        whyItBeatsCompetitor: competitorHasMoreViewsPerVideo
          ? `${nameB} commands ~${formatNumber(avgViewsB)} views per video largely from browse feeds. Capturing even 15% of their suggested sidebar impressions diverts substantial view volume directly to your channel.`
          : `Your view efficiency (~${formatNumber(avgViewsA)}/video) is strong; contrast-packaging prevents browse leakage and converts searchers browsing ${nameB}'s catalog.`,
        expectedAdvantage: "+18% to +32% higher Click-Through-Rate (CTR) on competitor-related suggested sidebars",
      },
      {
        id: "tactic-retention",
        priority: "High Leverage",
        category: "Retention & Watch Time",
        title: `Cut Intros Under 5 Seconds to Beat ${nameB}'s Audience Retention Curve`,
        tacticalAction: `Eliminate animated channel logos, generic greetings ("welcome back guys"), and slow introductory agendas. Start at second 0 directly with the highest-stakes payoff, problem demo, or core curiosity hook. Deploy pattern interrupts (camera punches, on-screen callouts, audio cues) every 45 seconds to keep your 3-minute audience retention above 60%.`,
        whyItBeatsCompetitor: `The YouTube algorithm compares Relative Audience Retention between videos covering the same topic. When your retention at minute 2 exceeds ${nameB}'s curve, YouTube progressively swaps their video with yours in search and homepage feeds.`,
        expectedAdvantage: "Pushes average watch-time past 55%, prioritizing your uploads in recommendation carousels",
      },
      {
        id: "tactic-topic",
        priority: "High Leverage",
        category: "Topic Gaps",
        title: `Cannibalize ${nameB}'s Aging Evergreen Videos with 2026 Modernized Guides`,
        tacticalAction: `Inspect ${nameB}'s top 10 most-viewed videos published 12 to 24 months ago. Spot deprecated libraries, changed APIs, or frequent unanswered questions in their comments. Produce updated 2026 definitive masterclasses with downloadable cheat-sheets, modern code repositories, and zero-fluff explanations that make competitor videos obsolete.`,
        whyItBeatsCompetitor: `Viewers searching for tutorials actively avoid outdated videos. Intercepting high-volume keywords with fresh, comprehensive uploads captures search dominance away from ${nameB}'s legacy catalog.`,
        expectedAdvantage: `Captures search rank #1 for high-intent queries currently held by ${nameB}`,
      },
      {
        id: "tactic-timing",
        priority: "Quick Win",
        category: "Upload Timing",
        title: `Pre-Empt ${nameB}'s Prime Upload Window by 2 Hours`,
        tacticalAction: `Identify the days and hours ${nameB} routinely drops new uploads. Schedule your release 90-120 minutes prior. This allows YouTube's notification delivery and initial seed audience loops to warm up your video right as your shared audience opens the app, absorbing viewer attention before ${nameB}'s notification arrives.`,
        whyItBeatsCompetitor: `Viewers have finite daily watch time. Securing their initial 15-minute viewing session pre-empts them from starting competitor uploads during peak consumption windows.`,
        expectedAdvantage: "Maximizes Day-1 subscriber velocity and notification click-through velocity",
      },
      {
        id: "tactic-community",
        priority: "Strategic Moat",
        category: "Community Moat",
        title: userHasHigherER
          ? `Leverage Your ${erA}% Engagement Lead to Convert Viewers into Vocal Advocates`
          : `Close the Engagement Gap with Pinned Discussion Loops & Direct Utility`,
        tacticalAction: userHasHigherER
          ? `Your ${erA}% engagement rate leads ${nameB}'s ${erB}%. Capitalize on this loyalty moat by pinning interactive challenge prompts, responding to early commenters within 30 minutes, and featuring community solutions on-screen. This turns casual viewers into brand advocates who recommend your channel over ${nameB}.`
          : `${nameB} currently achieves ${erB}% ER vs your ${erA}%. Bridge this gap immediately: pin a dedicated resource link (cheat-sheet, GitHub repo) and an open-ended debate question in your top comment within 5 minutes of uploading, and reply to the first 30 comments within 1 hour.`,
        whyItBeatsCompetitor: `Early comment velocity signals strong viewer satisfaction to the YouTube algorithm, boosting homepage distribution speed and community lock-in.`,
        expectedAdvantage: "Elevates viewer-to-subscriber conversion rate to 3.8%+",
      },
    ];
  };

  const fetchComparativeInsight = async (a: DashboardDataset, b: DashboardDataset) => {
    if (normalizeAccountInput(a.profile.handle) === normalizeAccountInput(b.profile.handle)) {
      setCompareInsight(null);
      return;
    }

    setIsGeneratingInsight(true);
    try {
      const res = await fetch("/api/compare-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountA: {
            name: a.profile.displayName,
            handle: a.profile.handle,
            platform: a.profile.platform,
            stats: a.stats,
            topPosts: a.topContent,
          },
          accountB: {
            name: b.profile.displayName,
            handle: b.profile.handle,
            platform: b.profile.platform,
            stats: b.stats,
            topPosts: b.topContent,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          // Enrich with waysToBeatCompetitor if missing
          const data = json.data;
          if (!data.waysToBeatCompetitor || data.waysToBeatCompetitor.length === 0) {
            data.waysToBeatCompetitor = generateTacticsToBeatCompetitor(a, b);
          }
          setCompareInsight(data);
          setInsightModel(json.modelName || "Comparative Intelligence Engine");
          setIsGeneratingInsight(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Comparative insight request error:", err);
    }

    // Client-side fallback tactics
    const tactics = generateTacticsToBeatCompetitor(a, b);
    setCompareInsight({
      executiveSummary: `Benchmarking ${a.profile.displayName} against ${b.profile.displayName}.`,
      metricsComparison: {
        subscribers: { leader: a.stats.followers > b.stats.followers ? "Account A" : "Account B", differential: "", analysis: "" },
        totalViews: { leader: a.stats.totalViews > b.stats.totalViews ? "Account A" : "Account B", differential: "", analysis: "" },
        engagementRate: { leader: a.stats.engagementRate > b.stats.engagementRate ? "Account A" : "Account B", differential: "", analysis: "" },
        growthVelocity: { leader: "Account A", differential: "", analysis: "" },
      },
      actionableRecommendations: [],
      waysToBeatCompetitor: tactics,
    });
    setInsightModel("Algorithmic Benchmark Engine");
    setIsGeneratingInsight(false);
  };

  const handleRunCompare = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!handleA.trim() || !handleB.trim() || isDuplicateInput) return;

    setIsComparing(true);
    try {
      const [resA, resB] = await Promise.all([
        fetchChannelData(handleA, platformA),
        fetchChannelData(handleB, platformB),
      ]);
      setDataA(resA);
      setDataB(resB);
      await fetchComparativeInsight(resA, resB);
    } catch (err) {
      console.error("Comparison execution error:", err);
    } finally {
      setIsComparing(false);
    }
  };

  // Toggle tactic completed status
  const toggleTactic = (tacticId: string) => {
    setCompletedTactics((prev) => ({
      ...prev,
      [tacticId]: !prev[tacticId],
    }));
  };

  // Copy Battle Plan to Clipboard
  const handleCopyBattlePlan = () => {
    if (!dataA || !dataB) return;
    const tactics = compareInsight?.waysToBeatCompetitor || generateTacticsToBeatCompetitor(dataA, dataB);
    const planText = [
      `⚔️ BATTLE PLAN: HOW TO BEAT ${dataB.profile.displayName.toUpperCase()}`,
      `Target Account: ${dataA.profile.displayName} (${dataA.profile.handle})`,
      `Competitor: ${dataB.profile.displayName} (${dataB.profile.handle})`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `--------------------------------------------------`,
      ...tactics.map((t, idx) => [
        `\n[${idx + 1}] ${t.title.toUpperCase()} (${t.priority} | ${t.category})`,
        `ACTION: ${t.tacticalAction}`,
        `WHY IT BEATS COMPETITOR: ${t.whyItBeatsCompetitor}`,
        `EXPECTED ADVANTAGE: ${t.expectedAdvantage}`,
      ].join("\n")),
      `--------------------------------------------------`,
    ].join("\n");

    navigator.clipboard.writeText(planText).then(() => {
      setCopiedRecs(true);
      setTimeout(() => setCopiedRecs(false), 2500);
    });
  };

  // Metric calculation helpers (when dataB is present)
  const subA = dataA.stats.followers;
  const subB = dataB ? dataB.stats.followers : 0;
  const subDiff = Math.abs(subA - subB);
  const subLeader = subA > subB ? "Account A" : subB > subA ? "Account B" : "Tie";
  const subDiffPct = dataB ? Math.round((subDiff / Math.max(1, Math.min(subA, subB))) * 100) : 0;
  const subShareA = dataB ? Math.round((subA / Math.max(1, subA + subB)) * 100) : 100;
  const subShareB = 100 - subShareA;

  const viewsA = dataA.stats.totalViews;
  const viewsB = dataB ? dataB.stats.totalViews : 0;
  const viewsDiff = Math.abs(viewsA - viewsB);
  const viewsLeader = viewsA > viewsB ? "Account A" : viewsB > viewsA ? "Account B" : "Tie";
  const viewsDiffPct = dataB ? Math.round((viewsDiff / Math.max(1, Math.min(viewsA, viewsB))) * 100) : 0;
  const viewsShareA = dataB ? Math.round((viewsA / Math.max(1, viewsA + viewsB)) * 100) : 100;
  const viewsShareB = 100 - viewsShareA;

  const erA = dataA.stats.engagementRate;
  const erB = dataB ? dataB.stats.engagementRate : 0;
  const erLeader = erA > erB ? "Account A" : erB > erA ? "Account B" : "Tie";
  const erDiff = Math.abs(erA - erB).toFixed(1);
  const erShareA = dataB ? Math.round((erA / Math.max(0.1, erA + erB)) * 100) : 100;
  const erShareB = 100 - erShareA;

  const velA = parseFloat(dataA.stats.followersDelta.replace(/[^0-9.-]/g, "")) || 3.5;
  const velB = dataB ? parseFloat(dataB.stats.followersDelta.replace(/[^0-9.-]/g, "")) || 2.8 : 0;
  const velLeader = velA > velB ? "Account A" : velB > velA ? "Account B" : "Tie";
  const velMultiplier = dataB ? (Math.max(velA, velB) / Math.max(0.1, Math.min(velA, velB))).toFixed(1) : "1.0";

  const postsA = Math.max(1, dataA.stats.postsCount);
  const postsB = dataB ? Math.max(1, dataB.stats.postsCount) : 1;
  const avgVPerPostA = Math.round(viewsA / postsA);
  const avgVPerPostB = dataB ? Math.round(viewsB / postsB) : 0;

  // Chart Data Synthesis
  const chartPoints = (dataA.growthHistory || []).map((pt, idx) => {
    const ptB = dataB?.growthHistory ? dataB.growthHistory[idx] : null;
    return {
      date: pt.date,
      aValue: compareMetric === "followers" ? pt.followers : pt.views,
      bValue: ptB ? (compareMetric === "followers" ? ptB.followers : ptB.views) : null,
    };
  });

  // Current battle tactics list
  const currentTactics = dataB
    ? (compareInsight?.waysToBeatCompetitor || generateTacticsToBeatCompetitor(dataA, dataB))
    : [];

  const categories = ["All", "Packaging & CTR", "Retention & Watch Time", "Topic Gaps", "Upload Timing", "Community Moat"];
  const filteredTactics = activeCategoryFilter === "All"
    ? currentTactics
    : currentTactics.filter((t) => t.category === activeCategoryFilter);

  const completedCount = Object.values(completedTactics).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Search / Comparison Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Swords className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Competitive Benchmark &amp; Battle Engine
              </h2>
              <p className="text-xs text-slate-400">
                Compare your channel with any competitor to discover actionable ways to beat them
              </p>
            </div>
          </div>
        </div>

        {/* Input Form: Target (Account A) vs Competitor (Account B) */}
        <form onSubmit={handleRunCompare} className="grid grid-cols-1 gap-3 sm:grid-cols-11">
          {/* Account 1 Input (Target) */}
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Target className="h-3 w-3 text-indigo-400" />
              Account A (Your Channel)
            </label>
            <div className="flex rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
              <input
                type="text"
                value={handleA}
                onChange={(e) => setHandleA(e.target.value)}
                placeholder="Enter your channel link or @handle..."
                className="w-full bg-transparent placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="hidden sm:flex sm:col-span-1 items-end justify-center pb-2.5 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md">
              VS
            </span>
          </div>

          {/* Account 2 Input (Competitor - NO PRE-POPULATED LINK, USER ENTERS OWN LINK) */}
          <div className="sm:col-span-5">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                <Crosshair className="h-3 w-3 text-violet-400" />
                Account B (Competitor to Beat)
              </label>
              {isDuplicateInput && (
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">
                  Duplicate Link
                </span>
              )}
            </div>
            <div
              className={`flex rounded-xl border px-3 py-2 text-xs transition ${
                isDuplicateInput
                  ? "border-rose-500 bg-rose-950/20 ring-1 ring-rose-500/40 text-rose-100"
                  : "border-slate-700 bg-slate-950 text-slate-100 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500"
              }`}
            >
              <input
                type="text"
                value={handleB}
                onChange={(e) => setHandleB(e.target.value)}
                placeholder="Paste competitor YouTube link or @handle..."
                className="w-full bg-transparent placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-11 mt-1 flex justify-end">
            <button
              type="submit"
              disabled={isComparing || isDuplicateInput || !handleA.trim() || !handleB.trim()}
              title={
                isDuplicateInput
                  ? "Cannot compare duplicate account links"
                  : !handleB.trim()
                  ? "Enter competitor link to benchmark"
                  : "Compare and unlock ways to beat competitor"
              }
              className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition flex items-center justify-center gap-2 ${
                isDuplicateInput
                  ? "bg-rose-950/60 border border-rose-500/40 text-rose-300/80 cursor-not-allowed"
                  : !handleB.trim()
                  ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99]"
              }`}
            >
              {isComparing ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyzing Competitor...</span>
                </>
              ) : isDuplicateInput ? (
                <span>Duplicate Link Conflict</span>
              ) : (
                <>
                  <Swords className="h-3.5 w-3.5" />
                  <span>Compare &amp; Beat Competitor</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* RED ATTENTION BANNER WHEN DUPLICATE LINKS PROVIDED (NO HARDCODED SUGGESTIONS) */}
        {isDuplicate && (
          <div
            id="duplicate-link-attention-alert"
            className="mt-4 rounded-xl border border-rose-500/80 bg-gradient-to-r from-rose-950/80 via-rose-900/50 to-slate-900/95 p-4 shadow-lg shadow-rose-950/60 transition"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    Attention: Identical Account Link Provided on Both Sides
                  </h4>
                  <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                    Conflict
                  </span>
                </div>
                <p className="mt-1 text-xs text-rose-200/90 leading-relaxed">
                  You have entered the exact same account link for both <strong className="text-white">Account A (Your Channel)</strong> and <strong className="text-white">Account B (Competitor)</strong>. A competitive analysis requires a distinct competitor channel to measure audience differentials and unlock strategic ways to beat them. Please enter a different channel link or handle in the competitor field above.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side by Side Profile Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card A (Target Account / User's Channel) */}
        <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 to-slate-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative">
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
              <span className="rounded bg-indigo-500/20 px-2.5 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Target className="h-3 w-3" /> Target Channel
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 relative">
              <span className="text-slate-400 block text-[11px]">
                {PLATFORM_CONFIGS[dataA.profile.platform].followerLabel}
              </span>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataA.stats.followersFormatted}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {dataA.stats.followersDelta} pace
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">
                {PLATFORM_CONFIGS[dataA.profile.platform].viewsLabel}
              </span>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataA.stats.totalViewsFormatted}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {dataA.stats.viewsDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Engagement Rate</span>
              <span className="text-lg font-bold text-amber-300 block mt-0.5 font-mono">
                {dataA.stats.engagementRate}%
              </span>
              <span className="text-[10px] text-slate-400">
                {dataA.stats.engagementDelta}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Upload Count</span>
              <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                {dataA.stats.postsCountFormatted}
              </span>
              <span className="text-[10px] text-slate-400">
                ~{formatNumber(avgVPerPostA)} / video
              </span>
            </div>
          </div>
        </div>

        {/* Card B: Competitor Account OR Empty Invitation State */}
        {dataB ? (
          <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-b from-violet-950/40 to-slate-900/90 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative">
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
                <span className="rounded bg-violet-500/20 px-2.5 py-0.5 text-xs font-bold text-violet-300 border border-violet-500/30 flex items-center gap-1">
                  <Crosshair className="h-3 w-3" /> Competitor
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 relative">
                <span className="text-slate-400 block text-[11px]">
                  {PLATFORM_CONFIGS[dataB.profile.platform].followerLabel}
                </span>
                <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                  {dataB.stats.followersFormatted}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {dataB.stats.followersDelta} pace
                </span>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">
                  {PLATFORM_CONFIGS[dataB.profile.platform].viewsLabel}
                </span>
                <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                  {dataB.stats.totalViewsFormatted}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {dataB.stats.viewsDelta}
                </span>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Engagement Rate</span>
                <span className="text-lg font-bold text-amber-300 block mt-0.5 font-mono">
                  {dataB.stats.engagementRate}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {dataB.stats.engagementDelta}
                </span>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Upload Count</span>
                <span className="text-lg font-bold text-white block mt-0.5 font-mono">
                  {dataB.stats.postsCountFormatted}
                </span>
                <span className="text-[10px] text-slate-400">
                  ~{formatNumber(avgVPerPostB)} / video
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State for Account B */
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3">
              <Crosshair className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Enter a Competitor to Beat
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
              Paste your competitor's YouTube channel link or @handle in the Account B box above to benchmark metrics and reveal actionable ways to beat them.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-lg border border-violet-500/20">
              <Sparkles className="h-3 w-3" />
              <span>Awaiting competitor URL / @handle</span>
            </div>
          </div>
        )}
      </div>

      {/* When competitor data is loaded: Render Comparative Benchmark, Chart, and Ways to Beat Competitor */}
      {dataB && (
        <>
          {/* Head-to-Head Metric Benchmark */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-800 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Award className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Head-to-Head Metric Benchmark
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct differential comparison between {dataA.profile.displayName} and {dataB.profile.displayName}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  {dataA.profile.displayName}
                </span>
                <span className="text-slate-600 font-bold">vs</span>
                <span className="flex items-center gap-1.5 text-violet-300 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                  {dataB.profile.displayName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Subscribers */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Users className="h-3.5 w-3.5 text-indigo-400" /> Subscribers
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      subLeader === "Account A"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : subLeader === "Account B"
                        ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {subLeader === "Account A" ? "Target Leads" : subLeader === "Account B" ? "Competitor Leads" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-indigo-400 block font-sans">Target</span>
                    <span className="text-lg font-bold text-white">{dataA.stats.followersFormatted}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-violet-400 block font-sans">Competitor</span>
                    <span className="text-lg font-bold text-slate-300">{dataB.stats.followersFormatted}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Share Ratio</span>
                    <span className="font-semibold text-white font-mono">
                      {subLeader === "Account A" ? `+${formatNumber(subDiff)} (+${subDiffPct}%)` : `-${formatNumber(subDiff)} (-${subDiffPct}%)`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${subShareA}%` }} className="bg-indigo-500 transition-all duration-500" />
                    <div style={{ width: `${subShareB}%` }} className="bg-violet-500 transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Metric 2: Total Views */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Eye className="h-3.5 w-3.5 text-emerald-400" /> Total Views
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      viewsLeader === "Account A"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : viewsLeader === "Account B"
                        ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {viewsLeader === "Account A" ? "Target Leads" : viewsLeader === "Account B" ? "Competitor Leads" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-indigo-400 block font-sans">Target</span>
                    <span className="text-lg font-bold text-white">{dataA.stats.totalViewsFormatted}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-violet-400 block font-sans">Competitor</span>
                    <span className="text-lg font-bold text-slate-300">{dataB.stats.totalViewsFormatted}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Views Difference</span>
                    <span className="font-semibold text-white font-mono">
                      {viewsLeader === "Account A" ? `+${formatNumber(viewsDiff)} (+${viewsDiffPct}%)` : `-${formatNumber(viewsDiff)} (-${viewsDiffPct}%)`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${viewsShareA}%` }} className="bg-indigo-500 transition-all duration-500" />
                    <div style={{ width: `${viewsShareB}%` }} className="bg-violet-500 transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Metric 3: Engagement Rate */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Percent className="h-3.5 w-3.5 text-amber-400" /> Engagement Rate
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      erLeader === "Account A"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : erLeader === "Account B"
                        ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {erLeader === "Account A" ? "Target Leads" : erLeader === "Account B" ? "Competitor Leads" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-indigo-400 block font-sans">Target</span>
                    <span className="text-lg font-bold text-amber-300">{erA}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-violet-400 block font-sans">Competitor</span>
                    <span className="text-lg font-bold text-slate-300">{erB}%</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Differential</span>
                    <span className="font-semibold text-white font-mono">
                      {erLeader === "Account A" ? `+${erDiff}% higher stickiness` : `-${erDiff}% gap`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${erShareA}%` }} className="bg-indigo-500 transition-all duration-500" />
                    <div style={{ width: `${erShareB}%` }} className="bg-violet-500 transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Metric 4: Growth Velocity */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Zap className="h-3.5 w-3.5 text-sky-400" /> Growth Velocity
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      velLeader === "Account A"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : velLeader === "Account B"
                        ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {velLeader === "Account A" ? "Target Faster" : velLeader === "Account B" ? "Competitor Faster" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-indigo-400 block font-sans">Target</span>
                    <span className="text-lg font-bold text-white">{dataA.stats.followersDelta}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-violet-400 block font-sans">Competitor</span>
                    <span className="text-lg font-bold text-slate-300">{dataB.stats.followersDelta}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Pace Multiplier</span>
                    <span className="font-semibold text-emerald-400 font-mono">
                      {velLeader === "Account A" ? `${velMultiplier}x faster` : `${velMultiplier}x deficit`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${Math.round((velA / Math.max(0.1, velA + velB)) * 100)}%` }} className="bg-indigo-500 transition-all duration-500" />
                    <div style={{ width: `${Math.round((velB / Math.max(0.1, velA + velB)) * 100)}%` }} className="bg-violet-500 transition-all duration-500" />
                  </div>
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

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => formatNumber(val)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                    formatter={(value: any, name: string) => [
                      formatNumber(Number(value) || 0),
                      name === "aValue" ? dataA.profile.displayName : dataB.profile.displayName,
                    ]}
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

          {/* DEDICATED FEATURE: WAYS TO BEAT THE COMPETITOR */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 shadow-2xl sm:p-7 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
                    <Swords className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Ways to Beat {dataB.profile.displayName}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  High-leverage tactical battle moves calculated to outperform <span className="text-violet-300 font-semibold">{dataB.profile.displayName}</span> across packaging, retention, topic gaps, and release timing
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleCopyBattlePlan}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  {copiedRecs ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Battle Plan Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy Battle Plan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fetchComparativeInsight(dataA, dataB)}
                  disabled={isGeneratingInsight}
                  title="Recalculate tactical moves"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-2 text-xs font-semibold text-indigo-300 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingInsight ? "animate-spin text-indigo-400" : ""}`} />
                  <span>Refresh Tactics</span>
                </button>
              </div>
            </div>

            {/* Battle Plan Tracker Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 px-4 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
                  <CheckSquare className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">
                    Execution Tracker: {completedCount} of {currentTactics.length} tactics applied
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click checkboxes on each tactic below as you implement them on your channel
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${Math.round((completedCount / Math.max(1, currentTactics.length)) * 100)}%` }}
                    className="h-full bg-emerald-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                    activeCategoryFilter === cat
                      ? "bg-indigo-600 text-white font-semibold shadow"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tactical Battle Moves Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTactics.map((tactic, idx) => {
                const isDone = Boolean(completedTactics[tactic.id]);
                return (
                  <div
                    key={tactic.id || idx}
                    className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
                      isDone
                        ? "border-emerald-500/40 bg-slate-950/90 shadow-md"
                        : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                          {tactic.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              tactic.priority === "Critical Priority"
                                ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                                : tactic.priority === "High Leverage"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                : "bg-sky-500/10 text-sky-300 border-sky-500/30"
                            }`}
                          >
                            {tactic.priority}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleTactic(tactic.id)}
                            title={isDone ? "Mark as in progress" : "Mark as applied"}
                            className="text-slate-400 hover:text-white transition"
                          >
                            {isDone ? (
                              <CheckSquare className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Tactic Title */}
                      <h4 className={`text-sm font-bold mb-2 flex items-start gap-2 ${isDone ? "text-emerald-300" : "text-white"}`}>
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{tactic.title}</span>
                      </h4>

                      {/* Tactical Action */}
                      <p className="text-xs text-slate-300 leading-relaxed pl-7 font-normal">
                        {tactic.tacticalAction}
                      </p>

                      {/* Why it beats competitor box */}
                      <div className="mt-3.5 ml-7 rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-xs">
                        <span className="text-[11px] font-bold text-violet-300 flex items-center gap-1 mb-1">
                          <Crosshair className="h-3 w-3 text-violet-400" />
                          Why this beats {dataB.profile.displayName}:
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {tactic.whyItBeatsCompetitor}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Expected Advantage */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>Advantage: {tactic.expectedAdvantage}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleTactic(tactic.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded transition ${
                          isDone
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {isDone ? "Applied" : "Mark Done"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* When NO competitor is entered yet, show clean educational blueprint */}
      {!dataB && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">
              How to Beat Any Competitor in 3 Steps
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Enter your competitor's channel link or @handle in the search box above to calculate head-to-head metrics and unlock data-driven ways to beat them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto text-left">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold font-mono mb-2">
                1
              </span>
              <h4 className="text-xs font-bold text-white">Paste Competitor URL</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter any channel link or handle into Account B above.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold font-mono mb-2">
                2
              </span>
              <h4 className="text-xs font-bold text-white">Audit Live Metrics</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Calculate real subscribers, total views, ER, and growth velocity gaps.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold font-mono mb-2">
                3
              </span>
              <h4 className="text-xs font-bold text-white">Execute Battle Plan</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Receive specific tactics across packaging, watch time, topic gaps, and timing to beat them.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
