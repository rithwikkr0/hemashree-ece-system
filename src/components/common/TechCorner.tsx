import React from 'react';
import clsx from 'clsx';

interface TechCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'cyan' | 'orange' | 'white' | 'graphite';
  size?: number;
  className?: string;
}

export const TechCorner: React.FC<TechCornerProps> = ({
  position,
  variant = 'cyan',
  size = 10,
  className,
}) => {
  const colorMap = {
    cyan: 'border-ece-cyan/70',
    orange: 'border-ece-orange/70',
    white: 'border-white/60',
    graphite: 'border-slate-500/50',
  };

  const posClasses = {
    'top-left': 'top-0 left-0 border-t-2 border-l-2',
    'top-right': 'top-0 right-0 border-t-2 border-r-2',
    'bottom-left': 'bottom-0 left-0 border-b-2 border-l-2',
    'bottom-right': 'bottom-0 right-0 border-b-2 border-r-2',
  };

  return (
    <div
      className={clsx(
        'absolute pointer-events-none transition-all duration-300',
        colorMap[variant],
        posClasses[position],
        className
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};
