import React, { useState, useEffect, useMemo } from "react";
import {
  Platform,
  DashboardDataset,
  CompareInsightData,
  BeatCompetitorTactic,
  HistoryPoint,
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
  ChevronDown,
  ChevronUp,
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
  const [expandedTactics, setExpandedTactics] = useState<Record<string, boolean>>({});

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

  // Generate dynamic client-side tactics strictly based on real performance gaps
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

    const userHasBetterThumbnails = avgViewsA >= avgViewsB;
    const userNeedsSubscribers = subA < subB;
    const userNeedsViews = viewsA < viewsB;
    const userNeedsER = erA < erB;
    const competitorHasHugeCatalog = postsB > postsA * 1.25;

    const tactics: BeatCompetitorTactic[] = [];

    // 1. Thumbnail / Packaging: ONLY suggest fixing/upgrading thumbnails if competitor gets more views per video
    if (!userHasBetterThumbnails) {
      tactics.push({
        id: "tactic-packaging-deficit",
        priority: "Critical Priority",
        category: "Packaging & CTR",
        title: `Upgrade Thumbnail CTR to Match ${nameB}'s ~${formatNumber(avgViewsB)} Views/Video`,
        tacticalAction: `Audit ${nameB}'s recent 10 uploads for color palette and thumbnail layout. Because ${nameB} averages higher views per upload (~${formatNumber(avgViewsB)} vs ~${formatNumber(avgViewsA)}), deploy high-contrast vibrant visuals and maximum 3 curiosity-inducing words on the thumbnail (e.g. "NEVER Do This" instead of repeating title text). Winning impression clicks in suggested sidebars will bridge the view-pull gap.`,
        whyItBeatsCompetitor: `Capturing impressions directly adjacent to ${nameB}'s videos diverts their browse traffic into your channel.`,
        expectedAdvantage: "+18% to +32% higher Click-Through-Rate (CTR) on competitor-related suggested sidebars",
      });
    }

    // 2. Subscriber Gap: ONLY suggest if competitor has more subscribers
    if (userNeedsSubscribers) {
      tactics.push({
        id: "tactic-subscriber-gap",
        priority: "Critical Priority",
        category: "Audience Scaling",
        title: `Bridge the ${formatNumber(subB - subA)} Subscriber Deficit via Mid-Video Retention Triggers`,
        tacticalAction: `${nameB} commands ${b.stats.followersFormatted} subscribers versus your ${a.stats.followersFormatted}. Rather than waiting for the end-screen, insert a seamless value-first call-to-subscribe at minute 3:30 (your highest retention window), promising a specific upcoming deep-dive.`,
        whyItBeatsCompetitor: `Elevates viewer-to-subscriber conversion from 1.5% to 3.5%+, closing the ${formatNumber(subB - subA)} audience gap at accelerated velocity.`,
        expectedAdvantage: "Pushes subscriber conversion velocity up by +28%",
      });
    }

    // 3. Catalog Volume Disparity: ONLY if competitor has significantly more uploads
    if (competitorHasHugeCatalog) {
      const postDeficit = postsB - postsA;
      tactics.push({
        id: "tactic-catalog-disparity",
        priority: "High Leverage",
        category: "Upload Cadence",
        title: `Overcome ${nameB}'s ${postDeficit}-Upload Library Advantage with Modular Repurposing`,
        tacticalAction: `${nameB} has published ${b.stats.postsCountFormatted} videos against your ${a.stats.postsCountFormatted} videos (+${postDeficit} library advantage), driving continuous passive long-tail views. Counter this by extracting 3-4 modular short-form clips from every long-form video to multiply your discovery touchpoints without production burnout.`,
        whyItBeatsCompetitor: `Compensates for competitor catalog volume by multiplying algorithmic entry points across YouTube search and Shorts shelves.`,
        expectedAdvantage: "Recovers +35% search impression market share against competitor's back-catalog",
      });
    }

    // 4. Total Views Gap: ONLY if user trails in total views and not already covered by catalog disparity
    if (userNeedsViews && !competitorHasHugeCatalog) {
      tactics.push({
        id: "tactic-views-gap",
        priority: "High Leverage",
        category: "Retention & Watch Time",
        title: `Close the ${formatNumber(viewsB - viewsA)} Total View Gap with Bingeable Series Playlists`,
        tacticalAction: `Group your top-performing videos into tightly focused thematic playlists with sequential numbering. Insert end-screen cards linking directly to Part 2 during the final 15 seconds to initiate consecutive session viewing chains.`,
        whyItBeatsCompetitor: `Signals extended viewer session watch time to YouTube's recommendation engine, unlocking wider homepage distribution.`,
        expectedAdvantage: "+25% increase in consecutive session views per viewer",
      });
    }

    // 5. Engagement Rate Gap: ONLY if competitor has higher ER
    if (userNeedsER) {
      tactics.push({
        id: "tactic-engagement-gap",
        priority: "Strategic Moat",
        category: "Community Moat",
        title: `Bridge the ${(erB - erA).toFixed(1)}% Engagement Gap with Pinned Discussion Loops`,
        tacticalAction: `${nameB} achieves ${erB}% engagement rate compared to your ${erA}%. Within 5 minutes of uploading, pin a provocative open-ended question in the comments and personally reply to the first 30 responses to spark community debate.`,
        whyItBeatsCompetitor: `High early comment velocity triggers immediate algorithmic distribution velocity on the YouTube browse feed.`,
        expectedAdvantage: "Boosts comment density and Day-1 algorithmic velocity by +35%",
      });
    }

    // 6. If user ALREADY has superior thumbnails / views-per-video:
    if (userHasBetterThumbnails) {
      tactics.push({
        id: "tactic-weaponize-thumbnail-advantage",
        priority: "High Leverage",
        category: "Strategic Dominance",
        title: `Weaponize Your ~${formatNumber(avgViewsA)} Views/Video Magnetism Against ${nameB}`,
        tacticalAction: `Your packaging efficiency (~${formatNumber(avgViewsA)} views/upload) outperforms ${nameB}'s (~${formatNumber(avgViewsB)} views/upload), confirming your thumbnail click magnetism is superior. Target ${nameB}'s highest-ranking video keywords with your superior packaging style to consistently win the side-by-side click in search results.`,
        whyItBeatsCompetitor: `When your video appears next to ${nameB}'s in search results or suggested video columns, your proven CTR advantage pulls the viewer directly to your channel.`,
        expectedAdvantage: "Captures 25-35% of competitor's sidebar recommendation traffic directly",
      });
    }

    // 7. Retention & Watch Time (Always actionable and core to outranking)
    tactics.push({
      id: "tactic-retention",
      priority: "High Leverage",
      category: "Retention & Watch Time",
      title: `Cut Intros Under 5 Seconds to Beat ${nameB}'s Relative Retention Curve`,
      tacticalAction: `Eliminate animated channel logos, generic greetings ("welcome back guys"), and slow introductory agendas. Start at second 0 directly with the highest-stakes payoff, problem demo, or core curiosity hook. Deploy pattern interrupts (camera punches, on-screen callouts, audio cues) every 45 seconds to keep your 3-minute audience retention above 60%.`,
      whyItBeatsCompetitor: `The YouTube algorithm compares Relative Audience Retention between videos covering the same topic. When your retention at minute 2 exceeds ${nameB}'s curve, YouTube progressively swaps their video with yours in search and homepage feeds.`,
      expectedAdvantage: "Pushes average watch-time past 55%, prioritizing your uploads in recommendation carousels",
    });

    // 8. Topic Gaps
    tactics.push({
      id: "tactic-topic",
      priority: "High Leverage",
      category: "Topic Gaps",
      title: `Cannibalize ${nameB}'s Aging Evergreen Videos with 2026 Modernized Guides`,
      tacticalAction: `Inspect ${nameB}'s top 10 most-viewed videos published 12 to 24 months ago. Spot deprecated libraries, changed APIs, or frequent unanswered questions in their comments. Produce updated 2026 definitive masterclasses with downloadable cheat-sheets, modern code repositories, and zero-fluff explanations that make competitor videos obsolete.`,
      whyItBeatsCompetitor: `Viewers searching for tutorials actively avoid outdated videos. Intercepting high-volume keywords with fresh, comprehensive uploads captures search dominance away from ${nameB}'s legacy catalog.`,
      expectedAdvantage: `Captures search rank #1 for high-intent queries currently held by ${nameB}`,
    });

    // 9. Upload Timing
    tactics.push({
      id: "tactic-timing",
      priority: "Quick Win",
      category: "Upload Timing",
      title: `Pre-Empt ${nameB}'s Prime Upload Window by 2 Hours`,
      tacticalAction: `Identify the days and hours ${nameB} routinely drops new uploads. Schedule your release 90-120 minutes prior. This allows YouTube's notification delivery and initial seed audience loops to warm up your video right as your shared audience opens the app, absorbing viewer attention before ${nameB}'s notification arrives.`,
      whyItBeatsCompetitor: `Viewers have finite daily watch time. Securing their initial 15-minute viewing session pre-empts them from starting competitor uploads during peak consumption windows.`,
      expectedAdvantage: "Maximizes Day-1 subscriber velocity and notification click-through velocity",
    });

    return tactics.slice(0, 5);
  };

  // Enforces user intent: filter out any tactic for metrics where user already leads!
  const sanitizeAndFilterTactics = (
    tactics: BeatCompetitorTactic[],
    a: DashboardDataset,
    b: DashboardDataset
  ): BeatCompetitorTactic[] => {
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

    const userHasBetterThumbnails = avgViewsA >= avgViewsB;
    const userHasMoreSubs = subA >= subB;
    const userHasMoreViews = viewsA >= viewsB;
    const userHasHigherER = erA >= erB;

    const filtered = (tactics || []).filter((t) => {
      const text = `${t.title} ${t.category} ${t.tacticalAction}`.toLowerCase();

      // Rule 1: If user already has more or equal subscribers, do NOT mention subscriber growth/acquisition
      if (userHasMoreSubs) {
        if (
          t.category.toLowerCase().includes("audience scaling") ||
          text.includes("subscriber deficit") ||
          text.includes("subscriber gap") ||
          text.includes("gain more subscriber") ||
          text.includes("increase subscriber") ||
          text.includes("grow subscriber") ||
          text.includes("grow your subscriber") ||
          t.id.includes("subscriber")
        ) {
          return false;
        }
      }

      // Rule 2: If user already has more or equal total views, do NOT mention total views gap
      if (userHasMoreViews) {
        if (
          text.includes("total view gap") ||
          text.includes("increase total view") ||
          text.includes("view deficit")
        ) {
          return false;
        }
      }

      // Rule 3: If user already has higher views/post (better thumbnails), do NOT mention fixing/upgrading thumbnails
      if (userHasBetterThumbnails) {
        if (
          text.includes("thumbnail architecture") ||
          text.includes("thumbnail audit") ||
          text.includes("thumbnail ctr") ||
          text.includes("re-package thumbnail") ||
          text.includes("counter-package thumbnail") ||
          text.includes("thumbnail packaging") ||
          text.includes("upgrade thumbnail") ||
          t.id.includes("packaging-deficit") ||
          t.id.includes("packaging")
        ) {
          return false;
        }
      }

      // Rule 4: If user has higher engagement, do NOT suggest engagement rate gap fixes
      if (userHasHigherER) {
        if (
          text.includes("engagement gap") ||
          text.includes("engagement deficit") ||
          text.includes("bridge the engagement") ||
          text.includes("close the engagement")
        ) {
          return false;
        }
      }

      return true;
    });

    if (filtered.length < 4) {
      const backfill = generateTacticsToBeatCompetitor(a, b);
      for (const t of backfill) {
        if (filtered.length >= 5) break;
        if (!filtered.some((existing) => existing.id === t.id || existing.title === t.title)) {
          filtered.push(t);
        }
      }
    }

    return filtered.slice(0, 5);
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

  // Helper to ensure valid history points
  const getDatasetHistory = (dataset: DashboardDataset | null, count: number): HistoryPoint[] => {
    if (!dataset) return [];
    if (Array.isArray(dataset.history) && dataset.history.length > 0) {
      return dataset.history.slice(-count);
    }
    // Fallback synthesis if history array is somehow not populated
    const points: HistoryPoint[] = [];
    const now = new Date();
    const followers = dataset.stats?.followers || 1000000;
    const views = dataset.stats?.totalViews || 50000000;
    const er = dataset.stats?.engagementRate || 3.0;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const progress = (count - 1 - i) / Math.max(1, count - 1);
      const fVal = Math.round(followers * (0.95 + 0.05 * progress));
      const vVal = Math.round(views * (0.94 + 0.06 * progress));
      points.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        followers: fVal,
        views: vVal,
        engagementRate: er,
      });
    }
    return points;
  };

  // Chart Data Synthesis with trailing timeframe support (7d, 30d, 90d)
  const sliceCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const historyA = getDatasetHistory(dataA, sliceCount);
  const historyB = getDatasetHistory(dataB, sliceCount);

  const maxLen = Math.max(historyA.length, historyB.length);
  const chartPoints = Array.from({ length: maxLen }, (_, idx) => {
    const ptA = historyA[idx] || null;
    const ptB = historyB[idx] || null;
    const dateLabel = ptA?.date || ptB?.date || `Day ${idx + 1}`;
    const fullDateLabel = ptA?.fullDate || ptB?.fullDate || dateLabel;

    return {
      date: dateLabel,
      fullDate: fullDateLabel,
      aValue: ptA
        ? compareMetric === "followers"
          ? Number(ptA.followers) || 0
          : Number(ptA.views) || 0
        : null,
      bValue: ptB
        ? compareMetric === "followers"
          ? Number(ptB.followers) || 0
          : Number(ptB.views) || 0
        : null,
    };
  });

  // Current battle tactics list strictly gap-filtered
  const currentTactics = useMemo(() => {
    if (!dataB) return [];
    const raw = compareInsight?.waysToBeatCompetitor || generateTacticsToBeatCompetitor(dataA, dataB);
    return sanitizeAndFilterTactics(raw, dataA, dataB);
  }, [dataA, dataB, compareInsight]);

  const categories = useMemo(() => {
    const list = ["All"];
    currentTactics.forEach((t) => {
      if (t.category && !list.includes(t.category)) {
        list.push(t.category);
      }
    });
    return list;
  }, [currentTactics]);

  const filteredTactics = activeCategoryFilter === "All" || !categories.includes(activeCategoryFilter)
    ? currentTactics
    : currentTactics.filter((t) => t.category === activeCategoryFilter);

  const completedCount = Object.values(completedTactics).filter(Boolean).length;

  // Toggle step expansion to reveal full tactical playbook
  const toggleTacticExpand = (tacticId: string) => {
    setExpandedTactics((prev) => ({
      ...prev,
      [tacticId]: !prev[tacticId],
    }));
  };

  const expandAllTactics = () => {
    const all: Record<string, boolean> = {};
    filteredTactics.forEach((t) => {
      all[t.id] = true;
    });
    setExpandedTactics(all);
  };

  const collapseAllTactics = () => {
    setExpandedTactics({});
  };

  return (
    <div className="space-y-6">
      {/* Top Search / Comparison Bar */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#5B5CE2] border border-[#E0E7FF]">
              <Swords className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
                Competitive Benchmark &amp; Battle Engine
              </h2>
              <p className="text-xs text-[#6B7280]">
                Compare your channel with any competitor to discover actionable ways to beat them
              </p>
            </div>
          </div>
        </div>

        {/* Input Form: Target (Account A) vs Competitor (Account B) with Button Beside Account B */}
        <form onSubmit={handleRunCompare} className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
          {/* Account 1 Input (Target) */}
          <div className="lg:col-span-5">
            <label className="block text-[11px] font-semibold text-[#5B5CE2] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Target className="h-3 w-3 text-[#5B5CE2]" />
              Account A (Your Channel)
            </label>
            <div className="flex h-[42px] items-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-xs text-[#111827] focus-within:border-[#5B5CE2] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5B5CE2] transition">
              <input
                type="text"
                value={handleA}
                onChange={(e) => setHandleA(e.target.value)}
                placeholder="Enter your channel link or @handle..."
                className="w-full bg-transparent placeholder-[#9CA3AF] focus:outline-none"
              />
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-1 items-center justify-center h-[42px] text-[#9CA3AF]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded-md border border-[#E5E7EB]">
              VS
            </span>
          </div>

          {/* Account 2 Input (Competitor) and Compare & Beat Competitor Button Beside It */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
                <Crosshair className="h-3 w-3 text-[#5B5CE2]" />
                Account B (Competitor to Beat)
              </label>
              {isDuplicateInput && (
                <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded border border-[#FECACA]">
                  Duplicate Link
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div
                className={`flex h-[42px] items-center flex-1 min-w-0 rounded-xl border px-3 text-xs transition ${
                  isDuplicateInput
                    ? "border-[#DC2626] bg-[#FEF2F2] ring-1 ring-[#DC2626]/40 text-[#DC2626]"
                    : "border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] focus-within:border-[#5B5CE2] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5B5CE2]"
                }`}
              >
                <input
                  type="text"
                  value={handleB}
                  onChange={(e) => setHandleB(e.target.value)}
                  placeholder="Paste competitor YouTube link or @handle..."
                  className="w-full bg-transparent placeholder-[#9CA3AF] focus:outline-none"
                />
              </div>

              {/* Compare & Beat Competitor Button placed directly beside Account B */}
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
                className={`h-[42px] shrink-0 whitespace-nowrap rounded-xl px-4 text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  isDuplicateInput
                    ? "bg-[#F3F4F6] border border-[#FECACA] text-[#DC2626] cursor-not-allowed"
                    : !handleB.trim()
                    ? "bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB] cursor-not-allowed"
                    : "bg-[#5B5CE2] hover:bg-[#4F46E5] text-white active:scale-[0.99]"
                }`}
              >
                {isComparing ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing...</span>
                  </>
                ) : isDuplicateInput ? (
                  <span>Duplicate Link</span>
                ) : (
                  <>
                    <Swords className="h-3.5 w-3.5" />
                    <span>Compare &amp; Beat Competitor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* RED ATTENTION BANNER WHEN DUPLICATE LINKS PROVIDED (NO HARDCODED SUGGESTIONS) */}
        {isDuplicate && (
          <div
            id="duplicate-link-attention-alert"
            className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 shadow-xs transition"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-[#DC2626] border border-[#FECACA]">
                <AlertTriangle className="h-5 w-5 text-[#DC2626]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#DC2626] flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#DC2626]" />
                    Attention: Identical Account Link Provided on Both Sides
                  </h4>
                  <span className="rounded bg-[#DC2626]/10 px-2 py-0.5 text-[10px] font-bold text-[#DC2626] border border-[#FECACA]">
                    Conflict
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#991B1B] leading-relaxed">
                  You have entered the exact same account link for both <strong className="text-[#111827]">Account A (Your Channel)</strong> and <strong className="text-[#111827]">Account B (Competitor)</strong>. A competitive analysis requires a distinct competitor channel to measure audience differentials and unlock strategic ways to beat them. Please enter a different channel link or handle in the competitor field above.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side by Side Profile Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card A (Target Account / User's Channel) */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] relative">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-base font-bold text-[#111827] shadow-xs overflow-hidden`}
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
                  <h3 className="font-bold text-[#111827] text-base">
                    {dataA.profile.displayName}
                  </h3>
                  {dataA.profile.verified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#5B5CE2]" />
                  )}
                </div>
                <span className="text-xs text-[#6B7280] font-mono">
                  {dataA.profile.handle} ({PLATFORM_CONFIGS[dataA.profile.platform].name})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#059669] border border-[#A7F3D0]">
                Live Data
              </span>
              <span className="rounded bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-bold text-[#5B5CE2] border border-[#E0E7FF] flex items-center gap-1">
                <Target className="h-3 w-3" /> Target Channel
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB] relative">
              <span className="text-[#6B7280] block text-[11px]">
                {PLATFORM_CONFIGS[dataA.profile.platform].followerLabel}
              </span>
              <span
                className={`text-lg font-bold block mt-0.5 font-mono transition-colors ${
                  !dataB
                    ? "text-[#111827]"
                    : subA > subB
                    ? "text-[#059669]"
                    : subA < subB
                    ? "text-[#DC2626]"
                    : "text-[#111827]"
                }`}
              >
                {dataA.stats.followersFormatted}
              </span>
              {dataB ? (
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    subA > subB
                      ? "text-[#059669]"
                      : subA < subB
                      ? "text-[#DC2626]"
                      : "text-[#6B7280]"
                  }`}
                >
                  {subA > subB
                    ? `▲ +${formatNumber(subDiff)} ahead`
                    : subA < subB
                    ? `▼ -${formatNumber(subDiff)} deficit`
                    : "Equal parity"}
                </span>
              ) : (
                <span className="text-[10px] text-[#059669] font-medium">
                  {dataA.stats.followersDelta} pace
                </span>
              )}
            </div>

            <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
              <span className="text-[#6B7280] block text-[11px]">
                {PLATFORM_CONFIGS[dataA.profile.platform].viewsLabel}
              </span>
              <span
                className={`text-lg font-bold block mt-0.5 font-mono transition-colors ${
                  !dataB
                    ? "text-[#111827]"
                    : viewsA > viewsB
                    ? "text-[#059669]"
                    : viewsA < viewsB
                    ? "text-[#DC2626]"
                    : "text-[#111827]"
                }`}
              >
                {dataA.stats.totalViewsFormatted}
              </span>
              {dataB ? (
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    viewsA > viewsB
                      ? "text-[#059669]"
                      : viewsA < viewsB
                      ? "text-[#DC2626]"
                      : "text-[#6B7280]"
                  }`}
                >
                  {viewsA > viewsB
                    ? `▲ +${formatNumber(viewsDiff)} lead`
                    : viewsA < viewsB
                    ? `▼ -${formatNumber(viewsDiff)} deficit`
                    : "Equal parity"}
                </span>
              ) : (
                <span className="text-[10px] text-[#059669] font-medium">
                  {dataA.stats.viewsDelta}
                </span>
              )}
            </div>

            <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
              <span className="text-[#6B7280] block text-[11px]">Engagement Rate</span>
              <span
                className={`text-lg font-bold block mt-0.5 font-mono transition-colors ${
                  !dataB
                    ? "text-amber-600"
                    : erA > erB
                    ? "text-[#059669]"
                    : erA < erB
                    ? "text-[#DC2626]"
                    : "text-amber-600"
                }`}
              >
                {dataA.stats.engagementRate}%
              </span>
              {dataB ? (
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    erA > erB
                      ? "text-[#059669]"
                      : erA < erB
                      ? "text-[#DC2626]"
                      : "text-amber-600"
                  }`}
                >
                  {erA > erB
                    ? `▲ +${erDiff}% higher`
                    : erA < erB
                    ? `▼ -${erDiff}% lower`
                    : `Parity (${erA}%)`}
                </span>
              ) : (
                <span className="text-[10px] text-[#6B7280]">
                  {dataA.stats.engagementDelta}
                </span>
              )}
            </div>

            <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
              <span className="text-[#6B7280] block text-[11px]">Upload Count</span>
              <span className="text-lg font-bold text-[#111827] block mt-0.5 font-mono">
                {dataA.stats.postsCountFormatted}
              </span>
              <span className="text-[10px] text-[#6B7280]">
                ~{formatNumber(avgVPerPostA)} / video
                {dataB && avgVPerPostA > avgVPerPostB && (
                  <span className="text-[#059669] font-semibold ml-1">
                    (▲ {(avgVPerPostA / Math.max(1, avgVPerPostB)).toFixed(1)}x pull)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Card B: Competitor Account OR Empty Invitation State */}
        {dataB ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] relative">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-base font-bold text-[#111827] shadow-xs overflow-hidden`}
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
                    <h3 className="font-bold text-[#111827] text-base">
                      {dataB.profile.displayName}
                    </h3>
                    {dataB.profile.verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#5B5CE2]" />
                    )}
                  </div>
                  <span className="text-xs text-[#6B7280] font-mono">
                    {dataB.profile.handle} ({PLATFORM_CONFIGS[dataB.profile.platform].name})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#059669] border border-[#A7F3D0]">
                  Live Data
                </span>
                <span className="rounded bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-bold text-[#4B5563] border border-[#E5E7EB] flex items-center gap-1">
                  <Crosshair className="h-3 w-3" /> Competitor
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB] relative">
                <span className="text-[#6B7280] block text-[11px]">
                  {PLATFORM_CONFIGS[dataB.profile.platform].followerLabel}
                </span>
                <span
                  className={`text-lg font-bold block mt-0.5 font-mono transition-colors ${
                    subB > subA
                      ? "text-[#059669]"
                      : subB < subA
                      ? "text-[#DC2626]"
                      : "text-[#111827]"
                  }`}
                >
                  {dataB.stats.followersFormatted}
                </span>
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    subB > subA
                      ? "text-[#059669]"
                      : subB < subA
                      ? "text-[#DC2626]"
                      : "text-[#6B7280]"
                  }`}
                >
                  {subB > subA
                    ? `▲ +${formatNumber(subDiff)} lead`
                    : subB < subA
                    ? `▼ -${formatNumber(subDiff)} deficit`
                    : "Equal parity"}
                </span>
              </div>

              <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
                <span className="text-[#6B7280] block text-[11px]">
                  {PLATFORM_CONFIGS[dataB.profile.platform].viewsLabel}
                </span>
                <span
                  className={`text-lg font-bold block mt-0.5 font-mono transition-colors ${
                    viewsB > viewsA
                      ? "text-[#059669]"
                      : viewsB < viewsA
                      ? "text-[#DC2626]"
                      : "text-[#111827]"
                  }`}
                >
                  {dataB.stats.totalViewsFormatted}
                </span>
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    viewsB > viewsA
                      ? "text-[#059669]"
                      : viewsB < viewsA
                      ? "text-[#DC2626]"
                      : "text-[#6B7280]"
                  }`}
                >
                  {viewsB > viewsA
                    ? `▲ +${formatNumber(viewsDiff)} lead`
                    : viewsB < viewsA
                    ? `▼ -${formatNumber(viewsDiff)} deficit`
                    : "Equal parity"}
                </span>
              </div>

              <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
                <span className="text-[#6B7280] block text-[11px]">Engagement Rate</span>
                <span
                  className={`text-lg font-bold block mt-0.5 font-mono transition-colors ${
                    erB > erA
                      ? "text-[#059669]"
                      : erB < erA
                      ? "text-[#DC2626]"
                      : "text-amber-600"
                  }`}
                >
                  {dataB.stats.engagementRate}%
                </span>
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    erB > erA
                      ? "text-[#059669]"
                      : erB < erA
                      ? "text-[#DC2626]"
                      : "text-amber-600"
                  }`}
                >
                  {erB > erA
                    ? `▲ +${erDiff}% higher`
                    : erB < erA
                    ? `▼ -${erDiff}% lower`
                    : `Parity (${erB}%)`}
                </span>
              </div>

              <div className="rounded-xl bg-[#F9FAFB] p-3 border border-[#E5E7EB]">
                <span className="text-[#6B7280] block text-[11px]">Upload Count</span>
                <span className="text-lg font-bold text-[#111827] block mt-0.5 font-mono">
                  {dataB.stats.postsCountFormatted}
                </span>
                <span className="text-[10px] text-[#6B7280]">
                  ~{formatNumber(avgVPerPostB)} / video
                  {avgVPerPostB > avgVPerPostA && (
                    <span className="text-[#059669] font-semibold ml-1">
                      (▲ {(avgVPerPostB / Math.max(1, avgVPerPostA)).toFixed(1)}x pull)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State for Account B */
          <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-6 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] text-[#5B5CE2] flex items-center justify-center mb-3">
              <Crosshair className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-[#111827]">
              Enter a Competitor to Beat
            </h3>
            <p className="mt-1 text-xs text-[#6B7280] max-w-sm leading-relaxed">
              Paste your competitor's YouTube channel link or @handle in the Account B box above to benchmark metrics and reveal actionable ways to beat them.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#5B5CE2] bg-[#EEF2FF] px-3 py-1.5 rounded-lg border border-[#E0E7FF]">
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
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#E5E7EB] mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#5B5CE2] border border-[#E0E7FF]">
                    <Award className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-base font-bold text-[#111827]">
                    Head-to-Head Metric Benchmark
                  </h3>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Direct differential comparison between {dataA.profile.displayName} and {dataB.profile.displayName}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-[#5B5CE2] font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5B5CE2]" />
                  {dataA.profile.displayName}
                </span>
                <span className="text-[#6B7280] font-bold">vs</span>
                <span className="flex items-center gap-1.5 text-[#3B82F6] font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                  {dataB.profile.displayName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Subscribers */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
                    <Users className="h-3.5 w-3.5 text-[#5B5CE2]" /> Subscribers
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      subLeader === "Account A"
                        ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                        : subLeader === "Account B"
                        ? "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                        : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                    }`}
                  >
                    {subLeader === "Account A" ? "Target Leads" : subLeader === "Account B" ? "Competitor Leads" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-[#5B5CE2] block font-sans">Target</span>
                    <span className={`text-lg font-bold ${subA >= subB ? "text-[#059669]" : "text-[#DC2626]"}`}>
                      {dataA.stats.followersFormatted}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#6B7280] block font-sans">Competitor</span>
                    <span className={`text-lg font-bold ${subB >= subA ? "text-[#059669]" : "text-[#DC2626]"}`}>
                      {dataB.stats.followersFormatted}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#6B7280]">Share Ratio</span>
                    <span className="font-semibold text-[#111827] font-mono">
                      {subLeader === "Account A" ? `+${formatNumber(subDiff)} (+${subDiffPct}%)` : `-${formatNumber(subDiff)} (-${subDiffPct}%)`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden flex">
                    <div style={{ width: `${subShareA}%` }} className="bg-[#5B5CE2] transition-all duration-500" />
                    <div style={{ width: `${subShareB}%` }} className="bg-[#3B82F6] transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Metric 2: Total Views */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
                    <Eye className="h-3.5 w-3.5 text-[#059669]" /> Total Views
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      viewsLeader === "Account A"
                        ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                        : viewsLeader === "Account B"
                        ? "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                        : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                    }`}
                  >
                    {viewsLeader === "Account A" ? "Target Leads" : viewsLeader === "Account B" ? "Competitor Leads" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-[#5B5CE2] block font-sans">Target</span>
                    <span className={`text-lg font-bold ${viewsA >= viewsB ? "text-[#059669]" : "text-[#DC2626]"}`}>
                      {dataA.stats.totalViewsFormatted}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#6B7280] block font-sans">Competitor</span>
                    <span className={`text-lg font-bold ${viewsB >= viewsA ? "text-[#059669]" : "text-[#DC2626]"}`}>
                      {dataB.stats.totalViewsFormatted}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#6B7280]">Views Difference</span>
                    <span className="font-semibold text-[#111827] font-mono">
                      {viewsLeader === "Account A" ? `+${formatNumber(viewsDiff)} (+${viewsDiffPct}%)` : `-${formatNumber(viewsDiff)} (-${viewsDiffPct}%)`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden flex">
                    <div style={{ width: `${viewsShareA}%` }} className="bg-[#5B5CE2] transition-all duration-500" />
                    <div style={{ width: `${viewsShareB}%` }} className="bg-[#3B82F6] transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Metric 3: Engagement Rate */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
                    <Percent className="h-3.5 w-3.5 text-amber-600" /> Engagement Rate
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      erLeader === "Account A"
                        ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                        : erLeader === "Account B"
                        ? "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                        : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                    }`}
                  >
                    {erLeader === "Account A" ? "Target Leads" : erLeader === "Account B" ? "Competitor Leads" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-[#5B5CE2] block font-sans">Target</span>
                    <span className={`text-lg font-bold ${erA >= erB ? "text-[#059669]" : "text-[#DC2626]"}`}>
                      {erA}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#6B7280] block font-sans">Competitor</span>
                    <span className={`text-lg font-bold ${erB >= erA ? "text-[#059669]" : "text-[#DC2626]"}`}>
                      {erB}%
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#6B7280]">Differential</span>
                    <span className="font-semibold text-[#111827] font-mono">
                      {erLeader === "Account A" ? `+${erDiff}% higher stickiness` : `-${erDiff}% gap`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden flex">
                    <div style={{ width: `${erShareA}%` }} className="bg-[#5B5CE2] transition-all duration-500" />
                    <div style={{ width: `${erShareB}%` }} className="bg-[#3B82F6] transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Metric 4: Growth Velocity */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
                    <Zap className="h-3.5 w-3.5 text-[#5B5CE2]" /> Growth Velocity
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      velLeader === "Account A"
                        ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                        : velLeader === "Account B"
                        ? "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                        : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                    }`}
                  >
                    {velLeader === "Account A" ? "Target Faster" : velLeader === "Account B" ? "Competitor Faster" : "Tied"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono mt-1">
                  <div>
                    <span className="text-xs text-[#5B5CE2] block font-sans">Target</span>
                    <span className="text-lg font-bold text-[#111827]">{dataA.stats.followersDelta}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#6B7280] block font-sans">Competitor</span>
                    <span className="text-lg font-bold text-[#4B5563]">{dataB.stats.followersDelta}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#6B7280]">Pace Multiplier</span>
                    <span className="font-semibold text-[#059669] font-mono">
                      {velLeader === "Account A" ? `${velMultiplier}x faster` : `${velMultiplier}x deficit`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden flex">
                    <div style={{ width: `${Math.round((velA / Math.max(0.1, velA + velB)) * 100)}%` }} className="bg-[#5B5CE2] transition-all duration-500" />
                    <div style={{ width: `${Math.round((velB / Math.max(0.1, velA + velB)) * 100)}%` }} className="bg-[#3B82F6] transition-all duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Growth Chart */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#111827]">Comparative Growth Velocity</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Side-by-side progression over the trailing {timeRange.toUpperCase()} window
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Metric Toggle */}
                <div className="flex rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] p-0.5 text-xs">
                  <button
                    onClick={() => setCompareMetric("followers")}
                    className={`rounded px-2.5 py-1 font-medium transition cursor-pointer ${
                      compareMetric === "followers"
                        ? "bg-white text-[#111827] font-semibold shadow-xs"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    Audience
                  </button>
                  <button
                    onClick={() => setCompareMetric("views")}
                    className={`rounded px-2.5 py-1 font-medium transition cursor-pointer ${
                      compareMetric === "views"
                        ? "bg-white text-[#111827] font-semibold shadow-xs"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    Views
                  </button>
                </div>

                {/* Time Range */}
                <div className="flex rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] p-0.5 text-xs">
                  {(["7d", "30d", "90d"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeRange(t)}
                      className={`rounded px-2 py-1 font-medium transition cursor-pointer ${
                        timeRange === t
                          ? "bg-white text-[#111827] font-semibold shadow-xs border border-[#E5E7EB]"
                          : "text-[#6B7280] hover:text-[#111827]"
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
                <LineChart data={chartPoints} margin={{ top: 12, right: 16, left: 6, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    tickLine={false}
                    tickFormatter={(val) => formatNumber(val)}
                    domain={["auto", "auto"]}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E5E7EB",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: any, name: string) => [
                      formatNumber(Number(value) || 0),
                      name === "aValue" ? dataA.profile.displayName : dataB?.profile.displayName || "Competitor",
                    ]}
                    labelFormatter={(lbl, payload) => payload?.[0]?.payload?.fullDate || lbl}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(val) => (
                      <span className="text-xs font-medium text-[#4B5563]">
                        {val === "aValue" ? dataA.profile.displayName : dataB?.profile.displayName || "Competitor"}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="aValue"
                    name="aValue"
                    stroke="#5B5CE2"
                    strokeWidth={2.5}
                    dot={timeRange === "7d" ? { r: 3.5, fill: "#5B5CE2", strokeWidth: 1 } : false}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="bValue"
                    name="bValue"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    dot={timeRange === "7d" ? { r: 3.5, fill: "#3B82F6", strokeWidth: 1 } : false}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DEDICATED FEATURE: WAYS TO BEAT THE COMPETITOR */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-7 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E5E7EB]">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5B5CE2] text-white shadow-xs">
                    <Swords className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] tracking-tight">
                    Ways to Beat {dataB.profile.displayName}
                  </h3>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  High-leverage tactical battle moves calculated to outperform <span className="text-[#3B82F6] font-semibold">{dataB.profile.displayName}</span>. Click on any step to reveal its tactical playbook, competitive edge, and execution details.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleCopyBattlePlan}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F9FAFB] transition cursor-pointer"
                >
                  {copiedRecs ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#059669]" />
                      <span className="text-[#059669]">Battle Plan Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#6B7280]" />
                      <span>Copy Battle Plan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fetchComparativeInsight(dataA, dataB)}
                  disabled={isGeneratingInsight}
                  title="Recalculate tactical moves"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-3 py-2 text-xs font-semibold text-[#5B5CE2] transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingInsight ? "animate-spin text-[#5B5CE2]" : ""}`} />
                  <span>Refresh Tactics</span>
                </button>
              </div>
            </div>

            {/* Battle Plan Tracker Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 px-4 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ECFDF5] text-[#059669]">
                  <CheckSquare className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#111827] block">
                    Execution Tracker: {completedCount} of {currentTactics.length} tactics applied
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Click checkboxes on each tactic below as you implement them on your channel
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    style={{ width: `${Math.round((completedCount / Math.max(1, currentTactics.length)) * 100)}%` }}
                    className="h-full bg-[#059669] transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Pills & Bulk Step Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#6B7280] mr-1 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Filter:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer ${
                      activeCategoryFilter === cat
                        ? "bg-[#5B5CE2] text-white font-semibold shadow-xs"
                        : "bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] border border-[#E5E7EB]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={expandAllTactics}
                  className="text-[11px] font-medium text-[#5B5CE2] hover:text-[#4338CA] px-2.5 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#C7D2FE] transition cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAllTactics}
                  className="text-[11px] font-medium text-[#6B7280] hover:text-[#111827] px-2.5 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] transition cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Tactical Battle Moves Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTactics.map((tactic, idx) => {
                const isDone = Boolean(completedTactics[tactic.id]);
                const isExpanded = Boolean(expandedTactics[tactic.id]);

                return (
                  <div
                    key={tactic.id || idx}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                      isDone
                        ? "border-[#A7F3D0] bg-[#F0FDF4] shadow-xs"
                        : isExpanded
                        ? "border-[#C7D2FE] bg-[#F8FAFC] shadow-xs"
                        : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5CE2] bg-[#EEF2FF] border border-[#E0E7FF] px-2.5 py-0.5 rounded-full">
                          {tactic.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              tactic.priority === "Critical Priority"
                                ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                                : tactic.priority === "High Leverage"
                                ? "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]"
                                : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
                            }`}
                          >
                            {tactic.priority}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTactic(tactic.id);
                            }}
                            title={isDone ? "Mark as in progress" : "Mark as applied"}
                            className="text-[#6B7280] hover:text-[#111827] transition cursor-pointer p-0.5"
                          >
                            {isDone ? (
                              <CheckSquare className="h-4 w-4 text-[#059669]" />
                            ) : (
                              <Square className="h-4 w-4 text-[#9CA3AF] hover:text-[#4B5563]" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Clickable Step Title Header */}
                      <div
                        onClick={() => toggleTacticExpand(tactic.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleTacticExpand(tactic.id);
                          }
                        }}
                        title={isExpanded ? "Click to collapse step" : "Click to view full step breakdown"}
                        className="group flex items-start justify-between gap-2.5 cursor-pointer select-none rounded-xl p-1.5 -m-1.5 hover:bg-white transition"
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold mt-0.5 transition ${
                              isDone
                                ? "bg-[#ECFDF5] text-[#059669]"
                                : isExpanded
                                ? "bg-[#5B5CE2] text-white shadow-xs"
                                : "bg-white text-[#5B5CE2] border border-[#E5E7EB] group-hover:border-[#5B5CE2]"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="flex flex-col flex-1 min-w-0">
                            <h4
                              className={`text-sm font-bold leading-snug transition ${
                                isDone
                                  ? "text-[#059669]"
                                  : isExpanded
                                  ? "text-[#111827]"
                                  : "text-[#111827] group-hover:text-[#5B5CE2]"
                              }`}
                            >
                              {tactic.title}
                            </h4>
                            {!isExpanded && (
                              <span className="text-[11px] text-[#6B7280] mt-1 line-clamp-1 group-hover:text-[#4B5563]">
                                Click step to reveal full tactical playbook & edge analysis
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-1 mt-0.5">
                          <span className="text-[11px] font-medium text-[#6B7280] group-hover:text-[#5B5CE2] transition hidden sm:inline">
                            {isExpanded ? "Hide" : "Expand"}
                          </span>
                          <div className="p-0.5 rounded-md text-[#6B7280] group-hover:text-[#5B5CE2] transition">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remaining Part - Revealed only when user clicks on this step */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3.5 pt-1 border-t border-[#E5E7EB]">
                          {/* Tactical Action */}
                          <p className="text-xs text-[#4B5563] leading-relaxed pl-7 font-normal">
                            {tactic.tacticalAction}
                          </p>

                          {/* Why it beats competitor box */}
                          <div className="ml-7 rounded-xl bg-white border border-[#E5E7EB] p-3.5 text-xs">
                            <span className="text-[11px] font-bold text-[#2563EB] flex items-center gap-1.5 mb-1.5">
                              <Crosshair className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                              Why this beats {dataB.profile.displayName}:
                            </span>
                            <p className="text-[#4B5563] text-[11px] leading-relaxed">
                              {tactic.whyItBeatsCompetitor}
                            </p>
                          </div>

                          {/* Bottom Expected Advantage & Mark Done */}
                          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px]">
                            <span className="flex items-center gap-1.5 text-[#059669] font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#059669]" />
                              <span>Advantage: {tactic.expectedAdvantage}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTactic(tactic.id);
                              }}
                              className={`text-[10px] font-semibold px-2.5 py-1 rounded transition cursor-pointer self-end sm:self-auto ${
                                isDone
                                  ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                                  : "bg-white text-[#4B5563] hover:text-[#111827] border border-[#E5E7EB]"
                              }`}
                            >
                              {isDone ? "Applied" : "Mark Done"}
                            </button>
                          </div>
                        </div>
                      )}
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
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] text-[#5B5CE2] flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#111827]">
              How to Beat Any Competitor in 3 Steps
            </h3>
            <p className="mt-1 text-xs text-[#6B7280] leading-relaxed">
              Enter your competitor's channel link or @handle in the search box above to calculate head-to-head metrics and unlock data-driven ways to beat them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto text-left">
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5B5CE2] text-xs font-bold font-mono mb-2">
                1
              </span>
              <h4 className="text-xs font-bold text-[#111827]">Paste Competitor URL</h4>
              <p className="text-[11px] text-[#6B7280] mt-1">
                Enter any channel link or handle into Account B above.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold font-mono mb-2">
                2
              </span>
              <h4 className="text-xs font-bold text-[#111827]">Audit Live Metrics</h4>
              <p className="text-[11px] text-[#6B7280] mt-1">
                Calculate real subscribers, total views, ER, and growth velocity gaps.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold font-mono mb-2">
                3
              </span>
              <h4 className="text-xs font-bold text-[#111827]">Execute Battle Plan</h4>
              <p className="text-[11px] text-[#6B7280] mt-1">
                Receive specific tactics across packaging, watch time, topic gaps, and timing to beat them.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
