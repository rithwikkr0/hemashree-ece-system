// ==============================================================================
// HEMASHREE // ECE SYSTEM - 3D WAVEFORM RIBBON & FILTER CHOKEHOLD
// High-performance Three.js / R3F 3D spatial signal propagation.
// Visualizes raw contaminated wave passing through a holographic filter plane
// and emerging as a purified, filtered electric cyan trace.
// ==============================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DspSignalParams, DspFilterParams } from '../../types/dsp';
import { Float, Html } from '@react-three/drei';

interface Dsp3DRibbonProps {
  signalParams: DspSignalParams;
  filterParams: DspFilterParams;
}

export const Dsp3DRibbon: React.FC<Dsp3DRibbonProps> = ({
  signalParams,
  filterParams,
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const filterRingRef = useRef<THREE.Mesh>(null);

  const numPoints = 160;

  // Geometry initialization
  const { geometry } = useMemo(() => {
    const pts = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      // Propagate along Z from -5 to +5
      const z = (i / (numPoints - 1) - 0.5) * 8.0;
      pts[i * 3 + 0] = 0; // x
      pts[i * 3 + 1] = 0; // y
      pts[i * 3 + 2] = z; // z
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    return { geometry: geom };
  }, [numPoints]);

  const lineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: filterParams.type === 'bypass' ? '#ff9900' : '#00f0ff',
      linewidth: 2,
    });
    return new THREE.Line(geometry, mat);
  }, [geometry, filterParams.type]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (filterRingRef.current) {
      filterRingRef.current.rotation.z = time * 0.8;
    }

    if (lineRef.current) {
      const posAttr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      const f0 = signalParams.frequency;
      const A = signalParams.amplitude * 0.7;
      const noiseAmp = signalParams.noiseLevel * 0.6;
      const isBypass = filterParams.type === 'bypass';

      for (let i = 0; i < numPoints; i++) {
        const normZ = i / (numPoints - 1); // 0 (start) to 1 (end)
        const isPreFilter = normZ < 0.5; // Before filter boundary at z = 0

        const theta = normZ * Math.PI * 8 - time * (f0 * 0.8);
        let base = Math.sin(theta) * A;
        if (signalParams.waveform === 'square') {
          base = (Math.sin(theta) >= 0 ? 1 : -1) * A * 0.8;
        } else if (signalParams.waveform === 'triangle') {
          base = ((2 * A) / Math.PI) * Math.asin(Math.sin(theta));
        }

        // Noise addition: high in pre-filter, attenuated or eliminated in post-filter
        let noise = (Math.sin(theta * 7 + time * 12) * 0.4 +
                     Math.cos(theta * 13 - time * 18) * 0.3) * noiseAmp;

        if (!isPreFilter && !isBypass) {
          // Attenuation based on filter order and cutoff
          const factor = Math.max(0.05, 1.0 / (filterParams.order * 2));
          noise *= factor;
        }

        const y = base + noise;
        const x = Math.sin(normZ * Math.PI * 2) * 0.2; // Subtle 3D curvature

        arr[i * 3 + 0] = x;
        arr[i * 3 + 1] = y;
        // z remains fixed
      }

      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Spatial 3D Waveform Line */}
      <primitive object={lineObject} ref={lineRef} />

      {/* 2. Holographic Filter Chokehold Plane at Z = 0 */}
      <group position={[0, 0, 0]}>
        {/* Outer Torus Ring */}
        <mesh ref={filterRingRef}>
          <torusGeometry args={[1.5, 0.04, 16, 32]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>

        {/* Translucent Chokehold Disc */}
        <mesh>
          <circleGeometry args={[1.45, 32]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* HTML 3D Label */}
        <Html position={[0, 1.8, 0]} center distanceFactor={8}>
          <div className="bg-black/90 border border-ece-cyan/50 px-2.5 py-1 rounded text-[10px] font-mono text-ece-cyan whitespace-nowrap shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <span className="font-bold">
              {filterParams.type === 'bypass' ? 'FILTER BYPASS' : `DSP FILTER PLANE [${filterParams.type.toUpperCase()}]`}
            </span>
          </div>
        </Html>
      </group>

      {/* 3. Input & Output Directional Tags */}
      <Html position={[0, -1.5, -3.8]} center distanceFactor={8}>
        <div className="bg-amber-500/10 border border-amber-500/40 text-amber-400 px-2 py-0.5 rounded text-[9px] font-mono">
          ▲ RAW SIGNAL IN
        </div>
      </Html>

      <Html position={[0, -1.5, 3.8]} center distanceFactor={8}>
        <div className="bg-ece-cyan/10 border border-ece-cyan/40 text-ece-cyan px-2 py-0.5 rounded text-[9px] font-mono font-bold">
          ▼ FILTERED OUT
        </div>
      </Html>

      {/* 4. Subtle PCB Grid Plane Underneath */}
      <gridHelper
        args={[10, 20, '#00f0ff', '#1e293b']}
        position={[0, -1.8, 0]}
      />
    </group>
  );
};
