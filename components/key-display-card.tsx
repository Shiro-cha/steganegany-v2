"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, Copy, Eye, EyeOff, Info } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface KeyDisplayCardProps {
  generatedKey: string
  onClose: () => void
}

export function KeyDisplayCard({ generatedKey, onClose }: KeyDisplayCardProps) {
  const [showKey, setShowKey] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey)
  }

  // Décoder la clé pour l'explication
  const keyParts = generatedKey.split(",")
  const keyExplanation = [
    { label: "Taille du message", value: keyParts[0] + " caractères", position: "Position 0 (paire)" },
    { label: "Offset de départ", value: "Pixel " + keyParts[1], position: "Position 1 (impaire)" },
    { label: "Pas entre pixels", value: "Tous les " + keyParts[2] + " pixels", position: "Position 2 (paire)" },
    {
      label: "Canal couleur",
      value: keyParts[3] === "0" ? "Rouge (R)" : keyParts[3] === "1" ? "Vert (G)" : "Bleu (B)",
      position: "Position 3 (impaire)",
    },
    { label: "Checksum", value: keyParts[4], position: "Position 4 (paire)" },
    { label: "Timestamp", value: keyParts[5], position: "Position 5 (impaire)" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Key className="w-5 h-5" />
              Clé d'encodage générée
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-green-200/50 dark:border-green-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Clé de décodage :</span>
              <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)} className="h-6 px-2 text-xs">
                {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
            </div>

            <div className="font-mono text-sm bg-slate-100 dark:bg-slate-700 p-2 rounded border">
              {showKey ? generatedKey : "••••••••••••••••••••••••••••••••"}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
              Clé sécurisée générée
            </Badge>

            <div className="flex gap-2">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" onClick={copyKey} className="h-8 bg-transparent">
                  <Copy className="w-3 h-3 mr-1" />
                  Copier
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="h-8 bg-transparent"
                >
                  <Info className="w-3 h-3 mr-1" />
                  Détails
                </Button>
              </motion.div>
            </div>
          </div>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-green-200 dark:border-green-800 pt-4"
            >
              <h4 className="text-sm font-semibold mb-3 text-green-800 dark:text-green-200">Composition de la clé :</h4>
              <div className="space-y-2">
                {keyExplanation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {index}
                      </Badge>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Système de clé :</strong> Les positions paires (0,2,4...) contiennent les paramètres de taille
                  et validation, les positions impaires (1,3,5...) contiennent les paramètres de position et méthode
                  d'encodage.
                </p>
              </div>
            </motion.div>
          )}

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Key className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Important :</strong> Conservez cette clé précieusement ! Elle est nécessaire pour décoder le
                  message caché dans l'image.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
