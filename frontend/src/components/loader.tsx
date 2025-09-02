"use client"

import { Loader2, Brain, Zap, Eye } from "lucide-react"

export default function Loader() {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 rounded-3xl animate-gradient-x"></div>

      <div className="relative z-10 text-center space-y-6">
        <div className="flex justify-center items-center space-x-4">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-300 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-black text-gray-800 flex items-center justify-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
            <span>AI Brain Working...</span>
            <Brain className="w-6 h-6 text-purple-600 animate-pulse animation-delay-500" />
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Eye className="w-5 h-5 text-green-500 animate-bounce" />
              <span className="font-medium">Scanning image pixels...</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
              <span className="font-medium">Running neural networks...</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Brain className="w-5 h-5 text-purple-500 animate-bounce animation-delay-1000" />
              <span className="font-medium">Analyzing traffic patterns...</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
          <p className="text-lg text-gray-700 font-medium">🤖 Our AI is putting on its detective hat...</p>
          <p className="text-sm text-gray-500 mt-1">This usually takes just a few seconds!</p>
        </div>

        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  )
}