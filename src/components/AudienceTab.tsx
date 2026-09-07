import React, { useState } from "react";
import { StudioAnalytics, Platform } from "../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  Users,
  Clock,
  Globe,
  Compass,
  UserCheck,
  UserPlus,
  Radio,
  Sparkles,
  Calendar,
} from "lucide-react";

interface AudienceTabProps {
  studio: StudioAnalytics;
  platform?: Platform;
  period?: "7d" | "28d" | "90d";
  onPeriodChange?: (period: "7d" | "28d" | "90d") => void;
}

const GENDER_COLORS = ["#38bdf8", "#ec4899", "#a855f7"];
const GEO_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e", "#f59e0b"];

export const AudienceTab: React.FC<AudienceTabProps> = ({
  studio,
  period = "28d",
}) => {
  const { audience } = studio;

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Gender chart data
  const genderData = [
    { name: "Male", value: audience.ageGender.gender.male, color: GENDER_COLORS[0] },
    { name: "Female", value: audience.ageGender.gender.female, color: GENDER_COLORS[1] },
    {
      name: "User-specified",
      value: audience.ageGender.gender.userSpecified,
      color: GENDER_COLORS[2],
    },
  ];

  // Age group chart data
  const ageChartData = audience.ageGender.ageGroups.map((group) => ({
    bracket: group.bracket,
    percentage: group.percentage,
  }));

  // Top geographies chart data
  const geoChartData = audience.topGeographies.map((geo, idx) => ({
    country: geo.country,
    code: geo.code,
    percentage: geo.percentage,
    fill: GEO_COLORS[idx % GEO_COLORS.length],
  }));

  // Returning vs New Viewers timeline simulation
  const retentionTimelineData = [
    { week: "Week 1", returning: 42, newViewers: 58 },
    { week: "Week 2", returning: 46, newViewers: 54 },
    { week: "Week 3", returning: 48, newViewers: 52 },
    { week: "Week 4", returning: 53, newViewers: 47 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Audience Headline KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Returning Viewers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Returning Viewers</span>
            </span>
            <span className="inline-flex rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
              Loyal Core
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {audience.returningViewersFormatted}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Viewers who watched and returned
          </div>
        </div>

        {/* Card 2: New Viewers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-emerald-400" />
              <span>New Viewers</span>
            </span>
            <span className="inline-flex rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              Discovery
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {audience.newViewersFormatted}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            First-time viewers discovering channel
          </div>
        </div>

        {/* Card 3: Subscribed vs Not Subscribed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-rose-400" />
              <span>Watch Time from Subs</span>
            </span>
            <span className="inline-flex rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
              Split
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {audience.subscribedRatio}% / {(100 - audience.subscribedRatio).toFixed(1)}%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Subscribed vs Non-Subscribed
          </div>
        </div>

        {/* Card 4: Peak Activity Window */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-purple-400" />
              <span>Peak Viewer Activity</span>
            </span>
            <span className="inline-flex rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/20">
              Prime Time
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            6 PM – 11 PM
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Recommended upload window (Thu–Sun)
          </div>
        </div>
      </div>

      {/* 2. Demographic Charts Grid (Age Distribution BarChart + Gender Donut) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart 1: Age Distribution BarChart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-400" />
                <span>Viewer Age Distribution Chart</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of active viewers segmented by official age brackets
              </p>
            </div>
            <span className="text-xs text-sky-400 font-semibold bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
              Primary: 18–34 years ({(ageChartData[1]?.percentage + ageChartData[2]?.percentage).toFixed(1)}%)
            </span>
          </div>

          {/* Recharts BarChart for Age Distribution */}
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="ageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="bracket" stroke="#64748b" fontSize={11} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  unit="%"
                  domain={[0, 50]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#fff",
                  }}
                  formatter={(val: any) => [`${val}% of audience`, "Share"]}
                />
                <Bar dataKey="percentage" fill="url(#ageGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Gender Demographics Donut/Pie Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-pink-400" />
              <span>Gender Demographics</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Identified viewer composition
            </p>

            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`gender-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "0.75rem",
                      fontSize: "0.75rem",
                      color: "#fff",
                    }}
                    formatter={(val: any) => [`${val}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">Male</span>
                <span className="text-lg font-bold text-white">
                  {audience.ageGender.gender.male}%
                </span>
              </div>
            </div>
          </div>

          {/* Gender Legend List */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {genderData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="text-white font-mono font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Top Geographies Recharts Chart & Returning Viewers Trajectory */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Geographies BarChart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>Top Geographies by Viewership</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">% of Total Views</span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={geoChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis
                  type="number"
                  unit="%"
                  domain={[0, 45]}
                  stroke="#64748b"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  stroke="#94a3b8"
                  fontSize={11}
                  width={110}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#fff",
                  }}
                  formatter={(val: any) => [`${val}% of views`, "View Share"]}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {geoChartData.map((entry, index) => (
                    <Cell key={`geo-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Returning vs New Viewers Retention Trajectory AreaChart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-400" />
                <span>Returning vs New Viewers Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Balancing repeat viewer loyalty with new audience discovery
              </p>
            </div>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={retentionTimelineData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#fff",
                  }}
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === "returning" ? "Returning Viewers" : "New Viewers",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="returning"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  name="returning"
                />
                <Area
                  type="monotone"
                  dataKey="newViewers"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  name="newViewers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-300">Returning Viewers ({audience.returningViewersFormatted})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">New Viewers ({audience.newViewersFormatted})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. When Your Viewers Are on YouTube (Studio Heatmap Matrix) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span>When Your Viewers Are on YouTube (7-Day Heat Matrix)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Heat intensity indicates relative volume of viewers active on YouTube in their local time zones
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 self-start sm:self-auto">
            <span>Few Viewers</span>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-slate-800" />
              <div className="h-3 w-3 rounded bg-purple-900/60" />
              <div className="h-3 w-3 rounded bg-purple-600/80" />
              <div className="h-3 w-3 rounded bg-purple-400" />
            </div>
            <span>Many Viewers</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hours Header */}
            <div className="grid grid-cols-25 gap-1 text-[10px] text-slate-500 pb-1.5 border-b border-slate-800">
              <div className="col-span-1">Day</div>
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="text-center font-mono">
                  {h % 3 === 0 ? (h === 0 ? "12a" : h === 12 ? "12p" : `${h > 12 ? h - 12 : h}${h >= 12 ? "p" : "a"}`) : ""}
                </div>
              ))}
            </div>

            {/* Day Rows */}
            <div className="space-y-1.5 pt-2">
              {daysOfWeek.map((day, dIdx) => (
                <div key={day} className="grid grid-cols-25 gap-1 items-center">
                  <div className="col-span-1 text-[11px] text-slate-400 font-medium">
                    {day}
                  </div>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const intensity = audience.activeHoursHeatmap[dIdx]?.[h] ?? 1;
                    const bgClass =
                      intensity === 0
                        ? "bg-slate-900 border border-slate-800/80"
                        : intensity === 1
                        ? "bg-purple-950/70 border border-purple-900/40"
                        : intensity === 2
                        ? "bg-purple-700/80 border border-purple-600/50"
                        : "bg-purple-400 border border-purple-300 shadow-sm";
                    return (
                      <div
                        key={h}
                        title={`${day} at ${h}:00 - Activity Level ${intensity} (Peak: ${intensity === 3 ? "Prime" : "Regular"})`}
                        className={`h-5 rounded-[4px] transition-all hover:scale-110 cursor-pointer ${bgClass}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subscribed vs Non-Subscribed Watch Time & Top Subtitle Languages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Watch time split */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-rose-400" />
            <span>Watch Time from Subscribers vs Non-Subscribers</span>
          </h3>
          <p className="text-xs text-slate-400">
            A large non-subscribed share indicates high viral discovery through algorithmic recommendations.
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Not Subscribed</span>
              <span className="text-white font-mono font-bold">
                {(100 - audience.subscribedRatio).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${100 - audience.subscribedRatio}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Subscribed</span>
              <span className="text-white font-mono font-bold">
                {audience.subscribedRatio}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${audience.subscribedRatio}%` }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Subtitle / CC Languages */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Top Subtitle &amp; Closed Caption Languages</span>
          </h3>
          <p className="text-xs text-slate-400">
            Languages used most frequently by international audiences
          </p>

          <div className="divide-y divide-slate-800/80">
            {audience.topSubtitles.map((sub, i) => (
              <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <span className="text-slate-200">{sub.language}</span>
                <span className="text-slate-400 font-mono font-semibold">{sub.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
