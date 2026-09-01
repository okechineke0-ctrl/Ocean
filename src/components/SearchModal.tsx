import React, { useState, useMemo } from 'react';
import { SERVICES, MAINTENANCE_PLANS, CASE_STUDIES, FAQS } from '../data/companyData';
import { ViewMode } from '../types';
import { 
  Search, 
  X, 
  ArrowRight, 
  Globe, 
  Wrench, 
  Smartphone, 
  HelpCircle, 
  FolderGit2 
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewMode) => void;
  onSelectService: (serviceId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectService
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const serviceMatches = SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.technologies.some((t) => t.toLowerCase().includes(q))
    ).map((s) => ({
      type: 'service' as const,
      id: s.id,
      title: s.title,
      subtitle: s.tagline,
      view: 'services' as ViewMode,
      icon: <Globe className="w-4 h-4 text-sky-600" />
    }));

    const planMatches = MAINTENANCE_PLANS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.bestFor.toLowerCase().includes(q)
    ).map((p) => ({
      type: 'plan' as const,
      id: p.id,
      title: p.name,
      subtitle: `${p.priceNGN} • ${p.tagline}`,
      view: 'maintenance' as ViewMode,
      icon: <Wrench className="w-4 h-4 text-emerald-600" />
    }));

    const caseMatches = CASE_STUDIES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.client.toLowerCase().includes(q) ||
        c.challenge.toLowerCase().includes(q) ||
        c.technologies.some((t) => t.toLowerCase().includes(q))
    ).map((c) => ({
      type: 'case' as const,
      id: c.id,
      title: c.title,
      subtitle: `${c.client} • ${c.category}`,
      view: 'portfolio' as ViewMode,
      icon: <FolderGit2 className="w-4 h-4 text-indigo-600" />
    }));

    const faqMatches = FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    ).map((f) => ({
      type: 'faq' as const,
      id: f.id,
      title: f.question,
      subtitle: f.answer.substring(0, 80) + '...',
      view: 'contact' as ViewMode,
      icon: <HelpCircle className="w-4 h-4 text-amber-600" />
    }));

    return [...serviceMatches, ...planMatches, ...caseMatches, ...faqMatches];
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search website development, app maintenance, bug fixes, pricing..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-slate-400 hover:text-slate-600 bg-slate-100 rounded border border-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="p-4 text-xs text-slate-400 space-y-3">
              <p className="font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                Suggested Searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Website Development', 'Mobile App', 'Maintenance Retainers', 'Emergency Bug Fix', 'Paystack Integration', 'Agbani Office'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <p>No matches found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching "website", "maintenance", or "apps"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onNavigate(item.view);
                    if (item.type === 'service') {
                      onSelectService(item.id);
                    }
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-xs transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-sky-700 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
