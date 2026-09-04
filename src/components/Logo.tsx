import React from 'react';
import realLogoImg from '../assets/images/ocean_tech_institute_logo.png';
import realLogoSvg from '../assets/images/ocean_tech_institute_logo.svg';

export { realLogoImg, realLogoSvg };

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal' | 'image' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
  isDark = false,
}) => {
  const sizeMap = {
    sm: { img: 48, fullWidth: 120, textTitle: 'text-base sm:text-lg', textSub: 'text-[9.5px]', tag: 'text-[8px]' },
    md: { img: 60, fullWidth: 160, textTitle: 'text-xl sm:text-2xl', textSub: 'text-[11px]', tag: 'text-[9px]' },
    lg: { img: 80, fullWidth: 220, textTitle: 'text-2xl sm:text-3xl', textSub: 'text-xs', tag: 'text-[10px]' },
    xl: { img: 110, fullWidth: 280, textTitle: 'text-3xl sm:text-4xl', textSub: 'text-sm', tag: 'text-xs' },
  };

  const dim = sizeMap[size];

  // Raw Image Variant (Just the exact official logo graphic)
  if (variant === 'image') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src={realLogoSvg}
          alt="Ocean Tech Institute Official Logo"
          referrerPolicy="no-referrer"
          className="rounded-2xl object-contain shadow-xs transition-transform duration-300 hover:scale-105"
          style={{ width: dim.fullWidth, height: dim.fullWidth }}
        />
      </div>
    );
  }

  // Icon only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <div className={`rounded-xl overflow-hidden shadow-xs border transition-transform duration-300 hover:scale-105 ${
          isDark ? 'bg-white p-0.5 border-slate-700' : 'bg-white p-0.5 border-slate-200'
        }`}>
          <img
            src={realLogoSvg}
            alt="Ocean Tech Institute Emblem"
            referrerPolicy="no-referrer"
            className="object-contain"
            style={{ width: dim.img, height: dim.img }}
          />
        </div>
      </div>
    );
  }

  // Full Logo Variant: Display the complete official logo graphic directly
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center group select-none cursor-pointer ${className}`}>
        <div className={`overflow-hidden rounded-2xl shadow-sm border transition-all duration-300 group-hover:scale-105 ${
          isDark ? 'bg-white p-2 border-slate-700' : 'bg-white p-1.5 border-slate-200'
        }`}>
          <img
            src={realLogoSvg}
            alt="Ocean Tech Institute Official Insignia"
            referrerPolicy="no-referrer"
            className="object-contain"
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

  // Horizontal Header/Footer Variant: The exact official logo picture + typography lockup
  return (
    <div className={`flex items-center gap-3.5 group select-none cursor-pointer ${className}`}>
      {/* Exact Official Logo Image Badge */}
      <div className={`shrink-0 overflow-hidden rounded-xl shadow-xs border transition-all duration-300 group-hover:scale-105 ${
        isDark ? 'bg-white p-1 border-slate-700' : 'bg-white p-0.5 border-slate-200'
      }`}>
        <img
          src={realLogoSvg}
          alt="Ocean Tech Institute"
          referrerPolicy="no-referrer"
          className="object-contain"
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
