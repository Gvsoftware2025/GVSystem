"use client"

import { Mail, ArrowRight, User2 } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="premium-card p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
            <Mail className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Mensagens Recentes</h2>
            <p className="text-xs text-muted-foreground">Ultimas conversas</p>
          </div>
        </div>
        <Link
          href="/dashboard/contatos"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative">
              <div className="w-10 h-10 border-2 border-primary/20 rounded-full" />
              <div className="w-10 h-10 border-2 border-primary rounded-full border-t-transparent animate-spin absolute inset-0" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">Carregando mensagens...</p>
          </motion.div>
        ) : mensagens.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhuma mensagem</p>
            <p className="text-xs text-muted-foreground/60 mt-1">As mensagens aparecerao aqui</p>
          </motion.div>
        ) : (
          <motion.div 
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {mensagens.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="group p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <User2 className="w-4 h-4 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{msg.name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0 bg-secondary px-2 py-0.5 rounded-full">
                        {new Date(msg.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1.5">{msg.email}</p>
                    <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">{msg.message}</p>
                  </div>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
