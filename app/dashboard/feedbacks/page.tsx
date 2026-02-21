"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Eye, EyeOff, Trash2, MessageCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface Feedback {
  id: string
  nome: string
  avaliacao: number
  comentario: string
  data: string
  visivel: boolean
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchFeedbacks = async () => {
    const { data } = await supabase.from("portfolio_feedbacks").select("*").order("created_at", { ascending: false })
    setFeedbacks(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchFeedbacks()
    const channel = supabase
      .channel("portfolio_feedbacks-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_feedbacks" }, fetchFeedbacks)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    setUpdatingId(id)
    await supabase.from("portfolio_feedbacks").update({ visivel: !currentVisibility }).eq("id", id)
    fetchFeedbacks()
    setUpdatingId(null)
  }

  const handleDelete = async (id: string) => {
    await supabase.from("portfolio_feedbacks").delete().eq("id", id)
    fetchFeedbacks()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Feedbacks</h1>
          <p className="text-sm text-muted-foreground">Avaliacoes de clientes</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up stagger-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
            <Star className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum feedback ainda</h3>
          <p className="text-sm text-muted-foreground">Os feedbacks aparecerao aqui</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="glass-card rounded-xl p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-foreground">{feedback.nome}</h3>
                      <Badge className={`border-0 text-[10px] px-1.5 py-0 ${feedback.visivel ? "bg-emerald-500/10 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                        {feedback.visivel ? "Visivel" : "Oculto"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < feedback.avaliacao ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1.5">{feedback.avaliacao}.0</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{feedback.comentario}</p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(feedback.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => handleToggleVisibility(feedback.id, feedback.visivel)}
                      disabled={updatingId === feedback.id}
                      className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      {updatingId === feedback.id ? <Loader2 className="w-4 h-4 animate-spin" /> : feedback.visivel ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(feedback.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
