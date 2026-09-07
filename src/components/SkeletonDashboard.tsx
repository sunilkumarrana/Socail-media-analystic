import React from "react";

export const SkeletonDashboard: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Profile Header Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-800" />
          <div className="flex-1 space-y-2.5">
            <div className="h-6 w-48 rounded bg-slate-800" />
            <div className="h-4 w-32 rounded bg-slate-800/80" />
            <div className="h-4 w-3/4 rounded bg-slate-800/60" />
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-slate-800" />
              <div className="h-6 w-6 rounded bg-slate-800" />
            </div>
            <div className="h-8 w-28 rounded bg-slate-800" />
            <div className="h-3 w-16 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* AI Insight Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <div className="h-5 w-48 rounded bg-slate-800" />
        <div className="h-16 rounded-xl bg-slate-950/60" />
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 h-80" />
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 h-80" />
      </div>
    </div>
  );
};
