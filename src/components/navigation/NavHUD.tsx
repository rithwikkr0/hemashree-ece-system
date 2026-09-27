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
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'CORE', label: 'CORE', icon: Cpu },
  { id: 'PROFILE', label: 'PROFILE', icon: UserCheck },
  { id: 'LAB', label: 'LAB', icon: Wrench },
  { id: 'PROJECTS', label: 'PROJECTS', icon: Layers },
  { id: 'SIGNALS', label: 'SIGNALS', icon: Activity },
  { id: 'MISSIONS', label: 'MISSIONS', icon: Compass },
  { id: 'ARCHIVE', label: 'ARCHIVE', icon: Award },
  { id: 'TRANSMISSION', label: 'CONTACT', icon: Send },
];

export const NavHUD: React.FC = () => {
  const { activeSection, setActiveSection, triggerAudio } = useSystem();

  const handleNavClick = (sectionId: SectionId) => {
    triggerAudio('click');
    setActiveSection(sectionId);
    
    // Smooth scroll to the corresponding section element if it exists in DOM
    const targetId = sectionId === 'TRANSMISSION' ? 'transmission' : sectionId.toLowerCase();
    const targetElement = document.getElementById(targetId) || (sectionId === 'TRANSMISSION' ? document.getElementById('contact') : null);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Clean Premium Navigation Bar */}
      <nav
        aria-label="Website Navigation"
        className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 items-center px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/15 rounded-full shadow-[0_4px_35px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-center gap-1 sm:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={clsx(
                  'relative px-4 py-2 rounded-full text-[13px] font-mono font-medium tracking-wider transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-ece-cyan select-none',
                  isActive
                    ? 'text-white font-semibold bg-white/12 shadow-[0_0_15px_rgba(255,255,255,0.12)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-ece-cyan rounded-full shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Compact Horizontal Scroll Navigation Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-50 flex items-center justify-around px-2 py-2.5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
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
                  ? 'text-ece-cyan bg-white/10 scale-105'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-mono text-[8px] uppercase tracking-wider mt-0.5">
                {item.label.slice(0, 4)}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
