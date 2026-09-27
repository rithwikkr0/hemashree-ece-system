import React, { useState } from 'react';
import { SKILL_GROUPS } from '../../data/skills';
import { PROJECTS_DATA } from '../../data/projects';
import { useSystem } from '../../context/SystemContext';
import { TechCorner } from '../common/TechCorner';
import { SystemBadge } from '../common/SystemBadge';
import { StatusIndicator } from '../common/StatusIndicator';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Activity, 
  Smartphone, 
  Wrench,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Box
} from 'lucide-react';
import clsx from 'clsx';

// Verified mapping from skills to projects supported by master_career_database.md
const SKILL_PROJECT_MAP: Record<string, string[]> = {
  // Programming
  'C': ['smart-blind-stick', 'solar-dewatering'],
  'Embedded C': ['smart-blind-stick', 'bluetooth-home-automation', 'rf-activity-detection', 'smart-ambient-light'],
  'Python': ['bhoomi-mitra', 'digital-audio-filter-dsp'],
  'Dart': ['lifemate-ai'],
  'VHDL': [],
  'MATLAB': ['digital-audio-filter-dsp'],
  'SQL': ['lifemate-ai'],

  // Embedded Systems
  'Arduino Uno / Nano': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light'],
  'ESP32': ['bluetooth-home-automation'],
  '8086 Microprocessor': [],
  'GPIO & Peripheral Control': ['smart-blind-stick', 'bluetooth-home-automation', 'solar-dewatering', 'smart-ambient-light'],
  'Timers & Hardware Interrupts': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light'],
  'UART Serial Protocol': ['bluetooth-home-automation', 'smart-blind-stick'],
  'Sensor & Actuator Interfacing': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light', 'solar-dewatering'],

  // Electronics & Analog / RF
  'Digital Electronics': ['bluetooth-home-automation', 'smart-ambient-light'],
  'Circuit Design & Analysis': ['rf-activity-detection', 'solar-dewatering', 'smart-ambient-light'],
  'LM358 Signal Conditioning': ['rf-activity-detection'],
  'RF Sniffer Circuitry': ['rf-activity-detection'],
  'Principles of Communication': ['rf-activity-detection', 'bluetooth-home-automation'],
  'Power Electronics & Switching': ['solar-dewatering', 'bluetooth-home-automation'],

  // DSP
  'Signals & Systems': ['digital-audio-filter-dsp'],
  'Digital Signal Processing': ['digital-audio-filter-dsp'],
  'FIR / IIR Filter Design': ['digital-audio-filter-dsp'],
  'MATLAB Signal Toolbox': ['digital-audio-filter-dsp'],
  'Audio Noise Attenuation': ['digital-audio-filter-dsp'],

  // AI & Mobile
  'Flutter & Dart': ['lifemate-ai'],
  'Gemini AI API': ['lifemate-ai', 'bhoomi-mitra'],
  'Supabase & PostgreSQL': ['lifemate-ai'],
  'Google ML Kit': ['lifemate-ai'],
  'Android STT / TTS': ['lifemate-ai'],
  'SQLite (Offline First)': ['lifemate-ai'],

  // Tools
  'MATLAB & Simulink': ['digital-audio-filter-dsp'],
  'Arduino IDE & PlatformIO': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light'],
  'Tinkercad Circuits': ['smart-ambient-light', 'rf-activity-detection'],
  'Git & GitHub': ['lifemate-ai'],
  'Supabase Edge Functions': ['lifemate-ai', 'bhoomi-mitra'],
  'Design Thinking Methodology': ['lifemate-ai', 'bhoomi-mitra', 'solar-dewatering'],
};

