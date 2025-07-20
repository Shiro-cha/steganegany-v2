"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Check, X, Copy } from "lucide-react"
import { motion } from "framer-motion"

interface GeminiResponseCardProps {
  response: string
  onUseMessage: () => void
  onClose: () => void
}

export function GeminiResponseCard({ response, onUseMessage, onClose }: GeminiResponseCardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-5 h-5" />
              Suggestion Gemini AI
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/50">
            <p className="text-sm leading-relaxed">{response}</p>
          </div>

          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
            >
              {response.length} caractères
            </Badge>

            <div className="flex gap-2">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 bg-transparent">
                  <Copy className="w-3 h-3 mr-1" />
                  Copier
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onUseMessage}
                  size="sm"
                  className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Utiliser ce message
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
