import {
  DashboardDataset,
  EngagementBreakdown,
  HeadlineStats,
  HistoryPoint,
  Platform,
  PlatformConfig,
  ProfileData,
  TopContentItem,
} from "../types";

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  youtube: {
    id: "youtube",
    name: "YouTube",
    followerLabel: "Subscribers",
    viewsLabel: "Total Video Views",
    contentLabel: "Videos Uploaded",
    accentColor: "#ef4444",
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-500/30",
    badgeText: "text-red-400",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    followerLabel: "Followers",
    viewsLabel: "Total Impressions",
    contentLabel: "Posts Published",
    accentColor: "#ec4899",
    badgeBg: "bg-pink-500/10",
    badgeBorder: "border-pink-500/30",
    badgeText: "text-pink-400",
  },
  x: {
    id: "x",
    name: "X (Twitter)",
    followerLabel: "Followers",
    viewsLabel: "Post Impressions",
    contentLabel: "Posts / Tweets",
    accentColor: "#f8fafc",
    badgeBg: "bg-slate-100/10",
    badgeBorder: "border-slate-400/30",
    badgeText: "text-slate-200",
  },
};

/**
 * Deterministic string hash function
 */
export function hashString(str: string): number {
  let hash = 5381;
  const normalized = str.toLowerCase().trim();
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Pseudo-random generator based on a seed number
 */
export class DeterministicRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  pick<T>(items: T[]): T {
    return items[this.intRange(0, items.length - 1)];
  }
}

/**
 * Detect platform from raw URL or handle
 */
export function detectPlatform(input: string): {
  platform: Platform | null;
  cleanHandle: string;
} {
  const trimmed = input.trim();

  // YouTube URL or handle
  if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
    // 1. Channel handle like @SamayRainaOfficial
    const handleMatch = trimmed.match(/@([a-zA-Z0-9_.-]+)/);
    if (handleMatch) {
      return { platform: "youtube", cleanHandle: `@${handleMatch[1]}` };
    }
    // 2. Channel path channel/UC...
    const channelMatch = trimmed.match(/channel\/([a-zA-Z0-9_.-]+)/i);
    if (channelMatch) {
      return { platform: "youtube", cleanHandle: `@${channelMatch[1]}` };
    }
    // 3. User or custom c/...
    const cMatch = trimmed.match(/(?:c|user)\/([a-zA-Z0-9_.-]+)/i);
    if (cMatch) {
      return { platform: "youtube", cleanHandle: `@${cMatch[1]}` };
    }
    // 4. Video links like watch?v=... or youtu.be/...
    return { platform: "youtube", cleanHandle: trimmed };
  }

  if (trimmed.includes("instagram.com")) {
    const match = trimmed.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
    const clean = match ? `@${match[1]}` : trimmed;
    return { platform: "instagram", cleanHandle: clean };
  }

  if (trimmed.includes("twitter.com") || trimmed.includes("x.com")) {
    const match = trimmed.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/i);
    const clean = match ? `@${match[1]}` : trimmed;
    return { platform: "x", cleanHandle: clean };
  }

  // Plain handle without URL domain
  let clean = trimmed;
  if (clean.startsWith("@")) {
    clean = clean.replace(/[^@a-zA-Z0-9_.-]/g, "");
  } else {
    clean = `@${clean.replace(/[^a-zA-Z0-9_.-]/g, "")}`;
  }

  return { platform: null, cleanHandle: clean };
}

/**
 * Format large numbers cleanly (e.g. 1.2M, 340K)
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toLocaleString();
}

/**
 * Generate display name and initials from handle
 */
