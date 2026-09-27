import React from 'react';
import clsx from 'clsx';
import { useSystem, SectionId } from '../../context/SystemContext';
import { 
  Cpu, 
  UserCheck, 
  Wrench, 
  Layers, 
  Activity, 
  Compass, 
  Award, 
  Send 
} from 'lucide-react';

interface NavItem {
  id: SectionId;
  label: string;
  code: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'CORE', label: 'CORE', code: '01', icon: Cpu },
  { id: 'PROFILE', label: 'PROFILE', code: '02', icon: UserCheck },
  { id: 'LAB', label: 'LAB', code: '03', icon: Wrench },
  { id: 'PROJECTS', label: 'PROJECTS', code: '04', icon: Layers },
  { id: 'SIGNALS', label: 'SIGNALS', code: '05', icon: Activity },
  { id: 'MISSIONS', label: 'MISSIONS', code: '06', icon: Compass },
  { id: 'ARCHIVE', label: 'ARCHIVE', code: '07', icon: Award },
  { id: 'TRANSMISSION', label: 'TRANSMISSION', code: '08', icon: Send },
];

export const NavHUD: React.FC = () => {
  const { activeSection, setActiveSection, triggerAudio } = useSystem();

  const handleNavClick = (sectionId: SectionId) => {
    triggerAudio('click');
    setActiveSection(sectionId);
    
    // Smooth scroll to the corresponding section element if it exists in DOM
    const targetElement = document.getElementById(sectionId.toLowerCase());
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop HUD Navigation Bar */}
      <nav
        aria-label="System Navigation"
        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 items-center gap-1 px-3 py-1.5 bg-ece-obsidian/80 backdrop-blur-xl border border-ece-cyan/20 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.8),inset_0_0_12px_rgba(0,240,255,0.06)]"
      >
        <div className="flex items-center gap-2 pl-2 pr-3 border-r border-white/10 font-mono text-[10px] text-ece-cyan tracking-widest select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-ece-cyan animate-pulse" />
          <span>ECE_OS</span>
        </div>

        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={clsx(
                  'relative group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-ece-cyan',
                  isActive
                    ? 'text-ece-cyan font-bold bg-ece-cyan/15 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <span className="text-[9px] opacity-50 group-hover:opacity-100 font-mono">
                  {item.code}
                </span>
                <Icon className={clsx('w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110', isActive ? 'text-ece-cyan' : 'text-slate-400')} />
                <span className="font-tech uppercase text-[11px]">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-ece-cyan rounded-full shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Compact Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-50 flex items-center justify-around px-2 py-2 bg-ece-obsidian/95 backdrop-blur-xl border border-ece-cyan/25 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.9)]"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-label={`Navigate to ${item.label} section`}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-200 focus-visible:ring-1 focus-visible:ring-ece-cyan focus-visible:outline-none',
                isActive
                  ? 'text-ece-cyan bg-ece-cyan/20 scale-105'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-mono text-[8px] uppercase tracking-tighter mt-0.5">
                {item.label.slice(0, 4)}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
