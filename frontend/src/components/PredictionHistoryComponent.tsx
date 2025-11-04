"use client"

import React, { useState } from 'react'
import { History, Clock, Target, X, Trash2 } from 'lucide-react'
import { PredictionHistory } from '../utils/analytics'

interface PredictionHistoryComponentProps {
  history: PredictionHistory[]
  onClear: () => void
}

export default function PredictionHistoryComponent({ history, onClear }: PredictionHistoryComponentProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <>
      {/* History Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#FACC15] hover:bg-[#FACC15]/90 text-black p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-30"
        aria-label="View prediction history"
      >
        <div className="relative">
          <History size={24} />
          {history.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Math.min(history.length, 9)}
            </span>
          )}
        </div>
      </button>

      {/* History Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border-2 border-[#FACC15]/30 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#FACC15]/20">
              <div className="flex items-center space-x-3">
                <History className="text-[#FACC15]" size={24} />
                <h2 className="text-xl font-bold text-[#FACC15]">Prediction History</h2>
                <span className="bg-[#FACC15]/20 text-[#FACC15] px-2 py-1 rounded-full text-sm">
                  {history.length}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      onClear()
                      setIsOpen(false)
                    }}
                    className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-400/10 transition-colors"
                    title="Clear all history"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#94A3B8] hover:text-[#FACC15] p-2 rounded-full hover:bg-[#FACC15]/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="overflow-y-auto max-h-96 p-4 space-y-4">
              {history.map((item, index) => (
                <div key={item.id} className="bg-[#0F172A]/50 rounded-2xl p-4 border border-[#FACC15]/10 hover:border-[#FACC15]/30 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={`Prediction ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[#F8FAFC] text-sm truncate">
                          {item.prediction}
                        </h3>
                        <span className="text-xs text-[#94A3B8]">
                          #{index + 1}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-[#94A3B8]">
                        <div className="flex items-center space-x-1">
                          <Target size={12} />
                          <span className="text-[#FACC15]">{(item.confidence * 100).toFixed(1)}%</span>
                        </div>
                        
                        {item.processingTime && (
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{item.processingTime.toFixed(2)}s</span>
                          </div>
                        )}
                        
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#FACC15]/20 bg-[#0F172A]/30">
              <p className="text-xs text-[#64748B] text-center">
                Showing last {Math.min(history.length, 10)} predictions • Stored locally on your device
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}