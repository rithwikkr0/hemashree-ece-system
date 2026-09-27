// ==============================================================================
// HEMASHREE // ECE SYSTEM - COMPLEX Z-PLANE POLE-ZERO STABILITY
// Interactive 2D complex plane, unit circle |z|=1, conjugate poles (x),
// zeros (o), and BIBO stability criterion evaluation.
// ==============================================================================

import React, { useMemo } from 'react';
import { DspFilterParams } from '../../types/dsp';
import { computePoles, computeZeros } from './DspMath';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface PoleZeroPlaneProps {
  filterParams: DspFilterParams;
  onUpdateFilter: (updater: (prev: DspFilterParams) => DspFilterParams) => void;
  className?: string;
}

export const PoleZeroPlane: React.FC<PoleZeroPlaneProps> = ({
  filterParams,
  onUpdateFilter,
  className,
}) => {
  const poles = useMemo(() => computePoles(filterParams), [filterParams]);
  const zeros = useMemo(() => computeZeros(filterParams), [filterParams]);

  const maxPoleRadius = useMemo(() => {
    if (poles.length === 0) return 0;
    return Math.max(...poles.map((p) => Math.sqrt(p.re * p.re + p.im * p.im)));
  }, [poles]);

  const isStable = maxPoleRadius < 0.999;

  // Coordinate mapping for SVG (box 220x220, center 110,110, radius 80)
  const size = 220;
  const center = size / 2;
  const unitRadius = 80;

  const toSvgX = (re: number) => center + re * unitRadius;
  const toSvgY = (im: number) => center - im * unitRadius; // Invert for SVG y-down

  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-ece-cyan" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            COMPLEX Z-PLANE STABILITY
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {isStable ? (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              STABLE (|p| &lt; 1.0)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 font-bold">
              <AlertTriangle className="w-3 h-3" />
              UNSTABLE (|p| ≥ 1.0)
            </span>
          )}
        </div>
      </div>

      {/* Main SVG Plane */}
      <div className="relative w-full aspect-square max-w-[240px] mx-auto bg-[#050a10] rounded border border-ece-cyan/20 overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full block select-none">
          {/* Real and Imaginary Axes */}
          <line
            x1="10"
            y1={center}
            x2={size - 10}
            y2={center}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
          <line
            x1={center}
            y1="10"
            x2={center}
            y2={size - 10}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />

          {/* Unit Circle |z| = 1.0 */}
          <circle
            cx={center}
            cy={center}
            r={unitRadius}
            fill="none"
            stroke={isStable ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 51, 102, 0.6)'}
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          {/* Unit Circle Interior Shading (Stable Region) */}
          <circle
            cx={center}
            cy={center}
            r={unitRadius}
            fill="rgba(0, 240, 255, 0.03)"
          />

          {/* Axis Labels */}
          <text x={size - 22} y={center - 4} fill="#64748b" fontSize="8" fontFamily="monospace">
            +Re
          </text>
          <text x={center + 4} y="18" fill="#64748b" fontSize="8" fontFamily="monospace">
            +jIm
          </text>
          <text x={center + unitRadius - 10} y={center + 12} fill="#64748b" fontSize="7" fontFamily="monospace">
            1.0
          </text>

          {/* Render Zeros (o) */}
          {zeros.map((zero, idx) => {
            const x = toSvgX(zero.re);
            const y = toSvgY(zero.im);
            return (
              <circle
                key={`zero-${idx}`}
                cx={x}
                cy={y}
                r="4.5"
                fill="none"
                stroke="#00ff88"
                strokeWidth="1.8"
              />
            );
          })}

          {/* Render Poles (x) */}
          {poles.map((pole, idx) => {
            const x = toSvgX(pole.re);
            const y = toSvgY(pole.im);
            const pRadius = Math.sqrt(pole.re * pole.re + pole.im * pole.im);
            const isPoleStable = pRadius < 0.999;
            const poleColor = isPoleStable ? '#00f0ff' : '#ff3366';
            const s = 4.5;

            return (
              <g key={`pole-${idx}`}>
                <line
                  x1={x - s}
                  y1={y - s}
                  x2={x + s}
                  y2={y + s}
                  stroke={poleColor}
                  strokeWidth="2.2"
                />
                <line
                  x1={x - s}
                  y1={y + s}
                  x2={x + s}
                  y2={y - s}
                  stroke={poleColor}
                  strokeWidth="2.2"
                />
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-1.5 left-2 flex items-center gap-2 text-[9px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="text-ece-cyan font-bold text-xs">✕</span> POLE
          </span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold text-xs">○</span> ZERO
          </span>
        </div>
      </div>

      {/* Damping / Pole Radius Slider */}
      <div className="p-2 bg-black/40 border border-white/5 rounded space-y-1 font-mono text-[10px]">
        <div className="flex justify-between text-slate-400">
          <span>POLE DAMPING FACTOR (Q)</span>
          <span className="text-ece-cyan font-bold">r = {maxPoleRadius.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.3"
          max="0.95"
          step="0.05"
          value={filterParams.damping}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdateFilter((prev) => ({ ...prev, damping: val }));
          }}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan"
        />
        <div className="flex justify-between text-[9px] text-slate-500">
          <span>Overdamped</span>
          <span>Critically Damped</span>
          <span>High Resonance</span>
        </div>
      </div>
    </div>
  );
};
