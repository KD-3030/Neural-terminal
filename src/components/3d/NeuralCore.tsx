'use client'

import { useRef, useMemo, useState, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/stores/useStore'

// Seeded random number generator for deterministic results
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const NeuralCore = memo(function NeuralCore() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)
  
  const { cursorPosition, scrollProgress } = useStore()
  
  // Use seed from initial render for deterministic particles
  const [seed] = useState(() => Date.now())

  // Create particle system - REDUCED COUNT for performance
  const particles = useMemo(() => {
    const count = 800 // Reduced from 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const theta = seededRandom(seed + i * 3) * Math.PI * 2
      const phi = Math.acos((seededRandom(seed + i * 3 + 1) * 2) - 1)
      const radius = 2 + seededRandom(seed + i * 3 + 2) * 1.5
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Orange to white gradient
      const t = seededRandom(seed + i * 4)
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.27 + t * 0.4
      colors[i * 3 + 2] = t * 0.3
    }
    
    return { positions, colors }
  }, [seed])

  // Create circuit board pattern geometry - REDUCED
  const circuitGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions: number[] = []
    
    // Reduced circuit lines
    for (let i = 0; i < 12; i++) {
      const startX = (seededRandom(seed + 1000 + i * 10) - 0.5) * 2
      const startY = (seededRandom(seed + 1000 + i * 10 + 1) - 0.5) * 2
      const startZ = (seededRandom(seed + 1000 + i * 10 + 2) - 0.5) * 0.2
      
      let x = startX, y = startY
      const z = startZ
      
      for (let j = 0; j < 4; j++) {
        positions.push(x, y, z)
        
        const dir = Math.floor(seededRandom(seed + 1000 + i * 10 + j * 3) * 4)
        const step = seededRandom(seed + 1000 + i * 10 + j * 3 + 1) * 0.3 + 0.1
        
        if (dir === 0) x += step
        else if (dir === 1) x -= step
        else if (dir === 2) y += step
        else y -= step
        
        positions.push(x, y, z)
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [seed])

  // Reduced dust particles
  const dustPositions = useMemo(() => {
    const arr = new Float32Array(200 * 3) // Reduced from 500
    for (let i = 0; i < 200 * 3; i++) {
      arr[i] = (seededRandom(seed + 5000 + i) - 0.5) * 8
    }
    return arr
  }, [seed])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1
      
      // Mouse parallax - simplified
      const targetRotX = (cursorPosition.y - 0.5) * 0.2
      const targetRotY = (cursorPosition.x - 0.5) * 0.2
      
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.03
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z = time * 0.15
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = time * (0.08 + i * 0.03) * (i % 2 ? 1 : -1)
        ring.rotation.y = time * (0.1 + i * 0.02)
      })
    }
    
    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1
    }
  })

  // Calculate scale based on scroll
  const scale = 1 - scrollProgress * 0.5

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main Core - Icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#FF4500"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshBasicMaterial
          color="#FF4500"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Rotating rings - reduced segments */}
      <group ref={ringsRef}>
        {[0.9, 1.1].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 4 * i, Math.PI / 6 * i, 0]}>
            <torusGeometry args={[radius, 0.005, 6, 32]} />
            <meshBasicMaterial
              color="#FF4500"
              transparent
              opacity={0.2 - i * 0.05}
            />
          </mesh>
        ))}
      </group>
      
      {/* Circuit board lines */}
      <lineSegments geometry={circuitGeometry}>
        <lineBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.12}
        />
      </lineSegments>
      
      {/* Static particle field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.012}
          vertexColors
          transparent
          opacity={0.25}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Ambient dust */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.006}
          color="#FF4500"
          transparent
          opacity={0.1}
          sizeAttenuation
        />
      </points>
    </group>
  )
})

export default NeuralCore
