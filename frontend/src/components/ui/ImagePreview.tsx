"use client"

import React, { useState } from 'react'
import { X, ZoomIn, Clock, Target } from 'lucide-react'

interface ImagePreviewProps {
  src: string
  alt: string
  className?: string
  prediction?: string
  confidence?: number
  processingTime?: number
}

export default function ImagePreview({ 
  src, 
  alt, 
  className = "",
  prediction,
  confidence,
  processingTime
}: ImagePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <>
      <div className={`relative group cursor-pointer ${className}`}>
        <img 
          src={src} 
          alt={alt}
          className="w-full h-64 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
          onClick={() => setIsZoomed(true)}
        />
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl flex items-center justify-center">
          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
        </div>
        
        {prediction && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl p-3">
            <div className="text-white text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <Target size={14} />
                <span className="font-semibold truncate">{prediction}</span>
              </div>
              {confidence && (
                <div className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>{(confidence * 100).toFixed(1)}%</span>
                </div>
              )}
              {processingTime && (
                <div className="flex items-center space-x-2">
                  <Clock size={14} />
                  <span>{processingTime.toFixed(2)}s</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Zoomed Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomed(false)
              }}
              className="absolute -top-12 right-0 text-white hover:text-[#FACC15] transition-colors"
              aria-label="Close zoom"
            >
              <X size={32} />
            </button>
            
            <img 
              src={src} 
              alt={alt}
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}