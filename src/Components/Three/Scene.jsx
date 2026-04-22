import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { Grid, Stars, Float } from '@react-three/drei'
import Shield from './Shield.jsx'
import * as THREE from 'three'

// ⚡ This function makes the camera follow your mouse for a "3D Look"
function Rig() {
  return useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(state.mouse.x * 2, state.mouse.y * 1, 5), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]} 
      >
        <Rig />
        <color attach="background" args={['#020617']} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00e5ff" />

        {/* Floating Shield */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Shield />
        </Float>

        {/* ⚡ Perspective Grid: Moves with the camera to show depth */}
        <Grid 
          position={[0, -2.5, 0]} 
          args={[30, 30]} 
          sectionColor="#0ea5e9" 
          cellColor="#020617" 
          opacity={0.2} 
          infiniteGrid 
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0} 
            mipmapBlur 
            intensity={2.5} // Increased for that "Sun" glare
            radius={0.4} 
          />
          <Noise opacity={0.05} /> 
          <Vignette eskil={false} offset={0.1} darkness={1.3} />
        </EffectComposer>

        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      </Canvas>
    </div>
  )
}