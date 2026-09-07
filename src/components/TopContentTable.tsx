import React, { useState } from "react";
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowUpDown,
  Flame,
  FileText,
  Image,
} from "lucide-react";
import { Platform, TopContentItem } from "../types";
import { PLATFORM_CONFIGS } from "../utils/mockGenerator";

interface TopContentTableProps {
  content: TopContentItem[];
  platform: Platform;
}

export const TopContentTable: React.FC<TopContentTableProps> = ({
  content,
  platform,
}) => {
  const [sortBy, setSortBy] = useState<"views" | "engagement" | "likes">("views");
  const config = PLATFORM_CONFIGS[platform];

  const sortedItems = [...content].sort((a, b) => {
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
    return b.likes - a.likes;
  });

  return (
    <div
      id="top-content-table-card"
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Top Performing Content</h2>
            <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <Flame className="h-3 w-3" />
              <span>Top 5</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by audience attention, comment depth, and virality index
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" />
            Sort:
          </span>
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
            <button
              onClick={() => setSortBy("views")}
              className={`rounded px-2 py-1 font-medium transition ${
                sortBy === "views"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Views
            </button>
            <button
              onClick={() => setSortBy("engagement")}
              className={`rounded px-2 py-1 font-medium transition ${
                sortBy === "engagement"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Engagement
            </button>
            <button
              onClick={() => setSortBy("likes")}
              className={`rounded px-2 py-1 font-medium transition ${
                sortBy === "likes"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Likes
            </button>
          </div>
        </div>
      </div>

      {/* Content Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-1">Rank & Content</th>
              <th className="pb-3 px-3 text-right">Views</th>
              <th className="pb-3 px-3 text-right">Likes</th>
              <th className="pb-3 px-3 text-right">Comments</th>
              <th className="pb-3 pr-1 text-right">Eng. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedItems.map((item, idx) => {
              return (
                <tr
                  key={item.id}
                  className="group transition hover:bg-slate-800/40"
                >
                  {/* Rank, Thumbnail Placeholder, Title */}
                  <td className="py-3.5 pl-1 pr-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-400 w-4">
                        #{idx + 1}
                      </span>

                      {/* Thumbnail Placeholder or Real Thumbnail */}
                      <div className="relative h-11 w-16 sm:h-12 sm:w-20 shrink-0 rounded-lg bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center group-hover:border-slate-600 transition">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            {platform === "youtube" ? (
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-600/80 text-white shadow">
                                <Play className="h-3 w-3 fill-white translate-x-0.5" />
                              </div>
                            ) : platform === "instagram" ? (
                              <Image className="h-5 w-5 text-pink-400/80" />
                            ) : (
                              <FileText className="h-5 w-5 text-slate-400" />
                            )}
                          </>
                        )}

                        {item.durationOrLength && (
                          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 text-[9px] font-mono text-slate-200">
                            {item.durationOrLength}
                          </span>
                        )}
                      </div>

                      {/* Title & Metadata */}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-100 group-hover:text-indigo-300 transition line-clamp-2 leading-snug">
                          {item.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{item.publishedDate}</span>
                          <span>•</span>
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Views */}
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-100 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Eye className="h-3 w-3 text-slate-500 hidden sm:inline" />
                      <span>{item.viewsFormatted}</span>
                    </div>
                  </td>

                  {/* Likes */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-300 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Heart className="h-3 w-3 text-rose-500/70 hidden sm:inline" />
                      <span>{item.likesFormatted}</span>
                    </div>
                  </td>

                  {/* Comments */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-300 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <MessageCircle className="h-3 w-3 text-indigo-400/70 hidden sm:inline" />
                      <span>{item.commentsFormatted}</span>
                    </div>
                  </td>

                  {/* Engagement Rate Badge */}
                  <td className="py-3.5 pr-1 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                        item.engagementRate >= 6.0
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.engagementRate >= 3.5
                          ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.engagementRate}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
