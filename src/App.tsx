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
import { TicketStatusTrackerModal } from './components/TicketStatusTrackerModal';
import { AdmissionStatusModal } from './components/AdmissionStatusModal';
import { BackToTop } from './components/BackToTop';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>(undefined);
  const [customQuoteScope, setCustomQuoteScope] = useState<string | undefined>(undefined);
  const [selectedCourseForRegistration, setSelectedCourseForRegistration] = useState<string | undefined>(undefined);
  const [issueReportModalOpen, setIssueReportModalOpen] = useState(false);
  const [courseRegistrationModalOpen, setCourseRegistrationModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackerDefaultQuery, setTrackerDefaultQuery] = useState('');
  const [admissionStatusModalOpen, setAdmissionStatusModalOpen] = useState(false);
  const [admissionDefaultQuery, setAdmissionDefaultQuery] = useState('');

  // Listen for global modal open events
  useEffect(() => {
    const handleOpenAdmin = () => {
      setCurrentView('admin-inbox');
    };
    const handleOpenTrackerEvent = (e: any) => {
      handleOpenTracker(e.detail?.query);
    };
    const handleOpenAdmissionStatusEvent = (e: any) => {
      handleOpenAdmissionStatus(e.detail?.query);
    };

    window.addEventListener('open-admin-portal', handleOpenAdmin);
    window.addEventListener('open-ticket-tracker', handleOpenTrackerEvent);
    window.addEventListener('open-admission-status', handleOpenAdmissionStatusEvent);
    return () => {
      window.removeEventListener('open-admin-portal', handleOpenAdmin);
      window.removeEventListener('open-ticket-tracker', handleOpenTrackerEvent);
      window.removeEventListener('open-admission-status', handleOpenAdmissionStatusEvent);
    };
  }, []);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleOpenQuote = (serviceId?: string, customScope?: string) => {
    setSelectedServiceForQuote(serviceId);
    setCustomQuoteScope(customScope);
    setQuoteModalOpen(true);
  };

  const handleOpenIssueReport = () => {
    setIssueReportModalOpen(true);
  };

  const handleOpenCourseRegistration = (courseId?: string) => {
    setSelectedCourseForRegistration(courseId);
    setCourseRegistrationModalOpen(true);
  };

  const handleOpenTracker = (query?: string) => {
    setTrackerDefaultQuery(query || '');
    setTrackerModalOpen(true);
  };

  const handleOpenAdmissionStatus = (query?: string) => {
    setAdmissionDefaultQuery(query || '');
    setAdmissionStatusModalOpen(true);
  };

  const isAdminView = currentView === 'admin-inbox';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Global Top Announcement Broadcast Ticker */}
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
          onOpenTracker={() => handleOpenTracker()}
          onOpenAdmissionStatus={handleOpenAdmissionStatus}
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
            onOpenTracker={() => handleOpenTracker()}
            onOpenAdmissionStatus={handleOpenAdmissionStatus}
          />
        )}

        {currentView === 'services' && (
          <ServicesView
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuote}
            onOpenIssueReport={handleOpenIssueReport}
            onOpenCourseRegistration={handleOpenCourseRegistration}
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
            onOpenTracker={() => handleOpenTracker()}
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
            onOpenQuote={handleOpenQuote}
            onOpenTracker={() => handleOpenTracker()}
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
          onOpenTracker={() => handleOpenTracker()}
        />
      )}

      {/* Interactive Modals */}
      <CourseRegistrationModal
        isOpen={courseRegistrationModalOpen}
        onClose={() => {
          setCourseRegistrationModalOpen(false);
          setSelectedCourseForRegistration(undefined);
        }}
        defaultCourseId={selectedCourseForRegistration}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          setCustomQuoteScope(undefined);
        }}
        selectedServiceId={selectedServiceForQuote}
        customScope={customQuoteScope}
      />

      <IssueReportModal
        isOpen={issueReportModalOpen}
        onClose={() => setIssueReportModalOpen(false)}
      />

      <TicketStatusTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        defaultQuery={trackerDefaultQuery}
      />

      <AdmissionStatusModal
        isOpen={admissionStatusModalOpen}
        onClose={() => setAdmissionStatusModalOpen(false)}
        defaultQuery={admissionDefaultQuery}
        onOpenRegister={() => handleOpenCourseRegistration('frontend_crash_course')}
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
        onOpenCourseRegistration={(courseId) => {
          setSearchModalOpen(false);
          handleOpenCourseRegistration(courseId);
        }}
        onOpenTracker={(q) => {
          setSearchModalOpen(false);
          handleOpenTracker(q);
        }}
        onOpenAdmissionStatus={(q) => {
          setSearchModalOpen(false);
          handleOpenAdmissionStatus(q);
        }}
      />

      {/* Floating widgets - hidden in administration portal */}
      {!isAdminView && (
        <>
          <AiAssistantWidget />
          <BackToTop />
        </>
      )}
    </div>
  );
}

