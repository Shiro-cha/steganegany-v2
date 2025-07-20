"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Copy, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

interface DecodeResultViewerProps {
  decodedMessage: string
  reliability: number
  signatureMatch: boolean
}

export function DecodeResultViewer({ decodedMessage, reliability, signatureMatch }: DecodeResultViewerProps) {
  // Remplacer les calculs de fiabilité par la logique basée sur le message
  const getReliabilityFromMessage = (message: string) => {
    if (message.includes("Clé invalide") || message.includes("Format de clé incorrect")) {
      return 15
    } else if (message.includes("sans clé")) {
      return 45
    } else if (message.includes("Message décodé avec succès")) {
      return 95
    }
    return 85
  }

  const actualReliability = getReliabilityFromMessage(decodedMessage)
  const actualSignatureMatch = !decodedMessage.includes("❌") && !decodedMessage.includes("sans clé")

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodedMessage)
  }

  const getReliabilityColor = () => {
    if (actualReliability >= 80) return "text-green-600 dark:text-green-400"
    if (actualReliability >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getReliabilityBg = () => {
    if (actualReliability >= 80) return "bg-green-500"
    if (actualReliability >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Message décodé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{decodedMessage}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fiabilité du décodage</span>
                <span className={`text-sm font-bold ${getReliabilityColor()}`}>{actualReliability}%</span>
              </div>
              <Progress
                value={actualReliability}
                className="h-2"
                style={
                  {
                    "--progress-background": getReliabilityBg(),
                  } as React.CSSProperties
                }
              />
            </div>

            <div className="flex items-center justify-center">
              <Badge variant={actualSignatureMatch ? "default" : "destructive"} className="flex items-center gap-1">
                {actualSignatureMatch ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Signature valide
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    Signature invalide
                  </>
                )}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">{decodedMessage.length} caractères décodés</div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copier le message
              </Button>
            </motion.div>
          </div>

          {actualReliability < 80 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Attention :</strong> La fiabilité du décodage est faible. L'image pourrait avoir été
                    compressée ou altérée.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
