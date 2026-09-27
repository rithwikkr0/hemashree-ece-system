import React, { useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { LAB_STATIONS_DATA } from '../../data/labStations';
import { StationId } from '../../types/lab';
import { InspectionPanel } from './InspectionPanel';
import { 
  Cpu, 
  Activity, 
  Layers, 
  RotateCcw, 
  Sliders, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import clsx from 'clsx';

export const LabHUDOverlay: React.FC = () => {
  const { 
    isBooting, 
    selectedStationId, 
    selectStation, 
    labViewMode, 
    returnToLabOverview,
    triggerAudio 
  } = useSystem();

  // Keyboard navigation: 1-7 for stations, 0 or Escape for overview
  useEffect(() => {
    if (isBooting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        const station = LAB_STATIONS_DATA[num - 1];
        if (station) {
          triggerAudio('click');
          selectStation(station.id);
        }
      } else if (e.key === '0' || e.key === 'Escape') {
        triggerAudio('click');
        returnToLabOverview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBooting, selectStation, returnToLabOverview, triggerAudio]);

  if (isBooting) return null;

  return (
    <>
      {/* Top Left: Lab System Status Telemetry */}
      <div className="absolute top-16 left-6 z-30 pointer-events-none hidden md:block select-none font-mono text-[10px]">
        <div className="bg-ece-obsidian/85 backdrop-blur-md border border-ece-cyan/30 px-3 py-2 rounded tech-corner-cut-sm space-y-1 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 text-ece-cyan font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-ece-cyan animate-ping" />
            <span>ECE LAB // ACTIVE</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[9px] pt-0.5 border-t border-white/5">
            <span>STATIONS: <strong className="text-white">07 ONLINE</strong></span>
            <span>LOAD: <strong className="text-emerald-400">38% [SIMULATION]</strong></span>
            <span>SIGNAL: <strong className="text-ece-cyan">NOMINAL</strong></span>
          </div>
        </div>
      </div>

      {/* Bottom Center: Station Navigation Dock */}
      <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none max-w-full px-3">
        <div className="flex items-center gap-1 p-1 bg-ece-obsidian/90 backdrop-blur-xl border border-ece-cyan/30 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.9)] overflow-x-auto max-w-[95vw]">
          
          {/* Overview Button */}
          <button
            onClick={() => {
              triggerAudio('click');
              returnToLabOverview();
            }}
            className={clsx(
              'flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider transition-all duration-200 whitespace-nowrap',
              labViewMode === 'LAB_OVERVIEW'
                ? 'bg-ece-cyan text-black font-bold shadow-[0_0_12px_#00f0ff]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
            title="Lab Arena Overview (Key: 0)"
          >
            <Maximize2 className="w-3 h-3" />
            <span>OVERVIEW</span>
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* 7 Workstations */}
          {LAB_STATIONS_DATA.map((station, idx) => {
            const isSelected = selectedStationId === station.id;
            return (
              <button
                key={station.id}
                onClick={() => {
                  triggerAudio('click');
                  selectStation(isSelected ? null : station.id);
                }}
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-wider transition-all duration-200 whitespace-nowrap',
                  isSelected
                    ? 'bg-ece-cyan/20 border border-ece-cyan text-ece-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
                title={`Key: ${idx + 1}`}
              >
                <span className="text-[9px] opacity-60 font-bold">
                  {station.stationNumber}
                </span>
                <span className="font-tech uppercase text-[10px]">
                  {station.name.replace(' BENCH', '').replace(' LAB', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Close-Up Component Inspection Panel */}
      <InspectionPanel />
    </>
  );
};
