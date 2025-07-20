"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, Loader2, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { generateContentWithGemini } from "@/utils/gemini"

interface MessageEditorWithAIProps {
  message: string
  onMessageChange: (message: string) => void
  onGeminiResponse: (response: string) => void
}

export function MessageEditorWithAI({ message, onMessageChange, onGeminiResponse }: MessageEditorWithAIProps) {
  const [aiStyle, setAiStyle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [geminiError, setGeminiError] = useState(false)

  const aiStyles = [
    { value: "meme", label: "Punchline de meme", emoji: "😂" },
    { value: "poetic", label: "Poétique", emoji: "🌸" },
    { value: "romantic", label: "Romantique", emoji: "💕" },
    { value: "professional", label: "Excuse professionnelle", emoji: "💼" },
    { value: "sarcastic", label: "Sarcastique", emoji: "😏" },
  ]

  const handleGenerateWithGemini = async () => {
    if (!aiStyle || !message.trim()) return

    setIsGenerating(true)
    setGeminiError(false)

    try {
      const generatedMessage = await generateContentWithGemini(message, aiStyle)
      onGeminiResponse(generatedMessage)
    } catch (error) {
      console.error("Erreur Gemini:", error)
      setGeminiError(true)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Message à encoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Tapez votre message secret ici..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {message.length} caractères
          </Badge>

          {message.length > 1000 && (
            <Badge variant="destructive" className="text-xs">
              Message très long
            </Badge>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Améliorer avec Gemini AI</span>
          </div>

          <div className="flex gap-2">
            <Select value={aiStyle} onValueChange={setAiStyle}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choisir un style..." />
              </SelectTrigger>
              <SelectContent>
                {aiStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    <span className="flex items-center gap-2">
                      <span>{style.emoji}</span>
                      {style.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGenerateWithGemini}
                disabled={!aiStyle || !message.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
        {geminiError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Problème avec Gemini</strong>
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Vérifiez votre clé API ou réessayez plus tard.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}