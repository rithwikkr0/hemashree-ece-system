// ==============================================================================
// HEMASHREE // ECE SYSTEM - DSP LAB PRESETS BAR
// One-click loading of verified real-world engineering DSP test scenarios.
// ==============================================================================

import React from 'react';
import { DSP_PRESETS } from '../../data/dspLab';
import { DspPreset, DspSignalParams, DspFilterParams } from '../../types/dsp';
import { Bookmark, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface DspPresetsBarProps {
  activePresetId: string | null;
  onSelectPreset: (preset: DspPreset) => void;
  className?: string;
}

export const DspPresetsBar: React.FC<DspPresetsBarProps> = ({
  activePresetId,
  onSelectPreset,
  className,
}) => {
  return (
    <div className={clsx('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-xs text-ece-cyan font-bold">
          <Bookmark className="w-3.5 h-3.5" />
          <span>ENGINEERING TEST PRESETS (VERIFIED SCENARIOS):</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          SELECT SCENARIO FOR AUTO-CONFIG
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {DSP_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={clsx(
                'text-left p-2.5 rounded border transition-all tech-corner-cut-sm flex flex-col justify-between group',
                isSelected
                  ? 'bg-ece-cyan/20 border-ece-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'bg-black/50 border-white/10 hover:border-ece-cyan/50 hover:bg-white/5'
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-tech text-xs font-bold text-white group-hover:text-ece-cyan transition-colors">
                    {preset.name}
                  </span>
                  {isSelected && <Sparkles className="w-3 h-3 text-ece-cyan shrink-0" />}
                </div>
                <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                  {preset.category}
                </span>
                <p className="text-[11px] font-sans text-slate-300 pt-1 line-clamp-2 leading-tight">
                  {preset.description}
                </p>
              </div>

              <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-slate-400">
                <span>IN: {preset.signal.waveform.toUpperCase()}</span>
                <span className="text-ece-cyan">
                  {preset.filter.type.toUpperCase()} fc={preset.filter.cutoffFreq}Hz
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
