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

export interface DashboardDataset {
  profile: ProfileData;
  stats: HeadlineStats;
  history: HistoryPoint[];
  topContent: TopContentItem[];
  engagement: EngagementBreakdown;
  studio?: StudioAnalytics;
  isRealtimeVerified?: boolean;
  lastUpdated: string;
}

export interface AiInsightResponse {
  insight: string;
  source: string;
  timestamp: string;
}
