"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Trash2, Loader2, Database, AlertTriangle, X, HardDrive, Table2, ChevronDown, ChevronUp, LayoutList } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface DbInfo {
  name: string
  size: string
  sizeRaw: number
}

interface TableInfo {
  name: string
  columns: number
  rows: number
  size: string
}

export default function DatabasesPage() {
  const [databases, setDatabases] = useState<DbInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dbName, setDbName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; db: DbInfo | null }>({ isOpen: false, db: null })
  const [isDeleting, setIsDeleting] = useState(false)
  const [expandedDb, setExpandedDb] = useState<string | null>(null)
  const [tablesData, setTablesData] = useState<Record<string, TableInfo[]>>({})
  const [loadingTables, setLoadingTables] = useState<string | null>(null)
  const [error, setError] = useState("")

  const fetchDatabases = async () => {
    try {
      const res = await fetch("/api/databases")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setDatabases(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message)
      setDatabases([])
    }
    setIsLoading(false)
  }

  useEffect(() => { fetchDatabases() }, [])

  const handleCreate = async () => {
    setIsCreating(true)
    setError("")
    try {
      const res = await fetch("/api/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: dbName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") }),
      })
      const result = await res.json()
      if (result.error) { setError(result.error) }
      else { await fetchDatabases(); setIsModalOpen(false); setDbName("") }
    } catch (err: any) { setError(err.message) }
    setIsCreating(false)
  }

  const handleDelete = async () => {
    if (!deleteModal.db) return
    setIsDeleting(true)
    try {
      await fetch("/api/databases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: deleteModal.db.name }),
      })
      await fetchDatabases()
    } catch {}
    setIsDeleting(false)
    setDeleteModal({ isOpen: false, db: null })
  }

  const toggleExpand = async (dbName: string) => {
    if (expandedDb === dbName) {
      setExpandedDb(null)
      return
    }
    setExpandedDb(dbName)
    if (!tablesData[dbName]) {
      setLoadingTables(dbName)
      try {
        const res = await fetch(`/api/databases/${dbName}`)
        const data = await res.json()
        if (data.tables) setTablesData((prev) => ({ ...prev, [dbName]: data.tables }))
      } catch {}
      setLoadingTables(null)
    }
  }

  const sanitizedName = dbName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Bancos de Dados</h1>
            <p className="text-sm text-muted-foreground">Gerencie os bancos de dados da VPS</p>
          </div>
        </div>
        <Button onClick={() => { setIsModalOpen(true); setDbName(""); setError("") }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Novo Banco
        </Button>
      </div>

      {/* Error */}
      {error && !isModalOpen && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-sm text-destructive animate-fade-in-up">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Database List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" />
        </div>
      ) : databases.length === 0 && !error ? (
        <div className="text-center py-20 animate-fade-in-up stagger-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
            <Database className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum banco encontrado</h3>
          <p className="text-sm text-muted-foreground mb-5">Crie seu primeiro banco de dados</p>
          <Button onClick={() => { setIsModalOpen(true); setDbName(""); setError("") }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Criar Banco
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {databases.map((db, index) => (
            <div
              key={db.name}
              className="glass-card rounded-xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Database Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => toggleExpand(db.name)}
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{db.name}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> {db.size}
                    </span>
                    {db.name === "gvsoftware" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Principal</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {db.name !== "gvsoftware" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, db }) }}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  {expandedDb === db.name ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Tables */}
              <AnimatePresence>
                {expandedDb === db.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-1 border-t border-border">
                      {loadingTables === db.name ? (
                        <div className="flex justify-center py-6">
                          <div className="w-5 h-5 border-2 border-primary/30 rounded-full border-t-primary animate-spin" />
                        </div>
                      ) : tablesData[db.name]?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma tabela encontrada</p>
                      ) : (
                        <div className="space-y-2 mt-3">
                          <div className="grid grid-cols-4 gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3">
                            <span>Tabela</span>
                            <span className="text-center">Colunas</span>
                            <span className="text-center">Registros</span>
                            <span className="text-right">Tamanho</span>
                          </div>
                          {tablesData[db.name]?.map((table) => (
                            <div key={table.name} className="grid grid-cols-4 gap-2 items-center px-3 py-2.5 rounded-lg bg-secondary/50 text-sm">
                              <div className="flex items-center gap-2 min-w-0">
                                <Table2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="text-foreground truncate">{table.name}</span>
                              </div>
                              <span className="text-center text-muted-foreground">{table.columns}</span>
                              <span className="text-center text-foreground font-medium">{table.rows}</span>
                              <span className="text-right text-muted-foreground">{table.size}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  <CardTitle className="text-foreground text-base">Novo Banco de Dados</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Nome do Banco</Label>
                    <Input
                      value={dbName}
                      onChange={(e) => { setDbName(e.target.value); setError("") }}
                      placeholder="cardapio_pizzaria"
                      className="bg-secondary border-border font-mono"
                    />
                    {dbName && (
                      <p className="text-[11px] text-muted-foreground">
                        Sera criado como: <span className="font-mono text-foreground">{sanitizedName || "..."}</span>
                      </p>
                    )}
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3 space-y-1.5">
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <LayoutList className="w-3.5 h-3.5 text-cyan-400" /> Tabelas criadas automaticamente:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["categorias", "produtos", "pedidos", "itens_pedido"].map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">{t}</span>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 flex items-center gap-2 text-xs text-destructive">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                    <Button
                      onClick={handleCreate}
                      disabled={isCreating || !sanitizedName || sanitizedName.length < 2}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Banco"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteModal.isOpen} onOpenChange={(open) => !open && setDeleteModal({ isOpen: false, db: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <AlertDialogTitle className="text-foreground">Excluir Banco de Dados</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir o banco <span className="font-mono font-medium text-foreground">{deleteModal.db?.name}</span>? Todos os dados serao permanentemente perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-muted">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
