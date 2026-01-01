'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Trail } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface NodeData {
  id: string;
  type: 'wallet' | 'contract' | 'transaction' | 'pattern';
  risk: number;
  position: [number, number, number];
}

function TransactionNode({ node, onClick }: { node: NodeData; onClick?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    switch (node.type) {
      case 'wallet': return '#00f5ff';
      case 'contract': return '#bf00ff';
      case 'transaction': return '#ff00ff';
      case 'pattern': return node.risk > 0.7 ? '#ff3366' : node.risk > 0.4 ? '#ff8800' : '#00ff88';
      default: return '#ffffff';
    }
  }, [node.type, node.risk]);

  const size = useMemo(() => {
    switch (node.type) {
      case 'wallet': return 0.4;
      case 'contract': return 0.5;
      case 'transaction': return 0.3;
      case 'pattern': return 0.35;
      default: return 0.3;
    }
  }, [node.type]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2 + node.position[0]) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={node.position}>
      <Float speed={2} floatIntensity={0.3}>
        <Trail width={1} length={4} color={color} attenuation={(t) => t * t}>
          <mesh ref={meshRef} onClick={onClick}>
            {node.type === 'contract' ? (
              <boxGeometry args={[size, size, size]} />
            ) : node.type === 'wallet' ? (
              <octahedronGeometry args={[size, 0]} />
            ) : (
              <sphereGeometry args={[size, 16, 16]} />
            )}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Trail>
      </Float>

      {/* Glow effect */}
      <Sphere args={[size * 1.5, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}

function FlowLine({ start, end, color, animated = true }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  animated?: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  const { points, curve } = useMemo(() => {
    const midPoint: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.5,
      (start[2] + end[2]) / 2,
    ];
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...midPoint),
      new THREE.Vector3(...end)
    );
    return { points: curve.getPoints(30), curve };
  }, [start, end]);

  useFrame((state) => {
    if (animated && particleRef.current) {
      const t = (state.clock.getElapsedTime() % 2) / 2;
      const point = curve.getPoint(t);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <line ref={lineRef}>
        <bufferGeometry setFromPoints={points} />
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>
      
      {animated && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
    </group>
  );
}

function TransactionFlowScene() {
  const nodes: NodeData[] = useMemo(() => [
    { id: '1', type: 'wallet', risk: 0.1, position: [-4, 0, 0] },
    { id: '2', type: 'contract', risk: 0.5, position: [-1, 1, 0] },
    { id: '3', type: 'transaction', risk: 0.3, position: [1, -1, 0] },
    { id: '4', type: 'pattern', risk: 0.8, position: [3, 0.5, 0] },
    { id: '5', type: 'wallet', risk: 0.2, position: [-2, -1.5, 1] },
    { id: '6', type: 'contract', risk: 0.6, position: [0, 1.5, -1] },
    { id: '7', type: 'transaction', risk: 0.9, position: [2, -0.5, 1] },
    { id: '8', type: 'pattern', risk: 0.4, position: [4, -1, 0] },
  ], []);

  const connections = useMemo(() => [
    { start: nodes[0].position, end: nodes[1].position, color: '#00f5ff' },
    { start: nodes[1].position, end: nodes[2].position, color: '#bf00ff' },
    { start: nodes[2].position, end: nodes[3].position, color: '#ff3366' },
    { start: nodes[0].position, end: nodes[4].position, color: '#00f5ff' },
    { start: nodes[4].position, end: nodes[5].position, color: '#bf00ff' },
    { start: nodes[5].position, end: nodes[6].position, color: '#ff8800' },
    { start: nodes[6].position, end: nodes[7].position, color: '#ff3366' },
    { start: nodes[1].position, end: nodes[5].position, color: '#00ff88' },
    { start: nodes[3].position, end: nodes[7].position, color: '#ff00ff' },
  ], [nodes]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />

      <group ref={groupRef}>
        {connections.map((conn, i) => (
          <FlowLine key={i} {...conn} />
        ))}
        {nodes.map((node) => (
          <TransactionNode key={node.id} node={node} />
        ))}
      </group>

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
      </EffectComposer>
    </>
  );
}

export default function TransactionFlow3D() {
  return (
    <div className="w-full h-full min-h-[350px]">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <TransactionFlowScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
