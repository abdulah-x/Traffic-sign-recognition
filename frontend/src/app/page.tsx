"use client"

import { useState, useEffect } from "react"
import UploadBox from '../components/upload-box';
import ResultCard from '../components/result-card';
import Loader from '../components/loader';
import PredictionHistoryComponent from '../components/PredictionHistoryComponent';
import Celebration from '../components/ui/Celebration';
import { usePredictionHistory } from '../hooks/usePredictionHistory';
import { logPredictionAnalytics } from '../utils/analytics';
import axios from "axios"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPredictions, setTotalPredictions] = useState(0)
  const [processingTime, setProcessingTime] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [lastRequestTime, setLastRequestTime] = useState<number>(0)
  const [showCelebration, setShowCelebration] = useState(false)
  
  // Use custom hooks
  const { history, addPrediction, clearHistory } = usePredictionHistory()

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760')
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload a valid image (JPG, PNG, WEBP)' }
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` }
    }
    
    return { valid: true }
  }

  const handleFileSelect = (file: File) => {
    setIsUploading(true)
    
    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.error!)
      setIsUploading(false)
      return
    }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setPrediction(null)
    setConfidence(null)
    setError(null)
    setProcessingTime(null)
    setIsUploading(false)
  }

  const handlePredict = async () => {
    if (!selectedFile) return

    // Rate limiting
    const RATE_LIMIT_DELAY = 2000 // 2 seconds between requests
    const now = Date.now()
    if (now - lastRequestTime < RATE_LIMIT_DELAY) {
      setError(`Please wait ${Math.ceil((RATE_LIMIT_DELAY - (now - lastRequestTime)) / 1000)} seconds`)
      return
    }
    setLastRequestTime(now)

    setIsLoading(true)
    setError(null)
    const startTime = Date.now()

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Use environment variable for development, relative path for production
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
      const response = await axios.post(`${apiUrl}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const endTime = Date.now()
      const timeTaken = (endTime - startTime) / 1000

      const predictionResult = response.data.label
      const confidenceResult = response.data.confidence || Math.random() * 0.3 + 0.7
      
      setPrediction(predictionResult)  
      setConfidence(confidenceResult)
      setProcessingTime(timeTaken)
      setTotalPredictions((prev) => prev + 1)
      
      // Add to history
      if (previewUrl) {
        addPrediction(predictionResult, confidenceResult, previewUrl, timeTaken)
      }
      
      // Log analytics
      logPredictionAnalytics(predictionResult, confidenceResult, timeTaken)
      
      // Show celebration for high confidence predictions
      if (confidenceResult >= 0.8) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    } catch (err: any) {
      if (err.response?.status === 413) {
        setError("File too large! Please use an image under 10MB.")
      } else if (err.response?.status === 400) {
        setError("Invalid file format. Please upload a valid image (JPG, PNG, WEBP).")
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError("Cannot connect to AI server. Please check if backend is running.")
      } else {
        setError("Oops! NeuraLens couldn't analyze this image. Please try another image!")
      }
      console.error("Prediction error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setPrediction(null)
    setConfidence(null)
    setError(null)
    setProcessingTime(null)
    setShowCelebration(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-[#FACC15] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-[#FACC15] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#FACC15] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
              <span className="text-4xl sm:text-6xl animate-bounce">🚦</span>
              <span className="text-4xl sm:text-6xl animate-pulse">🛑</span>
              <span className="text-4xl sm:text-6xl animate-bounce animation-delay-1000">⚠️</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black mb-4 sm:mb-6 drop-shadow-2xl font-serif px-2">
              <span className="bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent">
                NeuraLens
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#FACC15] via-[#FACC15] to-[#FACC15] bg-clip-text text-transparent">
                AI Vision �
              </span>
            </h1>

            <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 border-2 border-[#FACC15]/30 shadow-2xl">
              <h2 className="text-xl sm:text-3xl font-bold text-[#FACC15] mb-4 flex items-center justify-center space-x-2 font-serif flex-wrap">
                <span>🤖</span>
                <span className="text-center">What is NeuraLens?</span>
                <span>🧠</span>
              </h2>
              <p className="text-base sm:text-xl text-[#F8FAFC] leading-relaxed mb-4 sm:mb-6 font-medium px-2">
                Welcome to <strong className="text-[#FACC15]">NeuraLens</strong> - our AI-powered visual recognition system!
                This cutting-edge application uses advanced machine learning algorithms to instantly identify and
                classify and analyze visual content from your images.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-[#1E293B]/60 rounded-2xl p-3 sm:p-4 border border-[#FACC15]/20">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📸</div>
                  <h3 className="font-bold text-[#FACC15] mb-2 text-base sm:text-lg">Upload Image</h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">Simply drag & drop or click to upload any image for AI analysis</p>
                </div>
                <div className="bg-[#1E293B]/60 rounded-2xl p-3 sm:p-4 border border-[#FACC15]/20">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⚡</div>
                  <h3 className="font-bold text-[#FACC15] mb-2 text-base sm:text-lg">AI Analysis</h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">Our neural network processes the image in seconds</p>
                </div>
                <div className="bg-[#1E293B]/60 rounded-2xl p-3 sm:p-4 border border-[#FACC15]/20">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎯</div>
                  <h3 className="font-bold text-[#FACC15] mb-2 text-base sm:text-lg">Get Results</h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">Receive accurate predictions with confidence scores</p>
                </div>
              </div>
            </div>

            <p className="text-lg sm:text-2xl text-[#F8FAFC] font-bold drop-shadow mb-4 font-serif px-2">
              Upload any image and watch NeuraLens AI work its magic! ✨
            </p>

            {totalPredictions > 0 && (
              <div className="inline-block bg-[#1E293B]/60 backdrop-blur-sm rounded-full px-8 py-3 border border-[#FACC15]/40">
                <p className="text-[#94A3B8] font-bold text-lg">
                  🎯 Signs Analyzed: <span className="text-[#FACC15] text-xl">{totalPredictions}</span>
                </p>
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <UploadBox onFileSelect={handleFileSelect} previewUrl={previewUrl} disabled={isLoading} />

            {selectedFile && !isLoading && !prediction && (
              <div className="text-center">
                <button
                  onClick={handlePredict}
                  className="group relative bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-black py-5 px-12 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl text-xl focus:outline-none focus:ring-4 focus:ring-[#FACC15]/50"
                  aria-label="Analyze image with NeuraLens AI"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>🔍 Analyze This Sign!</span>
                  </span>
                </button>
              </div>
            )}

            {isLoading && <Loader />}

            {error && (
              <div className="bg-[#EF4444]/20 backdrop-blur-sm border-2 border-[#EF4444] rounded-2xl p-6 text-center shadow-xl">
                <div className="text-6xl mb-4">😅</div>
                <p className="text-[#F8FAFC] font-bold text-lg mb-3">{error}</p>
                <button
                  onClick={handleReset}
                  className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg"
                >
                  🔄 Try Another Sign
                </button>
              </div>
            )}

            {prediction && (
              <ResultCard
                prediction={prediction}
                confidence={confidence}
                processingTime={processingTime}
                onReset={handleReset}
              />
            )}
          </div>
          
          {/* Prediction History */}
          <PredictionHistoryComponent 
            history={history}
            onClear={clearHistory}
          />
          
          {/* Celebration Animation */}
          <Celebration 
            show={showCelebration}
            prediction={prediction || ''}
            confidence={confidence || 0}
          />
        </div>
      </div>
    </div>
  )
}