import React, { useState } from 'react';
import { ViewMode } from '../types';
import { SERVICES, MAINTENANCE_PLANS, CASE_STUDIES, TESTIMONIALS, WHY_CHOOSE_US, COMPANY_INFO } from '../data/companyData';
import { FlyerHeroSection } from '../components/FlyerHeroSection';
import { 
  Globe, 
  Smartphone, 
  Wrench, 
  Bug, 
  Server, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Code2,
  GraduationCap,
  Award,
  Building2,
  Palette,
  Cpu
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
  onOpenIssueReport: () => void;
  onOpenCourseRegistration?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenQuote,
  onOpenIssueReport,
  onOpenCourseRegistration,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'web' | 'app' | 'software' | 'maintenance'>('all');

  const filteredServices = SERVICES.filter((s) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ai') return s.category === 'AI Learning & Mentorship';
    if (activeTab === 'web') return s.category === 'Website Development';
    if (activeTab === 'app') return s.category === 'Mobile App Development';
    if (activeTab === 'software') return s.category === 'Software Development & Management' || s.category === 'Software Engineering' || s.category === 'Software Management' || s.category === 'Custom Portals & APIs';
    if (activeTab === 'maintenance') return s.category === 'Software Development & Management' || s.category === 'Website Maintenance' || s.category === 'Software Troubleshooting';
    return true;
  });

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-6 h-6 text-sky-600" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-indigo-600" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-emerald-600" />;
      case 'Bug': return <Bug className="w-6 h-6 text-amber-600" />;
      case 'Server': return <Server className="w-6 h-6 text-cyan-600" />;
      case 'Settings': return <Wrench className="w-6 h-6 text-indigo-600" />;
      case 'Palette': return <Palette className="w-6 h-6 text-pink-600" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-indigo-600" />;
      default: return <Code2 className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      
      {/* 1. Official Flyer Hero Section matching user design */}
      <FlyerHeroSection
        onNavigate={onNavigate}
        onOpenQuote={onOpenQuote}
        onOpenIssueReport={onOpenIssueReport}
        onOpenCourseRegistration={onOpenCourseRegistration}
      />

      {/* 2. AI Assistant Feature Strip */}
      <section className="bg-gradient-to-r from-sky-900 via-slate-900 to-blue-950 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
              <Sparkles className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Need an Instant Project Estimate or Emergency Bug Diagnosis?</h3>
                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-400/30">AI Powered</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Use our built-in Ocean AI Consultant to calculate Nigerian Naira (₦) estimates, select modern tech stacks, or troubleshoot server errors 24/7.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const btn = document.getElementById('ocean-ai-assistant-toggle');
              btn?.click();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>Launch Ocean AI Assistant</span>
          </button>
        </div>
      </section>

      {/* 3. Core Software Services */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
            Engineering & Maintenance Expertise
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display mt-2">
            What We Do at Ocean Technologies
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            From ground-up software development to proactive monthly maintenance and emergency code fixes, we provide complete engineering support.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'ai', label: 'AI Learning & Mentorship' },
              { id: 'web', label: 'Website Development' },
              { id: 'app', label: 'Mobile Apps' },
              { id: 'software', label: 'Software Development & Management' },
              { id: 'maintenance', label: 'Maintenance & Troubleshooting' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {service.isPopular && (
                <div className="absolute top-4 right-4 bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 inline-block mb-4 group-hover:scale-105 transition-transform">
                  {getServiceIcon(service.iconName)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                  {service.title}
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  {service.keyBenefits.slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {service.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Starting From</span>
                  <span className="text-sm font-bold text-slate-900 font-display">
                    ₦{service.startingPriceNGN.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
          >
            <span>Explore all services, deliverables, and tech stack in detail</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Dedicated Maintenance & Support Retainers Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3 border border-emerald-200">
                <Wrench className="w-3.5 h-3.5" />
                <span>Proactive Website Maintenance & Care Plans</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
                Never Worry About Website Crashes, Hacks, or Bugs
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                We maintain, backup, update, and protect your website on a predictable monthly retainer so you focus on sales and clients.
              </p>
            </div>

            <button
              onClick={() => onNavigate('maintenance')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Maintenance Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MAINTENANCE_PLANS.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 transition-all flex flex-col justify-between ${
                  plan.isPopular
                    ? 'bg-slate-900 text-white shadow-xl ring-2 ring-sky-500 relative'
                    : 'bg-slate-50 border border-slate-200 text-slate-900'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular Retainer
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-bold font-display ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                  </div>

                  <p className={`text-xs mb-4 ${plan.isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                    {plan.tagline}
                  </p>

                  <div className="mb-6">
                    <span className={`text-2xl font-black font-display ${plan.isPopular ? 'text-sky-400' : 'text-slate-900'}`}>
                      {plan.priceNGN}
                    </span>
                    <span className={`text-xs block mt-1 ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                      SLA: Response {plan.responseTime}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs mb-6">
                    {plan.features.slice(0, 5).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={plan.isPopular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onOpenQuote(plan.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold'
                      : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-800'
                  }`}
                >
                  Select {plan.name}
                </button>
              </div>
            ))}
          </div>

          {/* Emergency Triage Callout Banner */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-amber-950 font-display">
                  Have an urgent website error, broken checkout, or crash right now?
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Our emergency response team in Agbani handles urgent one-off bug fixes within 2 hours.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={COMPANY_INFO.phoneTel}
                className="px-4 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>

              <button
                onClick={onOpenIssueReport}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Open Emergency Bug Ticket
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Ocean Technologies */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
              Engineering Excellence • Global Quality
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display mt-2 mb-6">
              Why Businesses & Students Choose Ocean Technologies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              We combine deep technical software expertise with responsive customer communication, rapid emergency turnarounds, strategic IT consulting, and 100% online mentorship cohorts across Nigeria and beyond.
            </p>

            <div className="space-y-4">
              {WHY_CHOOSE_US.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-lg shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agbani Office Card & Quick Inquiries */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Tech Office Imagery Banner */}
            <div className="relative h-44 w-full bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
                alt="Ocean Technologies Agbani Engineering Hub"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-base font-display">Ocean Technologies Development Hub</h3>
                  <p className="text-xs text-sky-300">Software Engineering & Technical Academy</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Enterprise Solutions
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3.5 text-xs text-slate-700 mb-6">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Corporate Engineering Office:</strong><br />
                    Ocean Technologies Software Development & Innovation Hub
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Hotline:</strong> <a href={COMPANY_INFO.phoneTel} className="text-emerald-700 font-bold hover:underline">{COMPANY_INFO.phone}</a>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>WhatsApp:</strong> <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">09129216768</a>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    <strong>Hours:</strong> Mon – Sat: 8:00 AM – 7:00 PM (WAT)
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1 mb-6">
                <p className="font-semibold text-slate-900">Direct Inquiries:</p>
                <a href={COMPANY_INFO.emailMailto} className="text-sky-600 font-medium hover:underline block break-all">
                  {COMPANY_INFO.email}
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide transition-colors text-center cursor-pointer shadow-xs"
                >
                  Contact Office
                </button>
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 Software Development, Software Management & IT Consulting (Mature Online Solutions) */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Direct Engineering Partnerships • 100% Online Operations</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
              Software Development & Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">& Creative Branding</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4">
              We partner directly with business owners, founders, and enterprises online. With our engineering-led approach, you get dedicated software experts who build custom systems, manage production infrastructure 24/7, and deliver cohesive brand identities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Unified Pillar 1: Software Development & Management */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-sm md:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Integrated Lifecycle</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-display">Software Development & Management</h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  End-to-end software engineering combined with proactive lifecycle management. We architect, build, and continuously optimize high-performance web applications, mobile platforms, custom internal portals, and automated database APIs — then protect them with 24/7 uptime monitoring, security patching, and ongoing feature updates.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-700/60 text-xs text-slate-300">
                  <div className="space-y-2">
                    <p className="font-semibold text-sky-300 uppercase text-[10px] tracking-wider">Engineering & Architecture</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Custom web portals, SaaS platforms & mobile apps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>REST/GraphQL APIs & automated database backends</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Clean architecture, secure authentication & payments</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-emerald-300 uppercase text-[10px] tracking-wider">Proactive Management & SLA</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>24/7 uptime monitoring, health checks & alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Security patches, automated backups & disaster recovery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Speed optimization, database indexing & continuous updates</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-mono">Dedicated Engineering Sprints</span>
                <button
                  onClick={() => onNavigate('services')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Explore Software Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pillar 2: Graphics Design & Brand Identity */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between hover:border-purple-500/50 transition-all shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Creative Direction</span>
                  <h3 className="text-lg font-bold text-white font-display mt-0.5">Graphics Design & Branding</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Professional brand visual identity, custom corporate logos, typography, marketing collateral, and digital advertising assets.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Custom vector logo & brand style guides</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Social media graphics & advertising kits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Print-ready stationery, brochures & rollups</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('services')}
                  className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>View Creative Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Footer Strip */}
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">Looking for custom software engineering, AI learning, or 1-on-1 mentorship?</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct phone & WhatsApp: 09129216768 • Online Academy & Mentorship tracks active</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {onOpenCourseRegistration && (
                <button
                  onClick={onOpenCourseRegistration}
                  className="px-4 py-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>AI & Tech Courses</span>
                </button>
              )}
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Consultant</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Case Studies & Proven Results */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
                Proven Track Record
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                Recent Projects & Case Studies
              </h2>
            </div>
            <button
              onClick={() => onNavigate('portfolio')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Portfolio Work</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CASE_STUDIES.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                {/* Project Image Header */}
                {item.imageUrl && (
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-600 text-white shadow-md uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                      <span className="font-medium">{item.client}</span>
                      <span className="text-amber-400 font-bold">5.0 ★</span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {!item.imageUrl && (
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.location}
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-slate-900 font-display mb-2 group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4 space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-800">Challenge:</strong> <span className="text-slate-600">{item.challenge}</span>
                    </div>
                    <div>
                      <strong className="text-sky-700">Solution:</strong> <span className="text-slate-600">{item.solution}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="bg-slate-50 py-2 px-1 rounded-lg">
                        <p className="text-xs font-bold text-slate-900">{m.value}</p>
                        <p className="text-[10px] text-slate-500 truncate">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Client Testimonials */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
            Client Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
            Trusted by Businesses & Organizations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.clientName}</p>
                  <p className="text-[11px] text-slate-500">{item.company} • {item.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Final High-Impact CTA Banner */}
      <section className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-3 py-1 bg-sky-800/80 text-sky-300 text-xs font-bold rounded-full border border-sky-600/30">
            Enterprise Software • Modern Web & Mobile Systems • Technical Academy
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
            Ready to Build Your Website or Fix Your Software?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Contact Ocean Technologies today. Get high quality web and app engineering with fast turnaround times and reliable maintenance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Contact Engineering Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp: {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
