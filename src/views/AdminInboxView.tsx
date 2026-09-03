import React, { useState, useEffect } from 'react';
import { InquiryRecord, InternshipRecord, ViewMode } from '../types';
import { 
  subscribeToInquiries, 
  fetchInquiriesFromPostgres,
  updateInquiryStatus, 
  deleteInquiry,
  subscribeToInternships,
  fetchInternshipsFromPostgres,
  updateInternshipStatus,
  deleteInternship
} from '../lib/inquiriesService';
import { 
  Inbox, 
  Search, 
  Filter, 
  MessageCircle, 
  Phone, 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  Database,
  Lock,
  GraduationCap,
  Building2,
  BookOpen,
  Code2,
  FileText,
  BadgeCheck
} from 'lucide-react';

interface AdminInboxViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const AdminInboxView: React.FC<AdminInboxViewProps> = ({ onNavigate }) => {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [internships, setInternships] = useState<InternshipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'internships' | 'quotes' | 'emergency' | 'contact'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected items for detail pane
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<InternshipRecord | null>(null);

  const [notesInput, setNotesInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Authenticate admin access
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'okechineke') {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Real-time Firestore & PostgreSQL sync listeners
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to client inquiries & quotes
    const unsubInquiries = subscribeToInquiries((items) => {
      setInquiries(items);
      setLoading(false);
      if (selectedInquiry) {
        const updated = items.find((i) => i.id === selectedInquiry.id);
        if (updated) {
          setSelectedInquiry(updated);
          setNotesInput(updated.adminNotes || '');
        }
      }
    });

    // Subscribe to student internships & SIWES
    const unsubInternships = subscribeToInternships((items) => {
      setInternships(items);
      setLoading(false);
      if (selectedInternship) {
        const updated = items.find((i) => i.id === selectedInternship.id);
        if (updated) {
          setSelectedInternship(updated);
          setNotesInput(updated.adminNotes || '');
        }
      }
    });

    return () => {
      unsubInquiries();
      unsubInternships();
    };
  }, []);

  const handleRefreshAll = async () => {
    setLoading(true);
    try {
      const [pgInquiries, pgInternships] = await Promise.all([
        fetchInquiriesFromPostgres(),
        fetchInternshipsFromPostgres(),
      ]);

      if (pgInquiries && pgInquiries.length > 0) {
        setInquiries((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          const next = [...prev];
          for (const item of pgInquiries) {
            if (!ids.has(item.id)) next.push(item);
          }
          return next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
      }

      if (pgInternships && pgInternships.length > 0) {
        setInternships((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          const next = [...prev];
          for (const item of pgInternships) {
            if (!ids.has(item.id)) next.push(item);
          }
          return next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
      }
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleSelectInquiry = (inquiry: InquiryRecord) => {
    setSelectedInquiry(inquiry);
    setSelectedInternship(null);
    setNotesInput(inquiry.adminNotes || '');
  };

  const handleSelectInternship = (internship: InternshipRecord) => {
    setSelectedInternship(internship);
    setSelectedInquiry(null);
    setNotesInput(internship.adminNotes || '');
  };

  const handleStatusChangeInquiry = async (id: string, newStatus: InquiryRecord['status']) => {
    await updateInquiryStatus(id, newStatus);
  };

  const handleStatusChangeInternship = async (id: string, newStatus: InternshipRecord['status']) => {
    await updateInternshipStatus(id, newStatus);
  };

  const handleSaveNotes = async () => {
    setSavingNote(true);
    if (selectedInquiry) {
      await updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, notesInput);
    } else if (selectedInternship) {
      await updateInternshipStatus(selectedInternship.id, selectedInternship.status, notesInput);
    }
    setSavingNote(false);
  };

  const handleDeleteInquiryItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message record from the PostgreSQL database?')) {
      await deleteInquiry(id);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleDeleteInternshipItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student internship record from the database?')) {
      await deleteInternship(id);
      if (selectedInternship?.id === id) {
        setSelectedInternship(null);
      }
    }
  };

  // Helper links for replies
  const getWhatsAppStudentLink = (internship: InternshipRecord) => {
    const text = encodeURIComponent(
      `Hello ${internship.fullName},\nThis is Ocean Technologies Student Placement Coordinator in Agbani (Near ESUT).\nWe received your ${internship.programType} registration (Ref: ${internship.registrationNumber}) for ${internship.techTrack}.\nWe would like to invite you for your onboarding and logbook clearance.`
    );
    const cleanPhone = internship.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    return `https://wa.me/${intlPhone}?text=${text}`;
  };

  const getEmailStudentLink = (internship: InternshipRecord) => {
    const subject = encodeURIComponent(`Ocean Technologies Internship / SIWES Placement (Ref: ${internship.registrationNumber})`);
    const body = encodeURIComponent(
      `Dear ${internship.fullName},\n\nThank you for registering for the ${internship.programType} (${internship.techTrack}) at Ocean Technologies Hub in Agbani, Enugu State.\n\nYour Registration Reference Number is: ${internship.registrationNumber}\nSchool: ${internship.school}\nMatric ID: ${internship.studentId}\n\nPlease come with your university IT letter / logbook to our office along Agbani Main Road (Near ESUT Gate).\n\nBest regards,\nStudent Placement Team\nOcean Technologies Agbani`
    );
    return `mailto:${internship.email}?subject=${subject}&body=${body}`;
  };

  const getWhatsAppInquiryLink = (inquiry: InquiryRecord) => {
    const text = encodeURIComponent(
      `Hello ${inquiry.fullName},\nThis is Ocean Technologies (Agbani, Enugu State).\nWe received your inquiry regarding "${inquiry.serviceType || inquiry.type}".\nWe would love to discuss your project requirements.`
    );
    const cleanPhone = inquiry.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    return `https://wa.me/${intlPhone}?text=${text}`;
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Filter items
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.serviceType && inq.serviceType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'quotes' && inq.type === 'quote') ||
      (activeTab === 'emergency' && inq.type === 'emergency_issue') ||
      (activeTab === 'contact' && inq.type === 'contact');

    return matchesSearch && matchesStatus && matchesTab;
  });

  const filteredInternships = internships.filter((intern) => {
    const matchesSearch =
      intern.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.phone.includes(searchQuery) ||
      intern.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.techTrack.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || intern.status === statusFilter;
    const matchesTab = activeTab === 'all' || activeTab === 'internships';

    return matchesSearch && matchesStatus && matchesTab;
  });

  const counts = {
    totalRecords: inquiries.length + internships.length,
    internships: internships.length,
    quotes: inquiries.filter((i) => i.type === 'quote').length,
    emergency: inquiries.filter((i) => i.type === 'emergency_issue').length,
    contact: inquiries.filter((i) => i.type === 'contact').length,
    newInquiries: inquiries.filter((i) => i.status === 'new').length,
    pendingInternships: internships.filter((i) => i.status === 'pending').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl font-bold text-center text-white font-display mb-1">
            Admin Access Verification
          </h2>
          <p className="text-xs text-center text-slate-400 mb-6">
            Database records, client quotes, and student internship registrations are restricted to authorized personnel.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Enter Database Password:
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="Enter password"
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono text-center tracking-widest text-base"
              />
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-2 text-center font-medium">
                  Incorrect password.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              Unlock Database Portal
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-slate-300 transition-colors"
            >
              ← Back to Main Website
            </button>
            <span className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3" /> Secure Access
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      
      {/* Top Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display text-white">PostgreSQL & Cloud Firestore Portal</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Database Live & Synced</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ocean Technologies HQ • Student Internships & SIWES, Client Quotes, and Emergency Fix Tickets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAll}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
              <span>Refresh Database</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Records */}
          <div 
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              activeTab === 'all' 
                ? 'bg-sky-950/70 border-sky-500/60 shadow-lg ring-1 ring-sky-500/30' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-xs text-slate-400 font-medium">All Database Records</p>
            <p className="text-2xl font-bold font-display text-white mt-1">{counts.totalRecords}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">PostgreSQL & Firestore</p>
          </div>

          {/* Card 2: Internships & SIWES */}
          <div 
            onClick={() => setActiveTab('internships')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              activeTab === 'internships' 
                ? 'bg-indigo-950/70 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Internships & SIWES</span>
              </p>
              {counts.pendingInternships > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {counts.pendingInternships} new
                </span>
              )}
            </div>
            <p className="text-2xl font-bold font-display text-indigo-300 mt-1">{counts.internships}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">ESUT & Regional Students</p>
          </div>

          {/* Card 3: Project Quotes */}
          <div 
            onClick={() => setActiveTab('quotes')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              activeTab === 'quotes' 
                ? 'bg-sky-950/70 border-sky-500/60 shadow-lg ring-1 ring-sky-500/30' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-xs text-sky-400 font-medium">Project Quotes</p>
            <p className="text-2xl font-bold font-display text-sky-300 mt-1">{counts.quotes}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Web & Mobile App Leads</p>
          </div>

          {/* Card 4: Emergency Fixes */}
          <div 
            onClick={() => setActiveTab('emergency')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              activeTab === 'emergency' 
                ? 'bg-rose-950/70 border-rose-500/60 shadow-lg ring-1 ring-rose-500/30' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-xs text-rose-400 font-medium">Emergency Bugs</p>
            <p className="text-2xl font-bold font-display text-rose-300 mt-1">{counts.emergency}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Urgent triage tickets</p>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student or client name, school, email, phone, matric ID, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Records ({counts.totalRecords})
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'internships'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 text-indigo-300 hover:text-white border border-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Internships & SIWES ({counts.internships})</span>
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'quotes'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Quotes ({counts.quotes})
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'emergency'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Emergency ({counts.emergency})
            </button>
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Records List (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-sky-400" />
                <span>
                  {activeTab === 'internships'
                    ? `Student Internship Registrations (${filteredInternships.length})`
                    : activeTab === 'quotes'
                    ? `Project Quotes (${filteredInquiries.length})`
                    : `Database Entries (${filteredInternships.length + filteredInquiries.length})`}
                </span>
              </h2>
              {loading && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />}
            </div>

            <div className="max-h-[680px] overflow-y-auto divide-y divide-slate-800/60">
              {/* Show Internships if matching tab */}
              {(activeTab === 'all' || activeTab === 'internships') &&
                filteredInternships.map((intern) => {
                  const isSelected = selectedInternship?.id === intern.id;
                  return (
                    <div
                      key={intern.id}
                      onClick={() => handleSelectInternship(intern)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-indigo-950/50 border-l-4 border-indigo-500' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          <span>{intern.programType}</span>
                        </span>
                        
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatTimestamp(intern.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white truncate mb-0.5">
                          {intern.fullName}
                        </h3>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-800/60">
                          {intern.registrationNumber}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 font-medium truncate mb-1">
                        🏫 {intern.school}
                      </p>

                      <p className="text-[11px] text-slate-400 truncate mb-1">
                        🎓 {intern.department} • {intern.level} (ID: {intern.studentId})
                      </p>

                      <p className="text-[11px] text-indigo-300/80 font-mono truncate">
                        💻 Track: {intern.techTrack}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          intern.status === 'pending' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : intern.status === 'admitted'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          Status: {intern.status.replace('_', ' ')}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <span>{intern.phone}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Show Inquiries & Quotes if matching tab */}
              {(activeTab === 'all' || activeTab !== 'internships') &&
                filteredInquiries.map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  return (
                    <div
                      key={inq.id}
                      onClick={() => handleSelectInquiry(inq)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-sky-950/40 border-l-4 border-sky-500' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          inq.type === 'emergency_issue' 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : inq.type === 'quote'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {inq.type === 'emergency_issue' ? 'Emergency Fix' : inq.type}
                        </span>
                        
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatTimestamp(inq.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white truncate mb-0.5">
                        {inq.fullName}
                      </h3>

                      <p className="text-[11px] text-slate-400 font-medium truncate mb-1">
                        {inq.serviceType || inq.companyOrProject || 'General Inquiry'}
                      </p>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {inq.message || inq.budgetRange || 'No message provided'}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          inq.status === 'new' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : inq.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          Status: {inq.status}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <span>{inq.phone}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {filteredInternships.length === 0 && filteredInquiries.length === 0 && (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p>No database records match your filter.</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Student registrations submitted via the Internship form and quotes will appear here in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Record Details & Actions (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
            
            {/* Student Internship Detail View */}
            {selectedInternship ? (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedInternship.programType}
                      </span>
                      <span className="text-xs text-indigo-300 font-mono font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/80">
                        {selectedInternship.registrationNumber}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white font-display">
                      {selectedInternship.fullName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Applied on {formatTimestamp(selectedInternship.createdAt)}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={selectedInternship.status}
                      onChange={(e) => handleStatusChangeInternship(selectedInternship.id, e.target.value as InternshipRecord['status'])}
                      className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="under_review">Under Review</option>
                      <option value="admitted">Admitted / Approved</option>
                      <option value="completed">Completed IT</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>

                {/* Instant WhatsApp & Email Action Bar */}
                <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-indigo-300">Contact Student Applicant</p>
                    <p className="text-[11px] text-slate-400">One-click WhatsApp invitation or official acceptance email:</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={getWhatsAppStudentLink(selectedInternship)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Student</span>
                    </a>
                    <a
                      href={getEmailStudentLink(selectedInternship)}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>

                {/* Academic & University Profile */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Academic & Institutional Coordinates</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Higher Institution / School</p>
                      <p className="text-white font-semibold text-sm">{selectedInternship.school}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Matric / Student ID Number</p>
                      <p className="text-amber-300 font-mono font-bold text-sm">{selectedInternship.studentId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Course / Department</p>
                      <p className="text-white font-medium">{selectedInternship.department}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Academic Level</p>
                      <p className="text-white font-medium">{selectedInternship.level}</p>
                    </div>
                  </div>
                </div>

                {/* Tech Track & Placement Preferences */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Technical Track & Start Date</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Chosen Track</p>
                      <p className="text-emerald-400 font-bold text-sm">{selectedInternship.techTrack}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Preferred Start Date</p>
                      <p className="text-white font-medium">{selectedInternship.preferredStartDate || 'Immediate'}</p>
                    </div>
                  </div>

                  {selectedInternship.statementOfPurpose && (
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
                        Statement of Purpose / Goals:
                      </p>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
                        "{selectedInternship.statementOfPurpose}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Student Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Phone / WhatsApp</p>
                    <p className="text-white font-mono font-bold text-sm">{selectedInternship.phone}</p>
                    <a href={`tel:${selectedInternship.phone}`} className="text-sky-400 text-[11px] hover:underline mt-1 inline-block">
                      Call Direct
                    </a>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Email Address</p>
                    <p className="text-white font-mono font-bold text-sm break-all">{selectedInternship.email}</p>
                    <a href={`mailto:${selectedInternship.email}`} className="text-sky-400 text-[11px] hover:underline mt-1 inline-block">
                      Send Email
                    </a>
                  </div>
                </div>

                {/* Admin Internal Notes Box */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Internal Admin & Interview Notes (Synced to Database):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add interview assessment, ESUT logbook verification status, or engineering mentor assignment here..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="mt-2.5 flex items-center justify-between">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNote}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {savingNote ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Save Notes to Database</span>
                    </button>

                    <button
                      onClick={() => handleDeleteInternshipItem(selectedInternship.id)}
                      className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Record</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : selectedInquiry ? (
              /* Client Inquiry / Quote Detail View */
              <div className="space-y-6">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                        selectedInquiry.type === 'emergency_issue' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : selectedInquiry.type === 'quote'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {selectedInquiry.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ID: {selectedInquiry.id}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white font-display">
                      {selectedInquiry.fullName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Submitted on {formatTimestamp(selectedInquiry.createdAt)}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleStatusChangeInquiry(selectedInquiry.id, e.target.value as InquiryRecord['status'])}
                      className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
                    >
                      <option value="new">New (Unresponded)</option>
                      <option value="in_progress">In Progress</option>
                      <option value="responded">Responded</option>
                      <option value="resolved">Resolved / Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Instant Reply Bar (WhatsApp & Email) */}
                <div className="bg-sky-950/30 border border-sky-900/50 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-sky-300">Instant Client Reply Options</p>
                    <p className="text-[11px] text-slate-400">Click to launch WhatsApp with pre-filled message or email reply:</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={getWhatsAppInquiryLink(selectedInquiry)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Reply on WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>

                {/* Client Contact Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Phone / WhatsApp</p>
                    <p className="text-white font-mono font-bold text-sm">{selectedInquiry.phone}</p>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-sky-400 text-[11px] hover:underline mt-1 inline-block">
                      Call Direct
                    </a>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Email Address</p>
                    <p className="text-white font-mono font-bold text-sm break-all">{selectedInquiry.email}</p>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sky-400 text-[11px] hover:underline mt-1 inline-block">
                      Send Email
                    </a>
                  </div>
                </div>

                {/* Project / Bug Details */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Project & Service Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Service Type</p>
                      <p className="text-white font-semibold">{selectedInquiry.serviceType || 'Not specified'}</p>
                    </div>
                    {selectedInquiry.companyOrProject && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Company / Brand</p>
                        <p className="text-white font-semibold">{selectedInquiry.companyOrProject}</p>
                      </div>
                    )}
                    {selectedInquiry.budgetRange && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Budget Estimate</p>
                        <p className="text-emerald-400 font-mono font-bold">{selectedInquiry.budgetRange}</p>
                      </div>
                    )}
                    {selectedInquiry.timeline && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Timeline</p>
                        <p className="text-white font-mono">{selectedInquiry.timeline}</p>
                      </div>
                    )}
                    {selectedInquiry.urgency && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Urgency Level</p>
                        <p className="text-rose-400 font-bold">{selectedInquiry.urgency}</p>
                      </div>
                    )}
                    {selectedInquiry.affectedUrlOrSystem && (
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Affected System / URL</p>
                        <a 
                          href={selectedInquiry.affectedUrlOrSystem.startsWith('http') ? selectedInquiry.affectedUrlOrSystem : `https://${selectedInquiry.affectedUrlOrSystem}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sky-400 underline font-mono break-all text-xs"
                        >
                          {selectedInquiry.affectedUrlOrSystem}
                        </a>
                      </div>
                    )}
                  </div>

                  {selectedInquiry.message && (
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Message / Error Description:</p>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedInquiry.message}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Notes Section */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Internal Engineer Notes (Synced to PostgreSQL Database):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add internal notes on quotes sent, technical diagnosis, client follow-up calls, etc..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                  />
                  <div className="mt-2.5 flex items-center justify-between">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNote}
                      className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {savingNote ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Save Notes to Database</span>
                    </button>

                    <button
                      onClick={() => handleDeleteInquiryItem(selectedInquiry.id)}
                      className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Record</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* Blank state when no item is selected */
              <div className="py-24 text-center text-slate-500">
                <Inbox className="w-12 h-12 text-slate-700 mx-auto mb-3 opacity-50" />
                <h3 className="text-sm font-bold text-slate-300">Select a Database Record</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Click on any student internship application or client quote from the list to view complete details, copy coordinates, or reply on WhatsApp.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
