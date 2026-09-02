import React, { useState, useEffect } from 'react';
import { InquiryRecord, ViewMode } from '../types';
import { 
  subscribeToInquiries, 
  updateInquiryStatus, 
  deleteInquiry 
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
  Lock
} from 'lucide-react';

interface AdminInboxViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const AdminInboxView: React.FC<AdminInboxViewProps> = ({ onNavigate }) => {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Authenticate simple admin lock PIN (default code: 1234 or custom staff password)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or ocean2026
    if (passcode === '1234' || passcode.toLowerCase() === 'ocean2026' || passcode === '09129216768') {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Real-time Firestore sync listener
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToInquiries((items) => {
      setInquiries(items);
      setLoading(false);
      
      // Update selected inquiry reference if active
      if (selectedInquiry) {
        const updated = items.find((i) => i.id === selectedInquiry.id);
        if (updated) {
          setSelectedInquiry(updated);
          setNotesInput(updated.adminNotes || '');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelectInquiry = (inquiry: InquiryRecord) => {
    setSelectedInquiry(inquiry);
    setNotesInput(inquiry.adminNotes || '');
  };

  const handleStatusChange = async (id: string, newStatus: InquiryRecord['status']) => {
    await updateInquiryStatus(id, newStatus);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNote(true);
    await updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, notesInput);
    setSavingNote(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message record from the PostgreSQL database?')) {
      await deleteInquiry(id);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const getWhatsAppReplyLink = (inquiry: InquiryRecord) => {
    const text = encodeURIComponent(
      `Hello ${inquiry.fullName},\nThis is Ocean Technologies (Agbani, Enugu State).\nWe received your inquiry regarding "${inquiry.serviceType || inquiry.type}".\nWe would love to discuss your requirements.`
    );
    const cleanPhone = inquiry.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    return `https://wa.me/${intlPhone}?text=${text}`;
  };

  const getEmailReplyLink = (inquiry: InquiryRecord) => {
    const subject = encodeURIComponent(`Response from Ocean Technologies regarding your inquiry (${inquiry.serviceType || 'Services'})`);
    const body = encodeURIComponent(
      `Hello ${inquiry.fullName},\n\nThank you for reaching out to Ocean Technologies in Agbani, Enugu State.\n\nWe have reviewed your message:\n"${inquiry.message || 'Project Inquiry'}"\n\nBest regards,\nOcean Technologies Team\nHotline: 09129216768\nAgbani, Enugu State, Nigeria`
    );
    return `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.serviceType && inq.serviceType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchesType = typeFilter === 'all' || inq.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const counts = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    quotes: inquiries.filter((i) => i.type === 'quote').length,
    emergency: inquiries.filter((i) => i.type === 'emergency_issue').length,
    contact: inquiries.filter((i) => i.type === 'contact').length,
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
        hour12: true
      });
    } catch {
      return isoString;
    }
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
            Database records and client contact details are restricted to authorized Ocean Technologies personnel.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Enter Admin PIN or Passcode:
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="Enter PIN (e.g. 1234)"
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500 font-mono text-center tracking-widest text-lg"
              />
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-2 text-center">
                  Incorrect PIN. (Default staff PIN: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">1234</code>)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              Unlock Database Inbox
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-slate-300 transition-colors"
            >
              ← Back to Main Website
            </button>
            <span>Staff PIN: 1234</span>
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
                <h1 className="text-xl font-bold font-display text-white">PostgreSQL Database Portal</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                  <span>Cloud SQL PostgreSQL Live</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ocean Technologies HQ Database (Drizzle ORM) • Project Quotes, Contact Messages & Emergency Bug Reports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                setLoading(true);
                const items = await fetchInquiriesFromPostgres();
                setInquiries(items);
                setLoading(false);
              }}
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
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 font-medium">Total Received</p>
            <p className="text-2xl font-bold font-display text-white mt-1">{counts.total}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Stored in PostgreSQL database</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-amber-400 font-medium">New Unread</p>
            <p className="text-2xl font-bold font-display text-amber-300 mt-1">{counts.new}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting engineer reply</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-sky-400 font-medium">Quote Estimates</p>
            <p className="text-2xl font-bold font-display text-sky-300 mt-1">{counts.quotes}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Web & Mobile Leads</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
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
              placeholder="Search by client name, email, phone, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Type:</span>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden"
            >
              <option value="all">All Inquiries ({counts.total})</option>
              <option value="quote">Quotes ({counts.quotes})</option>
              <option value="emergency_issue">Emergency Bugs ({counts.emergency})</option>
              <option value="contact">Contact Messages ({counts.contact})</option>
            </select>

            <div className="flex items-center gap-1 text-xs text-slate-400 ml-2">
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="new">New (Unresponded)</option>
              <option value="in_progress">In Progress</option>
              <option value="responded">Responded</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Message Inquiries List (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-sky-400" />
                <span>Inbox Messages ({filteredInquiries.length})</span>
              </h2>
              {loading && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />}
            </div>

            <div className="max-h-[650px] overflow-y-auto divide-y divide-slate-800/60">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p>No inquiry messages match your filter.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Test the Quote Modal or Contact Form to generate real-time records.</p>
                </div>
              ) : (
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
                          {inq.type === 'emergency_issue' ? 'Emergency' : inq.type}
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
                })
              )}
            </div>
          </div>

          {/* Right: Message Details & Actions (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
            {selectedInquiry ? (
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
                      onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryRecord['status'])}
                      className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-hidden"
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
                      href={getWhatsAppReplyLink(selectedInquiry)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Reply on WhatsApp</span>
                    </a>
                    <a
                      href={getEmailReplyLink(selectedInquiry)}
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
                    <p className="text-white font-mono text-xs truncate">{selectedInquiry.email}</p>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sky-400 text-[11px] hover:underline mt-1 inline-block">
                      Send Email
                    </a>
                  </div>

                  {selectedInquiry.serviceType && (
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Service or Topic</p>
                      <p className="text-white font-semibold">{selectedInquiry.serviceType}</p>
                    </div>
                  )}

                  {selectedInquiry.budgetRange && (
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Budget Range</p>
                      <p className="text-emerald-400 font-bold">{selectedInquiry.budgetRange}</p>
                    </div>
                  )}

                  {selectedInquiry.timeline && (
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Project Timeline</p>
                      <p className="text-sky-300 font-semibold">{selectedInquiry.timeline}</p>
                    </div>
                  )}

                  {selectedInquiry.urgency && (
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Urgency Level</p>
                      <p className="text-amber-400 font-bold">{selectedInquiry.urgency}</p>
                    </div>
                  )}
                </div>

                {/* Message / Bug Details */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Full Submission Details:
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message || 'No detailed message provided.'}
                  </p>
                </div>

                {/* Internal Admin Notes */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Internal Engineer Notes (Agbani Office Staff):
                    </label>
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNote}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {savingNote ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Add internal notes about quote pricing, follow-up date, or engineer assigned..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500"
                  ></textarea>
                </div>

                {/* Bottom Delete Control */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record from Firestore</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-24 text-center text-slate-500 space-y-3">
                <Database className="w-12 h-12 text-slate-600 mx-auto opacity-40" />
                <h3 className="text-sm font-bold text-slate-300">No Message Selected</h3>
                <p className="text-xs max-w-sm mx-auto text-slate-500">
                  Select an inquiry from the left panel to review full details, adjust workflow status, and reply directly via WhatsApp or Email.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
