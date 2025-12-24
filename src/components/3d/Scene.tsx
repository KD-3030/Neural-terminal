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
import SkillsSphere from './SkillsSphere'
import PointCloud from './PointCloud'
import WireframeMesh from './WireframeMesh'
import GlassPanels from './GlassPanels'
import { useStore } from '@/stores/useStore'

// Throttle function for performance
function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
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
  
  // Determine which mode to show based on scroll - only render visible components
  const showNeuralCore = scrollProgress < 0.25
  const showPointCloud = scrollProgress > 0.25 && scrollProgress < 0.4
  const showWireframe = scrollProgress > 0.4 && scrollProgress < 0.55
  const showGlassPanels = scrollProgress > 0.55 && scrollProgress < 0.7
  const showSkillsSphere = scrollProgress > 0.7 && scrollProgress < 0.9

  // Camera position based on scroll
  const cameraZ = 8 - scrollProgress * 2
  const cameraY = scrollProgress * 0.5

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
      <ambientLight intensity={0.12} />
      <pointLight
        position={[5, 5, 5]}
        intensity={0.25}
        color="#FF4500"
        distance={20}
        decay={2}
      />
      
      {/* Main Neural Core - only render when visible */}
      {showNeuralCore && (
        <group position={[0, 0, -3]} scale={0.6}>
          <NeuralCore />
        </group>
      )}
      
      {/* Conditionally render 3D components based on scroll */}
      {showPointCloud && <PointCloud active={true} />}
      {showWireframe && <WireframeMesh active={true} />}
      {showGlassPanels && <GlassPanels active={true} />}
      {showSkillsSphere && <SkillsSphere />}
      
      {/* Background grid */}
      <gridHelper
        args={[50, 50, '#333333', '#222222']}
        position={[0, -3, 0]}
        rotation={[0, 0, 0]}
      />
      
      {/* Minimal post-processing for performance */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.2}
          luminanceThreshold={0.4}
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
