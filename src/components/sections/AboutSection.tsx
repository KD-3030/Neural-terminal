'use client'

import { useRef } from 'react'
import GlitchText, { GlitchTextCSS } from '../ui/GlitchText'

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const highlights = [
    { word: 'Full Stack', description: 'End-to-end system architecture' },
    { word: 'AI', description: 'Machine learning & computer vision' },
    { word: 'DevOps', description: 'Infrastructure automation & CI/CD' },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 sm:py-32"
    >
      {/* Dark overlay for content visibility */}
      <div className="absolute inset-0 bg-[#050505]/80 pointer-events-none" />
      
      {/* Background grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#FF4500]/10 to-transparent"
            style={{
              top: `${10 + i * 10}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        {/* Left side - Big text */}
        <div>
          <div className="text-[#FF4500] text-[10px] sm:text-xs font-mono mb-3 sm:mb-4 tracking-widest">
            [ PHASE_01: THE_ARCHITECT ]
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-none mb-6 sm:mb-8">
            <GlitchTextCSS className="block mb-1 sm:mb-2">BUILDING</GlitchTextCSS>
            <GlitchTextCSS className="block mb-1 sm:mb-2">THE</GlitchTextCSS>
            <span className="text-[#FF4500]">
              <GlitchTextCSS>FUTURE</GlitchTextCSS>
            </span>
          </h2>

          {/* Skill highlights */}
          <div className="space-y-3 sm:space-y-4">
            {highlights.map((item, i) => (
              <div
                key={item.word}
                className="group flex items-center gap-3 sm:gap-4 cursor-pointer"
              >
                <span className="text-[#FF4500] font-mono text-[10px] sm:text-xs">0{i + 1}</span>
                <span className="text-white font-mono text-xs sm:text-sm group-hover:text-[#FF4500] transition-colors">
                  <GlitchText>{item.word}</GlitchText>
                </span>
                <span className="text-[#333333] text-[10px] sm:text-xs font-mono hidden sm:inline">
                  // {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Bio */}
        <div className="relative mt-8 md:mt-0">
          {/* Terminal window frame */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#FF4500]/50" />
              <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#333333]" />
              <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#333333]" />
              <span className="ml-2 sm:ml-4 text-[#666666] text-[10px] sm:text-xs font-mono">about.exe</span>
            </div>
            
            {/* Terminal content */}
            <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm space-y-3 sm:space-y-4">
              <div>
                <span className="text-[#FF4500]">&gt; </span>
                <span className="text-[#666666]">cat ./profile.md</span>
              </div>
              
              <div className="text-[#E0E0E0] leading-relaxed space-y-3 sm:space-y-4">
                <p>
                  I&apos;m an aspiring <span className="text-[#FF4500]">software engineer</span> who 
                  believes technology should feel like magic. I specialize in building 
                  <span className="text-[#FF4500]"> intelligent systems</span> that bridge 
                  the gap between digital innovation and real-world impact.
                </p>
                
                <p>
                  From crafting <span className="text-[#FF4500]">AI-powered applications</span> to 
                  engineering <span className="text-[#FF4500]">IoT ecosystems</span>, I approach 
                  every project with the mindset of an architect—obsessing over both the foundation 
                  and the finish.
                </p>
                
                <p className="text-[#666666]">
                  Currently revolutionizing the game, one commit at a time.
                </p>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-[#1a1a1a] flex items-center gap-2">
                <span className="text-[#FF4500]">&gt;</span>
                <span className="w-2 h-4 bg-[#FF4500] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-[#FF4500]/30" />
          <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-[#FF4500]/30" />
        </div>
      </div>
    </section>
  )
}
