import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSystem } from '../../context/SystemContext';

interface ECECoreObjectProps {
  activationProgress: number; // 0 to 1
  onClick?: () => void;
}

export const ECECoreObject: React.FC<ECECoreObjectProps> = ({
  activationProgress = 1,
  onClick,
}) => {
  const { triggerAudio } = useSystem();
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const waveformRef = useRef<THREE.Line>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const pulseTimeRef = useRef(0);

  // Generate 3D Sine Waveform geometry
  const { waveGeometry } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const x = Math.cos(theta) * 2.8;
      const y = Math.sin(theta) * 2.8;
      const z = Math.sin(theta * 6) * 0.35;
      points.push(new THREE.Vector3(x, y, z));
    }
    // Close the loop
    points.push(points[0].clone());
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return { waveGeometry: geom };
  }, []);

  // Frame animation loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speedMultiplier = hovered ? 1.5 : 1.0;

    // Subtle floating levitation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.2) * 0.12;
      groupRef.current.rotation.y = time * 0.15 * speedMultiplier;
    }

    // Concentric Gimbal Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.4 * speedMultiplier;
      ring1Ref.current.rotation.z = time * 0.2 * speedMultiplier;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.3 * speedMultiplier;
      ring2Ref.current.rotation.x = Math.sin(time * 0.5) * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.25 * speedMultiplier;
      ring3Ref.current.rotation.y = time * 0.35 * speedMultiplier;
    }

    // Dynamic wave modulation
    if (waveformRef.current) {
      const posAttr = waveformRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const count = posArray.length / 3;

      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        posArray[i * 3 + 2] = Math.sin(theta * 6 + time * 4) * 0.45 * activationProgress;
      }
      posAttr.needsUpdate = true;
    }

    // Shockwave pulse expansion on click
    if (pulseActive && shockwaveRef.current) {
      pulseTimeRef.current += delta * 2.5;
      const scale = 1 + pulseTimeRef.current * 4.5;
      shockwaveRef.current.scale.set(scale, scale, scale);
      const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 1 - pulseTimeRef.current);
      }
      if (pulseTimeRef.current >= 1) {
        setPulseActive(false);
        pulseTimeRef.current = 0;
      }
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    triggerAudio('pulse');
    setPulseActive(true);
    pulseTimeRef.current = 0;
    if (onClick) onClick();
  };

  const currentScale = Math.max(0.1, activationProgress);

  return (
    <group
      ref={groupRef}
      scale={[currentScale, currentScale, currentScale]}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        triggerAudio('click');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Central Processor Substrate (Hexagonal / Beveled Chip) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.28, 8]} />
        <meshStandardMaterial
          color="#06090e"
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Central Silicon Die with Emissive Circuit Markings */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.3, 0.06, 1.3]} />
        <meshStandardMaterial
          color="#0b1622"
          roughness={0.2}
          metalness={0.9}
          emissive="#00f0ff"
          emissiveIntensity={hovered ? 0.8 : 0.45}
        />
      </mesh>

      {/* Processor Core Core-Glow Crystal */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
        <meshStandardMaterial
          color="#00f0ff"
          roughness={0.1}
          metalness={0.95}
          emissive="#00f0ff"
          emissiveIntensity={hovered ? 1.6 : 1.1}
        />
      </mesh>

      {/* Die Perimeter Status LEDs */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.05;
        const z = Math.sin(angle) * 1.05;
        return (
          <mesh key={i} position={[x, 0.15, z]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#00f0ff' : '#ff7b00'}
            />
          </mesh>
        );
      })}

      {/* Gimbal Orbital Ring 1 (Inner Cyan Gyro Ring) */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.9, 0.028, 16, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            metalness={0.8}
            roughness={0.2}
            emissive="#00f0ff"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Orbiting Sensor Node on Ring 1 */}
        <mesh position={[1.9, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial
            color="#ff7b00"
            emissive="#ff7b00"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Gimbal Orbital Ring 2 (Middle Dark Titanium Ring) */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[2.3, 0.032, 16, 64]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 2.3, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      </group>

      {/* Gimbal Orbital Ring 3 (Outer Sensor Track) */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[2.7, 0.022, 16, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            metalness={0.7}
            roughness={0.3}
            emissive="#00f0ff"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>

      {/* Oscillating 3D Signal Waveform Ribbon */}
      <primitive object={new THREE.Line(waveGeometry, new THREE.LineBasicMaterial({
        color: '#00f0ff',
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
      }))} ref={waveformRef} />

      {/* Shockwave Pulse Ring (Expands on click) */}
      <mesh
        ref={shockwaveRef}
        rotation={[Math.PI / 2, 0, 0]}
        visible={pulseActive}
      >
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
