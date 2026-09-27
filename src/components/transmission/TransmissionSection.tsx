import React from 'react';
import { SYSTEM_PROFILE } from '../../data/education';
import { PROJECTS_DATA } from '../../data/projects';
import { HACKATHON_MISSIONS } from '../../data/hackathons';
import { CERTIFICATIONS_DATA } from '../../data/certifications';
import { TechCorner } from '../common/TechCorner';
import { SystemBadge } from '../common/SystemBadge';
import { StatusIndicator } from '../common/StatusIndicator';
import { 
  Send, 
  Mail, 
  Linkedin, 
  Github, 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Radio, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Layers, 
  Compass, 
  Award,
  Terminal
} from 'lucide-react';

export const TransmissionSection: React.FC = () => {
  const mailtoSubject = encodeURIComponent('ECE Engineering Inquiry // Hemashree B M');
  const mailtoBody = encodeURIComponent(
    'Hello Hemashree,\n\nI reviewed your ECE System portfolio and would like to discuss an opportunity regarding:\n\n[Project / Internship / Collaboration Details]\n\nBest regards,\n[Your Name]\n[Organization]'
  );
  const directMailtoUrl = `mailto:${SYSTEM_PROFILE.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <section id="transmission" className="scroll-mt-24 space-y-10">
      
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ece-cyan tracking-widest">[SECTION 08 // OPEN CHANNEL]</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              RECRUITER UPLINK READY
            </span>
          </div>
          <h2 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white flex items-center gap-2 pt-1">
            <Send className="w-6 h-6 text-ece-cyan" />
            TRANSMISSION // OPEN CHANNEL
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <SystemBadge label="BEACON BROADCASTING" variant="cyan" />
          <StatusIndicator status="nominal" label="COMMUNICATIONS ACTIVE" />
        </div>
      </div>

      <p className="font-sans text-sm text-slate-300 max-w-3xl leading-relaxed">
        Direct communications console. Hemashree B M is available for B.Tech ECE undergraduate engineering internships, hardware-software co-design apprenticeships, and applied research collaborations. Connect directly via verified professional channels:
      </p>

      {/* 2. Futuristic Communications Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Primary Direct Transmission Action (Mailto) */}
        <div className="lg:col-span-7 bg-ece-obsidian/95 border-2 border-ece-cyan/40 rounded tech-corner-cut p-6 backdrop-blur-xl space-y-5 shadow-[0_0_35px_rgba(0,240,255,0.15)] flex flex-col justify-between">
          <TechCorner position="top-left" variant="cyan" size={12} />
          <TechCorner position="top-right" variant="cyan" size={12} />
          <TechCorner position="bottom-left" variant="cyan" size={12} />
          <TechCorner position="bottom-right" variant="cyan" size={12} />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-ece-cyan font-bold">
                <Radio className="w-4 h-4 text-ece-cyan animate-pulse" />
                <span>DIRECT UPLINK BEACON</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">ENCRYPTION: SSL / TLS</span>
            </div>

            <h3 className="font-tech text-xl sm:text-2xl font-bold text-white uppercase leading-snug">
              DISPATCH TECHNICAL INQUIRY OR RECRUITMENT TRANSMISSION
            </h3>

            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              Initiates an authentic direct email dispatch to the verified candidate mailbox. Ideal for interview scheduling, technical role inquiries, or hardware capstone discussions.
            </p>

            <div className="p-3.5 bg-black/60 rounded border border-white/10 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase">VERIFIED RECIPIENT:</span>
                <span className="text-white font-semibold">{SYSTEM_PROFILE.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase">PRIMARY EMAIL ADDRESS:</span>
                <span className="text-ece-cyan font-semibold break-all">{SYSTEM_PROFILE.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase">LOCATION CADENCE:</span>
                <span className="text-slate-200">Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Action Button: SEND TRANSMISSION */}
          <div className="pt-2">
            <a
              href={directMailtoUrl}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-ece-cyan text-black font-tech font-bold text-sm tracking-wider uppercase rounded hover:bg-cyan-300 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            >
              <Send className="w-4 h-4" />
              <span>SEND TRANSMISSION (DIRECT EMAIL)</span>
            </a>
            <span className="text-[10px] font-mono text-slate-500 block text-center mt-2">
              Opens client default mail handler with pre-populated inquiry template
            </span>
          </div>
        </div>

        {/* Right: Public Professional Channel Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          
          {/* GitHub Channel */}
          <a
            href={SYSTEM_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-ece-obsidian/90 border border-white/10 hover:border-ece-cyan/50 rounded tech-corner-cut backdrop-blur-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-ece-cyan/40">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase">CODE REPOSITORY</span>
                <h4 className="font-tech text-base font-bold text-white group-hover:text-ece-cyan transition-colors">
                  GitHub // Hemashreebm
                </h4>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-ece-cyan transition-colors" />
          </a>

          {/* LinkedIn Channel */}
          <a
            href={SYSTEM_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-ece-obsidian/90 border border-white/10 hover:border-[#0077b5]/50 rounded tech-corner-cut backdrop-blur-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#0077b5]/10 border border-[#0077b5]/30 flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-[#0077b5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase">PROFESSIONAL NETWORK</span>
                <h4 className="font-tech text-base font-bold text-white group-hover:text-ece-cyan transition-colors">
                  LinkedIn // Hemashree B M
                </h4>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-ece-cyan transition-colors" />
          </a>

          {/* Lifemate Live Application Deployment */}
          {SYSTEM_PROFILE.lifemateLive && (
            <a
              href={SYSTEM_PROFILE.lifemateLive}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-ece-obsidian/90 border border-white/10 hover:border-emerald-500/50 rounded tech-corner-cut backdrop-blur-md transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">PRODUCTION DEPLOYMENT</span>
                  <h4 className="font-tech text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Lifemate App // Live Portal
                  </h4>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </a>
          )}

          {/* Academic Source Guarantee Note */}
          <div className="p-3 bg-black/40 border border-white/5 rounded font-mono text-[10px] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STRICT CREDENTIAL VERIFICATION POLICY</span>
            </div>
            <p className="text-slate-400 font-sans leading-tight">
              All communications, transcripts, and records originate from Alliance College of Engineering and Design.
            </p>
          </div>
        </div>

      </div>

      {/* 3. FINAL SYSTEM STATUS BAR */}
      <div className="p-5 bg-black/80 border border-ece-cyan/30 rounded tech-corner-cut backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-ece-cyan" />
            <span className="font-mono text-xs text-white font-bold tracking-widest uppercase">
              FINAL SYSTEM STATUS TELEMETRY
            </span>
          </div>
          <StatusIndicator status="nominal" label="TELEMETRY ALL GREEN" size="sm" />
        </div>

        {/* Real Counts Grid from Source Files */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-2.5 bg-ece-obsidian rounded border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase block">SYSTEM STATUS</span>
            <span className="text-emerald-400 font-bold font-tech text-sm block">ONLINE</span>
          </div>

          <div className="p-2.5 bg-ece-obsidian rounded border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase block">ECE CORE</span>
            <span className="text-ece-cyan font-bold font-tech text-sm block">ACTIVE</span>
          </div>

          <div className="p-2.5 bg-ece-obsidian rounded border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase block">PROJECT SYSTEMS</span>
            <span className="text-white font-bold font-tech text-sm block">{PROJECTS_DATA.length} SYSTEMS</span>
          </div>

          <div className="p-2.5 bg-ece-obsidian rounded border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase block">SIGNAL LAB</span>
            <span className="text-ece-cyan font-bold font-tech text-sm block">ACTIVE</span>
          </div>

          <div className="p-2.5 bg-ece-obsidian rounded border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase block">MISSION ARCHIVE</span>
            <span className="text-emerald-400 font-bold font-tech text-sm block">{HACKATHON_MISSIONS.length} LOGGED</span>
          </div>

          <div className="p-2.5 bg-ece-obsidian rounded border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase block">CREDENTIALS</span>
            <span className="text-white font-bold font-tech text-sm block">{CERTIFICATIONS_DATA.length} VERIFIED</span>
          </div>
        </div>

        {/* Bottom Credits & Academic Provenance */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
          <div>
            HEMASHREE B M // B.TECH ECE // ALLIANCE UNIVERSITY [2024 — 2028]
          </div>
          <div>
            CORE: SIGNAL → CIRCUIT → HARDWARE → EMBEDDED → SOFTWARE → AI → REAL WORLD
          </div>
        </div>
      </div>

    </section>
  );
};
