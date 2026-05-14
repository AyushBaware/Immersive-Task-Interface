import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, Billboard } from "@react-three/drei";
import gsap from "gsap";

export default function TaskParticle({ todo }) {
  const groupRef = useRef();

  const isUrgent = todo.todo.length > 15;
  const orbitRadius = isUrgent ? todo.radius * 0.75 : todo.radius;
  const orbitSpeed = isUrgent ? todo.speed * 2.2 : todo.speed;

  useEffect(() => {
    if (groupRef.current) {
      const delay = Math.random() * 0.15 + 0.05;
      groupRef.current.scale.set(0, 0, 0);
      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        delay: delay,
        ease: 'back.out(1.2)',
      });
    }
  }, []);

  useEffect(() => {
    if (todo.completed && groupRef.current) {
      const tl = gsap.timeline();
      tl.to(groupRef.current.position, {
        x: 1.8, y: 0, z: 0,
        duration: 0.8,
        ease: "back.in(1.7)"
      })
        .to(groupRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.2 });
    }
  }, [todo.completed]);

  useFrame((state) => {
    if (todo.completed || !groupRef.current) return;

    const t = state.clock.getElapsedTime() * orbitSpeed * 40;
    const x = 1.8 + Math.cos(todo.angle + t) * orbitRadius;
    const z = Math.sin(todo.angle + t) * orbitRadius;
    const y = todo.zOffset + Math.sin(t * 0.4) * 0.3;

    groupRef.current.position.set(x, y, z);
    groupRef.current.lookAt(1.8, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <Float speed={isUrgent ? 6 : 2} rotationIntensity={2}>
        <mesh>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={todo.completed ? "#22c55e" : (isUrgent ? "#ff3e3e" : "#00e5ff")}
            emissive={todo.completed ? "#22c55e" : (isUrgent ? "#ff3e3e" : "#00e5ff")}
            emissiveIntensity={10}
            metalness={1}
            roughness={0}
          />
        </mesh>

        {/* ⚡ BOOSTED LIGHT: This is what creates the shine on the sphere surface */}
        <pointLight
          color={isUrgent ? "#ff3e3e" : "#00e5ff"}
          intensity={25}
          distance={5}
          decay={1}
        />

        <Billboard position={[0, 0.45, 0]}>
          <Text
            fontSize={0.2}
            color="white"
            anchorX="center"
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            {todo.todo.length > 12 ? todo.todo.substring(0, 12) + "..." : todo.todo}
          </Text>
        </Billboard>
      </Float>
    </group>
  );
}