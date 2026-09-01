import React, { useState } from 'react';
import { ViewMode } from '../types';
import { SERVICES, MAINTENANCE_PLANS, CASE_STUDIES, TESTIMONIALS, WHY_CHOOSE_US, COMPANY_INFO } from '../data/companyData';
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
  MapPin, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Code2
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
  onOpenIssueReport: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenQuote,
  onOpenIssueReport
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'app' | 'maintenance'>('all');

  const filteredServices = SERVICES.filter((s) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'web') return s.category === 'Website Development';
    if (activeTab === 'app') return s.category === 'Mobile App Development';
    if (activeTab === 'maintenance') return s.category === 'Website Maintenance' || s.category === 'Software Troubleshooting';
    return true;
  });

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-6 h-6 text-sky-600" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-indigo-600" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-emerald-600" />;
      case 'Bug': return <Bug className="w-6 h-6 text-amber-600" />;
      case 'Server': return <Server className="w-6 h-6 text-cyan-600" />;
      default: return <Code2 className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-white border-b border-slate-200 overflow-hidden">
        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 rounded-full filter blur-3xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full filter blur-3xl opacity-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            
            {/* Location & Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-6 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
              </span>
              <span>Agbani, Enugu State, Nigeria • ESUT Corridor</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.15] mb-6">
              Professional <span className="text-sky-600">Website Development</span>, Mobile Apps & Continuous <span className="text-slate-800">Software Maintenance</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl font-normal">
              We engineer fast websites, native mobile applications, and provide 24/7 software troubleshooting for businesses in Enugu State and across Nigeria. Whether launching a new platform or fixing a broken site, we deliver dependable results.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                id="hero-request-quote-cta"
                onClick={() => onOpenQuote()}
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get a Free Project Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-emergency-fix-cta"
                onClick={onOpenIssueReport}
                className="px-5 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Fix Broken Site / Emergency Bug</span>
              </button>

              <a
                id="hero-call-cta"
                href={COMPANY_INFO.phoneTel}
                className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-black text-slate-900 font-display">120+</p>
                <p className="text-xs text-slate-500 font-medium">Projects Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 font-display">99.9%</p>
                <p className="text-xs text-slate-500 font-medium">Uptime Guarantee</p>
              </div>
              <div>
                <p className="text-2xl font-black text-sky-600 font-display">&lt; 2 Hrs</p>
                <p className="text-xs text-slate-500 font-medium">Emergency Triage</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 font-display">₦25k/mo</p>
                <p className="text-xs text-slate-500 font-medium">Starter Maintenance</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Direct Contact Notice Strip */}
      <section className="bg-slate-900 text-white py-4 px-4 border-y border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-md bg-sky-600 text-white">
              <MapPin className="w-4 h-4" />
            </span>
            <span>
              <strong>Physical Office:</strong> Agbani, Enugu State, Nigeria (ESUT Corridor)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a 
              href={COMPANY_INFO.emailMailto}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>Email:</span>
              <strong className="text-sky-300">{COMPANY_INFO.email}</strong>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a 
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: 09129216768</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2.5 AI Assistant Feature Strip */}
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
              { id: 'web', label: 'Website Development' },
              { id: 'app', label: 'Mobile Apps' },
              { id: 'maintenance', label: 'Maintenance & Troubleshooting' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-xs'
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
                  onClick={() => onOpenQuote(service.id)}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Request Quote</span>
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
              Local Presence • Global Quality
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display mt-2 mb-6">
              Why Businesses in Enugu & Nigeria Choose Ocean Technologies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              We combine deep technical software expertise with responsive customer communication. Located in Agbani, Enugu State (ESUT Corridor), we are accessible for in-person consultations, emergency software hotlines, and long-term tech partnerships.
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
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-lg">
                OT
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-display">Ocean Technologies Office</h3>
                <p className="text-xs text-slate-500">Agbani, Enugu State, Nigeria</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Physical Address:</strong><br />
                  Agbani, Enugu State, Nigeria (ESUT Corridor, Enugu State University of Science and Technology)
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

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2 mb-6">
              <p className="font-semibold text-slate-900">Direct Email Inquiries:</p>
              <a href={COMPANY_INFO.emailMailto} className="text-sky-600 font-medium hover:underline block break-all">
                {COMPANY_INFO.email}
              </a>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onOpenQuote()}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide transition-colors text-center cursor-pointer"
              >
                Request Quote
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CASE_STUDIES.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
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
                      <strong className="text-sky-700">Solution Delivered:</strong> <span className="text-slate-600">{item.solution}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  {item.metrics.map((m, idx) => (
                    <div key={idx} className="bg-slate-50 py-1.5 px-1 rounded-lg">
                      <p className="text-xs font-bold text-slate-900">{m.value}</p>
                      <p className="text-[10px] text-slate-500 truncate">{m.label}</p>
                    </div>
                  ))}
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
            Agbani • Enugu State • Nigeria
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
            Ready to Build Your Website or Fix Your Software?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Contact Ocean Technologies today. Get high quality web and app engineering with fast turnaround times and reliable maintenance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenQuote()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request Free Project Quote</span>
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
