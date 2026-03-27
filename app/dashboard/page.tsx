"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { StatsCard } from "@/components/stats-card"
import { RecentMessages } from "@/components/recent-messages"
import { SiteStatus } from "@/components/site-status"
import { Summary } from "@/components/summary"
import { ActivityChart } from "@/components/activity-chart"
import { DashboardHero } from "@/components/dashboard-hero"
import { FileText, Mail, MessageSquare, Zap as Lightning } from "lucide-react"
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
      try {
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
      } catch (error) {
        console.log("[v0] Erro ao carregar stats:", error)
      } finally {
        setIsLoading(false)
      }
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-[130px]"
        />
        
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-cyan-500/5 rounded-full blur-[120px]"
        />
      </div>
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Hero Section */}
        <DashboardHero currentDate={currentDate} userName="Usuário" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <StatsCard
            title="Projetos"
            value={isLoading ? "0" : stats.projects.toString()}
            icon={<FileText className="w-5 h-5 text-blue-400" />}
            iconColor="bg-gradient-to-br from-blue-500/20 to-blue-500/5"
            href="/dashboard/projetos"
            delay={100}
            trend={12}
          />
          <StatsCard
            title="Habilidades"
            value={isLoading ? "0" : stats.skills.toString()}
            icon={<Lightning className="w-5 h-5 text-amber-400" />}
            iconColor="bg-gradient-to-br from-amber-500/20 to-amber-500/5"
            href="/dashboard/habilidades"
            delay={200}
            trend={8}
          />
          <StatsCard
            title="Contatos"
            value={isLoading ? "0" : stats.contacts.toString()}
            icon={<Mail className="w-5 h-5 text-rose-400" />}
            iconColor="bg-gradient-to-br from-rose-500/20 to-rose-500/5"
            href="/dashboard/contatos"
            delay={300}
            trend={24}
          />
          <StatsCard
            title="Feedbacks"
            value={isLoading ? "0" : stats.feedbacks.toString()}
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
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <ActivityChart />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <RecentMessages />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <SiteStatus />
            <Summary />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
