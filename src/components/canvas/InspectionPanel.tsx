import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { LAB_STATIONS_DATA } from '../../data/labStations';
import { LabObject } from '../../types/lab';
import { TechCorner } from '../common/TechCorner';
import { StatusIndicator } from '../common/StatusIndicator';
import { GlitchText } from '../common/GlitchText';
import { X, ArrowLeft, ExternalLink, Cpu, Activity } from 'lucide-react';

export const InspectionPanel: React.FC = () => {
  const { 
    inspectedObjectId, 
    inspectObject, 
    returnToLabOverview, 
    setSelectedProjectId, 
    triggerAudio 
  } = useSystem();

  if (!inspectedObjectId) return null;

  // Find the inspected object from all stations
  let targetObject: LabObject | null = null;
  let stationName = '';
  let stationNumber = '';

  for (const station of LAB_STATIONS_DATA) {
    const found = station.objects.find((obj) => obj.id === inspectedObjectId);
    if (found) {
      targetObject = found;
      stationName = station.name;
      stationNumber = station.stationNumber;
      break;
    }
  }

  if (!targetObject) return null;

  const handleClose = () => {
    triggerAudio('click');
    inspectObject(null);
  };

  return (
    <aside aria-label="Component Inspection" className="fixed bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto z-40 sm:max-w-md w-full p-4 pointer-events-auto animate-fade-in">
      <div className="relative bg-ece-obsidian/95 backdrop-blur-xl border border-ece-cyan/50 p-5 rounded tech-corner-cut shadow-[0_0_35px_rgba(0,240,255,0.25)] space-y-4 font-mono text-xs max-h-[70vh] overflow-y-auto">
        {/* Tech Corner Brackets */}
        <TechCorner position="top-left" variant="cyan" size={12} />
        <TechCorner position="top-right" variant="cyan" size={12} />
        <TechCorner position="bottom-left" variant="cyan" size={12} />
        <TechCorner position="bottom-right" variant="cyan" size={12} />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <StatusIndicator status="active" label={`STATION ${stationNumber} // INSPECTION`} size="sm" />
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
            title="Return to Lab (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Object Title */}
        <div className="space-y-1">
          <div className="text-[10px] text-ece-cyan/80 uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-3 h-3" />
            <span>CATEGORY: {targetObject.category}</span>
          </div>
          <h3 className="font-tech text-xl font-black text-white uppercase tracking-wider">
            <GlitchText text={targetObject.name} />
          </h3>
        </div>

        {/* Technical Data Grid */}
        <div className="space-y-2.5 text-[11px] bg-black/60 p-3 rounded border border-white/5">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase tracking-wider">TECHNOLOGY</span>
            <span className="text-white font-semibold block mt-0.5">{targetObject.technology}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase tracking-wider">ENGINEERING APPLICATION</span>
            <span className="text-slate-300 block mt-0.5 font-sans leading-relaxed">{targetObject.application}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase tracking-wider">VERIFIED CANDIDATE SOURCE</span>
            <span className="text-emerald-400 block mt-0.5 font-sans leading-relaxed">{targetObject.verifiedNotes}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white rounded transition-colors text-[10px]"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>RETURN</span>
            </button>

            <button
              onClick={returnToLabOverview}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded transition-colors text-[10px]"
            >
              <span>OVERVIEW</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {targetObject.id === 'oscilloscope' && (
              <button
                onClick={() => {
                  triggerAudio('boot');
                  handleClose();
                  setTimeout(() => {
                    const el = document.getElementById('signals');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/60 text-purple-300 rounded transition-colors text-[10px] font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                title="Scroll down to Section 05: Dedicated Signal & DSP Interactive Lab"
              >
                <span>OPEN DSP LAB</span>
                <Activity className="w-3 h-3" />
              </button>
            )}

            {targetObject.relatedProjectSlug && (
              <button
                onClick={() => {
                  triggerAudio('click');
                  setSelectedProjectId(targetObject.relatedProjectSlug!);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-ece-cyan/20 hover:bg-ece-cyan/30 border border-ece-cyan text-ece-cyan rounded transition-colors text-[10px] font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                <span>3D EXPERIENCE</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
