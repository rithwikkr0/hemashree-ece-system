import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralPCBProps {
  powerLevel: number; // 0 to 1
  pulseProgress: number; // 0 to 1
}

export const ProceduralPCB: React.FC<ProceduralPCBProps> = ({
  powerLevel,
  pulseProgress,
}) => {
  const pulseGroupRef = useRef<THREE.Group>(null);
  const ledsRef = useRef<THREE.InstancedMesh>(null);

  // Generate procedural circuit traces
  const { traceLines, icBoxes, solderPads } = useMemo(() => {
    const points: THREE.Vector3[] = [];

    // Circuit grid paths
    const traceDefs = [
      // Main power rail
      [[-6, -4, 0], [-2, -4, 0], [-2, 0, 0], [0, 0, 0]],
      [[0, 0, 0], [3, 0, 0], [3, 3, 0], [6, 3, 0]],
      [[-5, 2, 0], [-1, 2, 0], [-1, 4, 0], [2, 4, 0], [2, 6, 0]],
      [[-4, -2, 0], [0, -2, 0], [2, -1, 0], [5, -1, 0]],
      [[1, -5, 0], [1, -3, 0], [4, -3, 0], [4, -5, 0]],
      [[-3, 5, 0], [-3, 1, 0], [-5, 1, 0]],
      [[2, -2, 0], [5, -4, 0], [7, -4, 0]],
      [[-6, 0, 0], [-4, 0, 0], [-4, -3, 0]],
      // Central bus traces converging to die
      [[-1.5, -1.5, 0.05], [-0.8, -0.8, 0.05]],
      [[1.5, -1.5, 0.05], [0.8, -0.8, 0.05]],
      [[-1.5, 1.5, 0.05], [-0.8, 0.8, 0.05]],
      [[1.5, 1.5, 0.05], [0.8, 0.8, 0.05]],
    ];

    traceDefs.forEach((path) => {
      for (let i = 0; i < path.length - 1; i++) {
        points.push(new THREE.Vector3(path[i][0], path[i][1], path[i][2]));
        points.push(new THREE.Vector3(path[i + 1][0], path[i + 1][1], path[i + 1][2]));
      }
    });

    // SMD ICs & passives
    const ics = [
      { pos: [-3, 3, 0.08], size: [1.2, 0.8, 0.15], rot: 0 },
      { pos: [3.5, 2, 0.08], size: [1.0, 1.0, 0.15], rot: Math.PI / 4 },
      { pos: [-2.5, -2.5, 0.08], size: [1.4, 0.6, 0.12], rot: 0 },
      { pos: [4, -2.5, 0.08], size: [0.8, 0.8, 0.15], rot: 0 },
      { pos: [0, -4, 0.08], size: [1.6, 0.5, 0.12], rot: 0 },
      // SMD resistors / capacitors
      { pos: [-1.5, 2, 0.05], size: [0.35, 0.2, 0.08], rot: 0 },
      { pos: [-1.5, 1.5, 0.05], size: [0.35, 0.2, 0.08], rot: 0 },
      { pos: [2, 1, 0.05], size: [0.2, 0.35, 0.08], rot: 0 },
      { pos: [2.5, 1, 0.05], size: [0.2, 0.35, 0.08], rot: 0 },
      { pos: [1.5, -2, 0.05], size: [0.35, 0.2, 0.08], rot: 0 },
    ];

    // Solder pads / vias
    const pads: [number, number, number][] = [
      [-6, -4, 0.02], [-2, -4, 0.02], [-2, 0, 0.02], [3, 3, 0.02],
      [6, 3, 0.02], [-5, 2, 0.02], [2, 4, 0.02], [-4, -2, 0.02],
      [5, -1, 0.02], [4, -3, 0.02], [-3, 5, 0.02], [-5, 1, 0.02],
      [-4, -3, 0.02], [7, -4, 0.02],
    ];

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return { traceLines: geom, icBoxes: ics, solderPads: pads };
  }, []);

  // Animate pulse traveling across the PCB traces
  useFrame((state) => {
    if (pulseGroupRef.current) {
      const time = state.clock.getElapsedTime();
      pulseGroupRef.current.children.forEach((child, index) => {
        const offset = (time * 1.5 + index * 0.4) % 1;
        child.position.x = -6 + offset * 12;
        child.position.y = Math.sin(offset * Math.PI * 2) * 2;
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, Math.sin(offset * Math.PI) * powerLevel);
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 6, 0, 0]}>
      {/* Dark Graphite PCB Substrate */}
      <mesh receiveShadow position={[0, 0, -0.05]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial
          color="#060c12"
          roughness={0.7}
          metalness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* PCB Silkscreen Boundary & Grid Lines */}
      <gridHelper
        args={[16, 32, '#00f0ff', '#09212d']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0.01]}
      />

      {/* Copper / Glowing Circuit Traces */}
      <lineSegments geometry={traceLines}>
        <lineBasicMaterial
          color="#00f0ff"
          transparent
          opacity={Math.max(0.15, powerLevel * 0.85)}
          linewidth={1.5}
        />
      </lineSegments>

      {/* IC Packages on Board */}
      {icBoxes.map((ic, i) => (
        <group key={i} position={ic.pos as [number, number, number]} rotation={[0, 0, ic.rot]}>
          <mesh castShadow>
            <boxGeometry args={ic.size as [number, number, number]} />
            <meshStandardMaterial
              color="#0a0f16"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
          {/* IC Pin indicator dot / LED */}
          <mesh position={[-ic.size[0] / 3, ic.size[1] / 3, ic.size[2] / 2 + 0.01]}>
            <circleGeometry args={[0.04, 8]} />
            <meshBasicMaterial
              color={powerLevel > 0.4 ? (i % 2 === 0 ? '#00f0ff' : '#00ff88') : '#1e3a47'}
            />
          </mesh>
        </group>
      ))}

      {/* Solder Pads / Vias */}
      {solderPads.map((pad, i) => (
        <mesh key={i} position={pad}>
          <ringGeometry args={[0.04, 0.12, 12]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.9}
            roughness={0.2}
            emissive="#00f0ff"
            emissiveIntensity={powerLevel * 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Traveling Electrical Signal Pulses */}
      <group ref={pulseGroupRef}>
        {[0, 1, 2, 3].map((idx) => (
          <mesh key={idx} position={[-6, 0, 0.08]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
