import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  ShieldAlert, 
  Send,
  Zap
} from 'lucide-react';
import { IssueTicketFormData } from '../types';
import { saveInquiry } from '../lib/inquiriesService';

interface IssueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueReportModal: React.FC<IssueReportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState<IssueTicketFormData>({
    fullName: '',
    email: '',
    phone: '',
    softwareType: 'WordPress Website',
    urgency: 'High (Same-Day)',
    affectedUrlOrSystem: '',
    errorDescription: '',
    accessAvailable: true
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const generatedTicket = `OCEAN-FIX-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);

    try {
      await saveInquiry({
        type: 'emergency_issue',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.softwareType,
        urgency: formData.urgency,
        affectedUrlOrSystem: formData.affectedUrlOrSystem,
        message: `Ticket: ${generatedTicket} | Error: ${formData.errorDescription} | Access Provided: ${formData.accessAvailable ? 'Yes' : 'No'}`,
        preferredContact: 'WhatsApp / Call'
      });
    } catch (err) {
      console.error('Error saving emergency ticket:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleSendWhatsAppEmergency = () => {
    const text = encodeURIComponent(
      `🚨 *URGENT SOFTWARE ISSUE REPORT*\nTicket: ${ticketId || 'New Emergency'}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nType: ${formData.softwareType}\nUrgency: ${formData.urgency}\nAffected URL: ${formData.affectedUrlOrSystem || 'N/A'}\nError: ${formData.errorDescription}\nOffice: Agbani / Remote`
    );
    window.open(`https://wa.me/2349129216768?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 text-amber-200 hover:text-white hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>24/7 Rapid Response Software Triage</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Report a Broken Website or Software Issue
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            Is your website crashing, payment failing, or mobile app down? Our Agbani engineering team begins diagnosis immediately.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-mono text-xs font-bold rounded-full">
                Ticket: {ticketId}
              </span>
              <h4 className="text-2xl font-bold text-slate-900 font-display">
                Emergency Ticket Dispatched!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your incident has been routed to our on-duty engineer. We are standing by to inspect <span className="font-semibold text-slate-900">{formData.affectedUrlOrSystem || 'your system'}</span>.
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-4 text-xs space-y-2 text-left max-w-md mx-auto">
              <p className="font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> For immediate attention within 10 minutes:
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-slate-800">
                <span>Call Hotline: <strong className="text-emerald-400 font-mono">{COMPANY_INFO.phone}</strong></span>
                <a 
                  href={COMPANY_INFO.phoneTel}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-[11px] font-bold text-white transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSendWhatsAppEmergency}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Forward Ticket to WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name / Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Obinna Kingsley"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Active Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 09129216768"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. info@business.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e: any) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-medium cursor-pointer"
                >
                  <option value="Critical Emergency (Within 2-4 hrs)">🚨 Critical Emergency (Site Down / Zero Sales)</option>
                  <option value="High (Same-Day)">⚡ High (Same-Day Fix)</option>
                  <option value="Standard (Within 24-48 hrs)">Standard Diagnostic (24-48 hrs)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Software / System Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.softwareType}
                  onChange={(e: any) => setFormData({ ...formData, softwareType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 cursor-pointer"
                >
                  <option value="WordPress Website">WordPress / WooCommerce Site</option>
                  <option value="Custom Web App (React/Node/PHP)">Custom Web App (React / Node / PHP)</option>
                  <option value="Mobile App (Android/iOS)">Mobile App (Flutter / React Native / Android)</option>
                  <option value="Database / Server">Database / Server / cPanel</option>
                  <option value="E-Commerce Store">E-Commerce Store (Payment Gateway Failure)</option>
                  <option value="Other">Other Software / System</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Affected URL / Domain Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. www.yoursite.com or app link"
                  value={formData.affectedUrlOrSystem}
                  onChange={(e) => setFormData({ ...formData, affectedUrlOrSystem: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Describe the Error / What Happens When You Use It <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Payment gives error 500, white blank screen after login, database error, server timeout..."
                value={formData.errorDescription}
                onChange={(e) => setFormData({ ...formData, errorDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>NDA & Server Confidentiality Protected</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendWhatsAppEmergency}
                  className="px-3.5 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Direct WhatsApp Hotline</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Dispatch Ticket</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
