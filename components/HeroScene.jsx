'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Floating wireframe torus knot ── */
function WireframeTorus({ mouse }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.x += 0.002;
        ref.current.rotation.y += 0.003;
        // Subtle mouse follow
        ref.current.rotation.x += (mouse.current.y * 0.3 - ref.current.rotation.x) * 0.01;
        ref.current.rotation.z += (mouse.current.x * 0.3 - ref.current.rotation.z) * 0.01;
    });

    return (
        <mesh ref={ref} position={[0, 0, 0]} scale={1.8}>
            <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
            <meshStandardMaterial
                color="#00ff41"
                wireframe
                transparent
                opacity={0.12}
                emissive="#00ff41"
                emissiveIntensity={0.3}
            />
        </mesh>
    );
}

/* ── Orbiting wireframe icosahedron ── */
function OrbitingIco({ mouse }) {
    const ref = useRef();
    const groupRef = useRef();

    useFrame((state) => {
        if (!ref.current || !groupRef.current) return;
        const t = state.clock.elapsedTime;
        // Orbit around center
        groupRef.current.rotation.y = t * 0.2;
        groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.3;
        // Self rotation
        ref.current.rotation.x += 0.005;
        ref.current.rotation.z += 0.008;
    });

    return (
        <group ref={groupRef}>
            <mesh ref={ref} position={[3.5, 0, 0]} scale={0.6}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#00f0ff"
                    wireframe
                    transparent
                    opacity={0.2}
                    emissive="#00f0ff"
                    emissiveIntensity={0.4}
                />
            </mesh>
        </group>
    );
}

/* ── Second orbiter: octahedron ── */
function OrbitingOcta({ mouse }) {
    const ref = useRef();
    const groupRef = useRef();

    useFrame((state) => {
        if (!ref.current || !groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.rotation.y = -t * 0.15 + Math.PI;
        groupRef.current.rotation.z = Math.cos(t * 0.08) * 0.2;
        ref.current.rotation.y += 0.01;
        ref.current.rotation.x += 0.006;
    });

    return (
        <group ref={groupRef}>
            <mesh ref={ref} position={[2.5, 1.5, -1]} scale={0.45}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#ff2d55"
                    wireframe
                    transparent
                    opacity={0.15}
                    emissive="#ff2d55"
                    emissiveIntensity={0.3}
                />
            </mesh>
        </group>
    );
}

/* ── Floating particles ── */
function Particles({ count = 300 }) {
    const ref = useRef();

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, [count]);

    const sizes = useMemo(() => {
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            s[i] = Math.random() * 2 + 0.5;
        }
        return s;
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y += 0.0003;
        ref.current.rotation.x += 0.0002;
        // Subtle breathing
        const t = state.clock.elapsedTime;
        ref.current.scale.setScalar(1 + Math.sin(t * 0.3) * 0.02);
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#00ff41"
                size={0.03}
                transparent
                opacity={0.4}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

/* ── Floating grid plane ── */
function GridFloor() {
    const ref = useRef();

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.position.z = (t * 0.5) % 2;
    });

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            <planeGeometry args={[30, 30, 30, 30]} />
            <meshStandardMaterial
                color="#00ff41"
                wireframe
                transparent
                opacity={0.04}
            />
        </mesh>
    );
}

/* ── Connection lines between objects ── */
function ConnectionLines() {
    const ref = useRef();

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y += 0.001;
    });

    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            pts.push(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(
                    Math.cos(angle) * 4,
                    (Math.random() - 0.5) * 3,
                    Math.sin(angle) * 4
                )
            );
        }
        return pts;
    }, []);

    return (
        <group ref={ref}>
            {points.map((_, i) => {
                if (i % 2 !== 0) return null;
                const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[i + 1]]);
                return (
                    <line key={i} geometry={geometry}>
                        <lineBasicMaterial color="#00ff41" transparent opacity={0.05} />
                    </line>
                );
            })}
        </group>
    );
}

/* ── Glow sphere in center ── */
function GlowCore() {
    const ref = useRef();

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
    });

    return (
        <mesh ref={ref} scale={0.15}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
                color="#00ff41"
                emissive="#00ff41"
                emissiveIntensity={2}
                transparent
                opacity={0.3}
            />
        </mesh>
    );
}

/* ── Main Scene ── */
function Scene({ mouse }) {
    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={0.3} color="#00ff41" />
            <pointLight position={[-10, -10, -5]} intensity={0.15} color="#00f0ff" />

            <WireframeTorus mouse={mouse} />
            <OrbitingIco mouse={mouse} />
            <OrbitingOcta mouse={mouse} />
            <GlowCore />
            <Particles count={400} />
            <GridFloor />
            <ConnectionLines />
        </>
    );
}

/* ── Export ── */
export default function HeroScene() {
    const mouse = useRef({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    return (
        <div
            className="absolute inset-0 z-0"
            onMouseMove={handleMouseMove}
            style={{ pointerEvents: 'auto' }}
        >
            <Canvas
                camera={{ position: [0, 0, 7], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                style={{ background: 'transparent' }}
            >
                <Scene mouse={mouse} />
            </Canvas>
        </div>
    );
}
