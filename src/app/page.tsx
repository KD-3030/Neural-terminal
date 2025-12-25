'use client'

import dynamic from 'next/dynamic'
import BootSequence from '@/components/ui/BootSequence'
import Navigation from '@/components/ui/Navigation'
import CustomCursor from '@/components/ui/CustomCursor'
import SystemMessages from '@/components/ui/SystemMessages'
import FloatingTerminal from '@/components/ui/FloatingTerminal'
import BackgroundAudio from '@/components/ui/BackgroundAudio'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ContactSection from '@/components/sections/ContactSection'
import { useStore } from '@/stores/useStore'

// Dynamic import for 3D scene to avoid SSR issues
const Scene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  const { bootComplete } = useStore()

  return (
    <>
      {/* Boot Sequence Loader */}
      <BootSequence />

      {/* Background Audio */}
      <BackgroundAudio />

      {/* Custom Cursor (desktop only) */}
      <CustomCursor enabled={true} />

      {/* 3D Background Scene */}
      <Scene />

      {/* System Messages Overlay */}
      <SystemMessages />

      {/* Floating Terminal */}
      <FloatingTerminal />

      {/* Main Content */}
      <SmoothScrollProvider>
        {bootComplete && (
          <>
            <Navigation />

            <main className="relative">
              {/* Phase 0: Hero */}
              <HeroSection />

              {/* Phase 1: About */}
              <AboutSection />

              {/* Phase 2: Projects */}
              <ProjectsSection />

              {/* Phase 3: Skills */}
              <SkillsSection />

              {/* Phase 4: Contact */}
              <ContactSection />
            </main>
          </>
        )}
      </SmoothScrollProvider>
    </>
  )
}
