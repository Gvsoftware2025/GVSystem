"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Clock, Check, Trash2, MessageSquare } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface Contato {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  company?: string
  phone?: string
  is_read?: boolean
}

export default function ContatosPage() {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchContatos = async () => {
    try {
      const response = await fetch("/api/contacts")
      const data = await response.json()
      setContatos(Array.isArray(data) ? data : [])
    } catch {
      setContatos([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContatos()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: true }),
      })
      setContatos(contatos.map((c) => (c.id === id ? { ...c, is_read: true } : c)))
    } catch {}
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setContatos(contatos.filter((c) => c.id !== id))
      setDeletingId(null)
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contatos</h1>
          <p className="text-sm text-muted-foreground">Mensagens enviadas pelo site</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" />
        </div>
      ) : contatos.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up stagger-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhuma mensagem</h3>
          <p className="text-sm text-muted-foreground">As mensagens aparecerao aqui</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {contatos.map((contato, index) => (
              <motion.div
                key={contato.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className={`glass-card rounded-xl p-4 ${contato.is_read ? "border-emerald-500/20" : ""}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">{contato.name}</h3>
                        {!contato.is_read ? (
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Novo</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px] px-1.5 py-0">Lido</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Mail className="w-3 h-3" />{contato.email}
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{contato.message}</p>
                      <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(contato.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!contato.is_read && (
                        <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(contato.id)} className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-400">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setDeletingId(contato.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Delete confirmation */}
                <AnimatePresence>
                  {deletingId === contato.id && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
                      onClick={() => setDeletingId(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.96, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-card border border-border rounded-xl p-5 max-w-sm shadow-2xl"
                      >
                        <h3 className="text-base font-semibold text-foreground mb-1">Deletar mensagem?</h3>
                        <p className="text-sm text-muted-foreground mb-5">Esta acao e permanente e nao pode ser desfeita.</p>
                        <div className="flex gap-3">
                          <Button onClick={() => handleDelete(contato.id)} className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground">Deletar</Button>
                          <Button onClick={() => setDeletingId(null)} variant="outline" className="flex-1">Cancelar</Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
