import React, { useState, useEffect } from 'react';
import { HACKATHON_MISSIONS } from '../../data/hackathons';
import { HackathonMission } from '../../types';
import { useSystem } from '../../context/SystemContext';
import { TechCorner } from '../common/TechCorner';
import { SystemBadge } from '../common/SystemBadge';
import { StatusIndicator } from '../common/StatusIndicator';
import { 
  Compass, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  X, 
  ExternalLink,
  Sparkles,
  ChevronRight,
  Radio
} from 'lucide-react';
import clsx from 'clsx';

export const MissionControlSection: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [selectedMission, setSelectedMission] = useState<HackathonMission | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string>(HACKATHON_MISSIONS[0]?.id || '');

  // Keyboard navigation for mission detail modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedMission) {
        triggerAudio('click');
        setSelectedMission(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMission, triggerAudio]);

  const handleOpenDetail = (mission: HackathonMission) => {
    triggerAudio('click');
    setSelectedMission(mission);
    setActiveNodeId(mission.id);
  };

  return (
    <section id="missions" className="scroll-mt-24 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ece-cyan tracking-widest">[SECTION 06 // MISSION CONTROL]</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              VERIFIED HACKATHON PROTOCOLS
            </span>
          </div>
          <h2 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white flex items-center gap-2 pt-1">
            <Compass className="w-6 h-6 text-ece-cyan" />
            MISSION CONTROL // FIELD HACKATHONS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <SystemBadge label={`${HACKATHON_MISSIONS.length} MISSIONS LOGGED`} variant="cyan" />
          <StatusIndicator status="nominal" label="COMPETITIVE SPRINT RECORDS" />
        </div>
      </div>

      <p className="font-sans text-sm text-slate-300 max-w-3xl leading-relaxed">
        Chronological record of verified engineering hackathons, design defenses, and technical exhibitions at Alliance University and national developer platforms.
      </p>

      {/* Mission Timeline with Central Vertical Signal Path */}
      <div className="relative pt-6 pb-6">
        {/* Central Vertical Glowing Signal Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-ece-cyan/10 via-ece-cyan/40 to-ece-cyan/10 -translate-x-1/2 pointer-events-none" />

        <div className="space-y-8 relative">
          {HACKATHON_MISSIONS.map((mission, idx) => {
            const isEven = idx % 2 === 0;
            const isSelected = activeNodeId === mission.id;
            return (
              <div
                key={mission.id}
                className={clsx(
                  'relative flex flex-col md:flex-row items-start md:items-center gap-6 pl-10 md:pl-0',
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                {/* Timeline Pulsing Node on Central Trace */}
                <div 
                  onClick={() => handleOpenDetail(mission)}
                  className="absolute left-4 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-ece-obsidian border-2 border-ece-cyan flex items-center justify-center cursor-pointer shadow-[0_0_15px_#00f0ff] z-20 hover:scale-110 transition-transform"
                >
                  <span className={clsx(
                    'w-2.5 h-2.5 rounded-full transition-colors',
                    mission.status === 'Completed' ? 'bg-emerald-400' : 'bg-ece-cyan animate-ping'
                  )} />
                </div>

                {/* Content Card (Half Width on Desktop) */}
                <div className={clsx(
                  'w-full md:w-[calc(50%-2rem)]',
                  isEven ? 'md:pr-4 md:text-right' : 'md:pl-4 md:text-left'
                )}>
                  <div
                    onClick={() => handleOpenDetail(mission)}
                    className={clsx(
                      'p-5 rounded tech-corner-cut border transition-all duration-300 cursor-pointer bg-ece-obsidian/90 backdrop-blur-md space-y-2 hover:border-ece-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
                      isSelected ? 'border-ece-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)]' : 'border-white/10'
                    )}
                  >
                    <div className={clsx(
                      'flex items-center gap-2 text-xs font-mono',
                      isEven ? 'md:justify-end' : 'md:justify-start'
                    )}>
                      <span className="text-ece-cyan font-bold px-2 py-0.5 bg-ece-cyan/10 border border-ece-cyan/30 rounded">
                        [{mission.missionCode}]
                      </span>
                      <span className="text-slate-400 font-semibold">{mission.year}</span>
                      <span className={clsx(
                        'text-[10px] px-1.5 py-0.2 rounded font-bold uppercase',
                        mission.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      )}>
                        {mission.status}
                      </span>
                    </div>

                    <h3 className="font-tech text-base font-bold text-white uppercase leading-snug">
                      {mission.event}
                    </h3>

                    <div className={clsx(
                      'text-xs font-mono text-slate-400 space-y-0.5',
                      isEven ? 'md:text-right' : 'md:text-left'
                    )}>
                      <div>ORG: <span className="text-slate-200">{mission.organizer}</span></div>
                      <div>ROLE: <span className="text-ece-cyan font-semibold">{mission.role}</span></div>
                      {mission.project && (
                        <div>PROJECT: <span className="text-white font-medium">{mission.project}</span></div>
                      )}
                    </div>

                    <p className="font-sans text-xs text-slate-300 leading-relaxed pt-1">
                      {mission.description}
                    </p>

                    <div className={clsx(
                      'pt-2 flex flex-wrap gap-1',
                      isEven ? 'md:justify-end' : 'md:justify-start'
                    )}>
                      {mission.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 text-slate-400 rounded border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className={clsx(
                      'pt-1 text-[10px] font-mono text-ece-cyan flex items-center gap-1',
                      isEven ? 'md:justify-end' : 'md:justify-start'
                    )}>
                      <span>INSPECT MISSION DETAILS</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Empty Half-width spacer on Desktop */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Detail Modal / Drawer */}
      {selectedMission && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedMission(null)}
        >
          <div
            className="bg-ece-obsidian border border-ece-cyan/50 rounded tech-corner-cut max-w-xl w-full p-6 space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.3)] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <TechCorner position="top-left" variant="cyan" size={12} />
            <TechCorner position="top-right" variant="cyan" size={12} />
            <TechCorner position="bottom-left" variant="cyan" size={12} />
            <TechCorner position="bottom-right" variant="cyan" size={12} />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-ece-cyan">
                <Radio className="w-4 h-4 text-ece-cyan animate-pulse" />
                <span>MISSION DOSSIER // [{selectedMission.missionCode}]</span>
              </div>
              <button
                onClick={() => setSelectedMission(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Close Mission Detail (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Name & Year */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-ece-cyan/15 text-ece-cyan font-bold border border-ece-cyan/30">
                  YEAR: {selectedMission.year} {selectedMission.dateStr ? `• ${selectedMission.dateStr}` : ''}
                </span>
                <span className={clsx(
                  'font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase',
                  selectedMission.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                )}>
                  STATUS: {selectedMission.status}
                </span>
              </div>

              <h2 className="font-tech text-xl sm:text-2xl font-black text-white uppercase leading-snug">
                {selectedMission.event}
              </h2>
              <p className="font-mono text-xs text-slate-400">
                ORGANIZER: {selectedMission.organizer}
              </p>
            </div>

            {/* Verified Candidate Role & Project */}
            <div className="p-3 bg-black/60 rounded border border-white/10 space-y-1.5 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">VERIFIED ROLE</span>
                <span className="text-ece-cyan font-bold">{selectedMission.role}</span>
              </div>
              {selectedMission.project && (
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">PROJECT / ARCHITECTURE THEME</span>
                  <span className="text-white font-semibold">{selectedMission.project}</span>
                </div>
              )}
            </div>

            {/* Full Verified Description */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                ENGINEERING EXECUTION
              </span>
              <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/40 p-3 rounded border border-white/5">
                {selectedMission.description}
              </p>
            </div>

            {/* Documented Outcome */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DOCUMENTED OUTCOME
              </span>
              <p className="font-sans text-xs text-emerald-300 font-medium">
                {selectedMission.outcome}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedMission.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] px-2 py-0.5 bg-white/5 text-slate-300 rounded border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Close Button */}
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedMission(null)}
                className="px-4 py-1.5 bg-ece-cyan text-black font-mono text-xs font-bold rounded hover:bg-cyan-300 transition-colors"
              >
                RETURN TO MISSION TIMELINE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
