import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StationBaseDesk } from './StationBaseDesk';
import { useSystem } from '../../../context/SystemContext';

export const PowerSolarLabStation: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const { 
    solarPumpActive, 
    toggleSolarPump, 
    inspectObject, 
    triggerAudio 
  } = useSystem();

  const bubblesGroupRef = useRef<THREE.Group>(null);
  const panelRef = useRef<THREE.Group>(null);

  // Animate water flow bubbles rising through transparent evacuation pipe
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (bubblesGroupRef.current && solarPumpActive) {
      bubblesGroupRef.current.children.forEach((bubble, idx) => {
        const offset = (time * 1.5 + idx * 0.25) % 1;
        bubble.position.y = -0.2 + offset * 0.9;
        const mat = (bubble as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.sin(offset * Math.PI) * 0.8;
        }
      });
    }
  });

  return (
    <StationBaseDesk
      stationId="power"
      stationNumber="07"
      name="POWER / SOLAR LAB"
      category="Renewables & Hydraulics"
      isSelected={isSelected}
    >
      {/* 1. Solar PV Monocrystalline Panel Array */}
      <group
        ref={panelRef}
        position={[-0.55, 0.4, -0.2]}
        rotation={[-0.45, 0.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('solar-pv-array');
        }}
      >
        {/* Panel Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.1, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Dark Blue Silicon Wafer with Silver Busbars */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.84, 1.04]} />
          <meshStandardMaterial
            color="#0c2340"
            roughness={0.2}
            metalness={0.5}
            emissive="#00f0ff"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* 2. Solar Charge Controller Unit */}
      <group position={[0.2, 0.08, -0.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.14, 0.22]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        {/* MPPT Status LED */}
        <mesh position={[0.1, 0.08, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={solarPumpActive ? '#00ff88' : '#eab308'} />
        </mesh>
      </group>

      {/* 3. Water Sump Reservoir with Transparent Walls */}
      <group
        position={[0.55, 0.2, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('toggle');
          toggleSolarPump();
          inspectObject('dc-pump-sump');
        }}
      >
        {/* Acrylic Tank */}
        <mesh receiveShadow>
          <boxGeometry args={[0.6, 0.5, 0.6]} />
          <meshStandardMaterial
            color="#0284c7"
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>

        {/* Water Volume */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.56, 0.38, 0.56]} />
          <meshStandardMaterial
            color="#0ea5e9"
            transparent
            opacity={0.65}
            roughness={0.2}
          />
        </mesh>

        {/* DC Submersible Impeller Pump */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>

        {/* Evacuation Discharge Pipe */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.45}
            roughness={0.1}
          />
        </mesh>

        {/* Animated Water Bubbles Rising */}
        <group ref={bubblesGroupRef} position={[0, 0, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. Energy Flow HUD Banner */}
      <Html position={[0, 0.95, -0.3]} center distanceFactor={10} pointerEvents="none">
        <div className="px-3 py-1.5 bg-black/90 border border-amber-400/40 rounded tech-corner-cut backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.2)] font-mono text-[9px] text-center select-none whitespace-nowrap">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-amber-400 font-bold">SOLAR-POWERED DEWATERING</span>
            <span className={solarPumpActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              PUMP: {solarPumpActive ? 'ACTIVE [CLICK]' : 'OFF'}
            </span>
          </div>
          <span className="text-slate-300 block text-[8px]">
            SOLAR → MPPT CONTROLLER → DC PUMP → HYDRAULIC DISCHARGE
          </span>
        </div>
      </Html>
    </StationBaseDesk>
  );
};
