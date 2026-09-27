import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StationBaseDesk } from './StationBaseDesk';
import { useSystem } from '../../../context/SystemContext';

export const AIMobileStation: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const { inspectObject, triggerAudio } = useSystem();
  const [hovered, setHovered] = useState(false);
  const phoneGroupRef = useRef<THREE.Group>(null);
  const [activeStep, setActiveStep] = useState(0);

  const PIPELINE_NODES = ['VOICE', 'STT', 'GEMINI', 'SUPABASE', 'SQLITE'];

  // Levitate floating smartphone and cycle pipeline
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (phoneGroupRef.current) {
      phoneGroupRef.current.position.y = 0.45 + Math.sin(time * 1.5) * 0.08;
      phoneGroupRef.current.rotation.y = Math.sin(time * 0.6) * 0.15;
    }
  });

  return (
    <StationBaseDesk
      stationId="ai-mobile"
      stationNumber="06"
      name="AI + MOBILE LAB"
      category="Applied AI & Flutter"
      isSelected={isSelected}
    >
      {/* 1. Floating Smartphone (Lifemate Platform) */}
      <group
        ref={phoneGroupRef}
        position={[0, 0.45, 0]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('lifemate-device');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          triggerAudio('click');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {/* Phone Chassis */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 1.35, 0.05]} />
          <meshStandardMaterial
            color="#090d16"
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Cyan Chamfered Border Glow */}
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[0.66, 1.3]} />
          <meshStandardMaterial
            color="#050a12"
            emissive="#00f0ff"
            emissiveIntensity={hovered ? 0.35 : 0.15}
          />
        </mesh>

        {/* Minimalist Lifemate Screen UI (Html overlay on screen) */}
        <Html position={[0, 0, 0.03]} transform center distanceFactor={2.8} pointerEvents="none">
          <div className="w-[140px] h-[260px] bg-slate-950 p-2 text-white font-sans flex flex-col justify-between select-none rounded border border-ece-cyan/30">
            {/* Header */}
            <div className="flex justify-between items-center text-[7px] font-mono text-slate-400 border-b border-white/10 pb-1">
              <span className="text-ece-cyan font-bold">LIFEMATE v2.0.1</span>
              <span>100% OFF</span>
            </div>

            {/* Voice Waveform Activity */}
            <div className="p-1.5 bg-black/60 rounded border border-white/10 space-y-1">
              <span className="text-[6px] font-mono text-slate-400 block">VOICE INTENT DETECTED</span>
              <div className="flex items-center justify-center gap-0.5 h-6">
                {[12, 22, 16, 26, 18, 10, 20].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-ece-cyan rounded-full animate-pulse"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Citizen Scheme Rule Match */}
            <div className="p-1 bg-ece-cyan/10 border border-ece-cyan/30 rounded text-[6px] font-mono">
              <span className="text-ece-cyan font-bold block">CITIZEN SCHEME</span>
              <span className="text-slate-300">Karnataka Agri Welfare</span>
            </div>

            {/* Offline Local SQLite Transaction */}
            <div className="p-1 bg-white/5 rounded text-[6px] font-mono flex justify-between">
              <span className="text-slate-400">SMS TX PARSED:</span>
              <span className="text-emerald-400 font-bold">₹ 450.00</span>
            </div>

            {/* Action Bar */}
            <div className="text-center font-mono text-[6px] text-slate-500">
              TAP TO EXPAND LIFEMATE
            </div>
          </div>
        </Html>
      </group>

      {/* 2. Animated Pipeline Ribbon Banner */}
      <Html position={[0, 1.1, -0.3]} center distanceFactor={10} pointerEvents="none">
        <div className="px-3 py-1.5 bg-black/90 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.2)] font-mono text-[9px] text-center select-none whitespace-nowrap">
          <span className="text-ece-cyan font-bold block mb-1">
            LIFEMATE // AI VOICE-FIRST COMPANION
          </span>
          <div className="flex items-center gap-1 text-[8px] text-slate-300">
            {PIPELINE_NODES.map((node, i) => (
              <React.Fragment key={node}>
                <span className="px-1 py-0.2 bg-white/5 rounded border border-white/5">
                  {node}
                </span>
                {i < PIPELINE_NODES.length - 1 && <span className="text-ece-cyan">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Html>
    </StationBaseDesk>
  );
};
