import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Laptop, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Send, 
  Check, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  BookOpen, 
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  AlertCircle
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
  defaultCourseId = 'web_dev',
  defaultFormat = 'online',
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(defaultCourseId);
  const [classFormat, setClassFormat] = useState<ClassFormat>(defaultFormat);
  const [schedule, setSchedule] = useState<string>('Weekday Morning (9:00 AM – 12:00 PM)');
  const [duration, setDuration] = useState<string>('12 Weeks (3 Months Intensive)');
  const [experienceLevel, setExperienceLevel] = useState<string>('Complete Beginner');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityState, setCityState] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ registrationNumber: string } | null>(null);

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
      setSubmitError('Please enter a valid phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CourseRegistrationFormData = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        course: currentCourse.id,
        courseTitle: currentCourse.name,
        classFormat,
        schedule,
        duration,
        experienceLevel,
        cityState: cityState.trim() || (classFormat === 'offline' ? 'Enugu State' : 'Online Student'),
        notes: notes.trim(),
      };

      const result = await submitCourseRegistration(payload);
      if (result.success) {
        setSuccessData({ registrationNumber: result.registrationNumber });
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
    setCityState('');
    setNotes('');
  };

  const selectedCourseWhatsAppMessage = encodeURIComponent(
    `Hello Ocean Technologies, I just registered for the ${currentCourse.name} (${classFormat.toUpperCase()} class) with Registration Ref: ${successData?.registrationNumber || 'OCT-CRS-2026'}. Please let me know the orientation schedule.`
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
                <span className="text-xs text-slate-400 hidden sm:inline">• Agbani, Enugu & Online</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
                Register for a Course
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Choose Online or In-Person classes across Web, Mobile, Game Development, Git/DevOps, and more.
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
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {successData ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="space-y-6 py-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Registration Successfully Confirmed
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                    Welcome to Ocean Technologies!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                    Your registration has been stored in our student database. Your unique admission reference code is:
                  </p>
                </div>

                <div className="bg-slate-900 text-sky-300 font-mono text-base sm:text-lg font-bold py-3 px-6 rounded-xl inline-block border border-sky-500/40 shadow-inner">
                  {successData.registrationNumber}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Selected Course:</span>
                  <span className="font-bold text-slate-900">{currentCourse.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Class Format:</span>
                  <span className="font-bold uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {classFormat === 'online' ? '🌐 Online Virtual Class' : '🏫 In-Person Class (Agbani Hub)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Schedule:</span>
                  <span className="font-semibold text-slate-800">{schedule}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Student Name:</span>
                  <span className="font-semibold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Physical Location:</span>
                  <span className="text-slate-700">Agbani Hub, Near ESUT Gate / Global Online</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/2349033321516?text=${selectedCourseWhatsAppMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect With Student Coordinator on WhatsApp</span>
                </a>

                <div className="flex gap-3">
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
            </div>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* STEP 1: CLASS FORMAT SELECTION (ONLINE VS OFFLINE) */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Select Class Format</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Online Class */}
                  <div
                    onClick={() => setClassFormat('online')}
                    className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all duration-200 ${
                      classFormat === 'online'
                        ? 'border-sky-600 bg-sky-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${classFormat === 'online' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Online Virtual Class</h4>
                          <span className="text-[10px] text-sky-700 font-semibold">Live Interactive Video Sessions</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${classFormat === 'online' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'}`}>
                        {classFormat === 'online' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-[11px] text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-sky-600" />
                        <span>Live Zoom / Meet sessions with screenshare</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-sky-600" />
                        <span>HD class recordings + resource repository</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-sky-600" />
                        <span>Learn from anywhere in Nigeria or abroad</span>
                      </li>
                    </ul>
                  </div>

                  {/* Option 2: Physical In-Person Class */}
                  <div
                    onClick={() => setClassFormat('offline')}
                    className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all duration-200 ${
                      classFormat === 'offline'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${classFormat === 'offline' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Physical In-Person Class</h4>
                          <span className="text-[10px] text-emerald-700 font-semibold">Agbani Hub (Near ESUT Gate)</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${classFormat === 'offline' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                        {classFormat === 'offline' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-[11px] text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Direct face-to-face mentorship with senior devs</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Air-conditioned workstations + stable electricity</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>High-speed fiber internet + dev community hub</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* STEP 2: COURSE SELECTION */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Select Course Track</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                  {COURSES_OFFERED.map((course) => {
                    const isSelected = course.id === selectedCourseId;
                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'border-sky-600 bg-white shadow-xs ring-1 ring-sky-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 block truncate">
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
                          <span className="inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
                            {course.highlight}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Course Technologies Badge Bar */}
                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Curriculum Highlights for {currentCourse.name}:
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{currentCourse.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentCourse.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-900 text-[10px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 3: SCHEDULE, DURATION & EXPERIENCE LEVEL */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Class Schedule & Experience</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Schedule Preference</label>
                    <select
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="Weekday Morning (9:00 AM – 12:00 PM)">Weekday Morning (9:00 AM – 12:00 PM)</option>
                      <option value="Weekday Afternoon (2:00 PM – 5:00 PM)">Weekday Afternoon (2:00 PM – 5:00 PM)</option>
                      <option value="Weekend Intensive (Saturdays & Sundays)">Weekend Intensive (Saturdays & Sundays)</option>
                      <option value="Evening / Flexible (Online Only)">Evening / Flexible (Online Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Duration & Track</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="12 Weeks (3 Months Intensive Bootcamp)">12 Weeks (3 Months Intensive Bootcamp)</option>
                      <option value="24 Weeks (6 Months Full Diploma + Internship)">24 Weeks (6 Months Full Diploma + Internship)</option>
                      <option value="4 Weeks (1 Month Specialized Crash Course)">4 Weeks (1 Month Specialized Crash Course)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Your Prior Experience</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="Complete Beginner (Zero Coding Knowledge)">Complete Beginner (Zero Coding)</option>
                      <option value="Beginner (Self-Taught / YouTube Tutorials)">Beginner (Self-Taught Basics)</option>
                      <option value="Intermediate (Some Projects Built)">Intermediate (Some Projects)</option>
                      <option value="Experienced (Upgrading Tech Stack)">Experienced (Stack Upgrade)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 4: STUDENT CONTACT DETAILS */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>Student Bio & Contact Details</span>
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
                    <label className="block text-slate-600 font-medium mb-1">Phone / WhatsApp Number *</label>
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
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Current City / State</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Agbani, Enugu / Lagos / Abuja"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1 text-xs">
                    Special Learning Goals or Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us what you want to achieve with this course or any specific goals..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Registration to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Complete Registration for {currentCourse.name} ({classFormat.toUpperCase()})</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  🔒 Data is securely saved to Cloud Firestore and PostgreSQL database. No spam guaranteed.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
