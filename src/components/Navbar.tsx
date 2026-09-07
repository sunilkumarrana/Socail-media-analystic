import React from "react";
import {
  Activity,
  RefreshCw,
  Clock,
  ExternalLink,
  GitCompare,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  activeTab: "dashboard" | "studio" | "compare";
  setActiveTab: (tab: "dashboard" | "studio" | "compare") => void;
  onOpenConnectModal: () => void;
  lastUpdated: string;
  isAutoRefreshEnabled: boolean;
  setIsAutoRefreshEnabled: (val: boolean) => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  isRealtimeVerified?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConnectModal,
  lastUpdated,
  isAutoRefreshEnabled,
  setIsAutoRefreshEnabled,
  onManualRefresh,
  isRefreshing,
  isRealtimeVerified,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                Social<span className="text-indigo-400">Pulse</span>
              </span>
              <span className="ml-1.5 hidden text-[10px] font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 uppercase sm:inline-block">
                Analytics
              </span>
            </div>
          </div>

          {/* Real-time vs Static Verified Indicator */}
          <div
            id="provenance-navbar-badge"
            className="group relative flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
            title="Real-time live data for YouTube channels + advanced channel analytics."
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Real-Time Sync Active</span>
            <span className="sm:hidden">Live Sync</span>
            
            {/* Tooltip on hover */}
            <div className="pointer-events-none absolute left-0 top-full mt-2 hidden w-72 rounded-xl border border-slate-800 bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-300 shadow-xl group-hover:block z-50">
              <div className="font-semibold text-white mb-1">Dual Data Engine:</div>
              <div>• <strong className="text-emerald-400">Real-Time Data:</strong> YouTube subscribers, uploads, channel identity, avatar &amp; recent videos are fetched live.</div>
              <div className="mt-1">• <strong className="text-indigo-400">Performance Analytics:</strong> Impressions CTR, retention curves, and demographics calculated for creator intelligence.</div>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center rounded-lg border border-slate-800 bg-slate-900/60 p-1">
          <button
            id="nav-dashboard-tab"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>
          
          <button
            id="nav-studio-tab"
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "studio"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Channel Analytics</span>
          </button>

          <button
            id="nav-compare-tab"
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "compare"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare</span>
          </button>
        </nav>

        {/* Right Actions & Live Refresh Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh indicators */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/40 px-2.5 py-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  isAutoRefreshEnabled ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                }`}
              />
              <span className="text-[11px] text-slate-300">{lastUpdated}</span>
            </div>

            <button
              id="btn-manual-refresh"
              onClick={onManualRefresh}
              disabled={isRefreshing}
              title="Trigger simulated nudge update"
              className="ml-1 rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            <button
              id="btn-auto-refresh-toggle"
              onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
              title={isAutoRefreshEnabled ? "Auto-refresh active (30s)" : "Enable auto-refresh"}
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
                isAutoRefreshEnabled
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              {isAutoRefreshEnabled ? "Auto ON" : "Auto OFF"}
            </button>
          </div>

          {/* Connect Account CTA */}
          <button
            id="btn-connect-account-nav"
            onClick={onOpenConnectModal}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20 hover:border-indigo-500/50"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Connect Account</span>
            <span className="sm:hidden">Connect</span>
          </button>
        </div>
      </div>
    </header>
  );
};
