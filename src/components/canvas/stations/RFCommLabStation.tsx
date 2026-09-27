import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StationBaseDesk } from './StationBaseDesk';
import { useSystem } from '../../../context/SystemContext';

export const RFCommLabStation: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const { inspectObject, triggerAudio } = useSystem();
  const [hovered, setHovered] = useState<string | null>(null);
  const [burstActive, setBurstActive] = useState(false);
  const burstTimerRef = useRef(0);

  const rfRingsRef = useRef<THREE.Group>(null);

  // Animate 3D electromagnetic waveform surrounding the antenna
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (rfRingsRef.current) {
      rfRingsRef.current.children.forEach((child, i) => {
        const offset = (time * (burstActive ? 2.5 : 1.2) + i * 0.25) % 1;
        const scale = 0.5 + offset * 2.2;
        child.scale.set(scale, scale, scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - offset) * (burstActive ? 0.9 : 0.45));
        }
      });
    }

    if (burstActive) {
      burstTimerRef.current += delta;
      if (burstTimerRef.current > 1.5) {
        setBurstActive(false);
        burstTimerRef.current = 0;
      }
    }
  });

  const triggerRfBurst = () => {
    triggerAudio('pulse');
    setBurstActive(true);
    burstTimerRef.current = 0;
  };

  return (
    <StationBaseDesk
      stationId="rf"
      stationNumber="03"
      name="RF / COMM LAB"
      category="Electromagnetics & Op-Amps"
      isSelected={isSelected}
    >
      {/* 1. RF Sniffer Antenna & Reactive 3D EM Waveforms */}
      <group
        position={[-0.3, 0.45, 0]}
        onClick={(e) => {
          e.stopPropagation();
          triggerRfBurst();
          inspectObject('rf-antenna');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered('antenna');
          triggerAudio('click');
        }}
        onPointerOut={() => setHovered(null)}
      >
        {/* Brass / Copper Antenna Mast */}
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Base Coaxial Connector */}
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>

        {/* 3D Reactive Electromagnetic Wave Spheres */}
        <group ref={rfRingsRef} position={[0, 0.1, 0]}>
          {[0, 1, 2, 3].map((idx) => (
            <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.5, 0.015, 12, 32]} />
              <meshBasicMaterial
                color={burstActive ? '#ff7b00' : '#00f0ff'}
                transparent
                opacity={0.4}
              />
            </mesh>
          ))}
        </group>

        {hovered === 'antenna' && (
          <Html position={[0, 0.55, 0]} center distanceFactor={8} pointerEvents="none">
            <div className="px-2.5 py-1.5 bg-black/90 border border-ece-orange rounded shadow-[0_0_15px_#ff7b00] font-mono text-[9px] text-left leading-tight whitespace-nowrap">
              <span className="font-bold text-ece-orange block text-[10px]">RF SENSOR // ANTENNA</span>
              <span className="text-white block">900 MHz – 2.4 GHz Sniffer</span>
              <span className="text-slate-400 block">Status: {burstActive ? 'BURST DETECTED' : 'MONITORING'}</span>
              <span className="text-emerald-400 text-[8px] block mt-0.5 font-bold">CLICK TO PULSE & INSPECT</span>
            </div>
          </Html>
        )}
      </group>

      {/* 2. LM358 Signal Conditioning Circuit */}
      <group
        position={[0.5, 0.06, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('lm358-opamp');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered('lm358');
          triggerAudio('click');
        }}
        onPointerOut={() => setHovered(null)}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.03, 0.45]} />
          <meshStandardMaterial color="#0e1726" roughness={0.4} />
        </mesh>
        {/* LM358 SOP-8 Package */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.22, 0.04, 0.18]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Indicator LED */}
        <mesh position={[0.18, 0.04, 0.1]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color={burstActive ? '#ff0055' : '#00ff88'} />
        </mesh>

        {hovered === 'lm358' && (
          <Html position={[0, 0.35, 0]} center distanceFactor={8} pointerEvents="none">
            <div className="px-2.5 py-1.5 bg-black/90 border border-ece-cyan rounded shadow-[0_0_15px_#00f0ff] font-mono text-[9px] text-left leading-tight whitespace-nowrap">
              <span className="font-bold text-ece-cyan block text-[10px]">LM358 DUAL OP-AMP</span>
              <span className="text-white block">High Gain • Envelope Detection</span>
              <span className="text-slate-400 block">Conditioning: ACTIVE [SIMULATION]</span>
            </div>
          </Html>
        )}
      </group>

      {/* 3. RF Activity Detection Pipeline HUD Banner */}
      <Html position={[0, 0.95, -0.4]} center distanceFactor={10} pointerEvents="none">
        <div className="px-3 py-1.5 bg-black/90 border border-ece-orange/40 rounded tech-corner-cut backdrop-blur-md shadow-[0_0_15px_rgba(255,123,0,0.2)] font-mono text-[9px] text-center select-none whitespace-nowrap">
          <span className="text-ece-orange font-bold block">RF ACTIVITY DETECTION</span>
          <span className="text-slate-300 block text-[8px] mt-0.5">
            SIGNAL → LC TANK → LM358 OP-AMP → ARDUINO ADC
          </span>
        </div>
      </Html>
    </StationBaseDesk>
  );
};
