'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'

interface GlitchTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  glitchOnHover?: boolean
}

const glitchChars = '!<>-_\\/[]{}—=+*^?#________'

export default function GlitchText({
  children,
  className = '',
  as: Component = 'span',
  glitchOnHover = true,
}: GlitchTextProps) {
  const textRef = useRef<HTMLElement>(null)
  const [displayText, setDisplayText] = useState(children)
  const [isGlitching, setIsGlitching] = useState(false)

  const triggerGlitch = () => {
    if (isGlitching) return
    setIsGlitching(true)

    const originalText = children
    const iterations = 3
    let currentIteration = 0
    let charIndex = 0

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < charIndex) return originalText[index]
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join('')
      )

      charIndex += 1 / iterations

      if (charIndex >= originalText.length) {
        clearInterval(interval)
        setDisplayText(originalText)
        setIsGlitching(false)
      }
    }, 30)
  }

  // Random automatic glitch
  const randomGlitch = () => {
    if (Math.random() > 0.98 && !isGlitching) {
      triggerGlitch()
    }
  }

  return (
    <Component
      ref={textRef as any}
      className={`${className} ${glitchOnHover ? 'cursor-pointer' : ''}`}
      onMouseEnter={glitchOnHover ? triggerGlitch : undefined}
      onFocus={randomGlitch}
      data-text={children}
    >
      {displayText}
    </Component>
  )
}

// Glitch effect with CSS layers
export function GlitchTextCSS({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 -z-10 text-[#FF4500] opacity-80"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          transform: 'translate(-2px, -1px)',
          animation: 'glitch-anim-1 2s infinite linear alternate-reverse',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 text-cyan-500 opacity-80"
        style={{
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          transform: 'translate(2px, 1px)',
          animation: 'glitch-anim-2 3s infinite linear alternate-reverse',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}
