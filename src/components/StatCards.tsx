import React from "react";
import {
  Users,
  Eye,
  Percent,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { HeadlineStats, Platform } from "../types";
import { PLATFORM_CONFIGS } from "../utils/mockGenerator";

interface StatCardsProps {
  stats: HeadlineStats;
  platform: Platform;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, platform }) => {
  const config = PLATFORM_CONFIGS[platform];

  const cards = [
    {
      id: "stat-followers",
      label: config.followerLabel,
      value: stats.followersFormatted,
      delta: stats.followersDelta,
      isPositive: stats.followersDeltaPositive,
      period: "vs last 30d",
      icon: Users,
    },
    {
      id: "stat-views",
      label: config.viewsLabel,
      value: stats.totalViewsFormatted,
      delta: stats.viewsDelta,
      isPositive: stats.viewsDeltaPositive,
      period: "vs last 30d",
      icon: Eye,
    },
    {
      id: "stat-engagement",
      label: "Engagement Rate",
      value: `${stats.engagementRate}%`,
      delta: stats.engagementDelta,
      isPositive: stats.engagementDeltaPositive,
      period: "vs peer avg",
      icon: Percent,
    },
    {
      id: "stat-posts",
      label: config.contentLabel,
      value: stats.postsCountFormatted,
      delta: stats.postsDelta,
      isPositive: stats.postsDeltaPositive,
      period: "cadence",
      icon: Layers,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm transition hover:border-slate-700/80"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {card.label}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400">
                <IconComponent className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                {card.value}
              </div>

              {/* Delta Badge */}
              <div
                className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                  card.isPositive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {card.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span>{card.delta}</span>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 font-medium">
              <span>{card.period}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
