import React from 'react';
import clsx from 'clsx';

interface SystemBadgeProps {
  label: string;
  variant?: 'cyan' | 'orange' | 'graphite' | 'green';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const SystemBadge: React.FC<SystemBadgeProps> = ({
  label,
  variant = 'cyan',
  size = 'md',
  icon,
  className,
}) => {
  const variantStyles = {
    cyan: 'border-ece-cyan/30 text-ece-cyan bg-ece-cyan/5 hover:border-ece-cyan/60 hover:bg-ece-cyan/10',
    orange: 'border-ece-orange/30 text-ece-orange bg-ece-orange/5 hover:border-ece-orange/60 hover:bg-ece-orange/10',
    graphite: 'border-slate-700/60 text-slate-300 bg-slate-900/60 hover:border-slate-500 hover:text-white',
    green: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/60 hover:bg-emerald-500/10',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-[11px] px-2.5 py-1 tracking-widest',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-mono uppercase font-semibold border rounded-sm transition-colors duration-200 backdrop-blur-sm select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      {label}
    </span>
  );
};
