import React, { useState } from 'react';
import { SYSTEM_PROFILE } from '../../data/education';
import { ASSET_PATHS } from '../../config/assets';
import { CinematicInterstitialModal } from '../common/CinematicInterstitialModal';
import { 
  Zap, 
  Cpu, 
  Layers, 
  Activity, 
  Smartphone, 
  Terminal,
  ExternalLink,
  FileText,
  Github,
  Film,
  ChevronDown
} from 'lucide-react';
import clsx from 'clsx';

type CapabilityKey = 'ELECTRONICS' | 'EMBEDDED' | 'IoT' | 'DSP' | 'MOBILE' | 'AI';

interface DomainMeta {
  key: CapabilityKey;
  label: string;
  icon: React.FC<{ className?: string }>;
  tagline: string;
  description: string;
  skills: string[];
  projects: string[];
}

const DOMAINS: DomainMeta[] = [
  {
    key: 'ELECTRONICS',
    label: 'Electronics',
    icon: Zap,
    tagline: 'Analog Circuits & RF',
    description: 'Analog circuit analysis, LM358 signal conditioning, RF sniffer topologies, and switching power circuits.',
    skills: ['Circuit Design', 'LM358 Op-Amps', 'RF Sniffers', 'Power Electronics', 'VHDL'],
    projects: ['RF Activity Detection', 'Smart Ambient Light', 'Solar Dewatering']
  },
  {
    key: 'EMBEDDED',
    label: 'Embedded',
    icon: Cpu,
    tagline: 'Microcontrollers & Firmware',
    description: 'Bare-metal and HAL firmware in C/Embedded C across ATmega328P and ESP32 with register-level timers and interrupts.',
    skills: ['C / Embedded C', 'ATmega328P', 'ESP32', 'GPIO & Timers', 'UART Protocols'],
    projects: ['Smart Blind Stick', 'Bluetooth Home Automation', 'Solar Dewatering']
  },
  {
    key: 'IoT',
    label: 'IoT',
    icon: Layers,
    tagline: 'Connected Systems',
    description: 'Connected sensor networks, Bluetooth UART serial control, optoisolated relay switching, and edge telemetry.',
    skills: ['ESP32 Wireless', 'Bluetooth HC-05', 'Relay Switching', 'Sensor Networks'],
    projects: ['Bluetooth Home Automation', 'Bhoomi Mitra']
  },
  {
    key: 'DSP',
    label: 'DSP',
    icon: Activity,
    tagline: 'Signal Processing',
    description: 'Discrete-time signals, FIR windowed sinc and IIR Butterworth filter cascade synthesis, and MATLAB spectral analysis.',
    skills: ['Signals & Systems', 'FIR / IIR Filters', 'MATLAB Signal Toolbox', 'FFT Spectral Analysis'],
    projects: ['Digital Audio Filter Lab', 'Signal Interactive Suite']
  },
  {
    key: 'MOBILE',
    label: 'Mobile',
    icon: Smartphone,
    tagline: 'Cross-Platform Applications',
    description: 'Production cross-platform client development in Flutter & Dart with offline-first local SQLite cache and responsive UI.',
    skills: ['Flutter & Dart', 'Offline SQLite', 'Android STT/TTS', 'Responsive UX'],
    projects: ['Lifemate AI Mobile App']
  },
  {
    key: 'AI',
    label: 'AI',
    icon: Terminal,
    tagline: 'Edge & Conversational Models',
    description: 'Edge-proxied conversational LLM reasoning via Gemini API, Google ML Kit on-device vision, and Supabase RLS databases.',
    skills: ['Gemini AI API', 'Google ML Kit', 'Python', 'Supabase & SQL'],
    projects: ['Lifemate AI', 'Bhoomi Mitra Satellite Advisory']
  },
];

export const SystemProfileSection: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<CapabilityKey | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const activeDomainData = DOMAINS.find((d) => d.key === selectedDomain);

  return (
    <section id="profile" className="scroll-mt-24 space-y-16">
      {/* Veo Cinematic Modal */}
      <CinematicInterstitialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Main Profile Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left: Original Photo */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-[0_12px_50px_rgba(0,0,0,0.7)] bg-black/50">
            <img
              src={ASSET_PATHS.portraits.verifiedOriginal}
              alt="Hemashree B M"
              className="w-full h-full object-cover filter contrast-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-ece-cyan transition-colors"
          >
            <Film className="w-3.5 h-3.5" />
            <span>VIEW CINEMATIC REEL (VEO)</span>
          </button>
        </div>

        {/* Right: Candidate Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
              PROFILE // ACADEMIC RECORD
            </span>
            <h2 className="font-tech text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
              {SYSTEM_PROFILE.name}
            </h2>
            <div className="space-y-1 text-slate-300 font-sans">
              <p className="text-lg sm:text-xl font-medium text-white">
                B.Tech — Electronics & Communication Engineering
              </p>
              <p className="text-sm text-slate-400 font-mono">
                Alliance University • 2024–2028 • CGPA 7.50 / 10
              </p>
            </div>
          </div>

          <p className="font-sans text-base text-slate-300 leading-relaxed max-w-2xl">
            Undergraduate engineer focused on hardware-software integration across embedded systems, analog & digital electronics, real-time digital signal processing, and applied edge intelligence. Combining hands-on bench prototyping with production software architectures.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={ASSET_PATHS.resume.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase rounded-full hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>VIEW RESUME</span>
            </a>

            <a
              href={SYSTEM_PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-black/60 hover:bg-white/10 text-white font-sans font-medium text-xs tracking-wider uppercase rounded-full border border-white/20 hover:border-white/40 transition-all flex items-center gap-2"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GITHUB</span>
            </a>
          </div>
        </div>

      </div>

      {/* Six Engineering Domains as Large Clean Cards */}
      <div className="space-y-6">
        <div>
          <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase block mb-1">
            CORE CAPABILITIES
          </span>
          <h3 className="font-tech text-2xl sm:text-3xl font-extrabold text-white uppercase">
            ENGINEERING DOMAINS
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain.key;
            const Icon = domain.icon;
            return (
              <button
                key={domain.key}
                onClick={() => setSelectedDomain(isSelected ? null : domain.key)}
                className={clsx(
                  'text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 group',
                  isSelected
                    ? 'bg-white/10 border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-black/40 hover:bg-black/70 border-white/10 hover:border-white/25'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    isSelected ? 'bg-white text-black' : 'bg-white/5 text-ece-cyan group-hover:bg-white/10'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronDown className={clsx(
                    'w-4 h-4 text-slate-500 transition-transform duration-300',
                    isSelected && 'rotate-180 text-white'
                  )} />
                </div>

                <div className="space-y-1">
                  <h4 className="font-tech text-lg sm:text-xl font-bold text-white uppercase">
                    {domain.label}
                  </h4>
                  <p className="font-sans text-xs text-slate-400">
                    {domain.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Clean Expandable Detail Area */}
        {activeDomainData && (
          <div className="p-6 sm:p-8 bg-black/60 border border-white/15 rounded-2xl space-y-6 animate-fade-in backdrop-blur-md">
            <div className="space-y-2">
              <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
                {activeDomainData.label} // ARCHITECTURE & EVIDENCE
              </span>
              <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                {activeDomainData.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  VERIFIED COMPETENCIES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeDomainData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  DIRECT PROJECT APPLICATIONS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeDomainData.projects.map((proj) => (
                    <span
                      key={proj}
                      className="px-3 py-1 bg-ece-cyan/10 border border-ece-cyan/30 rounded-full font-mono text-xs text-ece-cyan"
                    >
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default SystemProfileSection;
