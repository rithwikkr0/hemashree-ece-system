import React, { createContext, useContext, useState, useEffect } from 'react';
import { ECEDomain } from '../types';
import { StationId, LabCameraMode } from '../types/lab';

export type SectionId = 
  | 'CORE' 
  | 'PROFILE' 
  | 'LAB' 
  | 'PROJECTS' 
  | 'SIGNALS' 
  | 'MISSIONS' 
  | 'ARCHIVE' 
  | 'TRANSMISSION';

export type PerformanceMode = 'high' | 'medium' | 'low';

export type BootStage = 
  | 'BOOT' 
  | 'PCB_POWER' 
  | 'CAMERA_FLIGHT' 
  | 'PORTRAIT_REVEAL' 
  | 'HUD_SCAN' 
  | 'PARTICLE_TRANSFORM' 
  | 'CORE_ACTIVATE' 
  | 'HERO';

interface SystemContextType {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  activeDomain: ECEDomain;
  setActiveDomain: (domain: ECEDomain) => void;
  bootStage: BootStage;
  setBootStage: (stage: BootStage) => void;
  isBooting: boolean;
  setIsBooting: (booting: boolean) => void;
  isIntroSkipped: boolean;
  skipIntro: () => void;
  replayIntro: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  performanceMode: PerformanceMode;
  setPerformanceMode: (mode: PerformanceMode) => void;
  reducedMotion: boolean;
  systemTime: string;
  uptimeSeconds: number;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Phase 3: ECE Laboratory State
  labViewMode: LabCameraMode;
  setLabViewMode: (mode: LabCameraMode) => void;
  selectedStationId: StationId | null;
  selectStation: (id: StationId | null) => void;
  inspectedObjectId: string | null;
  inspectObject: (id: string | null) => void;
  dspFilterMode: 'RAW' | 'FIR' | 'IIR';
  setDspFilterMode: (mode: 'RAW' | 'FIR' | 'IIR') => void;
  iotLightOn: boolean;
  toggleIotLight: () => void;
  solarPumpActive: boolean;
  toggleSolarPump: () => void;
  returnToLabOverview: () => void;

  triggerAudio: (sound: 'click' | 'pulse' | 'boot' | 'toggle' | 'scan' | 'coreConfirm' | 'relay') => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('CORE');
  const [activeDomain, setActiveDomain] = useState<ECEDomain>('SIGNAL');
  
