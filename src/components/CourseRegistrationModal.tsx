import React, { useState, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  Laptop, 
  CheckCircle2, 
  Send, 
  Check, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  BookOpen, 
  MessageCircle, 
  ShieldCheck, 
  AlertCircle,
  Users,
  Clock,
  FileSearch,
  Copy,
  RefreshCw,
  Code2,
  GitBranch,
  Layers
} from 'lucide-react';
import { COURSES_OFFERED } from '../data/coursesData';
import { ClassFormat, CourseRegistrationFormData } from '../types';
import { 
  submitCourseRegistration, 
  submitCrashCourseRegistration, 
  checkAdmissionStatus, 
  AdmissionStatusResult 
} from '../lib/inquiriesService';
import { COMPANY_INFO } from '../data/companyData';

interface CourseRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string;
  defaultFormat?: ClassFormat;
}

export const CourseRegistrationModal: React.FC<CourseRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultCourseId = 'frontend_crash_course',
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(defaultCourseId);
  const [experienceLevel, setExperienceLevel] = useState<string>('Beginner');
  const [isCrashCourseMode, setIsCrashCourseMode] = useState<boolean>(
    defaultCourseId === 'frontend_crash_course' || defaultCourseId === undefined
  );

  useEffect(() => {
    if (defaultCourseId) {
      setSelectedCourseId(defaultCourseId);
      setIsCrashCourseMode(defaultCourseId === 'frontend_crash_course');
    }
  }, [defaultCourseId, isOpen]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ registrationNumber: string; storedDate: string; courseName: string } | null>(null);
  
  // Registration Number Copy state
  const [copiedCode, setCopiedCode] = useState(false);

  // Inline Admission Status Check state
  const [isCheckingAdmission, setIsCheckingAdmission] = useState(false);
  const [admissionStatusResult, setAdmissionStatusResult] = useState<AdmissionStatusResult | null>(null);

  if (!isOpen) return null;

  const currentCourse = COURSES_OFFERED.find((c) => c.id === selectedCourseId) || COURSES_OFFERED[0];

  const handleCopyCode = () => {
    if (!successData?.registrationNumber) return;
    navigator.clipboard.writeText(successData.registrationNumber).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  const handleCheckAdmissionInline = async () => {
    if (!successData?.registrationNumber) return;
    setIsCheckingAdmission(true);
    try {
      const res = await checkAdmissionStatus(successData.registrationNumber);
      setAdmissionStatusResult(res);
    } catch (err) {
      console.error('Admission status check failed:', err);
      setAdmissionStatusResult({
        found: true,
        registrationNumber: successData.registrationNumber,
        isAdmitted: false,
        admissionStatus: 'NOT ADMITTED',
        statusLabel: 'Not Admitted (Under Review)',
        adminNotes: 'Your registration was successfully logged. Admissions review takes approximately 24 hours. Message coordinator on WhatsApp for priority admission.',
      });
    } finally {
      setIsCheckingAdmission(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 7) {
      setSubmitError('Please enter a valid WhatsApp / phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const todayFormatted = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      let regNumber = '';

      if (isCrashCourseMode || selectedCourseId === 'frontend_crash_course') {
        // Dedicated 1-Month Frontend Website Engineering Crash Course submission
        const result = await submitCrashCourseRegistration({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          experienceLevel,
          githubUsername: githubUsername.trim(),
          notes: notes.trim(),
          preferredSchedule: 'Live Online • Coordinated in WhatsApp Group',
        });
        regNumber = result.registrationNumber;
      } else {
        // General Academy Course submission
        const payload: CourseRegistrationFormData = {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          course: currentCourse.id,
          courseTitle: currentCourse.name,
          classFormat: 'online',
          schedule: 'Coordinated in WhatsApp Group',
          duration: currentCourse.duration,
          experienceLevel,
          preferredStartDate: 'Immediate Cohort (Coordinated via WhatsApp)',
          notes: [notes.trim(), githubUsername ? `GitHub: ${githubUsername.trim()}` : ''].filter(Boolean).join(' | '),
        };

        const result = await submitCourseRegistration(payload);
        regNumber = result.registrationNumber;
      }

      setSuccessData({ 
        registrationNumber: regNumber,
        storedDate: todayFormatted,
        courseName: isCrashCourseMode ? '1-Month Frontend Website Engineering Crash Course' : currentCourse.name,
      });

    } catch (err: any) {
      console.error('Course registration submit failed:', err);
      setSubmitError(err?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setAdmissionStatusResult(null);
    setCopiedCode(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setGithubUsername('');
    setNotes('');
  };

  const selectedCourseWhatsAppMessage = encodeURIComponent(
    `Hello Ocean Technologies Admissions Coordinator,\n\nI have registered for the 1-Month Frontend Website Crash Course on the website:\n• Student Name: ${fullName}\n• Course Track: ${successData?.courseName || '1-Month Frontend Website Crash Course (HTML, CSS, JS, React, GitHub)'}\n• Registration Number: ${successData?.registrationNumber || 'OCT-CRASH-2026'}\n• Phone Number: ${phone}\n\nPlease verify my admission status and add me to the official student WhatsApp group for the upcoming cohort!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#07192f] to-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Ocean Tech Academy • 2026 Admissions
                </span>
                <span className="text-xs text-emerald-400 font-medium hidden sm:inline">• 100% Online Cohorts</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
                {isCrashCourseMode ? 'Register for 1-Month Crash Course' : 'Academy Course Registration'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {isCrashCourseMode 
                  ? 'Intensive 1-month practical frontend website development with senior software engineer mentorship.'
                  : 'Live interactive classes, hands-on production code, and dedicated senior engineering mentorship.'}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Program Toggle Tabs (When not submitted yet) */}
          {!successData && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setIsCrashCourseMode(true);
                  setSelectedCourseId('frontend_crash_course');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCrashCourseMode 
                    ? 'bg-sky-500 text-white shadow-xs' 
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>1-Month Frontend Crash Course (HTML, CSS, JS, React, GitHub)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCrashCourseMode(false);
                  if (selectedCourseId === 'frontend_crash_course') {
                    setSelectedCourseId('ai_learning_mentorship');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isCrashCourseMode 
                    ? 'bg-sky-500 text-white shadow-xs' 
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Other Programs</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {successData ? (
            /* ==========================================
               SUCCESS VIEW: ISSUE REG NUMBER + COPY + CHECK ADMISSION STATUS
               ========================================== */
            <div className="space-y-5 py-2 animate-in fade-in duration-200">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Registration Confirmed
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                    Welcome to Ocean Technologies!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                    Your registration has been saved to our admissions system. Your official registration number is:
                  </p>
                </div>

                {/* REGISTRATION NUMBER BOX WITH 1-CLICK COPY BUTTON */}
                <div className="bg-slate-900 text-sky-300 rounded-2xl p-4 max-w-md mx-auto border border-sky-500/40 shadow-inner space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                    Official Student Registration Number
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-xl sm:text-2xl font-black text-sky-300 tracking-wide select-all">
                      {successData.registrationNumber}
                    </span>
                    <button
                      type="button"
                      id="copy-reg-number-btn"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      title="Copy registration number"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span className="text-emerald-200 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Keep this number safe! Use it anytime to verify your admission status.
                  </p>
                </div>
              </div>

              {/* CHECK ADMISSION STATUS BUTTON & INLINE VERIFICATION CARD */}
              <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 border border-sky-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-sky-600" />
                      Admission Status Verification
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Verify if your application has been officially admitted to the upcoming cohort.
                    </p>
                  </div>
                  <button
                    type="button"
                    id="check-admission-status-btn"
                    onClick={handleCheckAdmissionInline}
                    disabled={isCheckingAdmission}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
                  >
                    {isCheckingAdmission ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <FileSearch className="w-4 h-4" />
                        <span>Check Admission Status</span>
                      </>
                    )}
                  </button>
                </div>

                {/* ADMISSION STATUS RESULT DISPLAY (ADMITTED OR NOT ADMITTED) */}
                {admissionStatusResult && (
                  <div className="pt-3 border-t border-sky-100 animate-in fade-in duration-200">
                    {admissionStatusResult.isAdmitted ? (
                      /* ADMITTED STATE */
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                              Status: ADMITTED
                            </span>
                            <h4 className="text-sm font-black text-emerald-950 mt-0.5">
                              Congratulations! You are officially Admitted!
                            </h4>
                          </div>
                        </div>
                        <p className="text-xs text-emerald-900 leading-relaxed">
                          {admissionStatusResult.adminNotes || 'Your registration has been approved for the upcoming 1-Month Frontend Website Engineering Crash Course cohort. Please join the official student WhatsApp group below to receive your live class schedule and onboarding materials.'}
                        </p>
                      </div>
                    ) : (
                      /* NOT ADMITTED (UNDER REVIEW) STATE */
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white">
                              Status: NOT ADMITTED (Under Review)
                            </span>
                            <h4 className="text-sm font-black text-amber-950 mt-0.5">
                              Application Received & Currently In Review
                            </h4>
                          </div>
                        </div>
                        <p className="text-xs text-amber-900 leading-relaxed">
                          {admissionStatusResult.adminNotes || 'Your registration has been received and is currently undergoing coordinator review. Student cohorts are processed within 24 hours. Message our admissions coordinator on WhatsApp with your registration number for priority admission!'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* WhatsApp Group Callout Box */}
              <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-xl p-4 border border-emerald-600/40 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Next Step: Official Student WhatsApp Community</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All live lecture links, timetables, Zoom/Google Meet links, and hands-on repository invitations are coordinated directly in our official student WhatsApp group.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/2349129216768?text=${selectedCourseWhatsAppMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Join WhatsApp Group / Confirm Admission (09129216768)</span>
                  </a>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Selected Program:</span>
                  <span className="font-bold text-slate-900">{successData.courseName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Duration:</span>
                  <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                    1 Month Intensive (Upcoming Special Cohort)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Class Format:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    🌐 100% Online Virtual Classroom
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Student Name:</span>
                  <span className="font-semibold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Registered Date:</span>
                  <span className="font-bold text-slate-800">{successData.storedDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCheckAdmissionInline}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  <span>Check Admission Status</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Register Another Student
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================
               STREAMLINED REGISTRATION FORM
               ========================================== */
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* SPECIAL 1-MONTH FRONTEND CRASH COURSE HIGHLIGHT BANNER */}
              {isCrashCourseMode ? (
                <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white border border-sky-400/40 rounded-2xl p-4 shadow-md space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-display">
                            Special 1-Month Crash Course
                          </span>
                          <span className="text-[10px] text-sky-300 font-bold">100% Online</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-white font-display mt-0.5">
                          Frontend Website Engineering (HTML, CSS, JS, React & GitHub)
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our fast-track, practical crash course designed to take you from foundational code to deploying production-ready responsive websites in 1 month. Hands-on coding and weekly senior engineer critiques.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-2 border-t border-white/10 text-[11px]">
                    <div className="bg-white/10 px-2 py-1 rounded text-center">
                      <span className="font-bold text-sky-300 block">HTML5</span>
                      <span className="text-[9px] text-slate-300">Semantic Web</span>
                    </div>
                    <div className="bg-white/10 px-2 py-1 rounded text-center">
                      <span className="font-bold text-sky-300 block">CSS3 / Tailwind</span>
                      <span className="text-[9px] text-slate-300">Responsive Layouts</span>
                    </div>
                    <div className="bg-white/10 px-2 py-1 rounded text-center">
                      <span className="font-bold text-sky-300 block">Modern JS (ES6+)</span>
                      <span className="text-[9px] text-slate-300">DOM & Async/Fetch</span>
                    </div>
                    <div className="bg-white/10 px-2 py-1 rounded text-center">
                      <span className="font-bold text-sky-300 block">React.js</span>
                      <span className="text-[9px] text-slate-300">Hooks & Components</span>
                    </div>
                    <div className="bg-white/10 px-2 py-1 rounded text-center col-span-2 sm:col-span-1">
                      <span className="font-bold text-sky-300 block">Git & GitHub</span>
                      <span className="text-[9px] text-slate-300">Version Control</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* WHATSAPP COORDINATION NOTICE FOR GENERAL COURSES */
                <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-800 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">100% Online • Schedules in WhatsApp Group</h4>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                      Class schedules, timetables, and live interactive session links are coordinated directly inside the official student WhatsApp group.
                    </p>
                  </div>
                </div>
              )}

              {/* 1. SELECT COURSE TRACK (IF GENERAL MODE) */}
              {!isCrashCourseMode && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      <span>Select Academy Course Track</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">Choose your focus area</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                    {COURSES_OFFERED.map((course) => {
                      const isSelected = course.id === selectedCourseId;
                      const isAiTrack = course.id === 'ai_learning_mentorship';
                      const isCrash = course.id === 'frontend_crash_course';
                      return (
                        <div
                          key={course.id}
                          onClick={() => setSelectedCourseId(course.id)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 relative ${
                            isSelected
                              ? isCrash
                                ? 'border-sky-600 bg-sky-50 shadow-xs ring-2 ring-sky-500/40'
                                : isAiTrack
                                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/40'
                                : 'border-sky-600 bg-sky-50/40 shadow-xs ring-1 ring-sky-600'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold block truncate ${isCrash ? 'text-sky-950 font-display' : isAiTrack ? 'text-indigo-950 font-display' : 'text-slate-900'}`}>
                              {course.name}
                            </span>
                            {isSelected && (
                              <span className="w-3.5 h-3.5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {course.description}
                          </p>
                          {course.highlight && (
                            <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                              isCrash
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : isAiTrack 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200/60'
                            }`}>
                              {course.highlight}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Course Technologies */}
                  <div className="p-2.5 bg-sky-50/60 border border-sky-100 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">
                        Curriculum for {currentCourse.name}:
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{currentCourse.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentCourse.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-white border border-sky-200/80 text-sky-900 text-[10px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. STUDENT BIO & CONTACT */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {isCrashCourseMode ? '1' : '2'}
                  </span>
                  <span>Student Bio & WhatsApp Details</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chinedu Okafor"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">WhatsApp / Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="0803 123 4567 or +234..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Used for the official WhatsApp group admission</p>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="Complete Beginner">Complete Beginner (Zero Coding Experience)</option>
                      <option value="Beginner (Self-Taught Basics)">Beginner (Know basic HTML/CSS)</option>
                      <option value="Intermediate">Intermediate (Built simple web pages)</option>
                      <option value="Upgrading Stack">Upgrading Stack (Transitioning to React & Git)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-0.5">Helps instructors adjust pacing</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">
                      GitHub Profile / Username (Optional)
                    </label>
                    <div className="relative">
                      <GitBranch className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. github.com/username or @username"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">We will invite you to our classroom repositories</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1 text-xs">
                    Questions or Learning Goals (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Want to build a portfolio project, learn React hooks..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Registration Number...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {isCrashCourseMode 
                          ? 'Register for 1-Month Frontend Crash Course' 
                          : 'Submit Course Registration'}
                      </span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Upon registration, you will receive an official Registration Number with options to copy and check your live admission status.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!successData && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Direct Coordinator Line: <strong className="text-slate-800">09129216768</strong></span>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 font-medium text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
