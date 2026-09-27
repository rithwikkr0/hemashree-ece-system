import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSystem } from '../../context/SystemContext';
import { LAB_STATIONS_DATA } from '../../data/labStations';
import { EmbeddedBenchStation } from './stations/EmbeddedBenchStation';
import { SensorLabStation } from './stations/SensorLabStation';
import { RFCommLabStation } from './stations/RFCommLabStation';
import { DSPSignalLabStation } from './stations/DSPSignalLabStation';
import { IoTHomeAutomationStation } from './stations/IoTHomeAutomationStation';
import { AIMobileStation } from './stations/AIMobileStation';
import { PowerSolarLabStation } from './stations/PowerSolarLabStation';
import { LabSignalNetwork } from './LabSignalNetwork';
import { ECECoreObject } from './ECECoreObject';

export const InteractiveLabArena: React.FC = () => {
  const { camera } = useThree();
  const { 
    labViewMode, 
    selectedStationId, 
    inspectedObjectId, 
    reducedMotion 
  } = useSystem();

  const camAnimRef = useRef({
    x: 0,
    y: 5.5,
    z: 11.5,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
  });

  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse parallax listener
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Camera transition controller
  useEffect(() => {
    let destPos = [0, 5.5, 11.5];
    let destTarget = [0, 0, 0];

    if (labViewMode === 'STATION_VIEW' && selectedStationId) {
      const station = LAB_STATIONS_DATA.find((s) => s.id === selectedStationId);
      if (station) {
        destPos = station.cameraPosition;
        destTarget = station.targetPosition;
      }
    } else if (labViewMode === 'INSPECT_VIEW' && inspectedObjectId) {
      // Find station for inspected object
      for (const station of LAB_STATIONS_DATA) {
        const obj = station.objects.find((o) => o.id === inspectedObjectId);
        if (obj) {
          destPos = [
            station.position[0] + (obj.inspectionCameraOffset?.[0] || 0),
            station.position[1] + 0.8,
            station.position[2] + 1.8,
          ];
          destTarget = [
            station.position[0] + obj.position[0],
            station.position[1] + obj.position[1],
            station.position[2] + obj.position[2],
          ];
          break;
        }
      }
    }

    if (reducedMotion) {
      camAnimRef.current = {
        x: destPos[0],
        y: destPos[1],
        z: destPos[2],
        targetX: destTarget[0],
        targetY: destTarget[1],
        targetZ: destTarget[2],
      };
      return;
    }

    gsap.to(camAnimRef.current, {
      x: destPos[0],
      y: destPos[1],
      z: destPos[2],
      targetX: destTarget[0],
      targetY: destTarget[1],
      targetZ: destTarget[2],
      duration: 1.4,
      ease: 'power3.inOut',
    });
  }, [labViewMode, selectedStationId, inspectedObjectId, reducedMotion]);

  // Frame update: update Three.js camera position and lookAt with subtle parallax
  useFrame(() => {
    const s = camAnimRef.current;
    const isOverview = labViewMode === 'LAB_OVERVIEW';
    const parallaxX = isOverview ? mouseRef.current.x * 0.4 : mouseRef.current.x * 0.15;
    const parallaxY = isOverview ? mouseRef.current.y * 0.25 : mouseRef.current.y * 0.1;

    camera.position.set(s.x + parallaxX, s.y + parallaxY, s.z);
    camera.lookAt(s.targetX, s.targetY, s.targetZ);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dark Graphite Circular Laboratory Floor Substrate */}
      <mesh receiveShadow position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial
          color="#06090e"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Laboratory Floor Grid Ring Markings */}
      {[4, 7, 10, 13].map((radius) => (
        <mesh key={radius} position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.08} />
        </mesh>
      ))}

      {/* Central Floating ECE Core */}
      <ECECoreObject activationProgress={1} />

      {/* Animated Signal / Data Flow Network */}
      <LabSignalNetwork />

      {/* 01: EMBEDDED SYSTEMS BENCH */}
      <group position={LAB_STATIONS_DATA[0].position}>
        <EmbeddedBenchStation isSelected={selectedStationId === 'embedded'} />
      </group>

      {/* 02: SENSOR LAB */}
      <group position={LAB_STATIONS_DATA[1].position}>
        <SensorLabStation isSelected={selectedStationId === 'sensor'} />
      </group>

      {/* 03: RF / COMMUNICATION LAB */}
      <group position={LAB_STATIONS_DATA[2].position}>
        <RFCommLabStation isSelected={selectedStationId === 'rf'} />
      </group>

      {/* 04: DSP / SIGNAL LAB */}
      <group position={LAB_STATIONS_DATA[3].position}>
        <DSPSignalLabStation isSelected={selectedStationId === 'dsp'} />
      </group>

      {/* 05: IoT / AUTOMATION LAB */}
      <group position={LAB_STATIONS_DATA[4].position}>
        <IoTHomeAutomationStation isSelected={selectedStationId === 'iot'} />
      </group>

      {/* 06: AI + MOBILE SYSTEMS */}
      <group position={LAB_STATIONS_DATA[5].position}>
        <AIMobileStation isSelected={selectedStationId === 'ai-mobile'} />
      </group>

      {/* 07: POWER / SOLAR SYSTEMS */}
      <group position={LAB_STATIONS_DATA[6].position}>
        <PowerSolarLabStation isSelected={selectedStationId === 'power'} />
      </group>
    </group>
  );
};
