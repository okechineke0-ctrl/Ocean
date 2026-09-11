import React, { useState, useEffect } from 'react';
import { Megaphone, X, Clock, ExternalLink } from 'lucide-react';
import { SiteAnnouncement } from '../types';
import { getSiteAnnouncement, isAnnouncementActive } from '../lib/announcementService';

export const TopAnnouncementTicker: React.FC = () => {
  const [announcement, setAnnouncement] = useState<SiteAnnouncement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [, setTick] = useState(0);

  // Load announcement on mount & listen for updates
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const data = await getSiteAnnouncement();
      if (isMounted) {
        setAnnouncement(data);
        // Check if user dismissed this specific announcement in this session
        if (data && typeof sessionStorage !== 'undefined') {
          const dismissedId = sessionStorage.getItem(`ocean_dismissed_ann_${data.id}`);
          if (dismissedId === data.updatedAt) {
            setIsDismissed(true);
          } else {
            setIsDismissed(false);
          }
        }
      }
    };

    loadData();

    // Listen for cross-component update events (e.g. Admin changes)
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteAnnouncement>;
      if (customEvent.detail) {
        setAnnouncement(customEvent.detail);
        setIsDismissed(false);
      } else {
        loadData();
      }
    };

    window.addEventListener('ocean-announcement-changed', handleUpdate);

    // Re-verify expiration every 10 seconds so expired announcements disappear immediately
    const expiryInterval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 10000);

    return () => {
      isMounted = false;
      window.removeEventListener('ocean-announcement-changed', handleUpdate);
      clearInterval(expiryInterval);
    };
  }, []);

  // Determine if it should be displayed
  const isVisible = announcement && !isDismissed && isAnnouncementActive(announcement);

  if (!isVisible || !announcement) {
    // Renders completely normal when no active/unexpired announcement exists
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof sessionStorage !== 'undefined' && announcement) {
      sessionStorage.setItem(`ocean_dismissed_ann_${announcement.id}`, announcement.updatedAt || 'dismissed');
    }
  };

  // Speed class mapping
  const speedClass = 
    announcement.speed === 'slow' 
      ? 'animate-ticker-slow' 
      : announcement.speed === 'fast' 
        ? 'animate-ticker-fast' 
        : 'animate-ticker-normal';

  // Theme styling (OPay default: deep emerald with bright accents, or deep navy)
  const themeStyles = {
    opay: 'bg-[#042f2e] border-emerald-700/80 text-emerald-100 shadow-xs',
    navy: 'bg-[#07192f] border-sky-800/80 text-sky-100 shadow-xs',
    emerald: 'bg-[#064e3b] border-emerald-600/80 text-emerald-50 shadow-xs',
    amber: 'bg-[#451a03] border-amber-700/80 text-amber-100 shadow-xs',
    crimson: 'bg-[#4c0519] border-rose-800/80 text-rose-100 shadow-xs',
  }[announcement.theme || 'opay'];

  const badgeStyles = {
    opay: 'bg-emerald-500 text-emerald-950 font-extrabold shadow-xs',
    navy: 'bg-sky-400 text-slate-950 font-extrabold shadow-xs',
    emerald: 'bg-emerald-400 text-emerald-950 font-extrabold shadow-xs',
    amber: 'bg-amber-400 text-amber-950 font-extrabold shadow-xs',
    crimson: 'bg-rose-500 text-white font-extrabold shadow-xs',
  }[announcement.theme || 'opay'];

  return (
    <aside 
      aria-label="Important Notice"
      className={`relative z-40 border-b overflow-hidden transition-all duration-300 py-1.5 sm:py-2 select-none ${themeStyles}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Left Badge: OPay-style high visibility notice tag */}
        <div className="flex items-center gap-2 shrink-0 z-10 pr-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs tracking-wider uppercase font-display ${badgeStyles}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
            </span>
            <Megaphone className="w-3 h-3 shrink-0" />
            <span>{announcement.badge || 'NOTICE'}</span>
          </span>
        </div>

        {/* Center: Smooth Moving Write-up / Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative cursor-pointer group mask-gradient" title="Hover to pause ticker">
          <div className={`${speedClass} flex items-center gap-8 text-xs sm:text-sm font-medium tracking-wide`}>
            {/* Repeated 3 times for completely seamless continuous endless loop */}
            <span className="flex items-center gap-3">
              <span>{announcement.message}</span>
              <span className="text-emerald-400/60 font-bold">•</span>
            </span>
            <span className="flex items-center gap-3">
              <span>{announcement.message}</span>
              <span className="text-emerald-400/60 font-bold">•</span>
            </span>
            <span className="flex items-center gap-3">
              <span>{announcement.message}</span>
              <span className="text-emerald-400/60 font-bold">•</span>
            </span>
          </div>
        </div>

        {/* Right Dismiss Button */}
        <div className="shrink-0 z-10 pl-2">
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss notice for this session"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
