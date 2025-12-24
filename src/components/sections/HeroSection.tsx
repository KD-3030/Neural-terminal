'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import GlitchText from '../ui/GlitchText'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-6"
    >
      {/* Dark overlay for content visibility */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#050505]/60 to-[#050505]/90 pointer-events-none" />
      
      {/* Decorative corners */}
      <div className="absolute top-16 sm:top-20 left-4 sm:left-6 w-8 sm:w-16 h-8 sm:h-16 border-l-2 border-t-2 border-[#FF4500]/30" />
      <div className="absolute top-16 sm:top-20 right-4 sm:right-6 w-8 sm:w-16 h-8 sm:h-16 border-r-2 border-t-2 border-[#FF4500]/30" />
      <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-6 w-8 sm:w-16 h-8 sm:h-16 border-l-2 border-b-2 border-[#FF4500]/30" />
      <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-6 w-8 sm:w-16 h-8 sm:h-16 border-r-2 border-b-2 border-[#FF4500]/30" />

      {/* Main content */}
      <div className="text-center z-10 max-w-4xl relative px-4">
        {/* Status line */}
        <div className="text-[#FF4500] text-[10px] sm:text-xs font-mono mb-4 sm:mb-8 tracking-[0.2em] sm:tracking-[0.3em]">
          [ SYSTEM_STATUS: ONLINE ]
        </div>

        {/* Main title */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tight drop-shadow-[0_0_30px_rgba(255,69,0,0.3)]">
          <GlitchText className="block">KINJAL DUTTA</GlitchText>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-[#999999] font-mono mb-4 sm:mb-8 max-w-xl mx-auto leading-relaxed">
          <span className="text-[#FF4500]">FULL_STACK</span> DEVELOPER<span className="hidden sm:inline">{" // "}</span><br className="sm:hidden" />
          <span className="text-[#FF4500]"> AI</span> ENGINEER<span className="hidden sm:inline">{" // "}</span><br className="sm:hidden" />
          <span className="text-[#FF4500]"> BACKEND</span> SPECIALIST
        </p>

        {/* Tagline */}
        <div className="text-[#666666] font-mono text-xs sm:text-sm tracking-wider sm:tracking-widest">
          REVOLUTIONIZING THE DIGITAL FRONTIER
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-4 z-10"
      >
        <span className="text-[#888888] text-[10px] sm:text-xs font-mono tracking-wider sm:tracking-widest animate-pulse">
          SCROLL<span className="hidden sm:inline"> TO INITIALIZE</span>
        </span>
        <div className="w-[1px] h-6 sm:h-8 bg-gradient-to-b from-[#FF4500] to-transparent" />
      </div>

      {/* Side decorations - hidden on mobile */}
      <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 hidden lg:block z-10">
        <div className="text-[#555555] text-xs font-mono writing-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
          NEURAL_INTERFACE_v1.0
        </div>
      </div>
      
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 hidden lg:block z-10">
        <div className="text-[#555555] text-xs font-mono" style={{ writingMode: 'vertical-rl' }}>
          {new Date().toISOString()}
        </div>
      </div>
    </section>
  )
}
