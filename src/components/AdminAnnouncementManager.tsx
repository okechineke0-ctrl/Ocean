import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Clock, 
  Calendar, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Trash2, 
  Sparkles, 
  Power, 
  RefreshCw,
  Sliders,
  Check,
  Zap,
  Info,
  X
} from 'lucide-react';
import { SiteAnnouncement } from '../types';
import { 
  getSiteAnnouncement, 
  saveSiteAnnouncement, 
  isAnnouncementActive, 
  getExpiryStatus,
  DEFAULT_ANNOUNCEMENT 
} from '../lib/announcementService';

interface AdminAnnouncementManagerProps {
  onAnnouncementSaved?: (ann: SiteAnnouncement) => void;
}

export const AdminAnnouncementManager: React.FC<AdminAnnouncementManagerProps> = ({ onAnnouncementSaved }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [message, setMessage] = useState('');
  const [badge, setBadge] = useState('SPECIAL UPDATE');
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [theme, setTheme] = useState<'opay' | 'navy' | 'emerald' | 'amber' | 'crimson'>('opay');
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Load initial announcement
  useEffect(() => {
    const loadCurrent = async () => {
      setLoading(true);
      try {
        const data = await getSiteAnnouncement();
        if (data) {
          setMessage(data.message || '');
          setBadge(data.badge || 'NOTICE');
          setIsActive(data.isActive ?? true);
          setTheme(data.theme || 'opay');
          setSpeed(data.speed || 'normal');
          if (data.expiresAt) {
            // Convert to format for datetime-local input (YYYY-MM-DDTHH:mm)
            const date = new Date(data.expiresAt);
            if (!isNaN(date.getTime())) {
              const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
              setExpiresAt(localIso);
            } else {
              setExpiresAt('');
            }
          } else {
            setExpiresAt('');
          }
        }
      } catch (err) {
        console.error('Failed to load announcement in admin:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCurrent();
  }, []);

  // Quick preset helper
  const handleSetPresetHours = (hours: number) => {
    const target = new Date(Date.now() + hours * 60 * 60 * 1000);
    const localIso = new Date(target.getTime() - target.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setExpiresAt(localIso);
  };

  const handleClearExpiry = () => {
    setExpiresAt('');
  };

  // Preset message templates
  const templates = [
    {
      name: 'Crash Course Alert',
      badge: 'CRASH COURSE ALERT',
      text: '⚡ UPCOMING CRASH COURSE ALERT: Ocean Technologies is launching an intensive fast-track Crash Course soon! Tuition prices will drop significantly. Chat 09129216768 on WhatsApp for priority early-bird reservation.',
      theme: 'opay' as const,
    },
    {
      name: 'IT Consulting & Advisory',
      badge: 'SPECIAL ADVISORY',
      text: '🛡️ STRATEGIC IT CONSULTING: Get a comprehensive software architecture and systems audit for your business. Chat directly with our principal engineer on WhatsApp: 09129216768.',
      theme: 'emerald' as const,
    },
    {
      name: 'Online Classroom Notice',
      badge: 'ACADEMIC NOTICE',
      text: '🌐 IMPORTANT NOTICE: All Ocean Technologies training programs are delivered 100% online via live virtual classrooms with senior mentoring. Contact 09129216768 for enrollment enquiry.',
      theme: 'navy' as const,
    },
    {
      name: 'System Maintenance',
      badge: 'SERVICE UPDATE',
      text: '⚙️ SCHEDULED NOTICE: Routine server infrastructure upgrades taking place tonight between 11:00 PM and 1:00 AM. Emergency support hotline: 09129216768.',
      theme: 'amber' as const,
    },
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setMessage(tpl.text);
    setBadge(tpl.badge);
    setTheme(tpl.theme);
  };

  const handleSave = async (forceActive?: boolean) => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const activeVal = forceActive !== undefined ? forceActive : isActive;
      const isoExpiry = expiresAt ? new Date(expiresAt).toISOString() : null;

      const updated = await saveSiteAnnouncement({
        message: message.trim(),
        badge: badge.trim().toUpperCase(),
        isActive: activeVal,
        expiresAt: isoExpiry,
        theme,
        speed,
      });

      setIsActive(activeVal);
      setSavedSuccess(true);
      if (onAnnouncementSaved) {
        onAnnouncementSaved(updated);
      }

      setTimeout(() => {
        setSavedSuccess(false);
      }, 3500);
    } catch (err) {
      console.error('Error saving announcement:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleClearAnnouncement = async () => {
    if (confirm('Are you sure you want to disable and clear the announcement ticker?')) {
      setMessage('');
      setIsActive(false);
      setExpiresAt('');
      await handleSave(false);
    }
  };

  // Expiry calculation
  const currentExpiryIso = expiresAt ? new Date(expiresAt).toISOString() : null;
  const expiryInfo = getExpiryStatus(currentExpiryIso);
  const currentlyLiveOnSite = isActive && message.trim().length > 0 && !expiryInfo.isExpired;

  // Preview classes
  const themeStyles = {
    opay: 'bg-[#042f2e] border-emerald-700/80 text-emerald-100',
    navy: 'bg-[#07192f] border-sky-800/80 text-sky-100',
    emerald: 'bg-[#064e3b] border-emerald-600/80 text-emerald-50',
    amber: 'bg-[#451a03] border-amber-700/80 text-amber-100',
    crimson: 'bg-[#4c0519] border-rose-800/80 text-rose-100',
  }[theme];

  const badgeStyles = {
    opay: 'bg-emerald-500 text-emerald-950',
    navy: 'bg-sky-400 text-slate-950',
    emerald: 'bg-emerald-400 text-emerald-950',
    amber: 'bg-amber-400 text-amber-950',
    crimson: 'bg-rose-500 text-white',
  }[theme];

  const speedClass = 
    speed === 'slow' 
      ? 'animate-ticker-slow' 
      : speed === 'fast' 
        ? 'animate-ticker-fast' 
        : 'animate-ticker-normal';

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-sky-500" />
        <span>Loading announcement configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Status Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              currentlyLiveOnSite ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  Site Announcement Ticker (OPay Style)
                </h2>
                {currentlyLiveOnSite ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    LIVE AT TOP OF WEBSITE
                  </span>
                ) : expiryInfo.isExpired ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    <AlertCircle className="w-3.5 h-3.5" />
                    EXPIRED (AUTOMATICALLY HIDDEN)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    PAUSED / HIDDEN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure a smooth, moving horizontal marquee write-up at the very top of the website with auto-expiration (e.g. 2 hours, 2 days).
              </p>
            </div>
          </div>

          {/* Quick Toggle switch */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const next = !isActive;
                setIsActive(next);
                handleSave(next);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isActive ? 'Ticker Enabled (Active)' : 'Ticker Disabled'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Expiration / Status Pill */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300 font-medium">Auto-Expiration Window:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${expiryInfo.badgeColor}`}>
              {expiryInfo.text}
            </span>
          </div>
          {expiryInfo.isExpired && (
            <span className="text-rose-400 text-xs flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Website is currently displaying normally without the banner because the timer has elapsed.
            </span>
          )}
        </div>
      </div>

      {/* LIVE PREVIEW BOX */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Live Ticker Preview (Exact Look at Top of Site)</span>
          </div>
          <span className="text-[11px] text-slate-500">Hover over the text to pause animation</span>
        </div>

        {/* Render actual ticker marquee bar */}
        <div className={`rounded-xl border overflow-hidden py-2 px-3 ${themeStyles}`}>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 font-display ${badgeStyles}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
              <Megaphone className="w-2.5 h-2.5" />
              <span>{badge || 'NOTICE'}</span>
            </span>

            <div className="flex-1 overflow-hidden relative cursor-pointer">
              <div className={`${speedClass} flex items-center gap-8 text-xs font-medium`}>
                <span className="flex items-center gap-3">
                  <span>{message || 'Type your message below to preview live ticker...'}</span>
                  <span className="text-current opacity-60">•</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>{message || 'Type your message below to preview live ticker...'}</span>
                  <span className="text-current opacity-60">•</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>{message || 'Type your message below to preview live ticker...'}</span>
                  <span className="text-current opacity-60">•</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Templates Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Announcement Templates</span>
          </span>
          <span className="text-[11px] text-slate-500">Click to autofill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {templates.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="text-left p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all text-xs cursor-pointer group"
            >
              <div className="font-semibold text-sky-400 group-hover:text-sky-300 flex items-center justify-between">
                <span>{tpl.name}</span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">Use</span>
              </div>
              <p className="text-slate-400 text-[11px] line-clamp-2 mt-1">
                {tpl.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Configuration Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
        {/* 1. Announcement Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>1. Announcement Message *</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {message.length} characters
            </span>
          </div>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. ⚡ UPCOMING CRASH COURSE ALERT: Ocean Technologies is launching an intensive fast-track Crash Course soon! Tuition prices will drop significantly. Message 09129216768 on WhatsApp to secure your slot."
            className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden leading-relaxed"
          />
        </div>

        {/* 2. Badge Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Left Badge Label
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. SPECIAL NOTICE, CRASH COURSE ALERT"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-display"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['SPECIAL NOTICE', 'CRASH COURSE ALERT', 'FLASH PROMO', 'IMPORTANT NOTICE', 'SYSTEM UPDATE'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBadge(b)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    badge === b 
                      ? 'bg-sky-950 text-sky-300 border-sky-700' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Theme & Speed */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Visual Style
              </label>
              <select
                value={theme}
                onChange={(e: any) => setTheme(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="opay">OPay Teal & Mint</option>
                <option value="emerald">Emerald Forest</option>
                <option value="navy">Ocean Navy & Sky</option>
                <option value="amber">Warm Amber Warning</option>
                <option value="crimson">Crimson Emergency</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Scroll Speed
              </label>
              <select
                value={speed}
                onChange={(e: any) => setSpeed(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="normal">Normal (Smooth OPay)</option>
                <option value="slow">Slow (Relaxed Read)</option>
                <option value="fast">Fast (Brief Alert)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. EXPIRATION DATE & TIME CONTROLS (CRUCIAL USER REQUEST: 2 HOURS, 2 DAYS, DATE/TIME PICKER) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>3. Expiration Timer (Disappears automatically when expired)</span>
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set how long this message should stay at the top (e.g. 2 hours or 2 days). When the time expires, it disappears automatically and the website looks normal.
              </p>
            </div>

            {expiresAt && (
              <button
                type="button"
                onClick={handleClearExpiry}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 underline cursor-pointer"
              >
                <X className="w-3 h-3" />
                Remove timer (Never expire)
              </button>
            )}
          </div>

          {/* Quick preset buttons requested by user: 2 hours, 2 days, etc. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500 font-semibold">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleSetPresetHours(2)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              ⏱️ 2 Hours
            </button>
            <button
              type="button"
              onClick={() => handleSetPresetHours(6)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              ⏱️ 6 Hours
            </button>
            <button
              type="button"
              onClick={() => handleSetPresetHours(12)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              ⏱️ 12 Hours
            </button>
            <button
              type="button"
              onClick={() => handleSetPresetHours(24)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              📅 1 Day (24 Hours)
            </button>
            <button
              type="button"
              onClick={() => handleSetPresetHours(48)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              📅 2 Days (48 Hours)
            </button>
            <button
              type="button"
              onClick={() => handleSetPresetHours(168)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              📅 7 Days (1 Week)
            </button>
          </div>

          {/* Exact Date & Time Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Exact Expiration Date & Time:</span>
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Calculated Status</span>
              <p className="text-xs font-medium mt-0.5 text-slate-200">
                {expiryInfo.text}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Save & Publish Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearAnnouncement}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear & Turn Off</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {savedSuccess && (
              <span className="text-emerald-400 text-xs flex items-center gap-1.5 font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>Published Live to Website!</span>
              </span>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave()}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish Announcement to Website</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
