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
  Clock
} from 'lucide-react';
import { COURSES_OFFERED } from '../data/coursesData';
import { ClassFormat, CourseRegistrationFormData } from '../types';
import { submitCourseRegistration } from '../lib/inquiriesService';
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
  defaultCourseId = 'ai_learning_mentorship',
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(defaultCourseId);
  const [experienceLevel, setExperienceLevel] = useState<string>('Complete Beginner');

  useEffect(() => {
    if (defaultCourseId) {
      setSelectedCourseId(defaultCourseId);
    }
  }, [defaultCourseId, isOpen]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ registrationNumber: string; storedDate: string } | null>(null);

  if (!isOpen) return null;

  const currentCourse = COURSES_OFFERED.find((c) => c.id === selectedCourseId) || COURSES_OFFERED[0];

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
      setSubmitError('Please enter a valid phone / WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const todayFormatted = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

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
        notes: notes.trim(),
      };

      const result = await submitCourseRegistration(payload);
      if (result.success) {
        setSuccessData({ 
          registrationNumber: result.registrationNumber,
          storedDate: todayFormatted,
        });
      } else {
        setSubmitError('Registration could not be recorded. Please try again or reach out on WhatsApp.');
      }
    } catch (err: any) {
      console.error('Course registration submit failed:', err);
      setSubmitError(err?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  const selectedCourseWhatsAppMessage = encodeURIComponent(
    `Hello Ocean Technologies Admissions Coordinator,\n\nI have submitted my online course registration on the portal:\n• Student Name: ${fullName}\n• Course Track: ${currentCourse.name}\n• Learning Format: 100% Online Classroom\n• Phone Number: ${phone}\n• Registration Ref: ${successData?.registrationNumber || 'OCT-CRS-2026'}\n\nPlease add me to the official course WhatsApp group and send my onboarding timetable & payment instructions.`
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
                <span className="text-xs text-sky-400 font-medium hidden sm:inline">• 100% Online Programs</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
                Course Registration
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Live interactive classes with senior software engineering mentors.
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
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {successData ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="space-y-5 py-2">
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
                    Your details have been saved to our admissions system. Your official reference code is:
                  </p>
                </div>

                <div className="bg-slate-900 text-sky-300 font-mono text-base sm:text-lg font-bold py-2.5 px-6 rounded-xl inline-block border border-sky-500/40 shadow-inner">
                  {successData.registrationNumber}
                </div>
              </div>

              {/* WhatsApp Group Callout Box */}
              <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-xl p-4 border border-emerald-600/40 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Next Step: Official Student WhatsApp Group</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All lecture timetables, class schedules, Zoom/Google Meet links, and orientation materials are coordinated directly in our official student WhatsApp community.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/2349129216768?text=${selectedCourseWhatsAppMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Join WhatsApp Group / Message Coordinator (09129216768)</span>
                  </a>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Selected Course:</span>
                  <span className="font-bold text-slate-900">{currentCourse.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Class Format:</span>
                  <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    🌐 100% Online Virtual Classroom
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Schedule Coordination:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Official WhatsApp Group
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Student Name:</span>
                  <span className="font-semibold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Registered Date:</span>
                  <span className="font-bold text-slate-800">
                    {successData.storedDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Register Another Course
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* STREAMLINED REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* WHATSAPP COORDINATION NOTICE */}
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
                    Class schedules, timetables, and live interactive session links are coordinated directly inside the official student WhatsApp group. Register below to get added.
                  </p>
                </div>
              </div>

              {/* 1. SELECT COURSE TRACK */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Select Course Track</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">Choose your focus area</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                  {COURSES_OFFERED.map((course) => {
                    const isSelected = course.id === selectedCourseId;
                    const isAiTrack = course.id === 'ai_learning_mentorship';
                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 relative ${
                          isSelected
                            ? isAiTrack
                              ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/40'
                              : 'border-sky-600 bg-sky-50/40 shadow-xs ring-1 ring-sky-600'
                            : isAiTrack
                            ? 'border-indigo-200 hover:border-indigo-400 bg-white'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold block truncate ${isAiTrack ? 'text-indigo-950 font-display' : 'text-slate-900'}`}>
                            {course.name}
                          </span>
                          {isSelected && (
                            <span className={`w-3.5 h-3.5 rounded-full ${isAiTrack ? 'bg-indigo-600' : 'bg-sky-600'} text-white flex items-center justify-center shrink-0`}>
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {course.description}
                        </p>
                        {course.highlight && (
                          <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                            isAiTrack 
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
                      Curriculum Stack for {currentCourse.name}:
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

              {/* 2. STUDENT BIO & CONTACT */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
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
                    <p className="text-[10px] text-slate-400 mt-0.5">Used to invite you to the course WhatsApp group</p>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Current Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="Complete Beginner">Complete Beginner (Zero Coding)</option>
                      <option value="Beginner (Self-Taught Basics)">Beginner (Self-Taught Basics)</option>
                      <option value="Intermediate">Intermediate (Built Simple Projects)</option>
                      <option value="Experienced">Experienced (Upgrading Stack)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-0.5">Helps mentors adjust class pacing</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1 text-xs">
                    Special Learning Goals or Questions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Preparing for remote tech roles, want to build an app..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-700 hover:from-emerald-500 hover:to-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Registration...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Register & Get WhatsApp Group Access</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Online • Class schedules & orientation coordinated via WhatsApp</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
