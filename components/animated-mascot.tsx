"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface AnimatedMascotProps {
  uploadedImage?: File | null
  message?: string
  encodedImage?: string
  decodedMessage?: string
  mode?: "encode" | "decode"
}

export function AnimatedMascot({
  uploadedImage,
  message,
  encodedImage,
  decodedMessage,
  mode = "encode",
}: AnimatedMascotProps) {
  const [currentTip, setCurrentTip] = useState("")
  const [mascotState, setMascotState] = useState<"idle" | "thinking" | "excited" | "working">("idle")

  // Modifier les tips pour être plus clairs sur les actions
  const encodeTips = [
    "Salut ! Je suis ton assistant stéganographie 🤖",
    "Upload une image pour commencer l'aventure !",
    "Super image ! Maintenant écris ton message secret ✨",
    "Parfait ! Clique sur le gros bouton bleu pour encoder ! 🚀",
    "Génial ! Ton message est maintenant invisible dans l'image ! 🥷",
    "N'oublie pas de télécharger ton image encodée ! 📸",
  ]

  const decodeTips = [
    "Mode détective activé ! 🕵️‍♂️",
    "Glisse ton image PNG mystérieuse ici !",
    "Super ! Ton image est prête pour le décodage ! 🔍",
    "Je scanne les pixels secrets... 🔍",
    "Message trouvé ! Tu es un vrai décodeur ! 🎯",
  ]

  useEffect(() => {
    if (mode === "encode") {
      if (encodedImage) {
        setCurrentTip(encodeTips[4])
        setMascotState("excited")
      } else if (uploadedImage && message) {
        setCurrentTip(encodeTips[3]) // Message pour cliquer sur le bouton
        setMascotState("thinking")
      } else if (message) {
        setCurrentTip(encodeTips[2])
        setMascotState("working")
      } else if (uploadedImage) {
        setCurrentTip(encodeTips[1])
        setMascotState("working")
      } else {
        setCurrentTip(encodeTips[0])
        setMascotState("idle")
      }
    } else {
      if (decodedMessage) {
        setCurrentTip(decodeTips[4])
        setMascotState("excited")
      } else if (uploadedImage) {
        setCurrentTip(decodeTips[2]) // Image uploadée avec succès
        setMascotState("thinking")
      } else {
        setCurrentTip(decodeTips[1])
        setMascotState("idle")
      }
    }
  }, [uploadedImage, message, encodedImage, decodedMessage, mode])

  const getBlobColor = () => {
    switch (mascotState) {
      case "excited":
        return "from-green-400 to-emerald-500"
      case "thinking":
        return "from-purple-400 to-pink-500"
      case "working":
        return "from-blue-400 to-indigo-500"
      default:
        return "from-slate-400 to-slate-500"
    }
  }

  const getBlobAnimation = () => {
    switch (mascotState) {
      case "excited":
        return { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
      case "thinking":
        return { scale: [1, 0.95, 1.05, 1] }
      case "working":
        return { rotate: [0, 360] }
      default:
        return { y: [0, -5, 0] }
    }
  }

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 text-center">
        <motion.div
          className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${getBlobColor()} flex items-center justify-center`}
          animate={getBlobAnimation()}
          transition={{
            duration: mascotState === "working" ? 2 : 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="text-2xl"
            animate={{ rotate: mascotState === "thinking" ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          >
            {mascotState === "excited"
              ? "🎉"
              : mascotState === "thinking"
                ? "🤔"
                : mascotState === "working"
                  ? "⚡"
                  : "🤖"}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm"
          >
            {currentTip}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"
              animate={{
                scale: mascotState === "working" ? [1, 1.5, 1] : 1,
                opacity: mascotState === "working" ? [0.5, 1, 0.5] : 0.5,
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
