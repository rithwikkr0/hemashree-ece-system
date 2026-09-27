import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useSystem } from './context/SystemContext';
import { SystemHUDFrame } from './components/layout/SystemHUDFrame';
import { NavHUD } from './components/navigation/NavHUD';
import { HeroCanvas } from './components/canvas/HeroCanvas';
import { ProjectExperience } from './components/projects/ProjectExperience';
import { HUDPanel } from './components/common/HUDPanel';
import { SystemBadge } from './components/common/SystemBadge';
import { StatusIndicator } from './components/common/StatusIndicator';
import { LAB_STATIONS_DATA } from './data/labStations';
import { PROJECTS_DATA } from './data/projects';
import { DspInlineSection } from './components/dsp/DspInlineSection';
import { SystemProfileSection } from './components/profile/SystemProfileSection';
import { SystemCapabilitiesSection } from './components/skills/SystemCapabilitiesSection';
import { MissionControlSection } from './components/missions/MissionControlSection';
import { ArchiveCredentialsSection } from './components/archive/ArchiveCredentialsSection';
import { TransmissionSection } from './components/transmission/TransmissionSection';
import { 
  Cpu, 
  CheckCircle2, 
  Activity, 
  ExternalLink,
  Github,
  Wrench,
  Radio,
  Sliders,
  Zap,
  Smartphone,
  Sun,
  Eye,
  ArrowRight,
  Play
} from 'lucide-react';

export const App: React.FC = () => {
  const { 
    isBooting,
    skipIntro, 
    reducedMotion,
    selectStation,
    inspectObject,
    selectedProjectId,
    setSelectedProjectId,
    triggerAudio 
  } = useSystem();

  // Escape key listener to exit project experience, skip intro, or reset inspection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProjectId) {
          triggerAudio('click');
          setSelectedProjectId(null);
        } else if (isBooting) {
          skipIntro();
        } else {
          inspectObject(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProjectId, isBooting, skipIntro, inspectObject, setSelectedProjectId, triggerAudio]);

  // Setup Lenis smooth scrolling
  useEffect(() => {
    if (reducedMotion || selectedProjectId) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reducedMotion, selectedProjectId]);

  const handleStationFocus = (stationId: any) => {
    triggerAudio('click');
    selectStation(stationId);
    const canvasElement = document.getElementById('core');
    if (canvasElement) {
      canvasElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchProject = (projectId: string) => {
    triggerAudio('boot');
    setSelectedProjectId(projectId);
  };

  const getStationIcon = (id: string) => {
    switch (id) {
      case 'embedded': return Cpu;
      case 'sensor': return Activity;
      case 'rf': return Radio;
      case 'dsp': return Sliders;
      case 'iot': return Zap;
      case 'ai-mobile': return Smartphone;
      case 'power': return Sun;
      default: return Wrench;
    }
  };

  return (
    <SystemHUDFrame>
      <NavHUD />

      {/* PHASE 4: FULL-SCREEN 3D INTERACTIVE PROJECT EXPERIENCE (ON-DEMAND MODAL) */}
      {selectedProjectId && <ProjectExperience />}

      {/* PHASE 2 & 3: 3D HERO CANVAS & INTERACTIVE ECE LABORATORY */}
      <section id="core" className="relative w-full h-[100vh] min-h-[640px]">
        <HeroCanvas />
      </section>

      {/* MAIN EDITORIAL CONTENT FLOW */}
      <div className="relative pt-16 pb-32 px-6 sm:px-8 max-w-6xl mx-auto space-y-32">
        
        {/* SECTION 02: SYSTEM PROFILE (PHASE 6) */}
        <SystemProfileSection />

        {/* SYSTEM CAPABILITIES & SKILLS TAXONOMY (PHASE 6) */}
        <SystemCapabilitiesSection />

        {/* SECTION 03: HARDWARE // LAB DIRECTORY */}
        <section id="lab" className="scroll-mt-24 space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
              WORKBENCHES • 7 STATIONS
            </span>
            <h2 className="font-tech text-3xl sm:text-4xl font-extrabold uppercase text-white">
              ECE LABORATORY
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Real verified engineering coursework, microcontrollers, sensors, RF hardware, and signal architectures. Select any station to navigate the 3D laboratory bench.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {LAB_STATIONS_DATA.map((station) => {
              const Icon = getStationIcon(station.id);
              return (
                <div
                  key={station.id}
                  className="p-5 bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/30 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-ece-cyan group-hover:bg-white/10 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        BENCH 0{station.stationNumber}
                      </span>
                    </div>

                    <h3 className="font-tech text-base font-bold text-white uppercase pt-1">
                      {station.name}
                    </h3>
                    <p className="font-sans text-xs text-slate-400 line-clamp-2">
                      {station.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStationFocus(station.id)}
                    className="w-full py-2 bg-white/5 hover:bg-white/15 text-white border border-white/10 hover:border-white/30 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-ece-cyan" />
                    <span>FOCUS 3D BENCH</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 04: PROJECT ARCHITECTURE & 3D INTERACTIVE EXPERIENCES */}
        <section id="projects" className="scroll-mt-24 space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
              PORTFOLIO INDEX • 8 SYSTEMS
            </span>
            <h2 className="font-tech text-3xl sm:text-4xl font-extrabold uppercase text-white">
              FEATURED PROJECTS
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Explore each engineering project in an interactive 3D simulation with dynamic input-process-output loops, parameter controls, and architecture walkthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS_DATA.map((project) => (
              <div
                key={project.id}
                className="p-6 sm:p-7 bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/25 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ece-cyan tracking-wider">
                      {project.domain}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      PRJ 0{project.order}
                    </span>
                  </div>

                  <h3 className="font-tech text-xl sm:text-2xl font-bold text-white uppercase group-hover:text-white transition-colors">
                    {project.title}
                  </h3>

                  <p className="font-sans text-sm text-slate-300 leading-relaxed">
                    {project.subtitle}
                  </p>

                  {/* Clean Technologies */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full font-mono text-[11px] text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clean Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleLaunchProject(project.id)}
                    className="px-4 py-2 bg-white text-black hover:bg-slate-200 font-sans font-semibold text-xs tracking-wider uppercase rounded-full transition-all flex items-center gap-2 shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>EXPLORE 3D →</span>
                  </button>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>CODE</span>
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ece-cyan hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        <span>LIVE</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 05: SIGNALS // DSP INTERACTIVE ENVIRONMENT (PHASE 5) */}
        <DspInlineSection />

        {/* SECTION 06: MISSIONS // HACKATHON & FIELD MISSIONS (PHASE 6) */}
        <MissionControlSection />

        {/* SECTION 07: ARCHIVE // CREDENTIALS & ACADEMIC DOSSIER (PHASE 6) */}
        <ArchiveCredentialsSection />

        {/* SECTION 08: TRANSMISSION // DIRECT COMMUNICATIONS (PHASE 6) */}
        <TransmissionSection />

      </div>

    </SystemHUDFrame>
  );
};

export default App;
