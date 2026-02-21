"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface About {
  id: string
  title: string
  description: string
  projects_count: number
  clients_count: number
  years_experience: number
}

export default function SobrePage() {
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAbout() {
      try {
        const response = await fetch("/api/public/about")
        const data = await response.json()

        if (data.error) {
          console.error("[v0] Erro ao buscar sobre:", data.error)
        } else if (data) {
          console.log("[v0] Dados sobre carregados:", data)
          setAbout(data)
        }
      } catch (err) {
        console.error("[v0] Erro:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAbout()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!about) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <p className="text-muted-foreground">Nenhuma informação disponível</p>
      </div>
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{about.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{about.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { label: "Projetos", value: about.projects_count },
            { label: "Clientes", value: about.clients_count },
            { label: "Anos de Experiência", value: about.years_experience },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">{stat.value}+</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
