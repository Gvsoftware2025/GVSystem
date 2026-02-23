"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, X, Loader2, ArrowLeft, Store, Tag, ShoppingBag, AlertTriangle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Link from "next/link"

interface Categoria { id: number; empresa_id: number; nome: string; ordem: number; ativo: boolean }
interface Produto { id: number; empresa_id: number; categoria_id: number; nome: string; descricao: string; preco: number; imagem_url: string; disponivel: boolean; ordem: number; categoria_nome?: string }

export default function CardapioPage() {
  const params = useParams()
  const empresaId = params.id as string

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [empresaNome, setEmpresaNome] = useState("")

  // Category modal
  const [catModal, setCatModal] = useState(false)
  const [editingCat, setEditingCat] = useState<Categoria | null>(null)
  const [catForm, setCatForm] = useState({ nome: "", ordem: 0 })
  const [savingCat, setSavingCat] = useState(false)

  // Product modal
  const [prodModal, setProdModal] = useState(false)
  const [editingProd, setEditingProd] = useState<Produto | null>(null)
  const [prodForm, setProdForm] = useState({ nome: "", descricao: "", preco: 0, imagem_url: "", categoria_id: 0, disponivel: true, ordem: 0 })
  const [savingProd, setSavingProd] = useState(false)

  // Delete
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: "cat" | "prod"; item: any }>({ isOpen: false, type: "cat", item: null })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async () => {
    try {
      const [catsRes, prodsRes, empRes] = await Promise.all([
        fetch(`/api/clientes/${empresaId}/categorias`),
        fetch(`/api/clientes/${empresaId}/produtos`),
        fetch("/api/clientes"),
      ])
      const cats = await catsRes.json()
      const prods = await prodsRes.json()
      const emps = await empRes.json()
      setCategorias(Array.isArray(cats) ? cats : [])
      setProdutos(Array.isArray(prods) ? prods : [])
      const emp = Array.isArray(emps) ? emps.find((e: any) => String(e.id) === empresaId) : null
      if (emp) setEmpresaNome(emp.nome)
    } catch {}
    setIsLoading(false)
  }

  useEffect(() => { fetchData() }, [empresaId])

  // ---- CATEGORIAS ----
  const openCatModal = (cat?: Categoria) => {
    if (cat) { setEditingCat(cat); setCatForm({ nome: cat.nome, ordem: cat.ordem }) }
    else { setEditingCat(null); setCatForm({ nome: "", ordem: categorias.length }) }
    setCatModal(true)
  }

  const saveCat = async () => {
    setSavingCat(true)
    if (editingCat) {
      await fetch(`/api/clientes/${empresaId}/categorias`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...catForm, id: editingCat.id, ativo: editingCat.ativo }) })
    } else {
      await fetch(`/api/clientes/${empresaId}/categorias`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(catForm) })
    }
    await fetchData(); setCatModal(false); setSavingCat(false)
  }

  // ---- PRODUTOS ----
  const openProdModal = (prod?: Produto) => {
    if (prod) { setEditingProd(prod); setProdForm({ nome: prod.nome, descricao: prod.descricao || "", preco: prod.preco, imagem_url: prod.imagem_url || "", categoria_id: prod.categoria_id, disponivel: prod.disponivel, ordem: prod.ordem }) }
    else { setEditingProd(null); setProdForm({ nome: "", descricao: "", preco: 0, imagem_url: "", categoria_id: categorias[0]?.id || 0, disponivel: true, ordem: produtos.length }) }
    setProdModal(true)
  }

  const saveProd = async () => {
    setSavingProd(true)
    if (editingProd) {
      await fetch(`/api/clientes/${empresaId}/produtos`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...prodForm, id: editingProd.id }) })
    } else {
      await fetch(`/api/clientes/${empresaId}/produtos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(prodForm) })
    }
    await fetchData(); setProdModal(false); setSavingProd(false)
  }

  // ---- DELETE ----
  const handleDelete = async () => {
    if (!deleteModal.item) return
    setIsDeleting(true)
    const endpoint = deleteModal.type === "cat" ? "categorias" : "produtos"
    await fetch(`/api/clientes/${empresaId}/${endpoint}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteModal.item.id }) })
    await fetchData()
    setIsDeleting(false); setDeleteModal({ isOpen: false, type: "cat", item: null })
  }

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" /></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/clientes"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center"><Store className="w-5 h-5 text-indigo-400" /></div>
          <div><h1 className="text-2xl font-semibold text-foreground">{empresaNome || "Cardapio"}</h1><p className="text-sm text-muted-foreground">Gerencie categorias e produtos</p></div>
        </div>
      </div>

      <Tabs defaultValue="categorias" className="animate-fade-in-up stagger-1">
        <TabsList className="bg-secondary">
          <TabsTrigger value="categorias" className="gap-1.5"><Tag className="w-3.5 h-3.5" /> Categorias ({categorias.length})</TabsTrigger>
          <TabsTrigger value="produtos" className="gap-1.5"><ShoppingBag className="w-3.5 h-3.5" /> Produtos ({produtos.length})</TabsTrigger>
        </TabsList>

        {/* CATEGORIAS TAB */}
        <TabsContent value="categorias" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => openCatModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Nova Categoria</Button>
          </div>
          {categorias.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-secondary flex items-center justify-center"><Tag className="w-7 h-7 text-muted-foreground" /></div>
              <h3 className="text-base font-medium text-foreground mb-1">Nenhuma categoria</h3>
              <p className="text-sm text-muted-foreground">Adicione categorias para organizar o cardapio</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categorias.map((cat, i) => (
                <div key={cat.id} className="glass-card rounded-xl p-4 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400">{cat.ordem}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{cat.nome}</h3>
                      <p className="text-[11px] text-muted-foreground">{produtos.filter(p => p.categoria_id === cat.id).length} produtos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`border-0 text-[10px] px-1.5 py-0 mr-2 ${cat.ativo ? "bg-emerald-500/10 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>{cat.ativo ? "Ativa" : "Inativa"}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => openCatModal(cat)} className="h-7 w-7 hover:bg-primary/10 hover:text-primary"><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteModal({ isOpen: true, type: "cat", item: cat })} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PRODUTOS TAB */}
        <TabsContent value="produtos" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => openProdModal()} disabled={categorias.length === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Novo Produto</Button>
          </div>
          {produtos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-secondary flex items-center justify-center"><ShoppingBag className="w-7 h-7 text-muted-foreground" /></div>
              <h3 className="text-base font-medium text-foreground mb-1">Nenhum produto</h3>
              <p className="text-sm text-muted-foreground">{categorias.length === 0 ? "Adicione categorias primeiro" : "Adicione produtos ao cardapio"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {produtos.map((prod, i) => (
                <div key={prod.id} className="glass-card rounded-xl overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  {prod.imagem_url && (
                    <div className="h-36 overflow-hidden"><img src={prod.imagem_url} alt={prod.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{prod.nome}</h3>
                      <span className="text-sm font-bold text-primary">R$ {Number(prod.preco).toFixed(2)}</span>
                    </div>
                    {prod.descricao && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{prod.descricao}</p>}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{prod.categoria_nome || "Sem categoria"}</Badge>
                      <Badge className={`border-0 text-[10px] px-1.5 py-0 ${prod.disponivel ? "bg-emerald-500/10 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>{prod.disponivel ? "Disponivel" : "Indisponivel"}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openProdModal(prod)} className="h-7 w-7 hover:bg-primary/10 hover:text-primary"><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteModal({ isOpen: true, type: "prod", item: prod })} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* CATEGORIA MODAL */}
      <AnimatePresence>
        {catModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCatModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <Card className="w-full max-w-md bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-foreground text-base">{editingCat ? "Editar Categoria" : "Nova Categoria"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setCatModal(false)} className="h-8 w-8"><X className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Nome</Label><Input value={catForm.nome} onChange={(e) => setCatForm({ ...catForm, nome: e.target.value })} placeholder="Lanches, Bebidas..." className="bg-secondary border-border" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Ordem</Label><Input type="number" value={catForm.ordem} onChange={(e) => setCatForm({ ...catForm, ordem: parseInt(e.target.value) || 0 })} className="bg-secondary border-border" /></div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setCatModal(false)} className="flex-1">Cancelar</Button>
                    <Button onClick={saveCat} disabled={savingCat || !catForm.nome} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">{savingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUTO MODAL */}
      <AnimatePresence>
        {prodModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setProdModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <Card className="w-full max-w-lg bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-foreground text-base">{editingProd ? "Editar Produto" : "Novo Produto"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setProdModal(false)} className="h-8 w-8"><X className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Nome</Label><Input value={prodForm.nome} onChange={(e) => setProdForm({ ...prodForm, nome: e.target.value })} placeholder="X-Burger, Coca-Cola..." className="bg-secondary border-border" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Descricao</Label><Textarea value={prodForm.descricao} onChange={(e) => setProdForm({ ...prodForm, descricao: e.target.value })} className="bg-secondary border-border" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Preco (R$)</Label><Input type="number" step="0.01" value={prodForm.preco} onChange={(e) => setProdForm({ ...prodForm, preco: parseFloat(e.target.value) || 0 })} className="bg-secondary border-border" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Categoria</Label>
                      <select value={prodForm.categoria_id} onChange={(e) => setProdForm({ ...prodForm, categoria_id: parseInt(e.target.value) })} className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none">
                        {categorias.map((cat) => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">URL da Imagem</Label><Input value={prodForm.imagem_url} onChange={(e) => setProdForm({ ...prodForm, imagem_url: e.target.value })} className="bg-secondary border-border" /></div>
                  <div className="flex items-center justify-between py-2">
                    <div><Label className="text-sm text-foreground">Disponivel</Label><p className="text-[11px] text-muted-foreground">Produto visivel no cardapio</p></div>
                    <Switch checked={prodForm.disponivel} onCheckedChange={(checked) => setProdForm({ ...prodForm, disponivel: checked })} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setProdModal(false)} className="flex-1">Cancelar</Button>
                    <Button onClick={saveProd} disabled={savingProd || !prodForm.nome || !prodForm.categoria_id} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">{savingProd ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AlertDialog open={deleteModal.isOpen} onOpenChange={(open) => !open && setDeleteModal({ isOpen: false, type: "cat", item: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2"><div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div><AlertDialogTitle className="text-foreground">Excluir {deleteModal.type === "cat" ? "Categoria" : "Produto"}</AlertDialogTitle></div>
            <AlertDialogDescription className="text-muted-foreground">Tem certeza que deseja excluir <span className="font-medium text-foreground">{deleteModal.item?.nome}</span>?</AlertDialogDescription>
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
