'use client'

import { useRef, useState, useEffect } from 'react'
import GlitchText from '../ui/GlitchText'
import { useStore } from '@/stores/useStore'

const skills = [
  { category: 'LANGUAGES', items: ['TypeScript', 'Python', 'Rust', 'Go', 'C++', 'Java'] },
  { category: 'FRONTEND', items: ['React', 'Next.js', 'Three.js', 'WebGL', 'GLSL', 'Tailwind'] },
  { category: 'BACKEND', items: ['Node.js', 'Express', 'FastAPI', 'GraphQL', 'gRPC', 'WebSocket'] },
  { category: 'AI/ML', items: ['TensorFlow', 'PyTorch', 'OpenCV', 'Scikit-learn', 'CUDA', 'ONNX'] },
  { category: 'CLOUD', items: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'] },
  { category: 'DATA', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'ElasticSearch', 'GraphDB'] },
]

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { isHoveringSkill, setHoveringSkill } = useStore()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <section ref={sectionRef} className="relative min-h-screen py-20 sm:py-32 px-4 sm:px-6">
      {/* Dark overlay for content visibility */}
      <div className="absolute inset-0 bg-[#050505]/80 pointer-events-none" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] opacity-5">
          <div className="w-full h-full border border-[#FF4500] rounded-full" />
          <div className="absolute inset-4 sm:inset-8 border border-[#FF4500] rounded-full" />
          <div className="absolute inset-8 sm:inset-16 border border-[#FF4500] rounded-full" />
          <div className="absolute inset-12 sm:inset-24 border border-[#FF4500] rounded-full" />
        </div>
      </div>

      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-12 sm:mb-20 text-center relative z-10">
        <div className="text-[#FF4500] text-[10px] sm:text-xs font-mono mb-3 sm:mb-4 tracking-widest">
          [ PHASE_03: THE_ARSENAL ]
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-3 sm:mb-4">
          <GlitchText>TECH STACK</GlitchText>
        </h2>
        <p className="text-[#888888] font-mono text-xs sm:text-sm max-w-xl mx-auto px-4">
          Weapons of choice for digital warfare. Each tool mastered, each framework conquered.
        </p>
      </div>

      {/* Skills grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-10">
        {skills.map((category) => (
          <SkillCategory
            key={category.category}
            category={category}
            isActive={activeCategory === category.category}
            hoveredSkill={isHoveringSkill}
            onCategoryHover={() => setActiveCategory(category.category)}
            onCategoryLeave={() => setActiveCategory(null)}
            onSkillHover={(skill) => setHoveringSkill(skill)}
            onSkillLeave={() => setHoveringSkill(null)}
          />
        ))}
      </div>

      {/* Interactive skill cloud note */}
      <div className="max-w-6xl mx-auto mt-12 sm:mt-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-[#1a1a1a] bg-[#0a0a0a]/80">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#FF4500] rounded-full animate-pulse" />
          <span className="text-[#888888] font-mono text-[10px] sm:text-xs">
            <span className="hidden sm:inline">INTERACT WITH THE 3D SKILL SPHERE IN THE BACKGROUND</span>
            <span className="sm:hidden">3D SKILL SPHERE ACTIVE</span>
          </span>
        </div>
      </div>
    </section>
  )
}

interface SkillCategoryProps {
  category: { category: string; items: string[] }
  isActive: boolean
  hoveredSkill: string | null
  onCategoryHover: () => void
  onCategoryLeave: () => void
  onSkillHover: (skill: string) => void
  onSkillLeave: () => void
}

function SkillCategory({
  category,
  isActive,
  hoveredSkill,
  onCategoryHover,
  onCategoryLeave,
  onSkillHover,
  onSkillLeave,
}: SkillCategoryProps) {
  return (
    <div
      className={`
        relative p-4 sm:p-6 border transition-all duration-300
        ${isActive ? 'border-[#FF4500]/30 bg-[#0a0a0a]/60' : 'border-[#1a1a1a] bg-transparent'}
      `}
      onMouseEnter={onCategoryHover}
      onMouseLeave={onCategoryLeave}
      onClick={onCategoryHover}
    >
      {/* Category header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className={`
          w-1.5 sm:w-2 h-1.5 sm:h-2 transition-colors
          ${isActive ? 'bg-[#FF4500]' : 'bg-[#333333]'}
        `} />
        <h3 className={`
          font-mono text-[10px] sm:text-xs tracking-widest transition-colors
          ${isActive ? 'text-[#FF4500]' : 'text-[#666666]'}
        `}>
          {category.category}
        </h3>
      </div>

      {/* Skills list */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {category.items.map((skill) => (
          <button
            key={skill}
            className={`
              px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-mono transition-all duration-200
              border
              ${hoveredSkill === skill
                ? 'border-[#FF4500] bg-[#FF4500]/10 text-[#FF4500] scale-105'
                : isActive
                  ? 'border-[#333333] text-[#E0E0E0] hover:border-[#FF4500]/50 hover:text-[#FF4500]'
                  : 'border-[#1a1a1a] text-[#666666] hover:border-[#333333]'}
            `}
            onMouseEnter={() => onSkillHover(skill)}
            onMouseLeave={onSkillLeave}
            onTouchStart={() => onSkillHover(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Corner accents */}
      {isActive && (
        <>
          <div className="absolute top-0 right-0 w-2 sm:w-3 h-2 sm:h-3 border-t border-r border-[#FF4500]" />
          <div className="absolute bottom-0 left-0 w-2 sm:w-3 h-2 sm:h-3 border-b border-l border-[#FF4500]" />
        </>
      )}
    </div>
  )
}
