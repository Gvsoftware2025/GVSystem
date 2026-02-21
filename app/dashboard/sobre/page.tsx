"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Save, User, Loader2 } from "lucide-react"

export default function SobrePage() {
  const [sobre, setSobre] = useState({
    id: "",
    title: "",
    description: "",
    projects_count: 0,
    clients_count: 0,
    years_experience: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAboutInfo()
  }, [])

  async function fetchAboutInfo() {
    setLoading(true)
    try {
      const response = await fetch("/api/about")
      const data = await response.json()
      if (!data.error) {
        setSobre({
          id: data.id || "",
          title: data.title || "",
          description: data.description || "",
          projects_count: data.projects_count || 0,
          clients_count: data.clients_count || 0,
          years_experience: data.years_experience || 0,
        })
      }
    } catch {}
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sobre),
      })
      const result = await response.json()
      if (result.error) {
        alert("Erro ao salvar: " + result.error)
      } else {
        alert("Dados salvos com sucesso!")
        await fetchAboutInfo()
      }
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <User className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Sobre</h1>
          <p className="text-sm text-muted-foreground">Edite as informacoes da empresa</p>
        </div>
      </div>

      {/* Company Info */}
      <div className="glass-card rounded-xl p-5 space-y-4 animate-fade-in-up stagger-1">
        <h2 className="text-sm font-semibold text-foreground">Informacoes da Empresa</h2>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Titulo</Label>
          <Input
            value={sobre.title}
            onChange={(e) => setSobre({ ...sobre, title: e.target.value })}
            placeholder="Nome da empresa"
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Descricao</Label>
          <Textarea
            value={sobre.description}
            onChange={(e) => setSobre({ ...sobre, description: e.target.value })}
            placeholder="Descricao da empresa..."
            rows={4}
            className="bg-secondary border-border"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="glass-card rounded-xl p-5 space-y-4 animate-fade-in-up stagger-2">
        <h2 className="text-sm font-semibold text-foreground">Estatisticas (exibidas no site)</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Projetos Realizados</Label>
            <Input
              type="number"
              value={sobre.projects_count}
              onChange={(e) => setSobre({ ...sobre, projects_count: parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Clientes Atendidos</Label>
            <Input
              type="number"
              value={sobre.clients_count}
              onChange={(e) => setSobre({ ...sobre, clients_count: parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Anos de Experiencia</Label>
            <Input
              type="number"
              value={sobre.years_experience}
              onChange={(e) => setSobre({ ...sobre, years_experience: parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-dashed border-primary/20 bg-primary/[0.02] p-5 space-y-4 animate-fade-in-up stagger-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Preview</h3>
          <p className="text-xs text-muted-foreground">Como aparecera no site</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Projetos", value: sobre.projects_count, color: "text-primary" },
            { label: "Clientes", value: sobre.clients_count, color: "text-blue-400" },
            { label: "Anos", value: sobre.years_experience, color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-lg p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}+</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="animate-fade-in-up stagger-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-sm font-medium"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
          ) : (
            <><Save className="w-4 h-4 mr-2" />Salvar Alteracoes</>
          )}
        </Button>
      </div>
    </div>
  )
}
