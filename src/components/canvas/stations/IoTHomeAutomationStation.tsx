import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StationBaseDesk } from './StationBaseDesk';
import { useSystem } from '../../../context/SystemContext';

export const IoTHomeAutomationStation: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const { 
    iotLightOn, 
    toggleIotLight, 
    inspectObject, 
    triggerAudio 
  } = useSystem();

  const [hovered, setHovered] = useState<string | null>(null);
  const btLedRef = useRef<THREE.Mesh>(null);
  const lampGlowRef = useRef<THREE.PointLight>(null);

  // Blinking HC-05 link LED
  useFrame((state) => {
    if (btLedRef.current) {
      const time = state.clock.getElapsedTime();
      const mat = btLedRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.sin(time * 8) > 0 ? 0.9 : 0.2;
      }
    }
  });

  const handleLampClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    triggerAudio('relay');
    toggleIotLight();
  };

  return (
    <StationBaseDesk
      stationId="iot"
      stationNumber="05"
      name="IoT / AUTOMATION"
      category="Relay Switching & Bluetooth"
      isSelected={isSelected}
    >
      {/* 1. Interactive Domestic Luminaire / Lamp Bulb */}
      <group
        position={[0.45, 0.35, -0.2]}
        onClick={handleLampClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered('lamp');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(null);
          document.body.style.cursor = 'default';
        }}
      >
        {/* Lamp Stand */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.25, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* Bulb Glass */}
        <mesh castShadow position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color={iotLightOn ? '#fef08a' : '#1e293b'}
            emissive={iotLightOn ? '#facc15' : '#000000'}
            emissiveIntensity={iotLightOn ? 1.8 : 0}
            roughness={0.1}
          />
        </mesh>

        {/* Dynamic Light Cast */}
        {iotLightOn && (
          <pointLight
            ref={lampGlowRef}
            position={[0, 0.1, 0]}
            color="#fde047"
            intensity={2.2}
            distance={4}
          />
        )}

        <Html position={[0, 0.35, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2 py-1 bg-black/90 border border-amber-400 rounded text-center font-mono text-[8px] whitespace-nowrap shadow-[0_0_10px_#f59e0b]">
            <span className="font-bold text-amber-400 block">APPLIANCE [230V AC]</span>
            <span className={iotLightOn ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              STATE: {iotLightOn ? 'ON' : 'OFF'} (CLICK TO TOGGLE)
            </span>
          </div>
        </Html>
      </group>

      {/* 2. HC-05 Bluetooth Module */}
      <group
        position={[-0.5, 0.08, 0.3]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          inspectObject('hc05-bluetooth');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered('hc05');
          triggerAudio('click');
        }}
        onPointerOut={() => setHovered(null)}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.03, 0.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* Bluetooth Link LED */}
        <mesh ref={btLedRef} position={[-0.1, 0.03, 0.2]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#38bdf8" transparent />
        </mesh>

        {hovered === 'hc05' && (
          <Html position={[0, 0.35, 0]} center distanceFactor={8} pointerEvents="none">
            <div className="px-2 py-1 bg-black/90 border border-sky-400 rounded font-mono text-[8px] whitespace-nowrap">
              <span className="font-bold text-sky-400 block">HC-05 BLUETOOTH</span>
              <span className="text-white block">UART 9600 Baud • SPP</span>
            </div>
          </Html>
        )}
      </group>

      {/* 3. 4-Channel Optoisolated Relay Module */}
      <group
        position={[0, 0.06, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('relay');
          toggleIotLight();
          inspectObject('relay-module');
        }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.03, 0.5]} />
          <meshStandardMaterial color="#005b8e" roughness={0.4} />
        </mesh>
        {/* 4 Relay Cubes */}
        {[-0.22, -0.07, 0.07, 0.22].map((x, i) => (
          <mesh key={i} position={[x, 0.08, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.22]} />
            <meshStandardMaterial
              color={i === 0 && iotLightOn ? '#0284c7' : '#0369a1'}
              emissive={i === 0 && iotLightOn ? '#38bdf8' : '#000000'}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* 4. Data Flow Banner */}
      <Html position={[0, 0.9, -0.4]} center distanceFactor={10} pointerEvents="none">
        <div className="px-3 py-1.5 bg-black/90 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.2)] font-mono text-[9px] text-center select-none whitespace-nowrap">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-ece-cyan font-bold">OPTOISOLATED SWITCHING</span>
            <span className={iotLightOn ? 'text-emerald-400 font-bold animate-pulse' : 'text-slate-400'}>
              {iotLightOn ? 'RELAY ACTIVE (CH1)' : 'RELAY STANDBY'}
            </span>
          </div>
          <span className="text-slate-300 block text-[8px]">
            SMARTPHONE → HC-05 → UART → ARDUINO → RELAY → LOAD
          </span>
        </div>
      </Html>
    </StationBaseDesk>
  );
};
