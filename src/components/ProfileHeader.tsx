import React from "react";
import {
  CheckCircle2,
  ExternalLink,
  Tag,
} from "lucide-react";
import { ProfileData } from "../types";
import { PLATFORM_CONFIGS } from "../utils/mockGenerator";

interface ProfileHeaderProps {
  profile: ProfileData;
  onCompareThis: () => void;
}

// Sanitize jokey placeholder phrases like "subscribe for a cookie :)"
function cleanBioText(bio?: string): string {
  if (!bio) return "";
  let text = bio.replace(/subscribe for a cookie\s*:\s*\)/gi, "").replace(/🍪/g, "").trim();
  if (text.startsWith("Accomplish something impossible or")) {
    text = "Accomplish something impossible.";
  }
  return text;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
}) => {
  const config = PLATFORM_CONFIGS[profile.platform];
  const sanitizedBio = cleanBioText(profile.bio);

  return (
    <div
      id="profile-header-card"
      className="relative mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm"
    >
      {/* Rule 3: Clean channel banner image or subtle neutral gradient placeholder (no jokes/cookie emoji) */}
      <div className="h-28 sm:h-36 w-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800/80">
        {profile.bannerUrl ? (
          <img
            src={profile.bannerUrl}
            alt={`${profile.displayName} Banner`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-85"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      </div>

      <div className="px-5 sm:px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4">
          {/* Avatar + Details */}
          <div className="flex items-end gap-4">
            <div
              id="profile-avatar"
              className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl border-4 border-slate-950 bg-slate-800 shadow-xl overflow-hidden"
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className={`h-full w-full flex items-center justify-center font-bold text-white text-2xl bg-gradient-to-br ${profile.avatarBg}`}>
                  {profile.initials}
                </div>
              )}
            </div>

            {/* Name, single verified pill, handle */}
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {profile.displayName}
                </h1>

                {/* Rule 4: Max one pill next to channel name - verified checkmark is sufficient */}
                {profile.verified && (
                  <span title="Verified Channel" className="flex items-center text-sky-400">
                    <CheckCircle2 className="h-4 w-4 fill-sky-400/20" />
                  </span>
                )}
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-slate-300">{profile.handle}</span>
                {profile.category && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Tag className="h-3 w-3 text-slate-500" />
                      <span>{profile.category}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rule 4: Right-aligned single primary action button (neutral outline/ghost per Rule 2) */}
          <div className="self-start sm:self-end">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <span>View on {config.name}</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Professional Bio line */}
        {sanitizedBio && (
          <p className="max-w-3xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            {sanitizedBio}
          </p>
        )}
      </div>
    </div>
  );
};
