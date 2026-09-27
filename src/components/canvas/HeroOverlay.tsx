import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { ASSET_PATHS } from '../../config/assets';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const HeroOverlay: React.FC = () => {
  const { isBooting, triggerAudio } = useSystem();

  if (isBooting) return null;

  const scrollToProfile = () => {
    triggerAudio('click');
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    triggerAudio('click');
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between px-5 sm:px-12 md:px-20 py-8 sm:py-12 z-20 select-none">
      
      {/* Top spacing */}
      <div className="h-8 sm:h-10" />

      {/* Main Spacious Hero Composition */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 pointer-events-auto">
        
        {/* Left Column: Typography & Actions */}
        <div className="flex-1 space-y-4 sm:space-y-6 text-left">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="font-mono text-[11px] sm:text-xs text-ece-cyan tracking-widest uppercase">
              PORTFOLIO • 2024–2028
            </span>
            <h1 className="font-tech text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-none">
              HEMASHREE B M
            </h1>
            <p className="font-sans text-lg sm:text-xl md:text-2xl text-slate-200 font-light tracking-wide">
              Electronics & Communication Engineering
            </p>
          </div>

          <p className="font-sans text-sm sm:text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
            Building systems across electronics, embedded systems, signal processing, software and AI.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <button
              onClick={scrollToProfile}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black hover:bg-slate-200 font-sans font-semibold text-xs sm:text-sm tracking-wide rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
            >
              <span>EXPLORE ENGINEERING</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={scrollToProjects}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-black/50 hover:bg-white/10 text-white font-sans font-medium text-xs sm:text-sm tracking-wide rounded-full border border-white/20 hover:border-white/40 transition-all duration-200"
            >
              <span>VIEW PROJECTS</span>
            </button>
          </div>
        </div>

        {/* Right Column: Original Portrait (Desktop/Tablet) */}
        <div className="hidden sm:flex flex-shrink-0 items-center justify-center">
          <div className="relative w-52 sm:w-60 md:w-72 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.8)] bg-black/60">
            <img
              src={ASSET_PATHS.portraits.verifiedOriginal}
              alt="Hemashree B M"
              className="w-full h-full object-cover filter contrast-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Bottom Center Subtle Scroll Indicator */}
      <div className="flex justify-center pointer-events-auto pt-4">
        <button
          onClick={scrollToProfile}
          className="text-slate-500 hover:text-slate-300 transition-colors p-2"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

    </div>
  );
};

export default HeroOverlay;
