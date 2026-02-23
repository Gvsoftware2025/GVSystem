"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/stats-card"
import { RecentMessages } from "@/components/recent-messages"
import { SiteStatus } from "@/components/site-status"
import { Summary } from "@/components/summary"
import { FileText, Zap, Mail, MessageSquare } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, contacts: 0, feedbacks: 0 })

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground mt-1">Bem-vindo ao painel administrativo</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Projetos" value={stats.projects.toString()} icon={<FileText className="w-4 h-4 text-blue-400" />} iconColor="bg-blue-500/10" href="/dashboard/projetos" delay={50} />
        <StatsCard title="Habilidades" value={stats.skills.toString()} icon={<Zap className="w-4 h-4 text-amber-400" />} iconColor="bg-amber-500/10" href="/dashboard/habilidades" delay={100} />
        <StatsCard title="Contatos" value={stats.contacts.toString()} icon={<Mail className="w-4 h-4 text-orange-400" />} iconColor="bg-orange-500/10" href="/dashboard/contatos" delay={150} />
        <StatsCard title="Feedbacks" value={stats.feedbacks.toString()} icon={<MessageSquare className="w-4 h-4 text-emerald-400" />} iconColor="bg-emerald-500/10" href="/dashboard/feedbacks" delay={200} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RecentMessages /></div>
        <div className="space-y-4"><SiteStatus /><Summary /></div>
      </div>
    </>
  )
}
