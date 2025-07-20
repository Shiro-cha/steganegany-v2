"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

interface CapacityBarAnalyzerProps {
  imageDimensions: { width: number; height: number } | null
  messageLength: number
}

export function CapacityBarAnalyzer({ imageDimensions, messageLength }: CapacityBarAnalyzerProps) {
  if (!imageDimensions) return null

  const maxCapacity = Math.floor((imageDimensions.width * imageDimensions.height * 3) / 8)
  const usageRatio = (messageLength / maxCapacity) * 100

  const getStatusInfo = () => {
    if (usageRatio < 60) {
      return {
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-500",
        icon: CheckCircle,
        status: "Safe",
        message: "Cette image est suffisante pour cacher ce message sans altération.",
      }
    } else if (usageRatio < 90) {
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-500",
        icon: AlertCircle,
        status: "Moyen",
        message: "L'encodage est possible mais pourrait être détectable par analyse.",
      }
    } else {
      return {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-500",
        icon: AlertTriangle,
        status: "Critique",
        message: "⚠️ Cette image est petite, l'encodage pourrait dégrader le message caché. Continuez avec précaution.",
      }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analyse de capacité d'encodage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{maxCapacity.toLocaleString()}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Caractères supportés</div>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              {messageLength.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Caractères du message</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Utilisation de la capacité</span>
            <Badge variant="outline" className={statusInfo.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.status}
            </Badge>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Progress
              value={Math.min(usageRatio, 100)}
              className="h-3"
              style={
                {
                  "--progress-background": statusInfo.bgColor,
                } as React.CSSProperties
              }
            />
          </motion.div>

          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>0%</span>
            <span className="font-medium">{usageRatio.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-3 rounded-lg border-l-4 ${
            usageRatio < 60
              ? "bg-green-50 dark:bg-green-950/20 border-green-500"
              : usageRatio < 90
                ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500"
                : "bg-red-50 dark:bg-red-950/20 border-red-500"
          }`}
        >
          <p className="text-sm">{statusInfo.message}</p>
        </motion.div>
      </CardContent>
    </Card>
  )
}
