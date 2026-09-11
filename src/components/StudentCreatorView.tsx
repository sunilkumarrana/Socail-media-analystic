import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  BookOpen,
  DollarSign,
  Palette,
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  Calendar,
  Building,
  Coffee,
  Bookmark,
  Award,
  Layers,
  HelpCircle,
  BarChart3,
  Lightbulb,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { StudentCreatorData, CampusTermCycle, QuickDesignPayload } from "../types";
import { UNIVERSITY_PRESETS, generateStudentCreatorDataset } from "../data/studentCreatorPresets";

interface StudentCreatorViewProps {
  currentHandle?: string;
  currentPlatform?: string;
  onTriggerQuickDesign: (payload: QuickDesignPayload) => void;
}

export const StudentCreatorView: React.FC<StudentCreatorViewProps> = ({
  currentHandle = "@creator",
  currentPlatform = "YouTube",
  onTriggerQuickDesign,
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("UCLA");
  const [selectedSeason, setSelectedSeason] = useState<string>("midterms");
  const [selectedMajor, setSelectedMajor] = useState<string>("All Majors");
  const [dataset, setDataset] = useState<StudentCreatorData>(() =>
    generateStudentCreatorDataset("UCLA", "midterms", "All Majors")
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<string>("Collegiate Demographics & Cadence Engine");

  // Fetch or regenerate data when university or term season changes
  const fetchCampusAnalytics = async (uni: string, season: string, major: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/student-creator-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: uni,
          termSeason: season,
          majorFocus: major,
          handle: currentHandle,
          platform: currentPlatform,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setDataset(json.data);
          setDataSource(json.modelName || "Gemini Campus Intelligence");
          return;
        }
      }
      // Local fallback
      setDataset(generateStudentCreatorDataset(uni, season, major));
      setDataSource("Collegiate Demographics & Cadence Engine");
    } catch {
      setDataset(generateStudentCreatorDataset(uni, season, major));
      setDataSource("Collegiate Demographics & Cadence Engine");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampusAnalytics(selectedUniversity, selectedSeason, selectedMajor);
  }, [selectedUniversity, selectedSeason, selectedMajor, currentHandle, currentPlatform]);

  const activePreset =
    UNIVERSITY_PRESETS.find((u) => u.name === selectedUniversity) || UNIVERSITY_PRESETS[0];

  return (
    <div id="student-creator-analytics-view" className="space-y-6">
      {/* Top Banner & University Configurator */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-gradient-to-r from-[#F0FDF4] via-white to-[#EEF2FF] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5B5CE2] text-white shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                Student Creator & Campus Influencer Intelligence
              </h2>
              <span className="rounded-full bg-[#10B981]/10 border border-[#10B981]/20 px-2.5 py-0.5 text-xs font-semibold text-[#059669] flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Live Campus Signals
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Track exam-season viewership spikes, dorm lifestyle virality, Greek/quad peak hours, and high-value campus brand rate cards.
            </p>
          </div>

          {/* Quick Design CTA in Header */}
          <div className="flex items-center gap-3">
            <button
              id="btn-header-quick-design"
              onClick={() =>
                onTriggerQuickDesign({
                  headline: `HOW I SURVIVED ${selectedSeason.toUpperCase()} AT ${activePreset.name.split(" ")[0]} 📚`,
                  subtitle: `Brutally honest study routine, dorm desk setup & exam survival strategy`,
                  badgeText: "3.4X RETENTION • CAMPUS EDITION",
                  category: "youtube-thumbnail",
                  theme: "varsity-blue",
                  creatorHandle: currentHandle,
                })
              }
              className="flex items-center gap-2 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000]/15 border border-[#FF0000]/30 px-3.5 py-2 text-xs font-bold text-[#E5252A] transition cursor-pointer"
              title="Design visual content in Adobe Express"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FF0000] text-white text-[9px] font-black">
                Ex
              </span>
              <span>Quick Design with Adobe Express</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Selectors Bar */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* University Selector */}
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-[#5B5CE2]" /> Target University
            </label>
            <select
              id="select-university"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-xs focus:border-[#5B5CE2] focus:outline-none focus:ring-1 focus:ring-[#5B5CE2] cursor-pointer"
            >
              {UNIVERSITY_PRESETS.map((uni) => (
                <option key={uni.name} value={uni.name}>
                  {uni.shortName} ({uni.location})
                </option>
              ))}
            </select>
          </div>

          {/* Academic Term Season */}
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#059669]" /> Academic Term Cycle
            </label>
            <select
              id="select-term-season"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-xs focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669] cursor-pointer"
            >
              <option value="welcome">Welcome Week & Fall Orientation Rush</option>
              <option value="midterms">Midterms Crunch & Project Deadlines</option>
              <option value="finals">Finals Week Sprint & Exam Marathon</option>
              <option value="spring-break">Spring Break & Social Recaps</option>
              <option value="summer">Summer Internships & Research</option>
            </select>
          </div>

          {/* Major Focus */}
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#D97706]" /> Field of Study Filter
            </label>
            <select
              id="select-major-focus"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-xs focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer"
            >
              <option value="All Majors">All University Majors</option>
              <option value="STEM & Computer Science">STEM & Computer Science</option>
              <option value="Business, Finance & Econ">Business, Finance & Econ</option>
              <option value="Pre-Med & Healthcare">Pre-Med & Healthcare</option>
              <option value="Media, Film & Arts">Media, Film & Arts</option>
              <option value="Humanities & Law">Humanities & Law</option>
            </select>
          </div>
        </div>

        {/* Active Engine Badge */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Analyzing {activePreset.name} student body • {dataset.campusEnrollment}</span>
          </div>
          <span className="font-mono text-[10px] text-[#9CA3AF]">Engine: {dataSource}</span>
        </div>
      </div>

      {/* Collegiate Influence KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Campus Reach Index */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-medium">Campus Reach Score</span>
            <div className="h-7 w-7 rounded-lg bg-[#5B5CE2]/10 flex items-center justify-center text-[#5B5CE2]">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#111827]">{dataset.campusReachScore}</span>
            <span className="text-xs font-semibold text-[#10B981]">/ 100</span>
          </div>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Estimated ~38% penetration among active {activePreset.shortName} undergraduates
          </p>
        </div>

        {/* Metric 2: Peer Trust Index */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-medium">Collegiate Peer Affinity</span>
            <div className="h-7 w-7 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#059669]">95.2%</span>
            <span className="text-xs font-semibold text-[#059669]">+14% vs Retail</span>
          </div>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Peer recommendations yield 2.8x higher organic comment sentiment
          </p>
        </div>

        {/* Metric 3: Academic Cycle Velocity */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-medium">Term Viewership Multiplier</span>
            <div className="h-7 w-7 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#111827]">
              {dataset.academicCycle.viewershipVelocityMultiplier}x
            </span>
            <span className="text-xs font-semibold text-[#F59E0B]">
              {selectedSeason === "finals" ? "Peak Surge" : "Active Flow"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            High demand for {dataset.academicCycle.studyContentAppetite.toLowerCase()} focus study & routine sessions
          </p>
        </div>

        {/* Metric 4: Campus Brand Rate Card */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-medium">Collegiate Rate Card Tier</span>
            <div className="h-7 w-7 rounded-lg bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#111827]">$550 - $1.4K</span>
          </div>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Celsius, Notion, & Unidays typical campus ambassador valuation
          </p>
        </div>
      </div>

      {/* Academic Cycle Rhythm & Strategic Recommendation */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#5B5CE2]/10 flex items-center justify-center text-[#5B5CE2]">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">{dataset.academicCycle.termName}</h3>
              <p className="text-xs text-[#6B7280]">Academic calendar rhythm & content consumption dynamics</p>
            </div>
          </div>
          <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-bold text-[#5B5CE2] border border-[#E0E7FF]">
            Cadence: {dataset.academicCycle.recommendedPostingCadence}
          </span>
        </div>

        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-xs sm:text-sm text-[#334155] leading-relaxed">
          <span className="font-bold text-[#111827] block mb-1">Strategic Seasonal Finding:</span>
          {dataset.academicCycle.keyInsight}
        </div>

        {/* Appetite Comparison Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#F1F5F9]">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#5B5CE2]" />
              <span className="text-xs font-medium text-[#4B5563]">Study & Productivity Appetite:</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#5B5CE2]">
              {dataset.academicCycle.studyContentAppetite}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-[#F59E0B]" />
              <span className="text-xs font-medium text-[#4B5563]">Campus Social & Lifestyle Appetite:</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#B45309]">
              {dataset.academicCycle.lifestyleContentAppetite}
            </span>
          </div>
        </div>
      </div>

      {/* Campus Hourly Peak Activity Hotspots (Heatmap & Graph) */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Campus Hourly Peak Activity & Watch Windows</h3>
              <p className="text-xs text-[#6B7280]">
                When {activePreset.name} students are active on social feeds vs in lecture halls
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#059669] flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> Late Night Peak (10:30 PM - 2:00 AM)
          </span>
        </div>

        {/* Activity Bars */}
        <div className="space-y-3">
          {dataset.campusPeakHours.map((slot, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111827] w-36">{slot.timeSlot}</span>
                  <span className="text-[#6B7280] hidden sm:inline">• {slot.note}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#111827]">{slot.activityLevel}%</span>
                  <span className="text-[11px] text-[#9CA3AF]">activity</span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="h-3 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    slot.activityLevel > 85
                      ? "bg-gradient-to-r from-[#5B5CE2] to-[#8B5CF6]"
                      : slot.activityLevel > 60
                      ? "bg-[#059669]"
                      : "bg-[#94A3B8]"
                  }`}
                  style={{ width: `${slot.activityLevel}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Video Format Performance & Playbook with Quick Design */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Top Campus Video Formats & Retention Benchmarks</h3>
              <p className="text-xs text-[#6B7280]">
                Virality scores, audience retention, and 1-click Adobe Express thumbnail creation
              </p>
            </div>
          </div>
          <span className="text-xs text-[#6B7280]">Sorted by Collegiate Virality Index</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataset.topCampusFormats.map((fmt, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E5E7EB] bg-white hover:border-[#5B5CE2]/50 p-4 shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#111827] leading-snug">{fmt.formatName}</h4>
                  <span className="rounded bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#5B5CE2] whitespace-nowrap">
                    Score: {fmt.collegiateViralityScore}
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#F8FAFC]">
                    <span className="text-[10px] text-[#6B7280] block">Avg Retention</span>
                    <span className="font-extrabold text-[#111827]">{fmt.avgRetentionPercent}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FAFC]">
                    <span className="text-[10px] text-[#6B7280] block">Engagement</span>
                    <span className="font-extrabold text-[#059669]">{fmt.engagementRate}%</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-[#4B5563] space-y-1">
                  <p>
                    <span className="font-semibold text-[#111827]">Best Window:</span> {fmt.bestPostingWindow}
                  </p>
                  <p className="italic text-[#6B7280] text-[11px] bg-[#F1F5F9] p-2 rounded-md">
                    "{fmt.sampleTitle}"
                  </p>
                  <p className="text-[11px] text-[#475569]">{fmt.recommendationNote}</p>
                </div>
              </div>

              {/* Quick Design CTA */}
              <button
                id={`btn-design-format-${idx}`}
                onClick={() =>
                  onTriggerQuickDesign({
                    headline: fmt.sampleTitle,
                    subtitle: `${fmt.formatName} • Best upload window: ${fmt.bestPostingWindow}`,
                    badgeText: `${fmt.avgRetentionPercent}% Retention • ${activePreset.shortName}`,
                    category: "youtube-thumbnail",
                    theme: idx % 2 === 0 ? "varsity-blue" : "academic-minimal",
                    creatorHandle: currentHandle,
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] hover:border-[#D1D5DB] text-[#374151] py-2 px-3 text-xs font-semibold transition cursor-pointer shadow-xs"
                title="Design visual asset in Adobe Express"
              >
                <Palette className="h-3.5 w-3.5 text-[#5B5CE2]" />
                <span>Create in Adobe Express</span>
                <ArrowUpRight className="h-3 w-3 text-[#9CA3AF]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort & Majors Demographics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Breakdown */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#5B5CE2]/10 flex items-center justify-center text-[#5B5CE2]">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#111827]">Student Class Standing Distribution</h3>
            </div>
            <span className="text-xs text-[#6B7280]">Audience Cohorts</span>
          </div>

          <div className="space-y-3">
            {dataset.cohortBreakdown.map((cohort, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111827]">{cohort.standing}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#5B5CE2]">{cohort.percentage}%</span>
                    <span className="text-[10px] bg-[#EEF2FF] text-[#5B5CE2] px-1.5 py-0.5 rounded font-mono">
                      Idx: {cohort.retentionIndex}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5B5CE2]"
                    style={{ width: `${cohort.percentage * 2}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cohort.primaryInterests.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded bg-white border border-[#CBD5E1] px-2 py-0.5 text-[10px] text-[#475569]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Majors & Housing Breakdown */}
        <div className="space-y-6">
          {/* Field of Study */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669]">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#111827]">Top Fields of Study</h3>
              </div>
              <span className="text-xs text-[#6B7280]">Engagement %</span>
            </div>

            <div className="space-y-2.5">
              {dataset.majorsDistribution.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#059669]" />
                    <span className="font-medium text-[#111827]">{m.field}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#6B7280]">{m.percentage}% audience</span>
                    <span className="font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">
                      {m.avgEngagementRate}% ER
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Housing Distribution */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
              <Building className="h-4 w-4 text-[#D97706]" /> Campus Living & Housing Dynamics
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {dataset.housingBreakdown.map((h, hIdx) => (
                <div key={hIdx} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#6B7280] block truncate">{h.type}</span>
                  <span className="text-base font-extrabold text-[#111827]">{h.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campus Brand Partnerships & Rate Cards */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899]">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Collegiate Brand Deal & Sponsor Opportunities</h3>
              <p className="text-xs text-[#6B7280]">
                Verified campus-tier ambassador compensation benchmarks & pitching angles
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#059669]">High Peer Conversion</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataset.brandPartnerships.map((brand, bIdx) => (
            <div
              key={bIdx}
              className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">{brand.brandName}</span>
                  <span className="text-[10px] rounded bg-[#FDF2F8] text-[#DB2777] font-semibold px-2 py-0.5">
                    {brand.category}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-xs">
                  <p className="font-extrabold text-[#059669]">{brand.typicalCompensationTier}</p>
                  <p className="text-[11px] text-[#4B5563]">
                    <span className="font-semibold">Conversion:</span> {brand.avgStudentConversionRate}
                  </p>
                  <p className="text-[11px] text-[#6B7280] bg-[#F8FAFC] p-2 rounded-md mt-1 leading-snug">
                    <span className="font-semibold text-[#374151]">Angle:</span> {brand.idealContentAngle}
                  </p>
                </div>
              </div>

              {/* Pitch Visual in Adobe Express */}
              <button
                onClick={() =>
                  onTriggerQuickDesign({
                    headline: `${brand.brandName.split("/")[0].trim().toUpperCase()} × ${currentHandle.toUpperCase()}`,
                    subtitle: `Collegiate Partnership Pitch • ${activePreset.name} Campus Ambassador Campaign`,
                    badgeText: `CAMPUS COLLAB • ${brand.avgStudentConversionRate.split(" ")[0]} CONV`,
                    category: "stat-card",
                    theme: "sunset-glow",
                    creatorHandle: currentHandle,
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] py-1.5 px-2.5 text-xs font-semibold transition cursor-pointer"
              >
                <Palette className="h-3 w-3 text-[#5B5CE2]" />
                <span>Design Pitch in Adobe</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rising Collegiate Trends Radar */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Rising Campus Viral Topics & Hashtags</h3>
              <p className="text-xs text-[#6B7280]">
                High-growth trends capturing collegiate feeds this week
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#EF4444] font-bold">Algorithms Favoring</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataset.risingCampusTrends.map((trend) => (
            <div
              key={trend.id}
              className="p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#5B5CE2]/40 shadow-xs transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#111827]">{trend.topic}</h4>
                  <span className="rounded bg-[#FEF2F2] text-[#DC2626] font-extrabold text-xs px-2 py-0.5 whitespace-nowrap">
                    {trend.viralityVelocity}
                  </span>
                </div>

                <div className="mt-1 text-xs text-[#5B5CE2] font-semibold">{trend.hashtag}</div>

                <p className="mt-2 text-xs text-[#4B5563] bg-[#F8FAFC] p-2.5 rounded-lg leading-relaxed">
                  <span className="font-semibold text-[#111827]">Recommended Hook:</span> {trend.suggestedAngle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold">{trend.bestPlatform}</span>

                <button
                  onClick={() =>
                    onTriggerQuickDesign({
                      headline: trend.topic,
                      subtitle: trend.suggestedAngle,
                      badgeText: `${trend.viralityVelocity} Velocity • ${trend.hashtag.split(" ")[0]}`,
                      category: "instagram-story",
                      theme: "varsity-blue",
                      creatorHandle: currentHandle,
                    })
                  }
                  className="flex items-center gap-1 text-xs font-medium text-[#5B5CE2] hover:text-[#4F46E5] cursor-pointer"
                >
                  <Palette className="h-3 w-3 text-[#5B5CE2]" />
                  <span>Create in Adobe Express</span>
                  <ArrowUpRight className="h-2.5 w-2.5 text-[#9CA3AF]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Strategic Campus Briefing Card */}
      <div className="rounded-2xl border border-[#E0E7FF] bg-gradient-to-r from-[#EEF2FF] via-white to-[#F5F3FF] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#5B5CE2] flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">AI Campus Strategic Briefing</h3>
          </div>
          <span className="text-xs font-semibold text-[#5B5CE2]">Executive Synthesis</span>
        </div>

        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
          {dataset.aiCampusStrategicBriefing}
        </p>

        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#6B7280]">
            Configured for <strong className="text-[#111827]">{currentHandle}</strong> at{" "}
            <strong className="text-[#111827]">{activePreset.name}</strong> ({selectedSeason.toUpperCase()})
          </span>

          <button
            onClick={() => fetchCampusAnalytics(selectedUniversity, selectedSeason, selectedMajor)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B5CE2] text-white font-semibold hover:bg-[#4B4CD0] transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isLoading ? "Analyzing..." : "Re-Analyze Campus Signals"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
