import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  ExternalLink,
  Download,
  Copy,
  Check,
  Palette,
  Image as ImageIcon,
  Wand2,
  Sliders,
  Type,
  GraduationCap,
  Scissors,
  Maximize2,
  FileText,
} from "lucide-react";
import { QuickDesignPayload } from "../types";

interface QuickDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPayload?: Partial<QuickDesignPayload>;
  defaultCreatorHandle?: string;
}

type DesignCategory =
  | "youtube-thumbnail"
  | "instagram-story"
  | "instagram-post"
  | "carousel-slide"
  | "stat-card";

type DesignTheme =
  | "varsity-blue"
  | "campus-crimson"
  | "academic-minimal"
  | "sunset-glow"
  | "dark-studio";

const CATEGORY_CONFIG: Record<
  DesignCategory,
  {
    label: string;
    ratio: string;
    dimensions: string;
    width: number;
    height: number;
    adobeCategory: string;
    aspectRatio: string;
  }
> = {
  "youtube-thumbnail": {
    label: "YouTube Thumbnail",
    ratio: "16:9",
    dimensions: "1280 × 720",
    width: 1280,
    height: 720,
    adobeCategory: "youtube-thumbnail",
    aspectRatio: "16/9",
  },
  "instagram-story": {
    label: "Story & Reel",
    ratio: "9:16",
    dimensions: "1080 × 1920",
    width: 1080,
    height: 1920,
    adobeCategory: "instagram-story",
    aspectRatio: "9/16",
  },
  "instagram-post": {
    label: "Square Post",
    ratio: "1:1",
    dimensions: "1080 × 1080",
    width: 1080,
    height: 1080,
    adobeCategory: "instagram-post",
    aspectRatio: "1/1",
  },
  "carousel-slide": {
    label: "Carousel Portrait",
    ratio: "4:5",
    dimensions: "1080 × 1350",
    width: 1080,
    height: 1350,
    adobeCategory: "instagram-post",
    aspectRatio: "4/5",
  },
  "stat-card": {
    label: "Wide Stat Card",
    ratio: "1.91:1",
    dimensions: "1200 × 630",
    width: 1200,
    height: 630,
    adobeCategory: "banner",
    aspectRatio: "1.91/1",
  },
};

const THEME_PALETTES: Record<
  DesignTheme,
  {
    name: string;
    bgGradient: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    border: string;
  }
> = {
  "varsity-blue": {
    name: "Collegiate Navy",
    bgGradient: "from-[#0A192F] via-[#0F284E] to-[#172A46]",
    cardBg: "#0B192C",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    accent: "#38BDF8",
    badgeBg: "#0284C7",
    badgeText: "#FFFFFF",
    border: "#1E3A8A",
  },
  "campus-crimson": {
    name: "Deep Crimson",
    bgGradient: "from-[#1A0B0E] via-[#330F15] to-[#4A151D]",
    cardBg: "#220D12",
    textPrimary: "#FFF1F2",
    textSecondary: "#FDA4AF",
    accent: "#F43F5E",
    badgeBg: "#E11D48",
    badgeText: "#FFFFFF",
    border: "#881337",
  },
  "academic-minimal": {
    name: "Minimal Light",
    bgGradient: "from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]",
    cardBg: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    accent: "#4F46E5",
    badgeBg: "#EEF2FF",
    badgeText: "#4338CA",
    border: "#CBD5E1",
  },
  "sunset-glow": {
    name: "Sunset Warm",
    bgGradient: "from-[#1E112A] via-[#311338] to-[#4C1D42]",
    cardBg: "#210F27",
    textPrimary: "#FFF7ED",
    textSecondary: "#FDBA74",
    accent: "#FB923C",
    badgeBg: "#EA580C",
    badgeText: "#FFFFFF",
    border: "#7C2D12",
  },
  "dark-studio": {
    name: "Dark Slate",
    bgGradient: "from-[#09090B] via-[#121216] to-[#18181B]",
    cardBg: "#121215",
    textPrimary: "#F4F4F5",
    textSecondary: "#A1A1AA",
    accent: "#8B5CF6",
    badgeBg: "#6D28D9",
    badgeText: "#EDE9FE",
    border: "#27272A",
  },
};

