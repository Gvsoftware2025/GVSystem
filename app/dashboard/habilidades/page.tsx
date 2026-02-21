"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, X, Loader2, Zap, AlertTriangle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Skill {
  id: string
  name: string
  category: string
  icon: string
  color: string
  display_order: number
}

const categories = ["frontend", "backend", "database", "devops", "mobile", "tools", "design"]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ name: "", category: "frontend", icon: "", color: "#7c3aed" })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; skill: Skill | null }>({ isOpen: false, skill: null })
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const fetchSkills = async () => {
    const { data } = await supabase.from("portfolio_skills").select("*").order("category").order("display_order")
    setSkills(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSkills()
    const channel = supabase
      .channel("portfolio_skills-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_skills" }, fetchSkills)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill)
      setFormData({ name: skill.name, category: skill.category, icon: skill.icon || "", color: skill.color || "#7c3aed" })
    } else {
      setEditingSkill(null)
      setFormData({ name: "", category: "frontend", icon: "", color: "#7c3aed" })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    if (editingSkill) {
      const { error } = await supabase.from("portfolio_skills").update(formData).eq("id", editingSkill.id)
      if (error) { alert("Erro: " + error.message); setIsSaving(false); return }
    } else {
      const { error } = await supabase.from("portfolio_skills").insert({ ...formData, display_order: skills.length })
      if (error) { alert("Erro: " + error.message); setIsSaving(false); return }
    }
    setIsSaving(false)
    setIsModalOpen(false)
    fetchSkills()
  }

  const handleDelete = async () => {
    if (!deleteModal.skill) return
    setIsDeleting(true)
    const { error } = await supabase.from("portfolio_skills").delete().eq("id", deleteModal.skill.id)
    if (error) alert("Erro: " + error.message)
    else fetchSkills()
    setIsDeleting(false)
    setDeleteModal({ isOpen: false, skill: null })
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Habilidades</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas tecnologias</p>
          </div>
        </div>
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Nova Habilidade
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" />
        </div>
      ) : Object.keys(groupedSkills).length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up stagger-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
            <Zap className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhuma habilidade ainda</h3>
          <p className="text-sm text-muted-foreground mb-5">Comece adicionando suas tecnologias</p>
          <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Habilidade
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <div
              key={category}
              className="glass-card rounded-xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 60}ms` }}
            >
              <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground capitalize">{category}</h3>
                <span className="text-[10px] text-muted-foreground bg-secondary rounded-md px-1.5 py-0.5">{categorySkills.length}</span>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/70 border border-border hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: skill.color }} />
                      <span className="text-sm text-foreground whitespace-nowrap">{skill.name}</span>
                      <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(skill)} className="p-1 rounded hover:bg-primary/10 hover:text-primary transition-colors"><Pencil className="w-3 h-3" /></button>
                        <button onClick={() => setDeleteModal({ isOpen: true, skill })} className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-foreground text-base">{editingSkill ? "Editar Habilidade" : "Nova Habilidade"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8"><X className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Nome</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="React, Node.js, etc." className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Categoria</Label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none">
                      {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cor</Label>
                    <div className="flex gap-3">
                      <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer border-0" />
                      <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="bg-secondary border-border" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving || !formData.name} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={deleteModal.isOpen} onOpenChange={(open) => !open && setDeleteModal({ isOpen: false, skill: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
              <AlertDialogTitle className="text-foreground">Excluir habilidade</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir <span className="font-medium text-foreground">{deleteModal.skill?.name}</span>? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-muted">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
