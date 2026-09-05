import React from 'react';
import { ViewMode } from '../types';
import { COMPANY_INFO, WHY_CHOOSE_US } from '../data/companyData';
import { Logo } from '../components/Logo';
import softwareEngineerImg from '../assets/images/software_engineer_team_1788530472353.jpg';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Code, 
  Cpu, 
  ArrowRight, 
  MessageCircle, 
  Users, 
  Award, 
  Clock,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
  onOpenInternship?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  onOpenQuote,
  onOpenInternship
}) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-[#0284C7] font-bold text-xs uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block mb-3">
                Official Institutional Profile • Agbani, Enugu State, Nigeria
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display mt-1 mb-4">
                Engineering Scalable Software & Reliable Website Maintenance
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Based in Agbani, Enugu State (within the ESUT university corridor), Ocean Technologies Institute is a premier software engineering institution built on one core mission: delivering dependable, high-speed software solutions that empower businesses to grow without technical interruptions.
              </p>
            </div>
            <div className="shrink-0 p-2 bg-white rounded-full border border-slate-200/90 self-start md:self-center shadow-md ring-4 ring-sky-500/10">
              <Logo variant="full" size="lg" showTagline={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Story & Foundation */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Who We Are & What Drives Us
            </h2>
            <p>
              Ocean Technologies was founded with a clear objective: to bridge the gap between complex software engineering and practical business success. Too many Nigerian businesses and institutions struggle with slow, vulnerable websites, crashing apps, or uncooperative developers who disappear after launching.
            </p>
            <p>
              We established our development center in <strong>Agbani, Enugu State, Nigeria (ESUT Corridor)</strong>, bringing together experienced software engineers, UI/UX designers, and systems architects. Whether we are engineering a new corporate web application, developing an iOS/Android mobile app, or providing 24/7 monthly website maintenance, we treat every line of code with craftsmanship and security rigor.
            </p>
            
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-xl font-bold text-slate-900 font-display">120+</p>
                <p className="text-[11px] text-slate-500">Delivered Systems</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-xl font-bold text-sky-600 font-display">5+ Years</p>
                <p className="text-[11px] text-slate-500">Engineering Rigor</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <p className="text-xl font-bold text-emerald-600 font-display">99.9%</p>
                <p className="text-[11px] text-slate-500">Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Agbani Headquarters Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="relative h-48 w-full bg-slate-900">
              <img 
                src={softwareEngineerImg} 
                alt="Ocean Technologies Software Engineering Team in Agbani, Enugu State"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-base font-display">Ocean Technologies Engineering Lab</h3>
                  <p className="text-xs text-sky-300">Agbani, Enugu State, Nigeria</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  ESUT Area
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Location:</strong> Agbani, Enugu State, Nigeria<br />
                    <span className="text-slate-500 text-[11px]">(Near Enugu State University of Science and Technology - ESUT)</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Hotline:</strong> <a href={COMPANY_INFO.phoneTel} className="text-emerald-700 font-bold">{COMPANY_INFO.phone}</a>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    <strong>Email:</strong> <a href={COMPANY_INFO.emailMailto} className="text-sky-700 font-semibold">{COMPANY_INFO.email}</a>
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Working Hours:</strong> Mon – Sat: 8:00 AM – 7:00 PM (WAT)<br />
                    <span className="text-emerald-700 font-semibold">24/7 Software Emergency Response Hotline</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onOpenQuote()}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide text-center transition-colors cursor-pointer shadow-xs"
                >
                  Request a Consultation
                </button>
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values & Commitments */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">Our Standards</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              The Ocean Technologies Engineering Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 font-display mb-2">
                Root-Cause Fixes, Never Surface Hacks
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When troubleshooting software bugs or website crashes, we trace the issue down to the architecture, server config, and code algorithms to ensure it never breaks again.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 font-display mb-2">
                Uncompromising Security & Backups
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every website and portal we develop and maintain undergoes SSL encryption, firewall hardening, SQL injection prevention, and daily offsite cloud backups.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 font-display mb-2">
                Accessible & Direct Communication
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No middleman or silent ticket queues. You have direct phone and WhatsApp access (09129216768) to senior software engineers who answer your questions in plain, clear language.
              </p>
            </div>
          </div>
        </div>

        {/* Talent & Student Development: Internships, IT & SIWES */}
        <div className="mb-16 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl border border-indigo-700/50 p-8 text-white shadow-md relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-3">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Community Impact & Talent Incubation</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3">
              Open for Internships, Industrial Training (IT) & SIWES in Agbani
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Located right along the university corridor in Agbani (near Enugu State University of Science and Technology - ESUT), Ocean Technologies is deeply committed to closing the gap between academic theory and industry engineering. We welcome undergraduates across Nigeria for intensive 3-month, 6-month, and 1-year Industrial Training (IT) and SIWES placements, providing hands-on coding, live cloud deployments, and professional software craft.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenInternship ? onOpenInternship() : onOpenQuote('Internship / IT & SIWES Placement')}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Register for Student Placement
              </button>
              <a
                href="https://wa.me/2349129216768?text=Hello%20Ocean%20Technologies,%20I%20am%20interested%20in%20applying%20for%20an%20IT%20/%20SIWES%20internship%20at%20your%20Agbani%20office."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Student Coordinator</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 font-display mb-4 text-center">
            Our Core Technologies & Stack
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center text-xs">
            {['React & Next.js', 'Flutter & Dart', 'TypeScript', 'Node.js & Express', 'WordPress & PHP', 'PostgreSQL & MySQL', 'Tailwind CSS', 'Paystack & Flutterwave', 'Firebase & Cloud', 'Docker & Linux', 'cPanel & Cloudflare', 'REST & GraphQL'].map((tech, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono font-medium text-slate-800">
                {tech}
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
