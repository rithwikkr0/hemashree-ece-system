import React from 'react';
import { useSystem, BootStage } from '../../context/SystemContext';
import { FastForward, CheckCircle2, Shield, Radio, Terminal } from 'lucide-react';
import clsx from 'clsx';
import { GlitchText } from '../common/GlitchText';

interface BootHUDOverlayProps {
  stage: BootStage;
}

export const BootHUDOverlay: React.FC<BootHUDOverlayProps> = ({ stage }) => {
  const { skipIntro, isBooting } = useSystem();

  if (!isBooting || stage === 'HERO') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Header: System Status & SKIP INTRO button */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="flex items-center gap-3 font-mono text-xs text-ece-cyan bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-ece-cyan/30">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          <span className="tracking-widest uppercase">
            ECE_OS // BOOT_SEQ [{stage}]
          </span>
        </div>

        <button
          onClick={skipIntro}
          className="group flex items-center gap-2 px-3.5 py-1.5 bg-black/70 hover:bg-ece-cyan/20 border border-ece-cyan/40 hover:border-ece-cyan text-ece-cyan font-mono text-xs rounded transition-all duration-200 shadow-[0_0_15px_rgba(0,240,255,0.2)] focus:outline-none focus:ring-1 focus:ring-ece-cyan"
          title="Skip opening cinematic to Hero ECE Core (Escape/Click)"
        >
          <span className="tracking-wider font-semibold">SKIP INTRO</span>
          <FastForward className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Middle Stage-Specific HUD Visualizations */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        
        {/* SCENE 01: BLACK BOOT */}
        {stage === 'BOOT' && (
          <div className="text-center space-y-4 max-w-md animate-fade-in">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-ece-cyan animate-ping" />
              <span>INITIALIZING ECE CORE...</span>
            </div>
            {/* Horizontal Traveling Electrical Pulse Line */}
            <div className="relative w-64 sm:w-80 h-[2px] bg-slate-800 mx-auto overflow-hidden rounded">
              <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-ece-cyan to-transparent animate-trace-flow shadow-[0_0_12px_#00f0ff]" />
            </div>
            <div className="font-mono text-[11px] text-ece-text-dim">
              SYSTEM CHECK 01/07 // VOLTAGE NOMINAL
            </div>
          </div>
        )}

        {/* SCENE 02 & 03: PCB POWER-UP */}
        {(stage === 'PCB_POWER' || stage === 'CAMERA_FLIGHT') && (
          <div className="w-full max-w-sm bg-black/75 backdrop-blur-md border border-ece-cyan/30 p-4 rounded tech-corner-cut space-y-2 animate-fade-in self-end mb-8 ml-4">
            <div className="font-mono text-[10px] text-ece-cyan tracking-widest border-b border-white/10 pb-1 flex items-center justify-between">
              <span>HARDWARE TELEMETRY</span>
              <span className="animate-pulse">ENGAGED</span>
            </div>
            <div className="font-mono text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span>POWER RAIL</span>
                <span className="text-emerald-400 font-bold">ONLINE (3.3V / 5.0V)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>GPIO REGISTERS</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>SENSORS ADC</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>SIGNAL BUS</span>
                <span className="text-ece-cyan font-bold">ACTIVE // 16.0 MHz <span className="text-slate-500 text-[9px]">[SIM]</span></span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 04 & 05: PORTRAIT HUD SCAN */}
        {(stage === 'PORTRAIT_REVEAL' || stage === 'HUD_SCAN') && (
          <div className="relative border border-ece-cyan/60 bg-black/60 backdrop-blur-md p-5 rounded tech-corner-cut max-w-sm sm:max-w-md w-full shadow-[0_0_30px_rgba(0,240,255,0.25)] animate-fade-in">
            {/* HUD Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-ece-cyan" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-ece-cyan" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-ece-cyan" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-ece-cyan" />

            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest">
                IDENTITY VERIFIED // BIOMETRIC LOCK
              </span>
            </div>

            <div className="space-y-1 border-t border-b border-white/10 py-3 my-2">
              <h2 className="font-tech text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                <GlitchText text="HEMASHREE B M" triggerOnMount />
              </h2>
              <p className="font-mono text-xs text-ece-cyan tracking-widest font-semibold">
                ELECTRONICS & COMMUNICATION ENGINEERING
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
              <div>
                <span className="text-slate-500 block text-[9px]">SYSTEM PROFILE</span>
                <span className="text-slate-300 font-bold">ECE // 2024–2028</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">INSTITUTION</span>
                <span className="text-slate-300 font-bold">ALLIANCE UNIVERSITY</span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 06 & 07: PARTICLE TRANSFORMATION & ECE CORE ONLINE */}
        {(stage === 'PARTICLE_TRANSFORM' || stage === 'CORE_ACTIVATE') && (
          <div className="text-center space-y-3 animate-fade-in">
            <div className="inline-block px-4 py-1.5 bg-ece-cyan/20 border border-ece-cyan rounded-full font-mono text-xs text-ece-cyan font-bold tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              PORTRAIT → SIGNAL → CIRCUIT → ECE CORE
            </div>
            <h2 className="font-tech text-3xl sm:text-5xl font-black text-white uppercase tracking-wider">
              ECE CORE // ONLINE
            </h2>
            <p className="font-mono text-xs text-slate-300 tracking-wider">
              HARDWARE • EMBEDDED • SIGNALS • AI
            </p>
          </div>
        )}

      </div>

      {/* Bottom Telemetry Footer during boot */}
      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 border-t border-white/5 pt-2">
        <span>SECURITY LEVEL: RESEARCH // UNRESTRICTED</span>
        <span>ACED // ALLIANCE UNIVERSITY</span>
      </div>
    </div>
  );
};
