"use client"

import { BarChart3, TrendingUp, Code2 } from "lucide-react"
import { motion } from "framer-motion"

const technologies = [
  { name: "React", progress: 95, color: "from-cyan-500 to-cyan-400" },
  { name: "Next.js", progress: 90, color: "from-foreground to-foreground/60" },
  { name: "TypeScript", progress: 85, color: "from-blue-500 to-blue-400" },
  { name: "Node.js", progress: 80, color: "from-emerald-500 to-emerald-400" },
]

export function Summary() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="premium-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Resumo de Skills</h2>
          <p className="text-xs text-muted-foreground">Top tecnologias</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-3 rounded-xl bg-primary/10 border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Projetos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">12+</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground">Tecnologias</span>
          </div>
          <p className="text-2xl font-bold text-foreground">20+</p>
        </motion.div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + (index * 0.1) }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-foreground">{tech.name}</span>
              <span className="text-xs text-muted-foreground font-mono">{tech.progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${tech.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${tech.progress}%` }}
                transition={{ 
                  delay: 0.9 + (index * 0.1),
                  duration: 1,
                  ease: "easeOut"
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-5 pt-4 border-t border-border"
      >
        <p className="text-xs text-muted-foreground text-center">
          Atualizado automaticamente
        </p>
      </motion.div>
    </motion.div>
  )
}
