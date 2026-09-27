import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ProceduralPCB } from './ProceduralPCB';
import { ECECoreObject } from './ECECoreObject';

export const Hero3DEnvironment: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Subtle ambient floating dust particles (restrained count: 35)
  const particlesGeo = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 6 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02;
    }
    if (groupRef.current) {
      // Very gentle drift to give subtle depth
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Studio / Bench Soft Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.0}
        color="#ffffff"
      />
      <pointLight position={[0, 0.4, 0]} color="#00f0ff" intensity={1.2} distance={8} />
      <pointLight position={[0, 2, 3]} color="#ff7b00" intensity={0.5} distance={6} />

      {/* Procedural PCB Substrate with gentle trace pulse */}
      <ProceduralPCB powerLevel={1} pulseProgress={1} />

      {/* Subtle Circular Ground Rings for technical depth */}
      {[3.5, 6.5, 10].map((radius) => (
        <mesh key={radius} position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.015, radius + 0.015, 64]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.04} />
        </mesh>
      ))}

      {/* Central Floating ECE Core Object */}
      <group position={[0, 0, 0]} scale={0.95}>
        <ECECoreObject activationProgress={1} />
      </group>

      {/* Minimal Floating Ambient Data Particles */}
      <points ref={particlesRef} geometry={particlesGeo}>
        <pointsMaterial
          size={0.04}
          color="#00f0ff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default Hero3DEnvironment;
