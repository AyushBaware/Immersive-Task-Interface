import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { Stars, PerspectiveCamera, OrbitControls, Grid, Cloud } from "@react-three/drei";
import { useTodo } from "../../Contexts/TodoContext";
import Planet from "./Planet";
import TaskParticle from "./TaskParticle";
import gsap from "gsap";

function Nebula() {
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        delay: 0.05,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, -15]} scale={0}>
      <Cloud opacity={0.05} speed={0.4} width={50} depth={5} segments={20} color="#075985" />
      <Cloud opacity={0.03} speed={0.2} width={30} depth={2} segments={15} color="#00e5ff" position={[10, 5, -5]} />
    </group>
  );
}

function SnowField() {
  const pointsRef = useRef();
  const groupRef = useRef();
  const count = 160;
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 28;
      array[i * 3 + 1] = Math.random() * 24 + 4;
      array[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return array;
  }, [count]);

  const velocities = useMemo(() => {
    const array = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      array[i] = 0.08 + Math.random() * 0.16;
    }
    return array;
  }, [count]);

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        delay: 0.1,
        ease: 'power2.out',
      });
    }
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const positionsArray = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      positionsArray[idx + 1] -= velocities[i] * delta * 4.5;
      if (positionsArray[idx + 1] < -3) positionsArray[idx + 1] = 24 + Math.random() * 3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef} scale={0}>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} sizeAttenuation color="#d4efff" transparent opacity={0.3} depthWrite={false} />
      </points>
    </group>
  );
}

function SceneContent({ onReady }) {
  const { todos } = useTodo();
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (!hasNotifiedRef.current && onReady) {
      let frameCount = 0;
      const animate = () => {
        frameCount++;
        if (frameCount >= 3) {
          hasNotifiedRef.current = true;
          setTimeout(() => {
            onReady();
          }, 300);
        } else {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [onReady]);

  return (
    <div className="fixed inset-0 -z-10 bg-[#010208]">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          stencil: false,
          depth: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={37} />

        <OrbitControls
          enablePan={false}
          rotateSpeed={0.5}
          maxDistance={18}
          minDistance={7}
          dampingFactor={0.05}
          target={[1.8, 0, 0]}
        />

        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />

        <Nebula />
        <Planet />

        {todos.map((todo) => (
          <TaskParticle key={todo.id} todo={todo} />
        ))}

        <Grid infiniteGrid fadeDistance={22} cellColor="#00e5ff" sectionColor="#00e5ff" opacity={0.04} position={[0, -4.6, 0]} />
        <Stars radius={130} depth={40} count={300} factor={3} fade speed={0.05} />
        <SnowField />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} intensity={1.8} radius={0.4} mipmapBlur />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
          <Vignette darkness={0.9} offset={0.1} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default function Scene({ onReady }) {
  return <SceneContent onReady={onReady} />;
}