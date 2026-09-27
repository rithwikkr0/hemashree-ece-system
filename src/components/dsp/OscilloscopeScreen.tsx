// ==============================================================================
// HEMASHREE // ECE SYSTEM - DUAL-TRACE DIGITAL OSCILLOSCOPE
// Authentic phosphor CRT graticule, real-time dual-trace rendering,
// trigger freeze, persistence, and telemetry measurements.
// ==============================================================================

import React, { useRef, useEffect } from 'react';
import { ScopeDisplaySettings, DspTelemetry } from '../../types/dsp';
import { Play, Pause } from 'lucide-react';
import clsx from 'clsx';

interface OscilloscopeScreenProps {
  rawSignal: number[];
  filteredSignal: number[];
  telemetry: DspTelemetry;
  settings: ScopeDisplaySettings;
  onUpdateSettings: (updater: (prev: ScopeDisplaySettings) => ScopeDisplaySettings) => void;
  className?: string;
}

export const OscilloscopeScreen: React.FC<OscilloscopeScreenProps> = ({
  rawSignal,
  filteredSignal,
  telemetry,
  settings,
  onUpdateSettings,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render high-performance 2D Canvas phosphor traces & graticule
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background clearing with phosphor persistence simulation
    if (settings.persistence) {
      ctx.fillStyle = 'rgba(5, 10, 16, 0.25)';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#050a10';
      ctx.fillRect(0, 0, width, height);
    }

    // 1. Draw Technical Graticule / Grid (8x8 divisions)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 1;
    const cols = 10;
    const rows = 8;
    const dx = width / cols;
    const dy = height / rows;

    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * dx, 0);
      ctx.lineTo(c * dx, height);
      ctx.stroke();
    }

    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * dy);
      ctx.lineTo(width, r * dy);
      ctx.stroke();
    }

    // Center Crosshair Axis with Sub-ticks
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    const centerX = width / 2;
    const centerY = height / 2;

    // Horizontal center
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Vertical center
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Sub-ticks on center axes
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    const tickLen = 4;
    for (let x = 0; x <= width; x += dx / 5) {
      ctx.beginPath();
      ctx.moveTo(x, centerY - tickLen);
      ctx.lineTo(x, centerY + tickLen);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += dy / 5) {
      ctx.beginPath();
      ctx.moveTo(centerX - tickLen, y);
      ctx.lineTo(centerX + tickLen, y);
      ctx.stroke();
    }

    const N = rawSignal.length;
    const voltsScale = (height / 2) / (3.5 * settings.voltsPerDiv);

    // 2. Render Trace 1: RAW CONTAMINATED INPUT (Amber / Orange)
    if (settings.showRawTrace && rawSignal.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#ff9900';
      ctx.shadowColor = '#ff9900';
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * width;
        const y = centerY - rawSignal[i] * voltsScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 3. Render Trace 2: FILTERED OUTPUT (Electric Cyan)
    if (settings.showFilteredTrace && filteredSignal.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 9;
      ctx.lineWidth = 2.4;
      ctx.beginPath();

      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * width;
        const y = centerY - filteredSignal[i] * voltsScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. On-Screen Reticle Legend
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255, 153, 0, 0.9)';
    ctx.fillText('CH1: RAW IN [AMBER]', 12, 22);

    ctx.fillStyle = 'rgba(0, 240, 255, 0.95)';
    ctx.fillText('CH2: FILTER OUT [CYAN]', 12, 38);

    if (settings.triggerHold) {
      ctx.fillStyle = '#ff3366';
      ctx.fillText('TRIGGER: [FREEZE/HOLD]', width - 150, 22);
    } else {
      ctx.fillStyle = '#00ff88';
      ctx.fillText('TRIGGER: [AUTO / RUN]', width - 150, 22);
    }
  }, [rawSignal, filteredSignal, settings, telemetry]);

  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-3', className)}>
      {/* Top Bar with Channel Controls & Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-ece-cyan animate-pulse" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            DUAL-TRACE DIGITAL OSCILLOSCOPE [SIMULATION]
          </span>
          <span className="font-mono text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            TIME DOMAIN (V vs t)
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, triggerHold: !prev.triggerHold }))}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded border transition-colors',
              settings.triggerHold
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
            )}
            title="Freeze/Run live trace refresh"
          >
            {settings.triggerHold ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{settings.triggerHold ? 'RUN' : 'FREEZE'}</span>
          </button>

          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, showRawTrace: !prev.showRawTrace }))}
            className={clsx(
              'px-2 py-1 rounded border transition-colors',
              settings.showRawTrace
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-400 font-bold'
                : 'bg-white/5 border-white/10 text-slate-500'
            )}
          >
            CH1 (RAW)
          </button>

          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, showFilteredTrace: !prev.showFilteredTrace }))}
            className={clsx(
              'px-2 py-1 rounded border transition-colors',
              settings.showFilteredTrace
                ? 'bg-ece-cyan/20 border-ece-cyan/60 text-ece-cyan font-bold'
                : 'bg-white/5 border-white/10 text-slate-500'
            )}
          >
            CH2 (FILTER)
          </button>

          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, persistence: !prev.persistence }))}
            className={clsx(
              'px-2 py-1 rounded border text-[10px] transition-colors',
              settings.persistence
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            )}
            title="CRT Phosphor Persistence Trail"
          >
            PERSIST
          </button>
        </div>
      </div>

      {/* 2D Canvas Screen with Scanline Overlay */}
      <div className="relative w-full aspect-[16/9] min-h-[260px] bg-[#050a10] rounded overflow-hidden border border-ece-cyan/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full object-fill block"
        />
        <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />
      </div>

      {/* Scope Calibration Dials / Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] pt-1">
        {/* Volts per Division */}
        <div className="p-2 bg-black/40 border border-white/5 rounded space-y-1">
          <div className="flex justify-between text-slate-400 text-[10px]">
            <span>VOLTS/DIV</span>
            <span className="text-ece-cyan font-bold">{settings.voltsPerDiv.toFixed(2)} V/div</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.05"
            value={settings.voltsPerDiv}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdateSettings((prev) => ({ ...prev, voltsPerDiv: val }));
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan"
          />
        </div>

        {/* Timebase */}
        <div className="p-2 bg-black/40 border border-white/5 rounded space-y-1">
          <div className="flex justify-between text-slate-400 text-[10px]">
            <span>TIMEBASE</span>
            <span className="text-ece-cyan font-bold">{settings.timebase} ms/div</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={settings.timebase}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onUpdateSettings((prev) => ({ ...prev, timebase: val }));
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan"
          />
        </div>

        {/* Telemetry: Input vs Output Vpp */}
        <div className="p-2 bg-black/40 border border-white/5 rounded flex flex-col justify-between text-[10px]">
          <span className="text-slate-500 uppercase flex items-center justify-between">
            <span>VOLTAGE METRICS</span>
            <span className="text-[8px] text-amber-500/80">[SIMULATION]</span>
          </span>
          <div className="flex justify-between items-center text-xs">
            <span className="text-amber-400">IN: {telemetry.inputVpp}Vpp</span>
            <span className="text-ece-cyan font-bold">OUT: {telemetry.outputVpp}Vpp</span>
          </div>
        </div>

        {/* Telemetry: Attenuation & SNR */}
        <div className="p-2 bg-black/40 border border-white/5 rounded flex flex-col justify-between text-[10px]">
          <span className="text-slate-500 uppercase flex items-center justify-between">
            <span>CHANNEL QUALITY</span>
            <span className="text-[8px] text-emerald-500/80">[SIMULATION]</span>
          </span>
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-400 font-bold">SNR: {telemetry.snrDb} dB</span>
            <span className="text-purple-300">ATTN: -{telemetry.attenuationDb} dB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
