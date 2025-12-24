'use client'

import { useState, useEffect, useRef } from 'react'
import GlitchText from '../ui/GlitchText'

const contactLinks = [
  {
    label: 'EMAIL_PROTOCOL',
    command: 'EXECUTE',
    href: 'mailto:kinjaldutta005@gmail.com',
    icon: '📧',
  },
  {
    label: 'GITHUB_REPO',
    command: 'ACCESS',
    href: 'https://github.com/KD-3030',
    icon: '⚡',
  },
  {
    label: 'LINKEDIN_LOGS',
    command: 'ACCESS',
    href: 'www.linkedin.com/in/kinjal-dutta-16975928b',
    icon: '🔗',
  },
]

export default function ContactSection() {
  const [currentTime, setCurrentTime] = useState('')
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toISOString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const input = terminalInput.toLowerCase().trim()
    let response = ''

    // Easter egg commands
    switch (input) {
      case 'help':
        response = 'Available commands: help, about, contact, skills, clear, sudo, matrix'
        break
      case 'about':
        response = 'A developer who believes code is poetry and architecture is art.'
        break
      case 'contact':
        response = 'EMAIL: kinjaldutta005@gmail.com | GITHUB: @KD-3030'
        break
      case 'skills':
        response = 'Loading skill database... [TypeScript, Python, React, AI, IoT, ...]'
        break
      case 'clear':
        setTerminalHistory([])
        setTerminalInput('')
        return
      case 'sudo':
        response = 'Nice try. Access denied.'
        break
      case 'matrix':
        response = 'Wake up, Neo... The Matrix has you...'
        break
      case 'hello':
      case 'hi':
        response = 'Hello, visitor. Welcome to the Neural Terminal.'
        break
      default:
        response = `Command not recognized: "${input}". Type "help" for available commands.`
    }

    setTerminalHistory(prev => [...prev, `> ${terminalInput}`, response])
    setTerminalInput('')
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-20 sm:py-32 px-4 sm:px-6">
      {/* Background fade and overlay */}
      <div className="absolute inset-0 bg-[#050505]/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center z-10">
        {/* Section header */}
        <div className="text-[#FF4500] text-[10px] sm:text-xs font-mono mb-3 sm:mb-4 tracking-widest">
          [ PHASE_04: ESTABLISH_LINK ]
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 sm:mb-8">
          <GlitchText>INITIATE CONTACT</GlitchText>
        </h2>
        
        <p className="text-[#888888] font-mono text-xs sm:text-sm mb-10 sm:mb-16 max-w-xl mx-auto px-4">
          Ready to collaborate on your next project? Establish a secure connection
          through one of the following channels.
        </p>

        {/* Contact buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-20">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-4 sm:px-8 py-3 sm:py-4 border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#FF4500] transition-all duration-300"
            >
              {/* Button content */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-[#FF4500] font-mono text-[10px] sm:text-xs">
                  {link.command}:
                </span>
                <span className="text-white font-mono text-xs sm:text-sm group-hover:text-[#FF4500] transition-colors">
                  {link.label}
                </span>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-[#FF4500]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF4500] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF4500] opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        {/* Interactive terminal */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#050505] border-b border-[#1a1a1a]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#FF4500]" />
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#333333]" />
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#333333]" />
              </div>
              <span className="text-[#333333] text-[10px] sm:text-xs font-mono">terminal.exe</span>
            </div>

            {/* Terminal content */}
            <div 
              className="p-3 sm:p-4 font-mono text-xs sm:text-sm h-40 sm:h-48 overflow-y-auto"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Welcome message */}
              <div className="text-[#666666] mb-3 sm:mb-4">
                <div>Neural Terminal v1.0.0</div>
                <div>Type &quot;help&quot; for available commands.</div>
              </div>

              {/* History */}
              {terminalHistory.map((line, i) => (
                <div
                  key={i}
                  className={line.startsWith('>') ? 'text-[#E0E0E0]' : 'text-[#FF4500]'}
                >
                  {line}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleTerminalSubmit} className="flex items-center">
                <span className="text-[#FF4500]">&gt; </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-[#E0E0E0] outline-none caret-[#FF4500] text-xs sm:text-sm"
                  placeholder="type a command..."
                  autoComplete="off"
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4 text-[#333333] font-mono text-[10px] sm:text-xs">
          <div className="text-center md:text-left">
            SYSTEM VERSION 1.0 // BUILT BY <span className="text-[#FF4500]">KINJAL DUTTA</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline">{currentTime}</span>
            <span>UPTIME: ∞</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
