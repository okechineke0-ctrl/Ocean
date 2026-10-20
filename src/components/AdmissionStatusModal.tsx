import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  MessageCircle, 
  Calendar, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { checkAdmissionStatus, AdmissionStatusResult } from '../lib/inquiriesService';
import { COMPANY_INFO } from '../data/companyData';

interface AdmissionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery?: string;
  onOpenRegister?: () => void;
}

export const AdmissionStatusModal: React.FC<AdmissionStatusModalProps> = ({
  isOpen,
  onClose,
  defaultQuery = '',
  onOpenRegister,
}) => {
  const [query, setQuery] = useState(defaultQuery);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [result, setResult] = useState<AdmissionStatusResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (defaultQuery) {
      setQuery(defaultQuery);
      handleCheck(defaultQuery);
    }
  }, [defaultQuery, isOpen]);

  if (!isOpen) return null;

  const handleCheck = async (targetQuery?: string) => {
    const q = (targetQuery !== undefined ? targetQuery : query).trim();
    if (!q) return;

    setIsChecking(true);
    setHasChecked(true);

    try {
      const res = await checkAdmissionStatus(q);
      setResult(res);
    } catch (err) {
      console.error('Admission check error:', err);
      setResult({
        found: false,
        isAdmitted: false,
        admissionStatus: 'NOT ADMITTED',
        statusLabel: 'Verification Error',
        message: 'Could not connect to admission records. Please check your connection or contact our coordinator on WhatsApp.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  const admissionWhatsAppMessage = encodeURIComponent(
    `Hello Ocean Technologies Admissions Coordinator,\n\nI am checking my Admission Status on the portal:\n• Reg Number: ${result?.registrationNumber || query}\n• Candidate Name: ${result?.fullName || 'Applicant'}\n• Program: ${result?.courseTitle || 'Frontend Crash Course'}\n• Current Status: ${result?.admissionStatus || 'Under Review'}\n\nPlease confirm my admission and provide the official cohort onboarding timetable.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Ocean Tech Academy Admissions
                </span>
                <span className="text-[11px] text-sky-400 font-mono hidden sm:inline">Portal Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
                Check Admission Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Verify your course admission, batch schedule, and onboarding instructions.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Search Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleCheck();
            }}
            className="space-y-2"
          >
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Registration Number, Email, or Telephone
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. OCT-CRASH-2026-7842, OCT-CRS-2026-..., or phone"
                className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm font-medium outline-hidden"
              />
              <button
                type="submit"
                disabled={isChecking || !query.trim()}
                className="absolute right-1.5 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Verify Status</span>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Registration code was issued upon submitting your course or crash course form.
            </p>
          </form>

          {/* Results Area */}
          {hasChecked && result && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {result.found ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div 
                    className={`rounded-2xl p-5 border shadow-sm ${
                      result.isAdmitted
                        ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-emerald-300 text-emerald-950'
                        : 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                            result.isAdmitted 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {result.isAdmitted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Clock className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                result.isAdmitted
                                  ? 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-200 text-amber-900 border border-amber-300'
                              }`}
                            >
                              Status: {result.admissionStatus}
                            </span>
                          </div>
                          <h3 className="text-lg font-black mt-1">
                            {result.isAdmitted ? 'Congratulations! You Are Admitted' : 'Application In Review • Not Admitted Yet'}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm mt-3 leading-relaxed">
                      {result.adminNotes || (
                        result.isAdmitted
                          ? 'Your admission to the upcoming cohort has been approved. You are ready to join live classes and the official student WhatsApp group.'
                          : 'Your registration has been logged in our system and is currently undergoing coordinator review. Most admissions are processed within 24 hours.'
                      )}
                    </p>

                    {/* Registration Code Pill with Copy Button */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Registration No:</span>
                        <code className="bg-slate-900 text-sky-300 px-3 py-1 rounded-lg font-mono text-xs font-bold shadow-inner">
                          {result.registrationNumber}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.registrationNumber || '')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy Reg No</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Program Summary Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Student Name:</span>
                      <span className="font-bold text-slate-900">{result.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Course Program:</span>
                      <span className="font-bold text-slate-900">{result.courseTitle}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Program Duration:</span>
                      <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        {result.duration || '1 Month Intensive'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Learning Delivery:</span>
                      <span className="font-medium text-slate-800">
                        {result.classFormat || '100% Online Virtual Classroom'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-medium">Coordination Channel:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Official Student WhatsApp Group
                      </span>
                    </div>
                  </div>

                  {/* Next Step WhatsApp Action */}
                  <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-xl p-4 border border-emerald-600/40 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Direct Admissions Hotline & WhatsApp Group</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {result.isAdmitted
                        ? 'Message our Admissions Coordinator to receive your live Zoom/Google Meet links and student WhatsApp access.'
                        : 'Need immediate confirmation? Forward your registration number to our coordinator on WhatsApp for accelerated review.'}
                    </p>
                    <a
                      href={`https://wa.me/2349129216768?text=${admissionWhatsAppMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message Admissions Coordinator (09129216768)</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Not Found Card */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 mb-1.5">
                      Status: NOT ADMITTED
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      No Record Found for "{query}"
                    </h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                      Please double-check your registration code (e.g. OCT-CRASH-2026-XXXX) or the email/phone number you used during registration.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    {onOpenRegister && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenRegister();
                        }}
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Register for Crash Course Now</span>
                      </button>
                    )}
                    <a
                      href={`https://wa.me/2349129216768?text=${encodeURIComponent(`Hello, I could not find my registration for "${query}". Can you please assist me?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Help via WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Info Strip */}
          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 text-sky-950 text-xs flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold">Upcoming 1-Month Frontend Website Crash Course:</strong> Covers HTML, CSS, JavaScript, React.js, and GitHub version control. Classes are 100% online with direct senior engineer mentorship.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Admissions Hotline: <strong className="text-slate-700">09129216768</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