function deriveNameAndInitials(cleanHandle: string): {
  displayName: string;
  initials: string;
} {
  const stripped = cleanHandle.replace(/^@/, "");
  if (!stripped) return { displayName: "Creator Profile", initials: "CP" };

  // Split on dots, underscores or camelCase
  const parts = stripped
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[._\s-]+/)
    .filter(Boolean);

  let displayName = "";
  let initials = "";

  if (parts.length === 1) {
    const word = parts[0];
    displayName = word.charAt(0).toUpperCase() + word.slice(1);
    initials = word.slice(0, 2).toUpperCase();
  } else {
    displayName = parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
    initials = (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return { displayName, initials };
}

const CATEGORIES = [
  "Technology & Hardware",
  "Design & Creative Arts",
  "Science & Education",
  "Gaming & Entertainment",
  "Business & Venture",
  "Culture & Lifestyle",
  "Photography & Nature",
  "Software Engineering",
];

const AVATAR_GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-rose-600 to-pink-700",
  "from-amber-500 to-orange-700",
  "from-emerald-600 to-teal-800",
  "from-cyan-600 to-blue-800",
  "from-fuchsia-600 to-purple-800",
];

/**
 * Generate full deterministic mock dataset
 */
export function generateMockStats(
  rawInput: string,
  platform: Platform
): DashboardDataset {
  const { cleanHandle } = detectPlatform(rawInput);
  const seed = hashString(cleanHandle + "_" + platform);
  const rng = new DeterministicRNG(seed);

  const { displayName, initials } = deriveNameAndInitials(cleanHandle);
  const verified = rng.next() > 0.25; // 75% chance verified for major handles
  const category = rng.pick(CATEGORIES);
  const avatarBg = rng.pick(AVATAR_GRADIENTS);
  const joinedYear = rng.intRange(2011, 2021);

  // Platform-specific realistic scales
  let followers = 0;
  let totalViews = 0;
  let engagementRate = 0;
  let postsCount = 0;

  if (platform === "youtube") {
    followers = Math.floor(rng.range(120_000, 18_500_000));
    totalViews = Math.floor(followers * rng.range(85, 340));
    engagementRate = parseFloat(rng.range(3.2, 7.8).toFixed(2));
    postsCount = Math.floor(rng.range(180, 2_400));
  } else if (platform === "instagram") {
    followers = Math.floor(rng.range(85_000, 32_000_000));
    totalViews = Math.floor(followers * rng.range(15, 80));
    engagementRate = parseFloat(rng.range(2.1, 5.9).toFixed(2));
    postsCount = Math.floor(rng.range(320, 3_800));
  } else {
    // X
    followers = Math.floor(rng.range(50_000, 28_000_000));
    totalViews = Math.floor(followers * rng.range(40, 190));
    engagementRate = parseFloat(rng.range(1.4, 4.8).toFixed(2));
    postsCount = Math.floor(rng.range(1_200, 28_000));
  }

  // Realistic deltas
  const fDeltaNum = rng.range(0.8, 4.6);
  const followersDelta = `+${fDeltaNum.toFixed(1)}%`;
  const vDeltaNum = rng.range(-1.2, 8.4);
  const viewsDelta = `${vDeltaNum >= 0 ? "+" : ""}${vDeltaNum.toFixed(1)}%`;
  const eDeltaNum = rng.range(-0.4, 0.9);
  const engagementDelta = `${eDeltaNum >= 0 ? "+" : ""}${eDeltaNum.toFixed(1)}%`;
  const pDeltaNum = rng.intRange(2, 18);
  const postsDelta = `+${pDeltaNum} this mo`;

  const profile: ProfileData = {
    handle: cleanHandle,
    rawInput,
    displayName,
    platform,
    verified,
    initials,
    bio: generateBio(displayName, category, platform, rng),
    avatarBg,
    joinedYear,
    category,
    profileUrl: getProfileUrl(cleanHandle, platform),
  };

  const stats: HeadlineStats = {
    followers,
    followersFormatted: formatNumber(followers),
    followersDelta,
    followersDeltaPositive: true,
    totalViews,
    totalViewsFormatted: formatNumber(totalViews),
    viewsDelta,
    viewsDeltaPositive: vDeltaNum >= 0,
    engagementRate,
    engagementDelta,
    engagementDeltaPositive: eDeltaNum >= 0,
    postsCount,
    postsCountFormatted: formatNumber(postsCount),
    postsDelta,
    postsDeltaPositive: true,
    trajectoryStatus: vDeltaNum >= 0 ? "growing" : "decreasing",
    trajectoryPercent: Number((vDeltaNum * 3.8).toFixed(1)),
    trajectoryFormatted: `${vDeltaNum >= 0 ? "+" : ""}${(vDeltaNum * 3.8).toFixed(1)}%`,
    likesHealth: {
      status: eDeltaNum >= 0 ? "good" : "bad",
      rate: engagementRate,
      deltaPercent: Number((eDeltaNum * 12).toFixed(1)),
      deltaFormatted: `${eDeltaNum >= 0 ? "+" : ""}${(eDeltaNum * 12).toFixed(1)}%`,
      isPositive: eDeltaNum >= 0,
    },
    viewsHealth: {
      status: vDeltaNum >= 0 ? "good" : "bad",
      deltaPercent: Number(vDeltaNum.toFixed(1)),
      deltaFormatted: viewsDelta,
      isPositive: vDeltaNum >= 0,
      recentAvg: Math.round(totalViews / Math.max(1, postsCount)),
      channelAvg: Math.round(totalViews / Math.max(1, postsCount)),
    },
  };

  // Generate 90-day historical points
  const history = generateHistoricalPoints(followers, totalViews, engagementRate, rng);

  // Top content items
  const topContent = generateTopContent(displayName, platform, followers, rng);

  // Engagement breakdown
  const likesShare = rng.intRange(72, 84);
  const commentsShare = rng.intRange(8, 16);
  const sharesShare = 100 - likesShare - commentsShare;

  const engagement: EngagementBreakdown = {
    likes: likesShare,
    comments: commentsShare,
    shares: sharesShare,
    rawTotalEngagement: Math.floor(totalViews * (engagementRate / 100)),
  };

  const impressions = Math.round(totalViews * 11.2);
  const ctr = Number((rng.range(5.8, 9.4)).toFixed(1));
  const uniqueViewers = Math.round(followers * 1.5);
  const watchTimeHours = Math.round(totalViews * 0.11);
  const viewsLast48h = Math.round(followers * 0.065 + 45000);
  const viewsLast60m = Math.round((viewsLast48h / 48) * 1.2);

  const hourlyActivity: number[] = [];
  for (let h = 47; h >= 0; h--) {
    const base = viewsLast48h / 48;
    const wave = 0.6 + 0.6 * Math.sin(((48 - h) / 24) * 2 * Math.PI - Math.PI / 2);
    hourlyActivity.push(Math.round(base * wave * rng.range(0.8, 1.2)));
  }

  const activeHoursHeatmap: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const dayRow: number[] = [];
    for (let h = 0; h < 24; h++) {
      if (h < 6) dayRow.push(0);
      else if (h < 12) dayRow.push(1);
      else if (h < 18) dayRow.push(d >= 5 ? 2 : 1);
      else if (h < 23) dayRow.push(3);
      else dayRow.push(2);
    }
    activeHoursHeatmap.push(dayRow);
  }

  const studio = {
    reach: {
      impressions,
      impressionsFormatted: formatNumber(impressions),
      impressionsDelta: "+7.2%",
      ctr,
      ctrDelta: "+0.3%",
      uniqueViewers,
      uniqueViewersFormatted: formatNumber(uniqueViewers),
      viewsFromImpressions: Math.round(totalViews * 0.72),
      viewsFromImpressionsFormatted: formatNumber(Math.round(totalViews * 0.72)),
      trafficSources: [
        { source: "Browse features", percentage: 42.1, viewsFormatted: formatNumber(Math.round(totalViews * 0.421)) },
        { source: "Suggested videos / feed", percentage: 31.4, viewsFormatted: formatNumber(Math.round(totalViews * 0.314)) },
        { source: "Platform search", percentage: 14.8, viewsFormatted: formatNumber(Math.round(totalViews * 0.148)) },
        { source: "External web & shares", percentage: 7.2, viewsFormatted: formatNumber(Math.round(totalViews * 0.072)) },
        { source: "Direct & other", percentage: 4.5, viewsFormatted: formatNumber(Math.round(totalViews * 0.045)) },
      ],
      topSearchTerms: [
        { term: `${displayName} highlights`, percentage: 26.5 },
        { term: `${displayName} recent episode`, percentage: 22.1 },
        { term: `${displayName} best clips`, percentage: 18.4 },
        { term: `${cleanHandle}`, percentage: 14.2 },
        { term: `viral moments with ${displayName}`, percentage: 8.8 },
      ],
      externalSites: [
        { site: "WhatsApp", percentage: 38.2 },
        { site: "Instagram", percentage: 27.6 },
        { site: "Google Search", percentage: 16.4 },
        { site: "Reddit", percentage: 10.5 },
        { site: "X / Twitter", percentage: 7.3 },
      ],
    },
    engagement: {
      watchTimeHours,
      watchTimeFormatted: formatNumber(watchTimeHours),
      watchTimeDelta: "+5.6%",
      avgViewDuration: `${rng.intRange(5, 9)}:${rng.intRange(10, 59).toString().padStart(2, "0")}`,
      avgPercentageViewed: Number((rng.range(42, 54)).toFixed(1)),
      retentionCurve: [
        { percentOfVideo: 0, retentionPercent: 100 },
        { percentOfVideo: 5, retentionPercent: 86 },
        { percentOfVideo: 10, retentionPercent: 78 },
        { percentOfVideo: 20, retentionPercent: 70 },
        { percentOfVideo: 30, retentionPercent: 64 },
        { percentOfVideo: 40, retentionPercent: 59 },
        { percentOfVideo: 50, retentionPercent: 54 },
        { percentOfVideo: 60, retentionPercent: 49 },
        { percentOfVideo: 70, retentionPercent: 45 },
        { percentOfVideo: 80, retentionPercent: 41 },
        { percentOfVideo: 90, retentionPercent: 36 },
        { percentOfVideo: 100, retentionPercent: 29 },
      ],
      endScreenCtaRate: 4.8,
      topPlaylists: [
        { title: `${displayName} Popular Series`, views: formatNumber(Math.round(totalViews * 0.25)) },
        { title: "Special Guest Interviews", views: formatNumber(Math.round(totalViews * 0.18)) },
        { title: "Weekly Compilations", views: formatNumber(Math.round(totalViews * 0.12)) },
      ],
      interactionRates: {
        overallRate: Number((rng.range(5.8, 8.4)).toFixed(1)),
        likesPerKViews: Number((rng.range(46.0, 68.0)).toFixed(1)),
        commentsPerKViews: Number((rng.range(4.5, 8.2)).toFixed(1)),
        sharesPerKViews: Number((rng.range(8.0, 16.5)).toFixed(1)),
        cardClickRate: Number((rng.range(1.5, 3.2)).toFixed(1)),
        endScreenRate: 4.8,
        saveToPlaylistRate: Number((rng.range(2.4, 4.8)).toFixed(1)),
      },
    },
    audience: {
      returningViewers: Math.round(followers * 0.58),
      returningViewersFormatted: formatNumber(Math.round(followers * 0.58)),
      newViewers: Math.round(followers * 1.2),
      newViewersFormatted: formatNumber(Math.round(followers * 1.2)),
      subscribedRatio: 24.5,
      ageGender: {
        gender: { male: 74.5, female: 24.8, userSpecified: 0.7 },
        ageGroups: [
          { bracket: "13–17 years", percentage: 6.2 },
          { bracket: "18–24 years", percentage: 39.8 },
          { bracket: "25–34 years", percentage: 36.4 },
          { bracket: "35–44 years", percentage: 12.1 },
          { bracket: "45–54 years", percentage: 3.8 },
          { bracket: "55+ years", percentage: 1.7 },
        ],
      },
      topGeographies: [
        { country: "India", code: "IN", percentage: 68.5 },
        { country: "United States", code: "US", percentage: 11.2 },
        { country: "United Arab Emirates", code: "AE", percentage: 6.4 },
        { country: "United Kingdom", code: "GB", percentage: 4.1 },
        { country: "Canada", code: "CA", percentage: 3.2 },
      ],
      activeHoursHeatmap,
      topSubtitles: [
        { language: "English", percentage: 84.5 },
        { language: "Hindi", percentage: 41.2 },
        { language: "Auto-translated", percentage: 22.8 },
      ],
    },
    realtime: {
      viewsLast48h,
      viewsLast48hFormatted: formatNumber(viewsLast48h),
      viewsLast60m,
      viewsLast60mFormatted: formatNumber(viewsLast60m),
      hourlyActivity,
    },
  };

  return {
    profile,
    stats,
    history,
    topContent,
    engagement,
    studio,
    isRealtimeVerified: false,
    lastUpdated: "Just now",
  };
}

