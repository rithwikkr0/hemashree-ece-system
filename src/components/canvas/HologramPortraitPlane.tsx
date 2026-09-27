import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ASSET_PATHS } from '../../config/assets';

interface HologramPortraitPlaneProps {
  revealProgress: number; // 0 (hidden) to 1 (fully revealed)
  scanProgress: number; // 0 to 1 (laser beam pass)
  dissolveProgress: number; // 0 (intact) to 1 (dissolved into core)
}

export const HologramPortraitPlane: React.FC<HologramPortraitPlaneProps> = ({
  revealProgress,
  scanProgress,
  dissolveProgress,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scanBeamRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load original photo texture safely with fallback
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      ASSET_PATHS.portraits.verifiedOriginal,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);
      },
      undefined,
      () => {
        // Fallback procedural canvas texture if webp not yet synthesized
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 0, 640);
          grad.addColorStop(0, '#0a1926');
          grad.addColorStop(0.5, '#00f0ff33');
          grad.addColorStop(1, '#05080c');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 512, 640);

          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(256, 220, 100, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(256, 480, 160, 140, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#00f0ff';
          ctx.font = '24px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('HEMASHREE // BIO_SCAN', 256, 580);
        }
        const fallbackTex = new THREE.CanvasTexture(canvas);
        setTexture(fallbackTex);
      }
    );
  }, []);

  // Generate particle grid for particle formation and morphing dissolve
  const { particleGeom, initialPositions, targetPositions } = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);

    const cols = 45;
    const rows = 40;
    let idx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (idx >= count) break;
        // Initial portrait grid coordinates
        const x = (c / cols - 0.5) * 3.6;
        const y = (0.5 - r / rows) * 4.4;
        const z = (Math.random() - 0.5) * 0.2;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        // Target positions: spiral/converge onto ECE core center (0, 0, 0)
        const angle = (idx / count) * Math.PI * 16;
        const radius = 0.2 + (idx / count) * 1.5;
        targets[idx * 3] = Math.cos(angle) * radius;
        targets[idx * 3 + 1] = Math.sin(angle) * radius;
        targets[idx * 3 + 2] = -2 - (idx / count) * 3;

        idx++;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    return { particleGeom: geom, initialPositions: positions, targetPositions: targets };
  }, []);

  // Update morphing particles and scanline beam
  useFrame((state) => {
    // Scanline laser movement
    if (scanBeamRef.current) {
      // Beam sweeps from top (2.2) to bottom (-2.2)
      scanBeamRef.current.position.y = 2.2 - scanProgress * 4.4;
    }

    // Particle morphing based on dissolveProgress
    if (particlesRef.current && initialPositions && targetPositions) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < posArray.length; i += 3) {
        const initX = initialPositions[i];
        const initY = initialPositions[i + 1];
        const initZ = initialPositions[i + 2];

        const targetX = targetPositions[i];
        const targetY = targetPositions[i + 1];
        const targetZ = targetPositions[i + 2];

        // Linear interpolation + turbulent particle displacement
        const t = dissolveProgress;
        const turbulence = Math.sin(time * 4 + i) * 0.15 * t;

        posArray[i] = THREE.MathUtils.lerp(initX, targetX, t) + turbulence;
        posArray[i + 1] = THREE.MathUtils.lerp(initY, targetY, t) + Math.cos(time * 3 + i) * 0.15 * t;
        posArray[i + 2] = THREE.MathUtils.lerp(initZ, targetZ, t);
      }
      posAttr.needsUpdate = true;
    }
  });

  if (revealProgress <= 0 && dissolveProgress >= 1) {
    return null;
  }

  const planeOpacity = Math.max(0, Math.min(1, revealProgress * (1 - dissolveProgress * 1.5)));

  return (
    <group position={[0, 0, 1]}>
      {/* Holographic Portrait Mesh */}
      {texture && planeOpacity > 0.01 && (
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <planeGeometry args={[3.6, 4.4]} />
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={planeOpacity * 0.9}
            roughness={0.2}
            metalness={0.1}
            emissive="#00f0ff"
            emissiveIntensity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hologram Scanning Frame Grid */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[3.8, 4.6]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={Math.max(0, Math.min(0.35, revealProgress * 0.5 * (1 - dissolveProgress)))}
        />
      </mesh>

      {/* Laser Scanning Beam */}
      {scanProgress > 0 && scanProgress < 1 && (
        <mesh ref={scanBeamRef} position={[0, 2.2, 0.05]}>
          <planeGeometry args={[4.2, 0.08]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Morphing Particles */}
      <points ref={particlesRef} geometry={particleGeom}>
        <pointsMaterial
          size={0.035}
          color="#00f0ff"
          transparent
          opacity={Math.max(0.1, dissolveProgress > 0 ? (1 - dissolveProgress * 0.8) : revealProgress)}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
