import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Smartphone, 
  Code2, 
  Wrench, 
  Palette,
  Server,
  CreditCard,
  Lock,
  Layers
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface ProjectCostCalculatorProps {
  onOpenQuote?: (serviceId?: string, customScope?: string) => void;
  onOpenCourseRegistration?: () => void;
  variant?: 'embedded' | 'standalone';
}

interface ProjectTypeOption {
  id: string;
  name: string;
  basePrice: number;
  baseDays: number;
  icon: React.ReactNode;
  description: string;
}

const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    id: 'web',
    name: 'Modern Business Website',
    basePrice: 150000,
    baseDays: 14,
    icon: <Globe className="w-5 h-5 text-sky-600" />,
    description: 'High-speed responsive corporate site, SEO optimized, lead capture forms.'
  },
  {
    id: 'app',
    name: 'Cross-Platform Mobile App',
    basePrice: 380000,
    baseDays: 28,
    icon: <Smartphone className="w-5 h-5 text-indigo-600" />,
    description: 'Native iOS & Android app built with React Native / Flutter, offline sync & push.'
  },
  {
    id: 'portal',
    name: 'Custom Web Portal / SaaS',
    basePrice: 450000,
    baseDays: 30,
    icon: <Code2 className="w-5 h-5 text-emerald-600" />,
    description: 'Enterprise portals, school management systems, automated workflows & APIs.'
  },
  {
    id: 'maintenance',
    name: 'Monthly Maintenance & SLA',
    basePrice: 35000,
    baseDays: 1,
    icon: <Wrench className="w-5 h-5 text-amber-600" />,
    description: 'Proactive 24/7 uptime monitoring, security patching, daily backups & bug fixes.'
  },
  {
    id: 'branding',
    name: 'Brand Identity & Graphics',
    basePrice: 65000,
    baseDays: 7,
    icon: <Palette className="w-5 h-5 text-purple-600" />,
    description: 'Vector logo suite, typography guide, social media kit & marketing stationery.'
  }
];

interface AddonOption {
  id: string;
  label: string;
  price: number;
  extraDays: number;
  icon: React.ReactNode;
  category?: string;
}

const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'payments',
    label: 'Paystack / Flutterwave Payment Gateway',
    price: 45000,
    extraDays: 3,
    icon: <CreditCard className="w-4 h-4 text-emerald-600" />
  },
  {
    id: 'auth_rbac',
    label: 'User Auth & Role-Based Permissions (RBAC)',
    price: 55000,
    extraDays: 4,
    icon: <Lock className="w-4 h-4 text-sky-600" />
  },
  {
    id: 'admin_dashboard',
    label: 'Admin Analytics & Content Management Portal',
    price: 75000,
    extraDays: 5,
    icon: <Layers className="w-4 h-4 text-indigo-600" />
  },
  {
    id: 'ai_assistant',
    label: 'AI Chatbot / Intelligent Logic Integration',
    price: 85000,
    extraDays: 6,
    icon: <Sparkles className="w-4 h-4 text-purple-600" />
  },
  {
    id: 'cloud_backup',
    label: 'Automated Offsite Cloud Backups & Redundancy',
    price: 30000,
    extraDays: 2,
    icon: <Server className="w-4 h-4 text-cyan-600" />
  },
  {
    id: 'speed_seo',
    label: 'Advanced Speed Optimization & Local Agbani SEO',
    price: 35000,
    extraDays: 3,
    icon: <Zap className="w-4 h-4 text-amber-600" />
  }
];

