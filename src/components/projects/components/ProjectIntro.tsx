import React, { useEffect, useState } from 'react';
import { Project } from '../../../types';
import { GlitchText } from '../../common/GlitchText';
import { StatusIndicator } from '../../common/StatusIndicator';
import { Terminal, Shield, Zap } from 'lucide-react';

interface ProjectIntroProps {
  project: Project;
  onComplete: () => void;
}

export const ProjectIntro: React.FC<ProjectIntroProps> = ({ project, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 cursor-pointer select-none animate-fade-in"
      title="Click or press any key to skip intro"
    >
      <div className="max-w-md w-full p-6 bg-ece-obsidian border border-ece-cyan/40 rounded tech-corner-cut shadow-[0_0_40px_rgba(0,240,255,0.2)] space-y-4 font-mono text-xs text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 text-ece-cyan font-bold">
            <Terminal className="w-3.5 h-3.5 animate-pulse" />
            <span>PROJECT INITIALIZING // STAGE 0{project.order}</span>
          </div>
          <StatusIndicator status="active" label="LOADING" size="sm" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
            SYSTEM NAME
          </span>
          <h2 className="font-tech text-2xl font-black text-white uppercase tracking-wider">
            <GlitchText text={project.title} triggerOnMount />
          </h2>
          <p className="text-ece-cyan text-xs font-semibold">
            {project.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-black/60 border border-white/5 rounded text-[11px]">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">DOMAIN</span>
            <span className="text-white font-bold">{project.domain}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">CATEGORY</span>
            <span className="text-slate-300 font-bold truncate block">{project.category}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 block text-[9px] uppercase">TECH STACK</span>
            <span className="text-ece-cyan font-medium block truncate">
              {project.techStack.join(' • ')}
            </span>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>SYNCHRONIZING SCENE SHADERS</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded overflow-hidden">
            <div
              className="h-full bg-ece-cyan transition-all duration-150 shadow-[0_0_10px_#00f0ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center text-[9px] text-slate-500">
          CLICK ANYWHERE TO ENTER SCENE IMMEDIATELY
        </div>
      </div>
    </div>
  );
};
