'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/stores/useStore'

export default function FloatingTerminal() {
  const { bootComplete } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [isMinimized, setIsMinimized] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut: Ctrl+Shift+`
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+` (backtick/tilde key)
      // e.code is more reliable for physical key detection
      const isBacktickKey = e.code === 'Backquote' || e.key === '`' || e.key === '~'
      
      if (e.ctrlKey && e.shiftKey && isBacktickKey) {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(prev => !prev)
        setIsMinimized(false)
      }
      // Also close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen])

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  const handleTerminalSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const input = terminalInput.toLowerCase().trim()
    let response = ''

    switch (input) {
      case 'help':
        response = `Available commands:
  help     - Show this help message
  about    - About the developer
  contact  - Contact information
  skills   - List of skills
  projects - View projects
  clear    - Clear terminal
  theme    - Toggle terminal theme
  date     - Current date/time
  whoami   - Identity check
  matrix   - Enter the Matrix
  exit     - Close terminal`
        break
      case 'about':
        response = 'A developer who believes code is poetry and architecture is art. Building neural interfaces for the digital age.'
        break
      case 'contact':
        response = `EMAIL: kinjaldutta005@gmail.com
GITHUB: github.com/KD-3030
LINKEDIN: linkedin.com/in/kinjal-dutta-16975928b`
        break
      case 'skills':
        response = `[LOADING SKILL DATABASE...]
├── Languages: TypeScript, Python, Java, C++
├── Frontend: React, Next.js, Three.js
├── Backend: Node.js, FastAPI, Django
├── AI/ML: TensorFlow, PyTorch, LangChain
├── Cloud: AWS, Azure, GCP
└── Tools: Docker, Git, Kubernetes`
        break
      case 'projects':
        response = `[ACCESSING PROJECT ARCHIVES...]
├── Neural Terminal - This portfolio
├── AI Agent Systems - Autonomous agents
├── IoT Dashboards - Real-time monitoring
└── Type "scroll" to navigate to projects`
        break
      case 'scroll':
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({ top: scrollHeight * 0.35, behavior: 'smooth' })
        response = 'Navigating to projects section...'
        break
      case 'clear':
        setTerminalHistory([])
        setTerminalInput('')
        return
      case 'date':
        response = `Current timestamp: ${new Date().toISOString()}`
        break
      case 'whoami':
        response = 'VISITOR // ACCESS_LEVEL: GUEST // STATUS: AUTHENTICATED'
        break
      case 'matrix':
        response = 'Wake up, Neo... The Matrix has you... Follow the white rabbit.'
        break
      case 'exit':
      case 'quit':
      case 'close':
        setIsOpen(false)
        return
      case 'sudo':
      case 'sudo su':
        response = '⚠️ Permission denied. Nice try though.'
        break
      case 'hello':
      case 'hi':
      case 'hey':
        response = 'Hello, visitor. Welcome to the Neural Terminal. Type "help" for commands.'
        break
      case 'theme':
        response = 'Theme switching coming in v2.0...'
        break
      default:
        response = `Command not found: "${input}". Type "help" for available commands.`
    }

    setTerminalHistory(prev => [...prev, `> ${terminalInput}`, response])
    setTerminalInput('')
  }, [terminalInput])

  if (!bootComplete) return null

  return (
    <>
      {/* Floating Terminal Button */}
      <button
        onClick={() => {
          setIsOpen(prev => !prev)
          setIsMinimized(false)
        }}
        className={`
          fixed bottom-6 left-6 z-50 w-12 h-12 sm:w-14 sm:h-14
          bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg
          flex items-center justify-center
          hover:border-[#FF4500] hover:bg-[#0a0a0a]/90
          transition-all duration-300 group
          ${isOpen ? 'border-[#FF4500] bg-[#FF4500]/10' : ''}
        `}
        aria-label="Toggle terminal"
        title="Terminal (Ctrl+Shift+`)"
      >
        {/* Terminal Icon */}
        <svg 
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isOpen ? 'text-[#FF4500]' : 'text-white/70 group-hover:text-[#FF4500]'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>

        {/* Keyboard shortcut hint */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[8px] sm:text-[10px] text-[#666] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ctrl+Shift+`
        </span>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-lg border border-[#FF4500]/30 animate-ping opacity-20" />
        )}
      </button>

      {/* Terminal Window */}
      <div
        className={`
          fixed z-50 transition-all duration-300 ease-out
          ${isMinimized 
            ? 'bottom-6 left-24 w-48 h-10' 
            : 'bottom-24 left-6 w-[calc(100vw-3rem)] sm:w-96 md:w-[500px] h-80 sm:h-96'
          }
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
        `}
      >
        <div className="w-full h-full bg-[#0a0a0a]/95 backdrop-blur-sm border border-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl shadow-[#FF4500]/5">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#050505] border-b border-[#1a1a1a]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 transition-colors"
                aria-label="Close"
              />
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-colors"
                aria-label="Minimize"
              />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-[#666] text-[10px] sm:text-xs font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
              neural_terminal.exe
            </span>
            <div className="w-12" /> {/* Spacer for symmetry */}
          </div>

          {/* Terminal Content */}
          {!isMinimized && (
            <div 
              ref={terminalRef}
              className="p-3 sm:p-4 font-mono text-xs sm:text-sm h-[calc(100%-2.5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Welcome message */}
              <div className="text-[#666666] mb-4">
                <div className="text-[#FF4500]">╔══════════════════════════════════════╗</div>
                <div className="text-[#FF4500]">║  <span className="text-white">NEURAL TERMINAL</span> <span className="text-[#666]">v1.0.0</span>          ║</div>
                <div className="text-[#FF4500]">╚══════════════════════════════════════╝</div>
                <div className="mt-2 text-[#888]">Type &quot;help&quot; for available commands.</div>
                <div className="text-[#444]">Press Esc or type &quot;exit&quot; to close.</div>
              </div>

              {/* History */}
              {terminalHistory.map((line, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap ${line.startsWith('>') ? 'text-[#E0E0E0]' : 'text-[#FF4500]'} mb-1`}
                >
                  {line}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleTerminalSubmit} className="flex items-center mt-2">
                <span className="text-[#FF4500]">❯ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-[#E0E0E0] outline-none caret-[#FF4500] text-xs sm:text-sm ml-1"
                  placeholder=""
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="w-2 h-4 bg-[#FF4500] animate-pulse" />
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
