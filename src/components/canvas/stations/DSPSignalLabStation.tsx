import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StationBaseDesk } from './StationBaseDesk';
import { useSystem } from '../../../context/SystemContext';

export const DSPSignalLabStation: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const { 
    dspFilterMode, 
    setDspFilterMode, 
    inspectObject, 
    triggerAudio 
  } = useSystem();

  const waveLineRef = useRef<THREE.Line>(null);

  // Generate waveform buffer geometry
  const { baseGeom, sampleCount } = useMemo(() => {
    const count = 80;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1) - 0.5) * 0.95;
      points.push(new THREE.Vector3(x, 0, 0.22));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return { baseGeom: geom, sampleCount: count };
  }, []);

  // Animate oscilloscope waveform based on DSP filter mode
  useFrame((state) => {
    if (waveLineRef.current) {
      const time = state.clock.getElapsedTime();
      const posAttr = waveLineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < sampleCount; i++) {
        const x = (i / (sampleCount - 1) - 0.5) * 0.95;
        const normalizedX = (i / sampleCount) * Math.PI * 4;

        let y = 0;
        if (dspFilterMode === 'RAW') {
          // Fundamental + High-Frequency Harmonic Noise + Spikes
          const fundamental = Math.sin(normalizedX - time * 3) * 0.16;
          const noise1 = Math.sin(normalizedX * 6 + time * 8) * 0.05;
          const noise2 = Math.cos(normalizedX * 13 - time * 12) * 0.035;
          y = fundamental + noise1 + noise2;
        } else if (dspFilterMode === 'FIR') {
          // Clean low-pass Butterworth filtered sinusoid with subtle phase lag
          y = Math.sin(normalizedX - time * 3 - 0.2) * 0.18;
        } else if (dspFilterMode === 'IIR') {
          // Sharp-cutoff response with steeper slope and resonance peak
          y = (Math.sin(normalizedX - time * 3) + 0.15 * Math.sin((normalizedX - time * 3) * 3)) * 0.16;
        }

        posArray[i * 3 + 1] = y;
      }
      posAttr.needsUpdate = true;
    }
  });

  const handleModeChange = (mode: 'RAW' | 'FIR' | 'IIR') => {
    triggerAudio('click');
    setDspFilterMode(mode);
  };

  const getFilterColor = () => {
    if (dspFilterMode === 'RAW') return '#ff3366';
    if (dspFilterMode === 'FIR') return '#00f0ff';
    return '#00ff88';
  };

  return (
    <StationBaseDesk
      stationId="dsp"
      stationNumber="04"
      name="DSP / SIGNAL LAB"
      category="Waveforms & Filters"
      isSelected={isSelected}
    >
      {/* 1. 3D Digital Storage Oscilloscope Body */}
      <group
        position={[0, 0.25, 0]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('oscilloscope');
        }}
      >
        {/* Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.7, 0.45]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Display Bezel */}
        <mesh position={[-0.15, 0.05, 0.23]}>
          <planeGeometry args={[0.9, 0.52]} />
          <meshBasicMaterial color="#030712" />
        </mesh>

        {/* CRT / LCD Phosphor Grid */}
        <mesh position={[-0.15, 0.05, 0.231]}>
          <planeGeometry args={[0.88, 0.5]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>

        {/* Oscilloscope Waveform Line */}
        <group position={[-0.15, 0.05, 0.015]}>
          <primitive
            object={new THREE.Line(baseGeom, new THREE.LineBasicMaterial({
              color: getFilterColor(),
              linewidth: 2,
            }))}
            ref={waveLineRef}
          />
        </group>

        {/* Front Panel Knobs & BNC Inputs */}
        <group position={[0.42, 0.05, 0.23]}>
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.03, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.03, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        </group>

        {/* Interactive Filter Control Panel (Html overlay directly above screen) */}
        <Html position={[0, 0.65, 0]} center distanceFactor={8} pointerEvents="auto">
          <div className="p-2 bg-black/95 border border-ece-cyan/50 rounded tech-corner-cut shadow-[0_0_20px_rgba(0,240,255,0.3)] font-mono text-[9px] text-center select-none whitespace-nowrap">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1 mb-1.5">
              <span className="text-white font-bold">DIGITAL FILTER [SIMULATION]</span>
              <span className="text-ece-cyan font-bold">{dspFilterMode}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModeChange('RAW');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  dspFilterMode === 'RAW'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                INPUT (NOISY)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModeChange('FIR');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  dspFilterMode === 'FIR'
                    ? 'bg-ece-cyan text-black font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                FIR FILTER
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModeChange('IIR');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  dspFilterMode === 'IIR'
                    ? 'bg-emerald-400 text-black font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                IIR FILTER
              </button>
            </div>
          </div>
        </Html>
      </group>
    </StationBaseDesk>
  );
};