export const ProjectCostCalculator: React.FC<ProjectCostCalculatorProps> = ({
  onOpenQuote,
  onOpenCourseRegistration,
  variant = 'embedded'
}) => {
  const [selectedType, setSelectedType] = useState<string>('web');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['payments', 'speed_seo']);
  const [urgency, setUrgency] = useState<'standard' | 'priority' | 'rush'>('standard');

  const activeProjectType = PROJECT_TYPES.find((p) => p.id === selectedType) || PROJECT_TYPES[0];

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    let subtotal = activeProjectType.basePrice;
    let days = activeProjectType.baseDays;

    for (const addonId of selectedAddons) {
      const addon = ADDON_OPTIONS.find((a) => a.id === addonId);
      if (addon) {
        subtotal += addon.price;
        days += addon.extraDays;
      }
    }

    let multiplier = 1;
    if (urgency === 'priority') {
      multiplier = 1.15;
      days = Math.max(3, Math.round(days * 0.75));
    } else if (urgency === 'rush') {
      multiplier = 1.35;
      days = Math.max(2, Math.round(days * 0.5));
    }

    const totalEstimate = Math.round(subtotal * multiplier);
    const lowRange = Math.round(totalEstimate * 0.95);
    const highRange = Math.round(totalEstimate * 1.15);

    return {
      total: totalEstimate,
      lowRange,
      highRange,
      days,
      weeks: Math.max(1, Math.round(days / 7))
    };
  }, [selectedType, selectedAddons, urgency, activeProjectType]);

  const formattedWhatsAppUrl = useMemo(() => {
    const addonNames = selectedAddons
      .map((id) => ADDON_OPTIONS.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const text = encodeURIComponent(
      `Hello Ocean Technologies!\nI used your online Project Cost Calculator to estimate my project:\n• Project Type: ${activeProjectType.name}\n• Selected Modules: ${addonNames || 'Standard Core Features'}\n• Speed Priority: ${urgency.toUpperCase()}\n• Estimated Budget: ₦${calculation.lowRange.toLocaleString()} – ₦${calculation.highRange.toLocaleString()}\n• Estimated Timeline: ~${calculation.days} Days (~${calculation.weeks} Weeks)\n\nCan we discuss starting this development?`
    );
    return `https://wa.me/2349129216768?text=${text}`;
  }, [activeProjectType, selectedAddons, urgency, calculation]);

  const handleApplyQuote = () => {
    if (onOpenQuote) {
      const scopeSummary = `${activeProjectType.name} with: ${selectedAddons.join(', ')} (${urgency} speed, est. ₦${calculation.lowRange.toLocaleString()}-₦${calculation.highRange.toLocaleString()})`;
      onOpenQuote(activeProjectType.name, scopeSummary);
    }
  };

  return (
    <div className={`ocean-card rounded-2xl sm:rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm ${variant === 'standalone' ? 'my-8' : ''}`}>
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-400/30">
              <Calculator className="w-3.5 h-3.5 text-sky-400" />
              <span>Transparent Project Scope & Pricing Calculator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
              Instant Software & Website Cost Estimator
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Configure your desired digital system and get a realistic Nigerian Naira (₦) estimate and delivery timeline in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Transparent Pricing</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Step 1: Select Project Category */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Step 1: Select Your Core Project Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROJECT_TYPES.map((pt) => {
              const isSelected = selectedType === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedType(pt.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50/70 border-sky-500 ring-2 ring-sky-500/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                      {pt.icon}
                    </div>
                    {isSelected && (
                      <span className="text-sky-600">
                        <CheckCircle2 className="w-5 h-5 fill-sky-600 text-white" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 font-display">
                      {pt.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-1">
                      {pt.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">From</span>
                    <span className="font-bold text-slate-800 font-mono">₦{pt.basePrice.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Technical Add-ons & Integrations */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Step 2: Select Additional Modules & Features Needed
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADDON_OPTIONS.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-sky-50/50 border-sky-400 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${isChecked ? 'bg-sky-100 text-sky-700' : 'bg-white border border-slate-200'}`}>
                      {addon.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {addon.label}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        +₦{addon.price.toLocaleString()} • +{addon.extraDays} days
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 shrink-0 pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Speed & Timeline Priority */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Step 3: Timeline & Delivery Urgency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'standard', label: 'Standard Delivery', desc: 'Careful quality sprints, standard QA cycles' },
              { id: 'priority', label: 'Priority Sprint (+15%)', desc: 'Dedicated engineer allocation, expedited delivery' },
              { id: 'rush', label: 'Rush Emergency (+35%)', desc: 'Overtime shifts, fastest possible production launch' }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setUrgency(option.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  urgency === option.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{option.label}</span>
                </div>
                <p className={`text-[11px] ${urgency === option.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {option.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100 rounded-2xl p-6 border border-sky-200/80 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Result Columns */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  Estimated Investment Scope
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-600 font-medium">Billed in Nigerian Naira (₦)</span>
              </div>

              <div>
                <span className="text-2xl sm:text-4xl font-black font-display text-slate-950 tracking-tight">
                  ₦{calculation.lowRange.toLocaleString()} – ₦{calculation.highRange.toLocaleString()}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Estimated based on selected scope ({selectedAddons.length} extra modules, {urgency} speed).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Timeline: ~{calculation.days} Business Days (~{calculation.weeks} Weeks)</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Includes 30-Day Post-Launch Warranty</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="md:col-span-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleApplyQuote}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Formal Quote with this Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={formattedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp: {COMPANY_INFO.phone}</span>
              </a>

              <p className="text-[10px] text-slate-500 text-center">
                Need bespoke consulting? Call <a href={COMPANY_INFO.phoneTel} className="font-bold text-slate-700 underline">{COMPANY_INFO.phone}</a>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
