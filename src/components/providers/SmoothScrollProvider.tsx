'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/stores/useStore'

gsap.registerPlugin(ScrollTrigger)

interface SmoothScrollProviderProps {
  children: ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const { setScrollProgress, setCurrentPhase, bootComplete } = useStore()

  useEffect(() => {
    if (!bootComplete) return

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Connect GSAP ScrollTrigger to Lenis
    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update()
      
      // Calculate scroll progress
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = e.scroll / scrollHeight
      setScrollProgress(progress)

      // Determine current phase based on progress
      if (progress < 0.15) setCurrentPhase(0) // Hero
      else if (progress < 0.3) setCurrentPhase(1) // About
      else if (progress < 0.7) setCurrentPhase(2) // Projects
      else if (progress < 0.9) setCurrentPhase(3) // Skills
      else setCurrentPhase(4) // Contact
    })

    // Animation frame
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Keyboard navigation (vim-like)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'ArrowDown') {
        lenis.scrollTo(lenis.scroll + 100, { duration: 0.5 })
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        lenis.scrollTo(lenis.scroll - 100, { duration: 0.5 })
      } else if (e.key === 'g' && e.shiftKey) {
        lenis.scrollTo('bottom', { duration: 1.5 })
      } else if (e.key === 'g') {
        lenis.scrollTo('top', { duration: 1.5 })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      lenis.destroy()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [bootComplete, setScrollProgress, setCurrentPhase])

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    if (mediaQuery.matches && lenisRef.current) {
      lenisRef.current.destroy()
    }
  }, [])

  return <>{children}</>
}
