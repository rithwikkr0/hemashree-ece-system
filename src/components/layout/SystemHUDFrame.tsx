import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { Volume2, VolumeX, Gauge, ShieldCheck, Terminal } from 'lucide-react';
import clsx from 'clsx';
import { ECEDomain } from '../../types';

const DOMAIN_SEQUENCE: ECEDomain[] = [
  'SIGNAL',
  'CIRCUIT',
  'HARDWARE',
  'EMBEDDED',
  'SOFTWARE',
  'AI',
  'REAL_WORLD',
];

export const SystemHUDFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isBooting,
    systemTime,
    uptimeSeconds,
    soundEnabled,
    toggleSound,
    performanceMode,
    setPerformanceMode,
    activeDomain,
    setActiveDomain,
    triggerAudio,
  } = useSystem();

  const cyclePerformance = () => {
    triggerAudio('toggle');
    if (performanceMode === 'high') setPerformanceMode('medium');
    else if (performanceMode === 'medium') setPerformanceMode('low');
    else setPerformanceMode('high');
  };

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="relative min-h-screen bg-ece-bg text-ece-text selection:bg-ece-cyan selection:text-black">
      {/* Background Subtle Gradient & Quiet Texture */}
      <div className="fixed inset-0 pcb-grid pointer-events-none opacity-10 z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,8,12,0.92)_100%)] pointer-events-none z-0" />

      {/* Top Right Quick Controls: Audio & Performance (shown only after boot completes) */}
      {!isBooting && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2 font-mono text-[10px] select-none">
        {/* Performance Mode Switcher */}
        <button
          onClick={cyclePerformance}
          title={`Performance mode: ${performanceMode.toUpperCase()} (Click to toggle)`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-slate-400 hover:text-white rounded-full transition-colors"
        >
          <Gauge className="w-3.5 h-3.5 text-ece-cyan" />
          <span className="hidden sm:inline uppercase text-[10px] font-medium text-slate-300">
            {performanceMode}
          </span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            toggleSound();
            triggerAudio('toggle');
          }}
          title={soundEnabled ? 'Mute Audio' : 'Enable Subtle Synthesized Audio'}
          className={clsx(
            'flex items-center justify-center w-8 h-8 bg-black/60 backdrop-blur-md border rounded-full transition-all',
            soundEnabled
              ? 'border-ece-cyan/60 text-ece-cyan shadow-[0_0_10px_rgba(0,240,255,0.25)]'
              : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'
          )}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="relative z-10">{children}</main>
    </div>
  );
};
