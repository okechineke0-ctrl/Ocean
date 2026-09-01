import React, { useState } from 'react';
import { ViewMode } from '../types';
import { CASE_STUDIES, COMPANY_INFO } from '../data/companyData';
import { 
  FolderGit2, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  ExternalLink, 
  Code, 
  Star,
  Layers,
  Sparkles
} from 'lucide-react';

interface PortfolioViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onNavigate,
  onOpenQuote
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Website Development', 'Mobile App Development', 'Software Rescue & Maintenance', 'Custom Portal'];

  const filteredProjects = CASE_STUDIES.filter((c) => {
    if (filterCategory === 'All') return true;
    return c.category === filterCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
              Ocean Technologies Portfolio & Case Studies
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display mt-2 mb-4">
              Real-World Engineering, Software Rescues & Digital Systems
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore how our engineering team builds high-converting websites, robust mobile applications, and provides emergency troubleshooting across Agbani, Enugu State, and Nigeria.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat
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

      {/* Projects Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Visual Project Mockup Header */}
              {project.imageUrl && (
                <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden border-b border-slate-200">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  
                  {/* Category Pill Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-600 text-white shadow-md uppercase tracking-wider backdrop-blur-md">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-200 border border-slate-700/60 backdrop-blur-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" />
                      <span>{project.location}</span>
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 text-amber-400 text-xs font-bold shadow-md">
                    <span>★</span>
                    <span className="text-white font-semibold">5.0</span>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {!project.imageUrl && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wide">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 font-display mb-2 group-hover:text-sky-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs font-medium text-slate-500 mb-4">
                  Client: <strong className="text-slate-800">{project.client}</strong> ({project.clientType})
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {project.summary}
                </p>

                {/* Challenge & Solution Breakdown */}
                <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs mb-6">
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">The Challenge:</span>
                    <p className="text-slate-600">{project.challenge}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="font-bold text-sky-700 block mb-0.5">Engineered Solution:</span>
                    <p className="text-slate-600">{project.solution}</p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                  {project.metrics.map((m, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-black text-slate-900 font-display">{m.value}</p>
                      <p className="text-[10px] text-slate-500 truncate">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Production Deployment</span>
                </div>

                <button
                  onClick={() => onOpenQuote()}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Build Similar System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Project CTA Banner */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 font-display">
            Have a Specific Project Idea in Mind?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Whether you need a custom web portal, high-speed mobile app, or software maintenance agreement, we offer free engineering consultations in Agbani or remotely.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenQuote()}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Request Free Consultation & Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={COMPANY_INFO.phoneTel}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Call Hotline: {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
