// ==============================================================================
// HEMASHREE // ECE SYSTEM - MASTER SIGNAL / DSP LAB EXPERIENCE
// Interactive Engineering Suite: Signal Generator, Noise Injection, FIR/IIR Filter,
// Dual-Trace Oscilloscope, FFT Spectrum, Frequency Response, Z-Plane, Audio Synth.
// ==============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSystem } from '../../context/SystemContext';
import { 
  DspSignalParams, 
  DspFilterParams, 
  ScopeDisplaySettings, 
  DspPreset 
} from '../../types/dsp';
import { DSP_PRESETS } from '../../data/dspLab';
import { generateWaveformData } from './DspMath';

import { OscilloscopeScreen } from './OscilloscopeScreen';
import { SpectrumAnalyzer } from './SpectrumAnalyzer';
import { FrequencyResponseCurve } from './FrequencyResponseCurve';
import { PoleZeroPlane } from './PoleZeroPlane';
import { SignalGeneratorPanel } from './SignalGeneratorPanel';
import { NoiseInjectionPanel } from './NoiseInjectionPanel';
import { FilterControlsPanel } from './FilterControlsPanel';
import { AudioSynthMonitor } from './AudioSynthMonitor';
import { Dsp3DRibbon } from './Dsp3DRibbon';
import { DspPresetsBar } from './DspPresetsBar';
import { DspExplainCard, DspExplainHeaderBanner } from './DspExplainOverlay';

import { 
  Activity, 
  X, 
  ExternalLink, 
  Box
} from 'lucide-react';
import clsx from 'clsx';

interface DspExperienceProps {
  onClose?: () => void;
  isInline?: boolean;
}

