import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Logo } from './Logo';
import { 
  Monitor, 
  Smartphone, 
  Code2, 
  Settings, 
  Cloud, 
  CheckCircle2, 
  Rocket, 
  ShieldCheck, 
  Users, 
  PhoneCall, 
  Mail, 
  Globe, 
  MapPin, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Server,
  Activity,
  Cpu,
  Terminal,
  Database,
  Layers,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Real high-resolution professional image assets
import lighthouseImg from '../assets/images/lighthouse_night_beacon_1788530454605.jpg';
import softwareEngineerImg from '../assets/images/software_engineer_team_1788530472353.jpg';
import softwareManagementImg from '../assets/images/software_management_devops_1788530496723.jpg';

interface FlyerHeroSectionProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
  onOpenIssueReport: () => void;
  onOpenInternship?: () => void;
}

export const FlyerHeroSection: React.FC<FlyerHeroSectionProps> = ({
  onNavigate,
  onOpenQuote,
  onOpenIssueReport,
  onOpenInternship,
}) => {
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'both' | 'engineering' | 'management'>('both');

  return (
    <div className="bg-white text-slate-900 overflow-hidden font-sans">
      
      {/* 1. Top Hero Section matching the Ocean Technologies Flyer with Professional Photography */}
      <section className="relative pt-6 pb-10 lg:pt-10 lg:pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Grid: Left Content & Right Dramatic Lighthouse Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column (7 cols): Brand Logo, Big Impact Headline, Intro & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Top Flyer Brand Identity */}
              <div className="flex items-center gap-4 mb-6">
                <Logo variant="horizontal" size="lg" showTagline={true} />
              </div>

              {/* Massive Display Headline */}
              <div className="relative mb-4">
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-[#0B2545] tracking-tight font-display leading-[1.08] uppercase">
                  TECHNOLOGY<br />
                  THAT POWERS<br />
                  <span className="text-[#0284C7]">YOUR SUCCESS</span>
                </h1>
                {/* Blue Underline Accent Bar */}
                <div className="h-1.5 w-24 bg-[#0284C7] rounded-full mt-3"></div>
              </div>

              {/* Intro Paragraph */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-6 font-normal">
                Ocean Technologies Institute delivers high-performance digital services, bespoke software engineering, and proactive systems management to help businesses scale securely and stay ahead in a digital world.
              </p>

              {/* Quick CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  id="hero-get-started-btn"
                  onClick={() => onOpenQuote()}
                  className="px-6 py-3.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Request a Project Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenInternship && (
                  <button
                    id="hero-internship-btn"
                    onClick={onOpenInternship}
                    className="px-5 py-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Student IT & SIWES</span>
                  </button>
                )}

                <button
                  id="hero-emergency-fix-btn"
                  onClick={onOpenIssueReport}
                  className="px-4 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Emergency 500 Fix</span>
                </button>
              </div>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <p className="text-lg font-black text-[#0B2545] font-display">120+</p>
                <p className="text-[11px] text-slate-500 font-medium">Delivered Systems</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <p className="text-lg font-black text-emerald-600 font-display">99.9%</p>
                <p className="text-[11px] text-slate-500 font-medium">Uptime Guarantee</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <p className="text-lg font-black text-[#0284C7] font-display">&lt; 2 Hrs</p>
                <p className="text-[11px] text-slate-500 font-medium">Triage SLA</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <p className="text-lg font-black text-indigo-600 font-display">ESUT</p>
                <p className="text-[11px] text-slate-500 font-medium">Agbani Corridor</p>
              </div>
            </div>
          </div>

          {/* Right Top Column (5 cols): Curved Deep Navy Banner with REAL Professional Lighthouse Photo */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white min-h-[360px] sm:min-h-[400px] flex flex-col justify-end p-6 sm:p-8 group">
              
              {/* Real Photorealistic Cinematic Lighthouse Image */}
              <img 
                src={lighthouseImg} 
                alt="Ocean Technologies Lighthouse Beacon of Technological Excellence"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
              />

              {/* Sophisticated Dark Gradient Overlay for Maximum Typography Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/75 to-transparent"></div>
              <div className="absolute inset-0 bg-[#0B2545]/30"></div>

              {/* Foreground Content */}
              <div className="relative z-10">
                {/* Brand Tag Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-200 text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Ocean Technologies Excellence</span>
                </div>

                {/* Main Flyer Tagline */}
                <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight uppercase drop-shadow-md">
                  INNOVATIVE <br />
                  <span className="text-[#38BDF8]">TECHNOLOGY</span> <br />
                  SOLUTIONS
                </h2>

                <div className="w-14 h-1 bg-[#38BDF8] rounded-full my-3"></div>

                <p className="text-slate-100 text-xs sm:text-sm leading-relaxed max-w-sm mt-2 font-normal drop-shadow-sm">
                  We build smart, scalable, and reliable digital solutions that drive growth and transform ideas into impactful experiences.
                </p>

                {/* Action Strip */}
                <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-white/15">
                  <button
                    onClick={() => onNavigate('services')}
                    className="px-4 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Explore Solutions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a 
                    href="tel:09129216768"
                    className="text-xs text-sky-300 hover:text-white font-mono font-bold flex items-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>09129216768</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 2. Mature Dual Showcase: SOFTWARE ENGINEERING & SOFTWARE MANAGEMENT */}
      <section className="py-10 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Enterprise Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-400/30">
                <Code2 className="w-3.5 h-3.5" />
                <span>Enterprise Disciplines</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display">
                Software Engineering <span className="text-[#38BDF8]">& Management</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Real software craftsmanship: from robust architecture and full-stack development to round-the-clock infrastructure management.
              </p>
            </div>

            {/* View Selector Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
              <button
                onClick={() => setActiveShowcaseTab('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeShowcaseTab === 'both' ? 'bg-[#0284C7] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Comprehensive View
              </button>
              <button
                onClick={() => setActiveShowcaseTab('engineering')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeShowcaseTab === 'engineering' ? 'bg-[#0284C7] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Software Engineering
              </button>
              <button
                onClick={() => setActiveShowcaseTab('management')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeShowcaseTab === 'management' ? 'bg-[#0284C7] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Software Management
              </button>
            </div>
          </div>

          {/* The Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CARD 1: SOFTWARE ENGINEERING */}
            {(activeShowcaseTab === 'both' || activeShowcaseTab === 'engineering') && (
              <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
                
                {/* Professional Picture of Software Engineers */}
                <div className="relative h-56 sm:h-64 overflow-hidden border-b border-slate-800">
                  <img
                    src={softwareEngineerImg}
                    alt="Professional Software Engineering Team at Ocean Technologies"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Active Development Hub</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-700">
                      TypeScript • React • Flutter
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                      <Terminal className="w-4 h-4 text-sky-400" />
                      <span>DISCIPLINE 01: ENGINEERING</span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white mb-2">
                      Full-Stack & Mobile Software Engineering
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      We engineer high-concurrency web platforms, native iOS & Android applications, custom ERPs, and automated API backends built to withstand enterprise workloads.
                    </p>

                    {/* Engineering Capabilities Grid */}
                    <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-200">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Microservice Architecture</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Paystack & Stripe Gateways</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Cross-Platform Flutter & React</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Strict OWASP Security</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Sprint Cycles: 1–2 Weeks
                    </span>
                    <button
                      onClick={() => onOpenQuote('Software Development')}
                      className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Build With Us</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* CARD 2: SOFTWARE MANAGEMENT & CLOUD OPERATIONS */}
            {(activeShowcaseTab === 'both' || activeShowcaseTab === 'management') && (
              <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
                
                {/* Professional Picture of Software Management / DevOps Center */}
                <div className="relative h-56 sm:h-64 overflow-hidden border-b border-slate-800">
                  <img
                    src={softwareManagementImg}
                    alt="Professional Software Management and Cloud Operations at Ocean Technologies"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[11px] font-bold backdrop-blur-md">
                      <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                      <span>24/7 Telemetry & Health</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-700">
                      99.9% Production SLA
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                      <Settings className="w-4 h-4 text-indigo-400" />
                      <span>DISCIPLINE 02: MANAGEMENT & DEVOPS</span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white mb-2">
                      Proactive Software Management & SLA Maintenance
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      Never worry about crashing servers, broken checkouts, or security breaches. Our engineering leads monitor system health, automate backups, and patch vulnerabilities around the clock.
                    </p>

                    {/* Management Capabilities Grid */}
                    <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-200">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Automated Cloud Backups</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>System Speed Optimization</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Zero-Downtime Patching</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>2-Hour Emergency Response</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Plans From ₦25,000 / month
                    </span>
                    <button
                      onClick={() => onNavigate('maintenance')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore Management</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. Middle Split Section: OUR SERVICES vs. WHY CHOOSE US? + 3 Pillars */}
      <section className="py-12 lg:py-16 bg-slate-50/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: OUR SERVICES (The 5 Core Services with Elevated Presentation) */}
            <div className="lg:col-span-6">
              {/* Title with Underline */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] uppercase tracking-tight font-display">
                  OUR <span className="text-[#0284C7]">SERVICES</span>
                </h2>
                <div className="h-1.5 w-16 bg-[#0284C7] rounded-full mt-2"></div>
              </div>

              {/* 5 Services List */}
              <div className="space-y-4">
                
                {/* 1. Website Design & Development */}
                <div 
                  onClick={() => onOpenQuote('Website Design & Development')}
                  className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex items-start gap-4 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0B2545] group-hover:bg-[#0284C7] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <Monitor className="w-6 h-6 text-[#38BDF8] group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545] group-hover:text-[#0284C7] uppercase tracking-wide transition-colors">
                      WEBSITE DESIGN & DEVELOPMENT
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Modern, responsive, and SEO-friendly websites that showcase your brand and convert visitors into customers.
                    </p>
                  </div>
                </div>

                {/* 2. Mobile App Development */}
                <div 
                  onClick={() => onOpenQuote('Mobile App Development')}
                  className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex items-start gap-4 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0B2545] group-hover:bg-[#0284C7] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <Smartphone className="w-6 h-6 text-[#38BDF8] group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545] group-hover:text-[#0284C7] uppercase tracking-wide transition-colors">
                      MOBILE APP DEVELOPMENT
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Custom mobile applications for Android and iOS that deliver seamless performance and exceptional user experience.
                    </p>
                  </div>
                </div>

                {/* 3. Software Development (Highlighted) */}
                <div 
                  onClick={() => onOpenQuote('Software Development')}
                  className="group p-4 rounded-2xl bg-white border-2 border-sky-300 hover:border-sky-500 hover:shadow-lg transition-all flex items-start gap-4 cursor-pointer relative"
                >
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-[#0284C7] text-white text-[9px] font-black uppercase tracking-wider">
                    Core Discipline
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545] group-hover:text-[#0284C7] uppercase tracking-wide transition-colors">
                      SOFTWARE DEVELOPMENT
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Scalable and secure software solutions tailored to your business needs and workflow, including custom portals and automated backend engines.
                    </p>
                  </div>
                </div>

                {/* 4. Software Management (Highlighted) */}
                <div 
                  onClick={() => onOpenQuote('Software Management & Maintenance')}
                  className="group p-4 rounded-2xl bg-white border-2 border-indigo-300 hover:border-indigo-500 hover:shadow-lg transition-all flex items-start gap-4 cursor-pointer relative"
                >
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider">
                    24/7 SLA Protection
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545] group-hover:text-indigo-600 uppercase tracking-wide transition-colors">
                      SOFTWARE MANAGEMENT
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      System maintenance, security updates, performance monitoring, speed optimization, and support to keep your software running at its best.
                    </p>
                  </div>
                </div>

                {/* 5. IT Consulting & Support */}
                <div 
                  onClick={() => onOpenQuote('IT Consulting & Support')}
                  className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex items-start gap-4 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0B2545] group-hover:bg-[#0284C7] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <Cloud className="w-6 h-6 text-[#38BDF8] group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545] group-hover:text-[#0284C7] uppercase tracking-wide transition-colors">
                      IT CONSULTING & SUPPORT
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Expert guidance and technical support to help you make the right technology decisions for your business.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: WHY CHOOSE US? Card + 3 Feature Badges */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* WHY CHOOSE US Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
                <div className="mb-5">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] uppercase font-display">
                    WHY <span className="text-[#0284C7]">CHOOSE US?</span>
                  </h2>
                  <div className="h-1.5 w-16 bg-[#0284C7] rounded-full mt-2"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      Experienced & Professional Team
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      Innovative & Scalable Solutions
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      Timely Delivery & Reliable Support
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      Focus on Quality & Client Satisfaction
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Value Pillars from Flyer (INNOVATIVE, RELIABLE, CLIENT FOCUSED) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. Innovative */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-2.5">
                    <Rocket className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <h4 className="font-black text-[#0B2545] text-xs uppercase tracking-wider">
                    INNOVATIVE
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    We use modern technologies to build future-ready solutions.
                  </p>
                </div>

                {/* 2. Reliable */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <h4 className="font-black text-[#0B2545] text-xs uppercase tracking-wider">
                    RELIABLE
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    We deliver secure, stable, and high-performance systems.
                  </p>
                </div>

                {/* 3. Client Focused */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-2.5">
                    <Users className="w-5 h-5 text-[#0284C7]" />
                  </div>
                  <h4 className="font-black text-[#0B2545] text-xs uppercase tracking-wider">
                    CLIENT FOCUSED
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Your goals are our priority. We build solutions that matter.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. Deep Navy Blue Contact Callout Banner with QR Code (Matching Flyer) */}
      <section className="bg-[#0B1E38] text-white py-8 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Box: LET'S BUILD THE FUTURE TOGETHER */}
            <div className="md:col-span-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                <PhoneCall className="w-7 h-7 text-sky-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-tight leading-snug">
                  LET'S BUILD<br />
                  THE FUTURE TOGETHER
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  We're ready to bring your ideas to life.
                </p>
              </div>
            </div>

            {/* Center: Contact Details Grid */}
            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="tel:09129216768"
                className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
              >
                <span className="p-1 rounded bg-sky-600/30 text-sky-300">📞</span>
                <span className="font-bold font-mono">09129216768</span>
              </a>

              <a
                href="mailto:oceantechnologies62@gmail.com"
                className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors break-all"
              >
                <span className="p-1 rounded bg-sky-600/30 text-sky-300">✉️</span>
                <span className="font-medium text-[11px]">oceantechnologies62@gmail.com</span>
              </a>

              <div className="flex items-center gap-2 text-slate-200">
                <span className="p-1 rounded bg-sky-600/30 text-sky-300">🌐</span>
                <span className="font-mono text-[11px]">www.ocean-f4gj.orrender.com</span>
              </div>

              <div className="flex items-center gap-2 text-slate-200">
                <span className="p-1 rounded bg-sky-600/30 text-sky-300">📍</span>
                <span className="font-medium">Agbani, Enugu State, Nigeria</span>
              </div>
            </div>

            {/* Right: SCAN ME QR Code Card */}
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-3.5">
              {/* Precision Vector QR Code representation */}
              <div className="bg-white p-2 rounded-xl shadow-md shrink-0">
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="30" height="30" rx="3" stroke="#0B2545" strokeWidth="6" />
                  <rect x="14" y="14" width="12" height="12" fill="#0284C7" />

                  {/* Top-right position marker */}
                  <rect x="65" y="5" width="30" height="30" rx="3" stroke="#0B2545" strokeWidth="6" />
                  <rect x="74" y="14" width="12" height="12" fill="#0284C7" />

                  {/* Bottom-left position marker */}
                  <rect x="5" y="65" width="30" height="30" rx="3" stroke="#0B2545" strokeWidth="6" />
                  <rect x="14" y="74" width="12" height="12" fill="#0284C7" />

                  {/* Data matrix dots */}
                  <rect x="42" y="10" width="8" height="8" fill="#0B2545" />
                  <rect x="42" y="24" width="8" height="8" fill="#0284C7" />
                  <rect x="54" y="16" width="6" height="6" fill="#0B2545" />
                  <rect x="10" y="42" width="8" height="8" fill="#0B2545" />
                  <rect x="24" y="42" width="8" height="8" fill="#0284C7" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#0B2545" />
                  <rect x="64" y="42" width="8" height="8" fill="#0284C7" />
                  <rect x="80" y="42" width="10" height="8" fill="#0B2545" />
                  <rect x="42" y="64" width="8" height="8" fill="#0284C7" />
                  <rect x="54" y="72" width="12" height="8" fill="#0B2545" />
                  <rect x="72" y="64" width="16" height="8" fill="#0B2545" />
                  <rect x="74" y="78" width="12" height="12" fill="#0284C7" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-black tracking-wider text-sky-400 uppercase block">
                  SCAN ME
                </span>
                <span className="text-[11px] text-slate-300 block">
                  to visit our website
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Bottom Service Ribbon Bar & Official Motto */}
      <section className="bg-[#071526] text-slate-300 py-3.5 px-4 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* 5 Service Badges in Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-semibold uppercase tracking-wider text-[11px] text-slate-200">
            <span className="flex items-center gap-1.5 hover:text-sky-300 transition-colors">
              <Monitor className="w-3.5 h-3.5 text-sky-400" />
              <span>WEBSITE DEVELOPMENT</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 hover:text-sky-300 transition-colors">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>MOBILE APP DEVELOPMENT</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 hover:text-sky-300 transition-colors">
              <Code2 className="w-3.5 h-3.5 text-sky-400" />
              <span>SOFTWARE SOLUTIONS</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 hover:text-sky-300 transition-colors">
              <Settings className="w-3.5 h-3.5 text-sky-400" />
              <span>SOFTWARE MANAGEMENT</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 hover:text-sky-300 transition-colors">
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span>IT CONSULTING & SUPPORT</span>
            </span>
          </div>

          {/* Official Brand Motto in Vibrant Cyan */}
          <div className="font-black tracking-[0.2em] text-[#38BDF8] uppercase text-xs sm:text-sm shrink-0 font-display">
            INNOVATE • EDUCATE • EMPOWER
          </div>

        </div>
      </section>

    </div>
  );
};
