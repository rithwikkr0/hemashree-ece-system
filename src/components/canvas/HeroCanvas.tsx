import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSystem } from '../../context/SystemContext';
import { CinematicBootDirector } from './CinematicBootDirector';
import { InteractiveLabArena } from './InteractiveLabArena';
import { BootHUDOverlay } from './BootHUDOverlay';
import { HeroOverlay } from './HeroOverlay';
import { LabHUDOverlay } from './LabHUDOverlay';
import { CinematicVideo } from '../common/CinematicVideo';
import { ASSET_PATHS, FALLBACK_HOLOGRAM_PORTRAIT } from '../../config/assets';

// Error Boundary for WebGL compatibility
class WebGLBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const HeroCanvas: React.FC = () => {
  const { bootStage, isBooting, performanceMode, labViewMode, selectedStationId } = useSystem();
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL availability on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebGLSupported(supported);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Responsive DPR based on performance mode
  const dpr = performanceMode === 'high' ? [1, 1.75] : performanceMode === 'medium' ? [1, 1.25] : [1, 1];

  // 2D Graceful Fallback if WebGL is disabled or fails
  const fallback2D = (
    <div className="relative w-full h-[85vh] flex items-center justify-center bg-ece-obsidian p-6 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-36 h-36 mx-auto rounded-full border-2 border-ece-cyan p-1 shadow-[0_0_25px_#00f0ff]">
          <img
            src={ASSET_PATHS.portraits.hero}
            alt="Hemashree B M"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_HOLOGRAM_PORTRAIT;
            }}
            className="w-full h-full object-cover rounded-full filter contrast-110"
          />
        </div>
        <h2 className="font-tech text-3xl font-extrabold text-white">HEMASHREE B M</h2>
        <p className="font-mono text-xs text-ece-cyan">
          ECE CORE // 2D COMPATIBILITY MODE
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[100vh] min-h-[640px] bg-ece-bg overflow-hidden">
      {/* 2D Boot HUD Overlay (Active during boot sequence) */}
      <BootHUDOverlay stage={bootStage} />

      {/* 2D Hero Typography Overlay (Active when viewing lab overview without station focus) */}
      {!isBooting && labViewMode === 'LAB_OVERVIEW' && !selectedStationId && <HeroOverlay />}

      {/* 2D Lab HUD & Station Navigation Dock (Active ONLY when a station is focused or inspected) */}
      {!isBooting && (selectedStationId !== null || labViewMode !== 'LAB_OVERVIEW') && <LabHUDOverlay />}

      {/* Veo Cinematic Boot Background Texture Layer (Muted, non-blocking, subtle opacity) */}
      {isBooting && (
        <CinematicVideo
          src={ASSET_PATHS.videos.boot}
          poster={ASSET_PATHS.posters.boot}
          fallbackCode="VEO_01_BOOT"
          fallbackTitle="PCB Boot & Power Initialization"
          autoPlay={true}
          loop={false}
          isBackground={true}
          overlayOpacity={0.75}
          className="absolute inset-0 z-0 opacity-25 transition-opacity duration-1000"
        />
      )}

      {/* 3D R3F Canvas */}
      {webGLSupported ? (
        <WebGLBoundary fallback={fallback2D}>
          <Canvas
            camera={{ position: [0, -0.8, 2.8], fov: 45 }}
            dpr={dpr as [number, number]}
            gl={{
              powerPreference: 'high-performance',
              antialias: performanceMode !== 'low',
              alpha: true,
            }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              {isBooting ? (
                <CinematicBootDirector />
              ) : (
                <>
                  <ambientLight intensity={0.4} />
                  <directionalLight
                    position={[8, 12, 6]}
                    intensity={1.2}
                    color="#ffffff"
                    castShadow
                  />
                  <pointLight position={[0, 0.5, 0]} color="#00f0ff" intensity={1.5} distance={10} />
                  <pointLight position={[0, 2, 4]} color="#ff7b00" intensity={0.8} distance={8} />

                  <InteractiveLabArena />
                </>
              )}
            </Suspense>
          </Canvas>
        </WebGLBoundary>
      ) : (
        fallback2D
      )}
    </div>
  );
};
