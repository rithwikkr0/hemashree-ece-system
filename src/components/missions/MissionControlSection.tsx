import React, { useState, useEffect } from 'react';
import { HACKATHON_MISSIONS } from '../../data/hackathons';
import { HackathonMission } from '../../types';
import { useSystem } from '../../context/SystemContext';
import { 
  Compass, 
  Calendar, 
  X, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

export const MissionControlSection: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [selectedMission, setSelectedMission] = useState<HackathonMission | null>(null);

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
  };

  return (
    <section id="missions" className="scroll-mt-24 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
          TIMELINE • COMPETITIVE SPRINTS
        </span>
        <h2 className="font-tech text-3xl sm:text-4xl font-extrabold uppercase text-white">
          HACKATHONS & MISSIONS
        </h2>
        <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Chronological record of verified engineering hackathons, design sprints, and technical exhibitions.
        </p>
      </div>

      {/* Clean Timeline */}
      <div className="relative pt-4 pb-4">
        {/* Subtle Central Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2 pointer-events-none" />

        <div className="space-y-6 relative">
          {HACKATHON_MISSIONS.map((mission, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={mission.id}
                className={clsx(
                  'relative flex flex-col md:flex-row items-start md:items-center gap-6 pl-10 md:pl-0',
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                {/* Timeline Node */}
                <div 
                  onClick={() => handleOpenDetail(mission)}
                  className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-ece-cyan cursor-pointer z-20 hover:scale-125 transition-transform"
                />

                {/* Simplified Content Card */}
                <div className={clsx(
                  'w-full md:w-[calc(50%-2rem)]',
                  isEven ? 'md:pr-4 md:text-right' : 'md:pl-4 md:text-left'
                )}>
                  <div
                    onClick={() => handleOpenDetail(mission)}
                    className="p-6 rounded-2xl border border-white/10 hover:border-white/30 bg-black/40 hover:bg-black/70 backdrop-blur-md transition-all duration-300 cursor-pointer space-y-3 group"
                  >
                    <div className={clsx(
                      'flex items-center gap-2 text-xs font-mono text-slate-400',
                      isEven ? 'md:justify-end' : 'md:justify-start'
                    )}>
                      <span className="text-white font-semibold">{mission.year}</span>
                      <span>•</span>
                      <span className="text-ece-cyan font-medium">{mission.role}</span>
                    </div>

                    <h3 className="font-tech text-lg sm:text-xl font-bold text-white uppercase group-hover:text-white transition-colors">
                      {mission.event}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                      {mission.description}
                    </p>

                    <div className={clsx(
                      'pt-2 flex items-center',
                      isEven ? 'md:justify-end' : 'md:justify-start'
                    )}>
                      <span className="text-xs font-mono text-ece-cyan group-hover:text-cyan-300 flex items-center gap-1">
                        <span>EXPLORE →</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Modal on Selection */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-ece-obsidian border border-white/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedMission(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-ece-cyan">
                <span>[{selectedMission.missionCode}]</span>
                <span>•</span>
                <span className="text-slate-400">{selectedMission.year}</span>
              </div>
              <h3 className="font-tech text-2xl font-bold text-white uppercase">
                {selectedMission.event}
              </h3>
              <p className="font-mono text-xs text-slate-300">
                Organizer: {selectedMission.organizer} • Role: {selectedMission.role}
              </p>
            </div>

            <div className="space-y-3 font-sans text-sm text-slate-200 leading-relaxed border-t border-b border-white/10 py-4">
              <p>{selectedMission.description}</p>
              {selectedMission.project && (
                <p className="font-mono text-xs text-ece-cyan">
                  Key Project: {selectedMission.project}
                </p>
              )}
            </div>

            {selectedMission.tags && selectedMission.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedMission.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MissionControlSection;
