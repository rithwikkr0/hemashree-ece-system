import React, { useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Sun, Moon, Zap, Sliders } from 'lucide-react';
import clsx from 'clsx';

export const SmartAmbientLightScene: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [ambientLux, setAmbientLux] = useState(550);
  const [relayOn, setRelayOn] = useState(false);

  // Software hysteresis implementation in Embedded C logic
  const handleLuxChange = (newLux: number) => {
    setAmbientLux(newLux);
    // Hysteresis trip thresholds:
    // Low threshold: < 300 Lux triggers lamp ON
    // High threshold: > 450 Lux triggers lamp OFF
    if (newLux < 300 && !relayOn) {
      triggerAudio('relay');
      setRelayOn(true);
    } else if (newLux > 450 && relayOn) {
      triggerAudio('relay');
      setRelayOn(false);
    }
  };

  // Simulated LDR resistance and 10-bit ADC reading (0-1023)
  const ldrAdc = Math.round(1023 * (ambientLux / 1000));

  return (
    <group position={[0, -0.3, 0]}>
      {/* 1. Room Floor Surface */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#0a0e17" roughness={0.8} />
      </mesh>

      {/* Dynamic Ambient Daylight Light Simulation */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={(ambientLux / 1000) * 1.5}
        color="#fffbeb"
      />

      {/* 2. Room Luminaire (Automated Lamp) */}
      <group position={[1.4, 0.7, -0.6]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 0.7, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color={relayOn ? '#fef08a' : '#1e293b'}
            emissive={relayOn ? '#facc15' : '#000000'}
            emissiveIntensity={relayOn ? 1.8 : 0}
            roughness={0.1}
          />
        </mesh>
        {relayOn && (
          <pointLight position={[0, 0.2, 0]} color="#fde047" intensity={2.5} distance={5} />
        )}
      </group>

      {/* 3. LDR Cadmium Sulfide Photocell & Divider Board */}
      <group position={[-1.2, 0.1, 0.3]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.04, 0.6]} />
          <meshStandardMaterial color="#064e3b" roughness={0.4} />
        </mesh>
        {/* LDR Disc */}
        <mesh position={[0, 0.04, -0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <meshStandardMaterial color="#d97706" emissive="#fbbf24" emissiveIntensity={(ambientLux / 1000) * 0.8} />
        </mesh>
        <Html position={[0, 0.35, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2 py-0.5 bg-black/90 border border-amber-400 rounded font-mono text-[8px] text-amber-400 whitespace-nowrap">
            LDR PHOTOCELL
          </div>
        </Html>
      </group>

      {/* 4. Relay Module Package */}
      <group position={[0, 0.08, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.12, 0.3]} />
          <meshStandardMaterial
            color={relayOn ? '#0284c7' : '#0f172a'}
            emissive={relayOn ? '#38bdf8' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.1, 0.08, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={relayOn ? '#ef4444' : '#64748b'} />
        </mesh>
      </group>

      {/* 5. Interactive Ambient Light & Hysteresis Controller HUD */}
      <Html position={[0, -2.4, 0]} center distanceFactor={5.5} pointerEvents="auto">
        <div className="max-w-md w-[360px] p-3.5 bg-black/90 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.9)] font-mono text-xs select-none space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
            <span className="text-ece-cyan font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              SMART AMBIENT LIGHT AUTOMATION
            </span>
            <span className={relayOn ? 'text-amber-400 font-bold' : 'text-slate-400'}>
              RELAY: {relayOn ? 'CLOSED (LAMP ON)' : 'OPEN (LAMP OFF)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[9px] text-center">
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block">AMBIENT LUX</span>
              <span className="text-white font-bold">{ambientLux} Lux</span>
            </div>
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block">ADC READING</span>
              <span className="text-ece-cyan font-bold">{ldrAdc} / 1023</span>
            </div>
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block">HYSTERESIS</span>
              <span className="text-emerald-400 font-bold">ANTI-CHATTER</span>
            </div>
          </div>

          {/* Virtual Light Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-slate-400">
              <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> DUSK (0 Lux)</span>
              <span>SLIDE TO ALTER LIGHT LEVEL</span>
              <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber-400" /> NOON (1000 Lux)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={ambientLux}
              onChange={(e) => handleLuxChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="p-1.5 bg-black/60 rounded border border-white/5 text-[9px] text-slate-300 font-sans leading-tight">
            <strong className="text-ece-cyan font-mono block">THRESHOLD HYSTERESIS LOGIC:</strong>
            Turn ON when &lt; 300 Lux. Turn OFF when &gt; 450 Lux. Prevents oscillation at dawn/dusk boundaries.
          </div>
        </div>
      </Html>
    </group>
  );
};
