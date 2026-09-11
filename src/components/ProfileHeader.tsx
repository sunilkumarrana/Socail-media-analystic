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
      className="relative mb-8 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs"
    >
      {/* Rule 3: Clean channel banner image or subtle neutral placeholder */}
      <div className="h-28 sm:h-36 w-full relative overflow-hidden bg-[#F1F5F9] border-b border-[#E5E7EB]">
        {profile.bannerUrl ? (
          <img
            src={profile.bannerUrl}
            alt={`${profile.displayName} Banner`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-90"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="h-full w-full bg-[#F1F5F9]" />
        )}
      </div>

      <div className="px-5 sm:px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4">
          {/* Avatar + Details */}
          <div className="flex items-end gap-4">
            <div
              id="profile-avatar"
              className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl border-4 border-white bg-[#F3F4F6] shadow-xs overflow-hidden"
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
                <div className="h-full w-full flex items-center justify-center font-bold text-white text-2xl bg-[#5B5CE2]">
                  {profile.initials}
                </div>
              )}
            </div>

            {/* Name, single verified pill, handle */}
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                  {profile.displayName}
                </h1>

                {/* Rule 4: Max one pill next to channel name - verified checkmark is sufficient */}
                {profile.verified && (
                  <span title="Verified Channel" className="flex items-center text-[#2563EB]">
                    <CheckCircle2 className="h-4 w-4 fill-[#2563EB]/15" />
                  </span>
                )}
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="font-mono text-[#4B5563]">{profile.handle}</span>
                {profile.category && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#6B7280]">
                      <Tag className="h-3 w-3 text-[#9CA3AF]" />
                      <span>{profile.category}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rule 4: Right-aligned single primary action button */}
          <div className="self-start sm:self-end">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-xs font-medium text-[#374151] transition hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#D1D5DB] shadow-xs"
            >
              <span>View on {config.name}</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#9CA3AF]" />
            </a>
          </div>
        </div>

        {/* Professional Bio line */}
        {sanitizedBio && (
          <p className="max-w-3xl text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            {sanitizedBio}
          </p>
        )}
      </div>
    </div>
  );
};
