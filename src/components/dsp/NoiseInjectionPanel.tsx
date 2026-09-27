// ==============================================================================
// HEMASHREE // ECE SYSTEM - NOISE INJECTION CONTROLS
// Noise amplitude slider (0-100%), noise source type (Gaussian / Mains Hum),
// and real-time SNR telemetry indicator.
// ==============================================================================

import React from 'react';
import { DspSignalParams } from '../../types/dsp';
import { Zap, ShieldAlert, Sparkles, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface NoiseInjectionPanelProps {
  signalParams: DspSignalParams;
  onUpdateSignal: (updater: (prev: DspSignalParams) => DspSignalParams) => void;
  snrDb: number;
  className?: string;
}

export const NoiseInjectionPanel: React.FC<NoiseInjectionPanelProps> = ({
  signalParams,
  onUpdateSignal,
  snrDb,
  className,
}) => {
  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            NOISE INJECTION ENGINE
          </span>
        </div>
        <button
          onClick={() => onUpdateSignal((prev) => ({ ...prev, noiseLevel: 0 }))}
          className="flex items-center gap-1 font-mono text-[10px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 transition-colors"
          title="Clear all injected noise"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>ZERO NOISE</span>
        </button>
      </div>

      {/* Noise Slider */}
      <div className="space-y-1 font-mono text-[11px]">
        <div className="flex justify-between items-center text-slate-300 text-[10px]">
          <span>CORRUPTION LEVEL (NOISE %)</span>
          <span className={clsx(
            'font-bold px-1.5 py-0.5 rounded text-[10px]',
            signalParams.noiseLevel === 0 ? 'text-slate-500 bg-white/5' :
            signalParams.noiseLevel > 0.6 ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30' :
            'text-amber-400 bg-amber-500/10 border border-amber-500/30'
          )}>
            {Math.round(signalParams.noiseLevel * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={signalParams.noiseLevel}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdateSignal((prev) => ({ ...prev, noiseLevel: val }));
          }}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="flex justify-between text-[9px] text-slate-500 pt-0.5">
          <span>0% (Clean Signal)</span>
          <span>50%</span>
          <span>100% (High Distortion)</span>
        </div>
      </div>

      {/* Noise Type Selection */}
      <div className="space-y-1 font-mono text-[10px]">
        <span className="text-slate-400 block uppercase">NOISE PHENOMENOLOGY:</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSignal((prev) => ({ ...prev, noiseType: 'gaussian' }))}
            className={clsx(
              'p-1.5 rounded border transition-colors flex items-center justify-center gap-1',
              signalParams.noiseType === 'gaussian'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            )}
          >
            <Sparkles className="w-3 h-3" />
            <span>GAUSSIAN WHITE</span>
          </button>

          <button
            onClick={() => onUpdateSignal((prev) => ({ ...prev, noiseType: 'hum_harmonic' }))}
            className={clsx(
              'p-1.5 rounded border transition-colors flex items-center justify-center gap-1',
              signalParams.noiseType === 'hum_harmonic'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            )}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>50Hz MAINS HUM</span>
          </button>
        </div>
      </div>

      {/* Real-time SNR Indicator */}
      <div className="p-2 bg-black/40 border border-white/5 rounded flex items-center justify-between font-mono text-[10px]">
        <span className="text-slate-400 uppercase">SIGNAL-TO-NOISE RATIO (SNR):</span>
        <span className={clsx(
          'font-bold text-xs px-2 py-0.5 rounded border',
          snrDb >= 20 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
          snrDb >= 10 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
          'text-rose-400 bg-rose-500/10 border-rose-500/30'
        )}>
          {snrDb.toFixed(1)} dB
        </span>
      </div>
    </div>
  );
};
