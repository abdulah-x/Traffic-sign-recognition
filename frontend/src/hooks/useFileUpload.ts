import { useState, useCallback } from 'react'
import { validateImageFile, compressImage } from '../utils/imageUtils'

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const selectFile = useCallback(async (inputFile: File) => {
    setIsUploading(true)
    setError(null)

    try {
      // Validate file
      const validation = validateImageFile(inputFile)
      if (!validation.valid) {
        setError(validation.error!)
        setIsUploading(false)
        return false
      }

      // Compress image if needed
      let processedFile = inputFile
      if (inputFile.size > 1024 * 1024) { // If larger than 1MB
        processedFile = await compressImage(inputFile)
      }

      setFile(processedFile)
      setPreview(URL.createObjectURL(processedFile))
      setIsUploading(false)
      return true
    } catch (err) {
      setError('Failed to process image')
      setIsUploading(false)
      return false
    }
  }, [])

  const resetFile = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setFile(null)
    setPreview(null)
    setError(null)
    setIsUploading(false)
  }, [preview])

  return {
    file,
    preview,
    error,
    isUploading,
    selectFile,
    resetFile
  }
}