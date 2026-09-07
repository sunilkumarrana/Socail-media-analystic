import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EngagementBreakdown, Platform } from "../types";
import { formatNumber } from "../utils/mockGenerator";
import { Heart, MessageCircle, Share2, PieChart as PieIcon } from "lucide-react";

interface EngagementDonutProps {
  engagement: EngagementBreakdown;
  platform: Platform;
}

export const EngagementDonut: React.FC<EngagementDonutProps> = ({
  engagement,
  platform,
}) => {
  const shareLabel =
    platform === "youtube"
      ? "Shares & Saves"
      : platform === "x"
      ? "Reposts & Quotes"
      : "Shares & Bookmarks";

  const data = [
    { name: "Likes", value: engagement.likes, color: "#ec4899", icon: Heart },
    { name: "Comments", value: engagement.comments, color: "#6366f1", icon: MessageCircle },
    { name: shareLabel, value: engagement.shares, color: "#10b981", icon: Share2 },
  ];

  return (
    <div
      id="engagement-breakdown-card"
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm sm:p-6 flex flex-col justify-between"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Engagement Ratio</h2>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20">
              Breakdown
            </span>
          </div>
          <PieIcon className="h-4 w-4 text-slate-500" />
        </div>
        <p className="text-xs text-slate-400">
          Distribution of user responses across content interactions
        </p>
      </div>

      {/* Donut Chart with Center Stat */}
      <div className="relative my-4 flex h-48 w-full items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0];
                  return (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/95 p-2.5 shadow-xl text-xs backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: entry.payload.color }}
                        />
                        <span className="text-slate-300 font-medium">
                          {entry.name}:
                        </span>
                        <span className="font-mono font-bold text-white">
                          {entry.value}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={78}
              paddingAngle={4}
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut hole */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-extrabold text-white">
            {formatNumber(engagement.rawTotalEngagement)}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Total Eng.
          </span>
        </div>
      </div>

      {/* Legend Rows */}
      <div className="space-y-2 border-t border-slate-800/80 pt-3">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-100">
                  {item.value}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
