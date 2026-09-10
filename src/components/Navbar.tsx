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
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-white">
                Social<span className="text-indigo-400">Pulse</span>
              </span>
              <span className="ml-1.5 hidden text-[10px] font-medium tracking-wide text-slate-400 sm:inline-block">
                Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center rounded-lg border border-slate-800/80 bg-slate-900/50 p-1">
          <button
            id="nav-dashboard-tab"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
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
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
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
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "compare"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare</span>
          </button>
        </nav>

        {/* Right Actions: Single Synced Status Indicator & Secondary CTA */}
        <div className="flex items-center gap-3">
          {/* Rule 1: The ONE single, small status indicator on the entire dashboard */}
          <div
            id="nav-sync-status"
            className="flex items-center gap-2 text-xs text-slate-400"
            title="Real-time synchronized data"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 shrink-0" />
              <span className="text-[11px] font-medium text-slate-300">
                {lastUpdated?.includes("Refreshed at")
                  ? `Synced ${lastUpdated.replace("Refreshed at ", "")}`
                  : lastUpdated === "Live from YouTube" || lastUpdated === "Just now" || !lastUpdated
                  ? "Synced just now"
                  : `Synced ${lastUpdated}`}
              </span>
            </div>

            <button
              id="btn-manual-refresh"
              onClick={onManualRefresh}
              disabled={isRefreshing}
              title="Refresh sync"
              className="rounded p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>

          {/* Subdued Secondary Connect CTA - not competing with page actions */}
          <button
            id="btn-connect-account-nav"
            onClick={onOpenConnectModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Connect Account</span>
            <span className="sm:hidden">Connect</span>
          </button>
        </div>
      </div>
    </header>
  );
};
