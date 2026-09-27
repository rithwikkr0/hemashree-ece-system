import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Radio, Search, AlertCircle, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

export const RfActivityDetectionScene: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [scanning, setScanning] = useState(false);
  const [rfLevel, setRfLevel] = useState(24);

  const emWaveRef = useRef<THREE.Group>(null);

  // Animate RF electromagnetic waveform pulses
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (emWaveRef.current) {
      emWaveRef.current.children.forEach((ring, idx) => {
        const offset = (time * (scanning ? 3.0 : 1.0) + idx * 0.25) % 1;
        const scale = 0.4 + offset * 2.5;
        ring.scale.set(scale, scale, scale);
        const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - offset) * (scanning ? 0.9 : 0.35));
        }
      });
    }
  });

  const triggerScan = () => {
    triggerAudio('scan');
    setScanning(true);
    setRfLevel(88); // Spike detected
    setTimeout(() => {
      setScanning(false);
      setRfLevel(32);
    }, 2500);
  };

  const isAlert = rfLevel > 60;

  return (
    <group position={[0, -0.3, 0]}>
      {/* 1. RF Sniffer Antenna Assembly */}
      <group position={[0, 0.4, 0]}>
        {/* Brass Antenna Mast */}
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* LC Tank Inductor Coil */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </mesh>

        {/* 3D Expanding Electromagnetic Wave Toruses */}
        <group ref={emWaveRef} position={[0, 0.2, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.6, 0.015, 12, 32]} />
              <meshBasicMaterial
                color={isAlert ? '#ef4444' : '#00f0ff'}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* 2. LM358 Signal Conditioning Circuit & Alert LED */}
      <group position={[1.2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.04, 0.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* LM358 Package */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.25, 0.04, 0.2]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Alert LED Indicator */}
        <mesh position={[0.22, 0.05, 0.15]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial
            color={isAlert ? '#ef4444' : '#10b981'}
          />
        </mesh>
        <Html position={[0, 0.35, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2 py-0.5 bg-black/90 border border-slate-500 rounded font-mono text-[8px] text-white whitespace-nowrap">
            LM358 AMPLIFIER
          </div>
        </Html>
      </group>

      {/* 3. Interactive RF Scanner HUD */}
      <Html position={[0, -2.4, 0]} center distanceFactor={5.5} pointerEvents="auto">
        <div className="max-w-md w-[360px] p-3.5 bg-black/90 border border-ece-orange/40 rounded tech-corner-cut backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.9)] font-mono text-xs select-none space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
            <span className="text-ece-orange font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              RF SIGNAL VISUALIZATION [SIMULATION]
            </span>
            <span className={clsx('font-bold', isAlert ? 'text-rose-500' : 'text-emerald-400')}>
              {isAlert ? 'TRANSMISSION BURST DETECTED' : 'QUIET SPECTRUM'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-1.5 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block text-[8px]">BANDWIDTH INTERCEPT</span>
              <span className="text-white font-bold">900 MHz – 2.4 GHz</span>
            </div>
            <div className="p-1.5 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block text-[8px]">INDUCED AMPLITUDE</span>
              <span className={clsx('font-bold', isAlert ? 'text-rose-400' : 'text-slate-300')}>
                {rfLevel} mV [SIMULATION]
              </span>
            </div>
          </div>

          <button
            onClick={triggerScan}
            disabled={scanning}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-2 rounded font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]',
              scanning
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-ece-orange text-black hover:bg-amber-400'
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{scanning ? 'SCANNING CELLULAR TRANSMISSION...' : 'SCAN ENVIRONMENT (SIMULATE BURST)'}</span>
          </button>
        </div>
      </Html>
    </group>
  );
};
