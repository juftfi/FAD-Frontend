import React, { useState } from 'react';

interface ProjectLogoProps {
  src?: string;
  alt: string;
  symbol: string;
  className?: string;
}

export const ProjectLogo: React.FC<ProjectLogoProps> = ({
  src,
  alt,
  symbol,
  className = 'w-11 h-11 rounded-xl object-cover shrink-0'
}) => {
  const [errorCount, setErrorCount] = useState<number>(0);

  // Hierarchy of fallbacks:
  // 0: original src (or /logo.png)
  // 1: /logo.png
  // 2: /fad_vault_logo.jpg
  // >=3: rich SVG token insignia badge
  const getEffectiveSrc = () => {
    if (errorCount === 0) return src || '/logo.png';
    if (errorCount === 1) {
      if (src === '/logo.png') return '/fad_vault_logo.jpg';
      return '/logo.png';
    }
    if (errorCount === 2) return '/fad_vault_logo.jpg';
    return null;
  };

  const currentSrc = getEffectiveSrc();

  if (!currentSrc || errorCount >= 3) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-amber-500/30 via-[#162032] to-amber-900/40 border border-amber-500/40 flex flex-col items-center justify-center shrink-0 shadow-sm shadow-amber-500/10 select-none overflow-hidden`}
        title={`${alt} (${symbol})`}
      >
        <span className="font-mono font-extrabold text-amber-400 text-xs tracking-wider uppercase drop-shadow-sm">
          {symbol.slice(0, 4)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        setErrorCount((prev) => prev + 1);
      }}
      className={className}
    />
  );
};
