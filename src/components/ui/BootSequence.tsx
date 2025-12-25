'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/stores/useStore'

const bootMessages = [
  { text: '> INITIALIZING NEURAL INTERFACE...', delay: 400 },
  { text: '> MOUNTING_CORE_COMPONENTS... [OK]', delay: 200 },
  { text: '> LOADING_SHADER_MODULES... [OK]', delay: 150 },
  { text: '> ESTABLISHING_SECURE_CONNECTION...', delay: 300 },
  { text: '> BYPASSING_FIREWALL... [SUCCESS]', delay: 250 },
  { text: '> DECRYPTING_ARCHIVES...', delay: 200 },
  { text: '> IDENTITY_VERIFIED: VISITOR', delay: 150 },
  { text: '> ACCESS_LEVEL: CLASSIFIED', delay: 100 },
  { text: '> NEURAL_LINK_ESTABLISHED', delay: 200 },
  { text: '', delay: 100 },
  { text: '> HELLO USER', delay: 300 },
  { text: '> WELCOME TO NEURAL TERMINAL', delay: 500 },
]

// Neural network canvas animation
function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    // Create nodes
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; pulse: number }[] = []
    const nodeCount = 50
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      })
    }
    
    let animationId: number
    
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const time = Date.now() * 0.001
      
      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.02
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
        
        // Draw connections
        nodes.slice(i + 1).forEach(other => {
          const dx = other.x - node.x
          const dy = other.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.3
            ctx.strokeStyle = `rgba(255, 69, 0, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })
        
        // Draw node
        const pulseScale = 1 + Math.sin(node.pulse) * 0.3
        ctx.fillStyle = `rgba(255, 69, 0, ${0.5 + Math.sin(node.pulse) * 0.3})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2)
        ctx.fill()
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
}

