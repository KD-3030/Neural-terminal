'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState, memo } from 'react'
import { 
  EffectComposer, 
  Bloom,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { PerspectiveCamera, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'
import NeuralCore from './NeuralCore'
import { useStore } from '@/stores/useStore'

// Throttle function for performance
function throttle<T extends (...args: never[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}

const SceneContent = memo(function SceneContent() {
  const { scrollProgress, setCursorPosition } = useStore()

  // Camera position based on scroll - pull back as we scroll
  const cameraZ = 6 - scrollProgress * 1
  const cameraY = scrollProgress * 0.3

  // Throttled mouse handler for better performance
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }, 32) // ~30fps for mouse tracking
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [setCursorPosition])

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, cameraY, cameraZ]}
        fov={75}
      />
      
      {/* Simplified lighting for performance */}
      <ambientLight intensity={0.15} />
      <pointLight
        position={[5, 5, 5]}
        intensity={0.4}
        color="#FF4500"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[-5, -5, -5]}
        intensity={0.2}
        color="#FF6B35"
        distance={15}
        decay={2}
      />
      
      {/* Main Neural Core - always visible, handles its own animation states */}
      <group position={[0, 0, -2]}>
        <NeuralCore />
      </group>
      
      {/* Background grid */}
      <gridHelper
        args={[50, 50, '#333333', '#222222']}
        position={[0, -3, 0]}
        rotation={[0, 0, 0]}
      />
      
      {/* Minimal post-processing for performance */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
          mipmapBlur
        />
        <Vignette
          offset={0.3}
          darkness={0.6}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  )
})

export default function Scene() {
  const [mounted, setMounted] = useState(false)
  const { bootComplete } = useStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !bootComplete) return null

  return (
    <div className="fixed inset-0 -z-10 gpu-layer">
      <Canvas
        gl={{
          antialias: false, // Disable for performance
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: false,
        }}
        dpr={[1, 1.5]} // Limit max DPR for performance
        performance={{ min: 0.5 }} // Allow frame drops
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 8, 25]} />
        
        {/* Adaptive performance */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
