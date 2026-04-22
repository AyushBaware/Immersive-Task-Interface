import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useTodo } from '../../Contexts/TodoContext' // Fixed path: go up two levels
import * as THREE from 'three'

export default function Shield() {
  const meshRef = useRef()
  const { ripple } = useTodo()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // Constant slow hovering motion
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.15
    meshRef.current.rotation.y = t * 0.2

    // Define "Active" vs "Idle" values
    // When ripple is true (triggered from TodoForm), values jump up
    const targetDistort = ripple ? 0.8 : 0.3
    const targetIntensity = ripple ? 40 : 8
    const targetSpeed = ripple ? 12 : 2

    // Smoothly transition (lerp) between states
    meshRef.current.material.distort = THREE.MathUtils.lerp(
      meshRef.current.material.distort, 
      targetDistort, 
      0.1
    )
    meshRef.current.material.speed = THREE.MathUtils.lerp(
      meshRef.current.material.speed, 
      targetSpeed, 
      0.1
    )
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity, 
      targetIntensity, 
      0.1
    )
  })

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]}>
      <MeshDistortMaterial
        color="#0ea5e9"
        emissive="#00e5ff"
        emissiveIntensity={8}
        distort={0.3}
        speed={2}
        roughness={0}
        transmission={1}
        thickness={1}
      />
    </Sphere>
  )
}