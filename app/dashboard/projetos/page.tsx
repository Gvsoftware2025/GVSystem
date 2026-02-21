"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Github,
  FolderKanban,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  project_url: string
  github_url: string
  technologies: string[]
  is_featured: boolean
  display_order: number
  created_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    github_url: "",
    technologies: "",
    is_featured: false,
    display_order: 0,
  })
  const supabase = createClient()

  const fetchProjects = async () => {
    const { data } = await supabase.from("portfolio_projects").select("*").order("display_order", { ascending: true })
    setProjects(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProjects()
    const channel = supabase
      .channel("portfolio_projects-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_projects" }, fetchProjects)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        image_url: project.image_url || "",
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        technologies: project.technologies?.join(", ") || "",
        is_featured: project.is_featured,
        display_order: project.display_order || 0,
      })
    } else {
      setEditingProject(null)
      setFormData({ title: "", description: "", image_url: "", project_url: "", github_url: "", technologies: "", is_featured: false, display_order: projects.length })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const projectData = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      project_url: formData.project_url,
      github_url: formData.github_url,
      technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      is_featured: formData.is_featured,
      display_order: formData.display_order,
    }

    let error
    if (editingProject) {
      const result = await supabase.from("portfolio_projects").update(projectData).eq("id", editingProject.id)
      error = result.error
    } else {
      const result = await supabase.from("portfolio_projects").insert(projectData)
      error = result.error
    }

    if (error) {
      alert(`Erro ao salvar: ${error.message}`)
    } else {
      await fetchProjects()
      setIsModalOpen(false)
    }
    setIsSaving(false)
  }

  const openDeleteModal = (project: Project) => {
    setProjectToDelete(project)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", projectToDelete.id)
    if (error) alert(`Erro ao excluir: ${error.message}`)
    else await fetchProjects()
    setIsDeleting(false)
    setDeleteModalOpen(false)
    setProjectToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Projetos</h1>
            <p className="text-sm text-muted-foreground">Gerencie os projetos do portfolio</p>
          </div>
        </div>
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Novo Projeto
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up stagger-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
            <FolderKanban className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum projeto ainda</h3>
          <p className="text-sm text-muted-foreground mb-5">Comece adicionando seu primeiro projeto</p>
          <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Projeto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="glass-card rounded-xl overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {project.image_url && (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={project.image_url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.is_featured && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Destaque
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
                  <div className="flex gap-0.5 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openModal(project)} className="h-7 w-7 hover:bg-primary/10 hover:text-primary">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteModal(project)} className="h-7 w-7 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies?.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/10">{tech}</Badge>
                  ))}
                  {project.technologies?.length > 4 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{project.technologies.length - 4}</Badge>
                  )}
                </div>
                <div className="flex gap-3">
                  {project.project_url && (
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-xs flex items-center gap-1 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Ver projeto
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors">
                      <Github className="w-3 h-3" /> GitHub
                    </a>
                  )}
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
              <Card className="w-full max-w-lg bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-foreground text-base">{editingProject ? "Editar Projeto" : "Novo Projeto"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8"><X className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Titulo</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Descricao</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-secondary border-border min-h-[100px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">URL da Imagem</Label>
                    <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">URL do Projeto</Label>
                      <Input value={formData.project_url} onChange={(e) => setFormData({ ...formData, project_url: e.target.value })} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">URL do GitHub</Label>
                      <Input value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} className="bg-secondary border-border" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Tecnologias (separadas por virgula)</Label>
                    <Input value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, Node.js, TypeScript" className="bg-secondary border-border" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm text-foreground">Projeto em destaque</Label>
                      <p className="text-[11px] text-muted-foreground">Aparece com destaque na home</p>
                    </div>
                    <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving || !formData.title} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
              <AlertDialogTitle className="text-foreground">Excluir Projeto</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir <span className="text-foreground font-medium">"{projectToDelete?.title}"</span>? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-muted">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Excluindo...</> : <><Trash2 className="w-4 h-4 mr-2" />Excluir</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
