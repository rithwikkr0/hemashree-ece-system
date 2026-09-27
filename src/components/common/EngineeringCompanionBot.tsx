import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { ASSET_PATHS } from '../../config/assets';
import { X, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

export const EngineeringCompanionBot: React.FC = () => {
  const { isBooting, triggerAudio, setActiveSection } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (isBooting) return null;

  const handleNavigate = (targetId: string, sectionKey?: any) => {
    triggerAudio('click');
    setIsOpen(false);
    if (sectionKey) {
      setActiveSection(sectionKey);
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenResume = () => {
    triggerAudio('click');
    setIsOpen(false);
    window.open(ASSET_PATHS.resume.masterAtsPath, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-5 md:bottom-7 md:right-7 z-40 select-none pointer-events-auto">
      {/* Small Clean Pop-up Navigation Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-ece-obsidian/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] animate-fade-in space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">👋</span>
              <span className="font-tech text-xs font-bold text-white tracking-wider uppercase">
                HELLO!
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close companion menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="font-sans text-xs text-slate-300 leading-snug">
            What would you like to explore?
          </p>

          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => handleNavigate('projects', 'PROJECTS')}
              className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-xl text-left font-mono text-xs text-white transition-all flex items-center justify-between group"
            >
              <span>PROJECTS</span>
              <ArrowRight className="w-3 h-3 text-ece-cyan group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigate('lab', 'LAB')}
              className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-xl text-left font-mono text-xs text-white transition-all flex items-center justify-between group"
            >
              <span>ECE LAB</span>
              <ArrowRight className="w-3 h-3 text-ece-cyan group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigate('signals', 'SIGNALS')}
              className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-xl text-left font-mono text-xs text-white transition-all flex items-center justify-between group"
            >
              <span>DSP LAB</span>
              <ArrowRight className="w-3 h-3 text-ece-cyan group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleOpenResume}
              className="w-full px-3 py-2 bg-ece-cyan/10 hover:bg-ece-cyan/20 border border-ece-cyan/30 rounded-xl text-left font-mono text-xs text-ece-cyan transition-all flex items-center justify-between group"
            >
              <span>MASTER RESUME</span>
              <ExternalLink className="w-3 h-3 text-ece-cyan group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Companion Bot Avatar Button */}
      <button
        onClick={() => {
          triggerAudio('toggle');
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          triggerAudio('click');
        }}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          'relative group focus:outline-none transition-transform duration-300',
          isOpen ? 'scale-105' : 'hover:scale-110 active:scale-95'
        )}
        title="Engineering Companion (Click to navigate)"
        aria-label="Toggle engineering navigation companion"
      >
        {/* Subtle Ambient Glow Ring */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-ece-cyan/30 via-transparent to-ece-cyan/20 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Bot Character Image */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center animate-float">
          <img
            src="/assets/bot/companion_bot.webp"
            alt="Engineering Companion"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,240,255,0.35)]"
          />

          {/* Tiny Online Status Dot */}
          <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-black rounded-full shadow-[0_0_8px_#34d399]" />
        </div>
      </button>
    </div>
  );
};

export default EngineeringCompanionBot;
