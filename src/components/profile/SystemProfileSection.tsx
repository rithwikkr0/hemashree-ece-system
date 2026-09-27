import React, { useState } from 'react';
import { SYSTEM_PROFILE, EDUCATION_RECORDS } from '../../data/education';
import { SKILL_GROUPS } from '../../data/skills';
import { ASSET_PATHS, FALLBACK_HOLOGRAM_PORTRAIT, NANO_BANANA_PORTRAITS } from '../../config/assets';
import { CinematicInterstitialModal } from '../common/CinematicInterstitialModal';
import { TechCorner } from '../common/TechCorner';
import { SystemBadge } from '../common/SystemBadge';
import { StatusIndicator } from '../common/StatusIndicator';
import { GlitchText } from '../common/GlitchText';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Zap, 
  Smartphone, 
  Layers, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Github, 
  Linkedin,
  Terminal,
  ExternalLink,
  ChevronRight,
  Film
} from 'lucide-react';
import clsx from 'clsx';

type CapabilityKey = 'ELECTRONICS' | 'EMBEDDED' | 'IoT' | 'DSP' | 'MOBILE' | 'AI';

interface CapabilityMeta {
  key: CapabilityKey;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  skillNames: string[];
}

const CAPABILITY_LIST: CapabilityMeta[] = [
  {
    key: 'ELECTRONICS',
    label: 'ELECTRONICS',
    icon: Zap,
    description: 'Analog circuit analysis, LM358 op-amp signal conditioning, RF sniffer topologies, and switching power circuits.',
    skillNames: [
      'Digital Electronics',
      'Circuit Design & Analysis',
      'LM358 Signal Conditioning',
      'RF Sniffer Circuitry',
      'Principles of Communication',
      'Power Electronics & Switching',
      'VHDL'
    ],
  },
  {
    key: 'EMBEDDED',
    label: 'EMBEDDED',
    icon: Cpu,
    description: 'Bare-metal and HAL firmware in C/Embedded C across ATmega328P and ESP32 with register-level timers and interrupts.',
    skillNames: [
      'C',
      'Embedded C',
      'Arduino Uno / Nano',
      'ESP32',
      'GPIO & Peripheral Control',
      'Timers & Hardware Interrupts',
      'UART Serial Protocol',
      'Sensor & Actuator Interfacing'
    ],
  },
  {
    key: 'IoT',
    label: 'IoT',
    icon: Layers,
    description: 'Connected sensor networks, Bluetooth UART serial control, optoisolated relay switching, and edge telemetry.',
    skillNames: [
      'ESP32',
      'UART Serial Protocol',
      'Sensor & Actuator Interfacing',
      'Power Electronics & Switching',
      'Bluetooth HC-05'
    ],
  },
  {
    key: 'DSP',
    label: 'DSP',
    icon: Activity,
    description: 'Discrete-time signals, FIR windowed sinc and IIR Butterworth filter cascade synthesis, and MATLAB spectral analysis.',
    skillNames: [
      'Signals & Systems',
      'Digital Signal Processing',
      'FIR / IIR Filter Design',
      'MATLAB Signal Toolbox',
      'Audio Noise Attenuation',
      'MATLAB'
    ],
  },
  {
    key: 'MOBILE',
    label: 'MOBILE',
    icon: Smartphone,
    description: 'Production cross-platform client development in Flutter & Dart with offline-first local SQLite cache and responsive UI.',
    skillNames: [
      'Flutter & Dart',
      'Android STT / TTS',
      'SQLite (Offline First)',
      'Dart'
    ],
  },
  {
    key: 'AI',
    label: 'AI',
    icon: Terminal,
    description: 'Edge-proxied conversational LLM reasoning via Gemini API, Google ML Kit on-device vision, and Supabase RLS databases.',
    skillNames: [
      'Gemini AI API',
      'Google ML Kit',
      'Supabase & PostgreSQL',
      'Python',
      'Supabase Edge Functions'
    ],
  },
];

