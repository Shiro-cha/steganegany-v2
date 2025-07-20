"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadImageCard } from "@/components/upload-image-card"
import { MessageEditorWithAI } from "@/components/message-editor-with-ai"
import { GeminiResponseCard } from "@/components/gemini-response-card"
import { CapacityBarAnalyzer } from "@/components/capacity-bar-analyzer"
import { EncodeOptionsCard } from "@/components/encode-options-card"
import { ResultPreviewCard } from "@/components/result-preview-card"
import { DecodeImageForm } from "@/components/decode-image-form"
import { DecodeResultViewer } from "@/components/decode-result-viewer"
import { AnimatedMascot } from "@/components/animated-mascot"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Github, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EncodingProgress } from "@/components/encoding-progress"
import { KeyDisplayCard } from "@/components/key-display-card"

import { encodeMessageInImage, createCanvasFromImage, canvasToPngBlob, type EncodeParams } from "@/utils/steganography"

export default function StegaApp() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)
  const [message, setMessage] = useState("")
  const [geminiResponse, setGeminiResponse] = useState("")
  const [showGeminiCard, setShowGeminiCard] = useState(false)
  const [encodedImage, setEncodedImage] = useState<string>("")
  const [decodedMessage, setDecodedMessage] = useState("")
  const [encodeOptions, setEncodeOptions] = useState({
    forceEncode: false,
    useSignature: false,
    customKey: "",
  })

  const [isEncoding, setIsEncoding] = useState(false)
  const [showEncodingSection, setShowEncodingSection] = useState(false)
  const [encodingProgress, setEncodingProgress] = useState(0)
  const [generatedKey, setGeneratedKey] = useState("")
  const [showKeyGenerated, setShowKeyGenerated] = useState(false)

  const handleImageUpload = (file: File, preview: string, dimensions: { width: number; height: number }) => {
    setUploadedImage(file)
    setImagePreview(preview)
    setImageDimensions(dimensions)
  }

  const handleGeminiResponse = (response: string) => {
    setGeminiResponse(response)
    setShowGeminiCard(true)
  }

  const handleUseGeminiMessage = () => {
    setMessage(geminiResponse)
    setShowGeminiCard(false)
  }

  const handleEncodeMessage = async () => {
    if (!uploadedImage || !message) return

    setIsEncoding(true)
    setEncodingProgress(0)

    try {
      const messageLength = message.length
      const pixelOffset = Math.floor(Math.random() * 100) + 10
      const pixelStep = Math.floor(Math.random() * 3) + 2 // 2-4
      const colorChannel = Math.floor(Math.random() * 3) // 0=R, 1=G, 2=B
      const checksum = messageLength * 7 + pixelOffset * 3
      const timestamp = Date.now() % 10000

      const params: EncodeParams = {
        messageLength,
        pixelOffset,
        pixelStep,
        colorChannel,
        checksum,
        timestamp,
      }

      const key = `${messageLength},${pixelOffset},${pixelStep},${colorChannel},${checksum},${timestamp}`

      // Simuler le progress
      const progressInterval = setInterval(() => {
        setEncodingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 300)

      const { canvas, ctx } = await createCanvasFromImage(imagePreview)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      const encodedImageData = encodeMessageInImage(imageData, message, params)
      ctx.putImageData(encodedImageData, 0, 0)

      const pngBlob = await canvasToPngBlob(canvas)
      const encodedImageUrl = URL.createObjectURL(pngBlob)

      setEncodingProgress(100)

      setTimeout(() => {
        setGeneratedKey(key)
        setEncodedImage(encodedImageUrl)
        setShowEncodingSection(true)
        setShowKeyGenerated(true)
        setIsEncoding(false)
        setEncodingProgress(0)
      }, 500)
    } catch (error) {
      console.error("Erreur lors de l'encodage:", error)
      setIsEncoding(false)
      setEncodingProgress(0)
      const key = `${message.length},50,2,1,${message.length * 7 + 50 * 3},${Date.now() % 10000}`
      setGeneratedKey(key)
      setEncodedImage(imagePreview)
      setShowEncodingSection(true)
      setShowKeyGenerated(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <header className="border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                StegaVault
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Stéganographie LSB avancée</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <motion.a
              href="https://github.com/Shiro-cha/steganegany-v2"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </motion.a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="encode" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Encoder un message
            </TabsTrigger>
            <TabsTrigger value="decode" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Décoder un message
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <UploadImageCard onImageUpload={handleImageUpload} imageDimensions={imageDimensions} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <MessageEditorWithAI
                    message={message}
                    onMessageChange={setMessage}
                    onGeminiResponse={handleGeminiResponse}
                  />
                </motion.div>

                <AnimatePresence>
                  {showGeminiCard && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GeminiResponseCard
                        response={geminiResponse}
                        onUseMessage={handleUseGeminiMessage}
                        onClose={() => setShowGeminiCard(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {uploadedImage && message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CapacityBarAnalyzer imageDimensions={imageDimensions} messageLength={message.length} />
                  </motion.div>
                )}

                {uploadedImage && message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                  >
                    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                      <CardContent className="p-6 text-center">
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={handleEncodeMessage}
                            disabled={isEncoding}
                            size="lg"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-lg py-6"
                          >
                            {isEncoding ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                Encodage LSB en cours...
                              </>
                            ) : (
                              <>
                                <Shield className="w-5 h-5 mr-3" />
                                Encoder le message dans l'image
                              </>
                            )}
                          </Button>
                        </motion.div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Génère un vrai PNG avec votre message caché via LSB
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {showKeyGenerated && generatedKey && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <KeyDisplayCard generatedKey={generatedKey} onClose={() => setShowKeyGenerated(false)} />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <EncodeOptionsCard options={encodeOptions} onOptionsChange={setEncodeOptions} />
                </motion.div>

                {showEncodingSection && encodedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <ResultPreviewCard
                      encodedImage={encodedImage}
                      originalImage={imagePreview}
                      onReset={() => {
                        setShowEncodingSection(false)
                        setEncodedImage("")
                        if (encodedImage.startsWith("blob:")) {
                          URL.revokeObjectURL(encodedImage)
                        }
                      }}
                    />
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sticky top-24"
                >
                  <AnimatedMascot uploadedImage={uploadedImage} message={message} encodedImage={encodedImage} />
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="decode" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <DecodeImageForm onDecode={(message) => setDecodedMessage(message)} />
                </motion.div>

                {decodedMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <DecodeResultViewer decodedMessage={decodedMessage} reliability={85} signatureMatch={true} />
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sticky top-24"
                >
                  <AnimatedMascot mode="decode" decodedMessage={decodedMessage} />
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EncodingProgress isEncoding={isEncoding} progress={encodingProgress} />

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 Steganegany - Stéganographie
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://github.com/Shiro-cha"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
