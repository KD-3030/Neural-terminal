'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/stores/useStore'

export default function BackgroundAudio() {
  const { audioEnabled, bootComplete, toggleAudio } = useStore()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [hasAutoStarted, setHasAutoStarted] = useState(false)

  // Auto-enable audio when boot completes
  useEffect(() => {
    if (bootComplete && !hasAutoStarted) {
      setHasAutoStarted(true)
      // Small delay to ensure smooth transition after boot
      setTimeout(() => {
        if (!audioEnabled) {
          toggleAudio() // Enable audio automatically
        }
      }, 500)
    }
  }, [bootComplete, hasAutoStarted, audioEnabled, toggleAudio])

  // Handle audio play/pause based on audioEnabled state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audioEnabled && bootComplete) {
      // Play audio with fade in
      audio.volume = 0
      audio.play().catch((err) => {
        // Autoplay might be blocked by browser
        console.log('Audio autoplay blocked:', err)
      })
      
      // Fade in effect
      const fadeIn = setInterval(() => {
        if (audio.volume < 0.3) {
          audio.volume = Math.min(audio.volume + 0.02, 0.3)
        } else {
          clearInterval(fadeIn)
        }
      }, 100)
      
      return () => clearInterval(fadeIn)
    } else {
      // Fade out then pause
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.02) {
          audio.volume = Math.max(audio.volume - 0.02, 0)
        } else {
          audio.pause()
          clearInterval(fadeOut)
        }
      }, 50)
      
      return () => clearInterval(fadeOut)
    }
  }, [audioEnabled, bootComplete])

  return (
    <audio
      ref={audioRef}
      src="/Cornfield Chase - Hans Zimmer.mp3"
      loop
      preload="auto"
    />
  )
}
