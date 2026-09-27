import React, { useState } from 'react';
import { SKILL_GROUPS } from '../../data/skills';
import { PROJECTS_DATA } from '../../data/projects';
import { useSystem } from '../../context/SystemContext';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Activity, 
  Smartphone, 
  Wrench,
  Layers,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import clsx from 'clsx';

// Verified mapping from skills to projects
const SKILL_PROJECT_MAP: Record<string, string[]> = {
  'C': ['smart-blind-stick', 'solar-dewatering'],
  'Embedded C': ['smart-blind-stick', 'bluetooth-home-automation', 'rf-activity-detection', 'smart-ambient-light'],
  'Python': ['bhoomi-mitra', 'digital-audio-filter-dsp'],
  'Dart': ['lifemate-ai'],
  'VHDL': [],
  'MATLAB': ['digital-audio-filter-dsp'],
  'SQL': ['lifemate-ai'],
  'Arduino Uno / Nano': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light'],
  'ESP32': ['bluetooth-home-automation'],
  'GPIO & Peripheral Control': ['smart-blind-stick', 'bluetooth-home-automation', 'solar-dewatering', 'smart-ambient-light'],
  'Timers & Hardware Interrupts': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light'],
  'UART Serial Protocol': ['bluetooth-home-automation', 'smart-blind-stick'],
  'Sensor & Actuator Interfacing': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light', 'solar-dewatering'],
  'Digital Electronics': ['bluetooth-home-automation', 'smart-ambient-light'],
  'Circuit Design & Analysis': ['rf-activity-detection', 'solar-dewatering', 'smart-ambient-light'],
  'LM358 Signal Conditioning': ['rf-activity-detection'],
  'RF Sniffer Circuitry': ['rf-activity-detection'],
  'Signals & Systems': ['digital-audio-filter-dsp'],
  'Digital Signal Processing': ['digital-audio-filter-dsp'],
  'FIR / IIR Filter Design': ['digital-audio-filter-dsp'],
  'MATLAB Signal Toolbox': ['digital-audio-filter-dsp'],
  'Flutter & Dart': ['lifemate-ai'],
  'Gemini AI API': ['lifemate-ai', 'bhoomi-mitra'],
  'Supabase & PostgreSQL': ['lifemate-ai'],
  'Google ML Kit': ['lifemate-ai'],
  'Arduino IDE & PlatformIO': ['smart-blind-stick', 'bluetooth-home-automation', 'smart-ambient-light'],
  'Git & GitHub': ['lifemate-ai'],
  'Design Thinking Methodology': ['lifemate-ai', 'bhoomi-mitra', 'solar-dewatering'],
};

const CATEGORIES = [
  { id: 'programming', code: '01', title: 'PROGRAMMING', icon: Terminal, summary: 'C, Embedded C, Python, Dart, SQL, MATLAB' },
  { id: 'embedded', code: '02', title: 'EMBEDDED', icon: Cpu, summary: 'ATmega328P, ESP32, Timers, UART, Interrupts' },
  { id: 'electronics', code: '03', title: 'ELECTRONICS / RF', icon: Zap, summary: 'Analog Circuits, LM358, RF Sniffers, Power' },
  { id: 'dsp', code: '04', title: 'DSP', icon: Activity, summary: 'Signals & Systems, FIR/IIR Filters, MATLAB' },
  { id: 'ai-mobile', code: '05', title: 'AI / MOBILE', icon: Smartphone, summary: 'Flutter, Gemini API, ML Kit, Supabase' },
  { id: 'tools', code: '06', title: 'TOOLS', icon: Wrench, summary: 'PlatformIO, Arduino IDE, Tinkercad, Git' },
];

export const SystemCapabilitiesSection: React.FC = () => {
  const { setSelectedProjectId, triggerAudio } = useSystem();
  const [selectedCategory, setSelectedCategory] = useState<string | null>('embedded');

  const activeGroup = SKILL_GROUPS.find((g) => g.id === selectedCategory);

  return (
    <section className="scroll-mt-24 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
          SKILLS TAXONOMY
        </span>
        <h3 className="font-tech text-3xl sm:text-4xl font-extrabold text-white uppercase">
          TECHNICAL CAPABILITIES
        </h3>
        <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Select a category to view verified competencies and related technical implementations.
        </p>
      </div>

      {/* 6 Large Clean Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerAudio('click');
                setSelectedCategory(isSelected ? null : cat.id);
              }}
              className={clsx(
                'text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 group',
                isSelected
                  ? 'bg-white/10 border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                  : 'bg-black/40 hover:bg-black/70 border-white/10 hover:border-white/25'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs text-ece-cyan font-bold">
                  {cat.code}
                </span>
                <Icon className={clsx(
                  'w-5 h-5 transition-colors',
                  isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                )} />
              </div>

              <div className="space-y-1">
                <h4 className="font-tech text-base sm:text-lg font-bold text-white uppercase">
                  {cat.title}
                </h4>
                <p className="font-sans text-xs text-slate-400 line-clamp-1">
                  {cat.summary}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Revealed Details: Skills & Related Projects */}
      {activeGroup && (
        <div className="p-6 sm:p-8 bg-black/60 border border-white/15 rounded-2xl space-y-6 animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
              {activeGroup.title} // SKILLS & EVIDENCE
            </span>
            <span className="font-mono text-xs text-slate-400">
              {activeGroup.items.length} VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeGroup.items.map((skill) => {
              const relatedProjectIds = SKILL_PROJECT_MAP[skill.name] || [];
              const relatedProjects = PROJECTS_DATA.filter((p) => relatedProjectIds.includes(p.id));

              return (
                <div
                  key={skill.name}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 hover:border-white/25 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-sm font-bold text-white uppercase">
                      {skill.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">
                      {skill.level}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-slate-400 leading-relaxed">
                    {skill.tags.join(' • ')}
                  </p>

                  {relatedProjects.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-white/5">
                      {relatedProjects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            triggerAudio('boot');
                            setSelectedProjectId(p.id);
                          }}
                          className="px-2 py-0.5 bg-ece-cyan/10 hover:bg-ece-cyan/20 border border-ece-cyan/30 text-ece-cyan text-[10px] font-mono rounded transition-colors flex items-center gap-1"
                        >
                          <span>{p.title}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default SystemCapabilitiesSection;