export const SystemCapabilitiesSection: React.FC = () => {
  const { setSelectedProjectId, triggerAudio } = useSystem();
  const [activeGroupId, setActiveGroupId] = useState<string>('embedded');
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>('ESP32');

  const activeGroup = SKILL_GROUPS.find((g) => g.id === activeGroupId) || SKILL_GROUPS[0];

  const getGroupIcon = (id: string) => {
    switch (id) {
      case 'programming': return Terminal;
      case 'embedded': return Cpu;
      case 'electronics': return Zap;
      case 'dsp': return Activity;
      case 'ai-mobile': return Smartphone;
      case 'tools': return Wrench;
      default: return Layers;
    }
  };

  // Find related project objects for the selected skill
  const relatedProjectIds = selectedSkillName ? SKILL_PROJECT_MAP[selectedSkillName] || [] : [];
  const relatedProjects = PROJECTS_DATA.filter((p) => relatedProjectIds.includes(p.id));

  const handleLaunchProject = (projectId: string) => {
    triggerAudio('boot');
    setSelectedProjectId(projectId);
  };

  return (
    <section className="scroll-mt-24 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ece-cyan tracking-widest">[TECHNICAL TAXONOMY]</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              6 CORE DOMAINS
            </span>
          </div>
          <h2 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white flex items-center gap-2 pt-1">
            <Layers className="w-6 h-6 text-ece-cyan" />
            SYSTEM // CAPABILITIES
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <SystemBadge label="38 VERIFIED SKILLS" variant="cyan" />
          <StatusIndicator status="nominal" label="EVIDENCE-BACKED" />
        </div>
      </div>

      <p className="font-sans text-sm text-slate-300 max-w-3xl leading-relaxed">
        Taxonomy of verified technical competencies. Click any skill node to inspect its technical evidence and direct implementations across candidate projects.
      </p>

      {/* Domain Cluster Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SKILL_GROUPS.map((group, idx) => {
          const isSelected = activeGroupId === group.id;
          const Icon = getGroupIcon(group.id);
          return (
            <button
              key={group.id}
              onClick={() => {
                triggerAudio('click');
                setActiveGroupId(group.id);
                // Auto select first item in group
                if (group.items.length > 0) {
                  setSelectedSkillName(group.items[0].name);
                }
              }}
              className={clsx(
                'flex flex-col items-center justify-center p-3 rounded tech-corner-cut-sm border font-mono transition-all duration-200 text-center',
                isSelected
                  ? 'bg-ece-cyan/20 border-ece-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'bg-ece-obsidian/80 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] opacity-60 font-bold">0{idx + 1}</span>
                <Icon className={clsx('w-4 h-4', isSelected ? 'text-ece-cyan' : 'text-slate-500')} />
              </div>
              <span className="font-tech text-xs font-bold uppercase truncate max-w-full">
                {group.title.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Capability Detail Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Skill Nodes in Active Domain Cluster */}
        <div className="lg:col-span-7 bg-ece-obsidian/90 border border-ece-cyan/30 rounded tech-corner-cut p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <span className="font-mono text-[10px] text-ece-cyan tracking-widest block">
                [{activeGroup.systemCode}]
              </span>
              <h3 className="font-tech text-base font-bold text-white uppercase">
                {activeGroup.title}
              </h3>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              {activeGroup.items.length} SKILLS
            </span>
          </div>

          <p className="font-sans text-xs text-slate-300 leading-relaxed">
            {activeGroup.description}
          </p>

          {/* Interactive Skill Nodes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {activeGroup.items.map((skill) => {
              const isSelected = selectedSkillName === skill.name;
              const hasProjects = (SKILL_PROJECT_MAP[skill.name] || []).length > 0;
              return (
                <div
                  key={skill.name}
                  onClick={() => {
                    triggerAudio('click');
                    setSelectedSkillName(skill.name);
                  }}
                  className={clsx(
                    'p-3 rounded border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2',
                    isSelected
                      ? 'bg-ece-cyan/15 border-ece-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)] scale-[1.02]'
                      : 'bg-black/50 border-white/10 hover:border-ece-cyan/40 hover:bg-black/70'
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-tech font-bold text-xs text-white">
                      {skill.name}
                    </span>
                    <span className={clsx(
                      'text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold',
                      skill.level === 'Demonstrated' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-ece-cyan'
                    )}>
                      {skill.level}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {skill.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono px-1 py-0.2 bg-white/5 text-slate-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {hasProjects && (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-ece-cyan pt-0.5">
                      <Box className="w-2.5 h-2.5" />
                      <span>{SKILL_PROJECT_MAP[skill.name].length} LINKED PROJECT(S)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Skill Evidence & Linked Projects */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-ece-obsidian/90 border border-ece-cyan/40 rounded tech-corner-cut p-5 backdrop-blur-md space-y-4">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                SKILL INSPECTION
              </span>
              <h3 className="font-tech text-lg font-black text-white uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ece-cyan" />
                <span>{selectedSkillName || 'SELECT A SKILL'}</span>
              </h3>
            </div>

            {selectedSkillName ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    VERIFIED IMPLEMENTATIONS IN CANDIDATE WORK:
                  </span>
                  {relatedProjects.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {relatedProjects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-3 bg-black/60 rounded border border-white/10 hover:border-ece-cyan/50 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-tech text-xs font-bold text-white uppercase">
                              {proj.title}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-ece-cyan/10 text-ece-cyan rounded">
                              {proj.domain}
                            </span>
                          </div>

                          <p className="font-sans text-[11px] text-slate-300 leading-tight">
                            {proj.subtitle}
                          </p>

                          <button
                            onClick={() => handleLaunchProject(proj.id)}
                            className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-ece-cyan hover:underline pt-1"
                          >
                            <span>LAUNCH 3D EXPERIENCE</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-black/40 rounded border border-white/5 font-mono text-xs text-slate-400">
                      Demonstrated through accredited B.Tech ECE engineering coursework and lab assignments at Alliance University.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED ACADEMIC / REPO RECORD</span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-sans">
                    Skill demonstration is backed by Git commits, course laboratory reports, or live deployments.
                  </p>
                </div>
              </div>
            ) : (
              <p className="font-mono text-xs text-slate-400">
                Click any skill on the left to inspect its implementation evidence and associated engineering projects.
              </p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
