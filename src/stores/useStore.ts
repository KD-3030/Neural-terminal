import { create } from 'zustand'

export type ProjectMode = 
  | 'idle'
  | 'visual_analysis'
  | 'hardware_link'
  | 'system_architect'

interface NeuralState {
  // Loading state
  isLoading: boolean
  loadingProgress: number
  bootComplete: boolean
  
  // Scroll state
  scrollProgress: number
  currentPhase: number
  
  // Project mode
  projectMode: ProjectMode
  
  // Interaction state
  isHoveringSkill: string | null
  cursorPosition: { x: number; y: number }
  
  // Audio
  audioEnabled: boolean
  
  // System messages
  systemMessages: string[]
  
  // Actions
  setLoading: (loading: boolean) => void
  setLoadingProgress: (progress: number) => void
  setBootComplete: (complete: boolean) => void
  setScrollProgress: (progress: number) => void
  setCurrentPhase: (phase: number) => void
  setProjectMode: (mode: ProjectMode) => void
  setHoveringSkill: (skill: string | null) => void
  setCursorPosition: (pos: { x: number; y: number }) => void
  toggleAudio: () => void
  addSystemMessage: (message: string) => void
  clearSystemMessages: () => void
}

export const useStore = create<NeuralState>((set) => ({
  // Initial state
  isLoading: true,
  loadingProgress: 0,
  bootComplete: false,
  scrollProgress: 0,
  currentPhase: 0,
  projectMode: 'idle',
  isHoveringSkill: null,
  cursorPosition: { x: 0, y: 0 },
  audioEnabled: false,
  systemMessages: [],
  
  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setBootComplete: (complete) => set({ bootComplete: complete }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setProjectMode: (mode) => set({ projectMode: mode }),
  setHoveringSkill: (skill) => set({ isHoveringSkill: skill }),
  setCursorPosition: (pos) => set({ cursorPosition: pos }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  addSystemMessage: (message) => set((state) => ({ 
    systemMessages: [...state.systemMessages.slice(-4), message] 
  })),
  clearSystemMessages: () => set({ systemMessages: [] }),
}))