export const DspExperience: React.FC<DspExperienceProps> = ({ onClose, isInline = false }) => {
  const { 
    triggerAudio, 
    setSelectedProjectId, 
    performanceMode,
    reducedMotion 
  } = useSystem();

  // Active Signal & Filter State
  const [signalParams, setSignalParams] = useState<DspSignalParams>({
    waveform: 'sine',
    frequency: 6,
    amplitude: 1.2,
    phase: 0,
    noiseLevel: 0.5,
    noiseType: 'gaussian',
  });

  const [filterParams, setFilterParams] = useState<DspFilterParams>({
    type: 'fir',
    filterClass: 'lowpass',
    cutoffFreq: 12,
    order: 4,
    window: 'hamming',
    damping: 0.707,
  });

  const [scopeSettings, setScopeSettings] = useState<ScopeDisplaySettings>({
    timebase: 15,
    voltsPerDiv: 0.6,
    showRawTrace: true,
    showFilteredTrace: true,
    triggerHold: false,
    persistence: false,
  });

  const [activePresetId, setActivePresetId] = useState<string | null>('preset-audio-vocal');
  const [isExplainMode, setIsExplainMode] = useState<boolean>(false);
  const [show3DCanvas, setShow3DCanvas] = useState<boolean>(true);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  // Time evolution loop for live oscilloscope animation
  useEffect(() => {
    if (scopeSettings.triggerHold) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Advance time offset based on frequency
      setTimeOffset((prev) => prev + dt * 1.5);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [scopeSettings.triggerHold]);

  // Compute live waveform data and telemetry
  const { rawSignal, filteredSignal, telemetry } = useMemo(() => {
    return generateWaveformData(
      signalParams,
      filterParams,
      256,
      200,
      timeOffset
    );
  }, [signalParams, filterParams, timeOffset]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      const key = e.key.toLowerCase();
      if (key === 'escape') {
        if (onClose) {
          triggerAudio('click');
          onClose();
        }
      } else if (key === 'e') {
        triggerAudio('toggle');
        setIsExplainMode((prev) => !prev);
      } else if (key === 'g') {
        triggerAudio('click');
        // cycle waveform
        setSignalParams((prev) => ({
          ...prev,
          waveform: prev.waveform === 'sine' ? 'square' : prev.waveform === 'square' ? 'triangle' : 'sine',
        }));
      } else if (key === 'f') {
        triggerAudio('click');
        // cycle filter
        setFilterParams((prev) => ({
          ...prev,
          type: prev.type === 'fir' ? 'iir' : prev.type === 'iir' ? 'bypass' : 'fir',
        }));
      } else if (key === 'n') {
        triggerAudio('click');
        // toggle noise 0% / 60%
        setSignalParams((prev) => ({
          ...prev,
          noiseLevel: prev.noiseLevel === 0 ? 0.6 : 0,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, triggerAudio]);

  const handleSelectPreset = useCallback((preset: DspPreset) => {
    triggerAudio('click');
    setActivePresetId(preset.id);
    setSignalParams(preset.signal);
    setFilterParams(preset.filter);
  }, [triggerAudio]);

  const handleOpenProjectModal = () => {
    triggerAudio('boot');
    if (onClose) onClose();
    setSelectedProjectId('digital-audio-filter-dsp');
  };

  return (
    <div
      className={clsx(
        'w-full text-white',
        isInline ? 'relative' : 'fixed inset-0 z-50 overflow-y-auto bg-ece-bg p-4 sm:p-8 backdrop-blur-xl'
      )}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-ece-cyan tracking-widest">[SECTION 05 // SIGNALS]</span>
              <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                [SIMULATION]
              </span>
            </div>
            <h2 className="font-tech text-3xl sm:text-4xl font-extrabold uppercase text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-ece-cyan" />
              SIGNAL // DSP LABORATORY
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-xl">
              Real-time procedural digital signal processing simulation modeling FIR/IIR filtering and spectral noise attenuation.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAdvancedOpen((prev) => !prev)}
              className={clsx(
                'px-4 py-2 font-mono text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5',
                isAdvancedOpen
                  ? 'bg-ece-cyan text-black border-ece-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              )}
            >
              <span>{isAdvancedOpen ? 'HIDE ADVANCED' : 'ADVANCED CONTROLS →'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full font-mono text-xs border border-white/20 transition-colors"
                title="Return [ESC]"
              >
                <X className="w-3.5 h-3.5" />
                <span>CLOSE [ESC]</span>
              </button>
            )}
          </div>
        </div>

        {/* Large Oscilloscope Display */}
        <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.7)] p-4 sm:p-6">
          <OscilloscopeScreen
            rawSignal={rawSignal}
            filteredSignal={filteredSignal}
            telemetry={telemetry}
            settings={scopeSettings}
            onUpdateSettings={setScopeSettings}
          />
        </div>

        {/* Compact Default Control Row */}
        <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          {/* Waveform Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">WAVEFORM:</span>
            <div className="flex gap-1">
              {(['sine', 'square', 'triangle'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setSignalParams((prev) => ({ ...prev, waveform: w }))}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg uppercase text-[10px] transition-all',
                    signalParams.waveform === w
                      ? 'bg-ece-cyan text-black font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Noise Injection Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">NOISE:</span>
            <div className="flex gap-1">
              {[
                { type: 'none', label: 'OFF', level: 0 },
                { type: 'gaussian', label: 'GAUSSIAN', level: 0.5 },
                { type: '50hz', label: '50HZ', level: 0.6 },
                { type: 'rf-spike', label: 'RF SPIKE', level: 0.8 },
              ].map((n) => {
                const isActive = (n.type === 'none' && signalParams.noiseLevel === 0) || (signalParams.noiseType === n.type && signalParams.noiseLevel > 0);
                return (
                  <button
                    key={n.type}
                    onClick={() => setSignalParams((prev) => ({
                      ...prev,
                      noiseType: n.type === 'none' ? prev.noiseType : (n.type as any),
                      noiseLevel: n.level
                    }))}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg uppercase text-[10px] transition-all',
                      isActive
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    )}
                  >
                    {n.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">FILTER:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setFilterParams((prev) => ({ ...prev, type: 'fir' }))}
                className={clsx(
                  'px-2.5 py-1 rounded-lg uppercase text-[10px] transition-all',
                  filterParams.type === 'fir'
                    ? 'bg-emerald-400 text-black font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                )}
              >
                FIR LOWPASS
              </button>
              <button
                onClick={() => setFilterParams((prev) => ({ ...prev, type: 'iir' }))}
                className={clsx(
                  'px-2.5 py-1 rounded-lg uppercase text-[10px] transition-all',
                  filterParams.type === 'iir'
                    ? 'bg-emerald-400 text-black font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                )}
              >
                IIR BUTTERWORTH
              </button>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure: Advanced Engineering Controls */}
        {isAdvancedOpen && (
          <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
            {/* Presets Bar */}
            <DspPresetsBar
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* Grid: Spectrum, Bode, and Z-Plane */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FFT Spectrum Analyzer */}
              <div className="p-5 bg-black/60 border border-white/10 rounded-2xl">
                <SpectrumAnalyzer
                  rawSignal={rawSignal}
                  filteredSignal={filteredSignal}
                  fundamentalFreq={signalParams.frequency}
                />
              </div>

              {/* Bode Frequency Response Curve */}
              <div className="p-5 bg-black/60 border border-white/10 rounded-2xl">
                <FrequencyResponseCurve filterParams={filterParams} />
              </div>
            </div>

            {/* Parameter Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-black/60 border border-white/10 rounded-2xl">
                <FilterControlsPanel
                  filterParams={filterParams}
                  onUpdateFilter={setFilterParams}
                />
              </div>

              <div className="p-5 bg-black/60 border border-white/10 rounded-2xl">
                <SignalGeneratorPanel
                  signalParams={signalParams}
                  onUpdateSignal={setSignalParams}
                />
              </div>

              <div className="p-5 bg-black/60 border border-white/10 rounded-2xl">
                <PoleZeroPlane
                  filterParams={filterParams}
                  onUpdateFilter={setFilterParams}
                />
              </div>
            </div>

            {/* Synthetic Audio Monitor */}
            <AudioSynthMonitor
              signalParams={signalParams}
              filterParams={filterParams}
            />
          </div>
        )}

      </div>
    </div>
  );
};
