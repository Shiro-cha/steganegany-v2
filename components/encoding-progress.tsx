"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Shield, CheckCircle } from "lucide-react"

interface EncodingProgressProps {
  isEncoding: boolean
  progress: number
}

export function EncodingProgress({ isEncoding, progress }: EncodingProgressProps) {
  if (!isEncoding) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Encodage en cours...</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Votre message est en train d'être caché dans l'image
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-slate-500">{progress}% terminé</p>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-center gap-2">
              {progress > 25 && <CheckCircle className="w-3 h-3 text-green-500" />}
              <span className={progress > 25 ? "text-green-600" : ""}>Analyse de l'image</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {progress > 50 && <CheckCircle className="w-3 h-3 text-green-500" />}
              <span className={progress > 50 ? "text-green-600" : ""}>Préparation du message</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {progress > 75 && <CheckCircle className="w-3 h-3 text-green-500" />}
              <span className={progress > 75 ? "text-green-600" : ""}>Encodage LSB</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {progress >= 100 && <CheckCircle className="w-3 h-3 text-green-500" />}
              <span className={progress >= 100 ? "text-green-600" : ""}>Finalisation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
