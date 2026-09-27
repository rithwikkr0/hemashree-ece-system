import React, { useState, useEffect } from 'react';
import { VEO_CINEMATIC_VIDEOS, VideoConcept } from '../../config/assets';
import { CinematicVideo } from './CinematicVideo';
import { TechCorner } from './TechCorner';
import { useSystem } from '../../context/SystemContext';
import { 
  Film, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Sparkles, 
  ArrowRight,
  Video,
  Layers,
  Radio,
  Sun,
  Smartphone,
  Cpu
} from 'lucide-react';
import clsx from 'clsx';

interface CinematicInterstitialModalProps {
  initialVideoId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CinematicInterstitialModal: React.FC<CinematicInterstitialModalProps> = ({
  initialVideoId = 'boot',
  isOpen,
  onClose,
}) => {
  const { triggerAudio, setSelectedProjectId } = useSystem();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const idx = VEO_CINEMATIC_VIDEOS.findIndex((v) => v.id === initialVideoId);
    if (idx !== -1) setActiveIdx(idx);
  }, [initialVideoId]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerAudio('click');
        onClose();
      } else if (e.key === 'ArrowLeft') {
        triggerAudio('click');
        setActiveIdx((prev) => (prev - 1 + VEO_CINEMATIC_VIDEOS.length) % VEO_CINEMATIC_VIDEOS.length);
      } else if (e.key === 'ArrowRight') {
        triggerAudio('click');
        setActiveIdx((prev) => (prev + 1) % VEO_CINEMATIC_VIDEOS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerAudio]);

  if (!isOpen) return null;

  const currentVideo = VEO_CINEMATIC_VIDEOS[activeIdx];

  const handleNext = () => {
    triggerAudio('click');
    setActiveIdx((prev) => (prev + 1) % VEO_CINEMATIC_VIDEOS.length);
  };

  const handlePrev = () => {
    triggerAudio('click');
    setActiveIdx((prev) => (prev - 1 + VEO_CINEMATIC_VIDEOS.length) % VEO_CINEMATIC_VIDEOS.length);
  };

  const handleLaunchRelatedProject = (videoId: string) => {
    triggerAudio('boot');
    onClose();
    if (videoId === 'rfWave') {
      setSelectedProjectId('rf-activity-detection');
    } else if (videoId === 'solarEnergy') {
      setSelectedProjectId('solar-dewatering');
    } else if (videoId === 'aiTransition') {
      setSelectedProjectId('lifemate-ai');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="bg-ece-obsidian border border-ece-cyan/50 rounded tech-corner-cut max-w-4xl w-full p-6 space-y-6 shadow-[0_0_60px_rgba(0,240,255,0.25)] animate-fade-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <TechCorner position="top-left" variant="cyan" size={14} />
        <TechCorner position="top-right" variant="cyan" size={14} />
        <TechCorner position="bottom-left" variant="cyan" size={14} />
        <TechCorner position="bottom-right" variant="cyan" size={14} />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-ece-cyan" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-ece-cyan tracking-widest block">
                  [VEO CINEMATIC REPOSITORY] // INTERSTITIAL {activeIdx + 1} OF {VEO_CINEMATIC_VIDEOS.length}
                </span>
                <span className="font-mono text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                  [ILLUSTRATIVE VISUALIZATION]
                </span>
              </div>
              <h2 className="font-tech text-xl font-extrabold text-white uppercase">
                {currentVideo.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 bg-black/60 hover:bg-white/10 border border-white/10 rounded text-slate-300 hover:text-white"
              title="Previous Clip (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 bg-black/60 hover:bg-white/10 border border-white/10 rounded text-slate-300 hover:text-white"
              title="Next Clip (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-white/5 hover:bg-white/20 border border-white/20 rounded text-slate-300 hover:text-white ml-2"
              title="Close Viewer (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Video Viewport */}
        <div className="relative aspect-video rounded overflow-hidden border border-ece-cyan/30 bg-black">
          <CinematicVideo
            src={currentVideo.path}
            fallbackCode={currentVideo.code}
            fallbackTitle={currentVideo.name}
            poster={currentVideo.posterPath}
            autoPlay={true}
            loop={true}
            controls={true}
            className="w-full h-full"
            caption={currentVideo.code}
          />
        </div>

        {/* Technical Specification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-3.5 bg-black/60 rounded border border-white/10 space-y-1.5">
            <span className="text-[10px] text-ece-cyan uppercase font-bold tracking-wider block">
              CINEMATIC CONCEPT & VISUAL TREATMENT
            </span>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              {currentVideo.conceptDescription}
            </p>
          </div>

          <div className="p-3.5 bg-black/60 rounded border border-white/10 space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                INTEGRATION PURPOSE
              </span>
              <span className="text-white font-semibold block">{currentVideo.purpose}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                CAMERA TRAJECTORY
              </span>
              <span className="text-slate-300 font-sans text-xs block">{currentVideo.cameraMovement}</span>
            </div>
          </div>
        </div>

        {/* Bottom Clip Selector Strip & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
            {VEO_CINEMATIC_VIDEOS.map((vid, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={vid.id}
                  onClick={() => {
                    triggerAudio('click');
                    setActiveIdx(idx);
                  }}
                  className={clsx(
                    'px-2 py-1 rounded transition-colors border',
                    isSelected
                      ? 'bg-ece-cyan text-black font-bold border-ece-cyan shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-black/50 text-slate-400 hover:text-white border-white/10'
                  )}
                >
                  0{idx + 1} {vid.id.slice(0, 6)}
                </button>
              );
            })}
          </div>

          {/* Quick link to project experience if relevant */}
          {['rfWave', 'solarEnergy', 'aiTransition'].includes(currentVideo.id) && (
            <button
              onClick={() => handleLaunchRelatedProject(currentVideo.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ece-cyan/20 hover:bg-ece-cyan/30 text-ece-cyan font-mono text-xs font-bold rounded border border-ece-cyan transition-colors"
            >
              <span>LAUNCH RELATED 3D PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
