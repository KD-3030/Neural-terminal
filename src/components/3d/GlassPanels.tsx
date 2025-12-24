'use client'

import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GlassPanelsProps {
  active: boolean
}

const GlassPanels = memo(function GlassPanels({ active }: GlassPanelsProps) {
  const groupRef = useRef<THREE.Group>(null)
  // Reduced panels for performance
  const panels = useMemo(() => [
    { position: [-2, 0.5, -4], rotation: [0, 0.3, 0], size: [1.5, 2, 0.02] },
    { position: [0, 0, -5], rotation: [0, 0, 0], size: [2, 2.5, 0.02] },
    { position: [2, -0.3, -4], rotation: [0, -0.3, 0], size: [1.5, 2, 0.02] },
  ], [])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Simplified animation
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.05
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      {panels.map((panel, i) => (
        <group key={i}>
          {/* Simplified glass panel - removed expensive meshPhysicalMaterial */}
          <mesh
            position={panel.position as [number, number, number]}
            rotation={panel.rotation as [number, number, number]}
          >
            <boxGeometry args={panel.size as [number, number, number]} />
            <meshBasicMaterial
              color="#1a1a1a"
              transparent
              opacity={0.4}
            />
          </mesh>
          
          {/* Border wireframe */}
          <mesh
            position={panel.position as [number, number, number]}
            rotation={panel.rotation as [number, number, number]}
          >
            <boxGeometry args={[
              panel.size[0] + 0.02,
              panel.size[1] + 0.02,
              panel.size[2]
            ] as [number, number, number]} />
            <meshBasicMaterial
              color="#FF4500"
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>
        </group>
      ))}
    </group>
  )
})

export default GlassPanels
