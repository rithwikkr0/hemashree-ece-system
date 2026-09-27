import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSystem, BootStage } from '../../context/SystemContext';
import { ProceduralPCB } from './ProceduralPCB';
import { HologramPortraitPlane } from './HologramPortraitPlane';
import { ECECoreObject } from './ECECoreObject';
import { HeroEnvironmentObjects } from './HeroEnvironmentObjects';

interface CinematicBootDirectorProps {
  onStageChange?: (stage: BootStage) => void;
}

export const CinematicBootDirector: React.FC<CinematicBootDirectorProps> = ({
  onStageChange,
}) => {
  const { camera } = useThree();
  const { 
    isBooting, 
    setIsBooting, 
    isIntroSkipped, 
    bootStage, 
    setBootStage, 
    triggerAudio 
  } = useSystem();

  // Animation progress values driven by GSAP timeline
  const animState = useRef({
    pcbPower: 0,
    pcbPulse: 0,
    camX: 0,
    camY: -0.8,
    camZ: 2.8,
    lookX: 0,
    lookY: 0,
    lookZ: 0,
    portraitReveal: 0,
    portraitScan: 0,
    portraitDissolve: 0,
    coreActivation: 0,
  });

  const mousePos = useRef({ x: 0, y: 0 });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Mouse move listener for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main cinematic timeline
  useEffect(() => {
    if (isIntroSkipped || bootStage === 'HERO') {
      // Immediate skip state
      animState.current = {
        pcbPower: 1,
        pcbPulse: 1,
        camX: 0,
        camY: 0,
        camZ: 7.2,
        lookX: 0,
        lookY: 0,
        lookZ: 0,
        portraitReveal: 0,
        portraitScan: 0,
        portraitDissolve: 1,
        coreActivation: 1,
      };
      setBootStage('HERO');
      setIsBooting(false);
      return;
    }

    const state = animState.current;
    const tl = gsap.timeline({
      onComplete: () => {
        setBootStage('HERO');
        setIsBooting(false);
        triggerAudio('coreConfirm');
      },
    });
    timelineRef.current = tl;

    // Scene 01: BOOT (0 - 1.2s)
    tl.call(() => {
      setBootStage('BOOT');
      triggerAudio('boot');
    }, undefined, 0);

    // Scene 02: PCB_POWER (1.2s - 3.2s)
    tl.call(() => {
      setBootStage('PCB_POWER');
      triggerAudio('pulse');
    }, undefined, 1.2);

    tl.to(state, {
      pcbPower: 1,
      duration: 1.8,
      ease: 'power2.out',
    }, 1.2);

    // Scene 03: CAMERA_FLIGHT (3.2s - 4.5s)
    tl.call(() => {
      setBootStage('CAMERA_FLIGHT');
      triggerAudio('pulse');
    }, undefined, 3.2);

    tl.to(state, {
      camZ: 1.8,
      camY: 0.1,
      duration: 1.3,
      ease: 'power2.inOut',
    }, 3.2);

    // Scene 04: PORTRAIT_REVEAL (4.5s - 6.0s)
    tl.call(() => {
      setBootStage('PORTRAIT_REVEAL');
    }, undefined, 4.5);

    tl.to(state, {
      portraitReveal: 1,
      camZ: 3.5,
      camY: 0,
      duration: 1.5,
      ease: 'power1.out',
    }, 4.5);

    // Scene 05: HUD_SCAN (6.0s - 7.5s)
    tl.call(() => {
      setBootStage('HUD_SCAN');
      triggerAudio('scan');
    }, undefined, 6.0);

    tl.to(state, {
      portraitScan: 1,
      duration: 1.4,
      ease: 'linear',
    }, 6.0);

    // Scene 06: PARTICLE_TRANSFORMATION (7.5s - 9.0s)
    tl.call(() => {
      setBootStage('PARTICLE_TRANSFORM');
      triggerAudio('pulse');
    }, undefined, 7.5);

    tl.to(state, {
      portraitDissolve: 1,
      duration: 1.5,
      ease: 'power2.inOut',
    }, 7.5);

    // Scene 07: CORE_ACTIVATE (9.0s - 10.5s)
    tl.call(() => {
      setBootStage('CORE_ACTIVATE');
      triggerAudio('coreConfirm');
    }, undefined, 9.0);

    tl.to(state, {
      coreActivation: 1,
      camZ: 5.5,
      duration: 1.5,
      ease: 'back.out(1.4)',
    }, 9.0);

    // Scene 08: HERO (10.5s)
    tl.to(state, {
      camZ: 7.2,
      duration: 1.2,
      ease: 'power2.out',
    }, 10.5);

    return () => {
      tl.kill();
    };
  }, [isIntroSkipped, bootStage, setBootStage, setIsBooting, triggerAudio]);

  // Frame update: sync Three.js camera with animState + subtle mouse parallax
  useFrame(() => {
    const s = animState.current;

    // Subtle parallax during Hero state
    const isHero = bootStage === 'HERO';
    const parallaxX = isHero ? mousePos.current.x * 0.4 : 0;
    const parallaxY = isHero ? mousePos.current.y * 0.25 : 0;

    camera.position.x = s.camX + parallaxX;
    camera.position.y = s.camY + parallaxY;
    camera.position.z = s.camZ;

    camera.lookAt(s.lookX, s.lookY, s.lookZ);
  });

  return (
    <>
      {/* Volumetric / Studio Ambient & Accent Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[0, 0, 2]} color="#00f0ff" intensity={1.8} distance={8} />
      <pointLight position={[0, -2, -1]} color="#ff7b00" intensity={0.9} distance={6} />

      {/* Procedural PCB Substrate (Scenes 02 - 03, background thereafter) */}
      <ProceduralPCB
        powerLevel={animState.current.pcbPower}
        pulseProgress={animState.current.pcbPulse}
      />

      {/* Hologram Portrait Plane (Scenes 04 - 06) */}
      <HologramPortraitPlane
        revealProgress={animState.current.portraitReveal}
        scanProgress={animState.current.portraitScan}
        dissolveProgress={animState.current.portraitDissolve}
      />

      {/* Central Floating ECE Core (Scenes 06 - 08) */}
      <ECECoreObject
        activationProgress={animState.current.coreActivation}
      />

      {/* Hero Environment Laboratory Instruments (Scene 08) */}
      <HeroEnvironmentObjects
        visible={bootStage === 'HERO' || animState.current.coreActivation > 0.5}
      />
    </>
  );
};