/**
 * Generate 90 days of history for line charts
 */
function generateHistoricalPoints(
  currentFollowers: number,
  currentViews: number,
  baseER: number,
  rng: DeterministicRNG
): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  const totalDays = 90;
  const now = new Date();

  // Growth rate over 90 days is between 4% and 14%
  const totalGrowthPercent = rng.range(0.04, 0.14);
  const startFollowers = currentFollowers / (1 + totalGrowthPercent);
  const startViews = currentViews * 0.88;

  for (let i = totalDays; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const progress = (totalDays - i) / totalDays;
    // Add realistic noise to smooth curve
    const noiseFactor = 1 + (rng.next() - 0.49) * 0.008;
    const fVal = Math.round(
      (startFollowers + (currentFollowers - startFollowers) * Math.pow(progress, 1.1)) *
        noiseFactor
    );
    const vVal = Math.round(
      (startViews + (currentViews - startViews) * Math.pow(progress, 1.05)) *
        noiseFactor
    );
    const erVal = parseFloat(
      (baseER + (rng.next() - 0.5) * 0.4).toFixed(2)
    );

    const monthStr = d.toLocaleDateString("en-US", { month: "short" });
    const dayStr = d.getDate();

    points.push({
      date: `${monthStr} ${dayStr}`,
      fullDate: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      followers: fVal,
      views: vVal,
      engagementRate: Math.max(0.5, erVal),
    });
  }

  return points;
}

