import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StationBaseDesk } from './StationBaseDesk';
import { useSystem } from '../../../context/SystemContext';

export const SensorLabStation: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const { inspectObject, triggerAudio } = useSystem();
  const [hovered, setHovered] = useState<string | null>(null);

  const waveGroupRef = useRef<THREE.Group>(null);
  const obstacleRef = useRef<THREE.Mesh>(null);
  const packetRef = useRef<THREE.Mesh>(null);

  // Animate ultrasonic wave propagation and packet flow
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Ultrasonic wave pulses traveling forward to obstacle
    if (waveGroupRef.current) {
      waveGroupRef.current.children.forEach((child, i) => {
        const offset = (time * 1.8 + i * 0.3) % 1;
        child.position.z = -0.1 - offset * 0.8;
        child.scale.set(1 + offset * 1.5, 1 + offset * 1.5, 1);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - offset) * 0.85);
        }
      });
    }

    // Floating sensor data packet
    if (packetRef.current) {
      packetRef.current.position.y = 0.2 + Math.sin(time * 3) * 0.05;
      packetRef.current.rotation.y = time * 2;
    }
  });

  return (
    <StationBaseDesk
      stationId="sensor"
      stationNumber="02"
      name="SENSOR LAB"
      category="Transducers & Physics"
      isSelected={isSelected}
    >
      {/* 1. HC-SR04 Ultrasonic Sensor Module */}
      <group
        position={[-0.45, 0.1, 0.3]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('hc-sr04');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered('hcsr04');
          triggerAudio('click');
        }}
        onPointerOut={() => setHovered(null)}
      >
        {/* PCB Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.03, 0.35]} />
          <meshStandardMaterial color="#005b8e" roughness={0.4} />
        </mesh>
        {/* Transmitter Can (T) */}
        <mesh position={[-0.2, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.16, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Receiver Can (R) */}
        <mesh position={[0.2, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.16, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Ultrasonic 40kHz Wavefront Simulation Arcs */}
        <group ref={waveGroupRef} position={[0, 0.09, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.15, 0.18, 16, 1, 0, Math.PI]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>

        {/* Obstacle Box */}
        <mesh ref={obstacleRef} position={[0, 0.15, -0.9]}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {hovered === 'hcsr04' && (
          <Html position={[0, 0.45, 0]} center distanceFactor={8} pointerEvents="none">
            <div className="px-2.5 py-1.5 bg-black/90 border border-ece-cyan rounded shadow-[0_0_15px_#00f0ff] font-mono text-[9px] text-left leading-tight whitespace-nowrap">
              <span className="font-bold text-ece-cyan block text-[10px]">HC-SR04 ULTRASONIC</span>
              <span className="text-white block">40 kHz Burst • ToF</span>
              <span className="text-slate-400 block">Distance: 34.8 cm [SIMULATION]</span>
              <span className="text-emerald-400 text-[8px] block mt-0.5 font-bold">CLICK TO INSPECT</span>
            </div>
          </Html>
        )}
      </group>

      {/* 2. LDR Light Sensor & Divider */}
      <group
        position={[0.55, 0.08, -0.1]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('ldr-sensor');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered('ldr');
          triggerAudio('click');
        }}
        onPointerOut={() => setHovered(null)}
      >
        {/* Sensor Carrier Board */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.03, 0.5]} />
          <meshStandardMaterial color="#064e3b" roughness={0.4} />
        </mesh>
        {/* LDR Disc */}
        <mesh position={[0, 0.04, -0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.4} />
        </mesh>
        {/* Fixed 10k Divider Resistor */}
        <mesh position={[0, 0.03, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.14, 8]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>

        {hovered === 'ldr' && (
          <Html position={[0, 0.4, 0]} center distanceFactor={8} pointerEvents="none">
            <div className="px-2.5 py-1.5 bg-black/90 border border-amber-400 rounded shadow-[0_0_15px_#f59e0b] font-mono text-[9px] text-left leading-tight whitespace-nowrap">
              <span className="font-bold text-amber-400 block text-[10px]">LDR PHOTOCELL</span>
              <span className="text-white block">Voltage Divider • Hysteresis</span>
              <span className="text-slate-400 block">Lux Reading: 620 [SIMULATION]</span>
              <span className="text-emerald-400 text-[8px] block mt-0.5 font-bold">CLICK TO INSPECT</span>
            </div>
          </Html>
        )}
      </group>

      {/* 3. Relay Module Representation */}
      <group position={[0.2, 0.05, 0.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.14, 0.28]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.1, 0.08, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* 4. Telemetry Banner Overlay */}
      <Html position={[0, 0.9, -0.4]} center distanceFactor={10} pointerEvents="none">
        <div className="px-3 py-1.5 bg-black/85 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.2)] font-mono text-[9px] text-center select-none">
          <span className="text-ece-cyan font-bold block">TRANSDUCER PIPELINE</span>
          <span className="text-slate-300 block text-[8px] mt-0.5">
            ACOUSTIC ToF → ADC [10-BIT] → THRESHOLD LOGIC
          </span>
        </div>
      </Html>
    </StationBaseDesk>
  );
};
