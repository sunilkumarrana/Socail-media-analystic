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
  BarChart3,
  ExternalLink,
  Sparkles,
  X,
  Tv,
  Calendar,
  Clock,
  Layers,
} from "lucide-react";
import { Platform, TopContentItem } from "../types";
import { PLATFORM_CONFIGS } from "../utils/mockGenerator";

interface TopContentTableProps {
  content: TopContentItem[];
  platform: Platform;
  onAnalyzeVideo?: (item: TopContentItem) => void;
}

function getYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export const TopContentTable: React.FC<TopContentTableProps> = ({
  content,
  platform,
  onAnalyzeVideo,
}) => {
  const [sortBy, setSortBy] = useState<"views" | "engagement" | "likes">("views");
  const [previewItem, setPreviewItem] = useState<TopContentItem | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const config = PLATFORM_CONFIGS[platform];

  const sortedItems = [...content].sort((a, b) => {
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
    return b.likes - a.likes;
  });

  const handleTriggerAnalyze = (item: TopContentItem) => {
    if (onAnalyzeVideo) {
      setAnalyzingId(item.id);
      onAnalyzeVideo(item);
      // clear after brief moment or navigation
      setTimeout(() => setAnalyzingId(null), 1000);
    }
  };

  const previewYtId = previewItem ? getYouTubeVideoId(previewItem.videoUrl) : null;

  return (
    <>
      <div
        id="top-content-table-card"
        className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#111827]">Top Performing Content</h2>
              <span className="rounded bg-[#FEF2F2] px-1.5 py-0.5 text-xs font-medium text-[#DC2626] border border-[#FECACA] flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>Top 5</span>
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Click any video to watch in-app or analyze second-by-second performance
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-[#6B7280] flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              Sort:
            </span>
            <div className="flex rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] p-0.5 text-xs">
              <button
                onClick={() => setSortBy("views")}
                className={`rounded px-2.5 py-1 font-medium transition cursor-pointer ${
                  sortBy === "views"
                    ? "bg-white text-[#111827] shadow-xs font-semibold"
                    : "text-[#4B5563] hover:text-[#111827]"
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setSortBy("engagement")}
                className={`rounded px-2.5 py-1 font-medium transition cursor-pointer ${
                  sortBy === "engagement"
                    ? "bg-white text-[#111827] shadow-xs font-semibold"
                    : "text-[#4B5563] hover:text-[#111827]"
                }`}
              >
                Engagement
              </button>
              <button
                onClick={() => setSortBy("likes")}
                className={`rounded px-2.5 py-1 font-medium transition cursor-pointer ${
                  sortBy === "likes"
                    ? "bg-white text-[#111827] shadow-xs font-semibold"
                    : "text-[#4B5563] hover:text-[#111827]"
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
              <tr className="border-b border-[#E5E7EB] text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
                <th className="pb-3 pl-1">Rank & Content</th>
                <th className="pb-3 px-3 text-right">Views</th>
                <th className="pb-3 px-3 text-right">Likes</th>
                <th className="pb-3 px-3 text-right">Comments</th>
                <th className="pb-3 px-3 text-right">Eng. Rate</th>
                <th className="pb-3 pr-1 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {sortedItems.map((item, idx) => {
                const isItemAnalyzing = analyzingId === item.id;
                const ytId = getYouTubeVideoId(item.videoUrl);
                const hasValidLink = Boolean(item.videoUrl);

                return (
                  <tr
                    key={`${item.id || "content"}-${idx}`}
                    className="group transition hover:bg-[#F8FAFC]"
                  >
                    {/* Rank, Thumbnail, Title */}
                    <td className="py-3.5 pl-1 pr-3 max-w-sm sm:max-w-md">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-[#9CA3AF] w-4 shrink-0">
                          #{idx + 1}
                        </span>

                        {/* Thumbnail with interactive Play Overlay */}
                        <div
                          onClick={() => setPreviewItem(item)}
                          className="relative h-12 w-20 shrink-0 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center cursor-pointer group/thumb hover:ring-2 hover:ring-[#5B5CE2]/50 transition shadow-xs"
                          title="Click to view/play video"
                        >
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover group-hover/thumb:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-[#F3F4F6] flex items-center justify-center">
                              {platform === "youtube" ? (
                                <Tv className="h-5 w-5 text-red-500" />
                              ) : platform === "instagram" ? (
                                <Image className="h-5 w-5 text-pink-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-[#9CA3AF]" />
                              )}
                            </div>
                          )}

                          {/* Hover Play Backdrop */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-[#5B5CE2] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover/thumb:scale-100 transition">
                              <Play className="h-3 w-3 fill-white translate-x-0.5" />
                            </div>
                          </div>

                          {item.durationOrLength && (
                            <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.2 text-[9px] font-mono text-white">
                              {item.durationOrLength}
                            </span>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="text-left font-medium text-[#111827] hover:text-[#5B5CE2] transition line-clamp-2 leading-snug cursor-pointer"
                          >
                            {item.title}
                          </button>
                          
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#6B7280]">
                            <span>{item.publishedDate}</span>
                            <span>•</span>
                            <span className="capitalize">{item.type}</span>
                            {hasValidLink && (
                              <>
                                <span>•</span>
                                <a
                                  href={item.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#5B5CE2] font-medium transition"
                                >
                                  <span>Open link</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#111827] whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Eye className="h-3 w-3 text-[#9CA3AF] hidden sm:inline" />
                        <span>{item.viewsFormatted}</span>
                      </div>
                    </td>

                    {/* Likes */}
                    <td className="py-3.5 px-3 text-right font-mono text-[#4B5563] whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Heart className="h-3 w-3 text-[#DC2626]/70 hidden sm:inline" />
                        <span>{item.likesFormatted}</span>
                      </div>
                    </td>

                    {/* Comments */}
                    <td className="py-3.5 px-3 text-right font-mono text-[#4B5563] whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <MessageCircle className="h-3 w-3 text-[#5B5CE2]/70 hidden sm:inline" />
                        <span>{item.commentsFormatted}</span>
                      </div>
                    </td>

                    {/* Engagement Rate Badge */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                          item.engagementRate >= 6.0
                            ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                            : item.engagementRate >= 3.5
                            ? "bg-[#EEF2FF] text-[#5B5CE2] border border-[#E0E7FF]"
                            : "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                        }`}
                      >
                        {item.engagementRate}%
                      </span>
                    </td>

                    {/* Quick Interactive Actions Column */}
                    <td className="py-3.5 pr-1 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1. View / Watch Video Button */}
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#111827] border border-[#E5E7EB] text-xs font-medium transition cursor-pointer shadow-xs"
                          title="View video & playback preview"
                        >
                          <Play className="h-3 w-3 fill-[#6B7280] text-[#6B7280]" />
                          <span className="hidden sm:inline">
                            {item.type === "video" ? "Watch" : "View"}
                          </span>
                        </button>

                        {/* 2. Analyse Video Performance Button */}
                        <button
                          type="button"
                          onClick={() => handleTriggerAnalyze(item)}
                          disabled={isItemAnalyzing}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs cursor-pointer bg-[#EEF2FF] hover:bg-[#5B5CE2] text-[#5B5CE2] hover:text-white border-[#E0E7FF]"
                          title="Analyze retention, reach, and comparative performance"
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                          <span>{isItemAnalyzing ? "Loading..." : "Analyse"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Playback & Performance Analysis Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-[#EEF2FF] text-[#5B5CE2] flex items-center justify-center shrink-0">
                  <Play className="h-4 w-4 fill-[#5B5CE2]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#111827] truncate">
                    {previewItem.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <span>{previewItem.publishedDate}</span>
                    <span>•</span>
                    <span>{previewItem.viewsFormatted} views</span>
                    {previewItem.durationOrLength && (
                      <>
                        <span>•</span>
                        <span>{previewItem.durationOrLength}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player or Media Embed */}
            <div className="relative bg-black w-full aspect-video flex items-center justify-center overflow-hidden">
              {previewYtId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${previewYtId}?autoplay=1&rel=0`}
                  title={previewItem.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : previewItem.thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewItem.thumbnailUrl}
                    alt={previewItem.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6">
                    <h4 className="text-lg font-bold text-white mb-2">
                      {previewItem.title}
                    </h4>
                    <p className="text-xs text-[#E5E7EB] line-clamp-2">
                      External post on {platform.toUpperCase()}. You can analyze its engagement trajectory or open the original post directly.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-[#6B7280]">
                  <Tv className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium text-[#111827]">{previewItem.title}</p>
                </div>
              )}
            </div>

            {/* Modal Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 p-4 bg-[#F8FAFC] border-t border-b border-[#E5E7EB] text-center">
              <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280] uppercase">Views</div>
                <div className="text-sm font-bold text-[#111827] mt-0.5">{previewItem.viewsFormatted}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280] uppercase">Likes</div>
                <div className="text-sm font-bold text-[#111827] mt-0.5">{previewItem.likesFormatted}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280] uppercase">Comments</div>
                <div className="text-sm font-bold text-[#111827] mt-0.5">{previewItem.commentsFormatted}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280] uppercase">Eng. Rate</div>
                <div className="text-sm font-bold text-[#059669] mt-0.5">{previewItem.engagementRate}%</div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white">
              <div className="text-xs text-[#6B7280] text-center sm:text-left">
                Want to see retention curve, traffic breakdown, and channel benchmark?
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {previewItem.videoUrl && (
                  <a
                    href={previewItem.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#111827] border border-[#E5E7EB] text-xs font-semibold transition cursor-pointer"
                  >
                    <span>Open on {platform === "youtube" ? "YouTube" : platform === "instagram" ? "Instagram" : "X"}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleTriggerAnalyze(previewItem);
                    setPreviewItem(null);
                  }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#5B5CE2] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analyse Video Performance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

