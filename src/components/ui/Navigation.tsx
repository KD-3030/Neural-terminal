'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/stores/useStore'

export default function Navigation() {
  const { scrollProgress, audioEnabled, toggleAudio } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'CORE', progress: 0 },
    { label: 'ABOUT', progress: 0.15 },
    { label: 'PROJECTS', progress: 0.35 },
    { label: 'ARSENAL', progress: 0.7 },
    { label: 'LINK', progress: 0.9 },
  ]

  const scrollToSection = (progress: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: scrollHeight * progress,
      behavior: 'smooth'
    })
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-[#050505]/95 backdrop-blur-md border-b border-[#1a1a1a]/50">
        {/* Logo */}
        <Link href="/" className="group">
          <span className="text-[#E0E0E0] font-mono text-xs sm:text-sm tracking-widest hover:text-white transition-colors">
            <span className="text-[#FF4500]">&gt;</span> <span className="hidden xs:inline">NEURAL_</span>TERMINAL
          </span>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.progress)}
              className={`
                text-xs font-mono tracking-wider transition-all duration-300
                ${Math.abs(scrollProgress - item.progress) < 0.1 
                  ? 'text-[#FF4500]' 
                  : 'text-[#888] hover:text-[#E0E0E0]'}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded border transition-all duration-300
              ${audioEnabled 
                ? 'border-[#FF4500]/50 text-[#FF4500] bg-[#FF4500]/10' 
                : 'border-[#333] text-[#666] hover:text-[#888] hover:border-[#444]'}
            `}
            aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
            title="Toggle background music"
          >
            {/* Speaker Icon */}
            <svg 
              className="w-3 h-3 sm:w-4 sm:h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {audioEnabled ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
                />
              )}
            </svg>
            <span className="text-[10px] sm:text-xs font-mono hidden sm:inline">
              {audioEnabled ? 'ON' : 'OFF'}
            </span>
            {/* Animated bars when playing */}
            {audioEnabled && (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-[#FF4500] animate-pulse" style={{ height: '40%', animationDelay: '0ms' }} />
                <span className="w-0.5 bg-[#FF4500] animate-pulse" style={{ height: '80%', animationDelay: '150ms' }} />
                <span className="w-0.5 bg-[#FF4500] animate-pulse" style={{ height: '60%', animationDelay: '300ms' }} />
              </div>
            )}
          </button>

          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-12 lg:w-20 h-[2px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#FF4500] transition-all duration-300"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <span className="text-white/30 text-xs font-mono w-8">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-0.5 bg-[#E0E0E0] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5 bg-[#FF4500]' : ''}`} />
            <span className={`w-5 h-0.5 bg-[#E0E0E0] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-[#E0E0E0] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5 bg-[#FF4500]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`
        fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-sm md:hidden
        transition-all duration-300
        ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.progress)}
              className={`
                text-2xl font-mono tracking-widest transition-all duration-300
                ${Math.abs(scrollProgress - item.progress) < 0.1 
                  ? 'text-[#FF4500]' 
                  : 'text-white/70'}
              `}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="text-[#FF4500]/50 text-sm mr-2">0{index + 1}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
