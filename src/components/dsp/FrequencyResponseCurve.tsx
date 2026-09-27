// ==============================================================================
// HEMASHREE // ECE SYSTEM - FREQUENCY RESPONSE (BODE MAGNITUDE PLOT)
// Dynamic Butterworth transfer function curve |H(f)|, -3dB cutoff marker,
// rolloff slope calculation (-20N dB/dec), and passband/stopband zoning.
// ==============================================================================

import React, { useMemo } from 'react';
import { DspFilterParams } from '../../types/dsp';
import { computeFrequencyResponse } from './DspMath';
import { Activity, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface FrequencyResponseCurveProps {
  filterParams: DspFilterParams;
  className?: string;
}

export const FrequencyResponseCurve: React.FC<FrequencyResponseCurveProps> = ({
  filterParams,
  className,
}) => {
  const points = useMemo(() => {
    return computeFrequencyResponse(filterParams, 80, 50);
  }, [filterParams]);

  // SVG coordinate mapping
  const width = 480;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 25, left: 40 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // X: 0 to 50 Hz, Y: +5 dB to -60 dB
  const minDb = -60;
  const maxDb = 5;

  const getX = (f: number) => padding.left + (f / 50) * plotW;
  const getY = (db: number) => {
    const clamped = Math.max(minDb, Math.min(maxDb, db));
    return padding.top + ((maxDb - clamped) / (maxDb - minDb)) * plotH;
  };

  // Build SVG path string
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, pt, idx) => {
      const x = getX(pt.freq);
      const y = getY(pt.magnitudeDb);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [points]);

  // Cutoff marker coordinates
  const cutoffX = getX(filterParams.cutoffFreq);
  const cutoffY = getY(-3.0);
  const rolloffSlope = filterParams.type === 'bypass' ? 0 : filterParams.order * 20;

  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-2', className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ece-cyan" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            BODE MAGNITUDE RESPONSE |H(f)|
          </span>
          <span className="font-mono text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {filterParams.type.toUpperCase()} • N={filterParams.order}
          </span>
        </div>

        <div className="font-mono text-[10px] text-ece-cyan flex items-center gap-2">
          <span className="text-slate-400">ROLL-OFF RATE:</span>
          <span className="font-bold text-white bg-ece-cyan/15 px-2 py-0.5 rounded border border-ece-cyan/30">
            -{rolloffSlope} dB / DECADE
          </span>
        </div>
      </div>

      {/* SVG Canvas Curve */}
      <div className="relative w-full aspect-[2.6/1] bg-[#050a10] rounded border border-ece-cyan/20 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full block select-none"
        >
          {/* Horizontal Grid Lines */}
          {[-60, -40, -20, -3, 0].map((db) => {
            const y = getY(db);
            const isCutoffDb = db === -3;
            return (
              <g key={db}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isCutoffDb ? 'rgba(255, 123, 0, 0.4)' : 'rgba(255, 255, 255, 0.08)'}
                  strokeDasharray={isCutoffDb ? '4,4' : undefined}
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill={isCutoffDb ? '#ff7b00' : '#64748b'}
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {db} dB
                </text>
              </g>
            );
          })}

          {/* Vertical Grid Lines */}
          {[10, 20, 30, 40, 50].map((freq) => {
            const x = getX(freq);
            return (
              <g key={freq}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="rgba(255, 255, 255, 0.08)"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 12}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {freq}Hz
                </text>
              </g>
            );
          })}

          {/* Passband Gradient Fill under curve */}
          {filterParams.type !== 'bypass' && (
            <path
              d={`${pathD} L ${getX(50)} ${getY(-60)} L ${getX(0)} ${getY(-60)} Z`}
              fill="url(#passbandGrad)"
              opacity="0.25"
            />
          )}

          {/* Main Magnitude Response Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0px 0px 4px #00f0ff)' }}
          />

          {/* Cutoff Frequency Vertical Line & Point */}
          {filterParams.type !== 'bypass' && (
            <g>
              <line
                x1={cutoffX}
                y1={padding.top}
                x2={cutoffX}
                y2={height - padding.bottom}
                stroke="#ff7b00"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <circle
                cx={cutoffX}
                cy={cutoffY}
                r="4.5"
                fill="#ff7b00"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              <text
                x={cutoffX + 6}
                y={cutoffY - 6}
                fill="#ff7b00"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                fc = {filterParams.cutoffFreq} Hz (-3dB)
              </text>
            </g>
          )}

          <defs>
            <linearGradient id="passbandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Footer Specification Note */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
        <span>
          PASSBAND: <strong className="text-white">0 — {filterParams.cutoffFreq} Hz</strong>
        </span>
        <span>
          STOPBAND ATTENUATION: <strong className="text-purple-300">-{filterParams.order * 20} dB / decade</strong>
        </span>
      </div>
    </div>
  );
};
