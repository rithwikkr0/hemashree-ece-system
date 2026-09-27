// ==============================================================================
// HEMASHREE // ECE SYSTEM - SECTION 05: SIGNALS & DSP INLINE SECTION
// Embedded on-page interactive DSP laboratory with full-screen expansion toggle.
// ==============================================================================

import React, { useState } from 'react';
import { DspExperience } from './DspExperience';
import { SystemBadge } from '../common/SystemBadge';
import { StatusIndicator } from '../common/StatusIndicator';
import { useSystem } from '../../context/SystemContext';
import { Activity, Maximize2 } from 'lucide-react';

export const DspInlineSection: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);

  const handleOpenFullScreen = () => {
    triggerAudio('boot');
    setIsFullScreenOpen(true);
  };

  const handleCloseFullScreen = () => {
    triggerAudio('click');
    setIsFullScreenOpen(false);
  };

  return (
    <section id="signals" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ece-cyan tracking-widest">[SECTION 05 // SIGNAL & DSP LAB]</span>
            <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              SIMULATION MODEL
            </span>
          </div>
          <h2 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase text-white flex items-center gap-2 pt-1">
            <Activity className="w-6 h-6 text-ece-cyan" />
            SIGNAL // DSP INTERACTIVE ENVIRONMENT
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SystemBadge label="MATLAB DSP WORKFLOW" variant="cyan" />
          <StatusIndicator status="nominal" label="DUAL TRACE ENGINE NOMINAL" />
          <button
            onClick={handleOpenFullScreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ece-cyan/20 hover:bg-ece-cyan/30 border border-ece-cyan text-ece-cyan rounded font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>EXPAND FULL SCREEN</span>
          </button>
        </div>
      </div>

      <p className="font-sans text-sm text-slate-300 max-w-3xl leading-relaxed">
        Experience the candidate's digital signal processing coursework in real time. Interact with the signal generator, inject electromagnetic noise, switch between FIR and IIR digital filters, examine the dual-trace oscilloscope, observe FFT spectral noise reduction, and test Z-plane pole stability.
      </p>

      {/* Embedded Live Interactive Experience */}
      <div className="border border-ece-cyan/30 rounded-xl bg-black/70 p-2 sm:p-4 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <DspExperience isInline={true} />
      </div>

      {/* Full-Screen Modal Overlay when user clicks Expand */}
      {isFullScreenOpen && (
        <DspExperience onClose={handleCloseFullScreen} isInline={false} />
      )}
    </section>
  );
};
