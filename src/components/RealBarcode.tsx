import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, ExternalLink, Sparkles, Check } from 'lucide-react';

interface RealBarcodeProps {
  code?: string;
  label?: string;
  subtitle?: string;
  className?: string;
  showQr?: boolean;
  targetUrl?: string;
}

export const RealBarcode: React.FC<RealBarcodeProps> = ({
  code = 'OTI-2026-95AA69',
  label = 'SCAN ME',
  subtitle = 'to visit our website',
  className = '',
  targetUrl = 'https://ocean-f4gj.onrender.com',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate crisp, genuine scannable QR Code matching the flyer
  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0B2545', // Flyer deep navy blue
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
      });
  }, [targetUrl]);

  const handleCopyOrVisit = () => {
    navigator.clipboard?.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`inline-flex items-center gap-3 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200/90 text-slate-800 transition-all hover:shadow-2xl group ${className}`}
    >
      {/* 1. Authentic High-Density Scannable QR Code as on the Flyer */}
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Scan with phone camera or click to open website"
        className="relative p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs shrink-0 overflow-hidden block transition-transform group-hover:scale-105 cursor-pointer"
      >
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Scan Me QR Code - Ocean Technologies Website"
            width={72}
            height={72}
            className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] object-contain rounded-lg"
          />
        ) : (
          <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] bg-slate-100 flex items-center justify-center rounded-lg">
            <QrCode className="w-8 h-8 text-[#0B2545] animate-pulse" />
          </div>
        )}

        {/* Subtle laser alignment highlight */}
        <div className="absolute inset-x-1.5 top-1.5 h-[2px] bg-sky-500/80 shadow-[0_0_8px_rgba(2,132,199,0.9)] opacity-70 group-hover:opacity-100 animate-pulse pointer-events-none rounded-full" />
      </a>

      {/* 2. Original Flyer Typography Lockup: SCAN ME / to visit our website */}
      <div className="flex flex-col items-start justify-center pr-1 select-none">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-black tracking-tight uppercase text-[#0B2545] group-hover/link:text-[#0284C7] transition-colors leading-tight font-display">
              {label}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-sky-500 opacity-80 group-hover/link:opacity-100 transition-opacity" />
          </div>

          <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight mt-0.5 group-hover/link:text-slate-900 transition-colors">
            {subtitle}
          </p>
        </a>

        {/* Verified Portal URL indicator */}
        <button
          onClick={handleCopyOrVisit}
          className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-[10px] font-mono text-sky-800 transition-colors cursor-pointer"
          title="Click to copy official portal URL"
        >
          {copied ? (
            <>
              <Check className="w-2.5 h-2.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied URL!</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[130px]">ocean-f4gj.onrender.com</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
