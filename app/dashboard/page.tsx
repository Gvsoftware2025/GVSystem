"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { StatsCard } from "@/components/stats-card"
import { RecentMessages } from "@/components/recent-messages"
import { SiteStatus } from "@/components/site-status"
import { Summary } from "@/components/summary"
import { ActivityChart } from "@/components/activity-chart"
import { FileText, Zap, Mail, MessageSquare, Sparkles, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    contacts: 0,
    feedbacks: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const [projects, skills, contacts, feedbacks] = await Promise.all([
        supabase.from("portfolio_projects").select("*", { count: "exact", head: true }),
        supabase.from("portfolio_skills").select("*", { count: "exact", head: true }),
        supabase.from("portfolio_contacts").select("*", { count: "exact", head: true }),
        supabase.from("portfolio_feedbacks").select("*", { count: "exact", head: true }),
      ])

      setStats({
        projects: projects.count || 0,
        skills: skills.count || 0,
        contacts: contacts.count || 0,
        feedbacks: feedbacks.count || 0,
      })
      setIsLoading(false)
    }

    fetchStats()
  }, [supabase])

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25"
                >
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Bem-vindo ao <span className="gradient-text">Painel</span>
                </h1>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {currentDate}
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm text-emerald-400 font-medium">Sistema Online</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Projetos"
            value={isLoading ? "-" : stats.projects.toString()}
            icon={<FileText className="w-5 h-5 text-blue-400" />}
            iconColor="bg-gradient-to-br from-blue-500/20 to-blue-500/5"
            href="/dashboard/projetos"
            delay={100}
            trend={12}
          />
          <StatsCard
            title="Habilidades"
            value={isLoading ? "-" : stats.skills.toString()}
            icon={<Zap className="w-5 h-5 text-amber-400" />}
            iconColor="bg-gradient-to-br from-amber-500/20 to-amber-500/5"
            href="/dashboard/habilidades"
            delay={200}
            trend={8}
          />
          <StatsCard
            title="Contatos"
            value={isLoading ? "-" : stats.contacts.toString()}
            icon={<Mail className="w-5 h-5 text-rose-400" />}
            iconColor="bg-gradient-to-br from-rose-500/20 to-rose-500/5"
            href="/dashboard/contatos"
            delay={300}
            trend={24}
          />
          <StatsCard
            title="Feedbacks"
            value={isLoading ? "-" : stats.feedbacks.toString()}
            icon={<MessageSquare className="w-5 h-5 text-emerald-400" />}
            iconColor="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5"
            href="/dashboard/feedbacks"
            delay={400}
            trend={5}
          />
        </div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <ActivityChart />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentMessages />
          </div>
          <div className="space-y-6">
            <SiteStatus />
            <Summary />
          </div>
        </div>
      </div>
    </div>
  )
}
