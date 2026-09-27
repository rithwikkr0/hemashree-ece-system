import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Sliders, Activity, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

export const DigitalAudioFilterScene: React.FC = () => {
  const { triggerAudio, setSelectedProjectId } = useSystem();
  const [filterType, setFilterType] = useState<'RAW' | 'FIR' | 'IIR'>('FIR');
  const [domainView, setDomainView] = useState<'TIME' | 'FREQUENCY'>('TIME');

  const waveLineRef = useRef<THREE.Line>(null);
  const fftBarsRef = useRef<THREE.Group>(null);

  const { waveGeom, count } = useMemo(() => {
    const num = 100;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < num; i++) {
      const x = (i / (num - 1) - 0.5) * 2.8;
      pts.push(new THREE.Vector3(x, 0, 0));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    return { waveGeom: geom, count: num };
  }, []);

  // Animate dynamic waveform in time or frequency domain
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (waveLineRef.current && domainView === 'TIME') {
      const posAttr = waveLineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 6;
        let y = 0;

        if (filterType === 'RAW') {
          // Fundamental 100 Hz + 1200 Hz Acoustic Hum + Random High-Freq Spikes
          const fund = Math.sin(theta - time * 4) * 0.45;
          const hum = Math.sin(theta * 7 + time * 10) * 0.18;
          const noise = Math.cos(theta * 17 - time * 18) * 0.09;
          y = fund + hum + noise;
        } else if (filterType === 'FIR') {
          // FIR Butterworth Low-Pass (Smooth fundamental sinusoid with subtle delay)
          y = Math.sin(theta - time * 4 - 0.3) * 0.52;
        } else if (filterType === 'IIR') {
          // IIR Chebyshev Filter (Steep roll-off with minor passband ripple)
          y = (Math.sin(theta - time * 4) + 0.08 * Math.sin((theta - time * 4) * 3)) * 0.48;
        }

        arr[i * 3 + 1] = y;
      }
      posAttr.needsUpdate = true;
    }

    if (fftBarsRef.current && domainView === 'FREQUENCY') {
      fftBarsRef.current.children.forEach((bar, idx) => {
        let height = 0.1;
        if (filterType === 'RAW') {
          // Broadband noise across all frequencies
          height = idx === 2 ? 1.2 : 0.2 + Math.sin(time * 6 + idx) * 0.25 + (idx % 3) * 0.2;
        } else if (filterType === 'FIR') {
          // Clean low-pass: high peak at fundamental, zero at higher frequencies
          height = idx === 2 ? 1.4 : Math.max(0.04, 0.4 / (idx + 1));
        } else if (filterType === 'IIR') {
          // Sharp stopband attenuation
          height = idx === 2 ? 1.35 : idx < 4 ? 0.2 : 0.02;
        }
        bar.scale.set(1, height, 1);
      });
    }
  });

  const handleFilterSelect = (type: 'RAW' | 'FIR' | 'IIR') => {
    triggerAudio('click');
    setFilterType(type);
  };

  const getLineColor = () => {
    if (filterType === 'RAW') return '#ff3366';
    if (filterType === 'FIR') return '#00f0ff';
    return '#00ff88';
  };

  return (
    <group position={[0, -0.2, 0]}>
      {/* 1. Large 3D Holographic Oscilloscope Screen */}
      <group position={[0, 0.5, 0]}>
        {/* Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 2.2, 0.5]} />
          <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Display Screen */}
        <mesh position={[0, 0, 0.26]}>
          <planeGeometry args={[3.2, 1.8]} />
          <meshBasicMaterial color="#030712" />
        </mesh>

        {/* CRT Phosphor Grid */}
        <mesh position={[0, 0, 0.262]}>
          <planeGeometry args={[3.15, 1.75]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.15} />
        </mesh>

        {/* Time-Domain Waveform */}
        {domainView === 'TIME' && (
          <group position={[0, 0, 0.27]}>
            <primitive
              object={new THREE.Line(waveGeom, new THREE.LineBasicMaterial({
                color: getLineColor(),
                linewidth: 2.5,
              }))}
              ref={waveLineRef}
            />
          </group>
        )}

        {/* Frequency Domain (FFT Spectrum Bars) */}
        {domainView === 'FREQUENCY' && (
          <group ref={fftBarsRef} position={[-1.2, -0.6, 0.27]}>
            {Array.from({ length: 16 }).map((_, i) => (
              <mesh key={i} position={[i * 0.16, 0, 0]}>
                <boxGeometry args={[0.1, 0.8, 0.02]} />
                <meshBasicMaterial color={getLineColor()} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* 2. Interactive DSP Synthesis Controller HUD */}
      <Html position={[0, -2.4, 0]} center distanceFactor={5.5} pointerEvents="auto">
        <div className="max-w-md w-[380px] p-3.5 bg-black/90 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.2)] font-mono text-xs select-none space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
            <span className="text-ece-cyan font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 animate-pulse" />
              DIGITAL AUDIO FILTER SYNTHESIS
            </span>
            <span className="text-slate-400">
              {domainView} DOMAIN [SIMULATION]
            </span>
          </div>

          {/* Filter Type Toggles */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleFilterSelect('RAW')}
              className={clsx(
                'py-1.5 rounded font-mono text-[10px] font-bold transition-all text-center',
                filterType === 'RAW'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_#ff3366]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              )}
            >
              RAW (NOISY)
            </button>
            <button
              onClick={() => handleFilterSelect('FIR')}
              className={clsx(
                'py-1.5 rounded font-mono text-[10px] font-bold transition-all text-center',
                filterType === 'FIR'
                  ? 'bg-ece-cyan text-black shadow-[0_0_12px_#00f0ff]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              )}
            >
              FIR BUTTERWORTH
            </button>
            <button
              onClick={() => handleFilterSelect('IIR')}
              className={clsx(
                'py-1.5 rounded font-mono text-[10px] font-bold transition-all text-center',
                filterType === 'IIR'
                  ? 'bg-emerald-400 text-black shadow-[0_0_12px_#00ff88]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              )}
            >
              IIR CHEBYSHEV
            </button>
          </div>

          {/* Domain View Switcher */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
            <span className="text-slate-400">SPECTRAL ANALYSIS:</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  triggerAudio('click');
                  setDomainView('TIME');
                }}
                className={clsx(
                  'px-2 py-0.5 rounded text-[9px] font-bold',
                  domainView === 'TIME' ? 'bg-white/20 text-white' : 'text-slate-500 hover:text-white'
                )}
              >
                TIME DOMAIN
              </button>
              <button
                onClick={() => {
                  triggerAudio('click');
                  setDomainView('FREQUENCY');
                }}
                className={clsx(
                  'px-2 py-0.5 rounded text-[9px] font-bold',
                  domainView === 'FREQUENCY' ? 'bg-ece-cyan/30 text-ece-cyan' : 'text-slate-500 hover:text-white'
                )}
              >
                FFT SPECTRUM
              </button>
            </div>
          </div>

          {/* Cross-Link to Complete DSP Lab (Phase 5) */}
          <button
            onClick={() => {
              triggerAudio('boot');
              setSelectedProjectId(null);
              setTimeout(() => {
                const el = document.getElementById('signals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            className="w-full mt-1.5 py-1 px-2 bg-ece-cyan/20 hover:bg-ece-cyan/30 border border-ece-cyan/50 text-ece-cyan rounded text-[9px] font-mono font-bold transition-colors flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            <span>OPEN DEDICATED DSP LAB SUITE →</span>
          </button>
        </div>
      </Html>
    </group>
  );
};
