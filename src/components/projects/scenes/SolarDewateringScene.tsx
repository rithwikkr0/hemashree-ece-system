import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Sun, Power, Droplets, Gauge } from 'lucide-react';
import clsx from 'clsx';

export const SolarDewateringScene: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [isRunning, setIsRunning] = useState(true);
  const [waterLevel, setWaterLevel] = useState(72);

  const waterMeshRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.Group>(null);

  // Water level decrease simulation loop
  useFrame((state, delta) => {
    if (isRunning) {
      setWaterLevel((prev) => {
        if (prev <= 25) return 85; // Reset loop for continuous demo
        return Math.max(20, prev - delta * 2.5);
      });
    }

    if (waterMeshRef.current) {
      const height = (waterLevel / 100) * 1.4;
      waterMeshRef.current.scale.set(1, height / 1.4, 1);
      waterMeshRef.current.position.y = -0.7 + height / 2;
    }

    if (bubblesRef.current && isRunning) {
      const time = state.clock.getElapsedTime();
      bubblesRef.current.children.forEach((b, idx) => {
        const offset = (time * 1.8 + idx * 0.25) % 1;
        b.position.y = -0.6 + offset * 1.8;
        const mat = (b as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = Math.sin(offset * Math.PI) * 0.8;
      });
    }
  });

  const toggleSystem = () => {
    triggerAudio('toggle');
    setIsRunning(!isRunning);
  };

  return (
    <group position={[0, -0.2, 0]}>
      {/* 1. Mining Pit Excavation Terrain (Terraced Pit Stepping) */}
      <mesh receiveShadow position={[0, -1.2, 0]}>
        <cylinderGeometry args={[4.2, 2.8, 1.8, 24, 1, true]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Water Reservoir Volume inside Pit */}
      <mesh ref={waterMeshRef} position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 1.4, 24]} />
        <meshStandardMaterial
          color="#0284c7"
          transparent
          opacity={0.65}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Solar PV Array on Pit Rim */}
      <group position={[-2.4, 0.9, -1.5]} rotation={[-0.45, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.4, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[2.08, 1.28]} />
          <meshStandardMaterial
            color="#0c2540"
            emissive="#38bdf8"
            emissiveIntensity={isRunning ? 0.35 : 0.05}
            roughness={0.2}
          />
        </mesh>
        <Html position={[0, 0.9, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2 py-1 bg-black/90 border border-sky-400 rounded font-mono text-[9px] text-sky-400 whitespace-nowrap shadow-[0_0_12px_#38bdf8]">
            SOLAR ARRAY // MONOCRYSTALLINE
          </div>
        </Html>
      </group>

      {/* 4. DC Submersible Pump Model in Pit Floor */}
      <group position={[0, -0.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.45, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Anti-cavitation Level Probe */}
        <mesh position={[0.2, 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* 5. Discharge Pipe & Evacuation Bubbles */}
      <mesh position={[0.5, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.8, 12]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
      <group ref={bubblesRef} position={[0.5, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent />
          </mesh>
        ))}
      </group>

      {/* 6. Interactive Dewatering Controller HUD */}
      <Html position={[0, -2.5, 0]} center distanceFactor={5.5} pointerEvents="auto">
        <div className="max-w-md w-[360px] p-3.5 bg-black/90 border border-amber-400/50 rounded tech-corner-cut backdrop-blur-xl shadow-[0_0_25px_rgba(251,191,36,0.2)] font-mono text-xs select-none space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              SOLAR DEWATERING SYSTEM
            </span>
            <span className={isRunning ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {isRunning ? 'RUNNING // PUMP ACTIVE' : 'STANDBY'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-1.5 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block text-[8px]">WATER LEVEL [SIMULATION]</span>
              <span className="text-sky-400 font-bold text-sm">{Math.round(waterLevel)}%</span>
            </div>
            <div className="p-1.5 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block text-[8px]">PUMP INRUSH CURRENT</span>
              <span className="text-white font-bold text-sm">MPPT SAFE</span>
            </div>
          </div>

          <button
            onClick={toggleSystem}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-2 rounded font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]',
              isRunning
                ? 'bg-amber-400 text-black hover:bg-amber-300'
                : 'bg-emerald-500 text-black hover:bg-emerald-400'
            )}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isRunning ? 'STOP SYSTEM DEWATERING' : 'START SYSTEM DEWATERING'}</span>
          </button>
        </div>
      </Html>
    </group>
  );
};
