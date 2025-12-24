'use client'

import { useRef, useMemo, useState, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Seeded random for deterministic values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface WireframeMeshProps {
  active: boolean
}

const WireframeMesh = memo(function WireframeMesh({ active }: WireframeMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const [seed] = useState(() => Date.now())
  
  const { nodePositions, connections } = useMemo(() => {
    const nodeCount = 30 // Reduced from 50
    const positions: THREE.Vector3[] = []
    const connections: [number, number][] = []
    
    // Generate deterministic node positions
    for (let i = 0; i < nodeCount; i++) {
      positions.push(new THREE.Vector3(
        (seededRandom(seed + i * 3) - 0.5) * 8,
        (seededRandom(seed + i * 3 + 1) - 0.5) * 4,
        (seededRandom(seed + i * 3 + 2) - 0.5) * 4 - 5
      ))
    }
    
    // Create connections - limited
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = positions[i].distanceTo(positions[j])
        if (dist < 2 && connections.length < 50) { // Reduced from 80
          connections.push([i, j])
        }
      }
    }
    
    return { nodePositions: positions, connections }
  }, [seed])

  const connectionGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions: number[] = []
    
    connections.forEach(([i, j]) => {
      positions.push(
        nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
        nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
      )
    })
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [nodePositions, connections])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Subtle movement
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1
    
    // Animate node instances
    if (nodesRef.current) {
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()
      const scale = new THREE.Vector3()
      
      nodePositions.forEach((pos, i) => {
        const pulse = Math.sin(time * 2 + i) * 0.2 + 1
        position.copy(pos)
        position.y += Math.sin(time + i * 0.5) * 0.1
        scale.setScalar(pulse * 0.03 * (active ? 1 : 0.3))
        
        matrix.setPosition(position)
        matrix.scale(scale)
        
        nodesRef.current!.setMatrixAt(i, matrix)
      })
      
      nodesRef.current.instanceMatrix.needsUpdate = true
    }
  })

  const opacity = active ? 0.8 : 0.1

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments geometry={connectionGeometry}>
        <lineBasicMaterial
          color="#FF4500"
          transparent
          opacity={opacity * 0.4}
          linewidth={1}
        />
      </lineSegments>
      
      {/* Node instances - simplified geometry */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, nodePositions.length]}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={opacity}
        />
      </instancedMesh>
      
      {/* Removed DataPacket for performance */}
    </group>
  )
})

export default WireframeMesh