/**
 * Generate platform-tailored top content items
 */
function generateTopContent(
  displayName: string,
  platform: Platform,
  followers: number,
  rng: DeterministicRNG
): TopContentItem[] {
  const items: TopContentItem[] = [];

  const videoTitles = [
    `The Complete Breakdown: Why Everything Changed in 2026`,
    `I Tested This for 30 Days (Real World Results)`,
    `What They Don't Tell You About Next-Gen Systems`,
    `Ultimate Deep Dive: What's Worth Buying Today`,
    `Top 5 Industry Shifts No One is Talking About Yet`,
  ];

  const igCaptions = [
    `Behind the scenes of our latest production in Tokyo 📸`,
    `Reflections on 5 years building in public. Swipe for details 👉`,
    `Golden hour clarity. The little details make all the difference.`,
    `Field notes from today's live experiment. Let me know your thoughts below!`,
    `New studio gear setup tour. Which one is your personal favorite?`,
  ];

  const xPosts = [
    `The biggest mistake creators make with retention isn't the hook. It's the transition at the 45-second mark. Here's what the data shows:`,
    `3 counter-intuitive observations after analyzing 10M+ interactions this quarter: 🧵`,
    `Most people underestimate how much distribution compounds when you solve one specific problem with zero fluff.`,
    `Quick retrospective on building sustainable cadence without sacrificing production depth:`,
    `The paradigm is shifting faster than anticipated. If you're building in this space, watch these 4 indicators:`,
  ];

  const titles =
    platform === "youtube"
      ? videoTitles
      : platform === "instagram"
      ? igCaptions
      : xPosts;

  const now = new Date();

  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (i * 5 + rng.intRange(1, 4)));

    // Views roughly proportional to followers
    const multiplier = rng.range(0.25, 1.6) * (1 - i * 0.12);
    const postViews = Math.max(10_000, Math.floor(followers * multiplier));
    const er = parseFloat(rng.range(3.5, 9.2).toFixed(2));
    const postLikes = Math.floor(postViews * (er / 100) * rng.range(0.75, 0.9));
    const postComments = Math.floor(postLikes * rng.range(0.04, 0.16));
    const postShares = Math.floor(postLikes * rng.range(0.08, 0.25));

    let type: "video" | "reel" | "post" | "thread" = "post";
    let durationOrLength = undefined;
    let videoUrl = "";
    let thumbnailUrl = "";

    const sampleYoutubeIds = [
      "kJQP7kiw5Fk",
      "dQw4w9WgXcQ",
      "fJ9rUzIMcZQ",
      "L_LUpnjgPso",
      "9bZkp7q19f0",
    ];

    const sampleThumbnails = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    ];

    const cleanHandle = displayName.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || "creator";

    if (platform === "youtube") {
      type = "video";
      const ytId = sampleYoutubeIds[i % sampleYoutubeIds.length];
      videoUrl = `https://www.youtube.com/watch?v=${ytId}`;
      thumbnailUrl = `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`;
      durationOrLength = `${rng.intRange(8, 24)}:${rng
        .intRange(10, 59)
        .toString()
        .padStart(2, "0")}`;
    } else if (platform === "instagram") {
      type = i % 2 === 0 ? "reel" : "post";
      durationOrLength = type === "reel" ? "0:45 Reel" : "Carousel";
      videoUrl = `https://instagram.com/p/C${i + 1}xY${rng.intRange(100, 999)}/`;
      thumbnailUrl = sampleThumbnails[i % sampleThumbnails.length];
    } else {
      type = i === 1 ? "thread" : "post";
      durationOrLength = type === "thread" ? "6 tweets" : undefined;
      videoUrl = `https://x.com/${cleanHandle}/status/182000000000000000${i + 1}`;
      thumbnailUrl = sampleThumbnails[i % sampleThumbnails.length];
    }

    items.push({
      id: `content-${i + 1}`,
      title: titles[i],
      publishedDate: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      views: postViews,
      viewsFormatted: formatNumber(postViews),
      likes: postLikes,
      likesFormatted: formatNumber(postLikes),
      comments: postComments,
      commentsFormatted: formatNumber(postComments),
      shares: postShares,
      sharesFormatted: formatNumber(postShares),
      engagementRate: er,
      type,
      durationOrLength,
      videoUrl,
      thumbnailUrl,
    });
  }

  // Sort by views descending
  items.sort((a, b) => b.views - a.views);
  return items;
}

