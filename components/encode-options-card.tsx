"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Shield, Key } from "lucide-react"

interface EncodeOptionsCardProps {
  options: {
    forceEncode: boolean
    useSignature: boolean
    customKey: string
  }
  onOptionsChange: (options: any) => void
}

export function EncodeOptionsCard({ options, onOptionsChange }: EncodeOptionsCardProps) {
  const updateOption = (key: string, value: any) => {
    onOptionsChange({ ...options, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Options d'encodage avancées
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Forcer l'encodage même si risque
            </Label>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Permet l'encodage même si la capacité est critique
            </p>
          </div>
          <Switch checked={options.forceEncode} onCheckedChange={(checked) => updateOption("forceEncode", checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Générer une signature de vérification
            </Label>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ajoute une signature pour vérifier l'intégrité du message
            </p>
          </div>
          <Switch checked={options.useSignature} onCheckedChange={(checked) => updateOption("useSignature", checked)} />
        </div>

        {options.useSignature && (
          <div className="space-y-2 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
            <Label htmlFor="customKey" className="text-sm">
              Mot-clé personnalisé (facultatif)
            </Label>
            <Input
              id="customKey"
              placeholder="Entrez votre clé secrète..."
              value={options.customKey}
              onChange={(e) => updateOption("customKey", e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Laissez vide pour utiliser une signature automatique
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