export const SystemProfileSection: React.FC = () => {
  const [selectedCapability, setSelectedCapability] = useState<CapabilityKey>('EMBEDDED');
  const [selectedPortraitId, setSelectedPortraitId] = useState<string>('hero');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const activeCap = CAPABILITY_LIST.find((c) => c.key === selectedCapability) || CAPABILITY_LIST[0];
  const activePortrait = NANO_BANANA_PORTRAITS.find((p) => p.id === selectedPortraitId) || NANO_BANANA_PORTRAITS[0];

  return (
    <section id="profile" className="scroll-mt-24 space-y-8">
      {/* Veo Cinematic Interstitial Modal */}
      <CinematicInterstitialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ece-cyan tracking-widest">[SYSTEM IDENTITY // 02]</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              ACADEMIC SOURCE OF TRUTH
            </span>
          </div>
          <h2 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white flex items-center gap-2 pt-1">
            <Cpu className="w-6 h-6 text-ece-cyan" />
            PROFILE // SYSTEM IDENTITY
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-ece-cyan/15 hover:bg-ece-cyan/25 border border-ece-cyan/40 text-ece-cyan rounded text-[11px] font-mono transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Film className="w-3.5 h-3.5" />
            <span>VEO CINEMATICS (7)</span>
          </button>
          <SystemBadge label="ECE CORE ONLINE" variant="cyan" />
        </div>
      </div>

      {/* Hero Layout: Left Large Futuristic Portrait / Right Technical Identity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Large Futuristic Hologram Portrait */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-md bg-ece-obsidian/90 border border-ece-cyan/30 rounded tech-corner-cut p-4 shadow-[0_0_35px_rgba(0,240,255,0.12)]">
            <TechCorner position="top-left" variant="cyan" size={12} />
            <TechCorner position="top-right" variant="cyan" size={12} />
            <TechCorner position="bottom-left" variant="cyan" size={12} />
            <TechCorner position="bottom-right" variant="cyan" size={12} />

            <div className="flex items-center justify-between mb-3 px-1 text-[10px] font-mono">
              <span className="text-ece-cyan font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ece-cyan animate-ping" />
                BIOMETRIC RECOGNITION // VERIFIED
              </span>
              <span className="text-slate-400">ID: {EDUCATION_RECORDS[0].registerNumber}</span>
            </div>

            <div className="relative w-full h-[380px] overflow-hidden bg-black rounded border border-white/10 group">
              <img
                src={activePortrait.path}
                alt={activePortrait.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = activePortrait.fallbackPath || FALLBACK_HOLOGRAM_PORTRAIT;
                }}
                className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-transparent to-transparent opacity-85" />
              
              {/* Overlay Metadata Chips */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono bg-black/85 backdrop-blur-md px-3 py-2 rounded border border-ece-cyan/30">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block text-[9px]">INSTITUTION</span>
                  <span className="text-white font-semibold">ALLIANCE UNIVERSITY</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-slate-400 block text-[9px]">CUMULATIVE CGPA</span>
                  <span className="text-ece-cyan font-bold text-xs">{SYSTEM_PROFILE.currentCGPA}</span>
                </div>
              </div>
            </div>

            {/* Nano Banana Portrait Concept Switcher */}
            <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-1">
                <span>NANO BANANA PORTRAIT SLOTS:</span>
                <span className="text-ece-cyan font-bold">{activePortrait.name}</span>
              </div>
              <div className="grid grid-cols-6 gap-1 font-mono text-[9px]">
                {NANO_BANANA_PORTRAITS.map((p) => {
                  const isPActive = p.id === selectedPortraitId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPortraitId(p.id)}
                      className={clsx(
                        'py-1 rounded border text-center transition-all truncate px-1',
                        isPActive
                          ? 'bg-ece-cyan text-black font-bold border-ece-cyan shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                          : 'bg-black/60 text-slate-400 hover:text-white border-white/10'
                      )}
                      title={p.name}
                    >
                      {p.id.slice(0, 4).toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Public Links Footer */}
            <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
              <a
                href={SYSTEM_PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 bg-black/60 hover:bg-white/10 text-slate-300 hover:text-white rounded border border-white/10 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GITHUB</span>
              </a>
              <a
                href={SYSTEM_PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 bg-ece-cyan/15 hover:bg-ece-cyan/25 text-ece-cyan rounded border border-ece-cyan/30 transition-colors font-semibold"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Technical Identity & Diagnostic Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Candidate Primary Identity */}
          <div className="bg-ece-obsidian/90 border border-ece-cyan/30 rounded tech-corner-cut p-6 backdrop-blur-md space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-ece-cyan">
                <span>[CANDIDATE DOSSIER]</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <h1 className="font-tech text-3xl sm:text-4xl font-black text-white tracking-wide uppercase">
                <GlitchText text={SYSTEM_PROFILE.name} />
              </h1>
              <p className="font-tech text-lg font-bold text-ece-cyan uppercase tracking-wider">
                B.Tech — Electronics & Communication Engineering
              </p>
              <p className="font-mono text-xs text-slate-400">
                Alliance College of Engineering and Design, Alliance University (2024 — 2028)
              </p>
            </div>

            <p className="font-sans text-sm text-slate-300 leading-relaxed pt-1">
              {SYSTEM_PROFILE.systemSummary}
            </p>

            {/* Quick Diagnostic Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-black/50 border border-white/5 rounded tech-corner-cut-sm">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">DEGREE</span>
                <span className="font-tech text-sm font-bold text-white block mt-0.5">B.Tech ECE</span>
                <span className="text-[9px] font-mono text-emerald-400">In Progress</span>
              </div>

              <div className="p-3 bg-black/50 border border-white/5 rounded tech-corner-cut-sm">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">INSTITUTION</span>
                <span className="font-tech text-sm font-bold text-white block mt-0.5 truncate" title="Alliance University">Alliance Univ</span>
                <span className="text-[9px] font-mono text-slate-400">ACED</span>
              </div>

              <div className="p-3 bg-black/50 border border-white/5 rounded tech-corner-cut-sm">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">DURATION</span>
                <span className="font-tech text-sm font-bold text-white block mt-0.5">2024–2028</span>
                <span className="text-[9px] font-mono text-ece-cyan">Undergraduate</span>
              </div>

              <div className="p-3 bg-black/50 border border-white/5 rounded tech-corner-cut-sm">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">CURRENT CGPA</span>
                <span className="font-tech text-sm font-bold text-ece-cyan block mt-0.5">7.50 / 10.0</span>
                <span className="text-[9px] font-mono text-emerald-400">Verified</span>
              </div>
            </div>

            {/* Non-sensitive Location Diagnostic */}
            <div className="flex items-center gap-2 p-2.5 bg-black/40 border border-white/5 rounded font-mono text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-ece-cyan flex-shrink-0" />
              <span>LOCATION: <strong className="text-white">Bengaluru, Karnataka, India</strong></span>
              <span className="text-slate-500 text-[10px] hidden sm:inline">• Central Campus ACED</span>
            </div>
          </div>

          {/* Interactive Engineering Capability Map */}
          <div className="bg-ece-obsidian/90 border border-white/10 rounded tech-corner-cut p-6 backdrop-blur-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-ece-cyan" />
                <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                  ENGINEERING CAPABILITY MAP
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                CLICK CAPABILITY TO INSPECT VERIFIED SKILLS
              </span>
            </div>

            {/* 6 Capability Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {CAPABILITY_LIST.map((cap) => {
                const isSelected = selectedCapability === cap.key;
                const Icon = cap.icon;
                return (
                  <button
                    key={cap.key}
                    onClick={() => setSelectedCapability(cap.key)}
                    className={clsx(
                      'flex flex-col items-center justify-center p-2.5 rounded border font-mono text-xs transition-all duration-200',
                      isSelected
                        ? 'bg-ece-cyan text-black font-bold border-ece-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                        : 'bg-black/50 text-slate-300 border-white/10 hover:border-ece-cyan/50 hover:text-white'
                    )}
                  >
                    <Icon className={clsx('w-4 h-4 mb-1', isSelected ? 'text-black' : 'text-ece-cyan')} />
                    <span className="text-[10px] tracking-wider font-bold">{cap.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Capability Skill Inspection Box */}
            <div className="p-4 bg-black/60 border border-ece-cyan/30 rounded space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ece-cyan font-bold tracking-wider">
                  [{activeCap.label}] // VERIFIED SKILL VECTORS
                </span>
                <span className="text-slate-400 text-[10px]">
                  {activeCap.skillNames.length} SKILLS MAPPED
                </span>
              </div>

              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                {activeCap.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCap.skillNames.map((skillName) => (
                  <span
                    key={skillName}
                    className="font-mono text-xs px-2.5 py-1 bg-ece-cyan/10 border border-ece-cyan/30 text-white rounded tech-corner-cut-sm shadow-[0_0_8px_rgba(0,240,255,0.15)]"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