export const QuickDesignModal: React.FC<QuickDesignModalProps> = ({
  isOpen,
  onClose,
  initialPayload,
  defaultCreatorHandle = "@creator",
}) => {
  const [category, setCategory] = useState<DesignCategory>(
    (initialPayload?.category as DesignCategory) || "youtube-thumbnail"
  );
  const [theme, setTheme] = useState<DesignTheme>(
    (initialPayload?.theme as DesignTheme) || "varsity-blue"
  );
  const [headline, setHeadline] = useState<string>(
    initialPayload?.headline || "How I Survived Finals Week"
  );
  const [subtitle, setSubtitle] = useState<string>(
    initialPayload?.subtitle || "Honest College Routine, Study Strategies & Real Retention Takeaways"
  );
  const [badgeText, setBadgeText] = useState<string>(
    initialPayload?.badgeText || "High Retention Strategy"
  );
  const [showCreatorTag, setShowCreatorTag] = useState<boolean>(true);
  const [creatorHandle, setCreatorHandle] = useState<string>(
    initialPayload?.creatorHandle || defaultCreatorHandle
  );
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync when initialPayload changes
  useEffect(() => {
    if (initialPayload?.headline) setHeadline(initialPayload.headline);
    if (initialPayload?.subtitle) setSubtitle(initialPayload.subtitle);
    if (initialPayload?.badgeText) setBadgeText(initialPayload.badgeText);
    if (initialPayload?.category) setCategory(initialPayload.category as DesignCategory);
    if (initialPayload?.theme) {
      if (initialPayload.theme in THEME_PALETTES) {
        setTheme(initialPayload.theme as DesignTheme);
      }
    }
    if (initialPayload?.creatorHandle) setCreatorHandle(initialPayload.creatorHandle);
  }, [initialPayload]);

  if (!isOpen) return null;

  const currentTheme = THEME_PALETTES[theme] || THEME_PALETTES["varsity-blue"];
  const currentCategory = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["youtube-thumbnail"];

  // Adobe Express Deep Link URL
  const buildAdobeExpressUrl = () => {
    const searchTerms = encodeURIComponent(`${headline} ${currentCategory.adobeCategory}`);
    return `https://new.express.adobe.com/new?category=${currentCategory.adobeCategory}&search=${searchTerms}`;
  };

  const handleLaunchAdobeExpress = () => {
    window.open(buildAdobeExpressUrl(), "_blank", "noopener,noreferrer");
  };

  const handleOpenQuickAction = (tool: "remove-background" | "resize-image" | "convert-to-png") => {
    const urls: Record<string, string> = {
      "remove-background": "https://new.express.adobe.com/tools/remove-background",
      "resize-image": "https://new.express.adobe.com/tools/resize-image",
      "convert-to-png": "https://new.express.adobe.com/tools/convert-to-png",
    };
    window.open(urls[tool] || "https://new.express.adobe.com/", "_blank", "noopener,noreferrer");
  };

  const fireflyPrompt = `Clean collegiate desk aesthetic, natural ambient warm lighting, open notebook, modern laptop, tasteful minimal composition, high-end editorial photography`;

  const copyToClipboard = (text: string, typeKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(typeKey);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Download high-resolution PNG using HTML5 canvas rendering
  const handleDownloadRender = () => {
    const canvas = document.createElement("canvas");
    canvas.width = currentCategory.width;
    canvas.height = currentCategory.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background
    const isLight = theme === "academic-minimal";
    ctx.fillStyle = isLight ? "#F8FAFC" : "#0A192F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (isLight) {
      grad.addColorStop(0, "#FFFFFF");
      grad.addColorStop(1, "#E2E8F0");
    } else {
      grad.addColorStop(0, currentTheme.cardBg);
      grad.addColorStop(1, "#040D1A");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Badge
    if (badgeText) {
      ctx.fillStyle = currentTheme.badgeBg;
      const badgeW = Math.min(380, ctx.measureText(badgeText).width + 60);
      const badgeH = 44;
      const badgeX = canvas.width - badgeW - 50;
      const badgeY = 50;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
      ctx.fill();

      ctx.fillStyle = currentTheme.badgeText;
      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + 29);
    }

    // Draw Headline Text
    ctx.fillStyle = isLight ? "#0F172A" : "#F8FAFC";
    ctx.font = "bold 58px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "left";

    const words = headline.split(" ");
    let line = "";
    let y = canvas.height * 0.44;
    const maxWidth = canvas.width * 0.74;
    const lineHeight = 72;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 70, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 70, y);

    // Subtitle
    ctx.fillStyle = isLight ? "#475569" : "#94A3B8";
    ctx.font = "500 28px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(subtitle, 70, y + 54);

    // Creator Tag
    if (showCreatorTag) {
      ctx.fillStyle = currentTheme.accent;
      ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`${creatorHandle} • Designed for Adobe Express`, 70, canvas.height - 60);
    }

    // Trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `social-graphic-${category}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      id="quick-design-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Clean Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E5E7EB] text-[#5B5CE2] shadow-xs">
              <Palette className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                  Design with Adobe Express
                </h3>
                <span className="rounded-md bg-white border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-medium text-[#4B5563]">
                  Quick Studio
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Generate graphic templates from your performance insights and customize them directly in Adobe Express.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827] transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Artboard Canvas Preview */}
          <div className="lg:col-span-7 bg-[#0F172A] p-5 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 min-h-[360px]">
            {/* Aspect Ratio Meta Header */}
            <div className="w-full flex items-center justify-between text-xs text-[#94A3B8] mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{currentCategory.label}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-white/80">
                  {currentCategory.dimensions}
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8]">
                Interactive Preview
              </span>
            </div>

            {/* The Visual Artboard */}
            <div
              ref={canvasRef}
              className={`w-full max-w-[460px] rounded-xl overflow-hidden shadow-2xl relative border flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br transition-all duration-300 select-none ${currentTheme.bgGradient}`}
              style={{
                borderColor: currentTheme.border,
                aspectRatio: currentCategory.aspectRatio,
              }}
            >
              {/* Subtle ambient lighting */}
              <div className="absolute inset-0 bg-radial from-white/5 to-transparent pointer-events-none" />

              {/* Top Row: Category tag & Metric badge */}
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div
                  className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase opacity-85"
                  style={{ color: currentTheme.textSecondary }}
                >
                  <GraduationCap className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>Channel Insight</span>
                </div>

                {badgeText && (
                  <div
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-normal shadow-xs whitespace-nowrap"
                    style={{
                      backgroundColor: currentTheme.badgeBg,
                      color: currentTheme.badgeText,
                    }}
                  >
                    {badgeText}
                  </div>
                )}
              </div>

              {/* Center: Headline & Subtitle */}
              <div className="relative z-10 my-auto py-4">
                <h4
                  className="font-bold tracking-tight leading-[1.2] text-lg sm:text-xl md:text-2xl"
                  style={{ color: currentTheme.textPrimary }}
                >
                  {headline}
                </h4>

                {subtitle && (
                  <p
                    className="mt-2.5 text-xs sm:text-sm font-normal leading-relaxed line-clamp-3 opacity-90"
                    style={{ color: currentTheme.textSecondary }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Bottom Row: Creator Attribution & Template Info */}
              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-[11px]">
                {showCreatorTag ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/15 border border-white/30 flex items-center justify-center font-semibold text-[10px] text-white">
                      {creatorHandle.replace("@", "").slice(0, 2).toUpperCase() || "CR"}
                    </div>
                    <span className="font-medium" style={{ color: currentTheme.textPrimary }}>
                      {creatorHandle}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-1 text-[10px] text-white/70">
                  <span>Adobe Express Template</span>
                </div>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                id="btn-download-quick-design-png"
                onClick={handleDownloadRender}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition cursor-pointer"
                title="Download this preview graphic as PNG"
              >
                <Download className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span>Download PNG</span>
              </button>

              <button
                id="btn-copy-firefly-prompt"
                onClick={() => copyToClipboard(fireflyPrompt, "firefly")}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition cursor-pointer"
                title="Copy recommended Firefly text prompt"
              >
                {copiedType === "firefly" ? (
                  <Check className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5 text-[#F59E0B]" />
                )}
                <span>{copiedType === "firefly" ? "Copied Prompt!" : "Copy Firefly Prompt"}</span>
              </button>

              <button
                id="btn-copy-asset-specs"
                onClick={() =>
                  copyToClipboard(
                    `Design Brief:\nTitle: ${headline}\nSubtitle: ${subtitle}\nBadge: ${badgeText}\nFormat: ${currentCategory.label} (${currentCategory.dimensions})`,
                    "specs"
                  )
                }
                className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition cursor-pointer"
                title="Copy text brief"
              >
                {copiedType === "specs" ? (
                  <Check className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-[#94A3B8]" />
                )}
                <span>{copiedType === "specs" ? "Copied Text!" : "Copy Text"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Refined Controls & Adobe Express Launch */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-white flex flex-col justify-between space-y-5 overflow-y-auto">
            <div className="space-y-4">
              {/* Refined Adobe Express Launcher Card */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FA0F00] text-white text-[10px] font-black">
                      Ex
                    </span>
                    <span className="text-xs font-bold text-[#111827]">Adobe Express</span>
                  </div>
                  <span className="text-[10px] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-md text-[#4B5563] font-medium">
                    Web App
                  </span>
                </div>
                <p className="text-xs text-[#4B5563] mb-3 leading-relaxed">
                  Open this design in Adobe Express with thousands of fonts, brand colors, generative AI tools, and full layer editing.
                </p>

                <button
                  id="btn-open-in-adobe-express"
                  onClick={handleLaunchAdobeExpress}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FA0F00] hover:bg-[#D60D00] text-white py-2.5 px-4 font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer"
                >
                  <span>Edit in Adobe Express</span>
                  <ExternalLink className="h-4 w-4" />
                </button>

                {/* Quick Action Tools in Adobe Express */}
                <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#4B5563]">
                  <span className="font-medium text-[#111827]">Quick Tools:</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleOpenQuickAction("remove-background")}
                      className="hover:text-[#FA0F00] transition cursor-pointer flex items-center gap-1"
                    >
                      <Scissors className="h-3 w-3" />
                      <span>Cutout BG</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleOpenQuickAction("resize-image")}
                      className="hover:text-[#FA0F00] transition cursor-pointer flex items-center gap-1"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span>Auto Resize</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleOpenQuickAction("convert-to-png")}
                      className="hover:text-[#FA0F00] transition cursor-pointer flex items-center gap-1"
                    >
                      <ImageIcon className="h-3 w-3" />
                      <span>Convert PNG</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Format Dimension Selector */}
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-2">
                  Canvas Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CATEGORY_CONFIG) as DesignCategory[]).map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    const isActive = category === cat;
                    return (
                      <button
                        key={cat}
                        id={`btn-cat-${cat}`}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                          isActive
                            ? "border-[#5B5CE2] bg-[#EEF2FF] text-[#4338CA] shadow-xs"
                            : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB]"
                        }`}
                      >
                        <span className="text-xs font-semibold whitespace-nowrap">{cfg.label}</span>
                        <span className="text-[11px] text-[#6B7280] mt-0.5">{cfg.dimensions}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(THEME_PALETTES) as DesignTheme[]).map((t) => {
                    const pal = THEME_PALETTES[t];
                    const isActive = theme === t;
                    return (
                      <button
                        key={t}
                        id={`btn-theme-${t}`}
                        onClick={() => setTheme(t)}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex items-center gap-2 ${
                          isActive
                            ? "border-[#5B5CE2] bg-[#EEF2FF] text-[#4338CA] font-semibold shadow-xs"
                            : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB]"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: pal.accent }}
                        />
                        <span className="text-xs whitespace-nowrap">{pal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Field Customization */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#374151]">Headline / Hook</label>
                    <span className="text-[10px] text-[#9CA3AF]">{headline.length} chars</span>
                  </div>
                  <input
                    id="input-headline"
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full rounded-xl border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] focus:border-[#5B5CE2] focus:outline-none focus:ring-1 focus:ring-[#5B5CE2]"
                    placeholder="Enter graphic title"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#374151] block mb-1">
                    Context / Subtitle
                  </label>
                  <input
                    id="input-subtitle"
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] focus:border-[#5B5CE2] focus:outline-none focus:ring-1 focus:ring-[#5B5CE2]"
                    placeholder="Supporting details or routine"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#374151] block mb-1">
                    Metric Callout Badge
                  </label>
                  <input
                    id="input-badge"
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full rounded-xl border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] focus:border-[#5B5CE2] focus:outline-none focus:ring-1 focus:ring-[#5B5CE2]"
                    placeholder="e.g. High Retention Strategy"
                  />
                </div>
              </div>

              {/* Creator Handle Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <input
                    id="toggle-creator-tag"
                    type="checkbox"
                    checked={showCreatorTag}
                    onChange={(e) => setShowCreatorTag(e.target.checked)}
                    className="h-4 w-4 rounded text-[#5B5CE2] focus:ring-[#5B5CE2] border-[#D1D5DB] cursor-pointer"
                  />
                  <label htmlFor="toggle-creator-tag" className="text-xs text-[#374151] font-medium cursor-pointer">
                    Show Creator Attribution
                  </label>
                </div>

                {showCreatorTag && (
                  <input
                    type="text"
                    value={creatorHandle}
                    onChange={(e) => setCreatorHandle(e.target.value)}
                    className="rounded-lg border border-[#D1D5DB] px-2.5 py-1 text-xs text-[#374151] w-32 focus:border-[#5B5CE2] focus:outline-none"
                    placeholder="@handle"
                  />
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6] transition cursor-pointer"
              >
                Close
              </button>

              <button
                id="btn-footer-open-adobe"
                onClick={handleLaunchAdobeExpress}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B5CE2] hover:bg-[#4B4CD0] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <span>Open in Adobe Express</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
