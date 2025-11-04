"use client"

import React from 'react'

interface ConfidenceBarProps {
  confidence: number
  className?: string
}

export default function ConfidenceBar({ confidence, className = "" }: ConfidenceBarProps) {
  const percentage = confidence * 100
  
  const getColorClass = (conf: number) => {
    if (conf >= 0.8) return 'from-green-500 to-green-600'
    if (conf >= 0.6) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-red-600'
  }

  const getLabel = (conf: number) => {
    if (conf >= 0.9) return 'Very High'
    if (conf >= 0.8) return 'High'
    if (conf >= 0.6) return 'Medium'
    if (conf >= 0.4) return 'Low'
    return 'Very Low'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-[#94A3B8] font-medium">Confidence</span>
        <span className="text-[#FACC15] font-bold">
          {percentage.toFixed(1)}% - {getLabel(confidence)}
        </span>
      </div>
      
      <div className="w-full bg-[#1E293B]/60 rounded-full h-3 overflow-hidden border border-[#FACC15]/20">
        <div 
          className={`h-full bg-gradient-to-r ${getColorClass(confidence)} transition-all duration-1000 ease-out rounded-full relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-1 text-xs text-[#64748B]">
        <span className={confidence >= 0.2 ? 'text-[#FACC15]' : ''}>0-20%</span>
        <span className={confidence >= 0.4 ? 'text-[#FACC15]' : ''}>20-40%</span>
        <span className={confidence >= 0.6 ? 'text-[#FACC15]' : ''}>40-60%</span>
        <span className={confidence >= 0.8 ? 'text-[#FACC15]' : ''}>60-80%</span>
        <span className={confidence >= 1.0 ? 'text-[#FACC15]' : ''}>80-100%</span>
      </div>
    </div>
  )
}