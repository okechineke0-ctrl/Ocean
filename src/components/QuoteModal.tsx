import React, { useState } from 'react';
import { SERVICES, COMPANY_INFO } from '../data/companyData';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  Phone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { QuoteRequestFormData } from '../types';
import { saveInquiry } from '../lib/inquiriesService';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServiceId?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  selectedServiceId
}) => {
  const [formData, setFormData] = useState<QuoteRequestFormData>({
    fullName: '',
    email: '',
    phone: '',
    companyOrProject: '',
    serviceType: selectedServiceId || 'Website Development',
    timeline: 'Within 2 to 4 Weeks',
    budgetRange: '₦150,000 – ₦400,000',
    description: '',
    currentWebsiteOrAppUrl: '',
    contactMethod: 'WhatsApp'
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await saveInquiry({
        type: 'quote',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyOrProject: formData.companyOrProject,
        serviceType: formData.serviceType,
        timeline: formData.timeline,
        budgetRange: formData.budgetRange,
        message: `${formData.description || 'No description provided'}${formData.currentWebsiteOrAppUrl ? ` | URL: ${formData.currentWebsiteOrAppUrl}` : ''}`,
        preferredContact: formData.contactMethod
      });
    } catch (err) {
      console.error('Error saving quote inquiry:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  const sendDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Ocean Technologies!\nMy name is ${formData.fullName || 'Client'}.\nI need: *${formData.serviceType}*\nProject: ${formData.companyOrProject || 'New System'}\nTimeline: ${formData.timeline}\nBudget: ${formData.budgetRange}\nDetails: ${formData.description || 'Please provide a quote'}\nPhone: ${formData.phone}`
    );
    window.open(`https://wa.me/2349129216768?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Fast & Free Estimate • Agbani, Enugu State</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Request a Project Quote
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Tell us about your website, mobile app, or software maintenance needs. Our senior engineers in Agbani respond within 2 hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-2xl font-bold text-slate-900 font-display">
                Quote Request Received!
              </h4>
              <p className="text-sm text-slate-600">
                Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>. An Ocean Technologies engineer is reviewing your project details. We will contact you at <span className="font-semibold text-slate-900">{formData.phone || formData.email}</span> shortly.
              </p>
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-xs text-slate-700 max-w-md mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Need immediate response? Call our Agbani office:</span>
              </div>
              <a href={COMPANY_INFO.phoneTel} className="font-bold text-sky-700 hover:underline shrink-0">
                {COMPANY_INFO.phone}
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={sendDirectWhatsApp}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp to 09129216768</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Chukwu"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678 or +234..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
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
                  placeholder="e.g. yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech / Personal Project"
                  value={formData.companyOrProject}
                  onChange={(e) => setFormData({ ...formData, companyOrProject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Service <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all cursor-pointer"
                >
                  <option value="Website Development">Website Development (Corporate, E-Commerce, Blog)</option>
                  <option value="Mobile App Development">Mobile App Development (Android & iOS)</option>
                  <option value="Website Maintenance">Website Maintenance & Speed Retainer</option>
                  <option value="Software Troubleshooting">Software Debugging & Issue Troubleshooting</option>
                  <option value="Custom Portals & APIs">Custom Management Portal / School / Hospital Portal</option>
                  <option value="Internship / IT & SIWES Placement">Student Internship / IT & SIWES Placement (Agbani Hub)</option>
                  <option value="Cloud Infrastructure & Performance">Cloud Infrastructure & Server Setup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all cursor-pointer"
                >
                  <option value="Urgent (Within 1 Week)">Urgent (Within 1 Week)</option>
                  <option value="Within 2 to 4 Weeks">Within 2 to 4 Weeks</option>
                  <option value="1 to 2 Months">1 to 2 Months</option>
                  <option value="Flexible / Ongoing Retainer">Flexible / Ongoing Retainer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Budget Expectation (NGN)
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all cursor-pointer"
                >
                  <option value="₦25,000 – ₦100,000 (Bug Fix / Maintenance)">₦25,000 – ₦100,000 (Bug Fix / Maintenance)</option>
                  <option value="₦150,000 – ₦350,000 (Standard Website)">₦150,000 – ₦350,000 (Standard Website)</option>
                  <option value="₦350,000 – ₦800,000 (Mobile App / E-Commerce)">₦350,000 – ₦800,000 (Mobile App / E-Commerce)</option>
                  <option value="₦800,000+ (Custom Portal / Enterprise)">₦800,000+ (Custom Portal / Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Website / App Link (If any)
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.currentWebsiteOrAppUrl}
                  onChange={(e) => setFormData({ ...formData, currentWebsiteOrAppUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Overview & What You Want to Achieve <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe your website or app requirements, features, problems you want solved..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero spam guarantee. 100% confidential.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={sendDirectWhatsApp}
                  className="px-3.5 py-2.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Send to WhatsApp</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <span>Sending Request...</span>
                  ) : (
                    <>
                      <span>Send Quote Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
