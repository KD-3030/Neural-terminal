'use client'

import { useState, useRef } from 'react'
import { useStore } from '@/stores/useStore'
import GlitchText from '../ui/GlitchText'

interface Project {
  id: string
  title: string
  mode: string
  modeLabel: string
  description: string
  tech: string[]
  status: string
  link?: string
}

const projects: Project[] = [
  {
    id: 'project-leaftrack',
    title: 'LEAF_TRACK',
    mode: 'inventory_system',
    modeLabel: 'DISTRIBUTION_LOGISTICS',
    description: 'A comprehensive inventory management application tailored for the tea industry. Streamlines leaf distribution, stock tracking, and supplier logistics.',
    tech: ['JavaScript', 'Next.js 14', 'NoSQL', 'Web Dev'],
    status: 'DEPLOYED',
    link: 'https://sohagtea.vercel.app',
  },
  {
    id: 'project-shiftmate',
    title: 'SHIFTMATE',
    mode: 'Computer_vision_ai',
    modeLabel: 'SMART_MOVING_SOLUTIONS',
    description: 'ShiftMate is a comprehensive moving and storage management platform that leverages AI/ML for automatic furniture detection and volume estimation from images.',
    tech: ['Full-Stack', 'React', 'OpenCV','YoloV8'],
    status: 'IN_DEVELOPMENT',
    link: 'https://github.com/KD-3030/ShiftMate',
  },
  {
    id: 'project-agritrack',
    title: 'AGRI_TRACK',
    mode: 'iot_analytics',
    modeLabel: 'AGRO_INTELLIGENCE',
    description: 'IoT and AI-powered platform for real-time monitoring of agricultural machinery. Utilizes sensor data to analyze equipment health and optimize farming operations.',
    tech: ['Python', 'IoT', 'Raspberry Pi', 'AI/ML'],
    status: 'PROTOTYPE',
    link: 'https://github.com/KD-3030/AgriTrack', 
  }
]

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const { setProjectMode } = useStore()

  const handleProjectHover = (mode: string) => {
    setProjectMode(mode as any)
  }

  return (
    <section className="relative min-h-screen py-20 sm:py-32 px-4 sm:px-6">
      {/* Dark overlay for content visibility */}
      <div className="absolute inset-0 bg-[#050505]/85 pointer-events-none" />
      
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-12 sm:mb-20 relative z-10">
        <div className="text-[#FF4500] text-[10px] sm:text-xs font-mono mb-3 sm:mb-4 tracking-widest">
          [ PHASE_02: THE_ARCHIVES ]
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white">
          <GlitchText>CLASSIFIED PROJECTS</GlitchText>
        </h2>
        <p className="text-[#666666] font-mono text-xs sm:text-sm mt-3 sm:mt-4 max-w-xl">
          Select a project to access detailed system specifications. Each deployment
          represents a unique solution to complex engineering challenges.
        </p>
      </div>

      {/* Projects grid */}
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 relative z-10">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isActive={activeProject === project.id}
            onHover={() => {
              setActiveProject(project.id)
              handleProjectHover(project.mode)
            }}
            onLeave={() => {
              setActiveProject(null)
              setProjectMode('idle')
            }}
          />
        ))}
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: Project
  index: number
  isActive: boolean
  onHover: () => void
  onLeave: () => void
}

function ProjectCard({ project, index, isActive, onHover, onLeave }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      ref={cardRef}
      className={`
        relative group cursor-pointer
        border transition-all duration-500
        ${isActive 
          ? 'border-[#FF4500]/50 bg-[#0a0a0a]/80' 
          : 'border-[#1a1a1a] bg-transparent hover:border-[#333333]'}
      `}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Mode indicator bar */}
      <div className={`
        absolute top-0 left-0 h-full w-1 transition-all duration-300
        ${isActive ? 'bg-[#FF4500]' : 'bg-[#1a1a1a]'}
      `} />

      <div className="p-4 sm:p-6 md:p-8 pl-5 sm:pl-8 md:pl-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div>
            {/* Mode label */}
            <div className={`
              text-[10px] sm:text-xs font-mono mb-1 sm:mb-2 tracking-widest transition-colors
              ${isActive ? 'text-[#FF4500]' : 'text-[#333333]'}
            `}>
              [{project.modeLabel}]
            </div>
            
            {/* Project title */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-2 sm:gap-4">
              <span className="text-[#333333] font-mono text-xs sm:text-sm">0{index + 1}</span>
              <GlitchText glitchOnHover={true}>{project.title}</GlitchText>
            </h3>
          </div>

          {/* Status badge */}
          <div className={`
            px-3 sm:px-4 py-1 border font-mono text-[10px] sm:text-xs transition-all self-start
            ${isActive 
              ? 'border-[#FF4500] text-[#FF4500]' 
              : 'border-[#333333] text-[#666666]'}
          `}>
            STATUS: {project.status}
          </div>
        </div>

        {/* Description */}
        <p className={`
          font-mono text-xs sm:text-sm mb-4 sm:mb-6 max-w-2xl transition-colors leading-relaxed
          ${isActive ? 'text-[#E0E0E0]' : 'text-[#666666]'}
        `}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className={`
                px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono transition-all
                ${isActive 
                  ? 'bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30' 
                  : 'bg-[#0a0a0a] text-[#666666] border border-[#1a1a1a]'}
              `}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action */}
        {project.link && (
          <div className={`
            flex items-center gap-2 text-[10px] sm:text-xs font-mono transition-all
            ${isActive ? 'text-[#FF4500]' : 'text-[#333333]'}
          `}>
            <span>&gt; ACCESS_PROJECT</span>
            <span className={`
              transform transition-transform
              ${isActive ? 'translate-x-2' : 'translate-x-0'}
            `}>
              →
            </span>
            <span className="text-[#666] ml-2 hidden sm:inline">
              [{project.link.includes('github') ? 'GITHUB' : 'LIVE'}]
            </span>
          </div>
        )}
      </div>

      {/* Corner decorations */}
      {isActive && (
        <>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF4500]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF4500]" />
        </>
      )}

      {/* Scan line effect */}
      {isActive && (
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(255, 69, 0, 0.03) 50%)',
            backgroundSize: '100% 4px',
          }}
        />
      )}
    </div>
  )
}
