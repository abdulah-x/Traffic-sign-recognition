"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { Upload, ImageIcon, Camera, Sparkles } from "lucide-react"

interface UploadBoxProps {
  onFileSelect: (file: File) => void
  previewUrl: string | null
  disabled?: boolean
}

export default function UploadBox({ onFileSelect, previewUrl, disabled }: UploadBoxProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)
      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          onFileSelect(file)
        }
      }
    },
    [onFileSelect, disabled],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          onFileSelect(file)
        }
      }
    },
    [onFileSelect, disabled],
  )

  return (
    <div className="bg-[#1E293B]/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-[#FACC15]/30">
      {previewUrl ? (
        <div className="text-center">
          <div className="relative inline-block group">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-80 rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FACC15]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Sparkles className="absolute top-4 right-4 w-8 h-8 text-[#FACC15] animate-pulse" />
          </div>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-[#FACC15] rounded-full animate-pulse"></div>
            <p className="text-lg font-bold text-[#F8FAFC]">Ready for AI Analysis! 🚀</p>
            <div className="w-3 h-3 bg-[#FACC15] rounded-full animate-pulse animation-delay-500"></div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? "border-[#FACC15] bg-[#FACC15]/10 scale-105 shadow-2xl"
              : disabled
                ? "border-[#94A3B8] bg-[#0F172A]/50 cursor-not-allowed"
                : "border-[#FACC15]/50 hover:border-[#FACC15] hover:bg-[#FACC15]/10 cursor-pointer hover:scale-102"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className={`cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}>
            <div className="flex flex-col items-center space-y-6">
              <div className={`relative ${isDragOver ? "animate-bounce" : ""}`}>
                <div className="bg-[#FACC15] p-6 rounded-full shadow-xl">
                  <Upload className="w-12 h-12 text-black font-bold" />
                </div>
                {isDragOver && (
                  <div className="absolute inset-0 bg-[#FACC15] rounded-full animate-ping opacity-75"></div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-2xl font-bold text-[#FACC15] font-serif">
                  {isDragOver ? "Drop it like it's hot! 🔥" : "Drop your traffic sign here"}
                </p>
                <p className="text-lg text-[#F8FAFC] font-medium">or click to browse your files</p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-[#94A3B8] bg-[#0F172A]/80 rounded-full px-6 py-3 border border-[#FACC15]/30">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-[#FACC15]" />
                  <span className="font-medium">PNG, JPG, JPEG</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-[#FACC15]" />
                  <span className="font-medium">Up to 10MB</span>
                </div>
              </div>

              <div className="flex space-x-4 text-3xl">
                <span className="animate-bounce">🛑</span>
                <span className="animate-bounce animation-delay-200">⚠️</span>
                <span className="animate-bounce animation-delay-400">🚸</span>
                <span className="animate-bounce animation-delay-600">🚧</span>
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
