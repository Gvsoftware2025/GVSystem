"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, X, Loader2, Store, AlertTriangle, ExternalLink, Phone, MapPin } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"

interface Empresa {
  id: number
  nome: string
  subdominio: string
  telefone: string
  endereco: string
  logo_url: string
  ativo: boolean
  criado_em: string
}

export default function ClientesPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<Empresa | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; empresa: Empresa | null }>({ isOpen: false, empresa: null })
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({ nome: "", subdominio: "", telefone: "", endereco: "", logo_url: "" })

  const fetchEmpresas = async () => {
    try {
      const res = await fetch("/api/clientes")
      const data = await res.json()
      setEmpresas(Array.isArray(data) ? data : [])
    } catch { setEmpresas([]) }
    setIsLoading(false)
  }

  useEffect(() => { fetchEmpresas() }, [])

  const openModal = (empresa?: Empresa) => {
    if (empresa) {
      setEditing(empresa)
      setFormData({ nome: empresa.nome, subdominio: empresa.subdominio, telefone: empresa.telefone || "", endereco: empresa.endereco || "", logo_url: empresa.logo_url || "" })
    } else {
      setEditing(null)
      setFormData({ nome: "", subdominio: "", telefone: "", endereco: "", logo_url: "" })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const body = { ...formData, ...(editing ? { id: editing.id, ativo: editing.ativo } : {}) }
    const res = await fetch("/api/clientes", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const result = await res.json()
    if (result.error) alert("Erro: " + result.error)
    else { await fetchEmpresas(); setIsModalOpen(false) }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteModal.empresa) return
    setIsDeleting(true)
    await fetch("/api/clientes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteModal.empresa.id }) })
    await fetchEmpresas()
    setIsDeleting(false); setDeleteModal({ isOpen: false, empresa: null })
  }

  const toggleAtivo = async (empresa: Empresa) => {
    await fetch("/api/clientes", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...empresa, ativo: !empresa.ativo }) })
    await fetchEmpresas()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center"><Store className="w-5 h-5 text-indigo-400" /></div>
          <div><h1 className="text-2xl font-semibold text-foreground">Clientes</h1><p className="text-sm text-muted-foreground">Gerencie os cardapios digitais dos clientes</p></div>
        </div>
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Novo Cliente</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" /></div>
      ) : empresas.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up stagger-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center"><Store className="w-8 h-8 text-muted-foreground" /></div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum cliente ainda</h3>
          <p className="text-sm text-muted-foreground mb-5">Comece cadastrando seu primeiro cliente</p>
          <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Cadastrar Cliente</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {empresas.map((empresa, index) => (
            <div key={empresa.id} className="glass-card rounded-xl overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {empresa.logo_url ? (
                      <img src={empresa.logo_url} alt={empresa.nome} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center"><Store className="w-5 h-5 text-indigo-400" /></div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{empresa.nome}</h3>
                      <p className="text-xs text-muted-foreground">{empresa.subdominio}</p>
                    </div>
                  </div>
                  <Badge className={`border-0 text-[10px] px-1.5 py-0 ${empresa.ativo ? "bg-emerald-500/10 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                    {empresa.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>

                {empresa.telefone && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Phone className="w-3 h-3" />{empresa.telefone}</p>
                )}
                {empresa.endereco && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3"><MapPin className="w-3 h-3" />{empresa.endereco}</p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Link href={`/dashboard/clientes/${empresa.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs"><ExternalLink className="w-3 h-3 mr-1.5" /> Gerenciar Cardapio</Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => openModal(empresa)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleAtivo(empresa)} className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-400">
                    {empresa.ativo ? <span className="text-[10px] font-bold">OFF</span> : <span className="text-[10px] font-bold">ON</span>}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteModal({ isOpen: true, empresa })} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo/Editar */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <Card className="w-full max-w-lg bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-foreground text-base">{editing ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8"><X className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Nome da Empresa</Label><Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Restaurante do Joao" className="bg-secondary border-border" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Subdominio</Label><Input value={formData.subdominio} onChange={(e) => setFormData({ ...formData, subdominio: e.target.value })} placeholder="restaurante-joao" className="bg-secondary border-border" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Telefone</Label><Input value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} placeholder="(11) 99999-9999" className="bg-secondary border-border" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Logo URL</Label><Input value={formData.logo_url} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} className="bg-secondary border-border" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Endereco</Label><Input value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} placeholder="Rua X, 123 - Cidade/UF" className="bg-secondary border-border" /></div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving || !formData.nome || !formData.subdominio} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">{isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={deleteModal.isOpen} onOpenChange={(open) => !open && setDeleteModal({ isOpen: false, empresa: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2"><div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div><AlertDialogTitle className="text-foreground">Excluir Cliente</AlertDialogTitle></div>
            <AlertDialogDescription className="text-muted-foreground">Tem certeza que deseja excluir <span className="font-medium text-foreground">{deleteModal.empresa?.nome}</span>? Isso removera tambem todas as categorias e produtos associados.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-muted">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">{isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
