'use client'

import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useStore } from '@/stores/useStore'

// Reduced skills for performance
const skills = [
  'React', 'Next.js', 'TypeScript', 'Python', 'Node.js',
  'Three.js', 'TensorFlow', 'Docker', 'AWS',
  'PostgreSQL', 'MongoDB', 'GraphQL', 'Go',
  'Kubernetes', 'WebGL', 'IoT'
]

const SkillsSphere = memo(function SkillsSphere() {
  const groupRef = useRef<THREE.Group>(null)
  const { isHoveringSkill, setHoveringSkill, scrollProgress } = useStore()
  const velocity = useRef({ x: 0.001, y: 0.002 })

  const positions = useMemo(() => {
    return skills.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / skills.length)
      const theta = Math.sqrt(skills.length * Math.PI) * phi
      const radius = 2.5 // Smaller radius

      return new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      )
    })
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    
    // Simple rotation animation
    if (!isHoveringSkill) {
      groupRef.current.rotation.x += velocity.current.x
      groupRef.current.rotation.y += velocity.current.y
    }
  })

  // Calculate visibility
  const scale = scrollProgress > 0.65 && scrollProgress < 0.85 ? 1 : 0.5

  return (
    <group 
      ref={groupRef}
      position={[0, 0, -2]}
      scale={scale}
    >
      {/* Simplified sphere wireframe */}
      <mesh>
        <sphereGeometry args={[2.8, 16, 16]} />
        <meshBasicMaterial
          color="#333333"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
      
      {/* Skill texts */}
      {skills.map((skill, index) => (
        <Text
          key={skill}
          position={positions[index]}
          fontSize={0.22}
          color={isHoveringSkill === skill ? '#FF4500' : '#E0E0E0'}
          anchorX="center"
          anchorY="middle"
          onPointerEnter={() => setHoveringSkill(skill)}
          onPointerLeave={() => setHoveringSkill(null)}
        >
          {skill}
        </Text>
      ))}
    </group>
  )
})

export default SkillsSphere
