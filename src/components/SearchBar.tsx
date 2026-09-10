import React, { useState, useEffect } from "react";
import { Search, Youtube, Instagram, Twitter, ArrowRight, Sparkles, X } from "lucide-react";
import { Platform } from "../types";
import { detectPlatform, PLATFORM_CONFIGS } from "../utils/mockGenerator";

interface SearchBarProps {
  currentHandle: string;
  currentPlatform: Platform;
  onSearch: (input: string, platform: Platform) => void;
  isLoading?: boolean;
}

const SAMPLE_PROFILES = [
  { label: "MKBHD", handle: "youtube.com/@mkbhd", platform: "youtube" as Platform },
  { label: "MrBeast", handle: "youtube.com/@mrbeast", platform: "youtube" as Platform },
  { label: "National Geographic", handle: "instagram.com/natgeo", platform: "instagram" as Platform },
  { label: "NASA", handle: "instagram.com/nasa", platform: "instagram" as Platform },
  { label: "Elon Musk", handle: "x.com/elonmusk", platform: "x" as Platform },
  { label: "The Verge", handle: "x.com/verge", platform: "x" as Platform },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  currentHandle,
  currentPlatform,
  onSearch,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState(currentHandle);
  const [manualPlatform, setManualPlatform] = useState<Platform>(currentPlatform);
  const [detectedPlatform, setDetectedPlatform] = useState<Platform | null>(null);

  // Synchronize when input text changes
  useEffect(() => {
    const { platform } = detectPlatform(inputValue);
    setDetectedPlatform(platform);
    if (platform) {
      setManualPlatform(platform);
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const finalPlatform = detectedPlatform || manualPlatform;
    onSearch(inputValue.trim(), finalPlatform);
  };

  const handleSampleClick = (sample: (typeof SAMPLE_PROFILES)[0]) => {
    setInputValue(sample.handle);
    setDetectedPlatform(sample.platform);
    setManualPlatform(sample.platform);
    onSearch(sample.handle, sample.platform);
  };

  const isAmbiguous = !detectedPlatform && inputValue.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-xl border border-slate-750 bg-slate-900/90 shadow-sm backdrop-blur-sm transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <div className="pl-3.5 text-slate-500">
            <Search className="h-4 w-4" />
          </div>

          <input
            id="search-handle-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste channel URL or handle (e.g. youtube.com/@mkbhd, @mrbeast)..."
            className="w-full bg-transparent px-3 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue("")}
              className="mr-2 rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Auto-detected Platform Badge (if detected from URL) */}
          {detectedPlatform && (
            <div className="hidden sm:flex items-center gap-1.5 mr-2 rounded-md border border-slate-800 bg-slate-850 px-2 py-0.5 text-[11px] font-medium text-slate-300">
              {detectedPlatform === "youtube" && (
                <Youtube className="h-3 w-3 text-red-500" />
              )}
              {detectedPlatform === "instagram" && (
                <Instagram className="h-3 w-3 text-pink-500" />
              )}
              {detectedPlatform === "x" && (
                <Twitter className="h-3 w-3 text-slate-300" />
              )}
              <span>{PLATFORM_CONFIGS[detectedPlatform].name}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pr-1.5">
            <button
              id="search-submit-btn"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-indigo-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ambiguous Handle: Manual Platform Selection Picker */}
        {isAmbiguous && (
          <div className="mt-2.5 flex items-center gap-2 px-1">
            <span className="text-xs text-slate-400">Select platform:</span>
            <div className="flex items-center gap-1.5">
              {(["youtube", "instagram", "x"] as Platform[]).map((p) => {
                const isSelected = manualPlatform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setManualPlatform(p)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      isSelected
                        ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {p === "youtube" && <Youtube className="h-3 w-3 text-red-400" />}
                    {p === "instagram" && <Instagram className="h-3 w-3 text-pink-400" />}
                    {p === "x" && <Twitter className="h-3 w-3 text-slate-300" />}
                    <span>{PLATFORM_CONFIGS[p].name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </form>

      {/* Quick Sample Profiles */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 px-1">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          Try sample:
        </span>
        {SAMPLE_PROFILES.map((sample) => (
          <button
            key={sample.handle}
            type="button"
            onClick={() => handleSampleClick(sample)}
            className="group flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
          >
            {sample.platform === "youtube" && (
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
            {sample.platform === "instagram" && (
              <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            )}
            {sample.platform === "x" && (
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            )}
            <span className="group-hover:text-white">{sample.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
