import React, { useState, useEffect } from 'react';
import { InquiryRecord, CourseRegistrationRecord, ViewMode } from '../types';
import { 
  subscribeToInquiries, 
  fetchInquiriesFromPostgres,
  updateInquiryStatus, 
  deleteInquiry,
  subscribeToCourseRegistrations,
  fetchCourseRegistrationsFromPostgres,
  updateCourseRegistrationStatus,
  deleteCourseRegistration
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
  Building2,
  BookOpen,
  Code2,
  FileText,
  BadgeCheck,
  Send,
  MailCheck,
  Copy,
  Check,
  Sparkles,
  X,
  Printer,
  Eye,
  EyeOff,
  LogOut,
  Megaphone
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { AdminAnnouncementManager } from '../components/AdminAnnouncementManager';
import { getSiteAnnouncement, isAnnouncementActive } from '../lib/announcementService';

interface AdminInboxViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const AdminInboxView: React.FC<AdminInboxViewProps> = ({ onNavigate }) => {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'courses' | 'quotes' | 'emergency' | 'contact' | 'announcement'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tickerStatus, setTickerStatus] = useState<{ active: boolean; text: string }>({ active: false, text: 'Checking...' });

  // Monitor site announcement status for admin badges
  const checkTickerStatus = async () => {
    try {
      const ann = await getSiteAnnouncement();
      if (ann && isAnnouncementActive(ann)) {
        setTickerStatus({ active: true, text: 'Ticker Live on Website' });
      } else {
        setTickerStatus({ active: false, text: 'Ticker Paused / Expired' });
      }
    } catch {
      setTickerStatus({ active: false, text: 'Ticker Inactive' });
    }
  };

  useEffect(() => {
    checkTickerStatus();
    window.addEventListener('ocean-announcement-changed', checkTickerStatus);
    return () => window.removeEventListener('ocean-announcement-changed', checkTickerStatus);
  }, []);
  
  // Selected items for detail pane
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [selectedCourseReg, setSelectedCourseReg] = useState<CourseRegistrationRecord | null>(null);

  const [notesInput, setNotesInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Course Registration Official Admission Email Modal State
  const [courseAcceptanceModal, setCourseAcceptanceModal] = useState<{
    isOpen: boolean;
    courseReg: CourseRegistrationRecord | null;
    emailSubject: string;
    emailBody: string;
    mailtoUrl: string;
    copied: boolean;
  }>({
    isOpen: false,
    courseReg: null,
    emailSubject: '',
    emailBody: '',
    mailtoUrl: '',
    copied: false,
  });

  // Authenticate admin access - requires master password: okechineke
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ocean_tech_admin_auth') === 'okechineke';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (cleanPass === 'okechineke') {
      sessionStorage.setItem('ocean_tech_admin_auth', 'okechineke');
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ocean_tech_admin_auth');
    setIsAuthenticated(false);
    setPasscode('');
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

    // Subscribe to course registrations & date store
    const unsubCourses = subscribeToCourseRegistrations((items) => {
      setCourseRegistrations(items);
      setLoading(false);
      if (selectedCourseReg) {
        const updated = items.find((c) => c.id === selectedCourseReg.id);
        if (updated) {
          setSelectedCourseReg(updated);
          setNotesInput(updated.adminNotes || '');
        }
      }
    });

    return () => {
      unsubInquiries();
      unsubCourses();
    };
  }, []);

  const handleRefreshAll = async () => {
    setLoading(true);
    try {
      const [pgInquiries, pgCourses] = await Promise.all([
        fetchInquiriesFromPostgres(),
        fetchCourseRegistrationsFromPostgres(),
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

      if (pgCourses && pgCourses.length > 0) {
        setCourseRegistrations((prev) => {
          const ids = new Set(prev.map((c) => c.id));
          const next = [...prev];
          for (const item of pgCourses) {
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
    setSelectedCourseReg(null);
    setNotesInput(inquiry.adminNotes || '');
  };

  const handleSelectCourseRegistration = (reg: CourseRegistrationRecord) => {
    setSelectedCourseReg(reg);
    setSelectedInquiry(null);
    setNotesInput(reg.adminNotes || '');
  };

  const handleStatusChangeInquiry = async (id: string, newStatus: InquiryRecord['status']) => {
    await updateInquiryStatus(id, newStatus);
  };

  const handleStatusChangeCourseReg = async (id: string, newStatus: CourseRegistrationRecord['status']) => {
    if (newStatus === 'admitted') {
      const target = courseRegistrations.find(c => c.id === id) || selectedCourseReg;
      if (target) {
        await handleAcceptCourseRegistration(target);
        return;
      }
    }
    await updateCourseRegistrationStatus(id, newStatus);
    setCourseRegistrations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedCourseReg?.id === id) {
      setSelectedCourseReg((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteCourseRegItem = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently remove this course registration record?')) {
      await deleteCourseRegistration(id);
      setCourseRegistrations((prev) => prev.filter((c) => c.id !== id));
      if (selectedCourseReg?.id === id) {
        setSelectedCourseReg(null);
      }
    }
  };

  const handleSaveNotes = async () => {
    setSavingNote(true);
    if (selectedCourseReg) {
      await updateCourseRegistrationStatus(selectedCourseReg.id, selectedCourseReg.status, notesInput);
      setSelectedCourseReg((prev) => (prev ? { ...prev, adminNotes: notesInput } : null));
    } else if (selectedInquiry) {
      await updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, notesInput);
    }
    setSavingNote(false);
  };

  const handleDeleteInquiryItem = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently remove this inquiry record?')) {
      await deleteInquiry(id);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const getWhatsAppInquiryLink = (inquiry: InquiryRecord) => {
    const text = encodeURIComponent(
      `Hello ${inquiry.fullName},\nThis is Ocean Technologies.\nWe received your inquiry regarding "${inquiry.serviceType || inquiry.type}".\nWe would love to discuss your project requirements.`
    );
    const cleanPhone = inquiry.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    return `https://wa.me/${intlPhone}?text=${text}`;
  };

  const generateOfficialCourseAcceptanceEmail = (reg: CourseRegistrationRecord) => {
    const subject = `Admission Acceptance: ${reg.courseTitle} - Ocean Technologies (Ref: ${reg.registrationNumber})`;
    const body = `Dear ${reg.fullName},

Congratulations! Your application and registration for "${reg.courseTitle}" has been officially ACCEPTED and APPROVED by Ocean Technologies Institute.

REGISTRATION & ENROLLMENT PARTICULARS:
--------------------------------------------------
• Student Full Name: ${reg.fullName}
• Enrolled Course: ${reg.courseTitle}
• Phone Number: ${reg.phone}
• Email Address: ${reg.email}
• Registration Reference Number: ${reg.registrationNumber}
• Learning Format: 100% Online Virtual Classroom
• Class Schedule: ${reg.schedule}
• Course Duration: ${reg.duration}
• Preferred Start Date: ${reg.preferredStartDate || 'Immediate Cohort'}
• Official Store Date: ${reg.registrationDate || formatTimestamp(reg.createdAt)}

NEXT STEPS FOR FUTURE ENQUIRY & TUITION PAYMENT:
--------------------------------------------------
Please chat or call our Student Admissions Coordinator directly on WhatsApp or Call at 09129216768 for future enquiry, cohort orientation briefing, prerequisite preparation, and tuition fee payment instructions.

• Admissions Coordinator WhatsApp: 09129216768
• Direct WhatsApp Link: https://wa.me/2349129216768
• Coordinator Direct Line: +234 912 921 6768
• Official Email: oceantechnologies62@gmail.com

*Note: Please quote your Registration Reference Number (${reg.registrationNumber}) during all conversations and payment verifications.*

We look forward to guiding you through this cohort to industry-grade proficiency.

Warm regards,

Academic Admissions Committee
Ocean Technologies Institute
Phone / WhatsApp: 09129216768
Email: oceantechnologies62@gmail.com`;

    const mailtoUrl = `mailto:${reg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { subject, body, mailtoUrl };
  };

  const handleAcceptCourseRegistration = async (reg: CourseRegistrationRecord) => {
    const { subject, body, mailtoUrl } = generateOfficialCourseAcceptanceEmail(reg);
    const timeStamp = new Date().toLocaleString('en-GB');
    const adminStamp = `ACCEPTED by Admin on ${timeStamp}. Official admission email generated to ${reg.email} with payment/enquiry contact: 09129216768.`;

    // 1. Update Firestore
    await updateCourseRegistrationStatus(reg.id, 'admitted', adminStamp);

    // 2. Update local state
    setCourseRegistrations((prev) =>
      prev.map((item) => (item.id === reg.id ? { ...item, status: 'admitted', adminNotes: adminStamp } : item))
    );
    if (selectedCourseReg?.id === reg.id) {
      setSelectedCourseReg((prev) => (prev ? { ...prev, status: 'admitted', adminNotes: adminStamp } : null));
      setNotesInput(adminStamp);
    }

    // 3. Open modal
    setCourseAcceptanceModal({
      isOpen: true,
      courseReg: reg,
      emailSubject: subject,
      emailBody: body,
      mailtoUrl,
      copied: false,
    });

    // 4. Trigger default mail app
    try {
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Mail client launch:', e);
    }
  };

  const getWhatsAppCourseRegLink = (reg: CourseRegistrationRecord) => {
    const text = encodeURIComponent(
      `Hello ${reg.fullName}!\nThis is Ocean Technologies Institute Admissions Coordinator.\n\n• Student Name: ${reg.fullName}\n• Course Registered: ${reg.courseTitle}\n• Phone Number: ${reg.phone}\n• Registration Ref: ${reg.registrationNumber}\n• Learning Format: 100% Online Virtual Classroom\n\nWe have reviewed your registration. For future enquiry, orientation details, and tuition payment, please chat or call us directly on this WhatsApp line: 09129216768.`
    );
    const cleanPhone = reg.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    return `https://wa.me/${intlPhone}?text=${text}`;
  };

  const getEmailCourseRegLink = (reg: CourseRegistrationRecord) => {
    const subject = encodeURIComponent(`Admission & Course Registration: ${reg.courseTitle} (Ref: ${reg.registrationNumber})`);
    const body = encodeURIComponent(
      `Dear ${reg.fullName},\n\nThank you for registering for "${reg.courseTitle}" at Ocean Technologies Institute.\n\n• Student Name: ${reg.fullName}\n• Course Registered: ${reg.courseTitle}\n• Phone Number: ${reg.phone}\n• Registration Reference Number: ${reg.registrationNumber}\n• Class Format: 100% Online Virtual Classroom\n• Schedule: ${reg.schedule}\n• Duration: ${reg.duration}\n• Preferred Start Date: ${reg.preferredStartDate || 'Immediate Cohort'}\n\nFUTURE ENQUIRY & PAYMENT:\nPlease chat or call our Student Admissions Coordinator directly on WhatsApp or Call at 09129216768 for future enquiry, cohort orientation, and tuition payment processing.\n\nBest regards,\nAcademic Admissions Team\nOcean Technologies Institute`
    );
    return `mailto:${reg.email}?subject=${subject}&body=${body}`;
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

  const filteredCourseRegistrations = courseRegistrations.filter((crs) => {
    const matchesSearch =
      crs.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crs.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crs.phone.includes(searchQuery) ||
      crs.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crs.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (crs.preferredStartDate && crs.preferredStartDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crs.registrationDate && crs.registrationDate.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || crs.status === statusFilter;
    const matchesTab = activeTab === 'all' || activeTab === 'courses';

    return matchesSearch && matchesStatus && matchesTab;
  });

  const counts = {
    totalRecords: inquiries.length + courseRegistrations.length,
    courses: courseRegistrations.length,
    pendingCourses: courseRegistrations.filter((c) => c.status === 'pending').length,
    quotes: inquiries.filter((i) => i.type === 'quote').length,
    emergency: inquiries.filter((i) => i.type === 'emergency_issue').length,
    contact: inquiries.filter((i) => i.type === 'contact').length,
    newInquiries: inquiries.filter((i) => i.status === 'new').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-4">
            <Logo variant="icon" size="md" isDark />
          </div>
          
          <h2 className="text-xl font-bold text-center text-white font-display mb-1">
            Ocean Technologies Administration
          </h2>
          <p className="text-xs text-center text-slate-400 mb-6">
            Enter the master administrator password to access inquiries, client quotes, and student course registrations.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Administrator Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono text-center tracking-widest text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-2 text-center font-medium">
                  Incorrect password. The authorized administrator password is required.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Administration</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              ← Back to Main Website
            </button>
            <span className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3" /> Password Protected
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      
      {/* Top Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="icon" size="sm" isDark />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display text-white">Ocean Technologies Administration</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Synchronized</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Course Registrations, Client Quotes, and Database Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setActiveTab('announcement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                activeTab === 'announcement'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Site Ticker</span>
              {tickerStatus.active ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              )}
            </button>
            <button
              onClick={handleRefreshAll}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              title="Lock administration portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
          {/* Card 1: Total Records */}
          <div 
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              activeTab === 'all' 
                ? 'bg-sky-950/70 border-sky-500/60 shadow-lg ring-1 ring-sky-500/30' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-xs text-slate-400 font-medium">All Submissions</p>
            <p className="text-2xl font-bold font-display text-white mt-1">{counts.totalRecords}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Database Synced</p>
          </div>

          {/* Card 2: Course Registrations & Date Store */}
          <div 
            onClick={() => setActiveTab('courses')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              activeTab === 'courses' 
                ? 'bg-emerald-950/70 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Course Store</span>
              </p>
              {counts.pendingCourses > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {counts.pendingCourses} new
                </span>
              )}
            </div>
            <p className="text-2xl font-bold font-display text-emerald-300 mt-1">{counts.courses}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Online Cohort Store</p>
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
            <p className="text-[11px] text-slate-500 mt-0.5">Web & Mobile Apps</p>
          </div>

          {/* Card 5: Emergency Fixes */}
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
            <p className="text-[11px] text-slate-500 mt-0.5">Urgent Triage</p>
          </div>

          {/* Card 6: Site Announcement (OPay Marquee Ticker) */}
          <div 
            onClick={() => setActiveTab('announcement')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              activeTab === 'announcement' 
                ? 'bg-amber-950/70 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Site Ticker</span>
              </p>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                tickerStatus.active
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {tickerStatus.active ? 'LIVE' : 'OFF'}
              </span>
            </div>
            <p className="text-2xl font-bold font-display text-amber-300 mt-1">OPay Bar</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Auto-Expiry Timer</p>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, course, registration date, start date, email, phone, ref..."
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
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'courses'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-900 text-emerald-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Store ({counts.courses})</span>
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
            <button
              onClick={() => setActiveTab('announcement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'announcement'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-900 text-amber-300 hover:text-white border border-slate-800'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Site Ticker (OPay)</span>
              {tickerStatus.active && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Conditional View: Site Announcement Ticker Manager OR Master-Detail Submissions */}
        {activeTab === 'announcement' ? (
          <AdminAnnouncementManager onAnnouncementSaved={checkTickerStatus} />
        ) : (
          /* Master-Detail Split Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Records List (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-sky-400" />
                <span>
                  {activeTab === 'courses'
                    ? `Course Registration Date Store (${filteredCourseRegistrations.length})`
                    : activeTab === 'quotes'
                    ? `Project Quotes (${filteredInquiries.length})`
                    : activeTab === 'emergency'
                    ? `Emergency Tickets (${filteredInquiries.length})`
                    : `All Submissions (${filteredCourseRegistrations.length + filteredInquiries.length})`}
                </span>
              </h2>
              {loading && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />}
            </div>

            <div className="max-h-[680px] overflow-y-auto divide-y divide-slate-800/60">
              {/* Show Course Registrations & Date Store if matching tab */}
              {(activeTab === 'all' || activeTab === 'courses') &&
                filteredCourseRegistrations.map((reg) => {
                  const isSelected = selectedCourseReg?.id === reg.id;
                  return (
                    <div
                      key={reg.id}
                      onClick={() => handleSelectCourseRegistration(reg)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-emerald-950/50 border-l-4 border-emerald-500' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Course Registration</span>
                        </span>
                        
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatTimestamp(reg.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-white truncate mb-0.5">
                          {reg.fullName}
                        </h3>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60 shrink-0">
                          {reg.registrationNumber}
                        </span>
                      </div>

                      <p className="text-[11px] text-emerald-300 font-semibold truncate mb-1">
                        📚 {reg.courseTitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-300 mb-1">
                        <span className="flex items-center gap-1 text-sky-400 font-medium">
                          🌐 100% Online Virtual Class
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{reg.schedule}</span>
                      </div>

                      {/* Stored Registration Date & Preferred Start Date */}
                      <div className="bg-slate-900/90 rounded-lg p-2 my-1.5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px]">
                        <div className="flex items-center gap-1 text-emerald-400 font-mono">
                          <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Date Stored: <strong>{reg.registrationDate || formatTimestamp(reg.createdAt)}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-sky-300 font-medium">
                          <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                          <span>Starts: <strong>{reg.preferredStartDate || 'Immediate'}</strong></span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          reg.status === 'pending' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : reg.status === 'confirmed' || reg.status === 'admitted' || reg.status === 'enrolled'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {(reg.status === 'confirmed' || reg.status === 'admitted' || reg.status === 'enrolled') && (
                            <BadgeCheck className="w-3 h-3 text-emerald-400" />
                          )}
                          Status: {reg.status}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">{reg.phone}</span>
                      </div>
                    </div>
                  );
                })}

              {/* Show Inquiries & Quotes if matching tab */}
              {activeTab !== 'courses' &&
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

              {filteredCourseRegistrations.length === 0 && filteredInquiries.length === 0 && (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p>No submission records match your filter.</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Course registrations with registration date store and quotes will appear here in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Record Details & Actions (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
            
            {selectedCourseReg ? (
              /* Student Course Registration & Date Store Detail View */
              <div className="space-y-6">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{selectedCourseReg.courseTitle}</span>
                      </span>
                      <span className="text-xs text-emerald-300 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                        {selectedCourseReg.registrationNumber}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white font-display">
                      {selectedCourseReg.fullName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Enrolled on {formatTimestamp(selectedCourseReg.createdAt)}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={selectedCourseReg.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as CourseRegistrationRecord['status'];
                        handleStatusChangeCourseReg(selectedCourseReg.id, newStatus);
                      }}
                      className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="admitted">Admitted / Approved</option>
                      <option value="enrolled">Enrolled / Active</option>
                      <option value="completed">Completed Course</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* DEDICATED: Course Registration Date Store Card */}
                <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-sky-950/70 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>Course Registration Date Store</span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Persistent Cloud Store
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Stored and synchronized across Firestore & PostgreSQL database</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Official Date Stored
                      </p>
                      <p className="text-white font-mono font-bold text-sm">
                        {selectedCourseReg.registrationDate || formatTimestamp(selectedCourseReg.createdAt)}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Database Registration Store</p>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Preferred Start Date
                      </p>
                      <p className="text-white font-mono font-bold text-sm">
                        {selectedCourseReg.preferredStartDate || 'Immediate Cohort'}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Cohort Commencement</p>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> System Timestamp
                      </p>
                      <p className="text-white font-mono text-xs truncate">
                        {formatTimestamp(selectedCourseReg.createdAt)}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Server Ingestion Clock</p>
                    </div>
                  </div>
                </div>

                {/* Instant Student Communication & Official Admission Dispatch Bar */}
                <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-emerald-300">Direct Student Admissions & Payment Gateway</p>
                      {selectedCourseReg.status === 'admitted' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Admitted & Notice Sent
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Accept student and automatically dispatch email instructing them to chat 09129216768 for future enquiry & payment:</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleAcceptCourseRegistration(selectedCourseReg)}
                      className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-102"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <Mail className="w-4 h-4" />
                      <span>{selectedCourseReg.status === 'admitted' ? 'Re-send Admission Email (09129216768)' : 'Accept & Send Admission Email'}</span>
                    </button>

                    {selectedCourseReg.status === 'admitted' && (
                      <button
                        onClick={() => {
                          const { subject, body, mailtoUrl } = generateOfficialCourseAcceptanceEmail(selectedCourseReg);
                          setCourseAcceptanceModal({
                            isOpen: true,
                            courseReg: selectedCourseReg,
                            emailSubject: subject,
                            emailBody: body,
                            mailtoUrl,
                            copied: false,
                          });
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>View Letter</span>
                      </button>
                    )}

                    <a
                      href={getWhatsAppCourseRegLink(selectedCourseReg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Student</span>
                    </a>
                  </div>
                </div>

                {/* Course & Schedule Coordinates */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>Enrolled Course & Schedule Specifications</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Course Title</p>
                      <p className="text-white font-semibold text-sm">{selectedCourseReg.courseTitle}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Learning Format</p>
                      <p className="text-emerald-400 font-semibold text-sm">
                        🌐 100% Online Virtual Classroom
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Cohort Schedule</p>
                      <p className="text-white font-medium">{selectedCourseReg.schedule}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Standard Duration</p>
                      <p className="text-white font-medium">{selectedCourseReg.duration}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Experience Level</p>
                      <p className="text-amber-300 font-medium">{selectedCourseReg.experienceLevel}</p>
                    </div>
                  </div>

                  {selectedCourseReg.notes && (
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
                        Student Learning Goals / Notes:
                      </p>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
                        "{selectedCourseReg.notes}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Student Contact Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Phone / WhatsApp</p>
                    <p className="text-white font-mono font-bold text-sm">{selectedCourseReg.phone}</p>
                    <a href={`tel:${selectedCourseReg.phone}`} className="text-sky-400 text-[11px] hover:underline mt-1 inline-block">
                      Call Direct
                    </a>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Email Address</p>
                    <p className="text-white font-mono font-bold text-sm break-all">{selectedCourseReg.email}</p>
                    <a href={`mailto:${selectedCourseReg.email}`} className="text-sky-400 text-[11px] hover:underline mt-1 inline-block">
                      Send Email
                    </a>
                  </div>
                </div>

                {/* Admin Internal Notes Box */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Internal Course Administration & Tutor Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add batch assignment, tuition status, instructor notes, or certificate records..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="mt-2.5 flex items-center justify-between">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNote}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {savingNote ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Save Notes</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCourseRegItem(selectedCourseReg.id)}
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
                    Internal Engineering & Triage Notes:
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
                      <span>Save Notes</span>
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
                <h3 className="text-sm font-bold text-slate-300">Select a Record</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Click on any course registration (with stored registration date) or client quote from the list to inspect full details, update statuses, or reply directly.
                </p>
              </div>
            )}
          </div>

        </div>
        )}
      </div>

      {/* Official Course Registration Admission & Payment Notice Modal */}
      {courseAcceptanceModal.isOpen && courseAcceptanceModal.courseReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-7 relative max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <span>Course Admission Approved & Notice Dispatched</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Status set to <span className="text-emerald-400 font-semibold">ADMITTED</span>. Student instructed to chat <span className="text-sky-300 font-mono font-bold">09129216768</span> for payment & enquiry.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCourseAcceptanceModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body - Scrollable */}
            <div className="overflow-y-auto py-4 space-y-4 pr-1">
              
              {/* Summary Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Student</span>
                  <span className="text-white font-semibold truncate block">{courseAcceptanceModal.courseReg.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Course</span>
                  <span className="text-emerald-400 font-semibold truncate block">{courseAcceptanceModal.courseReg.courseTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Registration Ref</span>
                  <span className="text-sky-400 font-mono font-bold block">{courseAcceptanceModal.courseReg.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Payment Line</span>
                  <span className="text-amber-300 font-mono font-bold truncate block">09129216768</span>
                </div>
              </div>

              {/* Subject line box */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Subject Line:</label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(courseAcceptanceModal.emailSubject);
                    }}
                    className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Subject</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200">
                  {courseAcceptanceModal.emailSubject}
                </div>
              </div>

              {/* Email Body box */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Official Admission Notice Content:</label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(courseAcceptanceModal.emailBody);
                      setCourseAcceptanceModal(prev => ({ ...prev, copied: true }));
                      setTimeout(() => setCourseAcceptanceModal(prev => ({ ...prev, copied: false })), 3000);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60"
                  >
                    {courseAcceptanceModal.copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{courseAcceptanceModal.copied ? 'Copied to Clipboard!' : 'Copy Email Body'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto select-all">
                  {courseAcceptanceModal.emailBody}
                </div>
              </div>

            </div>

            {/* Footer Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <a
                  href={courseAcceptanceModal.mailtoUrl}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                >
                  <MailCheck className="w-4 h-4" />
                  <span>Launch in Email App (Direct Mailto)</span>
                </a>

                <a
                  href={getWhatsAppCourseRegLink(courseAcceptanceModal.courseReg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => setCourseAcceptanceModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
