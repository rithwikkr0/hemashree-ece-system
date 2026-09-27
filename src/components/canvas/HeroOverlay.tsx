import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { ECEDomain } from '../../types';
import { GlitchText } from '../common/GlitchText';
import { SystemBadge } from '../common/SystemBadge';
import { StatusIndicator } from '../common/StatusIndicator';
import { 
  Activity, 
  RotateCcw, 
  ChevronDown, 
  Sparkles, 
  ArrowRight,
  Cpu
} from 'lucide-react';
import clsx from 'clsx';

const PIPELINE_STEPS: ECEDomain[] = [
  'SIGNAL',
  'CIRCUIT',
  'HARDWARE',
  'EMBEDDED',
  'SOFTWARE',
  'AI',
];

export const HeroOverlay: React.FC = () => {
  const { 
    isBooting, 
    activeDomain, 
    setActiveDomain, 
    triggerAudio, 
    replayIntro 
  } = useSystem();

  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Traveling signal packet animation along the pipeline
  useEffect(() => {
    if (isBooting) return;
    const interval = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isBooting]);

  if (isBooting) return null;

  const scrollToNext = () => {
    triggerAudio('click');
    const target = document.getElementById('profile');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 z-20 select-none">
      
      {/* Top Left Header System Status */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SystemBadge label="ECE CORE // ONLINE" variant="cyan" size="sm" />
            <StatusIndicator status="nominal" label="SYSTEM ONLINE" size="sm" />
          </div>
          <p className="font-mono text-[10px] text-slate-400">
            ALLIANCE COLLEGE OF ENGINEERING AND DESIGN // 2024–2028
          </p>
        </div>

        {/* Replay Cinematic Button */}
        <button
          onClick={() => {
            triggerAudio('boot');
            replayIntro();
          }}
          className="group flex items-center gap-1.5 px-3 py-1 bg-black/60 hover:bg-ece-cyan/15 border border-white/10 hover:border-ece-cyan/40 text-slate-400 hover:text-white rounded-full font-mono text-[11px] transition-all duration-200"
          title="Replay opening cinematic boot sequence"
        >
          <RotateCcw className="w-3 h-3 transition-transform duration-300 group-hover:-rotate-90 text-ece-cyan" />
          <span>REPLAY BOOT</span>
        </button>
      </div>

      {/* Center Left / Main Hero Identity Typography */}
      <div className="max-w-2xl space-y-4 pointer-events-auto mt-auto mb-auto">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-ece-cyan tracking-widest bg-ece-cyan/10 border border-ece-cyan/30 px-3 py-1 rounded-sm backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-ece-cyan" />
          <span>HEMASHREE // ECE SYSTEM</span>
        </div>

        <h1 className="font-tech text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-none">
          <GlitchText text="HEMASHREE B M" />
        </h1>

        <div className="space-y-1">
          <p className="font-tech text-base sm:text-xl font-bold text-ece-cyan tracking-wider uppercase">
            ELECTRONICS & COMMUNICATION ENGINEERING
          </p>
          <p className="font-mono text-xs sm:text-sm text-slate-300 tracking-widest font-medium">
            HARDWARE × EMBEDDED × SIGNALS × AI
          </p>
        </div>

        {/* Core Concept Animated Pipeline */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 tracking-wider">
            <Activity className="w-3.5 h-3.5 text-ece-cyan animate-pulse" />
            <span>CORE PIPELINE VECTOR:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {PIPELINE_STEPS.map((domain, idx) => {
              const isSignalPacket = activeStepIdx === idx;
              const isSelected = activeDomain === domain;
              return (
                <React.Fragment key={domain}>
                  <button
                    onClick={() => {
                      triggerAudio('click');
                      setActiveDomain(domain);
                    }}
                    className={clsx(
                      'relative px-2.5 py-1 rounded text-xs font-mono tracking-wider transition-all duration-300 border backdrop-blur-md',
                      isSelected
                        ? 'bg-ece-cyan text-black font-bold border-ece-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                        : isSignalPacket
                        ? 'bg-ece-cyan/25 text-white border-ece-cyan/70 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-black/60 text-slate-300 border-white/10 hover:border-ece-cyan/40 hover:text-white'
                    )}
                  >
                    {isSignalPacket && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-ece-cyan animate-ping" />
                    )}
                    {domain}
                  </button>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <span className="text-slate-600 font-mono text-xs">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Interaction Micro-Hint */}
        <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-ece-cyan">
            <Sparkles className="w-3 h-3" />
            INTERACTION:
          </span>
          <span>Click ECE Core to pulse shockwave • Hover floating instruments</span>
        </div>
      </div>

      {/* Bottom Center Scroll Prompt */}
      <div className="flex flex-col items-center justify-center pointer-events-auto">
        <button
          onClick={scrollToNext}
          className="group flex flex-col items-center gap-1 text-slate-400 hover:text-ece-cyan transition-colors"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">
            EXPLORE SYSTEM PROFILE
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-ece-cyan" />
        </button>
      </div>

    </div>
  );
};
