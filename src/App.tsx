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

      {/* SYSTEM PROFILE, LAB DIRECTORY & PROJECT ARCHITECTURE */}
      <div className="relative pt-12 pb-24 px-4 max-w-7xl mx-auto space-y-20">
        
        {/* SECTION 02: SYSTEM PROFILE (PHASE 6) */}
        <SystemProfileSection />

        {/* SYSTEM CAPABILITIES & SKILLS TAXONOMY (PHASE 6) */}
        <SystemCapabilitiesSection />

        {/* SECTION 03: HARDWARE // LAB DIRECTORY */}
        <section id="lab" className="scroll-mt-24 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4">
            <div>
              <span className="font-mono text-xs text-ece-cyan tracking-widest">[SECTION 03 // WORKBENCHES]</span>
              <h2 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white">
                HARDWARE // ECE LABORATORY
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <SystemBadge label="7 WORKSTATIONS ACTIVE" variant="cyan" />
              <StatusIndicator status="nominal" label="LAB SIGNAL NETWORK NOMINAL" />
            </div>
          </div>

          <p className="font-sans text-sm text-slate-300 max-w-3xl leading-relaxed">
            Every workstation represents real verified engineering coursework, microcontrollers, sensors, RF hardware, and mobile architectures. Click any station below to focus the 3D laboratory camera directly onto the bench.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LAB_STATIONS_DATA.map((station) => {
              const Icon = getStationIcon(station.id);
              return (
                <HUDPanel
                  key={station.id}
                  title={station.name}
                  subtitle={station.domainTitle}
                  systemCode={`BENCH_${station.stationNumber}`}
                  variant="cyan"
                  headerRight={
                    <button
                      onClick={() => handleStationFocus(station.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-ece-cyan/15 hover:bg-ece-cyan/25 border border-ece-cyan/40 text-ece-cyan rounded text-[10px] font-mono transition-colors"
                      title="Focus 3D camera onto this station"
                    >
                      <Eye className="w-3 h-3" />
                      <span>FOCUS 3D</span>
                    </button>
                  }
                >
                  <div className="space-y-3 font-mono text-xs">
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {station.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-ece-cyan font-bold block uppercase tracking-wider">
                        BENCH INSTRUMENTS & HARDWARE:
                      </span>
                      <div className="space-y-1">
                        {station.objects.map((obj) => (
                          <div
                            key={obj.id}
                            className="p-1.5 bg-black/40 border border-white/5 rounded flex items-center justify-between text-[10px]"
                          >
                            <span className="text-white font-medium">{obj.name}</span>
                            <span className="text-slate-500">{obj.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </HUDPanel>
              );
            })}
          </div>
        </section>

        {/* SECTION 04: PROJECT ARCHITECTURE & 3D INTERACTIVE EXPERIENCES */}
        <section id="projects" className="scroll-mt-24 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4">
            <div>
              <span className="font-mono text-xs text-ece-cyan tracking-widest">[SECTION 04 // INTERACTIVE 3D SIMULATIONS]</span>
              <h2 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white">
                PROJECT CATALOG // 3D EXPERIENCES (08 VERIFIED)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <SystemBadge label="NO STATIC CARDS" variant="orange" />
              <StatusIndicator status="nominal" label="8 3D SIMULATIONS LOADABLE" />
            </div>
          </div>

          <p className="font-sans text-sm text-slate-300 max-w-3xl leading-relaxed">
            Click <strong className="text-ece-cyan font-mono">LAUNCH 3D EXPERIENCE</strong> on any project to enter its dedicated interactive 3D simulation with dynamic input/process/output loops, parameter sliders, audio effects, and architectural diagnostics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS_DATA.map((project) => (
              <HUDPanel
                key={project.id}
                title={project.title}
                subtitle={project.subtitle}
                systemCode={`PRJ_0${project.order}`}
                variant={project.featured ? 'cyan' : 'graphite'}
                status={project.status === 'Deployed' ? 'nominal' : 'active'}
                headerRight={
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ece-cyan/10 text-ece-cyan border border-ece-cyan/30">
                    {project.domain}
                  </span>
                }
              >
                <div className="space-y-4 font-mono text-xs">
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {project.problem}
                  </p>

                  {/* Technical Pipeline Visualization */}
                  <div className="p-3 bg-black/60 border border-white/5 rounded space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-ece-cyan">
                        <Zap className="w-3 h-3" />
                        TECHNICAL PIPELINE:
                      </span>
                      <span>{project.pipeline.length} STAGES</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                      {project.pipeline.map((step, idx) => (
                        <React.Fragment key={step.stepNumber}>
                          <span className="px-2 py-0.5 bg-ece-graphite border border-white/10 rounded text-slate-300 font-semibold">
                            {step.label}
                          </span>
                          {idx < project.pipeline.length - 1 && (
                            <ArrowRight className="w-2.5 h-2.5 text-ece-cyan/70" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar: Launch 3D Simulation & Verified Links */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleLaunchProject(project.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-ece-cyan/20 hover:bg-ece-cyan/30 border border-ece-cyan text-ece-cyan rounded font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>LAUNCH 3D EXPERIENCE</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded border border-white/10 transition-colors"
                          title="View Verified GitHub Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded border border-white/20 transition-colors"
                        >
                          <span>LIVE</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </HUDPanel>
            ))}
          </div>

          {/* Phase 4 Completion Checklist Banner */}
          <div className="p-6 bg-ece-graphite/40 border border-ece-cyan/30 rounded tech-corner-cut backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ece-cyan/20 text-ece-cyan rounded-sm border border-ece-cyan/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-ece-cyan font-bold tracking-widest uppercase">
                    PHASE 4 COMPLETE // 8 INTERACTIVE 3D PROJECT EXPERIENCES DEPLOYED
                  </span>
                  <span className="px-2 py-0.5 bg-ece-cyan/20 text-ece-cyan font-mono text-[10px] rounded">
                    VERIFIED
                  </span>
                </div>
                <h3 className="font-tech text-lg font-bold text-white">
                  Dynamic On-Demand 3D Scenes, Input-Process-Decision-Output Simulations & Verified Integrity
                </h3>
                <p className="text-xs font-sans text-slate-300 leading-relaxed max-w-3xl">
                  Each of the candidate's 8 projects now features a dedicated 3D interactive scene: Lifemate AI companion phone walkthrough with cloud/offline disconnect, Bhoomi Mitra satellite farm grid with vernacular advisory layers, Solar Dewatering mining pit simulation, Smart Blind Stick ultrasonic proximity sensor with real-time collision thresholds, Bluetooth Home Automation relay switching, RF Activity sniffer spectrum bursts, Smart Ambient Light software hysteresis, and Digital Audio Filter FIR/IIR Butterworth spectral synthesis.
                </p>
              </div>
            </div>
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
