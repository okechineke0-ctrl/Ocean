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
import { SearchModal } from './components/SearchModal';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { LocationLocatorWidget } from './components/LocationLocatorWidget';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>(undefined);
  const [issueReportModalOpen, setIssueReportModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navbar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenQuote={handleOpenQuote}
        onOpenIssueReport={handleOpenIssueReport}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenQuote={handleOpenQuote}
            onOpenIssueReport={handleOpenIssueReport}
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

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenQuote={handleOpenQuote}
        onOpenIssueReport={handleOpenIssueReport}
      />

      {/* Interactive Modals */}
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
      {/* AI Consultant Assistant Floating Widget */}
      <AiAssistantWidget />
      {/* Google Location & Office Locator Floating Widget */}
      <LocationLocatorWidget />
    </div>
  );
}

