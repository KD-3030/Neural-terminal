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
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 md:py-6 flex justify-between items-center mix-blend-difference">
        {/* Logo */}
        <Link href="/" className="group">
          <span className="text-white font-mono text-xs sm:text-sm tracking-widest">
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
                  : 'text-white/50 hover:text-white'}
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
            className="text-white/50 hover:text-white text-[10px] sm:text-xs font-mono transition-colors"
            aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
          >
            [{audioEnabled ? 'ON' : 'OFF'}]
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
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
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
