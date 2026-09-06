import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { MaintenanceView } from './views/MaintenanceView';
import { PortfolioView } from './views/PortfolioView';
import { EmergencyFixView } from './views/EmergencyFixView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminInboxView } from './views/AdminInboxView';
import { QuoteModal } from './components/QuoteModal';
import { IssueReportModal } from './components/IssueReportModal';
import { InternshipModal } from './components/InternshipModal';
import { CourseRegistrationModal } from './components/CourseRegistrationModal';
import { SearchModal } from './components/SearchModal';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { LocationLocatorWidget } from './components/LocationLocatorWidget';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>(undefined);
  const [issueReportModalOpen, setIssueReportModalOpen] = useState(false);
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [courseRegistrationModalOpen, setCourseRegistrationModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Check URL hash / query param on mount or hash change for secret admin access
  useEffect(() => {
    const checkAdminHash = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin' || hash === '#portal' || hash === '#db' || params.get('admin') === 'true' || params.get('portal') === '1') {
        setCurrentView('admin-inbox');
      }
    };

    checkAdminHash();
    window.addEventListener('hashchange', checkAdminHash);
    return () => window.removeEventListener('hashchange', checkAdminHash);
  }, []);

  // Listen for open-admin-portal event (triggered by triple-clicking any logo on the site or footer admin link)
  useEffect(() => {
    const handleOpenAdmin = () => {
      setCurrentView('admin-inbox');
    };
    window.addEventListener('open-admin-portal', handleOpenAdmin);
    return () => window.removeEventListener('open-admin-portal', handleOpenAdmin);
  }, []);

  // Secret keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A anywhere on the site
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin-inbox' ? 'home' : 'admin-inbox'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleOpenQuote = (serviceId?: string) => {
    setSelectedServiceForQuote(serviceId);
    setQuoteModalOpen(true);
  };

  const handleOpenIssueReport = () => {
    setIssueReportModalOpen(true);
  };

  const handleOpenInternship = () => {
    setInternshipModalOpen(true);
  };

  const handleOpenCourseRegistration = () => {
    setCourseRegistrationModalOpen(true);
  };

  const isAdminView = currentView === 'admin-inbox';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navbar - hidden in dedicated administration portal */}
      {!isAdminView && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenQuote={handleOpenQuote}
          onOpenIssueReport={handleOpenIssueReport}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenInternship={handleOpenInternship}
          onOpenCourseRegistration={handleOpenCourseRegistration}
        />
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuote}
            onOpenIssueReport={handleOpenIssueReport}
            onOpenInternship={handleOpenInternship}
            onOpenCourseRegistration={handleOpenCourseRegistration}
          />
        )}

        {currentView === 'services' && (
          <ServicesView
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuote}
            onOpenIssueReport={handleOpenIssueReport}
          />
        )}

        {currentView === 'maintenance' && (
          <MaintenanceView
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuote}
            onOpenIssueReport={handleOpenIssueReport}
          />
        )}

        {currentView === 'portfolio' && (
          <PortfolioView
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentView === 'emergency-fix' && (
          <EmergencyFixView
            onNavigate={handleNavigate}
            onOpenIssueReport={handleOpenIssueReport}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuote}
            onOpenInternship={handleOpenInternship}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            onNavigate={handleNavigate}
            onOpenIssueReport={handleOpenIssueReport}
            onOpenInternship={handleOpenInternship}
          />
        )}

        {currentView === 'admin-inbox' && (
          <AdminInboxView
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer - hidden in administration portal as requested */}
      {!isAdminView && (
        <Footer
          onNavigate={handleNavigate}
          onOpenQuote={handleOpenQuote}
          onOpenIssueReport={handleOpenIssueReport}
          onOpenInternship={handleOpenInternship}
          onOpenCourseRegistration={handleOpenCourseRegistration}
        />
      )}

      {/* Interactive Modals */}
      <CourseRegistrationModal
        isOpen={courseRegistrationModalOpen}
        onClose={() => setCourseRegistrationModalOpen(false)}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        selectedServiceId={selectedServiceForQuote}
      />

      <IssueReportModal
        isOpen={issueReportModalOpen}
        onClose={() => setIssueReportModalOpen(false)}
      />

      <InternshipModal
        isOpen={internshipModalOpen}
        onClose={() => setInternshipModalOpen(false)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={(v) => {
          setSearchModalOpen(false);
          handleNavigate(v);
        }}
        onSelectService={(sId) => {
          setSearchModalOpen(false);
          handleOpenQuote(sId);
        }}
      />

      {/* Floating widgets - hidden in administration portal */}
      {!isAdminView && (
        <>
          <AiAssistantWidget />
          <LocationLocatorWidget />
        </>
      )}
    </div>
  );
}

