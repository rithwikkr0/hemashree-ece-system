import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Smartphone, Zap, Power, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export const BluetoothHomeAutomationScene: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [lampOn, setLampOn] = useState(false);
  const [packetState, setPacketState] = useState<'IDLE' | 'SENDING' | 'RECEIVED'>('IDLE');

  const toggleLamp = () => {
    triggerAudio('relay');
    setPacketState('SENDING');
    setTimeout(() => {
      setPacketState('RECEIVED');
      setLampOn(!lampOn);
      setTimeout(() => setPacketState('IDLE'), 800);
    }, 300);
  };

  return (
    <group position={[0, -0.3, 0]}>
      {/* 1. Miniature Domestic Room Model Surface */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.7} />
      </mesh>

      {/* 2. Domestic Floor Lamp Appliance */}
      <group position={[1.8, 0.8, -0.8]}>
        {/* Stand */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 0.9, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Lamp Shade & Bulb */}
        <mesh castShadow position={[0, 0.15, 0]}>
          <coneGeometry args={[0.35, 0.4, 16, 1, true]} />
          <meshStandardMaterial
            color={lampOn ? '#fef08a' : '#1e293b'}
            emissive={lampOn ? '#facc15' : '#000000'}
            emissiveIntensity={lampOn ? 1.5 : 0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {lampOn && (
          <pointLight position={[0, 0.1, 0]} color="#fde047" intensity={2.8} distance={6} />
        )}
      </group>

      {/* 3. Arduino & 4-Channel Optocoupler Relay Board on Desk */}
      <group position={[0.2, 0.1, 0.2]}>
        {/* Relay Module */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.04, 0.6]} />
          <meshStandardMaterial color="#005b8e" roughness={0.4} />
        </mesh>
        {/* 4 Blue Relay Packages */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.08, 0]}>
            <boxGeometry args={[0.15, 0.14, 0.25]} />
            <meshStandardMaterial
              color={i === 0 && lampOn ? '#0284c7' : '#0369a1'}
              emissive={i === 0 && lampOn ? '#38bdf8' : '#000000'}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* 4. HC-05 Bluetooth Module with UART Trace */}
      <group position={[-1.2, 0.1, 0.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.03, 0.8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Flashing Blue LED */}
        <mesh position={[-0.1, 0.03, 0.25]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <Html position={[0, 0.4, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2 py-0.5 bg-black/90 border border-sky-400 rounded font-mono text-[8px] text-sky-400 whitespace-nowrap">
            HC-05 // BLUETOOTH SPP
          </div>
        </Html>
      </group>

      {/* 5. Mobile Phone Serial Terminal */}
      <group position={[-2.2, 0.35, -0.4]} rotation={[0.3, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 1.35, 0.06]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[0.66, 1.28]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* 6. Interactive Smart Home Controller HUD */}
      <Html position={[0, -2.4, 0]} center distanceFactor={5.5} pointerEvents="auto">
        <div className="max-w-md w-[360px] p-3.5 bg-black/90 border border-ece-cyan/40 rounded tech-corner-cut backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.9)] font-mono text-xs select-none space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
            <span className="text-ece-cyan font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              BLUETOOTH HOME AUTOMATION
            </span>
            <span className={lampOn ? 'text-amber-400 font-bold' : 'text-slate-400'}>
              {lampOn ? 'LOAD: ACTIVE (230V AC)' : 'LOAD: OFF'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[9px] text-center">
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block">BT STATUS</span>
              <span className="text-emerald-400 font-bold">CONNECTED</span>
            </div>
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block">UART PACKET</span>
              <span className={packetState !== 'IDLE' ? 'text-ece-cyan font-bold animate-pulse' : 'text-slate-300'}>
                {packetState === 'SENDING' ? 'TRANSIT...' : '9600 BAUD'}
              </span>
            </div>
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block">RELAY (CH1)</span>
              <span className={lampOn ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {lampOn ? 'LATCHED ON' : 'STANDBY'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleLamp}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-2 rounded font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]',
              lampOn
                ? 'bg-amber-400 text-black hover:bg-amber-300'
                : 'bg-ece-cyan text-black hover:bg-cyan-300'
            )}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{lampOn ? 'SWITCH APPLIANCE OFF' : 'SWITCH APPLIANCE ON (TRIGGER RELAY)'}</span>
          </button>
        </div>
      </Html>
    </group>
  );
};
