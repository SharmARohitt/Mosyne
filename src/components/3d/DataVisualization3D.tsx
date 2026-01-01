'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Sphere,
  MeshDistortMaterial,
  Float,
  Icosahedron,
  Torus,
  Box,
  Text3D,
  Center,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

interface HexGridProps {
  rows: number;
  cols: number;
  data: number[][];
}

function HexGrid({ rows, cols, data }: HexGridProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI * 0.3 + Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
      groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  const hexagons = useMemo(() => {
    const items = [];
    const hexSize = 0.5;
    const spacing = hexSize * 1.8;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + (row % 2 === 0 ? 0 : spacing / 2) - (cols * spacing) / 2;
        const z = row * spacing * 0.866 - (rows * spacing * 0.866) / 2;
        const value = data[row]?.[col] ?? Math.random();
        const height = value * 2 + 0.1;

        const color = new THREE.Color();
        if (value < 0.3) {
          color.setHSL(0.4, 1, 0.5); // Green
        } else if (value < 0.6) {
          color.setHSL(0.1, 1, 0.5); // Orange
        } else {
          color.setHSL(0.95, 1, 0.5); // Red
        }

        items.push({
          key: `${row}-${col}`,
          position: [x, height / 2, z] as [number, number, number],
          height,
          color,
          value,
        });
      }
    }
    return items;
  }, [rows, cols, data]);

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {hexagons.map((hex) => (
        <mesh key={hex.key} position={hex.position}>
          <cylinderGeometry args={[0.4, 0.4, hex.height, 6]} />
          <meshStandardMaterial
            color={hex.color}
            metalness={0.6}
            roughness={0.2}
            emissive={hex.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function DataSphere({ value, position, label }: { value: number; position: [number, number, number]; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.2;
    }
  });

  const color = value > 0.7 ? '#ff3366' : value > 0.4 ? '#ff8800' : '#00ff88';

  return (
    <group position={position}>
      <Float speed={2} floatIntensity={0.3}>
        <Icosahedron ref={meshRef} args={[0.5 + value * 0.3, 1]}>
          <MeshDistortMaterial
            color={color}
            distort={0.2}
            speed={3}
            roughness={0.2}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

function RiskRing({ risk, radius }: { risk: number; radius: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    }
  });

  const color = risk > 0.7 ? '#ff3366' : risk > 0.4 ? '#ff8800' : '#00ff88';
  const arcLength = Math.PI * 2 * risk;

  return (
    <group>
      {/* Background ring */}
      <Torus args={[radius, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.5} />
      </Torus>
      
      {/* Active ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.08, 16, Math.floor(100 * risk)]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Scene3DChart() {
  const data = useMemo(() => {
    return Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => Math.random())
    );
  }, []);

  const sphereData = useMemo(() => [
    { value: 0.8, position: [-3, 2, 0] as [number, number, number], label: 'Exploits' },
    { value: 0.5, position: [0, 2.5, -2] as [number, number, number], label: 'Rugs' },
    { value: 0.3, position: [3, 1.5, 0] as [number, number, number], label: 'Safe' },
    { value: 0.9, position: [-2, 3, 2] as [number, number, number], label: 'Drains' },
    { value: 0.6, position: [2, 2, 2] as [number, number, number], label: 'Gov' },
  ], []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, 5, -10]} intensity={0.7} color="#bf00ff" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} penumbra={1} color="#ffffff" />

      <HexGrid rows={8} cols={8} data={data} />

      {sphereData.map((sphere, i) => (
        <DataSphere key={i} {...sphere} />
      ))}

      <RiskRing risk={0.72} radius={4} />
      <RiskRing risk={0.45} radius={4.5} />
      <RiskRing risk={0.23} radius={5} />

      <EffectComposer>
        <Bloom
          intensity={1}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
        />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>
    </>
  );
}

export default function DataVisualization3D() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 6, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene3DChart />
        </Suspense>
      </Canvas>
    </div>
  );
}
