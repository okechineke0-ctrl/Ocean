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
    sm: { icon: 36, textTitle: 'text-base', textSub: 'text-[9.5px]', tag: 'text-[8px]' },
    md: { icon: 46, textTitle: 'text-lg', textSub: 'text-[11px]', tag: 'text-[9px]' },
    lg: { icon: 60, textTitle: 'text-2xl', textSub: 'text-xs', tag: 'text-[10px]' },
    xl: { icon: 84, textTitle: 'text-3xl', textSub: 'text-sm', tag: 'text-xs' },
  };

  const dim = sizeMap[size];

  const LogoIcon = (
    <svg
      width={dim.icon}
      height={dim.icon}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="oceanWaveGrad" x1="50" y1="350" x2="220" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="otGrad" x1="120" y1="60" x2="320" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="circuitGrad" x1="220" y1="180" x2="360" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="ringGrad" x1="100" y1="30" x2="300" y2="370" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      {/* Outer Circular Ring Outline */}
      <path
        d="M 120 45 A 165 165 0 1 1 315 285"
        stroke="url(#ringGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tech O & T letters */}
      <path
        d="M 215 115 C 215 75, 160 75, 160 115 C 160 155, 215 155, 215 115 Z"
        stroke="url(#otGrad)"
        strokeWidth="18"
        fill="none"
      />
      <path
        d="M 200 108 L 275 108 M 235 108 L 235 160"
        stroke="url(#otGrad)"
        strokeWidth="18"
        strokeLinecap="square"
      />
      <polygon points="262,108 275,108 266,120 253,120" fill="#38BDF8" />

      {/* Ocean Wave Flow Crests */}
      <path
        d="M 100 240 C 90 180, 110 135, 160 120 C 135 140, 125 185, 140 245 C 150 285, 185 305, 240 305 C 170 325, 95 295, 100 240 Z"
        fill="url(#oceanWaveGrad)"
      />
      <path
        d="M 115 235 C 108 190, 128 150, 168 140 C 145 158, 138 195, 150 240 C 160 270, 190 288, 235 285 C 175 300, 112 280, 115 235 Z"
        fill="#0284C7"
        opacity="0.9"
      />
      <path
        d="M 130 230 C 125 195, 140 165, 172 160 C 155 175, 150 205, 160 235 C 170 260, 195 272, 225 270 C 175 280, 128 265, 130 230 Z"
        fill="#38BDF8"
        opacity="0.95"
      />

      {/* Circuit Nodes & Digital Connectors */}
      <path
        d="M 235 180 L 270 180 L 285 155 L 305 155"
        stroke="url(#circuitGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="305" cy="155" r="5" fill="#0284C7" />

      <path
        d="M 225 195 L 260 195 L 280 170 L 325 170"
        stroke="url(#circuitGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="325" cy="170" r="5" fill="#38BDF8" />

      <path
        d="M 228 210 L 255 210 L 275 188 L 330 188"
        stroke="url(#circuitGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="330" cy="188" r="5" fill="#0369A1" />

      {/* Core Technology Hub */}
      <polygon
        points="194,222 206,222 204,196 196,196"
        fill="#0F172A"
      />
      <rect x="194" y="190" width="12" height="6" rx="1" fill="#0284C7" />
      <circle cx="200" cy="193" r="2.5" fill="#38BDF8" />

      {/* Code & Logic Base */}
      <path
        d="M 150 280 Q 200 295 250 280"
        stroke="#0284C7"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  const titlePrimary = isDark ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDark ? 'text-sky-300' : 'text-sky-700';
  const tagColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const dividerColor = isDark ? 'bg-sky-500/50' : 'bg-sky-600/40';

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
        {LogoIcon}
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1 leading-none font-display">
            <span className={`font-black tracking-tight ${titlePrimary} ${dim.textTitle}`}>
              OCEAN
            </span>
            <span className={`font-black tracking-tight text-sky-600 ${dim.textTitle}`}>
              TECHNOLOGIES
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`h-[1.5px] w-2 ${dividerColor}`}></span>
            <span className={`font-bold tracking-[0.16em] ${subtitleColor} uppercase ${dim.textSub}`}>
              WEB • APP • SOFTWARE MAINTENANCE
            </span>
            <span className={`h-[1.5px] w-2 ${dividerColor}`}></span>
          </div>
          {showTagline && (
            <span className={`tracking-[0.12em] ${tagColor} font-medium uppercase mt-0.5 ${dim.tag}`}>
              AGBANI • ENUGU STATE • NIGERIA
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center group cursor-pointer ${className}`}>
      {LogoIcon}
      <div className="mt-2.5 flex items-baseline gap-1 leading-none font-display">
        <span className={`font-black tracking-tight ${titlePrimary} ${dim.textTitle}`}>
          OCEAN
        </span>
        <span className={`font-black tracking-tight text-sky-600 ${dim.textTitle}`}>
          TECHNOLOGIES
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 mt-1.5 w-full">
        <span className={`h-[1.5px] w-4 ${dividerColor}`}></span>
        <span className={`font-bold tracking-[0.18em] ${subtitleColor} uppercase ${dim.textSub}`}>
          SOFTWARE & WEB SOLUTIONS
        </span>
        <span className={`h-[1.5px] w-4 ${dividerColor}`}></span>
      </div>
      {showTagline && (
        <span className={`tracking-[0.14em] ${tagColor} font-medium uppercase mt-1 ${dim.tag}`}>
          AGBANI • ENUGU STATE • NIGERIA
        </span>
      )}
    </div>
  );
};

