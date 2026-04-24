import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTodo } from '../../Contexts/TodoContext';

export default function Planet() {
  const coreRef = useRef();
  const hexShellRef = useRef();
  const { ripple, triggerRipple } = useTodo();

  const handlePulse = (e) => {
    e.stopPropagation();
    triggerRipple();

    const tl = gsap.timeline();
    tl.to(hexShellRef.current.material, { emissiveIntensity: 15, duration: 0.15, ease: 'power4.out' })
      .to(hexShellRef.current.material, { emissiveIntensity: 1, duration: 1.2, ease: 'expo.out' });
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.08;
      coreRef.current.rotation.x = t * 0.03;
    }
    if (hexShellRef.current) {
      hexShellRef.current.rotation.y = t * 0.06;
    }
  });

  return (
    <group position={[1.8, 0, 0]} onClick={handlePulse}>
      <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.18}>
        
        {/* THE CORE: Adjusted to catch and reflect task light */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            color="#010206"
            roughness={0.4} // Increase roughness to 0.4 to catch the "star" glow path
            metalness={0.8}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* HEX SHELL */}
        <mesh ref={hexShellRef} scale={1.01}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial 
            color="#00e5ff" 
            wireframe 
            emissive="#00e5ff" 
            emissiveIntensity={ripple ? 5 : 0.5} 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      </Float>

      {/* Subtle lighting to maintain the planet's dark silhouette */}
      <ambientLight intensity={0.05} />
    </group>
  );
}