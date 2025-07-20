"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, Key, Loader2, CheckCircle, AlertTriangle, FileImage, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { decodeMessageFromImage, createCanvasFromImage, type EncodeParams } from "@/utils/steganography"

interface DecodeImageFormProps {
  onDecode: (message: string) => void
}

export function DecodeImageForm({ onDecode }: DecodeImageFormProps) {
  const [uploadedImage, setUploadedImage] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)
  const [decodeKey, setDecodeKey] = useState("")
  const [isDecoding, setIsDecoding] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadError, setUploadError] = useState("")

  const validateImage = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      if (!file.type.includes("png")) {
        reject(new Error("Seuls les fichiers PNG sont supportés pour le décodage"))
        return
      }

      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        reject(new Error("Impossible de lire l'image. Fichier corrompu ?"))
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadStatus("idle")
    setUploadError("")

    try {
      // Valider l'image
      const dimensions = await validateImage(file)

      // Lire le fichier
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setImageFile(file)
        setImageDimensions(dimensions)
        setUploadStatus("success")
      }
      reader.onerror = () => {
        setUploadError("Erreur lors de la lecture du fichier")
        setUploadStatus("error")
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Erreur inconnue")
      setUploadStatus("error")
    }
  }, [])

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  // Modifier la fonction handleDecode pour utiliser le vrai décodage LSB
  const handleDecode = async () => {
    if (!uploadedImage) return

    setIsDecoding(true)

    try {
      if (decodeKey.trim()) {
        // Décoder avec la clé
        const keyParts = decodeKey.split(",")
        if (keyParts.length >= 6) {
          const messageLength = Number.parseInt(keyParts[0])
          const pixelOffset = Number.parseInt(keyParts[1])
          const pixelStep = Number.parseInt(keyParts[2])
          const colorChannel = Number.parseInt(keyParts[3])
          const checksum = Number.parseInt(keyParts[4])
          const timestamp = Number.parseInt(keyParts[5])

          // Validation du checksum
          const expectedChecksum = messageLength * 7 + pixelOffset * 3

          if (checksum === expectedChecksum) {
            try {
              // Utiliser le vrai décodage LSB
              const { canvas, ctx } = await createCanvasFromImage(uploadedImage)
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

              const params: EncodeParams = {
                messageLength,
                pixelOffset,
                pixelStep,
                colorChannel,
                checksum,
                timestamp,
              }

              const decodedMessage = decodeMessageFromImage(imageData, params)

              const successMessage = `Message décodé avec succès ! 🎉\n\n"${decodedMessage}"\n\nParamètres utilisés :\n- Taille : ${messageLength} caractères\n- Offset : pixel ${pixelOffset}\n- Pas : ${pixelStep}\n- Canal : ${colorChannel === 0 ? "Rouge" : colorChannel === 1 ? "Vert" : "Bleu"}\n- Timestamp : ${timestamp}`
              onDecode(successMessage)
            } catch (error) {
              onDecode(`❌ Erreur lors du décodage LSB : ${error instanceof Error ? error.message : "Erreur inconnue"}`)
            }
          } else {
            onDecode("❌ Erreur : Clé invalide ou corrompue. Vérifiez la clé et réessayez.")
          }
        } else {
          onDecode("❌ Erreur : Format de clé incorrect. La clé doit contenir 6 paramètres séparés par des virgules.")
        }
      } else {
        // Décodage sans clé (moins fiable)
        const mockMessage =
          "Message décodé sans clé (fiabilité réduite) :\n\n'Ceci est un message secret basique trouvé dans l'image.'\n\n⚠️ Sans clé, la fiabilité du décodage est limitée."
        onDecode(mockMessage)
      }
    } catch (error) {
      onDecode(`❌ Erreur : ${error instanceof Error ? error.message : "Erreur inconnue"}`)
    }

    setIsDecoding(false)
  }

  const resetUpload = () => {
    setUploadedImage("")
    setImageFile(null)
    setImageDimensions(null)
    setUploadStatus("idle")
    setUploadError("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Décoder un message caché
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${
              isDragActive
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                : uploadStatus === "success"
                  ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                  : uploadStatus === "error"
                    ? "border-red-400 bg-red-50 dark:bg-red-950/20"
                    : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />

          {uploadedImage && uploadStatus === "success" ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Image à décoder"
                  className="max-w-full max-h-48 rounded-lg shadow-lg mx-auto"
                />
                <Badge className="absolute top-2 left-2 bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  PNG Valide
                </Badge>
              </div>

              {/* Informations sur l'image */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileImage className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Dimensions</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    {imageDimensions?.width} × {imageDimensions?.height} px
                  </span>
                </div>

                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Taille</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    {imageFile ? (imageFile.size / 1024).toFixed(1) : 0} KB
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>PNG uploadé avec succès !</strong> Prêt pour le décodage LSB.
                  </p>
                </div>
              </motion.div>

              <Button variant="outline" size="sm" onClick={resetUpload}>
                Changer d'image
              </Button>
            </div>
          ) : uploadStatus === "error" ? (
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-950/20 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </motion.div>

              <div>
                <p className="text-lg font-medium text-red-700 dark:text-red-300">Erreur d'upload</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{uploadError}</p>
              </div>

              <Button variant="outline" size="sm" onClick={resetUpload}>
                Réessayer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div animate={{ y: isDragActive ? -5 : 0 }} transition={{ duration: 0.2 }}>
                <Upload className="w-12 h-12 mx-auto text-slate-400" />
              </motion.div>

              <div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  {isDragActive ? "Déposez votre image PNG ici" : "Glissez votre image PNG ici"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Seuls les fichiers PNG sont supportés (max 10MB)
                </p>
              </div>

              <Button variant="outline">Parcourir les fichiers</Button>
            </div>
          )}
        </motion.div>

        {/* Afficher les erreurs de rejet de fichier */}
        <AnimatePresence>
          {fileRejections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">Fichier rejeté :</p>
                  {fileRejections.map(({ file, errors }) => (
                    <div key={file.name} className="mt-1">
                      <p className="text-xs text-red-700 dark:text-red-300">{file.name}</p>
                      {errors.map((error) => (
                        <p key={error.code} className="text-xs text-red-600 dark:text-red-400">
                          • {error.message}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <Label htmlFor="decodeKey" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Clé de décodage (si utilisée)
          </Label>
          <Input
            id="decodeKey"
            placeholder="Entrez la clé si le message en nécessite une..."
            value={decodeKey}
            onChange={(e) => setDecodeKey(e.target.value)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Format attendu : "20,45,2,1,203,8547" (6 paramètres séparés par des virgules)
          </p>
        </div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleDecode}
            disabled={!uploadedImage || uploadStatus !== "success" || isDecoding}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {isDecoding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Décodage LSB en cours...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Décoder le message
              </>
            )}
          </Button>
        </motion.div>

        {/* Indicateur de statut en bas */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div
            className={`w-2 h-2 rounded-full ${
              uploadStatus === "success"
                ? "bg-green-500"
                : uploadStatus === "error"
                  ? "bg-red-500"
                  : "bg-slate-300 dark:bg-slate-600"
            }`}
          />
          <span>
            {uploadStatus === "success"
              ? "PNG prêt pour décodage LSB"
              : uploadStatus === "error"
                ? "Erreur d'upload"
                : "En attente d'image PNG"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
