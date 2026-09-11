import React, { useState, useEffect, useMemo } from "react";
import {
  DashboardDataset,
  HighDemandContentData,
  HighDemandOpportunity,
  QuickDesignPayload,
} from "../types";
import {
  NICHE_PRESETS,
  PODCAST_DEMAND_DATA,
  CODING_DEMAND_DATA,
} from "../data/highDemandPresets";
import {
  Sparkles,
  TrendingUp,
  Flame,
  Star,
  Copy,
  Check,
  CheckSquare,
  Square,
  Video,
  Layers,
  Search,
  Award,
  Lightbulb,
  PlaySquare,
  Filter,
  Tag,
  RefreshCw,
  ExternalLink,
  Target,
  ArrowRight,
  Zap,
  Radio,
  Mic,
  Code2,
  TrendingDown,
  ArrowUpRight,
  Palette,
} from "lucide-react";

interface HighDemandContentSectionProps {
  dataset: DashboardDataset;
  title?: string;
  subtitle?: string;
  onTriggerQuickDesign?: (payload: QuickDesignPayload) => void;
}

export const HighDemandContentSection: React.FC<HighDemandContentSectionProps> = ({
  dataset,
  title = "High-Demand Content Opportunities & Viewer Rating Intelligence",
  subtitle = "Pinpointing exactly what content your audience rates highest and is actively demanding in this field, so you can produce videos guaranteed to resonate.",
  onTriggerQuickDesign,
}) => {
  const [demandData, setDemandData] = useState<HighDemandContentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [plannedTopics, setPlannedTopics] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"opportunities" | "formats" | "queries">("opportunities");
  const [selectedNiche, setSelectedNiche] = useState<string>("auto");

  const channelName = dataset.profile.displayName;
  const handle = dataset.profile.handle;
  const platform = dataset.profile.platform;

  // Auto-detect channel niche from bio, name, category, top content titles and keywords
  const autoDetectedNiche = useMemo(() => {
    const name = (dataset.profile.displayName || "").toLowerCase();
    const h = (dataset.profile.handle || "").toLowerCase();
    const bio = (dataset.profile.bio || "").toLowerCase();
    const cat = (dataset.profile.category || "").toLowerCase();
    const desc = (dataset.profile.description || "").toLowerCase();
    const titles = (dataset.topContent || []).map((t) => t.title.toLowerCase()).join(" ");
    const text = `${name} ${h} ${bio} ${cat} ${desc} ${titles}`;

    if (
      /podcast|pod\b|interview|talk show|conversation|huberman|rogan|fridman|dialogue|episode|ep \d|guest|host|audio show|broadcasting|roundtable/i.test(
        text
      )
    ) {
      return "podcast";
    }
    if (/code|programm|develop|python|javascript|react|web|software|css|html|dev|ai|tech|frontend|backend/i.test(text)) {
      return "coding";
    }
    if (/crypto|bitcoin|invest|money|finance|stock|trading|wealth|budget|economy/i.test(text)) {
      return "finance";
    }
    if (/game|gaming|play|esport|minecraft|gta|fortnite|roblox|walkthrough|streamer|twitch/i.test(text)) {
      return "gaming";
    }
    if (/fitness|workout|gym|health|diet|muscle|cardio|training|bodybuilding/i.test(text)) {
      return "fitness";
    }
    return "podcast"; // Default to podcast if ambiguous or conversational
  }, [dataset]);

  const effectiveNiche = selectedNiche === "auto" ? autoDetectedNiche : selectedNiche;

  const fetchDemandIntelligence = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/high-demand-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelName,
          handle,
          platform,
          description: dataset.profile.description || `${channelName} YouTube Channel`,
          topContent: dataset.topContent || [],
          keywords: dataset.profile.keywords || [],
          targetNiche: effectiveNiche,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setDemandData(json.data);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch high demand content via API, using fallback preset:", err);
    }

    // Use domain-specific preset for the active niche
    const preset = NICHE_PRESETS[effectiveNiche] || PODCAST_DEMAND_DATA;
    setDemandData(preset);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDemandIntelligence();
  }, [effectiveNiche, channelName, handle]);

  const handleCopyTitle = (titleToCopy: string) => {
    navigator.clipboard.writeText(titleToCopy);
    setCopiedTitle(titleToCopy);
    setTimeout(() => setCopiedTitle(null), 2500);
  };

  const handleCopyCompletePlan = () => {
    if (!demandData) return;
    const planText = [
      `🚀 HIGH-DEMAND YOUTUBE CONTENT ROADMAP FOR ${channelName.toUpperCase()}`,
      `Niche: ${demandData.detectedNiche}`,
      `Overall Demand Score: ${demandData.overallDemandScore}/100 (${demandData.demandVelocity})`,
      `Viewer Satisfaction Benchmark: ${demandData.viewerSatisfactionBenchmark}`,
      `------------------------------------------------------------------------`,
      `\nHIGHEST-RATED FORMATS IN THIS FIELD:`,
      ...demandData.highestRatedFormats.map(
        (f) => `• ${f.formatName} (${f.userRatingPercent}% Rating, ${f.avgViewerRetention} Avg Retention)\n  Why: ${f.whyItPerforms}`
      ),
      `\nHIGH-DEMAND VIDEO OPPORTUNITIES TO PRODUCE:`,
      ...demandData.opportunities.map((opp, idx) => [
        `\n[${idx + 1}] TOPIC: ${opp.topic}`,
        `    Category: ${opp.nicheCategory} | Demand: ${opp.demandLevel} (${opp.demandScore}/100)`,
        `    Viewer Rating: ${opp.userRatingLevel}`,
        `    Why Demand Is High: ${opp.whyDemandIsHigh}`,
        `    Recommended Format: ${opp.recommendedFormat}`,
        `    Suggested High-CTR Titles:`,
        ...opp.suggestedTitles.map((t) => `      - "${t}"`),
        `    Thumbnail Visual: ${opp.thumbnailConcept}`,
        `    Target Keywords: ${opp.targetKeywords.join(", ")}`,
        `    Production Effort: ${opp.productionDifficulty}`,
        `    Projected Impact: ${opp.projectedViewerImpact}`,
      ].join("\n")),
      `\n------------------------------------------------------------------------`,
      `PRODUCTION ACTION PLAN:`,
      ...demandData.productionActionPlan.map((step, idx) => `${idx + 1}. ${step}`),
      `------------------------------------------------------------------------`,
    ].join("\n");

    navigator.clipboard.writeText(planText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 3000);
  };

  const togglePlanned = (id: string) => {
    setPlannedTopics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allOpportunities = demandData?.opportunities || [];
  const categories = ["All", ...Array.from(new Set(allOpportunities.map((o) => o.demandLevel)))];
  const filteredOpportunities =
    selectedFilter === "All"
      ? allOpportunities
      : allOpportunities.filter((o) => o.demandLevel === selectedFilter);

  return (
    <div
      id="high-demand-content-analytics-section"
      className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs relative overflow-hidden transition"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-[#E5E7EB] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EEF2FF] text-[#5B5CE2]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Audience Demand &amp; Rating Intelligence
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-[#111827] tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={fetchDemandIntelligence}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] border border-[#E5E7EB] text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh audience demand telemetry"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCompletePlan}
            disabled={isLoading || !demandData}
            className="px-3 py-1.5 rounded-lg bg-[#5B5CE2] hover:bg-[#4F46E5] text-white text-xs font-medium transition flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            title="Copy complete high-demand video briefing to clipboard"
          >
            {copiedPlan ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Copied Roadmap!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Video Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Field & Medium Selector Bar */}
      <div className="my-4 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EEF2FF] text-[#5B5CE2]">
            <Radio className="h-3 w-3" />
          </span>
          <span className="text-xs font-medium text-[#374151]">
            Channel Content Field:
          </span>
          <span className="text-[11px] text-[#6B7280] hidden sm:inline">
            (Filtered to content topics strictly in that domain)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            {
              id: "auto",
              label: `Auto (${autoDetectedNiche === "podcast" ? "Podcast" : autoDetectedNiche === "coding" ? "Tech" : autoDetectedNiche})`,
              title: "Automatically detected from channel bio, titles, and tags",
            },
            {
              id: "podcast",
              label: "Podcast & Talk",
              title: "Show only podcast episodes, guest interviews, and talk show topics",
            },
            {
              id: "coding",
              label: "Tech & Software",
              title: "Show only programming, software engineering, and developer topics",
            },
            {
              id: "finance",
              label: "Finance & Markets",
              title: "Show only wealth, market, and business topics",
            },
            {
              id: "gaming",
              label: "Gaming & Esports",
              title: "Show only gaming, challenges, and walkthrough topics",
            },
            {
              id: "fitness",
              label: "Fitness & Health",
              title: "Show only workout, nutrition, and wellness topics",
            },
          ].map((niche) => {
            const isActive = selectedNiche === niche.id;
            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => setSelectedNiche(niche.id)}
                title={niche.title}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#5B5CE2] text-white shadow-xs"
                    : "bg-white text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] border border-[#E5E7EB]"
                }`}
              >
                <span>{niche.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {effectiveNiche === "podcast" && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-between text-xs text-[#374151] relative z-10">
          <div className="flex items-center gap-2">
            <Mic className="h-3.5 w-3.5 text-[#5B5CE2] shrink-0" />
            <span>
              <strong>Podcast Mode:</strong> Longform conversation topics, 1-on-1 guest interview angles, high-tension debates, and episodic hooks.
            </span>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#5B5CE2] bg-white px-2 py-0.5 rounded border border-[#E0E7FF]">
            Filtered
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="py-14 flex flex-col items-center justify-center text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5B5CE2] border-t-transparent mb-3" />
          <p className="text-xs font-medium text-[#111827]">
            Analyzing audience demand velocity for {channelName}...
          </p>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Evaluating highest-rated video formats, search volume gaps, and viewer satisfaction indices.
          </p>
        </div>
      ) : !demandData ? (
        <div className="py-10 text-center text-[#6B7280] text-xs">
          No demand intelligence data currently available. Click Refresh to regenerate.
        </div>
      ) : (
        <div className="mt-5 space-y-6 relative z-10">
          {/* Niche Summary & Telemetry Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="md:col-span-6">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                Identified Field &amp; Niche
              </span>
              <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-[#5B5CE2]" />
                {demandData.detectedNiche}
              </h3>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                {demandData.nicheDescription}
              </p>
            </div>

            <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-[#E5E7EB] pt-3 md:pt-0 md:pl-4">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                Niche Demand Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#111827] font-mono">
                  {demandData.overallDemandScore}/100
                </span>
                <span className="text-[10px] font-medium text-[#059669]">
                  {demandData.demandVelocity}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                <div
                  style={{ width: `${demandData.overallDemandScore}%` }}
                  className="h-full bg-[#5B5CE2] rounded-full"
                />
              </div>
            </div>

            <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-[#E5E7EB] pt-3 md:pt-0 md:pl-4">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                Viewer Satisfaction Benchmark
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-[#111827] font-semibold text-xs font-mono">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{demandData.viewerSatisfactionBenchmark}</span>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1">
                High retention benchmark when focused on practical utility.
              </p>
            </div>
          </div>

          {/* Sub-Tabs: 1. Video Opportunities (Main), 2. Highest-Rated Formats, 3. Trending Viewer Queries */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-1 rounded-xl bg-[#F3F4F6] p-1 border border-[#E5E7EB] text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("opportunities")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === "opportunities"
                    ? "bg-white text-[#111827] shadow-xs font-semibold"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <PlaySquare className="h-3.5 w-3.5" />
                <span>High-Demand Topics ({demandData.opportunities.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("formats")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === "formats"
                    ? "bg-white text-[#111827] shadow-xs font-semibold"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Highest-Rated Formats</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("queries")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === "queries"
                    ? "bg-white text-[#111827] shadow-xs font-semibold"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>Trending Searches</span>
              </button>
            </div>

            {/* Category Filter when in opportunities tab */}
            {activeTab === "opportunities" && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#6B7280] flex items-center gap-1 text-[11px]">
                  <Filter className="h-3 w-3" /> Tier:
                </span>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                        selectedFilter === cat
                          ? "bg-[#5B5CE2] text-white shadow-xs"
                          : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: High-Demand Video Opportunities */}
          {activeTab === "opportunities" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredOpportunities.map((opp, index) => {
                  const isPlanned = Boolean(plannedTopics[opp.id]);
                  return (
                    <div
                      key={opp.id}
                      className={`rounded-2xl border transition-all p-5 relative overflow-hidden ${
                        isPlanned
                          ? "border-[#5B5CE2] bg-[#EEF2FF]/40"
                          : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#D1D5DB]"
                      } shadow-xs`}
                    >
                      {/* Top Bar of Opportunity */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white border border-[#E5E7EB] text-[#4B5563] text-[11px] font-bold">
                            #{index + 1}
                          </span>
                          <span className="text-xs font-semibold text-[#111827] tracking-wide">
                            {opp.topic}
                          </span>
                          <span className="text-[10px] font-medium text-[#4B5563] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                            {opp.nicheCategory}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-[#E5E7EB] bg-white text-[#374151] flex items-center gap-1 font-mono">
                            {opp.demandLevel} • {opp.demandScore}/100
                          </span>

                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-[#374151] border border-[#E5E7EB] flex items-center gap-1 font-mono">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            {opp.userRatingLevel}
                          </span>

                          <button
                            type="button"
                            onClick={() => togglePlanned(opp.id)}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition cursor-pointer ${
                              isPlanned
                                ? "bg-[#5B5CE2] text-white shadow-xs"
                                : "bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]"
                            }`}
                            title="Mark as planned to film"
                          >
                            {isPlanned ? (
                              <>
                                <CheckSquare className="h-3 w-3" />
                                <span>Planned</span>
                              </>
                            ) : (
                              <>
                                <Square className="h-3 w-3" />
                                <span>Plan Video</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Opportunity Body */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 text-xs">
                        {/* Left: Why Demand is High & Format */}
                        <div className="lg:col-span-7 space-y-3">
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280] block mb-1">
                              Audience Demand &amp; Rating Context
                            </span>
                            <p className="text-[#374151] leading-relaxed text-xs bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                              {opp.whyDemandIsHigh}
                            </p>
                          </div>

                          {/* Recommended Format & Production Effort */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#374151]">
                            <div className="rounded-xl bg-white p-2.5 border border-[#E5E7EB]">
                              <span className="text-[10px] font-medium text-[#6B7280] block mb-0.5">
                                Recommended Format
                              </span>
                              <span className="font-medium text-[#111827] text-xs block">
                                {opp.recommendedFormat}
                              </span>
                            </div>

                            <div className="rounded-xl bg-white p-2.5 border border-[#E5E7EB]">
                              <span className="text-[10px] font-medium text-[#6B7280] block mb-0.5">
                                Production Complexity
                              </span>
                              <span className="font-medium text-[#374151] text-xs block">
                                {opp.productionDifficulty}
                              </span>
                            </div>
                          </div>

                          {/* Projected Impact */}
                          <div className="flex items-start gap-2 text-[11px] text-[#374151] bg-white px-3 py-2 rounded-xl border border-[#E5E7EB]">
                            <TrendingUp className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#059669]" />
                            <span>
                              <strong>Expected Impact:</strong> {opp.projectedViewerImpact}
                            </span>
                          </div>
                        </div>

                        {/* Right: Suggested Titles & Thumbnail Concept */}
                        <div className="lg:col-span-5 space-y-3">
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280] block mb-1">
                              High-CTR Video Titles (Click to Copy)
                            </span>
                            <div className="space-y-1.5">
                              {opp.suggestedTitles.map((st, sIdx) => {
                                const isCopied = copiedTitle === st;
                                return (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    onClick={() => handleCopyTitle(st)}
                                    className="w-full text-left p-2 rounded-lg bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] transition group cursor-pointer flex items-center justify-between gap-2"
                                    title="Click to copy title"
                                  >
                                    <span className="text-[#374151] text-xs group-hover:text-[#111827] line-clamp-1 font-medium">
                                      "{st}"
                                    </span>
                                    <span className="shrink-0 text-[#9CA3AF] group-hover:text-[#4B5563]">
                                      {isCopied ? (
                                        <Check className="h-3.5 w-3.5 text-[#059669]" />
                                      ) : (
                                        <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                                      )}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Thumbnail Concept with Adobe Express Quick Design CTA */}
                          <div className="rounded-xl bg-white p-2.5 border border-[#E5E7EB] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-medium text-[#6B7280]">
                                Thumbnail Packaging
                              </span>
                              {onTriggerQuickDesign && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onTriggerQuickDesign({
                                      headline: opp.suggestedTitles[0] || opp.topic,
                                      subtitle: opp.thumbnailConcept || opp.whyDemandIsHigh,
                                      badgeText: `${opp.demandScore}/100 High Demand`,
                                      category: "youtube-thumbnail",
                                      theme: "varsity-blue",
                                      creatorHandle: dataset.profile.handle,
                                    })
                                  }
                                  className="flex items-center gap-1 text-[11px] font-medium text-[#5B5CE2] hover:text-[#4F46E5] transition cursor-pointer"
                                  title="Design this thumbnail concept in Adobe Express"
                                >
                                  <Palette className="h-3 w-3 text-[#5B5CE2]" />
                                  <span>Create in Adobe Express</span>
                                  <ArrowUpRight className="h-2.5 w-2.5 text-[#9CA3AF]" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-[#4B5563] italic">
                              {opp.thumbnailConcept}
                            </p>
                          </div>

                          {/* Keywords */}
                          <div>
                            <span className="text-[10px] font-medium text-[#6B7280] block mb-1 flex items-center gap-1">
                              <Tag className="h-2.5 w-2.5" /> Target Algorithmic Keywords:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {opp.targetKeywords.map((kw, kwIdx) => (
                                <span
                                  key={kwIdx}
                                  className="text-[10px] font-mono bg-white text-[#6B7280] px-1.5 py-0.5 rounded border border-[#E5E7EB]"
                                >
                                  #{kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Creator Production Roadmap Box */}
              {demandData.productionActionPlan && demandData.productionActionPlan.length > 0 && (
                <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-[#5B5CE2]" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
                      Recommended 3-Step Production Checklist
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {demandData.productionActionPlan.map((step, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-white p-3 border border-[#E5E7EB] text-[#374151]"
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#EEF2FF] text-[#5B5CE2] font-bold text-[10px] mr-1.5 font-mono">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Highest-Rated Formats in This Field */}
          {activeTab === "formats" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demandData.highestRatedFormats.map((fmt, fIdx) => (
                <div
                  key={fIdx}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                    <h4 className="text-xs font-semibold text-[#111827] flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-[#5B5CE2]" />
                      {fmt.formatName}
                    </h4>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-[#059669] border border-[#A7F3D0] font-mono">
                      {fmt.userRatingPercent}% Rating
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#6B7280]">
                    <span>Average Viewer Retention:</span>
                    <span className="font-semibold text-[#111827] font-mono">
                      {fmt.avgViewerRetention}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-[#374151] bg-white p-2.5 rounded-lg border border-[#E5E7EB] leading-relaxed">
                    <span className="text-[10px] font-medium text-[#6B7280] block mb-0.5">
                      Why Audiences Rate It So High:
                    </span>
                    {fmt.whyItPerforms}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Trending Viewer Search Queries */}
          {activeTab === "queries" && (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-[#5B5CE2]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
                  Exact Queries Viewers Are Searching For in this Field
                </h4>
              </div>
              <p className="text-xs text-[#6B7280] mb-4">
                These are the most frequent high-intent keywords and problem statements searched by viewers right now. Addressing these questions directly in your video titles and intros will trigger YouTube search shelves.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demandData.trendingViewerQueries.map((query, qIdx) => (
                  <div
                    key={qIdx}
                    className="flex items-start justify-between gap-2 p-3 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#374151]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#9CA3AF] font-medium font-mono text-[11px]">
                        #{qIdx + 1}
                      </span>
                      <span className="text-[#111827]">"{query}"</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyTitle(query)}
                      className="text-[#9CA3AF] hover:text-[#111827] shrink-0 p-1 cursor-pointer"
                      title="Copy search query"
                    >
                      {copiedTitle === query ? (
                        <Check className="h-3 w-3 text-[#059669]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
