import React from "react";
import {
  CheckCircle2,
  ExternalLink,
  Calendar,
  Tag,
  Youtube,
  Instagram,
  Twitter,
  Share2,
} from "lucide-react";
import { ProfileData } from "../types";
import { PLATFORM_CONFIGS } from "../utils/mockGenerator";

interface ProfileHeaderProps {
  profile: ProfileData;
  onCompareThis: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onCompareThis,
}) => {
  const config = PLATFORM_CONFIGS[profile.platform];

  return (
    <div
      id="profile-header-card"
      className="relative mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-5 shadow-xl sm:p-6"
    >
      {/* Subtle ambient gradient highlight tailored to platform */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: config.accentColor }}
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Avatar + Details */}
        <div className="flex items-start gap-4">
          {/* Avatar Placeholder with Initials or Real Image */}
          <div
            id="profile-avatar"
            className={`relative flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${profile.avatarBg} text-xl font-bold tracking-wider text-white shadow-lg ring-2 ring-slate-800 overflow-visible`}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-2xl object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span>{profile.initials}</span>
            )}

            {/* Platform Icon Badge pinned to avatar corner */}
            <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-700 shadow-md">
              {profile.platform === "youtube" && (
                <Youtube className="h-3.5 w-3.5 text-red-500" />
              )}
              {profile.platform === "instagram" && (
                <Instagram className="h-3.5 w-3.5 text-pink-500" />
              )}
              {profile.platform === "x" && (
                <Twitter className="h-3.5 w-3.5 text-slate-200" />
              )}
            </div>
          </div>

          {/* Text Information */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {profile.displayName}
              </h1>

              {profile.verified && (
                <span
                  title="Verified Account (Simulated)"
                  className="flex items-center text-sky-400"
                >
                  <CheckCircle2 className="h-4 w-4 fill-sky-400/20" />
                </span>
              )}

              {/* Platform Chip */}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${config.badgeBg} ${config.badgeBorder} ${config.badgeText} border`}
              >
                {config.name}
              </span>
            </div>

            {/* Handle & External Link */}
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-mono text-slate-300">{profile.handle}</span>
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-400 transition hover:text-indigo-300 hover:underline"
              >
                <span>Visit {config.name}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Bio line */}
            <p className="mt-2.5 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              {profile.bio}
            </p>

            {/* Metadata Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 rounded-md bg-slate-800/60 px-2 py-0.5">
                <Tag className="h-3 w-3 text-slate-400" />
                <span>{profile.category}</span>
              </span>
              <span className="flex items-center gap-1 rounded-md bg-slate-800/60 px-2 py-0.5">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>Tracked since {profile.joinedYear}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 self-end sm:self-start">
          <button
            id="btn-compare-from-header"
            onClick={onCompareThis}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <span>Compare Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
