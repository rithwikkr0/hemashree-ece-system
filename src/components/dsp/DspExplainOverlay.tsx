// ==============================================================================
// HEMASHREE // ECE SYSTEM - DSP EXPLAIN MODE OVERLAY & CALLOUTS
// Recruiter-friendly contextual explanations for non-DSP hiring managers.
// ==============================================================================

import React from 'react';
import { DSP_EDUCATIONAL_CONCEPTS } from '../../data/dspLab';
import { HelpCircle, Sparkles, BookOpen, Check } from 'lucide-react';
import clsx from 'clsx';

interface DspExplainCardProps {
  conceptKey: string;
  className?: string;
}

export const DspExplainCard: React.FC<DspExplainCardProps> = ({ conceptKey, className }) => {
  const concept = DSP_EDUCATIONAL_CONCEPTS[conceptKey];
  if (!concept) return null;

  return (
    <div className={clsx('p-3 bg-ece-obsidian/95 border border-ece-cyan/50 rounded tech-corner-cut-sm shadow-[0_0_20px_rgba(0,240,255,0.15)] space-y-1.5 font-sans text-xs', className)}>
      <div className="flex items-center gap-1.5 text-ece-cyan font-tech font-bold text-xs">
        <Sparkles className="w-3.5 h-3.5" />
        <span>RECRUITER INSIGHT // {concept.title.toUpperCase()}</span>
      </div>

      <p className="text-white font-medium text-[11px] leading-snug">
        {concept.shortSummary}
      </p>

      <p className="text-slate-300 text-[11px] leading-relaxed">
        {concept.explanation}
      </p>

      <div className="pt-1.5 border-t border-white/10 space-y-1 text-[10px]">
        <div className="text-emerald-400 font-mono">
          <strong>Hardware Impact:</strong> {concept.engineeringImpact}
        </div>
        <div className="text-slate-400 font-mono">
          <strong>Real-World Device:</strong> {concept.realWorldExample}
        </div>
      </div>
    </div>
  );
};

interface DspExplainHeaderBannerProps {
  isExplainMode: boolean;
  onToggleExplainMode: () => void;
}

export const DspExplainHeaderBanner: React.FC<DspExplainHeaderBannerProps> = ({
  isExplainMode,
  onToggleExplainMode,
}) => {
  return (
    <div className="p-3 bg-ece-graphite/80 border border-ece-cyan/30 rounded tech-corner-cut flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className={clsx(
          'p-2 rounded border transition-colors',
          isExplainMode ? 'bg-ece-cyan/20 border-ece-cyan text-ece-cyan' : 'bg-white/5 border-white/10 text-slate-400'
        )}>
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-tech text-sm font-bold text-white uppercase">
              {isExplainMode ? 'EXPLAIN MODE: RECRUITER INSIGHTS ACTIVE' : 'ADVANCED ENGINEERING MODE'}
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-ece-cyan/15 text-ece-cyan border border-ece-cyan/30">
              PRESS [E] TO TOGGLE
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            {isExplainMode
              ? 'Displaying plain-English explanations alongside oscilloscope, spectrum, and Z-plane stability modules.'
              : 'Displaying full mathematical transfer functions, difference equations, discrete FFT bins, and pole-zero coordinates.'}
          </p>
        </div>
      </div>

      <button
        onClick={onToggleExplainMode}
        className={clsx(
          'px-4 py-2 rounded font-mono text-xs font-bold transition-all border shadow-[0_0_12px_rgba(0,0,0,0.5)]',
          isExplainMode
            ? 'bg-ece-cyan text-black border-ece-cyan hover:bg-cyan-300'
            : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
        )}
      >
        {isExplainMode ? 'SWITCH TO ADVANCED MODE' : 'SWITCH TO EXPLAIN MODE'}
      </button>
    </div>
  );
};
