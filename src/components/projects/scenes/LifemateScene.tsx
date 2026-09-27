import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Mic, Cpu, Database, WifiOff } from 'lucide-react';
import clsx from 'clsx';

export const LifemateScene: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [activeMode, setActiveMode] = useState<'VOICE' | 'AI' | 'DB' | 'OFFLINE'>('VOICE');

  const phoneRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Points>(null);
  const cloudNodeRef = useRef<THREE.Group>(null);
  const localDbNodeRef = useRef<THREE.Group>(null);

  // Animate phone levitation, AI particle vortex, and cloud sync stream
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (phoneRef.current) {
      phoneRef.current.position.y = Math.sin(time * 1.2) * 0.12;
      phoneRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }

    if (particleGroupRef.current) {
      const speed = activeMode === 'AI' ? 2.5 : 1.0;
      particleGroupRef.current.rotation.y = time * 0.8 * speed;
      particleGroupRef.current.rotation.x = Math.sin(time * 0.4) * 0.2;
    }

    if (cloudNodeRef.current) {
      cloudNodeRef.current.position.y = 1.6 + Math.sin(time * 1.5) * 0.08;
    }

    if (localDbNodeRef.current) {
      localDbNodeRef.current.position.y = -1.6 + Math.sin(time * 1.8) * 0.06;
    }
  });

  const handleModeChange = (mode: 'VOICE' | 'AI' | 'DB' | 'OFFLINE') => {
    triggerAudio('click');
    setActiveMode(mode);
  };

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Large 3D Floating Smartphone Model */}
      <group ref={phoneRef} position={[0, 0, 0]}>
        {/* Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 3.8, 0.12]} />
          <meshStandardMaterial color="#05080f" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* Screen Glass */}
        <mesh position={[0, 0, 0.062]}>
          <planeGeometry args={[1.92, 3.68]} />
          <meshStandardMaterial
            color="#080e18"
            emissive="#00f0ff"
            emissiveIntensity={activeMode === 'AI' ? 0.35 : 0.15}
            roughness={0.1}
          />
        </mesh>

        {/* Interactive Lifemate App UI rendered on phone screen */}
        <Html position={[0, 0, 0.065]} transform center distanceFactor={4.2} pointerEvents="none">
          <div className="w-[280px] h-[520px] bg-slate-950 p-4 text-white font-sans flex flex-col justify-between select-none rounded-xl border border-ece-cyan/30">
            {/* App Header */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2">
              <span className="text-ece-cyan font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ece-cyan animate-pulse" />
                LIFEMATE v2.0.1
              </span>
              <span className={activeMode === 'OFFLINE' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {activeMode === 'OFFLINE' ? 'OFFLINE SECURE' : 'CLOUD SYNC'}
              </span>
            </div>

            {/* Voice Activity Waveform */}
            <div className="p-3 bg-black/70 rounded-lg border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-slate-400">SPEECH-TO-TEXT ENGINE</span>
                <span className="text-ece-cyan font-bold">{activeMode === 'VOICE' ? 'LISTENING...' : 'READY'}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 h-12">
                {[14, 28, 42, 22, 36, 48, 20, 32, 16, 38, 26, 12].map((val, i) => (
                  <span
                    key={i}
                    className="w-1.5 bg-ece-cyan rounded-full transition-all duration-150"
                    style={{
                      height: activeMode === 'VOICE' ? `${val}px` : `${Math.max(6, val * 0.3)}px`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Welfare Scheme Match Engine */}
            <div className="p-2.5 bg-ece-cyan/10 border border-ece-cyan/30 rounded-lg text-[9px] font-mono space-y-1">
              <div className="flex justify-between text-ece-cyan font-bold">
                <span>CITIZEN SCHEME MATCH</span>
                <span>12+ STATES</span>
              </div>
              <p className="text-[10px] text-white font-sans">
                PM-Kisan & Karnataka Agri Welfare eligibility confirmed.
              </p>
            </div>

            {/* On-Device Regex SMS Expense Engine */}
            <div className="p-2.5 bg-white/5 rounded-lg text-[9px] font-mono space-y-1 border border-white/5">
              <span className="text-slate-400 block">ON-DEVICE SMS TRANSACTION PARSER</span>
              <div className="flex justify-between items-center text-white">
                <span>LOCAL CACHE:</span>
                <span className="text-emerald-400 font-bold">₹ 450.00 • DEBIT</span>
              </div>
            </div>

            {/* Spoken English Coach Streak */}
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400 text-center">
              FLUENCY SCORE: 88% • 5 DAY STREAK
            </div>
          </div>
        </Html>
      </group>

      {/* 2. Cloud Database Node (Supabase & PostgreSQL) */}
      <group ref={cloudNodeRef} position={[2.8, 1.6, -1]} visible={activeMode !== 'OFFLINE'}>
        <mesh>
          <boxGeometry args={[0.9, 0.6, 0.9]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#38bdf8"
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
        <Html position={[0, 0.6, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2.5 py-1 bg-black/90 border border-sky-400 rounded font-mono text-[9px] text-sky-400 whitespace-nowrap shadow-[0_0_15px_#38bdf8]">
            SUPABASE // POSTGRESQL RLS
          </div>
        </Html>
      </group>

      {/* 3. Local SQLite Storage Node */}
      <group ref={localDbNodeRef} position={[2.8, -1.6, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.5, 16]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive={activeMode === 'OFFLINE' ? '#f59e0b' : '#334155'}
            emissiveIntensity={activeMode === 'OFFLINE' ? 0.8 : 0.2}
            roughness={0.3}
          />
        </mesh>
        <Html position={[0, -0.5, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2.5 py-1 bg-black/90 border border-amber-400 rounded font-mono text-[9px] text-amber-400 whitespace-nowrap shadow-[0_0_15px_#f59e0b]">
            SQLITE // LOCAL OFFLINE CACHE
          </div>
        </Html>
      </group>

      {/* 4. AI Gemini Processing Particles */}
      <points ref={particleGroupRef} position={[-2.4, 0.5, -0.5]}>
        <sphereGeometry args={[1.4, 16, 16]} />
        <pointsMaterial
          size={0.06}
          color={activeMode === 'AI' ? '#00f0ff' : '#64748b'}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 5. Interactive Control Bar (Directly accessible above the phone) */}
      <Html position={[0, -2.4, 0]} center distanceFactor={6} pointerEvents="auto">
        <div className="flex items-center gap-1.5 p-1.5 bg-black/90 border border-ece-cyan/40 rounded-full backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.9)] select-none">
          <button
            onClick={() => handleModeChange('VOICE')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold transition-all',
              activeMode === 'VOICE'
                ? 'bg-ece-cyan text-black shadow-[0_0_12px_#00f0ff]'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>VOICE INPUT</span>
          </button>

          <button
            onClick={() => handleModeChange('AI')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold transition-all',
              activeMode === 'AI'
                ? 'bg-ece-cyan text-black shadow-[0_0_12px_#00f0ff]'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI PROCESSING</span>
          </button>

          <button
            onClick={() => handleModeChange('DB')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold transition-all',
              activeMode === 'DB'
                ? 'bg-sky-400 text-black shadow-[0_0_12px_#38bdf8]'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Database className="w-3.5 h-3.5" />
            <span>DATABASE</span>
          </button>

          <button
            onClick={() => handleModeChange('OFFLINE')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold transition-all',
              activeMode === 'OFFLINE'
                ? 'bg-amber-400 text-black shadow-[0_0_12px_#f59e0b]'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>OFFLINE MODE</span>
          </button>
        </div>
      </Html>
    </group>
  );
};
