import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LAB_STATIONS_DATA } from '../../data/labStations';
import { useSystem } from '../../context/SystemContext';

export const LabSignalNetwork: React.FC = () => {
  const { performanceMode } = useSystem();
  const pulseGroupRef = useRef<THREE.Group>(null);

  // Generate curved 3D signal splines from each station to the central ECE Core
  const { paths, lineGeometries } = useMemo(() => {
    const curves: THREE.QuadraticBezierCurve3[] = [];
    const geoms: { geom: THREE.BufferGeometry; color: string }[] = [];

    const stationColors: Record<string, string> = {
      embedded: '#00f0ff',
      sensor: '#38bdf8',
      rf: '#f59e0b',
      dsp: '#00ff88',
      iot: '#0ea5e9',
      'ai-mobile': '#00f0ff',
      power: '#f59e0b',
    };

    LAB_STATIONS_DATA.forEach((station) => {
      const start = new THREE.Vector3(...station.position);
      const end = new THREE.Vector3(0, 0.2, 0); // ECE Core position
      // Elevate the midpoint curve
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2,
        Math.max(start.y, end.y) + 0.6,
        (start.z + end.z) / 2
      );
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      curves.push(curve);

      const pts = curve.getPoints(32);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      geoms.push({ geom, color: stationColors[station.id] || '#00f0ff' });
    });

    return { paths: curves, lineGeometries: geoms };
  }, []);

  // Animate traveling data packets along the splines
  useFrame((state) => {
    if (pulseGroupRef.current && performanceMode !== 'low') {
      const time = state.clock.getElapsedTime();
      pulseGroupRef.current.children.forEach((mesh, idx) => {
        const curve = paths[idx];
        if (curve) {
          const t = (time * 0.45 + idx * 0.14) % 1;
          const pos = curve.getPoint(t);
          mesh.position.copy(pos);
          const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = Math.sin(t * Math.PI) * 0.85;
          }
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Static Substrate Connecting Lines */}
      {lineGeometries.map((item, idx) => (
        <primitive
          key={idx}
          object={new THREE.Line(
            item.geom,
            new THREE.LineBasicMaterial({
              color: item.color,
              transparent: true,
              opacity: 0.2,
              linewidth: 1,
            })
          )}
        />
      ))}

      {/* Traveling Data Packets */}
      <group ref={pulseGroupRef}>
        {paths.map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial
              color={lineGeometries[idx].color}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
