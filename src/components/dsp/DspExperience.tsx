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
        'w-full flex flex-col',
        isInline
          ? 'relative rounded-lg p-2 sm:p-4'
          : 'fixed inset-0 z-50 overflow-y-auto bg-[#05080c]/98 backdrop-blur-2xl p-4 md:p-8'
      )}
    >
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-ece-cyan tracking-widest">[SYSTEM SECTION // 05]</span>
              <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                SIMULATION & ILLUSTRATIVE MODEL
              </span>
            </div>
            <h1 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white flex items-center gap-2 pt-1">
              <Activity className="w-6 h-6 text-ece-cyan" />
              SIGNAL // DSP LABORATORY
            </h1>
            <p className="font-sans text-xs text-slate-400 pt-0.5">
              Verified Coursework: Signals & Systems, Digital Signal Processing • Alliance University (2024–2028)
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenProjectModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded font-mono text-xs border border-white/20 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              title="Launch verified Digital Audio Filter project experience from Phase 4"
            >
              <ExternalLink className="w-3.5 h-3.5 text-ece-cyan" />
              <span>VIEW PROJECT (DIGITAL AUDIO FILTER)</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-ece-cyan/20 hover:bg-ece-cyan/30 text-ece-cyan rounded font-mono text-xs border border-ece-cyan transition-colors"
                title="Return to ECE System Overview [ESC]"
              >
                <X className="w-4 h-4" />
                <span>RETURN TO LAB [ESC]</span>
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Quick Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-black/60 border border-white/10 rounded font-mono text-[10px] text-slate-400">
          <span className="text-white font-bold">KEYBOARD HOTKEYS:</span>
          <div className="flex flex-wrap items-center gap-2.5">
            <span><kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">G</kbd> Waveform</span>
            <span><kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">N</kbd> Noise Toggle</span>
            <span><kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">F</kbd> Filter Mode</span>
            <span><kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">E</kbd> Explain Mode</span>
            {onClose && <span><kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">ESC</kbd> Close</span>}
          </div>
          <button
            onClick={() => setShow3DCanvas((prev) => !prev)}
            className="flex items-center gap-1 text-ece-cyan hover:underline"
          >
            <Box className="w-3 h-3" />
            <span>{show3DCanvas ? 'HIDE 3D RIBBON' : 'SHOW 3D RIBBON'}</span>
          </button>
        </div>

        {/* Explain Mode Banner Toggle */}
        <DspExplainHeaderBanner
          isExplainMode={isExplainMode}
          onToggleExplainMode={() => setIsExplainMode((prev) => !prev)}
        />

        {/* Presets Bar */}
        <DspPresetsBar
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* 3D Waveform Ribbon in Three.js Canvas (Toggleable) */}
        {show3DCanvas && !reducedMotion && (
          <div className="relative w-full h-44 sm:h-56 bg-black/90 border border-ece-cyan/30 rounded tech-corner-cut overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.12)]">
            <div className="absolute top-2 left-3 z-10 font-mono text-[10px] text-ece-cyan flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-ece-cyan animate-pulse" />
              <span>SPATIAL 3D SIGNAL PROPAGATION & FILTER PLANE</span>
            </div>
            <Canvas
              camera={{ position: [0, 2.8, 5.5], fov: 45 }}
              dpr={performanceMode === 'high' ? [1, 1.5] : [1, 1]}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[3, 4, 3]} intensity={1.2} color="#00f0ff" />
              <Dsp3DRibbon signalParams={signalParams} filterParams={filterParams} />
            </Canvas>
          </div>
        )}

        {/* Main Grid: Visualizers on Left, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Oscilloscope & Spectrum Analyzer */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Dual-Trace Oscilloscope */}
            <OscilloscopeScreen
              rawSignal={rawSignal}
              filteredSignal={filteredSignal}
              telemetry={telemetry}
              settings={scopeSettings}
              onUpdateSettings={setScopeSettings}
            />

            {/* Recruiter Explain Card for Scope */}
            {isExplainMode && <DspExplainCard conceptKey="signalGenerator" />}

            {/* FFT Spectrum Analyzer */}
            <SpectrumAnalyzer
              rawSignal={rawSignal}
              filteredSignal={filteredSignal}
              fundamentalFreq={signalParams.frequency}
            />

            {/* Recruiter Explain Card for Spectrum */}
            {isExplainMode && <DspExplainCard conceptKey="spectrumAnalyzer" />}

            {/* Synthetic Audio Monitor */}
            <AudioSynthMonitor
              signalParams={signalParams}
              filterParams={filterParams}
            />

          </div>

          {/* Right Column (5 cols): Parameter Controls, Frequency Response & Z-Plane */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Filter Topology Controls */}
            <FilterControlsPanel
              filterParams={filterParams}
              onUpdateFilter={setFilterParams}
            />

            {/* Recruiter Explain Card for Filters */}
            {isExplainMode && (
              <DspExplainCard
                conceptKey={filterParams.type === 'fir' ? 'firFilter' : 'iirFilter'}
              />
            )}

            {/* Signal Generator Controls */}
            <SignalGeneratorPanel
              signalParams={signalParams}
              onUpdateSignal={setSignalParams}
            />

            {/* Noise Injection Engine */}
            <NoiseInjectionPanel
              signalParams={signalParams}
              onUpdateSignal={setSignalParams}
              snrDb={telemetry.snrDb}
            />

            {/* Recruiter Explain Card for Noise */}
            {isExplainMode && <DspExplainCard conceptKey="noiseInjection" />}

            {/* Bode Magnitude Frequency Response Curve */}
            <FrequencyResponseCurve filterParams={filterParams} />

            {/* Recruiter Explain Card for Bode */}
            {isExplainMode && <DspExplainCard conceptKey="frequencyResponse" />}

            {/* Complex Z-Plane Pole-Zero Stability */}
            <PoleZeroPlane
              filterParams={filterParams}
              onUpdateFilter={setFilterParams}
            />

            {/* Recruiter Explain Card for Z-Plane */}
            {isExplainMode && <DspExplainCard conceptKey="poleZeroPlane" />}

          </div>

        </div>

        {/* Academic Source of Truth Disclaimer */}
        <div className="p-4 bg-black/60 border border-white/10 rounded font-mono text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white font-bold">SOURCE OF TRUTH:</span>
            <span>
              Real-time procedural simulation modeling MATLAB Signal Processing Toolbox algorithms, discrete convolution, and difference equations.
            </span>
          </div>
          <span className="text-slate-500 text-[10px]">
            HEMASHREE B M • B.TECH ECE • 2024–2028
          </span>
        </div>

      </div>
    </div>
  );
};
