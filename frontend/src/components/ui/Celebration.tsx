"use client"

import React, { useEffect, useState } from 'react'
import { Sparkles, PartyPopper } from 'lucide-react'

interface CelebrationProps {
  show: boolean
  prediction: string
  confidence: number
}

export default function Celebration({ show, prediction, confidence }: CelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }))
      setParticles(newParticles)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s'
          }}
        >
          {Math.random() > 0.5 ? (
            <Sparkles className="text-[#FACC15] animate-spin" size={16} />
          ) : (
            <PartyPopper className="text-[#FACC15] animate-pulse" size={16} />
          )}
        </div>
      ))}

      {/* Success message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
        <div className="bg-[#FACC15]/10 backdrop-blur-md border-2 border-[#FACC15] rounded-3xl p-6 text-center">
          <div className="text-6xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold text-[#FACC15] mb-2">Great Detection!</h3>
          <p className="text-[#F8FAFC] font-medium">
            {confidence >= 0.9 ? "Perfect match!" : "High confidence detection!"}
          </p>
          <p className="text-sm text-[#94A3B8] mt-1">
            {(confidence * 100).toFixed(1)}% confidence
          </p>
        </div>
      </div>
    </div>
  )
}