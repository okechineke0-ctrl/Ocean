import React, { useState } from 'react';
import { ViewMode, ServiceCategory } from '../types';
import { SERVICES, COMPANY_INFO } from '../data/companyData';
import { 
  Globe, 
  Smartphone, 
  Wrench, 
  Bug, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Code, 
  Layers, 
  Clock, 
  Zap, 
  ShieldCheck,
  Phone,
  MessageCircle
} from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
  onOpenIssueReport: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigate,
  onOpenQuote,
  onOpenIssueReport
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES[0].id);

  const categories: ServiceCategory[] = [
    'All',
    'Website Development',
    'Mobile App Development',
    'Software Engineering',
    'Software Management',
    'Website Maintenance',
    'Software Troubleshooting',
    'Custom Portals & APIs'
  ];

  const filteredServices = SERVICES.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  const activeService = SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0];

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-5 h-5 text-sky-600" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-emerald-600" />;
      case 'Bug': return <Bug className="w-5 h-5 text-amber-600" />;
      case 'Server': return <Server className="w-5 h-5 text-cyan-600" />;
      case 'Settings': return <Layers className="w-5 h-5 text-indigo-600" />;
      default: return <Code className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Page Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
              Ocean Technologies Solutions • Agbani, Enugu State
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display mt-2 mb-4">
              Website & Mobile App Engineering & Software Maintenance
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We design, build, maintain, and troubleshoot software systems. Every project is built for speed, airtight security, and clean code that is easy to scale.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Services List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Select a service to view full specifications:
            </p>
            {filteredServices.map((service) => {
              const isSelected = service.id === activeService.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-sky-600 shadow-md ring-1 ring-sky-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-sky-50' : 'bg-slate-50'}`}>
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900 font-display">
                          {service.title}
                        </h3>
                        {service.isPopular && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {service.tagline}
                      </p>
                      <div className="flex items-center justify-between mt-3 text-[11px]">
                        <span className="text-slate-400 font-medium">From ₦{service.startingPriceNGN.toLocaleString()}</span>
                        <span className="text-sky-600 font-semibold flex items-center gap-1">
                          <span>View Spec</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Service Detailed Panel (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  {getServiceIcon(activeService.iconName)}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                    {activeService.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                    {activeService.title}
                  </h2>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-slate-400 block font-medium">Starting From</span>
                <span className="text-xl font-bold text-slate-900 font-display">
                  ₦{activeService.startingPriceNGN.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {activeService.description}
            </p>

            {/* Key Benefits */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Key Technical & Business Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeService.keyBenefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                What You Receive (Deliverables)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeService.deliverables.map((d, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0"></div>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-8 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Technologies Used:</span>
                <div className="flex flex-wrap gap-1">
                  {activeService.technologies.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Standard Delivery Timeline:</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>{activeService.deliveryTime}</span>
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onOpenQuote(activeService.id)}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Quote for {activeService.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Hotline</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Software Issue Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold font-display text-white mb-1">
              Have an Existing Website with Bugs or Crash Errors?
            </h3>
            <p className="text-xs text-slate-300">
              We provide rapid troubleshooting for WordPress, custom React/Node apps, Paystack checkouts, and database deadlocks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenIssueReport}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Report Emergency Bug
            </button>
            <a
              href={COMPANY_INFO.phoneTel}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
