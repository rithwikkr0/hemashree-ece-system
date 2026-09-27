import React, { useRef, useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { generateProceduralVideoPoster } from '../../config/assets';
import { Film, Play, Pause, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface CinematicVideoProps {
  src: string;
  poster?: string;
  fallbackCode?: string;
  fallbackTitle?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  overlayOpacity?: number;
  caption?: string;
  onEnded?: () => void;
  isBackground?: boolean;
}

export const CinematicVideo: React.FC<CinematicVideoProps> = ({
  src,
  poster,
  fallbackCode = 'VEO_CINEMATIC',
  fallbackTitle = 'Cinematic Engineering Transition',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  className,
  overlayOpacity = 0.35,
  caption,
  onEnded,
  isBackground = false,
}) => {
  const { reducedMotion } = useSystem();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Default procedural poster if custom poster not specified
  const effectivePoster = poster || generateProceduralVideoPoster(fallbackCode, fallbackTitle);

  // IntersectionObserver to pause playback when video is offscreen
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    if (reducedMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (autoPlay && !hasError) {
              video.play().catch(() => {
                // Autoplay policy prevented playback, graceful fallback to poster
                setIsPlaying(false);
              });
            }
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [autoPlay, hasError, reducedMotion]);

  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative overflow-hidden bg-ece-obsidian',
        isBackground ? 'pointer-events-none' : '',
        className
      )}
    >
      {!hasError && !reducedMotion ? (
        <video
          ref={videoRef}
          src={src}
          poster={effectivePoster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={() => setIsLoaded(true)}
          onEnded={onEnded}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        // High-Quality Procedural / Fallback Poster
        <div className="w-full h-full relative flex items-center justify-center bg-[#05080c]">
          <img
            src={effectivePoster}
            alt={fallbackTitle}
            className="w-full h-full object-cover filter contrast-105"
          />
          <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-25" />
        </div>
      )}

      {/* Cyber-Physical Vignette & Darkening Layer */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-transparent to-[#05080c] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Scanline Texture Overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />

      {/* Optional Top Caption / Code Badge */}
      {caption && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/75 backdrop-blur-md border border-ece-cyan/30 rounded font-mono text-[9px] text-ece-cyan">
            <Film className="w-3 h-3 text-ece-cyan" />
            <span>{caption}</span>
          </div>
        </div>
      )}

      {/* Manual Play/Pause Overlay Button if controls are requested and not a background */}
      {controls && !isBackground && (
        <button
          onClick={handlePlayToggle}
          className="absolute bottom-3 right-3 z-10 p-2 bg-black/80 hover:bg-ece-cyan/20 border border-ece-cyan/40 text-ece-cyan rounded-full transition-all"
          title={isPlaying ? 'Pause Clip' : 'Play Clip'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
