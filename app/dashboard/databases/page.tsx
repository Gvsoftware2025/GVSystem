"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Trash2, Loader2, Database, AlertTriangle, X, HardDrive, Table2, ChevronDown, ChevronUp, LayoutList, Play, Terminal, ArrowLeft, Clock, CheckCircle2, XCircle, Copy, Check } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface DbInfo { name: string; size: string; sizeRaw: number }
interface TableInfo { name: string; columns: number; rows: number; size: string }
interface QueryResult { rows: any[]; rowCount: number; fields: string[]; command: string; duration: number; error?: string }
interface TableData { table: string; columns: any[]; rows: any[]; fields: string[]; totalRows: number }

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

  // SQL Editor state
  const [sqlDb, setSqlDb] = useState<string | null>(null)
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM portfolio_skills LIMIT 10;")
  const [sqlResult, setSqlResult] = useState<QueryResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [sqlHistory, setSqlHistory] = useState<string[]>([])

  // Table viewer state
  const [viewingTable, setViewingTable] = useState<{ db: string; table: string } | null>(null)
  const [tableViewData, setTableViewData] = useState<TableData | null>(null)
  const [loadingTableView, setLoadingTableView] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchDatabases = async () => {
    try {
      const res = await fetch("/api/databases")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setDatabases(Array.isArray(data) ? data : [])
    } catch (err: any) { setError(err.message); setDatabases([]) }
    setIsLoading(false)
  }

  useEffect(() => { fetchDatabases() }, [])

  const handleCreate = async () => {
    setIsCreating(true); setError("")
    try {
      const res = await fetch("/api/databases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: dbName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") }) })
      const result = await res.json()
      if (result.error) setError(result.error)
      else { await fetchDatabases(); setIsModalOpen(false); setDbName("") }
    } catch (err: any) { setError(err.message) }
    setIsCreating(false)
  }

  const handleDelete = async () => {
    if (!deleteModal.db) return
    setIsDeleting(true)
    try {
      console.log("[v0] Deleting database:", deleteModal.db.name)
      const res = await fetch("/api/databases", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: deleteModal.db.name }) })
      const result = await res.json()
      console.log("[v0] Delete result:", result)
      if (result.error) { setError(result.error) }
      await fetchDatabases()
    } catch (err: any) {
      console.log("[v0] Delete error:", err.message)
      setError(err.message)
    }
    setIsDeleting(false); setDeleteModal({ isOpen: false, db: null })
  }

  const toggleExpand = async (name: string) => {
    console.log("[v0] Toggle expand:", name, "current:", expandedDb)
    if (expandedDb === name) { setExpandedDb(null); return }
    setExpandedDb(name)
    setLoadingTables(name)
    try {
      const res = await fetch(`/api/databases/${encodeURIComponent(name)}`)
      const data = await res.json()
      console.log("[v0] Tables data for", name, ":", data)
      if (data.tables) setTablesData((prev) => ({ ...prev, [name]: data.tables }))
      else if (data.error) { console.log("[v0] Tables error:", data.error); setTablesData((prev) => ({ ...prev, [name]: [] })) }
    } catch (err: any) {
      console.log("[v0] Fetch tables error:", err.message)
      setTablesData((prev) => ({ ...prev, [name]: [] }))
    }
    setLoadingTables(null)
  }

  const handleRunSQL = async () => {
    if (!sqlDb || !sqlQuery.trim()) return
    setIsRunning(true); setSqlResult(null)
    try {
      const res = await fetch(`/api/databases/${encodeURIComponent(sqlDb)}/query`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sql: sqlQuery.trim() }) })
      const data = await res.json()
      if (data.error) setSqlResult({ rows: [], rowCount: 0, fields: [], command: "", duration: 0, error: data.error })
      else setSqlResult(data)
      setSqlHistory((prev) => [sqlQuery.trim(), ...prev.filter((q) => q !== sqlQuery.trim())].slice(0, 20))
    } catch (err: any) { setSqlResult({ rows: [], rowCount: 0, fields: [], command: "", duration: 0, error: err.message }) }
    setIsRunning(false)
  }

  const handleViewTable = async (db: string, table: string) => {
    setViewingTable({ db, table }); setLoadingTableView(true); setTableViewData(null)
    try {
      const res = await fetch(`/api/databases/${encodeURIComponent(db)}/tables/${encodeURIComponent(table)}`)
      const data = await res.json()
      console.log("[v0] Table view data:", data)
      setTableViewData(data)
    } catch (err: any) { console.log("[v0] View table error:", err.message) }
    setLoadingTableView(false)
  }

  const handleCopyValue = (val: string) => {
    navigator.clipboard.writeText(val); setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const sanitizedName = dbName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")

  // Table Viewer
  if (viewingTable) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Button variant="ghost" size="icon" onClick={() => { setViewingTable(null); setTableViewData(null) }} className="h-9 w-9 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{viewingTable.table}</h1>
            <p className="text-xs text-muted-foreground font-mono">{viewingTable.db}</p>
          </div>
        </div>
        {loadingTableView ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" /></div>
        ) : tableViewData ? (
          <div className="space-y-4 animate-fade-in-up stagger-1">
            {/* Columns Info */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">Colunas ({tableViewData.columns.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-1.5">
                  {tableViewData.columns.map((col: any) => (
                    <div key={col.column_name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50 text-sm">
                      <span className="font-mono text-foreground">{col.column_name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-cyan-400 font-mono">{col.data_type}</span>
                        {col.is_nullable === "NO" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">NOT NULL</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Data */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Dados ({tableViewData.totalRows} registros)</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => { setSqlDb(viewingTable.db); setSqlQuery(`SELECT * FROM "${viewingTable.table}";`); setViewingTable(null); setTableViewData(null) }} className="h-7 text-xs">
                    <Terminal className="w-3 h-3 mr-1.5" /> Abrir no SQL Editor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tableViewData.rows.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Tabela vazia</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-secondary/70">
                          {tableViewData.fields.map((f) => (
                            <th key={f} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap border-b border-border">{f}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableViewData.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-0">
                            {tableViewData.fields.map((f) => (
                              <td key={f} className="px-3 py-2 text-foreground whitespace-nowrap max-w-[300px] truncate font-mono text-xs">
                                {row[f] === null ? <span className="text-muted-foreground/50 italic">null</span> : String(row[f])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    )
  }

  // SQL Editor View
  if (sqlDb) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Button variant="ghost" size="icon" onClick={() => { setSqlDb(null); setSqlResult(null) }} className="h-9 w-9 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">SQL Editor</h1>
              <p className="text-xs text-muted-foreground font-mono">{sqlDb}</p>
            </div>
          </div>
        </div>

        {/* SQL Input */}
        <Card className="bg-card border-border animate-fade-in-up stagger-1">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Database className="w-3 h-3" /> {sqlDb}
              </span>
              <div className="flex items-center gap-2">
                {sqlHistory.length > 0 && (
                  <select
                    className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground max-w-[200px]"
                    value=""
                    onChange={(e) => { if (e.target.value) setSqlQuery(e.target.value) }}
                  >
                    <option value="">Historico</option>
                    {sqlHistory.map((q, i) => (
                      <option key={i} value={q}>{q.slice(0, 60)}{q.length > 60 ? "..." : ""}</option>
                    ))}
                  </select>
                )}
                <Button
                  size="sm"
                  onClick={handleRunSQL}
                  disabled={isRunning || !sqlQuery.trim()}
                  className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
                  Executar
                </Button>
              </div>
            </div>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleRunSQL() }}
              placeholder="SELECT * FROM tabela LIMIT 10;"
              className="w-full min-h-[160px] p-4 bg-transparent text-foreground font-mono text-sm resize-y focus:outline-none placeholder:text-muted-foreground/40 leading-relaxed"
              spellCheck={false}
            />
            <div className="px-4 py-2 border-t border-border bg-secondary/20">
              <p className="text-[10px] text-muted-foreground">Ctrl+Enter para executar</p>
            </div>
          </CardContent>
        </Card>

        {/* SQL Result */}
        {sqlResult && (
          <Card className="bg-card border-border animate-fade-in-up">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {sqlResult.error ? (
                    <XCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <CardTitle className="text-sm">
                    {sqlResult.error ? (
                      <span className="text-destructive">Erro</span>
                    ) : (
                      <span className="text-foreground">
                        {sqlResult.command || "OK"} - {sqlResult.rowCount} {sqlResult.rowCount === 1 ? "registro" : "registros"}
                      </span>
                    )}
                  </CardTitle>
                </div>
                {!sqlResult.error && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {sqlResult.duration}ms
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {sqlResult.error ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 font-mono text-xs text-destructive leading-relaxed whitespace-pre-wrap">
                  {sqlResult.error}
                </div>
              ) : sqlResult.fields.length > 0 && sqlResult.rows.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/70">
                        {sqlResult.fields.map((f) => (
                          <th key={f} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap border-b border-border">{f}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResult.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-0">
                          {sqlResult.fields.map((f) => (
                            <td
                              key={f}
                              className="px-3 py-2 text-foreground whitespace-nowrap max-w-[300px] truncate font-mono text-xs cursor-pointer hover:text-primary transition-colors"
                              title="Clique para copiar"
                              onClick={() => handleCopyValue(row[f] === null ? "null" : String(row[f]))}
                            >
                              {row[f] === null ? <span className="text-muted-foreground/50 italic">null</span> : String(row[f])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Query executada com sucesso. Nenhum dado retornado.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Main databases list
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
        <div className="flex gap-2">
          <Button onClick={() => { setSqlDb("gvsoftware"); setSqlResult(null) }} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
            <Terminal className="w-4 h-4 mr-2" /> SQL Editor
          </Button>
          <Button onClick={() => { setIsModalOpen(true); setDbName(""); setError("") }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Novo Banco
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && !isModalOpen && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-sm text-destructive animate-fade-in-up">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Database List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" /></div>
      ) : databases.length === 0 && !error ? (
        <div className="text-center py-20 animate-fade-in-up stagger-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center"><Database className="w-8 h-8 text-muted-foreground" /></div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum banco encontrado</h3>
          <p className="text-sm text-muted-foreground mb-5">Crie seu primeiro banco de dados</p>
          <Button onClick={() => { setIsModalOpen(true); setDbName(""); setError("") }} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Criar Banco</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {databases.map((db, index) => (
            <div key={db.name} className="glass-card rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
              {/* Database Row */}
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => toggleExpand(db.name)}>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0"><Database className="w-5 h-5 text-cyan-400" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{db.name}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><HardDrive className="w-3 h-3" /> {db.size}</span>
                    {db.name === "gvsoftware" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Principal</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSqlDb(db.name); setSqlResult(null) }} className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10" title="SQL Editor">
                    <Terminal className="w-4 h-4" />
                  </Button>
                  {db.name !== "gvsoftware" && (
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, db }) }} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  {expandedDb === db.name ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {/* Expanded Tables */}
              <AnimatePresence>
                {expandedDb === db.name && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 pt-1 border-t border-border">
                      {loadingTables === db.name ? (
                        <div className="flex justify-center py-6"><div className="w-5 h-5 border-2 border-primary/30 rounded-full border-t-primary animate-spin" /></div>
                      ) : tablesData[db.name]?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma tabela encontrada</p>
                      ) : (
                        <div className="space-y-2 mt-3">
                          <div className="grid grid-cols-4 gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3">
                            <span>Tabela</span><span className="text-center">Colunas</span><span className="text-center">Registros</span><span className="text-right">Tamanho</span>
                          </div>
                          {tablesData[db.name]?.map((table) => (
                            <div
                              key={table.name}
                              className="grid grid-cols-4 gap-2 items-center px-3 py-2.5 rounded-lg bg-secondary/50 text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                              onClick={() => handleViewTable(db.name, table.name)}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Table2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="text-foreground truncate hover:text-primary transition-colors">{table.name}</span>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()}>
              <Card className="w-full max-w-md bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-foreground text-base">Novo Banco de Dados</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8"><X className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Nome do Banco</Label>
                    <Input value={dbName} onChange={(e) => { setDbName(e.target.value); setError("") }} placeholder="cardapio_pizzaria" className="bg-secondary border-border font-mono" />
                    {dbName && <p className="text-[11px] text-muted-foreground">Sera criado como: <span className="font-mono text-foreground">{sanitizedName || "..."}</span></p>}
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">O banco sera criado vazio. Use o SQL Editor para criar suas tabelas.</p>
                  </div>
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 flex items-center gap-2 text-xs text-destructive">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />{error}
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                    <Button onClick={handleCreate} disabled={isCreating || !sanitizedName || sanitizedName.length < 2} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
              <AlertDialogTitle className="text-foreground">Excluir Banco de Dados</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir o banco <span className="font-mono font-medium text-foreground">{deleteModal.db?.name}</span>? Todos os dados serao permanentemente perdidos.
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