export default function BootSequence() {
  const { loadingProgress, setLoadingProgress, setBootComplete, bootComplete } = useStore()
  const [messages, setMessages] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [glitchActive, setGlitchActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Boot sequence animation
  useEffect(() => {
    if (bootComplete) return

    let messageIndex = 0
    let charIndex = 0
    let isCancelled = false
    
    const typeMessage = () => {
      if (isCancelled) return
      
      if (messageIndex >= bootMessages.length) {
        // Boot complete
        setTimeout(() => {
          if (!isCancelled) {
            setGlitchActive(true)
            setTimeout(() => setBootComplete(true), 800)
          }
        }, 500)
        return
      }

      const currentMessage = bootMessages[messageIndex]
      
      if (charIndex < currentMessage.text.length) {
        setCurrentLine(currentMessage.text.slice(0, charIndex + 1))
        charIndex++
        setTimeout(typeMessage, 15 + Math.random() * 25)
      } else {
        // Line complete
        setMessages(prev => [...prev, currentMessage.text])
        setCurrentLine('')
        charIndex = 0
        messageIndex++
        
        // Update progress
        const progress = (messageIndex / bootMessages.length) * 100
        setLoadingProgress(progress)
        
        setTimeout(typeMessage, currentMessage.delay)
      }
    }

    setTimeout(typeMessage, 800)
    
    return () => { isCancelled = true }
  }, [bootComplete, setBootComplete, setLoadingProgress])

  // Logo animation
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, 
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
      )
    }
  }, [])

  // Screen flash and exit animation
  useEffect(() => {
    if (glitchActive && containerRef.current) {
      const tl = gsap.timeline()
      
      // Glitch effect
      tl.to(containerRef.current, {
        x: -5,
        duration: 0.05,
        repeat: 5,
        yoyo: true,
      })
      .to(containerRef.current, {
        backgroundColor: 'rgba(255, 69, 0, 0.1)',
        duration: 0.1,
        yoyo: true,
        repeat: 3,
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      })
    }
  }, [glitchActive])

  if (bootComplete) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between p-6 md:p-8 font-mono overflow-hidden"
    >
      {/* Neural network background */}
      <NeuralNetworkCanvas />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
          }}
        />
        {/* Moving scanline */}
        <div 
          className="absolute left-0 right-0 h-[2px] bg-[#FF4500]/20 animate-scan"
          style={{
            animation: 'scan 3s linear infinite',
          }}
        />
      </div>

      {/* ASCII Art Header */}
      <div ref={logoRef} className="text-[#FF4500] text-[8px] md:text-xs opacity-60 leading-none">
        <pre className="hidden md:block">{`
 ███╗   ██╗███████╗██╗   ██╗██████╗  █████╗ ██╗     
 ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔══██╗██║     
 ██╔██╗ ██║█████╗  ██║   ██║██████╔╝███████║██║     
 ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██╔══██║██║     
 ██║ ╚████║███████╗╚██████╔╝██║  ██║██║  ██║███████╗
 ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
        `}</pre>
        <pre className="block md:hidden text-[6px]">{`
 ██╗   ██╗███████╗██╗   ██╗██████╗  █████╗ ██╗     
 ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔══██╗██║     
 ██╔██╗ ██║█████╗  ██║   ██║██████╔╝███████║██║     
 ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██╔══██║██║     
 ██║ ╚████║███████╗╚██████╔╝██║  ██║██║  ██║███████╗
 ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
        `}</pre>
        <div className="mt-2 text-[10px] md:text-xs text-[#666] tracking-[0.5em]">
          TERMINAL INTERFACE
        </div>
      </div>

      {/* Center content - Hexagon loader */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Rotating hexagon */}
          <svg 
            className="w-32 h-32 md:w-48 md:h-48 animate-spin-slow" 
            viewBox="0 0 100 100"
            style={{ animationDuration: '8s' }}
          >
            <polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke="#FF4500"
              strokeWidth="0.5"
              opacity="0.3"
            />
            <polygon
              points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
              fill="none"
              stroke="#FF4500"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <polygon
              points="50,25 70,37.5 70,62.5 50,75 30,62.5 30,37.5"
              fill="none"
              stroke="#FF4500"
              strokeWidth="1"
              opacity="0.8"
            />
          </svg>
          
          {/* Progress percentage in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            {Math.round(loadingProgress) === 100 ? (
              <span className="text-xl md:text-3xl font-bold text-[#FF4500] tracking-widest animate-pulse">
                WELCOME
              </span>
            ) : (
              <span className="text-2xl md:text-4xl font-bold text-[#FF4500] tabular-nums">
                {Math.round(loadingProgress)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Boot messages */}
      <div className="relative z-10 max-w-2xl space-y-1 text-xs md:text-sm">
        {messages.slice(-6).map((msg, i) => (
          <div
            key={i}
            className={`transition-opacity duration-300 ${
              msg.includes('[OK]') || msg.includes('[SUCCESS]')
                ? 'text-green-500'
                : msg.includes('WELCOME') || msg.includes('CLASSIFIED')
                  ? 'text-[#FF4500]'
                  : 'text-[#888]'
            }`}
            style={{ opacity: 0.5 + (i / 6) * 0.5 }}
          >
            {msg}
          </div>
        ))}
        <div className="text-[#E0E0E0]">
          {currentLine}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-[#FF4500] transition-opacity`}>
            █
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 max-w-md relative z-10">
        <div className="flex justify-between text-[10px] md:text-xs text-[#666666] mb-2">
          <span>SYSTEM INITIALIZATION</span>
          <span className="tabular-nums">{Math.round(loadingProgress)}%</span>
        </div>
        <div className="h-[2px] bg-[#1a1a1a] overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF6B35] transition-all duration-200 relative"
            style={{ width: `${loadingProgress}%` }}
          >
            {/* Glow effect */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FF4500] rounded-full blur-md opacity-80" />
          </div>
        </div>
      </div>

      {/* System info */}
      <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 text-[10px] md:text-xs text-[#333333] text-right">
        <div>NEURAL_TERMINAL v1.0.0</div>
        <div>BUILD: {new Date().toISOString().split('T')[0]}</div>
        <div className="text-[#FF4500]/50">STATUS: {loadingProgress < 100 ? 'INITIALIZING' : 'READY'}</div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
