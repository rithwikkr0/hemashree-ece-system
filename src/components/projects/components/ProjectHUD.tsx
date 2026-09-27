import React from 'react';
import { Project } from '../../../types';
import { SystemBadge } from '../../common/SystemBadge';
import { StatusIndicator } from '../../common/StatusIndicator';
import { Cpu, Zap, Activity, Film } from 'lucide-react';

interface ProjectHUDProps {
  project: Project;
  onOpenCinematic?: () => void;
}

export const ProjectHUD: React.FC<ProjectHUDProps> = ({ project, onOpenCinematic }) => {
  return (
    <div className="absolute top-16 left-4 sm:left-6 z-30 pointer-events-none select-none max-w-sm">
      <div className="p-3.5 bg-ece-obsidian/85 backdrop-blur-md border border-ece-cyan/30 rounded tech-corner-cut-sm shadow-[0_0_20px_rgba(0,0,0,0.8)] space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-ece-cyan font-bold">
              SYS_PRJ_0{project.order}
            </span>
            <span className="text-slate-600">//</span>
            <span className="text-white text-[11px] font-bold uppercase truncate">
              {project.domain}
            </span>
          </div>
          <StatusIndicator status={project.status === 'Deployed' ? 'nominal' : 'active'} size="sm" />
        </div>

        <div className="space-y-0.5">
          <h2 className="font-tech text-xl font-extrabold text-white tracking-wide uppercase leading-tight">
            {project.title}
          </h2>
          <p className="text-[11px] text-ece-cyan/90 font-medium">
            {project.subtitle}
          </p>
        </div>

        {/* Metrics Row if present */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/5 text-[10px]">
            {project.metrics.slice(0, 2).map((m, idx) => (
              <div key={idx} className="p-1 bg-black/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[8px] uppercase">{m.label}</span>
                <span className="text-slate-200 font-bold truncate block">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Veo Cinematic B-Roll Interstitial Button */}
        {onOpenCinematic && (
          <div className="pt-1 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={onOpenCinematic}
              className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 bg-ece-cyan/15 hover:bg-ece-cyan/25 border border-ece-cyan/40 text-ece-cyan rounded text-[9px] font-mono transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              title="Inspect Veo Cinematic Visual Concept for this domain"
            >
              <Film className="w-3 h-3 text-ece-cyan" />
              <span>VEO CINEMATIC B-ROLL</span>
            </button>
            <span className="text-[8px] text-slate-500 font-mono">[SIMULATION]</span>
          </div>
        )}
      </div>
    </div>
  );
};
