'use client'

import { useRef, useMemo, useState, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useStore } from '@/stores/useStore'

// Seeded random number generator for deterministic results
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Easing function for smooth animations
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

// Tech stack for the concentrated core display
const techStack = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Three.js', color: '#000000' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Python', color: '#3776AB' },
  { name: 'TensorFlow', color: '#FF6F00' },
  { name: 'AWS', color: '#FF9900' },
]

const NeuralCore = memo(function NeuralCore() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const explosionStartTime = useRef<number | null>(null)
  
  const { cursorPosition, scrollProgress, bootComplete } = useStore()
  
  // Animation states
  const [explosionPhase, setExplosionPhase] = useState<'waiting' | 'exploding' | 'exploded'>('waiting')
  const [seed] = useState(() => Date.now())

  // Trigger explosion when boot completes
  useEffect(() => {
    if (bootComplete && explosionPhase === 'waiting') {
      // Small delay for dramatic effect
      const timer = setTimeout(() => {
        explosionStartTime.current = null // Will be set in useFrame
        setExplosionPhase('exploding')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [bootComplete, explosionPhase])

  // Create particle system with explosion positions
  const particleData = useMemo(() => {
    const count = 1200
    
    // Core positions (concentrated sphere)
    const corePositions = new Float32Array(count * 3)
    // Exploded positions (spread out)
    const explodedPositions = new Float32Array(count * 3)
    // Colors
    const colors = new Float32Array(count * 3)
    // Random factors for variation
    const randomFactors = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // Core position - tight sphere
      const theta = seededRandom(seed + i * 3) * Math.PI * 2
      const phi = Math.acos((seededRandom(seed + i * 3 + 1) * 2) - 1)
      const coreRadius = 0.3 + seededRandom(seed + i * 3 + 2) * 0.4
      
      corePositions[i * 3] = coreRadius * Math.sin(phi) * Math.cos(theta)
      corePositions[i * 3 + 1] = coreRadius * Math.sin(phi) * Math.sin(theta)
      corePositions[i * 3 + 2] = coreRadius * Math.cos(phi)
      
      // Exploded position - much larger spread with directional burst
      const explodeRadius = 3 + seededRandom(seed + i * 5) * 4
      const explodeTheta = seededRandom(seed + i * 5 + 1) * Math.PI * 2
      const explodePhi = Math.acos((seededRandom(seed + i * 5 + 2) * 2) - 1)
      
      explodedPositions[i * 3] = explodeRadius * Math.sin(explodePhi) * Math.cos(explodeTheta)
      explodedPositions[i * 3 + 1] = explodeRadius * Math.sin(explodePhi) * Math.sin(explodeTheta)
      explodedPositions[i * 3 + 2] = explodeRadius * Math.cos(explodePhi)
      
      // Orange to white gradient with some variation
      const t = seededRandom(seed + i * 4)
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.27 + t * 0.5
      colors[i * 3 + 2] = t * 0.2
      
      // Random timing factor for staggered animation
      randomFactors[i] = seededRandom(seed + i * 6)
    }
    
    return { corePositions, explodedPositions, colors, randomFactors, count }
  }, [seed])

  // Create energy rings geometry
  const energyRings = useMemo(() => {
    const rings = []
    for (let i = 0; i < 3; i++) {
      rings.push({
        radius: 0.8 + i * 0.3,
        rotation: [Math.PI / 4 * i, Math.PI / 6 * i, 0] as [number, number, number],
        opacity: 0.3 - i * 0.08
      })
    }
    return rings
  }, [])

  // Circuit lines for tech display
  const circuitGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions: number[] = []
    
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2
      const innerRadius = 1.2
      const outerRadius = 2.2
      
      // Radial lines
      positions.push(
        Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, 0,
        Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, 0
      )
    }
    
    // Circular connections
    const circlePoints = 64
    for (let ring = 0; ring < 3; ring++) {
      const radius = 1.2 + ring * 0.5
      for (let i = 0; i < circlePoints; i++) {
        const angle1 = (i / circlePoints) * Math.PI * 2
        const angle2 = ((i + 1) / circlePoints) * Math.PI * 2
        positions.push(
          Math.cos(angle1) * radius, Math.sin(angle1) * radius, 0,
          Math.cos(angle2) * radius, Math.sin(angle2) * radius, 0
        )
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Initialize explosion start time
    if (explosionPhase === 'exploding' && explosionStartTime.current === null) {
      explosionStartTime.current = time
    }
    
    // Calculate explosion progress (0 to 1 over 1.5 seconds)
    let explosionProgress = 0
    if (explosionPhase === 'exploding' && explosionStartTime.current !== null) {
      explosionProgress = Math.min((time - explosionStartTime.current) / 1.5, 1)
      if (explosionProgress >= 1) {
        setExplosionPhase('exploded')
      }
    } else if (explosionPhase === 'exploded') {
      explosionProgress = 1
    }
    
    // Calculate concentration based on scroll (0 = exploded, 1 = concentrated)
    // Particles start collecting after some scroll
    const concentrationProgress = explosionPhase === 'exploded' 
      ? easeInOutCubic(Math.min(scrollProgress * 2, 1))
      : 0
    
    // Update particle positions
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const { corePositions, explodedPositions, randomFactors, count } = particleData
      
      for (let i = 0; i < count; i++) {
        // Staggered explosion timing
        const staggeredExplosion = easeOutExpo(
          Math.max(0, Math.min(1, (explosionProgress - randomFactors[i] * 0.3) / 0.7))
        )
        
        // Staggered concentration
        const staggeredConcentration = easeInOutCubic(
          Math.max(0, Math.min(1, (concentrationProgress - randomFactors[i] * 0.2) / 0.8))
        )
        
        // Blend between core, exploded, and back to core
        const explodedFactor = staggeredExplosion * (1 - staggeredConcentration)
        const coreFactor = 1 - explodedFactor
        
        // Add some orbit motion when concentrated
        const orbitAngle = time * 0.3 + randomFactors[i] * Math.PI * 2
        const orbitRadius = staggeredConcentration * 0.1
        
        positions[i * 3] = 
          corePositions[i * 3] * coreFactor + 
          explodedPositions[i * 3] * explodedFactor +
          Math.cos(orbitAngle) * orbitRadius
        positions[i * 3 + 1] = 
          corePositions[i * 3 + 1] * coreFactor + 
          explodedPositions[i * 3 + 1] * explodedFactor +
          Math.sin(orbitAngle) * orbitRadius
        positions[i * 3 + 2] = 
          corePositions[i * 3 + 2] * coreFactor + 
          explodedPositions[i * 3 + 2] * explodedFactor
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    // Group animations
    if (groupRef.current) {
      // Subtle floating
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1
      
      // Mouse parallax
      const targetRotX = (cursorPosition.y - 0.5) * 0.15
      const targetRotY = (cursorPosition.x - 0.5) * 0.15
      
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.03
    }
    
    // Ring animations - more active during explosion
    if (ringsRef.current) {
      const ringSpeed = explosionPhase === 'exploding' ? 2 : 0.2
      ringsRef.current.rotation.z = time * ringSpeed
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = time * (0.1 + i * 0.05) * (i % 2 ? 1 : -1) * (explosionPhase === 'exploding' ? 3 : 1)
      })
    }
    
    // Core pulse - stronger during explosion
    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial
      const basePulse = explosionPhase === 'exploding' ? 1.5 : 0.4
      const pulseSpeed = explosionPhase === 'exploding' ? 8 : 2
      material.emissiveIntensity = basePulse + Math.sin(time * pulseSpeed) * 0.3
      
      // Scale core based on concentration
      const coreScale = 0.5 + concentrationProgress * 0.3
      coreRef.current.scale.setScalar(coreScale)
    }
  })

  // Calculate visibility of tech labels based on scroll
  const techLabelOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.3) * 3))
  const showTechLabels = scrollProgress > 0.25

  return (
    <group ref={groupRef}>
      {/* Main Core - glowing center */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#FF4500"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh scale={1.05}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial
          color="#FF4500"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Energy rings */}
      <group ref={ringsRef}>
        {energyRings.map((ring, i) => (
          <mesh key={i} rotation={ring.rotation}>
            <torusGeometry args={[ring.radius, 0.008, 8, 64]} />
            <meshBasicMaterial
              color="#FF4500"
              transparent
              opacity={ring.opacity}
            />
          </mesh>
        ))}
      </group>
      
      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.corePositions.slice(), 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Circuit lines - visible when concentrated */}
      {showTechLabels && (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <lineSegments geometry={circuitGeometry}>
            <lineBasicMaterial
              color="#FF4500"
              transparent
              opacity={techLabelOpacity * 0.15}
            />
          </lineSegments>
        </group>
      )}
      
      {/* Tech stack labels - orbiting around concentrated core */}
      {showTechLabels && techStack.map((tech, index) => {
        const angle = (index / techStack.length) * Math.PI * 2
        const radius = 1.8
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <group key={tech.name} position={[x, y, 0]}>
            <Text
              fontSize={0.15}
              color="#E0E0E0"
              anchorX="center"
              anchorY="middle"
              fillOpacity={techLabelOpacity}
            >
              {tech.name}
            </Text>
            {/* Connection line to core */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, -x * 0.6, -y * 0.6, 0]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#FF4500"
                transparent
                opacity={techLabelOpacity * 0.3}
              />
            </line>
          </group>
        )
      })}
      
      {/* Outer glow ring - pulses during explosion */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.55, 64]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={explosionPhase === 'exploding' ? 0.3 : 0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
})

export default NeuralCore
