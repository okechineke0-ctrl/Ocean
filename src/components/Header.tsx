import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { ViewMode } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { 
  Search, 
  Globe, 
  Smartphone, 
  Wrench, 
  AlertTriangle, 
  Building2, 
  Phone, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Clock,
  Database
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenQuote: (serviceId?: string) => void;
  onOpenIssueReport: () => void;
  onOpenSearch: () => void;
  onOpenInternship?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenQuote,
  onOpenIssueReport,
  onOpenSearch,
  onOpenInternship
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState<number[]>([]);

  const handleLogoClick = () => {
    const now = Date.now();
    const recentClicks = [...logoClicks.filter((t) => now - t < 1500), now];
    setLogoClicks(recentClicks);

    if (recentClicks.length >= 3) {
      setLogoClicks([]);
      onNavigate('admin-inbox');
      setMobileMenuOpen(false);
    } else {
      onNavigate('home');
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Globe className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance Plans', icon: <Wrench className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'emergency-fix', label: 'Emergency Fix', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
    { id: 'about', label: 'About Us', icon: <Building2 className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Advisory / Institutional Contact Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-[11px] py-1.5 px-4 sm:px-8 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-sky-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Office: Agbani, Enugu State (Near ESUT)
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <button
              onClick={() => onOpenInternship ? onOpenInternship() : onOpenQuote('Internship / IT & SIWES Placement')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/30 transition-colors font-medium text-[11px] cursor-pointer"
            >
              <span className="text-xs">🎓</span>
              <span>Open for Internships, IT & SIWES</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-slate-300">
            <a 
              href={COMPANY_INFO.phoneTel} 
              className="hover:text-white font-semibold flex items-center gap-1 text-emerald-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a 
              href={COMPANY_INFO.whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-300 hidden sm:flex items-center gap-1 text-slate-300 transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div 
        className={`w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs ${
          isScrolled ? 'py-2.5 shadow-sm' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand (Click 3 times to open database portal) */}
          <div 
            onClick={handleLogoClick}
            className="cursor-pointer select-none"
            title="Ocean Technologies"
          >
            <Logo variant="horizontal" size="sm" showTagline={true} isDark={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const isEmergency = item.id === 'emergency-fix';
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 border border-sky-200 shadow-xs'
                      : isEmergency
                      ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {isEmergency && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Search Trigger */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              aria-label="Search services and maintenance plans"
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">⌘K</span>
            </button>

            {/* Emergency Fix CTA */}
            <button
              id="header-emergency-btn"
              onClick={onOpenIssueReport}
              className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Report Bug</span>
            </button>

            {/* Request Quote CTA */}
            <button
              id="header-quote-cta"
              onClick={() => onOpenQuote()}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="p-2 text-slate-600 hover:text-sky-600"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sky-600">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenQuote();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide text-center flex items-center justify-center gap-2"
              >
                <span>Request a Free Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={() => {
                  if (onOpenInternship) {
                    onOpenInternship();
                  } else {
                    onOpenQuote('Internship / IT & SIWES Placement');
                  }
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-4 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🎓 Apply for Internship, IT & SIWES</span>
              </button>

              <button
                onClick={() => {
                  onOpenIssueReport();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Emergency Software Issue Hotline</span>
              </button>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Call: {COMPANY_INFO.phone}</span>
                <a 
                  href={COMPANY_INFO.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-600 font-semibold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

