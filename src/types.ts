export type Platform = "youtube" | "instagram" | "x";

export interface PlatformConfig {
  id: Platform;
  name: string;
  followerLabel: string;
  viewsLabel: string;
  contentLabel: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export interface ProfileData {
  handle: string;
  rawInput: string;
  displayName: string;
  platform: Platform;
  verified: boolean;
  initials: string;
  bio: string;
  avatarBg: string;
  avatarUrl?: string;
  bannerUrl?: string;
  externalUrl?: string;
  isLiveVerified?: boolean;
  joinedYear: number;
  category: string;
  profileUrl: string;
}

export interface HeadlineStats {
  followers: number;
  followersFormatted: string;
  followersDelta: string;
  followersDeltaPositive: boolean;

  totalViews: number;
  totalViewsFormatted: string;
  viewsDelta: string;
  viewsDeltaPositive: boolean;

  engagementRate: number;
  engagementDelta: string;
  engagementDeltaPositive: boolean;

  postsCount: number;
  postsCountFormatted: string;
  postsDelta: string;
  postsDeltaPositive: boolean;

  // Dynamic Performance Health Metrics
  trajectoryStatus?: "growing" | "decreasing" | "neutral";
  trajectoryPercent?: number;
  trajectoryFormatted?: string;
  trajectorySummary?: string;
  likesHealth?: {
    status: "good" | "bad";
    rate: number;
    deltaPercent: number;
    deltaFormatted: string;
    isPositive: boolean;
  };
  viewsHealth?: {
    status: "good" | "bad";
    deltaPercent: number;
    deltaFormatted: string;
    isPositive: boolean;
    recentAvg: number;
    channelAvg: number;
  };
}

export interface HistoryPoint {
  date: string;
  fullDate: string;
  followers: number;
  views: number;
  engagementRate: number;
}

export interface TopContentItem {
  id: string;
  title: string;
  publishedDate: string;
  views: number;
  viewsFormatted: string;
  likes: number;
  likesFormatted: string;
  comments: number;
  commentsFormatted: string;
  shares: number;
  sharesFormatted: string;
  engagementRate: number;
  type: "video" | "reel" | "post" | "thread";
  durationOrLength?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface EngagementBreakdown {
  likes: number; // percentage
  comments: number; // percentage
  shares: number; // percentage
  rawTotalEngagement: number;
}

export interface StudioTrafficSource {
  source: string;
  percentage: number;
  viewsFormatted: string;
}

export interface StudioAnalytics {
  reach: {
    impressions: number;
    impressionsFormatted: string;
    impressionsDelta: string;
    ctr: number;
    ctrDelta: string;
    uniqueViewers: number;
    uniqueViewersFormatted: string;
    viewsFromImpressions: number;
    viewsFromImpressionsFormatted: string;
    trafficSources: StudioTrafficSource[];
    topSearchTerms: Array<{ term: string; percentage: number }>;
    externalSites: Array<{ site: string; percentage: number }>;
  };
  engagement: {
    watchTimeHours: number;
    watchTimeFormatted: string;
    watchTimeDelta: string;
    avgViewDuration: string;
    avgPercentageViewed: number;
    retentionCurve: Array<{ percentOfVideo: number; retentionPercent: number }>;
    endScreenCtaRate: number;
    topPlaylists: Array<{ title: string; views: string }>;
    interactionRates?: {
      overallRate: number;
      likesPerKViews: number;
      commentsPerKViews: number;
      sharesPerKViews: number;
      cardClickRate: number;
      endScreenRate: number;
      saveToPlaylistRate: number;
    };
  };
  audience: {
    returningViewers: number;
    returningViewersFormatted: string;
    newViewers: number;
    newViewersFormatted: string;
    subscribedRatio: number;
    ageGender: {
      gender: { male: number; female: number; userSpecified: number };
      ageGroups: Array<{ bracket: string; percentage: number }>;
    };
    topGeographies: Array<{ country: string; code: string; percentage: number }>;
    activeHoursHeatmap: number[][]; // 7 days (Sun-Sat) x 24 hours (0-23), values 0-3 (0: very few, 3: many)
    topSubtitles: Array<{ language: string; percentage: number }>;
  };
  realtime: {
    viewsLast48h: number;
    viewsLast48hFormatted: string;
    viewsLast60m: number;
    viewsLast60mFormatted: string;
    hourlyActivity: number[];
  };
}

export interface VideoAnalyticsData {
  videoId: string;
  title: string;
  videoUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  publishedDate: string;
  duration: string;
  durationSeconds?: number;
  descriptionSnippet?: string;
  tags?: string[];
  
