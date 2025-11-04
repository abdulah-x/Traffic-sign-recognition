export interface PredictionHistory {
  id: string
  image: string
  prediction: string
  confidence: number
  timestamp: Date
  processingTime?: number
}

export const savePredictionToHistory = (
  prediction: string, 
  confidence: number, 
  imageUrl: string, 
  processingTime?: number
): PredictionHistory[] => {
  const newPrediction: PredictionHistory = {
    id: Date.now().toString(),
    image: imageUrl,
    prediction,
    confidence,
    timestamp: new Date(),
    processingTime
  }
  
  const existingHistory = getPredictionHistory()
  const updatedHistory = [newPrediction, ...existingHistory.slice(0, 9)] // Keep last 10
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('trafficSignHistory', JSON.stringify(updatedHistory))
  }
  
  return updatedHistory
}

export const getPredictionHistory = (): PredictionHistory[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('trafficSignHistory')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const clearPredictionHistory = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('trafficSignHistory')
  }
}

export const logPredictionAnalytics = (
  prediction: string, 
  confidence: number, 
  processingTime: number
): void => {
  // Simple analytics logging
  console.log('🔍 Prediction Analytics:', {
    prediction,
    confidence: Math.round(confidence * 100) + '%',
    processingTime: processingTime.toFixed(2) + 's',
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
  })
}