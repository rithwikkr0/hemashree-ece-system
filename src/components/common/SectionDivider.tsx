import React from 'react';
import clsx from 'clsx';

interface SectionDividerProps {
  variant?: 'circuit' | 'signal' | 'waveform' | 'minimal';
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'minimal',
  className,
}) => {
  return (
    <div className={clsx('relative w-full max-w-4xl mx-auto flex items-center justify-center py-12 select-none pointer-events-none', className)}>
      {variant === 'circuit' && (
        <div className="relative w-full flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute w-2 h-2 rounded-full border border-ece-cyan/50 bg-ece-obsidian flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.4)]">
            <div className="w-1 h-1 rounded-full bg-ece-cyan" />
          </div>
        </div>
      )}

      {variant === 'signal' && (
        <div className="relative w-full flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-ece-cyan/20 to-transparent" />
          <div className="absolute px-3 py-0.5 bg-black/80 border border-white/10 rounded-full font-mono text-[9px] text-slate-500 tracking-widest uppercase">
            SIGNAL TRACE
          </div>
        </div>
      )}

      {variant === 'waveform' && (
        <div className="relative w-full flex items-center justify-center">
          <svg className="w-48 h-6 text-ece-cyan/30" viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 12 H70 Q80 0 90 12 T110 12 Q120 24 130 12 H200"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="2 3"
            />
          </svg>
        </div>
      )}

      {variant === 'minimal' && (
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      )}
    </div>
  );
};

export default SectionDivider;
