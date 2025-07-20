"use client"

import { Label } from "@/components/ui/label"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Eye, AlertCircle, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

interface ResultPreviewCardProps {
  encodedImage: string
  originalImage: string
  onReset?: () => void
}

export function ResultPreviewCard({ encodedImage, originalImage, onReset }: ResultPreviewCardProps) {
  const generateEncodedPreview = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() < 0.1) {
            data[i] = data[i] ^ 1
            data[i + 1] = data[i + 1] ^ 1
            data[i + 2] = data[i + 2] ^ 1
          }
        }

        ctx.putImageData(imageData, 0, 0)
      }

      return canvas.toDataURL("image/png")
    }

    img.src = originalImage
    return originalImage 
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = encodedImage
    link.download = "stega-encoded-image.png"
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Image encodée StegaVault",
          text: "Image avec message caché généré par StegaVault",
        })
      } catch (err) {
        console.log("Partage annulé")
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Aperçu du résultat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image originale</Label>
            <div className="relative">
              <img src={originalImage || "/placeholder.svg"} alt="Original" className="w-full rounded-lg border" />
              <Badge className="absolute top-2 left-2 bg-slate-600">Original</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Image encodée</Label>
            <div className="relative">
              <img src={encodedImage || originalImage} alt="Encoded" className="w-full rounded-lg border" />
              <Badge className="absolute top-2 left-2 bg-green-600">Encodée</Badge>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Message caché avec succès !</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Ne compressez pas l'image pour garder le message intact.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-3">
          <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger l'image encodée
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={handleShare} className="px-4 bg-transparent">
              <Share2 className="w-4 h-4" />
            </Button>
          </motion.div>

          {onReset && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={onReset} className="px-4 bg-transparent">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <strong>Important :</strong> Évitez de compresser ou redimensionner l'image pour préserver le message
              caché.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
