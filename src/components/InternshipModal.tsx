import React, { useState } from 'react';
import { 
  GraduationCap, 
  X, 
  CheckCircle2, 
  Send, 
  Building2, 
  BookOpen, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Code2, 
  BadgeCheck, 
  MessageSquare, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { InternshipRegistrationFormData } from '../types';
import { saveInternshipRegistration } from '../lib/inquiriesService';

interface InternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_SCHOOLS = [
  'Enugu State University of Science and Technology (ESUT)',
  'University of Nigeria, Nsukka (UNN)',
  'Institute of Management and Technology (IMT), Enugu',
  'Godfrey Okoye University, Enugu',
  'Caritas University, Amorji-Nike, Enugu',
  'Enugu State Polytechnic, Iwollo',
  'Federal Polytechnic, Nekede',
  'Federal University of Technology, Owerri (FUTO)',
  'Nnamdi Azikiwe University (UNIZIK), Awka',
  'Other University / Polytechnic / College',
];

const COMMON_DEPARTMENTS = [
  'Computer Science',
  'Computer Engineering',
  'Software Engineering',
  'Electrical / Electronic Engineering',
  'Information and Communication Technology (ICT)',
  'Cybersecurity',
  'Data Science / Mathematics',
  'Mechanical / Mechatronics Engineering',
  'Other Science & Engineering Discipline',
];

const PROGRAM_TYPES = [
  { id: '6-Month SIWES', label: '6-Month SIWES Placement (Students Industrial Work Experience Scheme)' },
  { id: '3-Month IT', label: '3-Month Industrial Training (IT)' },
  { id: '1-Year Attachment', label: '1-Year Industrial Attachment (Polytechnic / Post-OND)' },
  { id: 'Graduate Internship', label: 'Graduate Tech Internship (Post-NYSC / Job Transition)' },
];

const TECH_TRACKS = [
  'Frontend Web Development (React, Next.js, Tailwind CSS)',
  'Mobile App Development (Flutter, iOS & Android)',
  'Backend & Cloud Databases (Node.js, PostgreSQL, Firestore)',
  'Full-Stack Software Engineering (End-to-End Applications)',
  'Computer Hardware, Networking & Server Maintenance',
  'UI/UX Product Design (Figma, Systems & Wireframing)',
];

export const InternshipModal: React.FC<InternshipModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<InternshipRegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    school: 'Enugu State University of Science and Technology (ESUT)',
    department: 'Computer Science',
    level: '300 Level (SIWES)',
    studentId: '',
    programType: '6-Month SIWES',
    techTrack: 'Full-Stack Software Engineering (End-to-End Applications)',
    preferredStartDate: 'Immediate (This Month)',
    statementOfPurpose: '',
  });

  const [customSchool, setCustomSchool] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationResult, setRegistrationResult] = useState<{
    registrationNumber: string;
    fullName: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your Full Name, Email, and Phone Number.');
      return;
    }

    if (!formData.studentId.trim()) {
      setErrorMessage('Please provide your Matriculation / Student ID number.');
      return;
    }

    const finalSchool =
      formData.school === 'Other University / Polytechnic / College' && customSchool.trim()
        ? customSchool.trim()
        : formData.school;

    setIsSubmitting(true);

    try {
      const result = await saveInternshipRegistration({
        ...formData,
        school: finalSchool,
      });

      setRegistrationResult({
        registrationNumber: result.registrationNumber,
        fullName: formData.fullName,
      });
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(
        err.message || 'An error occurred while saving your registration. Please check your connection and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRegistrationResult(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 p-5 sm:p-6 text-white relative flex-shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-full text-sky-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 tracking-wide uppercase">
                Agbani Tech Hub • Open Now
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                Internship, IT & SIWES Registration
              </h2>
            </div>
          </div>
          <p className="text-sky-100 text-sm max-w-xl">
            Register your industrial attachment or technical internship with Ocean Technologies. Hand-on software engineering mentorship right here in Agbani (near ESUT campus).
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800">
          {registrationResult ? (
            /* Success State */
            <div className="text-center py-6 px-2 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Registration Successful
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  Welcome aboard, {registrationResult.fullName}!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mt-1">
                  Your student internship application has been officially recorded in Ocean Technologies' database.
                </p>
              </div>

              {/* Registration Reference Box */}
              <div className="bg-slate-50 border-2 border-dashed border-sky-300 rounded-xl p-4 max-w-md mx-auto text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Official Reference Number
                  </span>
                  <span className="text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    Verified Application
                  </span>
                </div>
                <div className="font-mono text-xl font-black text-sky-900 tracking-wider">
                  {registrationResult.registrationNumber}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Please keep this reference code for your school logbook verification and on-site clearance at our Agbani Hub.
                </p>
              </div>

              {/* Next Steps Guidance */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-left max-w-md mx-auto text-sm space-y-2">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-blue-600" />
                  Next Steps for Admission:
                </div>
                <ol className="list-decimal list-inside text-xs text-blue-800 space-y-1 pl-1">
                  <li>Our Student Placement Coordinator will review your details within 24 hours.</li>
                  <li>Bring your university IT/SIWES acceptance letter or logbook to our office along Agbani Main Road.</li>
                  <li>You will be assigned to a senior mentor and engineering project team.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/2348105987579?text=${encodeURIComponent(
                    `Hello Ocean Technologies Team, I just submitted my internship/SIWES registration.\n\nName: ${registrationResult.fullName}\nReference No: ${registrationResult.registrationNumber}\n\nI would like to confirm my placement and submit my university IT letter.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with Coordinator on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Unable to register: </span>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chukwuebuka Emmanuel"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white placeholder-slate-400 text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ebuka@student.esut.edu.ng"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white placeholder-slate-400 text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone & WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0810 598 7579"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white placeholder-slate-400 text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Matric / Student ID Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. ESUT/2022/10492"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white placeholder-slate-400 text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* School / Institution */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Higher Institution / University / Polytechnic <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white text-sm transition-colors"
                  >
                    {COMMON_SCHOOLS.map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.school === 'Other University / Polytechnic / College' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter the name of your institution..."
                    value={customSchool}
                    onChange={(e) => setCustomSchool(e.target.value)}
                    className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white text-sm transition-colors"
                  />
                )}
              </div>

              {/* Department & Academic Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course / Department of Study <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white text-sm transition-colors"
                    >
                      {COMMON_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Level / Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white text-sm transition-colors"
                  >
                    <option value="200 Level">200 Level (Pre-IT)</option>
                    <option value="300 Level (SIWES)">300 Level (SIWES Scheme)</option>
                    <option value="400 Level (Final Year IT)">400 Level (Technical Placement)</option>
                    <option value="500 Level (Engineering IT)">500 Level (Engineering IT)</option>
                    <option value="OND Student">OND Student (National Diploma)</option>
                    <option value="HND Student">HND Student (Higher National Diploma)</option>
                    <option value="Graduate / Post-NYSC">Graduate / Post-NYSC Intern</option>
                  </select>
                </div>
              </div>

              {/* Program Type & Tech Track */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internship / Program Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white text-sm transition-colors"
                  >
                    {PROGRAM_TYPES.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Tech Track <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Code2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={formData.techTrack}
                      onChange={(e) => setFormData({ ...formData, techTrack: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white text-sm transition-colors"
                    >
                      {TECH_TRACKS.map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Placement Start Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={formData.preferredStartDate}
                    onChange={(e) => setFormData({ ...formData, preferredStartDate: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white text-sm transition-colors"
                  >
                    <option value="Immediate (This Month)">Immediate (This Month)</option>
                    <option value="Next Month">Next Month</option>
                    <option value="In 2 Months">In 2 Months</option>
                    <option value="Next Semester">Next Academic Semester</option>
                  </select>
                </div>
              </div>

              {/* Statement of purpose */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goals / What do you hope to learn & build during your IT?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. I want to build real-world React and backend APIs, understand database architecture, and complete my SIWES logbook with hands-on projects..."
                  value={formData.statementOfPurpose}
                  onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white placeholder-slate-400 text-sm transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Student Registration to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Register for Internship / IT</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  🔒 Data is securely saved to Cloud Firestore & Ocean Technologies PostgreSQL Database.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
