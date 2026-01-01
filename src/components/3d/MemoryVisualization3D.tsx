'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Sphere, 
  MeshDistortMaterial, 
  Float,
  Trail,
  Stars,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

interface MemoryNodeProps {
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
  distort?: number;
}

function MemoryNode({ position, color, size = 0.3, speed = 1, distort = 0.4 }: MemoryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <Trail
        width={2}
        length={6}
        color={color}
        attenuation={(t) => t * t}
      >
        <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={distort}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Trail>
    </Float>
  );
}

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

function ConnectionLine({ start, end, color }: ConnectionLineProps) {
  const ref = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 1,
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end)
    );
    return curve.getPoints(50);
  }, [start, end]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.5} linewidth={2} />
    </line>
  );
}

function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      coreRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -state.clock.getElapsedTime() * 0.2;
      ring2Ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere ref={coreRef} args={[1, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#00f5ff"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            emissive="#00f5ff"
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Float>

      {/* Orbital Ring 1 */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.6} />
      </mesh>

      {/* Orbital Ring 2 */}
      <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.4} />
      </mesh>

      {/* Inner Glow */}
      <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.2, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const nodes = useMemo(() => [
    { position: [3, 1, -2] as [number, number, number], color: '#00f5ff' },
    { position: [-3, -1, -1] as [number, number, number], color: '#bf00ff' },
    { position: [2, -2, 1] as [number, number, number], color: '#ff00ff' },
    { position: [-2, 2, -1] as [number, number, number], color: '#00ff88' },
    { position: [0, 3, -2] as [number, number, number], color: '#ff8800' },
    { position: [-1, -3, 0] as [number, number, number], color: '#0080ff' },
  ], []);

  const connections = useMemo(() => [
    { start: [0, 0, 0] as [number, number, number], end: nodes[0].position, color: '#00f5ff' },
    { start: [0, 0, 0] as [number, number, number], end: nodes[1].position, color: '#bf00ff' },
    { start: [0, 0, 0] as [number, number, number], end: nodes[2].position, color: '#ff00ff' },
    { start: [0, 0, 0] as [number, number, number], end: nodes[3].position, color: '#00ff88' },
    { start: [0, 0, 0] as [number, number, number], end: nodes[4].position, color: '#ff8800' },
    { start: [0, 0, 0] as [number, number, number], end: nodes[5].position, color: '#0080ff' },
    { start: nodes[0].position, end: nodes[3].position, color: '#00f5ff' },
    { start: nodes[1].position, end: nodes[4].position, color: '#bf00ff' },
    { start: nodes[2].position, end: nodes[5].position, color: '#ff00ff' },
  ], [nodes]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />

      <CentralCore />

      {nodes.map((node, i) => (
        <MemoryNode
          key={i}
          position={node.position}
          color={node.color}
          size={0.25}
          speed={0.5 + Math.random() * 0.5}
          distort={0.3}
        />
      ))}

      {connections.map((conn, i) => (
        <ConnectionLine
          key={i}
          start={conn.start}
          end={conn.end}
          color={conn.color}
        />
      ))}

      <ParticleField />
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.002, 0.002)}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

export default function MemoryVisualization3D() {
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-mosyne-dark via-transparent to-transparent" />
    </div>
  );
}
