import React from 'react';
import clsx from 'clsx';
import { TechCorner } from './TechCorner';
import { StatusIndicator } from './StatusIndicator';

interface HUDPanelProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  systemCode?: string;
  variant?: 'cyan' | 'orange' | 'graphite';
  status?: 'nominal' | 'active' | 'processing' | 'alert';
  className?: string;
  headerRight?: React.ReactNode;
  hasScanlines?: boolean;
  cornerCut?: boolean;
}

export const HUDPanel: React.FC<HUDPanelProps> = ({
  children,
  title,
  subtitle,
  systemCode,
  variant = 'cyan',
  status = 'nominal',
  className,
  headerRight,
  hasScanlines = false,
  cornerCut = true,
}) => {
  const borderVariants = {
    cyan: 'border-ece-cyan/20 shadow-[0_4px_24px_rgba(0,240,255,0.06)]',
    orange: 'border-ece-orange/25 shadow-[0_4px_24px_rgba(255,123,0,0.07)]',
    graphite: 'border-slate-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
  };

  const headerLineColors = {
    cyan: 'from-ece-cyan/40 via-ece-cyan/10 to-transparent',
    orange: 'from-ece-orange/40 via-ece-orange/10 to-transparent',
    graphite: 'from-slate-600/40 via-slate-600/10 to-transparent',
  };

  return (
    <div
      className={clsx(
        'relative bg-ece-graphite/70 backdrop-blur-md border transition-all duration-300',
        cornerCut ? 'tech-corner-cut' : 'rounded-sm',
        borderVariants[variant],
        className
      )}
    >
      {/* 4 Tech Corner Brackets */}
      <TechCorner position="top-left" variant={variant} size={12} />
      <TechCorner position="top-right" variant={variant} size={12} />
      <TechCorner position="bottom-left" variant={variant} size={12} />
      <TechCorner position="bottom-right" variant={variant} size={12} />

      {/* Optional Scanlines */}
      {hasScanlines && <div className="absolute inset-0 scanline-overlay z-0 pointer-events-none opacity-40" />}

      {/* Header bar if provided */}
      {(title || systemCode || headerRight) && (
        <div className="relative z-10 px-4 py-3 border-b border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <StatusIndicator status={status} size="sm" pulse={false} />
            <div className="min-w-0">
              {systemCode && (
                <span className="block font-mono text-[9px] text-ece-cyan/70 tracking-widest leading-none mb-0.5">
                  [{systemCode}]
                </span>
              )}
              {title && (
                <h3 className="font-tech font-bold text-sm tracking-wider uppercase text-white truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-mono text-[10px] text-ece-text-dim truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {headerRight && <div className="flex-shrink-0">{headerRight}</div>}

          {/* Subtle accent highlight line beneath header */}
          <div
            className={clsx(
              'absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r',
              headerLineColors[variant]
            )}
          />
        </div>
      )}

      {/* Panel Body Content */}
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};
