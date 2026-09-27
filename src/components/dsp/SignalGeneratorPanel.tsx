// ==============================================================================
// HEMASHREE // ECE SYSTEM - SIGNAL GENERATOR CONTROLS
// Waveform selector (Sine, Square, Triangle), Frequency, Amplitude, Phase.
// ==============================================================================

import React from 'react';
import { DspSignalParams, SignalWaveform } from '../../types/dsp';
import { Activity, Radio, Square, Triangle } from 'lucide-react';
import clsx from 'clsx';

interface SignalGeneratorPanelProps {
  signalParams: DspSignalParams;
  onUpdateSignal: (updater: (prev: DspSignalParams) => DspSignalParams) => void;
  className?: string;
}

export const SignalGeneratorPanel: React.FC<SignalGeneratorPanelProps> = ({
  signalParams,
  onUpdateSignal,
  className,
}) => {
  const waveforms: { id: SignalWaveform; label: string; icon: React.ElementType }[] = [
    { id: 'sine', label: 'SINE', icon: Activity },
    { id: 'square', label: 'SQUARE', icon: Square },
    { id: 'triangle', label: 'TRIANGLE', icon: Triangle },
  ];

  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-3', className)}>
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-ece-cyan" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            SIGNAL GENERATOR
          </span>
        </div>
        <span className="font-mono text-[10px] text-ece-cyan bg-ece-cyan/10 px-2 py-0.5 rounded border border-ece-cyan/30">
          CH1 SOURCE
        </span>
      </div>

      {/* Waveform Selection Buttons */}
      <div className="space-y-1">
        <span className="font-mono text-[10px] text-slate-400 block uppercase">
          WAVEFORM TOPOLOGY:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {waveforms.map((item) => {
            const isSelected = signalParams.waveform === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onUpdateSignal((prev) => ({ ...prev, waveform: item.id }))}
                className={clsx(
                  'flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-mono text-[11px] transition-all border',
                  isSelected
                    ? 'bg-ece-cyan/20 border-ece-cyan text-ece-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-2.5 font-mono text-[11px]">
        {/* Frequency */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300 text-[10px]">
            <span>FREQUENCY (f₀)</span>
            <span className="text-ece-cyan font-bold">{signalParams.frequency} Hz</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={signalParams.frequency}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onUpdateSignal((prev) => ({ ...prev, frequency: val }));
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan"
          />
        </div>

        {/* Amplitude */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300 text-[10px]">
            <span>AMPLITUDE (Vₚ)</span>
            <span className="text-ece-cyan font-bold">{signalParams.amplitude.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={signalParams.amplitude}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdateSignal((prev) => ({ ...prev, amplitude: val }));
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan"
          />
        </div>

        {/* Phase */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300 text-[10px]">
            <span>PHASE OFFSET (φ)</span>
            <span className="text-ece-cyan font-bold">{signalParams.phase}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={signalParams.phase}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onUpdateSignal((prev) => ({ ...prev, phase: val }));
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan"
          />
        </div>
      </div>
    </div>
  );
};
