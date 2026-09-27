import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../context/SystemContext';

interface EnvObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  label: string;
  sublabel: string;
  children: React.ReactNode;
}

const HoverableObject: React.FC<EnvObjectProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  label,
  sublabel,
  children,
}) => {
  const { triggerAudio } = useSystem();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle floating motion
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8 + position[0]) * 0.15;
      groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.4 + position[2]) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[
        scale * (hovered ? 1.08 : 1),
        scale * (hovered ? 1.08 : 1),
        scale * (hovered ? 1.08 : 1),
      ]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        triggerAudio('click');
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}

      {/* Floating technical HUD tooltip on hover */}
      {hovered && (
        <Html distanceFactor={12} position={[0, 0.8, 0]} center pointerEvents="none">
          <div className="px-2 py-1 bg-ece-obsidian/90 backdrop-blur-md border border-ece-cyan/60 rounded text-center whitespace-nowrap shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-fade-in pointer-events-none select-none">
            <span className="block font-mono text-[9px] text-ece-cyan font-bold tracking-wider">
              {label}
            </span>
            <span className="block font-mono text-[8px] text-slate-400">
              {sublabel}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};

export const HeroEnvironmentObjects: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <group position={[0, 0, -1]}>
      {/* 1. Arduino Uno Form-Factor Board (Left Orbit) */}
      <HoverableObject
        position={[-5.5, 1.8, -2.5]}
        rotation={[0.3, 0.5, -0.2]}
        scale={0.8}
        label="ARDUINO UNO // ATMEGA328P"
        sublabel="16 MHz • 5V Logic • GPIO"
      >
        <group>
          {/* Blue PCB */}
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.08, 1.3]} />
            <meshStandardMaterial color="#005b8e" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* ATmega328P DIP IC */}
          <mesh position={[0.2, 0.08, 0]}>
            <boxGeometry args={[0.9, 0.12, 0.35]} />
            <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* USB-B Port */}
          <mesh position={[-0.8, 0.15, -0.3]}>
            <boxGeometry args={[0.35, 0.25, 0.35]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Header Pins */}
          <mesh position={[0, 0.1, 0.55]}>
            <boxGeometry args={[1.6, 0.15, 0.1]} />
            <meshStandardMaterial color="#0a0f16" />
          </mesh>
        </group>
      </HoverableObject>

      {/* 2. ESP32 Module (Right Orbit) */}
      <HoverableObject
        position={[5.5, 2.2, -2]}
        rotation={[-0.2, -0.6, 0.1]}
        scale={0.85}
        label="ESP32 WROOM // DUAL-CORE"
        sublabel="240 MHz • WiFi & BLE • UART"
      >
        <group>
          {/* Black PCB */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.06, 1.8]} />
            <meshStandardMaterial color="#0b0f17" roughness={0.5} />
          </mesh>
          {/* Metal RF Shield */}
          <mesh position={[0, 0.08, -0.1]}>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Meandering Antenna Trace */}
          <mesh position={[0, 0.04, 0.65]}>
            <boxGeometry args={[0.8, 0.02, 0.35]} />
            <meshBasicMaterial color="#ff7b00" />
          </mesh>
        </group>
      </HoverableObject>

      {/* 3. HC-SR04 Ultrasonic Sensor Module */}
      <HoverableObject
        position={[-4.5, -2.2, -1.8]}
        rotation={[0.4, 0.4, 0]}
        scale={0.75}
        label="HC-SR04 SENSOR"
        sublabel="40 kHz Ultrasonic • Time of Flight"
      >
        <group>
          {/* Blue PCB */}
          <mesh>
            <boxGeometry args={[1.5, 0.06, 0.8]} />
            <meshStandardMaterial color="#005b8e" roughness={0.4} />
          </mesh>
          {/* Transducer Can 1 */}
          <mesh position={[-0.45, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.38, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Transducer Can 2 */}
          <mesh position={[0.45, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.38, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </HoverableObject>

      {/* 4. Mini Oscilloscope Display */}
      <HoverableObject
        position={[4.8, -2.4, -2.2]}
        rotation={[-0.2, -0.4, 0]}
        scale={0.85}
        label="DIGITAL OSCILLOSCOPE"
        sublabel="100 MHz • Dual Channel • FFT"
      >
        <group>
          {/* Chassis */}
          <mesh castShadow>
            <boxGeometry args={[1.8, 1.2, 0.5]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.5} />
          </mesh>
          {/* Screen with Glowing Grid */}
          <mesh position={[0, 0.05, 0.26]}>
            <planeGeometry args={[1.4, 0.9]} />
            <meshBasicMaterial color="#02141a" />
          </mesh>
          {/* Waveform Line */}
          <mesh position={[0, 0.05, 0.27]}>
            <planeGeometry args={[1.2, 0.04]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
        </group>
      </HoverableObject>

      {/* 5. RF Sniffer Dipole Antenna */}
      <HoverableObject
        position={[-2.5, 3.8, -3.2]}
        rotation={[0.1, 0.2, -0.4]}
        scale={0.7}
        label="RF SNIFFER ANTENNA"
        sublabel="900 MHz - 2.4 GHz • LC Tank"
      >
        <group>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
            <meshStandardMaterial color="#ff7b00" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -1.1, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.3, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
        </group>
      </HoverableObject>

      {/* 6. Solar Panel Module Wafer */}
      <HoverableObject
        position={[2.8, 3.6, -3.5]}
        rotation={[-0.4, -0.3, 0.2]}
        scale={0.8}
        label="SOLAR PV MODULE"
        sublabel="Monocrystalline • Inductive Dewatering"
      >
        <group>
          <mesh castShadow>
            <boxGeometry args={[1.8, 2.2, 0.06]} />
            <meshStandardMaterial color="#0c192c" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Silver Frame */}
          <mesh position={[0, 0, 0.02]}>
            <ringGeometry args={[0.9, 1.0, 4]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
        </group>
      </HoverableObject>

      {/* 7. Smartphone Glass Slab (Lifemate Mobile Platform) */}
      <HoverableObject
        position={[-6.2, 0, -4]}
        rotation={[0.1, 0.7, -0.1]}
        scale={0.75}
        label="SMARTPHONE SLAB // LIFEMATE"
        sublabel="Flutter • On-Device AI • Speech UI"
      >
        <group>
          <mesh castShadow>
            <boxGeometry args={[1.0, 2.0, 0.08]} />
            <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.92, 1.88]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.2}
              roughness={0.1}
            />
          </mesh>
        </group>
      </HoverableObject>
    </group>
  );
};
