import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StationBaseDesk } from './StationBaseDesk';
import { useSystem } from '../../../context/SystemContext';

export const EmbeddedBenchStation: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const { inspectObject, triggerAudio } = useSystem();
  const [hoveredObj, setHoveredObj] = useState<string | null>(null);
  const ledsRef = useRef<THREE.Group>(null);

  // Blinking hardware logic indicators
  useFrame((state) => {
    if (ledsRef.current) {
      const time = state.clock.getElapsedTime();
      ledsRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.sin(time * 6 + i * 1.5) > 0 ? 0.9 : 0.2;
        }
      });
    }
  });

  return (
    <StationBaseDesk
      stationId="embedded"
      stationNumber="01"
      name="EMBEDDED BENCH"
      category="Firmware & Architecture"
      isSelected={isSelected}
    >
      {/* 1. Arduino Uno (ATmega328P) */}
      <group
        position={[-0.55, 0.05, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('arduino-uno');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredObj('arduino');
          triggerAudio('click');
        }}
        onPointerOut={() => setHoveredObj(null)}
      >
        {/* Blue PCB */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.04, 0.65]} />
          <meshStandardMaterial
            color={hoveredObj === 'arduino' ? '#0070b0' : '#005b8e'}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        {/* ATmega328P DIP IC */}
        <mesh position={[0.1, 0.04, 0]}>
          <boxGeometry args={[0.45, 0.05, 0.16]} />
          <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* USB-B Metal Socket */}
        <mesh position={[-0.4, 0.07, -0.15]}>
          <boxGeometry args={[0.18, 0.12, 0.18]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Pin Headers */}
        <mesh position={[0, 0.05, 0.28]}>
          <boxGeometry args={[0.8, 0.06, 0.05]} />
          <meshStandardMaterial color="#0a0f16" />
        </mesh>
        <mesh position={[0, 0.05, -0.28]}>
          <boxGeometry args={[0.8, 0.06, 0.05]} />
          <meshStandardMaterial color="#0a0f16" />
        </mesh>

        {hoveredObj === 'arduino' && (
          <Html position={[0, 0.45, 0]} center distanceFactor={8} pointerEvents="none">
            <div className="px-2.5 py-1.5 bg-black/90 border border-ece-cyan rounded shadow-[0_0_15px_#00f0ff] font-mono text-[9px] text-left leading-tight whitespace-nowrap">
              <span className="font-bold text-ece-cyan block text-[10px]">ARDUINO UNO</span>
              <span className="text-white block">ATmega328P • 16 MHz</span>
              <span className="text-slate-400 block">Embedded C • GPIO • UART</span>
              <span className="text-emerald-400 text-[8px] block mt-0.5 font-bold">CLICK TO INSPECT</span>
            </div>
          </Html>
        )}
      </group>

      {/* 2. ESP32 Wireless Module */}
      <group
        position={[0.55, 0.05, 0.25]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('esp32-wroom');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredObj('esp32');
          triggerAudio('click');
        }}
        onPointerOut={() => setHoveredObj(null)}
      >
        {/* Black PCB */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.03, 0.85]} />
          <meshStandardMaterial
            color={hoveredObj === 'esp32' ? '#182433' : '#0b0f17'}
            roughness={0.5}
          />
        </mesh>
        {/* Metallic RF Shield */}
        <mesh position={[0, 0.04, -0.05]}>
          <boxGeometry args={[0.42, 0.05, 0.45]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* PCB Trace Antenna */}
        <mesh position={[0, 0.02, 0.32]}>
          <boxGeometry args={[0.4, 0.01, 0.16]} />
          <meshBasicMaterial color="#ff7b00" />
        </mesh>

        {hoveredObj === 'esp32' && (
          <Html position={[0, 0.45, 0]} center distanceFactor={8} pointerEvents="none">
            <div className="px-2.5 py-1.5 bg-black/90 border border-ece-orange rounded shadow-[0_0_15px_#ff7b00] font-mono text-[9px] text-left leading-tight whitespace-nowrap">
              <span className="font-bold text-ece-orange block text-[10px]">ESP32 WROOM</span>
              <span className="text-white block">Xtensa Dual-Core 240 MHz</span>
              <span className="text-slate-400 block">Wi-Fi • Bluetooth • IoT</span>
              <span className="text-emerald-400 text-[8px] block mt-0.5 font-bold">CLICK TO INSPECT</span>
            </div>
          </Html>
        )}
      </group>

      {/* 3. Solderless Breadboard with Components & Wires */}
      <group position={[0, 0.02, -0.45]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.2, 0.03, 0.5]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>
        {/* Red & Blue Power Rails */}
        <mesh position={[-0.55, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.005, 0.46]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.55, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.005, 0.46]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
        {/* Small DIP IC */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.18, 0.03, 0.12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Jumper Wires (Curved lines) */}
        <mesh position={[-0.2, 0.04, 0.05]} rotation={[0, 0.3, 0]}>
          <torusGeometry args={[0.12, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[0.2, 0.04, -0.05]} rotation={[0, -0.4, 0]}>
          <torusGeometry args={[0.14, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#ff7b00" />
        </mesh>
      </group>

      {/* 4. Blinking Logic Indicators */}
      <group ref={ledsRef} position={[-0.4, 0.05, -0.1]}>
        {[-0.15, -0.05, 0.05, 0.15].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#00f0ff' : '#00ff88'} transparent />
          </mesh>
        ))}
      </group>

      {/* 5. Holographic Diagnostic Display */}
      <Html position={[0, 0.85, -0.3]} center distanceFactor={10} pointerEvents="none">
        <div className="px-3 py-2 bg-black/85 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)] font-mono text-[9px] text-center select-none">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1 gap-2">
            <span className="text-white font-bold">MICROCONTROLLER</span>
            <span className="text-emerald-400 font-bold animate-pulse">ACTIVE</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[8px] text-slate-300">
            <span className="px-1 py-0.5 bg-white/5 rounded">CPU: OK</span>
            <span className="px-1 py-0.5 bg-white/5 rounded">GPIO: 14</span>
            <span className="px-1 py-0.5 bg-white/5 rounded">UART: 9600</span>
            <span className="px-1 py-0.5 bg-white/5 rounded">TIMER: 16b</span>
            <span className="px-1 py-0.5 bg-white/5 rounded">INT0: ON</span>
            <span className="px-1 py-0.5 bg-ece-cyan/20 text-ece-cyan font-bold rounded">5V REG</span>
          </div>
        </div>
      </Html>
    </StationBaseDesk>
  );
};
