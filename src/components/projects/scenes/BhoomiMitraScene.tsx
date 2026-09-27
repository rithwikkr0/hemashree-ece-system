import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSystem } from '../../../context/SystemContext';
import { Sprout, CloudSun, Globe2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface FarmPlot {
  id: string;
  code: string;
  crop: string;
  moisture: string;
  health: string;
  advisoryKannada: string;
  advisoryEnglish: string;
  pos: [number, number, number];
}

const FARM_PLOTS: FarmPlot[] = [
  {
    id: 'plot-1',
    code: 'PLOT 01 // NORTH',
    crop: 'Finger Millet (Ragi)',
    moisture: '44% [SIMULATION]',
    health: 'Optimal Growth',
    advisoryKannada: 'ರಾಗಿ ಬೆಳೆಯ ಬೆಳವಣಿಗೆ ಉತ್ತಮವಾಗಿದೆ. ತೇವಾಂಶ ಸ್ಥಿರವಾಗಿದೆ.',
    advisoryEnglish: 'Ragi crop growth optimal. Soil moisture adequate for tillering.',
    pos: [-2.2, 0, -1.8],
  },
  {
    id: 'plot-2',
    code: 'PLOT 02 // EAST',
    crop: 'Maize (Corn)',
    moisture: '31% [SIMULATION]',
    health: 'Water Stress Warning',
    advisoryKannada: 'ಮೆಕ್ಕೆಜೋಳ ಬೆಳೆಗೆ ನೀರಿನ ಕೊರತೆಯಿದೆ. ನೀರಾವರಿ ಒದಗಿಸಿ.',
    advisoryEnglish: 'Maize plot showing early moisture stress. Schedule drip cycle.',
    pos: [1.8, 0, -1.8],
  },
  {
    id: 'plot-3',
    code: 'PLOT 03 // SOUTH',
    crop: 'Pigeon Pea (Tur Dal)',
    moisture: '48% [SIMULATION]',
    health: 'Healthy Canopy',
    advisoryKannada: 'ತೊಗರಿ ಬೆಳೆ ಹೂಬಿಡುವ ಹಂತದಲ್ಲಿದೆ. ಕೀಟ ಬಾಧೆ ನಿಯಂತ್ರಣದಲ್ಲಿದೆ.',
    advisoryEnglish: 'Pigeon pea in flowering stage. Low pest incidence detected.',
    pos: [-1.8, 0, 1.8],
  },
  {
    id: 'plot-4',
    code: 'PLOT 04 // WEST',
    crop: 'Groundnut (Peanut)',
    moisture: '38% [SIMULATION]',
    health: 'Leaf Spot Risk Alert',
    advisoryKannada: 'ಎಲೆ ಚುಕ್ಕೆ ರೋಗದ ಲಕ್ಷಣಗಳಿವೆ. ಜೈವಿಕ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ.',
    advisoryEnglish: 'Early leaf spot warning detected. Apply recommended bio-fungicide.',
    pos: [2.2, 0, 1.8],
  },
];

export const BhoomiMitraScene: React.FC = () => {
  const { triggerAudio } = useSystem();
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot>(FARM_PLOTS[0]);

  return (
    <group position={[0, -0.4, 0]}>
      {/* 1. Satellite Agricultural Terrain Grid */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color="#06120e"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grid Wireframe Overlay */}
      <gridHelper args={[12, 24, '#10b981', '#064e3b']} position={[0, -0.08, 0]} />

      {/* 2. Interactive Farm Plots */}
      {FARM_PLOTS.map((plot) => {
        const isSelected = selectedPlot.id === plot.id;
        return (
          <group
            key={plot.id}
            position={plot.pos}
            onClick={(e) => {
              e.stopPropagation();
              triggerAudio('click');
              setSelectedPlot(plot);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            {/* Plot Surface */}
            <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
              <boxGeometry args={[2.2, 0.1, 2.2]} />
              <meshStandardMaterial
                color={isSelected ? '#065f46' : '#042f2e'}
                roughness={0.6}
              />
            </mesh>

            {/* Glowing Border */}
            <mesh position={[0, 0.11, 0]}>
              <boxGeometry args={[2.22, 0.02, 2.22]} />
              <meshBasicMaterial
                color={isSelected ? '#10b981' : '#047857'}
                wireframe
              />
            </mesh>

            {/* Plot Crop Plant Rows */}
            {[-0.6, 0, 0.6].map((x) => (
              <mesh key={x} position={[x, 0.2, 0]}>
                <cylinderGeometry args={[0.04, 0.08, 0.25, 6]} />
                <meshStandardMaterial color={isSelected ? '#34d399' : '#059669'} />
              </mesh>
            ))}

            {/* Plot Marker Tag */}
            <Html position={[0, 0.6, 0]} center distanceFactor={8} pointerEvents="none">
              <div
                className={clsx(
                  'px-2 py-1 rounded font-mono text-[9px] font-bold whitespace-nowrap transition-all shadow-[0_0_12px_rgba(0,0,0,0.8)]',
                  isSelected
                    ? 'bg-emerald-500 text-black border border-white'
                    : 'bg-black/80 text-emerald-400 border border-emerald-500/30'
                )}
              >
                {plot.code}
              </div>
            </Html>
          </group>
        );
      })}

      {/* 3. Central AI Processing Core / Satellite Node */}
      <group position={[0, 1.6, 0]}>
        <mesh>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#059669"
            emissive="#10b981"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>
        <Html position={[0, 0.8, 0]} center distanceFactor={8} pointerEvents="none">
          <div className="px-2.5 py-1 bg-black/90 border border-emerald-400 rounded font-mono text-[9px] text-emerald-400 whitespace-nowrap shadow-[0_0_15px_#10b981]">
            GEMINI VERNACULAR AI CORE
          </div>
        </Html>
      </group>

      {/* 4. Telemetry & Vernacular Advisory Overlay (Html bottom card) */}
      <Html position={[0, -2.6, 0]} center distanceFactor={5.5} pointerEvents="auto">
        <div className="max-w-md w-[360px] p-3.5 bg-black/90 border border-emerald-500/50 rounded tech-corner-cut backdrop-blur-xl shadow-[0_0_25px_rgba(16,185,129,0.2)] font-mono text-xs select-none space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" />
              {selectedPlot.code}
            </span>
            <span className="text-slate-400">{selectedPlot.crop}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-1.5 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block text-[8px]">SOIL MOISTURE</span>
              <span className="text-emerald-400 font-bold">{selectedPlot.moisture}</span>
            </div>
            <div className="p-1.5 bg-white/5 rounded border border-white/5">
              <span className="text-slate-500 block text-[8px]">HEALTH STATUS</span>
              <span className="text-white font-bold">{selectedPlot.health}</span>
            </div>
          </div>

          {/* Vernacular Kannada & English Output */}
          <div className="p-2 bg-emerald-950/30 border border-emerald-500/30 rounded text-[10px] space-y-1 font-sans">
            <span className="text-[9px] font-mono text-emerald-400 font-bold block">
              VERNACULAR ADVISORY (ಕನ್ನಡ / ENGLISH):
            </span>
            <p className="text-emerald-200 leading-snug">
              {selectedPlot.advisoryKannada}
            </p>
            <p className="text-slate-300 leading-snug text-[9px]">
              {selectedPlot.advisoryEnglish}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
};