  // Real-time video performance stats
  views: number;
  viewsFormatted: string;
  viewsPerHour: number;
  viewsPerHourFormatted: string;
  likes: number;
  likesFormatted: string;
  likeRatio: number; // e.g. 98.2
  comments: number;
  commentsFormatted: string;
  shares: number;
  sharesFormatted: string;
  
  // Video-specific rates & retention
  engagementRate: number; // e.g. 4.2%
  viralScore: number; // 0-100 scale
  avgViewDuration: string;
  avgPercentageViewed: number;
  retentionCurve: Array<{ percentOfVideo: number; retentionPercent: number; timeLabel: string }>;

  // Video-specific traffic source breakdown
  trafficSources: Array<{ source: string; percentage: number; viewsFormatted: string }>;

  // Video search terms
  topSearchTerms: Array<{ term: string; percentage: number }>;

  // Comparative benchmarks vs channel average
  vsChannelAverage: {
    viewsDeltaPercent: string;
    viewsMultiplier: string;
    engagementDeltaPercent: string;
    isViewsHigher: boolean;
    isEngagementHigher: boolean;
  };
}

export interface DashboardDataset {
  profile: ProfileData;
  stats: HeadlineStats;
  history: HistoryPoint[];
  topContent: TopContentItem[];
  engagement: EngagementBreakdown;
  studio?: StudioAnalytics;
  videoAnalytics?: VideoAnalyticsData;
  isRealtimeVerified?: boolean;
  lastUpdated: string;
}

export interface AiInsightResponse {
  insight: string;
  source: string;
  timestamp: string;
}

export interface CompareMetricAnalysis {
  leader: "Account A" | "Account B" | "Tie";
  differential: string;
  analysis: string;
}

export interface BeatCompetitorTactic {
  id: string;
  priority: "Critical Priority" | "High Leverage" | "Quick Win" | "Strategic Moat" | string;
  category: "Packaging & CTR" | "Retention & Watch Time" | "Topic Gaps" | "Upload Timing" | "Community Moat" | "Audience Scaling" | "Upload Cadence" | "Strategic Dominance" | string;
  title: string;
  tacticalAction: string;
  whyItBeatsCompetitor: string;
  expectedAdvantage: string;
}

export interface CompareRecommendation {
  priority: "High" | "Medium";
  category: string;
  title: string;
  action: string;
}

export interface CompareInsightData {
  executiveSummary: string;
  metricsComparison: {
    subscribers: CompareMetricAnalysis;
    totalViews: CompareMetricAnalysis;
    engagementRate: CompareMetricAnalysis;
    growthVelocity: CompareMetricAnalysis;
  };
  actionableRecommendations: CompareRecommendation[];
  waysToBeatCompetitor?: BeatCompetitorTactic[];
}

export interface CompareInsightResponse {
  data: CompareInsightData;
  source: string;
  modelName: string;
  timestamp: string;
}

export interface HighDemandOpportunity {
  id: string;
  topic: string;
  nicheCategory: string;
  demandScore: number; // e.g. 97/100
  demandLevel: "Extreme Demand" | "High Demand" | "Rising Trend" | "High Search Volume";
  userRatingLevel: string; // e.g. "98% Positive Viewer Rating"
  whyDemandIsHigh: string; // Detail why audience is actively rating and searching for this
  recommendedFormat: string; // e.g. "30-min Step-by-Step Project Masterclass"
  suggestedTitles: string[]; // 2-3 copy-ready high-CTR titles
  thumbnailConcept: string; // Visual advice and 3-word trigger hook
  targetKeywords: string[];
  productionDifficulty: "Quick Win (Low Effort)" | "Medium (Standard Build)" | "High Leverage (Deep Dive)";
  projectedViewerImpact: string; // Expected watch time and CTR impact
}

export interface HighestRatedFormat {
  formatName: string;
  userRatingPercent: number; // e.g. 96
  avgViewerRetention: string; // e.g. "62%"
  whyItPerforms: string;
}

export interface HighDemandContentData {
  detectedNiche: string;
  nicheDescription: string;
  overallDemandScore: number; // 0 - 100
  demandVelocity: "Accelerating Exponentially" | "Surging High Appetite" | "Consistent Peak Demand";
  viewerSatisfactionBenchmark: string; // e.g. "96.4% Viewer Approval in this Category"
  highestRatedFormats: HighestRatedFormat[];
  trendingViewerQueries: string[]; // High-demand questions viewers search for
  opportunities: HighDemandOpportunity[];
  productionActionPlan: string[];
}

export interface HighDemandContentResponse {
  data: HighDemandContentData;
  source: string;
  modelName: string;
  timestamp: string;
}

export interface CampusTermCycle {
  termName: string; // e.g., "Fall Midterms Crunch", "Spring Finals Sprint", "Welcome Week"
  viewershipVelocityMultiplier: number; // e.g. 1.35x
  studyContentAppetite: "Peak" | "High" | "Moderate" | "Low";
  lifestyleContentAppetite: "Peak" | "High" | "Moderate" | "Low";
  recommendedPostingCadence: string;
  keyInsight: string;
}

export interface StudentCohortBreakdown {
  standing: "Freshmen" | "Sophomores" | "Juniors" | "Seniors" | "Graduate / Postgrad";
  percentage: number;
  primaryInterests: string[];
  retentionIndex: number; // e.g. 112 (vs 100 benchmark)
}

export interface CampusMajorDistribution {
  field: string; // e.g. "Computer Science & Engineering", "Business & Finance", "Pre-Med & Healthcare"
  percentage: number;
  avgEngagementRate: number;
}

export interface CampusFormatPerformance {
  formatName: string;
  avgRetentionPercent: number;
  engagementRate: number;
  bestPostingWindow: string;
  collegiateViralityScore: number; // 0-100
  brandSponsorSuitability: "High" | "Medium" | "Elite";
  sampleTitle: string;
  recommendationNote: string;
}

export interface CampusBrandOpportunity {
  brandName: string;
  category: "Energy & Beverage" | "Student Productivity" | "Apparel & Gear" | "EdTech & Study" | "Snacks & Dorm";
  typicalCompensationTier: string; // e.g., "$350 - $750 / reel + Free Product"
  avgStudentConversionRate: string; // e.g. "4.8% affiliate click-through"
  idealContentAngle: string;
}

export interface CampusTrendTopic {
  id: string;
  topic: string;
  hashtag: string;
  viralityVelocity: "+145%" | "+88%" | "+210%" | "+64%";
  category: "Academics & Study" | "Campus Life & Dorm" | "Career & Recruiting" | "Greek Life & Social" | "Budget & Food";
  suggestedAngle: string;
  bestPlatform: "YouTube Shorts / Reels" | "Long-form Vlog" | "Carousel Infographic";
}

export interface StudentCreatorData {
  university: string;
  campusEnrollment: string;
  campusReachScore: number; // 0-100
  peerTrustIndex: string; // e.g. "94.2% Peer Affinity"
  academicCycle: CampusTermCycle;
  cohortBreakdown: StudentCohortBreakdown[];
  majorsDistribution: CampusMajorDistribution[];
  housingBreakdown: Array<{ type: string; percentage: number }>;
  campusPeakHours: Array<{ timeSlot: string; activityLevel: number; note: string }>;
  topCampusFormats: CampusFormatPerformance[];
  brandPartnerships: CampusBrandOpportunity[];
  risingCampusTrends: CampusTrendTopic[];
  aiCampusStrategicBriefing: string;
}

export interface StudentCreatorResponse {
  data: StudentCreatorData;
  source: string;
  modelName: string;
  timestamp: string;
}

export interface QuickDesignPayload {
  headline: string;
  subtitle?: string;
  badgeText?: string;
  category: "youtube-thumbnail" | "instagram-story" | "instagram-post" | "campus-flyer" | "stat-card";
  dimensions: { width: number; height: number; label: string };
  theme: "varsity-blue" | "campus-crimson" | "cyber-neon" | "academic-minimal" | "sunset-glow" | "dark-studio";
  insightContext?: string;
  creatorHandle?: string;
  fireflyPrompt?: string;
  tags?: string[];
  suggestedTemplates?: string[];
}

