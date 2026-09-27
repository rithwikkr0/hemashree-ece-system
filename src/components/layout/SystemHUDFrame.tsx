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
      {/* Background Circuit Grid & Subtle Vignette */}
      <div className="fixed inset-0 pcb-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,8,12,0.85)_100%)] pointer-events-none z-0" />

      {/* Top Left Engineering Identification */}
      <header className="fixed top-3 left-4 z-40 hidden sm:flex items-center gap-3 font-mono text-[11px] select-none">
        <div className="flex items-center justify-center w-7 h-7 bg-ece-cyan/10 border border-ece-cyan/40 rounded-sm">
          <Terminal className="w-3.5 h-3.5 text-ece-cyan" />
        </div>
        <div className="flex flex-col">
          <span className="font-tech font-bold text-white tracking-widest text-xs flex items-center gap-2">
            HEMASHREE B M
            <span className="text-[9px] px-1.5 py-0.2 bg-ece-cyan/15 text-ece-cyan border border-ece-cyan/30 rounded">
              ECE CORE
            </span>
          </span>
          <span className="text-[10px] text-ece-text-dim tracking-wider">
            ALLIANCE UNIV // 2024 — 2028
          </span>
        </div>
      </header>

      {/* Top Right System Telemetry & Quick Controls */}
      <div className="fixed top-3 right-4 z-40 flex items-center gap-2 font-mono text-[10px] select-none">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-ece-obsidian/70 backdrop-blur-md border border-white/10 rounded">
          <span className="text-ece-text-dim">SYS_TIME:</span>
          <span className="text-ece-cyan font-bold">{systemTime || '00:00:00.00'}</span>
        </div>

        {/* Uptime */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-ece-obsidian/70 backdrop-blur-md border border-white/10 rounded">
          <span className="text-ece-text-dim">UPTIME:</span>
          <span className="text-emerald-400 font-bold">{formatUptime(uptimeSeconds)}</span>
        </div>

        {/* Performance Mode Switcher */}
        <button
          onClick={cyclePerformance}
          title={`Performance mode: ${performanceMode.toUpperCase()} (Click to toggle)`}
          className="flex items-center gap-1 px-2.5 py-1 bg-ece-obsidian/80 backdrop-blur-md border border-white/10 hover:border-ece-cyan/50 text-slate-300 hover:text-white rounded transition-colors"
        >
          <Gauge className="w-3 h-3 text-ece-cyan" />
          <span className="hidden sm:inline uppercase text-[9px] font-bold text-ece-cyan">
            {performanceMode}
          </span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            toggleSound();
            triggerAudio('toggle');
          }}
          title={soundEnabled ? 'Mute System Audio' : 'Enable Subtle Synthesized Audio'}
          className={clsx(
            'flex items-center justify-center w-7 h-7 bg-ece-obsidian/80 backdrop-blur-md border rounded transition-all',
            soundEnabled
              ? 'border-ece-cyan/60 text-ece-cyan shadow-[0_0_10px_rgba(0,240,255,0.25)]'
              : 'border-white/10 text-slate-500 hover:text-white hover:border-white/30'
          )}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Bottom Left Hardware Metrics Telemetry */}
      <footer className="fixed bottom-3 left-4 z-40 hidden lg:flex items-center gap-4 font-mono text-[9px] text-ece-text-dim select-none bg-ece-obsidian/70 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded" aria-label="System telemetry">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck className="w-3 h-3" />
          <span>SYS_INTEGRITY: 100%</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div>
          CLK: <span className="text-white font-bold">16.00 MHz</span>
          <span className="text-slate-600 text-[8px] ml-1">[SIM]</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div>
          TEMP: <span className="text-white font-bold">34.2 °C</span>
          <span className="text-slate-600 text-[8px] ml-1">[SIM]</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div>
          CGPA: <span className="text-ece-cyan font-bold">7.50 / 10.0</span>
        </div>
      </footer>

      {/* Bottom Right ECE Core Pipeline Indicator */}
      <div className="fixed bottom-3 right-4 z-40 hidden xl:flex items-center gap-1 font-mono text-[9px] select-none bg-ece-obsidian/75 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded">
        <span className="text-ece-text-dim mr-1">PIPELINE:</span>
        {DOMAIN_SEQUENCE.map((domain, index) => {
          const isActive = activeDomain === domain;
          return (
            <React.Fragment key={domain}>
              <button
                onClick={() => {
                  triggerAudio('click');
                  setActiveDomain(domain);
                }}
                className={clsx(
                  'px-1.5 py-0.5 rounded transition-colors',
                  isActive
                    ? 'text-ece-cyan font-bold bg-ece-cyan/20 border border-ece-cyan/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {domain}
              </button>
              {index < DOMAIN_SEQUENCE.length - 1 && (
                <span className="text-slate-600">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Content Viewport */}
      <main className="relative z-10">{children}</main>
    </div>
  );
};
