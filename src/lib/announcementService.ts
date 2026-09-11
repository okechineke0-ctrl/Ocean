import { SiteAnnouncement } from '../types';

const STORAGE_KEY = 'ocean_tech_site_announcement_v1';

export const DEFAULT_ANNOUNCEMENT: SiteAnnouncement = {
  id: 'ann-default',
  message: '⚡ UPCOMING CRASH COURSE ALERT: Ocean Technologies is launching an intensive fast-track Crash Course soon! Tuition prices will drop significantly. Stay tuned or message coordinator on WhatsApp (09129216768) to secure your spot.',
  badge: 'SPECIAL UPDATE',
  isActive: true,
  expiresAt: null, // null = persistent until changed or set
  theme: 'opay',
  speed: 'normal',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Checks whether an announcement is currently active and within its valid expiry window
 */
export function isAnnouncementActive(ann: SiteAnnouncement | null): boolean {
  if (!ann) return false;
  if (!ann.isActive) return false;
  if (!ann.message || !ann.message.trim()) return false;
  if (ann.expiresAt) {
    const expireTimestamp = new Date(ann.expiresAt).getTime();
    if (!isNaN(expireTimestamp) && Date.now() >= expireTimestamp) {
      return false; // Expired!
    }
  }
  return true;
}

/**
 * Calculates human-friendly remaining time or expiration status
 */
export function getExpiryStatus(expiresAt: string | null): {
  isExpired: boolean;
  text: string;
  badgeColor: string;
} {
  if (!expiresAt) {
    return {
      isExpired: false,
      text: 'Continuous (No expiration set)',
      badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-800',
    };
  }

  const expireTime = new Date(expiresAt).getTime();
  if (isNaN(expireTime)) {
    return {
      isExpired: false,
      text: 'Invalid date format',
      badgeColor: 'text-slate-400 bg-slate-900 border-slate-700',
    };
  }

  const diffMs = expireTime - Date.now();
  if (diffMs <= 0) {
    return {
      isExpired: true,
      text: `Expired on ${new Date(expireTime).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}`,
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800',
    };
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  const remainingMinutes = totalMinutes % 60;

  let timeString = '';
  if (days > 0) {
    timeString = `${days}d ${remainingHours}h remaining`;
  } else if (totalHours > 0) {
    timeString = `${totalHours}h ${remainingMinutes}m remaining`;
  } else {
    timeString = `${remainingMinutes} minutes remaining`;
  }

  return {
    isExpired: false,
    text: `Expires in ${timeString} (${new Date(expireTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  };
}

/**
 * Fetch announcement from server or fallback to local storage
 */
export async function getSiteAnnouncement(): Promise<SiteAnnouncement> {
  // 1. Check local storage first for instantaneous non-blocking render
  let localData: SiteAnnouncement | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      localData = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // 2. Fetch from backend server API
  try {
    const res = await fetch('/api/announcement');
    if (res.ok) {
      const data = await res.json();
      if (data.announcement) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.announcement));
        } catch {
          // ignore
        }
        return data.announcement;
      }
    }
  } catch (err) {
    console.warn('Network fetch /api/announcement failed, using fallback:', err);
  }

  return localData || DEFAULT_ANNOUNCEMENT;
}

/**
 * Publish or update site announcement
 */
export async function saveSiteAnnouncement(ann: Partial<SiteAnnouncement>): Promise<SiteAnnouncement> {
  const current = await getSiteAnnouncement();
  const updated: SiteAnnouncement = {
    ...current,
    ...ann,
    id: current.id || `ann-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };

  // 1. Optimistic write to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }

  // 2. Dispatch cross-component event immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ocean-announcement-changed', { detail: updated }));
  }

  // 3. Post to backend server for multi-device / multi-user persistence
  try {
    const res = await fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.announcement) {
        return result.announcement;
      }
    }
  } catch (err) {
    console.error('Server save /api/announcement failed:', err);
  }

  return updated;
}
