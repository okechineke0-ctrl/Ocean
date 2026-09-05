import React, { useRef } from 'react';
import officialLogoImg from '../assets/images/ocean_tech_official_logo_1788614413228.jpg';
import realLogoImg from '../assets/images/ocean_tech_institute_logo.png';
import realLogoSvg from '../assets/images/ocean_tech_institute_logo.svg';

export { officialLogoImg, realLogoImg, realLogoSvg };

// Direct URL paths for logo image files (loaded directly via HTTP URL path)
export const LOGO_PRIMARY_URL = '/logo.png';
export const LOGO_SVG_URL = '/logo.svg';
export const LOGO_JPG_URL = '/logo.jpg';
export const LOGO_IMAGE_URL = officialLogoImg || LOGO_PRIMARY_URL;

interface LogoProps {
  src?: string;
  variant?: 'full' | 'icon' | 'horizontal' | 'image' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  isDark?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onTripleClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  src,
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
  isDark = false,
  onClick,
  onTripleClick,
}) => {
  const clickTimesRef = useRef<number[]>([]);

  // Use directly imported official logo asset or custom passed src, with fallback chain
  const activeLogoUrl = src || officialLogoImg || LOGO_PRIMARY_URL;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const currentSrc = target.src;
    // Fallback chain: imported asset -> /logo.png -> /logo.svg -> /logo.jpg
    if (currentSrc !== LOGO_PRIMARY_URL && !currentSrc.includes('/logo.png')) {
      target.src = LOGO_PRIMARY_URL;
    } else if (currentSrc.includes('/logo.png')) {
      target.src = LOGO_SVG_URL;
    } else if (currentSrc.includes('/logo.svg')) {
      target.src = LOGO_JPG_URL;
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const recentClicks = [...clickTimesRef.current.filter((t) => now - t < 1800), now];
    clickTimesRef.current = recentClicks;

    // Check for triple click (native or 3 clicks in 1.8s)
    if (e.detail >= 3 || recentClicks.length >= 3) {
      clickTimesRef.current = [];
      sessionStorage.setItem('ocean_tech_admin_auth', 'true');
      window.dispatchEvent(new CustomEvent('open-admin-portal'));
      if (onTripleClick) {
        onTripleClick();
        return;
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  const sizeMap = {
    sm: { img: 44, fullWidth: 120, textTitle: 'text-base sm:text-lg', textSub: 'text-[9.5px]', tag: 'text-[8px]' },
    md: { img: 56, fullWidth: 160, textTitle: 'text-xl sm:text-2xl', textSub: 'text-[11px]', tag: 'text-[9px]' },
    lg: { img: 76, fullWidth: 220, textTitle: 'text-2xl sm:text-3xl', textSub: 'text-xs', tag: 'text-[10px]' },
    xl: { img: 104, fullWidth: 280, textTitle: 'text-3xl sm:text-4xl', textSub: 'text-sm', tag: 'text-xs' },
  };

  const dim = sizeMap[size];

  // Raw Image Variant (Circular Badge directly using URL path)
  if (variant === 'image') {
    return (
      <div 
        onClick={handleContainerClick}
        className={`inline-flex items-center justify-center select-none ${className}`}
      >
        <div className="rounded-full overflow-hidden p-1 bg-white shadow-sm border border-slate-200 ring-2 ring-sky-500/20 transition-transform duration-300 hover:scale-105">
          <img
            src={activeLogoUrl}
            onError={handleImageError}
            alt="Ocean Tech Institute Official Logo"
            referrerPolicy="no-referrer"
            className="rounded-full object-contain"
            style={{ width: dim.fullWidth, height: dim.fullWidth }}
          />
        </div>
      </div>
    );
  }

  // Icon only (Circular Badge)
  if (variant === 'icon') {
    return (
      <div 
        onClick={handleContainerClick}
        className={`inline-flex items-center justify-center select-none ${className}`}
      >
        <div className={`rounded-full overflow-hidden shadow-sm border transition-transform duration-300 hover:scale-105 ${
          isDark 
            ? 'bg-white p-1 border-slate-700 ring-2 ring-sky-400/30' 
            : 'bg-white p-1 border-slate-200 ring-2 ring-sky-500/20'
        }`}>
          <img
            src={activeLogoUrl}
            onError={handleImageError}
            alt="Ocean Tech Institute Emblem"
            referrerPolicy="no-referrer"
            className="object-contain rounded-full"
            style={{ width: dim.img, height: dim.img }}
          />
        </div>
      </div>
    );
  }

  // Full Logo Variant: Display the circular emblem with elegant frame
  if (variant === 'full') {
    return (
      <div 
        onClick={handleContainerClick}
        className={`flex flex-col items-center text-center group select-none cursor-pointer ${className}`}
      >
        <div className={`overflow-hidden rounded-full shadow-md border transition-all duration-300 group-hover:scale-105 ${
          isDark 
            ? 'bg-white p-3 border-slate-700 ring-4 ring-sky-400/20' 
            : 'bg-white p-2.5 border-slate-200 ring-4 ring-sky-500/15'
        }`}>
          <img
            src={activeLogoUrl}
            onError={handleImageError}
            alt="Ocean Tech Institute Official Insignia"
            referrerPolicy="no-referrer"
            className="object-contain rounded-full"
            style={{ width: dim.fullWidth, height: dim.fullWidth }}
          />
        </div>
      </div>
    );
  }

  const oceanColor = isDark ? 'text-white' : 'text-[#0B2545]';
  const techColor = isDark ? 'text-[#38BDF8]' : 'text-[#0284C7]';
  const instituteColor = isDark ? 'text-slate-200' : 'text-[#0B2545]';
  const lineAccent = isDark ? 'bg-[#38BDF8]' : 'bg-[#0284C7]';
  const mottoColor = isDark ? 'text-sky-300' : 'text-slate-700';

  // Horizontal Header/Footer Variant: Circular Emblem + Typography lockup
  return (
    <div 
      onClick={handleContainerClick}
      className={`flex items-center gap-3.5 group select-none cursor-pointer ${className}`}
    >
      {/* Circular Emblem Frame using direct URL path */}
      <div className={`shrink-0 overflow-hidden rounded-full shadow-sm border transition-all duration-300 group-hover:scale-105 ${
        isDark 
          ? 'bg-white p-1 border-slate-700 ring-2 ring-sky-400/30' 
          : 'bg-white p-0.5 border-slate-200 ring-2 ring-sky-500/20'
      }`}>
        <img
          src={activeLogoUrl}
          onError={handleImageError}
          alt="Ocean Tech Institute"
          referrerPolicy="no-referrer"
          className="object-contain rounded-full"
          style={{ width: dim.img, height: dim.img }}
        />
      </div>

      <div className="flex flex-col text-left justify-center">
        {/* Main Brand Title: OCEAN TECH */}
        <div className="flex items-baseline gap-1.5 leading-none font-display">
          <span className={`font-black tracking-tight uppercase ${oceanColor} ${dim.textTitle}`}>
            OCEAN
          </span>
          <span className={`font-black tracking-tight uppercase ${techColor} ${dim.textTitle}`}>
            TECH
          </span>
        </div>

        {/* Subtitle: — I N S T I T U T E — */}
        <div className="flex items-center gap-2 mt-1.5 leading-none">
          <span className={`h-[1.5px] w-3.5 sm:w-5 ${lineAccent} rounded-full`}></span>
          <span className={`font-extrabold tracking-[0.28em] uppercase ${instituteColor} ${dim.textSub}`}>
            I N S T I T U T E
          </span>
          <span className={`h-[1.5px] w-3.5 sm:w-5 ${lineAccent} rounded-full`}></span>
        </div>

        {/* Official Brand Motto: INNOVATE • EDUCATE • EMPOWER */}
        {showTagline && (
          <div className={`flex items-center gap-1.5 mt-1 font-bold uppercase tracking-[0.16em] ${mottoColor} ${dim.tag}`}>
            <span>INNOVATE</span>
            <span className="text-[#0284C7]">•</span>
            <span>EDUCATE</span>
            <span className="text-[#0284C7]">•</span>
            <span>EMPOWER</span>
          </div>
        )}
      </div>
    </div>
  );
};
