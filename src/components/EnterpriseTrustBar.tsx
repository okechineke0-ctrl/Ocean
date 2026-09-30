import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  Clock, 
  Award, 
  Server, 
  CheckCircle2,
  FileSearch,
  MessageCircle
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface EnterpriseTrustBarProps {
  onOpenTracker?: () => void;
  onOpenQuote?: () => void;
}

export const EnterpriseTrustBar: React.FC<EnterpriseTrustBarProps> = ({
  onOpenTracker,
  onOpenQuote
}) => {
  return (
    <section className="bg-slate-900 border-y border-slate-800 text-slate-300 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Core Guarantees */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full lg:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white font-display">99.9% Uptime SLA</p>
              <p className="text-[10px] text-slate-400">Guaranteed server availability</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white font-display">&lt; 2-Hour Triage</p>
              <p className="text-[10px] text-slate-400">Emergency bug hotline</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white font-display">OWASP Hardened</p>
              <p className="text-[10px] text-slate-400">Zero-trust security rules</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white font-display">Verified Institution</p>
              <p className="text-[10px] text-slate-400">Agbani, Enugu State</p>
            </div>
          </div>
        </div>

        {/* Client Convenience Action Links */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          {onOpenTracker && (
            <button
              onClick={onOpenTracker}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileSearch className="w-3.5 h-3.5 text-sky-400" />
              <span>Track Ticket / Registration</span>
            </button>
          )}

          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat: {COMPANY_INFO.phone}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
