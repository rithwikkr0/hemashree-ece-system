// ==============================================================================
// HEMASHREE // ECE SYSTEM - FILTER CONTROLS & DIFFERENCE EQUATION
// Filter topology (Bypass/FIR/IIR), Class (Low/High), Cutoff Frequency,
// Order selection, Window function, and mathematical difference equation.
// ==============================================================================

import React from 'react';
import { 
  DspFilterParams, 
  FilterType, 
  FilterClass, 
  FilterOrder, 
  WindowFunction 
} from '../../types/dsp';
import { formatDifferenceEquation } from './DspMath';
import { Sliders, Filter, Code2 } from 'lucide-react';
import clsx from 'clsx';

interface FilterControlsPanelProps {
  filterParams: DspFilterParams;
  onUpdateFilter: (updater: (prev: DspFilterParams) => DspFilterParams) => void;
  className?: string;
}

export const FilterControlsPanel: React.FC<FilterControlsPanelProps> = ({
  filterParams,
  onUpdateFilter,
  className,
}) => {
  const filterTypes: { id: FilterType; label: string; badge: string }[] = [
    { id: 'bypass', label: 'BYPASS', badge: 'RAW' },
    { id: 'fir', label: 'FIR', badge: 'WINDOWED SINC' },
    { id: 'iir', label: 'IIR', badge: 'BUTTERWORTH' },
  ];

  const orders: FilterOrder[] = [1, 2, 4, 8];
  const windows: WindowFunction[] = ['rectangular', 'hamming', 'hanning'];

  const diffEquation = formatDifferenceEquation(filterParams);

  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ece-cyan" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            DSP FILTER TOPOLOGY
          </span>
        </div>
        <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30 font-bold">
          {filterParams.type.toUpperCase()} ENGINE
        </span>
      </div>

      {/* Filter Type Toggle */}
      <div className="space-y-1">
        <span className="font-mono text-[10px] text-slate-400 block uppercase">
          FILTER ARCHITECTURE:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {filterTypes.map((t) => {
            const isSelected = filterParams.type === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onUpdateFilter((prev) => ({ ...prev, type: t.id }))}
                className={clsx(
                  'py-2 px-1 rounded font-mono text-[11px] flex flex-col items-center justify-center border transition-all',
                  isSelected
                    ? 'bg-ece-cyan/20 border-ece-cyan text-ece-cyan font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                )}
              >
                <span className="font-tech text-xs">{t.label}</span>
                <span className="text-[8px] opacity-70 tracking-tighter">{t.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Class: Low-Pass vs High-Pass */}
      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
        <button
          onClick={() => onUpdateFilter((prev) => ({ ...prev, filterClass: 'lowpass' }))}
          className={clsx(
            'py-1.5 px-2 rounded border transition-colors',
            filterParams.filterClass === 'lowpass'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          )}
        >
          LOW-PASS (LPF)
        </button>

        <button
          onClick={() => onUpdateFilter((prev) => ({ ...prev, filterClass: 'highpass' }))}
          className={clsx(
            'py-1.5 px-2 rounded border transition-colors',
            filterParams.filterClass === 'highpass'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          )}
        >
          HIGH-PASS (HPF)
        </button>
      </div>

      {/* Sliders and Order Selection */}
      <div className="space-y-2.5 font-mono text-[11px]">
        {/* Cutoff Frequency */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300 text-[10px]">
            <span>CUTOFF FREQUENCY (fc)</span>
            <span className="text-ece-cyan font-bold">{filterParams.cutoffFreq} Hz</span>
          </div>
          <input
            type="range"
            min="2"
            max="35"
            step="1"
            value={filterParams.cutoffFreq}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onUpdateFilter((prev) => ({ ...prev, cutoffFreq: val }));
            }}
            disabled={filterParams.type === 'bypass'}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan disabled:opacity-30"
          />
        </div>

        {/* Filter Order Selector */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300 text-[10px]">
            <span>FILTER ORDER (N)</span>
            <span className="text-purple-300 font-bold">N = {filterParams.order}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {orders.map((ord) => (
              <button
                key={ord}
                onClick={() => onUpdateFilter((prev) => ({ ...prev, order: ord }))}
                disabled={filterParams.type === 'bypass'}
                className={clsx(
                  'py-1 rounded text-center border font-mono text-[10px] transition-colors',
                  filterParams.order === ord
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-30'
                )}
              >
                {ord}
              </button>
            ))}
          </div>
        </div>

        {/* Window Function (FIR Only) */}
        {filterParams.type === 'fir' && (
          <div className="space-y-1 pt-1">
            <span className="text-slate-400 text-[10px] block uppercase">
              WINDOW FUNCTION:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {windows.map((win) => (
                <button
                  key={win}
                  onClick={() => onUpdateFilter((prev) => ({ ...prev, window: win }))}
                  className={clsx(
                    'py-1 rounded text-center border font-mono text-[9px] uppercase transition-colors',
                    filterParams.window === win
                      ? 'bg-ece-cyan/20 border-ece-cyan text-ece-cyan font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  )}
                >
                  {win}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Difference Equation Mathematical Readout */}
      <div className="p-2.5 bg-black/60 border border-white/10 rounded space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <Code2 className="w-3 h-3 text-ece-cyan" />
          <span>DIFFERENCE EQUATION:</span>
        </div>
        <div className="font-mono text-[11px] text-emerald-400 bg-black/40 p-1.5 rounded border border-emerald-500/20 overflow-x-auto whitespace-nowrap">
          {diffEquation}
        </div>
      </div>
    </div>
  );
};
