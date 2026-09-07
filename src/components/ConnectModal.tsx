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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="connect-account-modal"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Connect Account for Deeper Private Insights
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Prototype Architecture Note: How SocialPulse interfaces with verified creator accounts in production.
            </p>
          </div>
        </div>

        {/* Explainer Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 mb-5 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            Public scrapers and handle searches only provide top-line estimated estimates.
            In a complete production deployment, connecting your account via standard <strong>OAuth 2.0 PKCE</strong> enables direct tokenized access to official creator APIs without storing your password.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1 rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[11px] text-red-400">
              <Youtube className="h-3 w-3" /> YouTube Analytics API
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 text-[11px] text-pink-400">
              <Instagram className="h-3 w-3" /> Instagram Graph API (Business/Creator)
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-100/10 border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300">
              <Twitter className="h-3 w-3" /> X Developer API v2
            </span>
          </div>
        </div>

        {/* Locked Private Metrics Mockup Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Locked Telemetry Available with OAuth Authentication
          </h4>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <Users2 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>Audience Demographics</span>
                  <Lock className="h-3 w-3 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Age brackets, gender distribution, and top 20 geographic viewer territories.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Clock3 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>Audience Retention & Watch Time</span>
                  <Lock className="h-3 w-3 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Second-by-second drop-off curve, completion rate, and average view duration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>Traffic Sources & Impressions CTR</span>
                  <Lock className="h-3 w-3 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Search keywords, algorithmic suggested feeds, notifications, and click-through %.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 relative overflow-hidden">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 shrink-0">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>Monetization & RPM Analytics</span>
                  <Lock className="h-3 w-3 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Estimated playback CPM/RPM, ad performance, and creator fund payout trends.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Prototype Notice */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Read-Only Scope Compliance Prototype</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
};
