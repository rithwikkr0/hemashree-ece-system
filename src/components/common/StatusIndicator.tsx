import React from 'react';
import clsx from 'clsx';

interface StatusIndicatorProps {
  status?: 'nominal' | 'active' | 'processing' | 'alert';
  label?: string;
  pulse?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'nominal',
  label,
  pulse = true,
  className,
  size = 'md',
}) => {
  const statusStyles = {
    nominal: {
      dot: 'bg-emerald-400',
      ring: 'bg-emerald-400/30',
      text: 'text-emerald-400',
      defaultLabel: 'NOMINAL // ONLINE',
    },
    active: {
      dot: 'bg-ece-cyan',
      ring: 'bg-ece-cyan/30',
      text: 'text-ece-cyan',
      defaultLabel: 'SIGNAL ACTIVE',
    },
    processing: {
      dot: 'bg-amber-400',
      ring: 'bg-amber-400/30',
      text: 'text-amber-400',
      defaultLabel: 'PROCESSING CLK',
    },
    alert: {
      dot: 'bg-ece-orange',
      ring: 'bg-ece-orange/30',
      text: 'text-ece-orange',
      defaultLabel: 'MANUAL OVERRIDE',
    },
  };

  const current = statusStyles[status];
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div className={clsx('inline-flex items-center gap-2 font-mono text-[11px] tracking-wider select-none', className)}>
      <div className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={clsx(
              'absolute inline-flex rounded-full animate-ping opacity-75',
              current.ring,
              sizeClasses[size]
            )}
          />
        )}
        <span
          className={clsx(
            'relative inline-flex rounded-full shadow-[0_0_8px_currentColor]',
            current.dot,
            sizeClasses[size]
          )}
        />
      </div>
      {(label || current.defaultLabel) && (
        <span className={clsx('uppercase font-medium tracking-widest text-[10px]', current.text)}>
          {label || current.defaultLabel}
        </span>
      )}
    </div>
  );
};
