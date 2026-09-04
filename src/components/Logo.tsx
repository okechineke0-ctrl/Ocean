import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
  isDark = false,
}) => {
  const sizeMap = {
    sm: { icon: 38, textTitle: 'text-base', textSub: 'text-[9px]', tag: 'text-[8px]' },
    md: { icon: 48, textTitle: 'text-lg', textSub: 'text-[10.5px]', tag: 'text-[8.5px]' },
    lg: { icon: 64, textTitle: 'text-2xl', textSub: 'text-xs', tag: 'text-[10px]' },
    xl: { icon: 88, textTitle: 'text-3xl', textSub: 'text-sm', tag: 'text-xs' },
  };

  const dim = sizeMap[size];

  // Authentic vector illustration of Ocean Technologies Institute brand emblem
  const LogoIcon = (
    <svg
      width={dim.icon}
      height={dim.icon}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105 select-none"
    >
      <defs>
        {/* Navy & Ocean Gradient */}
        <linearGradient id="otRingGrad" x1="40" y1="40" x2="360" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B2545" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="otWaveGrad" x1="40" y1="320" x2="220" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B2545" />
          <stop offset="35%" stopColor="#0369A1" />
          <stop offset="70%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="otBeamGrad" x1="120" y1="280" x2="40" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="circuitGrad" x1="220" y1="120" x2="360" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Outer circular badge frame */}
      <circle cx="200" cy="200" r="186" stroke="url(#otRingGrad)" strokeWidth="12" fill="white" />
      <circle cx="200" cy="200" r="172" fill="#F8FAFC" />

      {/* Ocean Wave Silhouette that curls into the O */}
      <path
        d="M 68 255 C 65 170 120 95 190 90 C 235 88 270 115 270 155 C 270 195 240 215 205 215 C 160 215 130 180 135 145 C 138 125 152 110 170 105 C 120 120 98 165 105 220 C 112 275 160 315 230 315 C 310 315 340 250 340 250 C 330 295 285 332 220 332 C 145 332 72 298 68 255 Z"
        fill="url(#otWaveGrad)"
      />

      {/* Letter T with Tech Terminal Arms */}
      <path
        d="M 215 110 L 320 110 M 265 110 L 265 245"
        stroke="#0F2B48"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tech Circuit Traces extending from the T */}
      {/* Top trace */}
      <path
        d="M 320 110 L 348 110 L 368 135 L 380 135"
        stroke="url(#circuitGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="380" cy="135" r="7" fill="#0284C7" />

      {/* Mid trace */}
      <path
        d="M 265 165 L 310 165 L 332 190 L 360 190"
        stroke="url(#circuitGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="360" cy="190" r="7" fill="#38BDF8" />

      {/* Lower trace */}
      <path
        d="M 265 210 L 295 210 L 315 235 L 340 235"
        stroke="url(#circuitGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="340" cy="235" r="7" fill="#0B2545" />

      {/* Lighthouse (Beacon of Knowledge & Tech) */}
      <g transform="translate(108, 205)">
        {/* Lighthouse Base / Open Book Pedestal */}
        <path
          d="M -16 65 Q 0 58 16 65 L 14 74 Q 0 68 -14 74 Z"
          fill="#0B2545"
        />
        {/* Tower Body */}
        <polygon
          points="-12,65 12,65 8,15 -8,15"
          fill="#0B2545"
        />
        {/* Stripes */}
        <polygon points="-10,50 10,50 9,40 -9,40" fill="#38BDF8" />
        <polygon points="-8.5,30 8.5,30 8,22 -8,22" fill="#FFFFFF" />
        {/* Lantern Room */}
        <rect x="-8" y="8" width="16" height="7" fill="#0F172A" />
        {/* Light Dome */}
        <path d="M -7 8 Q 0 1 7 8 Z" fill="#0284C7" />
        {/* Radiant Light Beam */}
        <polygon
          points="0,11 -70,-20 -85,15"
          fill="url(#otBeamGrad)"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  const titlePrimary = isDark ? 'text-white' : 'text-[#0B2545]';
  const subtitleColor = isDark ? 'text-sky-300' : 'text-sky-600';
  const instituteColor = isDark ? 'text-slate-300' : 'text-[#0F2B48]';
  const tagColor = isDark ? 'text-slate-400' : 'text-slate-500';

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
        {LogoIcon}
        <div className="flex flex-col text-left justify-center">
          <div className="flex items-baseline gap-1.5 leading-none font-display">
            <span className={`font-black tracking-tight ${titlePrimary} ${dim.textTitle}`}>
              OCEAN
            </span>
            <span className={`font-black tracking-tight text-sky-600 ${dim.textTitle}`}>
              TECHNOLOGIES
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 leading-none">
            <span className="h-[1px] w-3 bg-sky-500/60"></span>
            <span className={`font-black tracking-[0.24em] ${instituteColor} uppercase ${dim.textSub}`}>
              I N S T I T U T E
            </span>
            <span className="h-[1px] w-3 bg-sky-500/60"></span>
          </div>
          {showTagline && (
            <span className={`tracking-[0.14em] ${subtitleColor} font-extrabold uppercase mt-1 ${dim.tag}`}>
              INNOVATE • EDUCATE • EMPOWER
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center group cursor-pointer ${className}`}>
      {LogoIcon}
      <div className="mt-3 flex items-baseline gap-1.5 leading-none font-display">
        <span className={`font-black tracking-tight ${titlePrimary} ${dim.textTitle}`}>
          OCEAN
        </span>
        <span className={`font-black tracking-tight text-sky-600 ${dim.textTitle}`}>
          TECHNOLOGIES
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 mt-1.5 w-full">
        <span className="h-[1px] w-4 bg-sky-500/60"></span>
        <span className={`font-black tracking-[0.26em] ${instituteColor} uppercase ${dim.textSub}`}>
          I N S T I T U T E
        </span>
        <span className="h-[1px] w-4 bg-sky-500/60"></span>
      </div>
      {showTagline && (
        <span className={`tracking-[0.16em] ${subtitleColor} font-extrabold uppercase mt-1 ${dim.tag}`}>
          INNOVATE • EDUCATE • EMPOWER
        </span>
      )}
    </div>
  );
};
