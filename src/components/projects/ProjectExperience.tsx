import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PROJECTS_DATA } from '../../data/projects';
import { useSystem } from '../../context/SystemContext';
import { ProjectNavigation } from './components/ProjectNavigation';
import { ProjectIntro } from './components/ProjectIntro';
import { ProjectHUD } from './components/ProjectHUD';
import { ProjectPipeline } from './components/ProjectPipeline';
import { ProjectSummaryPanel } from './components/ProjectSummaryPanel';
import { CinematicInterstitialModal } from '../common/CinematicInterstitialModal';

import { LifemateScene } from './scenes/LifemateScene';
import { BhoomiMitraScene } from './scenes/BhoomiMitraScene';
import { SolarDewateringScene } from './scenes/SolarDewateringScene';
import { SmartBlindStickScene } from './scenes/SmartBlindStickScene';
import { BluetoothHomeAutomationScene } from './scenes/BluetoothHomeAutomationScene';
import { RfActivityDetectionScene } from './scenes/RfActivityDetectionScene';
import { SmartAmbientLightScene } from './scenes/SmartAmbientLightScene';
import { DigitalAudioFilterScene } from './scenes/DigitalAudioFilterScene';

export const ProjectExperience: React.FC = () => {
  const { 
    selectedProjectId, 
    setSelectedProjectId, 
    performanceMode 
  } = useSystem();

  // Find index of currently selected project
  const initialIndex = PROJECTS_DATA.findIndex((p) => p.id === selectedProjectId || p.slug === selectedProjectId);
  const [projectIndex, setProjectIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [showIntro, setShowIntro] = useState(false);
  const [cinematicModalId, setCinematicModalId] = useState<string | null>(null);

  if (!selectedProjectId) return null;

  const currentProject = PROJECTS_DATA[projectIndex];

  const getRelatedCinematicId = (id: string): string => {
    if (id === 'rf-activity-detection') return 'rfWave';
    if (id === 'solar-dewatering') return 'solarEnergy';
    if (id === 'lifemate-ai' || id === 'bhoomi-mitra') return 'aiTransition';
    if (id === 'digital-audio-filter-dsp') return 'finalSequence';
    if (id === 'bluetooth-home-automation') return 'boot';
    return 'pcbFlight';
  };

  const handleNavigate = (newIdx: number) => {
    setProjectIndex(newIdx);
  };

  const handleExit = () => {
    setSelectedProjectId(null);
  };

  // Render the active 3D scene on-demand
  const renderActiveScene = () => {
    switch (currentProject.order) {
      case 1:
        return <LifemateScene />;
      case 2:
        return <BhoomiMitraScene />;
      case 3:
        return <SolarDewateringScene />;
      case 4:
        return <SmartBlindStickScene />;
      case 5:
        return <BluetoothHomeAutomationScene />;
      case 6:
        return <RfActivityDetectionScene />;
      case 7:
        return <SmartAmbientLightScene />;
      case 8:
        return <DigitalAudioFilterScene />;
      default:
        return <LifemateScene />;
    }
  };

  const dpr = performanceMode === 'high' ? [1, 1.75] : performanceMode === 'medium' ? [1, 1.25] : [1, 1];

  return (
    <div className="fixed inset-0 z-50 bg-ece-bg overflow-hidden flex flex-col justify-between">
      {/* Veo Cinematic Interstitial Modal for Project */}
      {cinematicModalId && (
        <CinematicInterstitialModal
          isOpen={true}
          initialVideoId={cinematicModalId}
          onClose={() => setCinematicModalId(null)}
        />
      )}

      {/* Short 1.5s Initializing Intro HUD */}
      {showIntro && (
        <ProjectIntro
          project={currentProject}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Top Project Navigation (Prev, Next, Return to Lab) */}
      <ProjectNavigation
        currentProjectIndex={projectIndex}
        onNavigate={handleNavigate}
        onExit={handleExit}
      />

      {/* Top Left Project Identification HUD */}
      <ProjectHUD 
        project={currentProject} 
        onOpenCinematic={() => setCinematicModalId(getRelatedCinematicId(currentProject.id))}
      />

      {/* Top Right Technical Pipeline Node Stepper */}
      <ProjectPipeline pipeline={currentProject.pipeline} />

      {/* Main 3D Canvas Viewport */}
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 4.8], fov: 45 }}
          dpr={dpr as [number, number]}
          gl={{
            powerPreference: 'high-performance',
            antialias: performanceMode !== 'low',
            alpha: true,
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[6, 8, 5]} intensity={1.2} />
          <pointLight position={[0, 0, 2]} color="#00f0ff" intensity={1.2} distance={8} />

          <Suspense fallback={null}>
            {renderActiveScene()}
          </Suspense>
        </Canvas>
      </div>

      {/* Bottom Collapsible Technical Summary Panel */}
      <ProjectSummaryPanel project={currentProject} />
    </div>
  );
};
