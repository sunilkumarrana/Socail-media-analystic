import React from "react";
import {
  X,
  Lock,
  ShieldCheck,
  KeyRound,
  Youtube,
  Instagram,
  Twitter,
  BarChart3,
  Users2,
  Clock3,
  DollarSign,
  CheckCircle,
} from "lucide-react";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="connect-account-modal"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#5B5CE2] border border-[#E0E7FF]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#111827] tracking-tight">
              Connect Account for Deeper Private Insights
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
              Prototype Architecture Note: How SocialPulse interfaces with verified creator accounts in production.
            </p>
          </div>
        </div>

        {/* Explainer Box */}
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 mb-5 text-xs text-[#4B5563] leading-relaxed space-y-2">
          <p>
            Public scrapers and handle searches only provide top-line estimated estimates.
            In a complete production deployment, connecting your account via standard <strong>OAuth 2.0 PKCE</strong> enables direct tokenized access to official creator APIs without storing your password.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1 rounded bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 text-[11px] text-[#DC2626]">
              <Youtube className="h-3 w-3" /> YouTube Analytics API
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#FDF2F8] border border-[#FBCFE8] px-2 py-0.5 text-[11px] text-[#DB2777]">
              <Instagram className="h-3 w-3" /> Instagram Graph API (Business/Creator)
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 text-[11px] text-[#4B5563]">
              <Twitter className="h-3 w-3" /> X Developer API v2
            </span>
          </div>
        </div>

        {/* Locked Private Metrics Mockup Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            Locked Telemetry Available with OAuth Authentication
          </h4>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#5B5CE2] shrink-0 border border-[#E0E7FF]">
                <Users2 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111827]">
                  <span>Audience Demographics</span>
                  <Lock className="h-3 w-3 text-amber-500" />
                </div>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Age brackets, gender distribution, and top 20 geographic viewer territories.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#059669] shrink-0 border border-[#A7F3D0]">
                <Clock3 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111827]">
                  <span>Audience Retention & Watch Time</span>
                  <Lock className="h-3 w-3 text-amber-500" />
                </div>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Second-by-second drop-off curve, completion rate, and average view duration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-[#FEF3C7] text-amber-600 shrink-0 border border-[#FDE68A]">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111827]">
                  <span>Traffic Sources & Impressions CTR</span>
                  <Lock className="h-3 w-3 text-amber-500" />
                </div>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Search keywords, algorithmic suggested feeds, notifications, and click-through %.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-[#F5F3FF] text-[#7C3AED] shrink-0 border border-[#DDD6FE]">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111827]">
                  <span>Monetization & RPM Analytics</span>
                  <Lock className="h-3 w-3 text-amber-500" />
                </div>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Estimated playback CPM/RPM, ad performance, and creator fund payout trends.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Prototype Notice */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
            <ShieldCheck className="h-4 w-4 text-[#059669]" />
            <span>Read-Only Scope Compliance Prototype</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#111827] shadow-xs transition cursor-pointer"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
};
