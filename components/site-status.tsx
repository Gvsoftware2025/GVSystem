"use client"

import { Activity, Wifi, Clock, Server } from "lucide-react"
import { motion } from "framer-motion"

const statusItems = [
  { label: "API Server", status: "online", latency: "12ms" },
  { label: "Database", status: "online", latency: "8ms" },
  { label: "CDN", status: "online", latency: "24ms" },
]

export function SiteStatus() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="premium-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Status do Sistema</h2>
          <p className="text-xs text-muted-foreground">Monitoramento em tempo real</p>
        </div>
      </div>

      {/* Main Status */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full status-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">Todos os sistemas operacionais</p>
              <p className="text-xs text-emerald-400/60">Ultima verificacao: agora</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">99.9%</p>
            <p className="text-[10px] text-emerald-400/60 uppercase tracking-wider">Uptime</p>
          </div>
        </div>
      </motion.div>

      {/* Status List */}
      <div className="space-y-3">
        {statusItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + (index * 0.1) }}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono">{item.latency}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs text-emerald-400 capitalize">{item.status}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Wifi className="w-3.5 h-3.5 text-primary" />
            <span className="text-lg font-bold text-foreground">0</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Incidentes</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-lg font-bold text-foreground">30d</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sem problemas</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