function generateBio(
  displayName: string,
  category: string,
  platform: Platform,
  rng: DeterministicRNG
): string {
  const bios = [
    `Exploring ${category.toLowerCase()} with deep technical breakdowns and honest analysis. New releases weekly.`,
    `Independent creator & researcher documenting the frontier of ${category.toLowerCase()}. Inquiries via email.`,
    `Curating high-signal insights, experiments, and case studies across ${category.toLowerCase()}.`,
    `Designing, building, and breaking ideas in public. Official ${platform.toUpperCase()} channel of ${displayName}.`,
  ];
  return rng.pick(bios);
}

function getProfileUrl(handle: string, platform: Platform): string {
  const stripped = handle.replace(/^@/, "");
  if (platform === "youtube") return `https://youtube.com/@${stripped}`;
  if (platform === "instagram") return `https://instagram.com/${stripped}`;
  return `https://x.com/${stripped}`;
}

/**
 * Simulated nudge for near-real-time refresh:
 * slightly increases views and followers by realistic small amounts
 */
export function nudgeStats(current: DashboardDataset): DashboardDataset {
  const followerDelta = Math.floor(Math.random() * 18) + 4; // +4 to +22 followers
  const viewsDelta = Math.floor(Math.random() * 450) + 120; // +120 to +570 views
  const erNudge = (Math.random() - 0.45) * 0.02; // tiny drift

  const updatedFollowers = current.stats.followers + followerDelta;
  const updatedViews = current.stats.totalViews + viewsDelta;
  const updatedER = parseFloat(
    Math.max(0.8, current.stats.engagementRate + erNudge).toFixed(2)
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    ...current,
    stats: {
      ...current.stats,
      followers: updatedFollowers,
      followersFormatted: formatNumber(updatedFollowers),
      totalViews: updatedViews,
      totalViewsFormatted: formatNumber(updatedViews),
      engagementRate: updatedER,
    },
    lastUpdated: `Refreshed at ${timeStr}`,
  };
}
