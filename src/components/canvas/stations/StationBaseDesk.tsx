import React, { useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { StationId } from '../../../types/lab';

interface StationBaseDeskProps {
  stationId: StationId;
  stationNumber: string;
  name: string;
  category: string;
  isSelected: boolean;
  children: React.ReactNode;
}

export const StationBaseDesk: React.FC<StationBaseDeskProps> = ({
  stationId,
  stationNumber,
  name,
  category,
  isSelected,
  children,
}) => {
  const { selectStation, triggerAudio } = useSystem();
  const deskRef = useRef<THREE.Group>(null);

  return (
    <group ref={deskRef}>
      {/* Workstation Desk Surface (Dark Graphite Chamfered Slab) */}
      <mesh
        receiveShadow
        castShadow
        position={[0, -0.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          triggerAudio('click');
          selectStation(stationId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <cylinderGeometry args={[1.8, 1.9, 0.12, 6]} />
        <meshStandardMaterial
          color={isSelected ? '#0c1a26' : '#080d14'}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Hexagonal Cyan Edge Glow Border */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[1.82, 1.82, 0.02, 6]} />
        <meshBasicMaterial
          color={isSelected ? '#00f0ff' : '#00f0ff33'}
          wireframe
        />
      </mesh>

      {/* Station Floating Label & Select Pin */}
      <Html
        position={[0, 1.6, 0]}
        center
        distanceFactor={14}
        pointerEvents="auto"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerAudio('click');
            selectStation(isSelected ? null : stationId);
          }}
          className={`group flex items-center gap-2 px-2.5 py-1 rounded border backdrop-blur-md transition-all duration-300 font-mono text-[10px] select-none ${
            isSelected
              ? 'bg-ece-cyan text-black border-ece-cyan font-bold shadow-[0_0_20px_#00f0ff]'
              : 'bg-black/80 text-slate-300 border-ece-cyan/30 hover:border-ece-cyan hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.8)]'
          }`}
          title={`Click to focus station ${stationNumber} — ${name}`}
        >
          <span className={`px-1 rounded text-[9px] font-bold ${
            isSelected ? 'bg-black text-ece-cyan' : 'bg-ece-cyan/20 text-ece-cyan'
          }`}>
            {stationNumber}
          </span>
          <span className="font-tech uppercase font-bold tracking-wider whitespace-nowrap">
            {name}
          </span>
        </button>
      </Html>

      {/* Bench Contents */}
      {children}
    </group>
  );
};
