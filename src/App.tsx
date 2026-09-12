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
import { CourseRegistrationModal } from './components/CourseRegistrationModal';
import { SearchModal } from './components/SearchModal';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { TopAnnouncementTicker } from './components/TopAnnouncementTicker';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>(undefined);
  const [issueReportModalOpen, setIssueReportModalOpen] = useState(false);
  const [courseRegistrationModalOpen, setCourseRegistrationModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Listen for open-admin-portal event (triggered solely by triple-clicking the Ocean Tech logo)
  useEffect(() => {
    const handleOpenAdmin = () => {
      setCurrentView('admin-inbox');
    };
    window.addEventListener('open-admin-portal', handleOpenAdmin);
    return () => window.removeEventListener('open-admin-portal', handleOpenAdmin);
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

  const handleOpenCourseRegistration = () => {
    setCourseRegistrationModalOpen(true);
  };

  const isAdminView = currentView === 'admin-inbox';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Top Announcement Bar (OPay style continuous moving marquee write-up) */}
      {!isAdminView && <TopAnnouncementTicker />}

      {/* Top Navbar - hidden in dedicated administration portal */}
      {!isAdminView && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenQuote={handleOpenQuote}
          onOpenIssueReport={handleOpenIssueReport}
          onOpenSearch={() => setSearchModalOpen(true)}
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
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            onNavigate={handleNavigate}
            onOpenIssueReport={handleOpenIssueReport}
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
        <AiAssistantWidget />
      )}
    </div>
  );
}

