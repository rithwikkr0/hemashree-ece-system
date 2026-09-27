// ==============================================================================
// HEMASHREE // ECE SYSTEM - WEB AUDIO API SYNTHESIZER MONITOR
// Real-time audio synthesis: fundamental oscillator, white noise generator,
// and hardware-modeled Biquad filter node.
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { DspSignalParams, DspFilterParams } from '../../types/dsp';
import { Volume2, VolumeX, Headphones, Info } from 'lucide-react';
import clsx from 'clsx';

interface AudioSynthMonitorProps {
  signalParams: DspSignalParams;
  filterParams: DspFilterParams;
  className?: string;
}

export const AudioSynthMonitor: React.FC<AudioSynthMonitorProps> = ({
  signalParams,
  filterParams,
  className,
}) => {
  const [isAudible, setIsAudible] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.2);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const oscGainRef = useRef<GainNode | null>(null);
  const biquadRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize or update Web Audio Nodes
  useEffect(() => {
    if (!isAudible) {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.suspend();
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // Biquad Filter Node
        const biquad = ctx.createBiquadFilter();
        biquad.connect(masterGain);
        biquadRef.current = biquad;

        // Tone Oscillator
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(biquad);
        osc.start();
        oscNodeRef.current = osc;
        oscGainRef.current = oscGain;

        // White Noise Buffer Source
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const noiseGain = ctx.createGain();
        whiteNoise.connect(noiseGain);
        noiseGain.connect(biquad);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
        noiseGainRef.current = noiseGain;
      } else {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      }

      // Update parameters in real time
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // 1. Oscillator Waveform & Scaled Audible Pitch (100 Hz - 600 Hz)
      if (oscNodeRef.current) {
        const scaledPitch = 120 + signalParams.frequency * 14;
        oscNodeRef.current.frequency.setValueAtTime(scaledPitch, ctx.currentTime);
        oscNodeRef.current.type = signalParams.waveform === 'square' ? 'square' :
                                  signalParams.waveform === 'triangle' ? 'triangle' : 'sine';
      }

      // 2. Fundamental & Noise Mix Gains
      if (oscGainRef.current) {
        oscGainRef.current.gain.setValueAtTime(signalParams.amplitude * 0.4, ctx.currentTime);
      }
      if (noiseGainRef.current) {
        noiseGainRef.current.gain.setValueAtTime(signalParams.noiseLevel * 0.25, ctx.currentTime);
      }

      // 3. Filter cutoff & type
      if (biquadRef.current) {
        if (filterParams.type === 'bypass') {
          biquadRef.current.type = 'allpass';
        } else if (filterParams.filterClass === 'lowpass') {
          biquadRef.current.type = 'lowpass';
          // Scale 2-35 Hz to audible acoustic spectrum 200 Hz to 3500 Hz
          const audibleCutoff = 200 + filterParams.cutoffFreq * 110;
          biquadRef.current.frequency.setValueAtTime(audibleCutoff, ctx.currentTime);
          biquadRef.current.Q.setValueAtTime(filterParams.damping * 4, ctx.currentTime);
        } else {
          biquadRef.current.type = 'highpass';
          const audibleCutoff = 200 + filterParams.cutoffFreq * 110;
          biquadRef.current.frequency.setValueAtTime(audibleCutoff, ctx.currentTime);
          biquadRef.current.Q.setValueAtTime(filterParams.damping * 4, ctx.currentTime);
        }
      }

      if (masterGainRef.current) {
        masterGainRef.current.gain.setValueAtTime(volume, ctx.currentTime);
      }
    } catch (e) {
      console.warn('Web Audio synthesis initialisation notice:', e);
    }

    return () => {
      // Keep context alive across quick re-renders, suspend when unmounted
    };
  }, [isAudible, signalParams, filterParams, volume]);

  const toggleAudible = () => {
    setIsAudible((prev) => !prev);
  };

  return (
    <div className={clsx('border border-ece-cyan/30 rounded tech-corner-cut p-3 bg-black/80 flex flex-col space-y-2', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-ece-cyan" />
          <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
            SYNTHETIC AUDIO MONITOR
          </span>
        </div>

        <button
          onClick={toggleAudible}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1 rounded border font-mono text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]',
            isAudible
              ? 'bg-ece-cyan/20 border-ece-cyan text-ece-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          )}
        >
          {isAudible ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isAudible ? 'AUDIO ONLINE' : 'MUTED (OFF)'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 font-mono text-[10px] pt-1">
        <span className="text-slate-400">OUTPUT VOLUME:</span>
        <input
          type="range"
          min="0.05"
          max="0.5"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          disabled={!isAudible}
          className="w-36 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ece-cyan disabled:opacity-30"
        />
        <span className="text-ece-cyan font-bold">{Math.round(volume * 200)}%</span>
      </div>

      <div className="text-[10px] font-sans text-slate-400 flex items-start gap-1.5 pt-1">
        <Info className="w-3 h-3 text-ece-cyan shrink-0 mt-0.5" />
        <span>
          Acoustic demonstration: Turn on audio to hear how the low-pass filter eliminates harsh noise hiss while preserving the pure musical tone.
        </span>
      </div>
    </div>
  );
};
