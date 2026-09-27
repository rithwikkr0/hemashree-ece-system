import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Activity, ShieldAlert, Sliders, Volume2 } from 'lucide-react';
import clsx from 'clsx';

export const SmartBlindStickScene: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [distanceCm, setDistanceCm] = useState(85);

  const obstacleRef = useRef<THREE.Group>(null);
  const waveArcsRef = useRef<THREE.Group>(null);

  // Position obstacle in 3D based on distanceCm (e.g. 25cm = 1.0 units, 200cm = 4.5 units)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetZ = -0.8 - (distanceCm / 200) * 3.2;

    if (obstacleRef.current) {
      obstacleRef.current.position.z = THREE.MathUtils.lerp(
        obstacleRef.current.position.z,
        targetZ,
        0.1
      );
    }

    if (waveArcsRef.current) {
      // Frequency of ultrasonic pulse scales inversely with distance
      const pulseSpeed = distanceCm < 50 ? 4.5 : distanceCm < 100 ? 2.5 : 1.2;
      waveArcsRef.current.children.forEach((arc, i) => {
        const offset = (time * pulseSpeed + i * 0.25) % 1;
        arc.position.z = -0.3 - offset * (Math.abs(targetZ) - 0.3);
        arc.scale.set(1 + offset * 1.6, 1 + offset * 1.6, 1);
        const mat = (arc as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - offset) * (distanceCm < 50 ? 0.95 : 0.6));
        }
      });
    }
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDistanceCm(val);
    if (val < 50) triggerAudio('scan');
  };

  const getAlertStatus = () => {
    if (distanceCm < 50) return { label: 'CRITICAL ALERT (< 50 cm)', color: 'text-rose-500', bg: 'bg-rose-500' };
    if (distanceCm < 100) return { label: 'CAUTION (50–100 cm)', color: 'text-amber-400', bg: 'bg-amber-400' };
    return { label: 'SAFE (> 100 cm)', color: 'text-emerald-400', bg: 'bg-emerald-400' };
  };

  const status = getAlertStatus();

  return (
    <group position={[0, -0.4, 0]}>
      {/* 1. Walking Path Surface */}
      <mesh receiveShadow position={[0, -0.1, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 6]} />
        <meshStandardMaterial color="#0c121d" roughness={0.8} />
      </mesh>

      {/* Tactile Paving Guidelines */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, -0.09, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 6]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.25} />
        </mesh>
      ))}

      {/* 2. 3D Blind Mobility Cane (Stick) */}
      <group position={[0, 0.5, 0]} rotation={[0.25, 0, 0]}>
        {/* Cane Shaft */}
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.025, 2.2, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Ergonomic Handle */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.35, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Rolling Cane Tip */}
        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>

        {/* HC-SR04 Sensor Housing mounted on Cane */}
        <group position={[0, -0.2, 0.05]} rotation={[-0.25, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.45, 0.18, 0.08]} />
            <meshStandardMaterial color="#005b8e" />
          </mesh>
          <mesh position={[-0.12, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          <mesh position={[0.12, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 3. Ultrasonic Wave Arcs propagating toward obstacle */}
      <group ref={waveArcsRef} position={[0, 0.4, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.15, 0.18, 16, 1, 0, Math.PI]} />
            <meshBasicMaterial
              color={distanceCm < 50 ? '#ef4444' : distanceCm < 100 ? '#f59e0b' : '#00f0ff'}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* 4. Movable 3D Obstacle Target */}
      <group ref={obstacleRef} position={[0, 0.4, -2.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.9, 0.5]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.4}
            metalness={0.3}
            emissive={distanceCm < 50 ? '#ef4444' : '#000000'}
            emissiveIntensity={distanceCm < 50 ? 0.3 : 0}
          />
        </mesh>
        <Html position={[0, 0.65, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2 py-0.5 bg-black/90 border border-slate-500 rounded font-mono text-[9px] text-white whitespace-nowrap">
            OBSTACLE
          </div>
        </Html>
      </group>

      {/* 5. Interactive Proximity Controls HUD */}
      <Html position={[0, -2.4, 0]} center distanceFactor={5.5} pointerEvents="auto">
        <div className="max-w-md w-[360px] p-3.5 bg-black/90 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.9)] font-mono text-xs select-none space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
            <span className="text-ece-cyan font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              ULTRASONIC DISTANCE LOGIC
            </span>
            <span className={clsx('font-bold', status.color)}>
              {status.label}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] bg-white/5 p-2 rounded border border-white/5">
            <span className="text-slate-400">MEASURED DISTANCE [SIMULATION]:</span>
            <span className="text-white font-bold text-sm">{distanceCm} cm</span>
          </div>

          {/* Range Slider to move obstacle */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>CRITICAL (20 cm)</span>
              <span>DRAG TO REPOSITION OBSTACLE</span>
              <span>FAR (200 cm)</span>
            </div>
            <input
              type="range"
              min="25"
              max="200"
              value={distanceCm}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-[9px] pt-1 border-t border-white/5">
            <span className="text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-ece-cyan" />
              BUZZER FREQUENCY: {distanceCm < 50 ? '3.2 kHz' : distanceCm < 100 ? '1.5 kHz' : 'OFF'}
            </span>
            <span className="text-slate-400">
              HAPTICS: {distanceCm < 50 ? 'PULSED PWM' : 'IDLE'}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};
