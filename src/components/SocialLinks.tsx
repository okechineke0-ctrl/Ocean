import React from 'react';

export interface SocialPlatform {
  name: string;
  handle: string;
  url: string;
  description: string;
  brandColor: string;
  badgeBg: string;
  icon: React.FC<{ className?: string }>;
}

// 1. Authentic Official Brand Icons (Original SVGs)
export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
  </svg>
);

export const ThreadsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007C5.463 24 .002 18.537.002 11.815.002 5.093 5.463-.37 12.186-.37c3.67 0 6.945 1.547 9.22 4.148l-2.733 2.378C16.89 4.17 14.653 3.03 12.186 3.03c-4.843 0-8.784 3.94-8.784 8.785 0 4.844 3.94 8.784 8.784 8.784 3.327 0 6.22-1.854 7.697-4.606.353-.659.613-1.378.772-2.13H12.186v-3.4h11.238c.11.564.168 1.144.168 1.737 0 6.721-5.461 12.184-11.406 12.184z" />
  </svg>
);

// Official Social Media Channels Configuration
export const OFFICIAL_SOCIAL_CHANNELS: SocialPlatform[] = [
  {
    name: 'Facebook',
    handle: 'ocean technologies',
    url: 'https://www.facebook.com/oceantechnologies',
    description: 'Official Facebook Page • Updates & Events',
    brandColor: 'text-[#1877F2]',
    badgeBg: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/30 text-[#1877F2]',
    icon: FacebookIcon,
  },
  {
    name: 'Instagram',
    handle: 'ocean technologies',
    url: 'https://www.instagram.com/oceantechnologies',
    description: 'Official Instagram • Student Highlights & Tech',
    brandColor: 'text-[#E1306C]',
    badgeBg: 'bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border-[#E1306C]/30 text-[#E1306C]',
    icon: InstagramIcon,
  },
  {
    name: 'Telegram',
    handle: 'ocean technologies',
    url: 'https://t.me/oceantechnologies',
    description: 'Official Telegram Channel • Live Announcements',
    brandColor: 'text-[#229ED9]',
    badgeBg: 'bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border-[#229ED9]/30 text-[#229ED9]',
    icon: TelegramIcon,
  },
  {
    name: 'Threads',
    handle: 'ocean technologies',
    url: 'https://www.threads.net/@oceantechnologies',
    description: 'Official Threads Profile • Tech Conversations',
    brandColor: 'text-slate-100',
    badgeBg: 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200',
    icon: ThreadsIcon,
  },
];

interface SocialLinksProps {
  variant?: 'compact' | 'cards' | 'banner' | 'footer' | 'pill';
  className?: string;
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'compact',
  className = '',
  showLabels = true,
}) => {
  if (variant === 'pill') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {OFFICIAL_SOCIAL_CHANNELS.map((ch) => {
          const Icon = ch.icon;
          return (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${ch.name}: ${ch.handle}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-xs ${ch.badgeBg}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{ch.name}</span>
              <span className="opacity-70 font-normal hidden sm:inline font-mono text-[11px]">
                ({ch.handle})
              </span>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-slate-900 via-[#071526] to-slate-900 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl ${className}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                Official Social Media
              </span>
              <span className="text-xs text-slate-400">Handle: <strong className="text-white">ocean technologies</strong></span>
            </div>
            <h4 className="text-sm font-bold text-white font-display">
              Connect With Ocean Technologies Across Social Channels
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {OFFICIAL_SOCIAL_CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all duration-200 group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ch.brandColor} bg-white/5 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate group-hover:text-sky-300 transition-colors">
                      {ch.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      ocean technologies
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
        {OFFICIAL_SOCIAL_CHANNELS.map((ch) => {
          const Icon = ch.icon;
          return (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all duration-200 group text-left shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ch.brandColor} bg-white/5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Follow</span>
              </div>
              <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                {ch.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                ocean technologies
              </span>
            </a>
          );
        })}
      </div>
    );
  }

  // Default compact
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {OFFICIAL_SOCIAL_CHANNELS.map((ch) => {
        const Icon = ch.icon;
        return (
          <a
            key={ch.name}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${ch.name}: ocean technologies`}
            aria-label={`${ch.name} page for ocean technologies`}
            className={`w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center transition-all duration-200 hover:scale-105 ${ch.brandColor} cursor-pointer`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};
