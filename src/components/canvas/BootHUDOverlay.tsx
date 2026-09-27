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
    <div 
      onClick={skipIntro}
      className="fixed inset-0 z-50 pointer-events-auto cursor-pointer flex flex-col justify-between p-6 sm:p-10 select-none bg-black/40 backdrop-blur-[2px]"
      title="Click anywhere to skip intro"
    >
      {/* Top Header: Clear Skip control */}
      <div className="flex items-center justify-end w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            skipIntro();
          }}
          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-slate-300 hover:text-white font-mono text-xs tracking-wider transition-all"
          title="Skip to Hero"
        >
          SKIP INTRO →
        </button>
      </div>

      {/* Middle Minimal Identity Reveal */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        
        {/* SCENE 01 & 02: Subtle Electrical Pulse */}
        {(stage === 'BOOT' || stage === 'PCB_POWER') && (
          <div className="text-center space-y-3 max-w-xs animate-fade-in">
            {/* Horizontal Traveling Electrical Pulse Line */}
            <div className="relative w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
              <div className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-ece-cyan to-transparent animate-trace-flow" />
            </div>
            <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
              HEMASHREE // ECE SYSTEM
            </p>
          </div>
        )}

        {/* SCENE 03: Main Portrait & Identity Reveal */}
        {stage === 'PORTRAIT_REVEAL' && (
          <div className="text-center space-y-2 max-w-md w-full animate-fade-in px-4">
            <h2 className="font-tech text-3xl sm:text-4xl font-extrabold text-white tracking-wider uppercase">
              <GlitchText text="HEMASHREE B M" triggerOnMount />
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ece-cyan tracking-wider font-medium">
              Electronics & Communication Engineering
            </p>
            <p className="font-mono text-[11px] text-slate-400 pt-1">
              Alliance University • 2024–2028
            </p>
          </div>
        )}

      </div>

      {/* Bottom Minimal Hint */}
      <div className="flex items-center justify-center font-mono text-[10px] text-slate-500/70 pt-2">
        <span>PRESS ESC OR CLICK ANYWHERE TO SKIP</span>
      </div>
    </div>
  );
};
