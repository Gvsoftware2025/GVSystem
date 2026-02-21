"use client"

import { Mail } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Mensagem {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export function RecentMessages() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMensagens = async () => {
      try {
        const response = await fetch("/api/contacts")
        const data = await response.json()
        setMensagens(Array.isArray(data) ? data.slice(0, 5) : [])
      } catch {
        setMensagens([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchMensagens()
  }, [])

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-up stagger-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Mensagens Recentes</h2>
        </div>
        <Link
          href="/dashboard/contatos"
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Ver todas
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 rounded-full border-t-primary animate-spin" />
        </div>
      ) : mensagens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Nenhuma mensagem</p>
        </div>
      ) : (
        <div className="space-y-2">
          {mensagens.map((msg, i) => (
            <div
              key={msg.id}
              className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/20 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${(i + 6) * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{msg.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                  <p className="text-xs text-foreground/70 mt-1.5 line-clamp-1">{msg.message}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                  {new Date(msg.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
