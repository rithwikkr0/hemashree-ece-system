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

    // 0.0s - 0.7s: Clean Black + faint ambient glow
    tl.call(() => {
      setBootStage('BOOT');
      triggerAudio('boot');
    }, undefined, 0);

    // 0.7s - 1.6s: Single coherent pulse ring expanding
    tl.call(() => {
      setBootStage('PCB_POWER');
      triggerAudio('pulse');
    }, undefined, 0.7);

    tl.to(state, {
      pcbPulse: 1,
      duration: 0.9,
      ease: 'power2.out',
    }, 0.7);

    // 1.6s - 2.5s: Procedural PCB substrate lines illuminate
    tl.to(state, {
      pcbPower: 1,
      camZ: 2.2,
      duration: 0.9,
      ease: 'power2.out',
    }, 1.6);

    // 2.5s - 3.7s: High-res portrait fade-in (Ph.jpeg) with soft edge vignette
    tl.call(() => {
      setBootStage('PORTRAIT_REVEAL');
    }, undefined, 2.5);

    tl.to(state, {
      portraitReveal: 1,
      portraitScan: 1,
      camZ: 3.8,
      camY: 0,
      duration: 1.2,
      ease: 'power1.out',
    }, 2.5);

    // 3.7s - 4.7s: Smooth transition to Hero
    tl.call(() => {
      setBootStage('CORE_ACTIVATE');
      triggerAudio('coreConfirm');
    }, undefined, 3.7);

    tl.to(state, {
      portraitDissolve: 1,
      coreActivation: 1,
      camZ: 7.2,
      duration: 1.0,
      ease: 'power2.inOut',
    }, 3.7);

    // 4.7s - 5.0s: Hero settled, UI interactive
    tl.call(() => {
      setBootStage('HERO');
      setIsBooting(false);
    }, undefined, 4.7);

    return () => {
      tl.kill();
    };
  }, [isIntroSkipped]);

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
