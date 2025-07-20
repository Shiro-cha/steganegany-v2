"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface UploadImageCardProps {
  onImageUpload: (file: File, preview: string, dimensions: { width: number; height: number }) => void
  imageDimensions: { width: number; height: number } | null
}

export function UploadImageCard({ onImageUpload, imageDimensions }: UploadImageCardProps) {
  const [preview, setPreview] = useState<string>("")
  const [isDragActive, setIsDragActive] = useState(false)
  const [isConverted, setIsConverted] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            ctx?.drawImage(img, 0, 0)

            const previewUrl = e.target?.result as string
            setPreview(previewUrl)
            setIsConverted(file.type !== "image/png")

            onImageUpload(file, previewUrl, { width: img.width, height: img.height })
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageUpload],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Upload de l'image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${
              isDragActive
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />

          {preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-48 rounded-lg shadow-lg"
                />
                {isConverted && <Badge className="absolute -top-2 -right-2 bg-orange-500">Convertie auto</Badge>}
              </div>

              {imageDimensions && (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {imageDimensions.width} × {imageDimensions.height} px
                  </span>
                </div>
              )}

              <Button variant="outline" size="sm">
                Changer d'image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div animate={{ y: isDragActive ? -5 : 0 }} transition={{ duration: 0.2 }}>
                <Upload className="w-12 h-12 mx-auto text-slate-400" />
              </motion.div>

              <div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  {isDragActive ? "Déposez votre image ici" : "Glissez votre image ici"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, WEBP jusqu'à 10MB</p>
              </div>

              <Button variant="outline">Parcourir les fichiers</Button>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
