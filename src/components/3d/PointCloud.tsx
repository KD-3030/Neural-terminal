'use client'

import { useRef, useMemo, useState, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PointCloudProps {
  active: boolean
}

// Seeded random for deterministic values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const PointCloud = memo(function PointCloud({ active }: PointCloudProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [seed] = useState(() => Date.now())

  const { positions, colors } = useMemo(() => {
    const count = 2000 // Reduced from 5000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = seededRandom(seed + i * 3) * Math.PI * 2
      const phi = seededRandom(seed + i * 3 + 1) * Math.PI
      const radius = 2 + seededRandom(seed + i * 3 + 2) * 0.5

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi) * 0.8 + 0.5
      const z = radius * Math.sin(phi) * Math.sin(theta) * 0.8

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const t = seededRandom(seed + i * 4)
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.27 + t * 0.3
      colors[i * 3 + 2] = 0
    }

    return { positions, colors }
  }, [seed])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uActive: { value: 0 },
        uPointSize: { value: 2.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uActive;
        uniform float uPointSize;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Wave effect when active
          float wave = sin(pos.y * 3.0 + uTime * 2.0) * 0.1 * uActive;
          pos.x += wave;
          pos.z += wave;
          
          // Scatter effect
          float scatter = (1.0 - uActive) * 2.0;
          pos += normalize(position) * scatter;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = uPointSize * (300.0 / -mvPosition.z) * (0.5 + uActive * 0.5);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Circular point
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          // Glow effect
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      
      // Smooth transition
      const target = active ? 1 : 0
      materialRef.current.uniforms.uActive.value +=
        (target - materialRef.current.uniforms.uActive.value) * 0.05
    }

    if (pointsRef.current && active) {
      pointsRef.current.rotation.y += 0.002
    }
  })

  return (
    <points ref={pointsRef} position={[0, -1, -3]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} ref={materialRef} />
    </points>
  )
})

export default PointCloud
