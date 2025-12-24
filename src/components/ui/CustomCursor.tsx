'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface CustomCursorProps {
  enabled?: boolean
}

export default function CustomCursor({ enabled = true }: CustomCursorProps) {
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<HTMLDivElement[]>([])
  const requestRef = useRef<number | null>(null)
  const mousePos = useRef({ x: -100, y: -100 })
  const cursorPos = useRef({ x: -100, y: -100 })
  const velocity = useRef({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hoverType, setHoverType] = useState<'link' | 'button' | 'input' | null>(null)

  // Detect if device supports hover (desktop)
  const [isTouchDevice, setIsTouchDevice] = useState(true)

  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    )
  }, [])

  const getHoverType = useCallback((target: HTMLElement): 'link' | 'button' | 'input' | null => {
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('input') || target.closest('textarea')) {
      return 'input'
    }
    if (target.tagName === 'BUTTON' || target.closest('button') || target.classList.contains('hoverable-button')) {
      return 'button'
    }
    if (target.tagName === 'A' || target.closest('a') || target.classList.contains('hoverable')) {
      return 'link'
    }
    return null
  }, [])

  useEffect(() => {
    if (!enabled || isTouchDevice) return

    const cursorOuter = cursorOuterRef.current
    const cursorInner = cursorInnerRef.current
    if (!cursorOuter || !cursorInner) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const type = getHoverType(target)
      setHoverType(type)
      setIsHovering(type !== null)
    }

    // Smooth animation loop with velocity-based movement
    const animate = () => {
      const dx = mousePos.current.x - cursorPos.current.x
      const dy = mousePos.current.y - cursorPos.current.y
      
      // Add smoothing with velocity
      velocity.current.x += (dx - velocity.current.x) * 0.2
      velocity.current.y += (dy - velocity.current.y) * 0.2
      
      cursorPos.current.x += velocity.current.x * 0.35
      cursorPos.current.y += velocity.current.y * 0.35

      // Apply transforms using GPU-accelerated properties
      const outerScale = isClicking ? 0.8 : isHovering ? 1.5 : 1
      const innerScale = isClicking ? 1.5 : isHovering ? 0.5 : 1
      
      cursorOuter.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%) scale(${outerScale})`
      cursorInner.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%) scale(${innerScale})`

      // Update trails
      trailsRef.current.forEach((trail, i) => {
        if (trail) {
          const delay = (i + 1) * 0.08
          const trailX = cursorPos.current.x + (mousePos.current.x - cursorPos.current.x) * (1 - delay)
          const trailY = cursorPos.current.y + (mousePos.current.y - cursorPos.current.y) * (1 - delay)
          const trailScale = 1 - (i + 1) * 0.15
          trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%) scale(${Math.max(0.3, trailScale)})`
          trail.style.opacity = `${Math.max(0.1, 0.4 - i * 0.1)}`
        }
      })

      requestRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [enabled, isTouchDevice, isHovering, isClicking, isVisible, getHoverType])

  if (!enabled || isTouchDevice) return null

  return (
    <>
      {/* Trailing particles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailsRef.current[i] = el
          }}
          className="fixed top-0 left-0 pointer-events-none z-[9997] will-change-transform"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `rgba(255, 69, 0, ${0.3 - i * 0.08})`,
            boxShadow: `0 0 ${8 - i * 2}px rgba(255, 69, 0, ${0.3 - i * 0.08})`,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}

      {/* Outer cursor ring */}
      <div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform"
        style={{
          width: '40px',
          height: '40px',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease, width 0.2s ease, height 0.2s ease',
        }}
      >
        {/* Rotating ring */}
        <div 
          className={`absolute inset-0 rounded-full border-2 transition-all duration-200 ${
            isHovering 
              ? hoverType === 'button' 
                ? 'border-[#00ff88]' 
                : hoverType === 'input'
                  ? 'border-[#00aaff]'
                  : 'border-[#FF4500]'
              : 'border-white/40'
          }`}
          style={{
            animation: isHovering ? 'none' : 'cursorSpin 8s linear infinite',
            borderStyle: isHovering ? 'solid' : 'dashed',
          }}
        />
        
        {/* Corner accents */}
        {!isHovering && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#FF4500]/60" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#FF4500]/60" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#FF4500]/60" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#FF4500]/60" />
          </>
        )}

        {/* Hover indicator text */}
        {isHovering && hoverType && (
          <div 
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono uppercase tracking-wider whitespace-nowrap"
            style={{
              color: hoverType === 'button' ? '#00ff88' : hoverType === 'input' ? '#00aaff' : '#FF4500',
              textShadow: `0 0 10px ${hoverType === 'button' ? '#00ff88' : hoverType === 'input' ? '#00aaff' : '#FF4500'}`,
            }}
          >
            {hoverType === 'button' ? '[ CLICK ]' : hoverType === 'input' ? '[ TYPE ]' : '[ LINK ]'}
          </div>
        )}
      </div>

      {/* Inner cursor dot */}
      <div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          width: '8px',
          height: '8px',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div 
          className={`w-full h-full rounded-full transition-all duration-150 ${
            isHovering
              ? hoverType === 'button'
                ? 'bg-[#00ff88]'
                : hoverType === 'input'
                  ? 'bg-[#00aaff]'
                  : 'bg-[#FF4500]'
              : 'bg-white'
          }`}
          style={{
            boxShadow: isHovering 
              ? `0 0 20px ${hoverType === 'button' ? '#00ff88' : hoverType === 'input' ? '#00aaff' : '#FF4500'}, 0 0 40px ${hoverType === 'button' ? '#00ff8880' : hoverType === 'input' ? '#00aaff80' : '#FF450080'}`
              : '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes cursorSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Hide cursor on interactive elements */
        a, button, input, textarea, [role="button"], .hoverable, .hoverable-button {
          cursor: none !important;
        }
      `}</style>
    </>
  )
}
