'use client'

import { motion } from 'framer-motion'
import { Sparkles, Calendar, TrendingUp } from 'lucide-react'

interface DashboardHeroProps {
  userName?: string
  currentDate: string
}

export function DashboardHero({ userName = 'Usuário', currentDate }: DashboardHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative mb-8 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left side */}
          <motion.div variants={itemVariants} className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3,
                }}
                className="relative"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/30 overflow-hidden">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/40 blur-lg"
                  />
                  <Sparkles className="w-7 h-7 text-primary-foreground relative z-10" />
                </div>
              </motion.div>

              <div>
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl font-bold text-foreground"
                >
                  Bem-vindo, <span className="gradient-text">{userName}</span>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-muted-foreground mt-1"
                >
                  Seu painel de controle centralizado
                </motion.p>
              </div>
            </div>

            {/* Quick info */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 mt-4"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 border border-border">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground">{currentDate}</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs sm:text-sm text-primary font-medium">Dashboard ativo</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - Status badge */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 backdrop-blur-sm cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/60" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Sistema Online</p>
                  <p className="text-xs text-emerald-400/70">Todos os serviços operacionais</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
