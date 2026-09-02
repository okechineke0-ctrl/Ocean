import React, { useState } from 'react';
import { ViewMode } from '../types';
import { COMPANY_INFO, FAQS } from '../data/companyData';
import { saveInquiry } from '../lib/inquiriesService';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenIssueReport: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigate,
  onOpenIssueReport
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Website Development Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await saveInquiry({
        type: 'contact',
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.subject,
        message: formData.message,
        preferredContact: 'WhatsApp / Email'
      });
    } catch (err) {
      console.error('Error saving contact message:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Ocean Technologies!\nName: ${formData.name || 'Client'}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message || 'I would like to inquire about your software and website maintenance services.'}`
    );
    window.open(`https://wa.me/2349129216768?text=${text}`, '_blank');
  };

  const faqCategories = ['All', 'General', 'Website Development', 'Maintenance & Retainers', 'Urgent Software Fixes'];

  const filteredFaqs = FAQS.filter((f) => {
    if (activeFaqCategory === 'All') return true;
    return f.category === activeFaqCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
              Get in Touch • Agbani, Enugu State, Nigeria
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display mt-2 mb-4">
              Contact Ocean Technologies
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We are readily available for project discussions, custom software quotes, website maintenance agreements, and 24/7 emergency bug fixes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Coordinates & Form */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Contact Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Agbani Address Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-display mb-1">
                    Physical Office & Location
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {COMPANY_INFO.address}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enugu State University of Science and Technology (ESUT) Corridor
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-display mb-1">
                    Official Hotline & WhatsApp
                  </h3>
                  <p className="text-sm font-bold font-mono text-emerald-700">
                    <a href={COMPANY_INFO.phoneTel}>{COMPANY_INFO.phone}</a>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Available for direct calls and WhatsApp chat
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={COMPANY_INFO.phoneTel}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-800 text-center transition-colors"
                >
                  Call {COMPANY_INFO.phone}
                </a>
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Official Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-display mb-1">
                    Official Email Address
                  </h3>
                  <a href={COMPANY_INFO.emailMailto} className="text-xs font-bold text-sky-700 hover:underline break-all">
                    {COMPANY_INFO.email}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    For business proposals, tenders, and official inquiries
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-display mb-1">
                    Operating Schedule
                  </h3>
                  <p className="text-xs text-slate-700">
                    <strong>Monday – Saturday:</strong> 8:00 AM – 7:00 PM (WAT)
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    <strong>24/7 Emergency Support:</strong> Constant triage for server & bug emergencies
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Message Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 font-display mb-1">
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and an engineer will get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 font-display">Message Dispatched!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. We have received your inquiry regarding <span className="font-semibold text-slate-900">{formData.subject}</span>. We will reach out via <span className="font-semibold text-slate-900">{formData.phone || formData.email}</span>.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleSendWhatsApp}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chinelo Okoye"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 09129216768"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject / Area of Interest *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600 cursor-pointer"
                    >
                      <option value="Website Development Inquiry">New Website Development</option>
                      <option value="Mobile App Development Inquiry">Mobile App (Android/iOS)</option>
                      <option value="Monthly Website Maintenance">Monthly Website Maintenance Retainer</option>
                      <option value="Urgent Software Bug Fix">Urgent Software Bug / Error Fix</option>
                      <option value="Custom Portal / School Portal">Custom Portal / School Management System</option>
                      <option value="General Partnership">General Question / Agbani Office Visit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Message / Requirements *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your project requirements, features, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quick response guaranteed within 2 hours.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="px-3.5 py-2.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">Send via WhatsApp</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">Help & Answers</span>
            <h3 className="text-2xl font-bold text-slate-900 font-display mt-1">
              Frequently Asked Questions
            </h3>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeFaqCategory === cat
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-2 flex items-start gap-2">
                    <span className="text-sky-600 font-black">Q:</span>
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </section>

    </div>
  );
};
