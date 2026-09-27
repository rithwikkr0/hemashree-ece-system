import React, { useEffect } from 'react';
import { PROJECTS_DATA } from '../../../data/projects';
import { useSystem } from '../../../context/SystemContext';
import { ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';

interface ProjectNavigationProps {
  currentProjectIndex: number;
  onNavigate: (index: number) => void;
  onExit: () => void;
}

export const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  currentProjectIndex,
  onNavigate,
  onExit,
}) => {
  const { triggerAudio } = useSystem();
  const total = PROJECTS_DATA.length;
  const currentProject = PROJECTS_DATA[currentProjectIndex];

  // Keyboard navigation: Left/Right arrows, Escape to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        triggerAudio('click');
        onNavigate((currentProjectIndex - 1 + total) % total);
      } else if (e.key === 'ArrowRight') {
        triggerAudio('click');
        onNavigate((currentProjectIndex + 1) % total);
      } else if (e.key === 'Escape') {
        triggerAudio('click');
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProjectIndex, onNavigate, onExit, total, triggerAudio]);

  const handlePrev = () => {
    triggerAudio('click');
    onNavigate((currentProjectIndex - 1 + total) % total);
  };

  const handleNext = () => {
    triggerAudio('click');
    onNavigate((currentProjectIndex + 1) % total);
  };

  return (
    <>
      {/* Top Header Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-auto select-none">
        {/* Return to Lab */}
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-3 py-1.5 bg-black/80 hover:bg-ece-cyan/20 border border-ece-cyan/40 hover:border-ece-cyan text-ece-cyan rounded font-mono text-xs transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          title="Return to ECE Laboratory (Esc)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO LAB</span>
          <kbd className="hidden sm:inline px-1 py-0.2 bg-white/10 rounded text-[9px] text-slate-400">ESC</kbd>
        </button>

        {/* Project Step Counter */}
        <div className="flex items-center gap-2 px-3 py-1 bg-black/80 border border-white/10 rounded font-mono text-xs text-white">
          <span className="text-ece-cyan font-bold">PROJECT {String(currentProjectIndex + 1).padStart(2, '0')}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">{String(total).padStart(2, '0')}</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline uppercase text-[11px] truncate max-w-[180px]">
            {currentProject.title}
          </span>
        </div>

        {/* Next / Prev Controls */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-black/80 hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white rounded transition-colors"
            title="Previous Project (Arrow Left)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">PREV</span>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-black/80 hover:bg-ece-cyan/20 border border-ece-cyan/40 hover:border-ece-cyan text-ece-cyan rounded transition-colors"
            title="Next Project (Arrow Right)"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