  // Check if user previously skipped or completed intro in this session
  const [isIntroSkipped, setIsIntroSkipped] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ece_intro_skipped') === 'true';
    }
    return false;
  });

  const [bootStage, setBootStage] = useState<BootStage>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('ece_intro_skipped') === 'true') {
      return 'HERO';
    }
    return 'BOOT';
  });

  const [isBooting, setIsBooting] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('ece_intro_skipped') === 'true') {
      return false;
    }
    return true;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('high');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(0);
  const [systemTime, setSystemTime] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Phase 3 Lab states
  const [labViewMode, setLabViewMode] = useState<LabCameraMode>('LAB_OVERVIEW');
  const [selectedStationId, setSelectedStationId] = useState<StationId | null>(null);
  const [inspectedObjectId, setInspectedObjectId] = useState<string | null>(null);
  const [dspFilterMode, setDspFilterMode] = useState<'RAW' | 'FIR' | 'IIR'>('RAW');
  const [iotLightOn, setIotLightOn] = useState<boolean>(false);
  const [solarPumpActive, setSolarPumpActive] = useState<boolean>(true);

  // Check hardware & reduced motion preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile) {
        setPerformanceMode('medium');
      }

      if (mediaQuery.matches) {
        setIsIntroSkipped(true);
        setIsBooting(false);
        setBootStage('HERO');
      }

      const updateClock = () => {
        const now = new Date();
        setSystemTime(
          now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
          '.' + 
          Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')
        );
      };

      updateClock();
      const clockInterval = setInterval(updateClock, 50);
      const uptimeInterval = setInterval(() => setUptimeSeconds((prev) => prev + 1), 1000);

      return () => {
        clearInterval(clockInterval);
        clearInterval(uptimeInterval);
      };
    }
  }, []);

  const skipIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ece_intro_skipped', 'true');
    }
    setIsIntroSkipped(true);
    setIsBooting(false);
    setBootStage('HERO');
  };

  // Directive 1: RAPID AUTO-DISMISS & IMMEDIATE INTERACTION DISMISSAL
  useEffect(() => {
    if (!isBooting) return;

    // Any user touch, scroll, click, or wheel immediately dismisses boot
    const handleDismissInteraction = () => {
      skipIntro();
    };

    window.addEventListener('wheel', handleDismissInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleDismissInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleDismissInteraction, { passive: true, once: true });
    window.addEventListener('keydown', handleDismissInteraction, { once: true });
    window.addEventListener('click', handleDismissInteraction, { once: true });

    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const timeoutDuration = isMobile ? 1000 : 2500;

    const timer = setTimeout(() => {
      skipIntro();
    }, timeoutDuration);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', handleDismissInteraction);
      window.removeEventListener('touchstart', handleDismissInteraction);
      window.removeEventListener('scroll', handleDismissInteraction);
      window.removeEventListener('keydown', handleDismissInteraction);
      window.removeEventListener('click', handleDismissInteraction);
    };
  }, [isBooting]);

  const replayIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ece_intro_skipped');
    }
    setIsIntroSkipped(false);
    setIsBooting(true);
    setBootStage('BOOT');
    setLabViewMode('LAB_OVERVIEW');
    setSelectedStationId(null);
    setInspectedObjectId(null);
  };

  const selectStation = (id: StationId | null) => {
    setSelectedStationId(id);
    setInspectedObjectId(null);
    if (id) {
      setLabViewMode('STATION_VIEW');
    } else {
      setLabViewMode('LAB_OVERVIEW');
    }
  };

  const inspectObject = (id: string | null) => {
    setInspectedObjectId(id);
    if (id) {
      setLabViewMode('INSPECT_VIEW');
    } else if (selectedStationId) {
      setLabViewMode('STATION_VIEW');
    } else {
      setLabViewMode('LAB_OVERVIEW');
    }
  };

  const returnToLabOverview = () => {
    setSelectedStationId(null);
    setInspectedObjectId(null);
    setLabViewMode('LAB_OVERVIEW');
  };

  const toggleIotLight = () => {
    setIotLightOn((prev) => !prev);
  };

  const toggleSolarPump = () => {
    setSolarPumpActive((prev) => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const triggerAudio = (sound: 'click' | 'pulse' | 'boot' | 'toggle' | 'scan' | 'coreConfirm' | 'relay') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (sound === 'click') {
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (sound === 'pulse') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (sound === 'boot') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (sound === 'toggle') {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(1760, now + 0.06);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (sound === 'scan') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.linearRampToValueAtTime(2200, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (sound === 'coreConfirm') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (sound === 'relay') {
        // Crisp dual-click mechanical relay contact closure
        osc.type = 'square';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch {
      // AudioContext fallback
    }
  };

  return (
    <SystemContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activeDomain,
        setActiveDomain,
        bootStage,
        setBootStage,
        isBooting,
        setIsBooting,
        isIntroSkipped,
        skipIntro,
        replayIntro,
        soundEnabled,
        toggleSound,
        performanceMode,
        setPerformanceMode,
        reducedMotion,
        systemTime,
        uptimeSeconds,
        selectedProjectId,
        setSelectedProjectId,
        labViewMode,
        setLabViewMode,
        selectedStationId,
        selectStation,
        inspectedObjectId,
        inspectObject,
        dspFilterMode,
        setDspFilterMode,
        iotLightOn,
        toggleIotLight,
        solarPumpActive,
        toggleSolarPump,
        returnToLabOverview,
        triggerAudio,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
