import React, { useState } from 'react';
import { Project } from '../../../types';
import { TechCorner } from '../../common/TechCorner';
import { StatusIndicator } from '../../common/StatusIndicator';
import { 
  ChevronUp, 
  ChevronDown, 
  Github, 
  ExternalLink, 
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

interface ProjectSummaryPanelProps {
  project: Project;
}

export const ProjectSummaryPanel: React.FC<ProjectSummaryPanelProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-30 pointer-events-auto select-none">
      <div className="bg-ece-obsidian/95 backdrop-blur-xl border border-ece-cyan/40 rounded tech-corner-cut shadow-[0_0_30px_rgba(0,0,0,0.9)] max-w-4xl mx-auto overflow-hidden transition-all duration-300">
        <TechCorner position="top-left" variant="cyan" size={10} />
        <TechCorner position="top-right" variant="cyan" size={10} />
        <TechCorner position="bottom-left" variant="cyan" size={10} />
        <TechCorner position="bottom-right" variant="cyan" size={10} />

        {/* Toggle Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 border-b border-white/10"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-ece-cyan font-bold">
              SYS_SPEC // TECHNICAL SUMMARY
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-sans truncate max-w-md">
              {project.title}: {project.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Action Links if available */}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-mono text-[10px] transition-colors"
                title="View GitHub Repository"
              >
                <Github className="w-3 h-3" />
                <span>VIEW SOURCE</span>
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-2.5 py-1 bg-ece-cyan/20 hover:bg-ece-cyan/30 text-ece-cyan rounded font-mono text-[10px] font-bold border border-ece-cyan/40 transition-colors"
                title="Open Live Deployment"
              >
                <span>VIEW LIVE</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              className="p-1 text-slate-400 hover:text-white rounded"
              aria-label={isExpanded ? 'Collapse technical summary' : 'Expand technical summary'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Technical Specification Body */}
        {isExpanded && (
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs max-h-[50vh] overflow-y-auto">
            {/* Problem */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                PROBLEM SOLVED
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
                {project.problem}
              </p>
            </div>

            {/* Solution */}
            <div className="space-y-1">
              <span className="text-[10px] text-ece-cyan uppercase font-bold tracking-wider block">
                ENGINEERING SOLUTION
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
                {project.solution}
              </p>
            </div>

            {/* Technical Highlights */}
            <div className="space-y-1 md:col-span-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                CORE TECHNICAL ARCHITECTURE & HIGHLIGHTS
              </span>
              <ul className="space-y-1.5 bg-black/40 p-3 rounded border border-white/5 font-sans text-xs text-slate-300">
                {project.technicalHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ece-cyan flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hardware Components / Specs if available */}
            {project.hardwareComponents && project.hardwareComponents.length > 0 && (
              <div className="space-y-1 md:col-span-2">
                <span className="text-[10px] text-ece-orange uppercase font-bold tracking-wider block">
                  VERIFIED HARDWARE COMPONENTS & PINOUTS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {project.hardwareComponents.map((comp, idx) => (
                    <div key={idx} className="p-2 bg-black/50 rounded border border-white/5">
                      <span className="text-white font-bold block truncate">{comp.name}</span>
                      <span className="text-ece-cyan text-[10px] block">{comp.role}</span>
                      {comp.specs && (
                        <span className="text-slate-400 text-[9px] block truncate">{comp.specs}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
