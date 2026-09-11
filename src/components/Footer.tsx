import React, { useState, useRef } from 'react';
import { Logo } from './Logo';
import { ViewMode } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { 
  Mail, 
  Phone, 
  Globe,
  ShieldCheck, 
  CheckCircle2, 
  Send,
  MessageCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
  onOpenIssueReport: () => void;
  onOpenCourseRegistration?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenQuote,
  onOpenIssueReport,
  onOpenCourseRegistration,
}) => {
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const clickTimesRef = useRef<number[]>([]);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFooterLogoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const recentClicks = [...clickTimesRef.current.filter((t) => now - t < 1800), now];
    clickTimesRef.current = recentClicks;

    // Secret trigger: 3 clicks on logo opens admin modal (requires password okechineke0)
    if (e.detail >= 3 || recentClicks.length >= 3) {
      clickTimesRef.current = [];
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      window.dispatchEvent(new CustomEvent('open-admin-portal'));
      onNavigate('admin-inbox');
      return;
    }

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      onNavigate('home');
      clickTimesRef.current = [];
    }, 380);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail.trim()) {
      setSubscribedSuccess(true);
      setTimeout(() => {
        setSubscribedSuccess(false);
        setSubscribedEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 relative overflow-hidden">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={handleFooterLogoClick} className="cursor-pointer inline-block select-none" title="Ocean Technologies">
              <Logo variant="horizontal" size="md" showTagline={true} isDark={true} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              Ocean Technologies is a premier software engineering firm and technology education institute. We specialize in website maintenance, custom web applications, mobile app development (iOS/Android), and proactive 24/7 technical support.
            </p>
            
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-sky-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Verified Engineering
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">24/7 Software Support</span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Subscribe for Tech Insights & Security Bulletins
              </p>
              {subscribedSuccess ? (
                <div className="flex items-center gap-2 text-sky-300 text-xs bg-sky-950/50 p-2.5 rounded-lg border border-sky-800/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Thank you! We will keep you updated with helpful software maintenance tips.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Core Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-display">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('services')} 
                  className="hover:text-sky-300 transition-colors text-left text-slate-400 hover:text-slate-200"
                >
                  Website Development
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('services')} 
                  className="hover:text-sky-300 transition-colors text-left text-slate-400 hover:text-slate-200"
                >
                  Mobile App Development (iOS/Android)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('maintenance')} 
                  className="hover:text-sky-300 transition-colors text-left text-slate-400 hover:text-slate-200"
                >
                  Website Maintenance & Retainers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('emergency-fix')} 
                  className="hover:text-amber-300 transition-colors text-left text-amber-400 font-medium flex items-center gap-1"
                >
                  <span>Software Issue Debugging</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60">24/7</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('services')} 
                  className="hover:text-sky-300 transition-colors text-left text-slate-400 hover:text-slate-200"
                >
                  Custom Portals & Web Apps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('services')} 
                  className="hover:text-sky-300 transition-colors text-left text-slate-400 hover:text-slate-200"
                >
                  Cloud Infrastructure & Performance
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Maintenance & Plans */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-display">
              Plans & Portfolio
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('maintenance')} className="hover:text-sky-300 transition-colors text-slate-400 hover:text-slate-200">
                  Starter Website Care Plan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('maintenance')} className="hover:text-sky-300 transition-colors text-slate-400 hover:text-slate-200">
                  Business Pro Retainer (₦55k/mo)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('maintenance')} className="hover:text-sky-300 transition-colors text-slate-400 hover:text-slate-200">
                  Enterprise SLA & Backends
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-sky-300 transition-colors text-slate-400 hover:text-slate-200">
                  Client Case Studies & Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-sky-300 transition-colors text-slate-400 hover:text-slate-200">
                  About Ocean Technologies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenCourseRegistration ? onOpenCourseRegistration() : onNavigate('contact')} 
                  className="hover:text-sky-300 transition-colors text-sky-400 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                  <span>Register for a Course</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800/60 uppercase">New</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenQuote('Graphics Design & Branding')} 
                  className="hover:text-sky-300 transition-colors text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <span>Graphics Design & Brand Identity</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenQuote()} className="hover:text-sky-300 transition-colors text-sky-400 font-semibold flex items-center gap-1">
                  <span>Request Custom Price Quote</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Coordinates */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-display">
              Direct Communication & Support
            </h4>
            <div className="space-y-3.5 text-xs">
              
              {/* Operating Advisory */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="leading-relaxed text-slate-300">
                  Engineering & Technical Advisory<br />
                  <span className="text-[11px] text-slate-400">Monday – Saturday: 8:00 AM – 7:00 PM</span>
                </span>
              </div>
              
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <a href={COMPANY_INFO.phoneTel} className="text-slate-200 font-mono font-bold hover:text-white transition-colors">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <a href={COMPANY_INFO.emailMailto} className="text-slate-300 hover:text-white transition-colors break-all">
                  {COMPANY_INFO.email}
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                <a
                  href="https://ocean-f4gj.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-white transition-colors font-mono text-[11px]"
                >
                  www.ocean-f4gj.orrender.com
                </a>
              </div>
              
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp 09129216768</span>
                </a>

                <button
                  onClick={onOpenIssueReport}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Broken Site / Bug</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Official Social Media Channels Banner */}
        <div className="my-8 pt-8 border-t border-slate-800/80">
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h5 className="text-white font-bold text-sm tracking-wide flex items-center justify-center md:justify-start gap-2 font-display">
                <span>Connect With Us on Social Media</span>
                <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-950/70 border border-sky-800/60 px-2 py-0.5 rounded-full">
                  Official Handles
                </span>
              </h5>
              <p className="text-xs text-slate-400">
                Official handles for <strong className="text-white">ocean technologies</strong> on Facebook, Instagram, Telegram, and Threads.
              </p>
            </div>
            
            <SocialLinks variant="footer" showLabels={true} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()}{' '}
            <span 
              onClick={(e) => {
                if (e.detail >= 3) {
                  window.dispatchEvent(new CustomEvent('open-admin-portal'));
                  onNavigate('admin-inbox');
                }
              }}
              className="cursor-default select-none"
              title=""
            >
              Ocean Technologies
            </span>
            . All rights reserved. Agbani, Enugu State, Nigeria.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-200 transition-colors">
              About Us
            </button>
            <button onClick={() => onNavigate('services')} className="hover:text-slate-200 transition-colors">
              Services
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-200 transition-colors">
              Agbani Office
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

