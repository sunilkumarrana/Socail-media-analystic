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
        <div className="relative flex items-center rounded-xl border border-[#D1D5DB] bg-white shadow-xs transition-all focus-within:border-[#5B5CE2] focus-within:ring-1 focus-within:ring-[#5B5CE2]">
          <div className="pl-3.5 text-[#9CA3AF]">
            <Search className="h-4 w-4" />
          </div>

          <input
            id="search-handle-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste channel URL or handle (e.g. youtube.com/@mkbhd, @mrbeast)..."
            className="w-full bg-transparent px-3 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue("")}
              className="mr-2 rounded-full p-1 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Auto-detected Platform Badge (if detected from URL) */}
          {detectedPlatform && (
            <div className="hidden sm:flex items-center gap-1.5 mr-2 rounded-md border border-[#E5E7EB] bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#4B5563]">
              {detectedPlatform === "youtube" && (
                <Youtube className="h-3 w-3 text-[#DC2626]" />
              )}
              {detectedPlatform === "instagram" && (
                <Instagram className="h-3 w-3 text-[#DB2777]" />
              )}
              {detectedPlatform === "x" && (
                <Twitter className="h-3 w-3 text-[#4B5563]" />
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
              className="flex items-center gap-1.5 rounded-lg bg-[#5B5CE2] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#4D4ECF] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
            <span className="text-xs text-[#6B7280]">Select platform:</span>
            <div className="flex items-center gap-1.5">
              {(["youtube", "instagram", "x"] as Platform[]).map((p) => {
                const isSelected = manualPlatform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setManualPlatform(p)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-[#5B5CE2]/10 border border-[#5B5CE2]/30 text-[#5B5CE2]"
                        : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {p === "youtube" && <Youtube className="h-3 w-3 text-[#DC2626]" />}
                    {p === "instagram" && <Instagram className="h-3 w-3 text-[#DB2777]" />}
                    {p === "x" && <Twitter className="h-3 w-3 text-[#4B5563]" />}
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
        <span className="text-[11px] font-medium text-[#6B7280] flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-[#6B7280]" />
          Try sample:
        </span>
        {SAMPLE_PROFILES.map((sample) => (
          <button
            key={sample.handle}
            type="button"
            onClick={() => handleSampleClick(sample)}
            className="group flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-2.5 py-1 text-[11px] text-[#374151] transition hover:border-[#D1D5DB] hover:bg-[#E5E7EB]/70 cursor-pointer shadow-2xs"
          >
            {sample.platform === "youtube" && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
            )}
            {sample.platform === "instagram" && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#DB2777]" />
            )}
            {sample.platform === "x" && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#6B7280]" />
            )}
            <span className="group-hover:text-[#111827]">{sample.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
