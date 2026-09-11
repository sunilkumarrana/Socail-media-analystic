import React from "react";
import {
  BarChart2,
  RefreshCw,
  Clock,
  ExternalLink,
  GitCompare,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  GraduationCap,
  Palette,
} from "lucide-react";

interface NavbarProps {
  activeTab: "dashboard" | "studio" | "compare" | "student-creator";
  setActiveTab: (tab: "dashboard" | "studio" | "compare" | "student-creator") => void;
  onOpenConnectModal: () => void;
  onOpenQuickDesign: () => void;
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
  onOpenQuickDesign,
  lastUpdated,
  isAutoRefreshEnabled,
  setIsAutoRefreshEnabled,
  onManualRefresh,
  isRefreshing,
  isRealtimeVerified,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5 select-none">
            <span className="text-lg font-bold tracking-tight text-[#111827]">
              Social<span className="text-[#5B5CE2]">Pulse</span>
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] sm:inline-block">
              Analytics
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] p-1 overflow-x-auto max-w-[55%] sm:max-w-none">
          <button
            id="nav-dashboard-tab"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-[#5B5CE2] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-white/70"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>
          
          <button
            id="nav-studio-tab"
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "studio"
                ? "bg-[#5B5CE2] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-white/70"
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Channel Analytics</span>
          </button>

          <button
            id="nav-compare-tab"
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "compare"
                ? "bg-[#5B5CE2] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-white/70"
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare</span>
          </button>

          {/* Student Creator Module Tab */}
          <button
            id="nav-student-creator-tab"
            onClick={() => setActiveTab("student-creator")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "student-creator"
                ? "bg-[#5B5CE2] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-white/70"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-[#059669]" />
            <span>Student Creator</span>
            <span
              className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                activeTab === "student-creator"
                  ? "bg-white/20 text-white"
                  : "bg-[#10B981]/15 text-[#059669]"
              }`}
            >
              Campus
            </span>
          </button>
        </nav>

        {/* Right Actions: Quick Design CTA, Status, & Connect Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Design with Adobe Express CTA */}
          <button
            id="btn-nav-quick-design"
            onClick={onOpenQuickDesign}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#D1D5DB] transition shadow-xs cursor-pointer"
            title="Create visual graphics with Adobe Express"
          >
            <Palette className="h-3.5 w-3.5 text-[#5B5CE2]" />
            <span className="hidden sm:inline">Quick Design</span>
          </button>

          {/* Single Synced Status Indicator */}
          <div
            id="nav-sync-status"
            className="hidden md:flex items-center gap-2 text-xs text-[#4B5563]"
            title="Real-time synchronized data"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669] shrink-0" />
              <span className="text-[11px] font-medium text-[#4B5563]">
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
              className="rounded p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin text-[#5B5CE2]" : ""}`} />
            </button>
          </div>

          {/* Subdued Secondary Connect CTA */}
          <button
            id="btn-connect-account-nav"
            onClick={onOpenConnectModal}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#D1D5DB] shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#6B7280]" />
            <span className="hidden lg:inline">Connect Account</span>
            <span className="lg:hidden">Connect</span>
          </button>
        </div>
      </div>
    </header>
  );
};
