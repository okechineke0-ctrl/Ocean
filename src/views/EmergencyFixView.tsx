import React, { useState } from 'react';
import { ViewMode } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ShieldAlert, 
  Bug, 
  Send,
  Database,
  CreditCard,
  Server
} from 'lucide-react';
import { saveInquiry } from '../lib/inquiriesService';

interface EmergencyFixViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenIssueReport: () => void;
}

export const EmergencyFixView: React.FC<EmergencyFixViewProps> = ({
  onNavigate,
  onOpenIssueReport
}) => {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    issueType: 'Broken Payment / Checkout (Paystack/Flutterwave)',
    affectedSite: '',
    description: ''
  });

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveInquiry({
        type: 'emergency_issue',
        fullName: form.name,
        email: form.email || 'emergency@oceantechnologies.ng',
        phone: form.phone,
        serviceType: form.issueType,
        affectedUrlOrSystem: form.affectedSite,
        message: form.description || 'Quick emergency triage form submission',
        urgency: 'Immediate Triage',
        preferredContact: 'WhatsApp / Phone Call'
      });
    } catch (err) {
      console.error('Error saving emergency ticket:', err);
    }
    setTicketSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `🚨 *EMERGENCY SOFTWARE ASSISTANCE REQUEST*\nName: ${form.name || 'Emergency Client'}\nPhone: ${form.phone}\nIssue Type: ${form.issueType}\nAffected URL: ${form.affectedSite}\nDetails: ${form.description || 'Immediate emergency triage requested'}\nDirect from Ocean Technologies Web portal`
    );
    window.open(`https://wa.me/2349129216768?text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Emergency Alert Banner Header */}
      <section className="bg-amber-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-700/80 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500">
              <Zap className="w-4 h-4 text-amber-200" />
              <span>24/7 Rapid Response Software Triage</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight mb-4">
              Emergency Website & Software Bug Diagnostic
            </h1>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Is your website down, payment gateway failing, server throwing 500 errors, or mobile app crashing? Our senior software engineers in Agbani are ready to triage and repair your system within 2 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotlines Strip */}
      <section className="bg-slate-900 text-white py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Direct Emergency Hotline (Call Now):</p>
              <a href={COMPANY_INFO.phoneTel} className="text-xl font-bold font-mono text-emerald-400 hover:underline">
                {COMPANY_INFO.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Instant WhatsApp Hotline</span>
            </a>

            <button
              onClick={onOpenIssueReport}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Dispatch Incident Ticket
            </button>
          </div>
        </div>
      </section>

      {/* Main Content & Triage Form */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Common Emergencies Fixed (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 font-display mb-4">
                Critical Software Emergencies We Fix Instantly
              </h2>
              <p className="text-xs text-slate-600 mb-6">
                Do not let software downtime cost you sales, customer trust, or search engine rankings. We solve:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Broken Checkout & Payments</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Paystack, Flutterwave, Stripe webhook failures, cart errors, and transaction verification timeouts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>500 Server Errors & Blank Screen</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    PHP fatal errors, memory limit crashes, WordPress White Screen of Death, and corrupted plugins.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>Database Deadlocks & Corruptions</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    MySQL / PostgreSQL connection refusals, locked session tables, and lost database configurations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Server className="w-4 h-4 text-sky-600" />
                    <span>Server Crash & SSL Expirations</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Expired SSL security certificates, DNS misconfigurations, cPanel lockouts, and Cloudflare errors.
                  </p>
                </div>
              </div>

              {/* 3-Step Rescue Process */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Our Emergency Resolution Process:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center mb-2">1</span>
                    <strong className="text-slate-900 block mb-1">Instant Triage</strong>
                    <p className="text-slate-600 text-[11px]">We inspect server error logs and trace the exact breaking point within 30 minutes.</p>
                  </div>

                  <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center mb-2">2</span>
                    <strong className="text-slate-900 block mb-1">Permanent Fix</strong>
                    <p className="text-slate-600 text-[11px]">We apply code and database patches in staging and verify live transactions.</p>
                  </div>

                  <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center mb-2">3</span>
                    <strong className="text-slate-900 block mb-1">Warranty & Shield</strong>
                    <p className="text-slate-600 text-[11px]">All one-off repairs include a 7-day post-fix warranty and prevention report.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Dispatch Ticket Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Direct Emergency Ticket</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display mb-1">
              Dispatch an Issue to Our Engineers
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our Agbani duty engineer will contact you via Phone / WhatsApp immediately.
            </p>

            {ticketSubmitted ? (
              <div className="p-6 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Incident Ticket Received!</h4>
                <p className="text-xs text-slate-600">
                  We are reviewing the report for <span className="font-semibold text-slate-900">{form.affectedSite}</span>. We will call you at <span className="font-semibold text-slate-900">{form.phone}</span> in a few moments.
                </p>
                <button
                  onClick={handleWhatsAppSend}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Direct WhatsApp Update</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chukwuma Jude"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 09129216768"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
                  <select
                    value={form.issueType}
                    onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 cursor-pointer"
                  >
                    <option value="Broken Payment / Checkout (Paystack/Flutterwave)">Broken Payment / Checkout (Paystack/Flutterwave)</option>
                    <option value="500 Internal Server Error / White Blank Screen">500 Internal Server Error / White Blank Screen</option>
                    <option value="Database Connection Error / Crash">Database Connection Error / Crash</option>
                    <option value="Hacked Website / Malware Removal">Hacked Website / Malware Removal</option>
                    <option value="Mobile App API Down">Mobile App API Down</option>
                    <option value="Other Urgent Software Breakdown">Other Urgent Software Breakdown</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Affected Website URL / App *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://www.yourdomain.com"
                    value={form.affectedSite}
                    onChange={(e) => setForm({ ...form, affectedSite: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Describe What is Happening *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain the error message or what happens when a user clicks..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Emergency Ticket Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Forward to WhatsApp (09129216768)</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
