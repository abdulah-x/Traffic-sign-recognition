"use client"

import { CheckCircle, RotateCcw, Trophy, Target, Zap, Clock } from "lucide-react"

interface ResultCardProps {
  prediction: string
  confidence?: number | null
  processingTime?: number | null
  onReset: () => void
}

export default function ResultCard({ prediction, confidence, processingTime, onReset }: ResultCardProps) {
  const confidencePercentage = confidence ? Math.round(confidence * 100) : 95
  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return "text-[#22C55E]"
    if (conf >= 75) return "text-[#FACC15]"
    return "text-[#EF4444]"
  }

  const getConfidenceEmoji = (conf: number) => {
    if (conf >= 95) return "🎯"
    if (conf >= 85) return "🔥"
    if (conf >= 75) return "👍"
    return "🤔"
  }

  const formatProcessingTime = (time: number | null) => {
    if (!time) return "⚡ Lightning fast!"
    if (time < 1) return `${(time * 1000).toFixed(0)}ms`
    return `${time.toFixed(2)}s`
  }

  return (
    <div className="bg-[#1E293B]/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-[#FACC15]/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/10 to-[#FACC15]/5 rounded-3xl"></div>

      <div className="relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="bg-[#FACC15] p-4 rounded-full shadow-xl animate-pulse">
              <CheckCircle className="w-12 h-12 text-black" />
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎉</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-black text-[#FACC15] flex items-center justify-center space-x-2 font-serif">
            <Trophy className="w-6 h-6 text-[#FACC15]" />
            <span>Detection Complete!</span>
            <Trophy className="w-6 h-6 text-[#FACC15]" />
          </h3>

          <div className="bg-gradient-to-r from-[#FACC15] to-[#FACC15] rounded-2xl p-6 shadow-xl">
            <div className="bg-[#0F172A]/90 rounded-xl p-4 border border-[#FACC15]/30">
              <p className="text-3xl font-black text-[#FACC15] mb-2 font-serif">{prediction}</p>
              <div className="flex items-center justify-center space-x-2">
                <Target className={`w-5 h-5 ${getConfidenceColor(confidencePercentage)}`} />
                <span className={`text-lg font-bold ${getConfidenceColor(confidencePercentage)}`}>
                  {confidencePercentage}% Confidence {getConfidenceEmoji(confidencePercentage)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#FACC15] to-[#FACC15] rounded-2xl p-4 shadow-lg">
            <div className="bg-[#0F172A]/90 rounded-xl p-3 border border-[#FACC15]/30">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-[#FACC15]" />
                <span className="text-lg font-bold text-[#F8FAFC]">
                  Processing Time: <span className="text-[#FACC15]">{formatProcessingTime(processingTime ?? null)}</span>
                </span>
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-[#94A3B8]">
              <span>AI Confidence Level</span>
              <span>{confidencePercentage}%</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-3 overflow-hidden border border-[#FACC15]/30">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  confidencePercentage >= 90
                    ? "bg-[#22C55E]"
                    : confidencePercentage >= 75
                      ? "bg-[#FACC15]"
                      : "bg-[#EF4444]"
                }`}
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="group inline-flex items-center space-x-3 bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>Analyze Another Sign</span>
          <Zap className="w-5 h-5 text-black animate-pulse" />
        </button>
      </div>
    </div>
  )
}
