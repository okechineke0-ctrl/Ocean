import React, { useState } from 'react';
import { ViewMode } from '../types';
import { MAINTENANCE_PLANS, COMPANY_INFO } from '../data/companyData';
import { 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Zap, 
  AlertTriangle, 
  HelpCircle, 
  Phone,
  MessageCircle,
  Database,
  Lock,
  RefreshCw
} from 'lucide-react';

interface MaintenanceViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (planId?: string) => void;
  onOpenIssueReport: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  onNavigate,
  onOpenQuote,
  onOpenIssueReport
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const maintenanceFaqs = [
    {
      q: 'Why does my website need monthly maintenance?',
      a: 'Websites (especially WordPress, PHP, and modern web apps) are constantly targeted by bots, malware, and security vulnerabilities. Plugins, SSL certificates, and PHP versions get outdated, causing slow loading speeds or broken checkouts. Our maintenance ensures your site stays 100% online, backed up daily, and updated seamlessly.'
    },
    {
      q: 'What happens if my website goes down or gets hacked?',
      a: 'Under our maintenance retainers, we receive automated instant uptime alerts. Our engineers in Agbani immediately restore clean cloud backups, clean out malware scripts, patch vulnerabilities, and restore your site within our guaranteed SLA response window.'
    },
    {
      q: 'Can I request content updates and banner changes?',
      a: 'Yes! All our monthly plans include dedicated developer hours for routine content updates such as uploading new products, updating phone numbers/addresses, publishing blog posts, or adding promotional banners.'
    },
    {
      q: 'Can I cancel or change my maintenance plan anytime?',
      a: 'Yes. Our maintenance retainers have no lock-in contracts. You can upgrade, downgrade, or pause your plan at the end of each billing cycle with simple notice.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
              Ocean Technologies Website Maintenance Retainers
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display mb-4">
              Peace of Mind with Proactive Website & Software Care
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Eliminate website downtime, malware infections, and broken payment checkouts. Our Agbani engineering team keeps your digital assets running at peak speed 24/7/365.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Maintenance */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl inline-block mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-display mb-1">Automated Cloud Backups</h3>
            <p className="text-xs text-slate-600">Daily and weekly off-site backups with instant 1-click restore in case of accidental loss.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl inline-block mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-display mb-1">Security & Malware Scans</h3>
            <p className="text-xs text-slate-600">Continuous firewall monitoring, brute-force shielding, and proactive vulnerability patching.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl inline-block mb-3">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-display mb-1">Plugin & Code Updates</h3>
            <p className="text-xs text-slate-600">Safe staging updates for core software, themes, PHP runtime, and APIs without breaking layouts.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl inline-block mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-display mb-1">Speed & Cache Tuning</h3>
            <p className="text-xs text-slate-600">Database cleanup, image compression, and CDN tuning to keep load times under 1.5 seconds.</p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Transparent Maintenance Plans
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Choose the level of engineering care your business requires. Billed in Naira (₦) with priority developer access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MAINTENANCE_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 transition-all flex flex-col justify-between ${
                plan.isPopular
                  ? 'bg-slate-900 text-white shadow-xl ring-2 ring-sky-500 relative'
                  : 'bg-white border border-slate-200 text-slate-900 shadow-xs hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular Choice
                </div>
              )}

              <div>
                <h3 className={`text-lg font-bold font-display ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mt-1 mb-4 ${plan.isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.tagline}
                </p>

                <div className="py-3 border-y border-slate-100 dark:border-slate-800 my-4">
                  <span className={`text-2xl font-black font-display ${plan.isPopular ? 'text-sky-400' : 'text-slate-900'}`}>
                    {plan.priceNGN}
                  </span>
                  <p className={`text-[11px] mt-1 ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                    SLA: {plan.responseTime}
                  </p>
                </div>

                <div className="space-y-2 text-xs mb-6">
                  <p className={`font-bold uppercase tracking-wider text-[10px] ${plan.isPopular ? 'text-sky-300' : 'text-slate-700'}`}>
                    Plan Inclusions:
                  </p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={plan.isPopular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className={`text-[11px] mb-3 ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                  <strong>Best for:</strong> {plan.bestFor}
                </p>

                <button
                  onClick={() => onOpenQuote(plan.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Enroll in {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Triage Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Need Immediate Fix Without a Monthly Plan?</span>
            </div>
            <h3 className="text-2xl font-bold font-display">
              One-Off Software Bug & Crash Diagnostic
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Pay-as-you-go emergency repairs starting from ₦20,000. We diagnose root causes and restore your broken checkout, database, or mobile app endpoints within 2 hours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenIssueReport}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Report Emergency Bug
            </button>
            <a
              href={COMPANY_INFO.phoneTel}
              className="px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 font-display text-center mb-6">
            Frequently Asked Questions on Website Maintenance
          </h3>
          <div className="space-y-3">
            {maintenanceFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 font-semibold text-xs sm:text-sm text-slate-800 hover:text-sky-700 flex items-center justify-between transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 font-bold ml-2">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </section>

    </div>
  );
};
