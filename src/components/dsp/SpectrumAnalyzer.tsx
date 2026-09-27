// ==============================================================================
// HEMASHREE // ECE SYSTEM - FFT SPECTRUM ANALYZER
// Discrete Fourier Transform magnitude bars, frequency domain inspection,
// harmonic peak marker, and noise-floor reduction visualization.
// ==============================================================================

import React, { useState } from 'react';
import { computeFftSpectrum } from './DspMath';
import { BarChart3, Info } from 'lucide-react';
import clsx from 'clsx';

interface SpectrumAnalyzerProps {
  rawSignal: number[];
  filteredSignal: number[];
  fundamentalFreq: number;
  className?: string;
}

export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  rawSignal,
  filteredSignal,
  fundamentalFreq,
  className,
}) => {
  const [hoveredBin, setHoveredBin] = useState<{
    freq: number;
    rawDb: number;
    filtDb: number;
  } | null>(null);

  // Compute FFT bins
  const rawBins = computeFftSpectrum(rawSignal, 24, 50);
  const filtBins = computeFftSpectrum(filteredSignal, 24, 50);

  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-3', className)}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-ece-cyan" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            FFT SPECTRUM ANALYZER [FREQUENCY DOMAIN]
          </span>
          <span className="font-mono text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            0 — 50 Hz BINS
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/60 border border-amber-400" />
            <span className="text-amber-400">RAW CORRUPTED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-ece-cyan border border-ece-cyan" />
            <span className="text-ece-cyan font-bold">FILTERED SPECTRUM</span>
          </div>
        </div>
      </div>

      {/* Main Spectrum Visualizer Grid */}
      <div className="relative w-full h-48 bg-[#050a10] rounded border border-ece-cyan/20 p-2 flex flex-col justify-end overflow-hidden">
        {/* dB Reference Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-2 text-[9px] font-mono text-slate-600 select-none">
          <div className="border-b border-white/5 flex justify-between">
            <span>0 dB</span>
            <span className="text-slate-700">UNITY GAIN</span>
          </div>
          <div className="border-b border-white/5 flex justify-between">
            <span>-20 dB</span>
            <span className="text-slate-700">10% AMPLITUDE</span>
          </div>
          <div className="border-b border-white/5 flex justify-between">
            <span>-40 dB</span>
            <span className="text-slate-700">1% STOPBAND NOISE</span>
          </div>
          <div className="flex justify-between">
            <span>-60 dB</span>
            <span className="text-slate-700">NOISE FLOOR</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex items-end justify-between gap-1 w-full h-36 px-1">
          {rawBins.map((raw, idx) => {
            const filt = filtBins[idx] || { binFreq: raw.binFreq, magnitude: 0, db: -50 };
            
            // Normalize heights for UI display
            const rawHeightPct = Math.min(100, Math.max(4, ((raw.db + 50) / 50) * 100));
            const filtHeightPct = Math.min(100, Math.max(4, ((filt.db + 50) / 50) * 100));
            const isFundamental = Math.abs(raw.binFreq - fundamentalFreq) < 2.5;

            return (
              <div
                key={raw.binFreq}
                className="relative flex-1 h-full flex items-end justify-center group cursor-crosshair"
                onMouseEnter={() =>
                  setHoveredBin({
                    freq: raw.binFreq,
                    rawDb: raw.db,
                    filtDb: filt.db,
                  })
                }
                onMouseLeave={() => setHoveredBin(null)}
              >
                {/* Fundamental Peak Indicator */}
                {isFundamental && (
                  <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-ece-orange animate-ping" />
                )}

                {/* Raw Spectrum Bar (Ghost / Amber Background) */}
                <div
                  className="absolute bottom-0 w-full bg-amber-500/30 rounded-t border-t border-amber-500/70 transition-all duration-150"
                  style={{ height: `${rawHeightPct}%` }}
                />

                {/* Filtered Spectrum Bar (Foreground / Cyan) */}
                <div
                  className={clsx(
                    'relative z-10 w-3/4 rounded-t transition-all duration-150 shadow-[0_0_8px_rgba(0,240,255,0.4)]',
                    isFundamental
                      ? 'bg-gradient-to-t from-ece-cyan via-cyan-300 to-white'
                      : 'bg-gradient-to-t from-cyan-900 via-ece-cyan/70 to-ece-cyan'
                  )}
                  style={{ height: `${filtHeightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Frequency Axis Ticks */}
        <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-white/10 px-1">
          <span>0 Hz (DC)</span>
          <span>12.5 Hz</span>
          <span>25.0 Hz</span>
          <span>37.5 Hz</span>
          <span>50 Hz (Nyquist)</span>
        </div>
      </div>

      {/* Hover Readout Tooltip */}
      <div className="h-6 flex items-center justify-between text-[11px] font-mono px-2 bg-black/40 rounded border border-white/5">
        {hoveredBin ? (
          <>
            <span className="text-white font-bold">
              BIN: <span className="text-ece-cyan">{hoveredBin.freq} Hz</span>
            </span>
            <div className="flex gap-3">
              <span className="text-amber-400">RAW: {hoveredBin.rawDb} dB</span>
              <span className="text-ece-cyan font-bold">FILT: {hoveredBin.filtDb} dB</span>
              <span className="text-emerald-400 font-bold">
                REDUCTION: -{(hoveredBin.rawDb - hoveredBin.filtDb).toFixed(1)} dB
              </span>
            </div>
          </>
        ) : (
          <span className="text-slate-500 text-[10px] flex items-center gap-1.5">
            <Info className="w-3 h-3 text-ece-cyan" />
            Hover over frequency columns to inspect harmonic spectral power and stopband noise attenuation.
          </span>
        )}
      </div>
    </div>
  );
};
