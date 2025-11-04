import { useState, useEffect } from 'react'
import { getPredictionHistory, savePredictionToHistory, PredictionHistory } from '../utils/analytics'

export const usePredictionHistory = () => {
  const [history, setHistory] = useState<PredictionHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setHistory(getPredictionHistory())
    setIsLoading(false)
  }, [])

  const addPrediction = (
    prediction: string,
    confidence: number,
    imageUrl: string,
    processingTime?: number
  ) => {
    const updatedHistory = savePredictionToHistory(prediction, confidence, imageUrl, processingTime)
    setHistory(updatedHistory)
  }

  const clearHistory = () => {
    setHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trafficSignHistory')
    }
  }

  return {
    history,
    isLoading,
    addPrediction,
    clearHistory
  }
}