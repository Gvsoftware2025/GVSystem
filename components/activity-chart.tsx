"use client"

import { motion } from "framer-motion"
import { TrendingUp, ArrowUpRight, Eye, Users, MousePointer } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
  { name: "Seg", visitas: 120, cliques: 45 },
  { name: "Ter", visitas: 180, cliques: 78 },
  { name: "Qua", visitas: 150, cliques: 62 },
  { name: "Qui", visitas: 220, cliques: 95 },
  { name: "Sex", visitas: 280, cliques: 120 },
  { name: "Sab", visitas: 190, cliques: 85 },
  { name: "Dom", visitas: 160, cliques: 70 },
]

const stats = [
  { label: "Visitas Totais", value: "1,300", change: "+12%", icon: Eye, color: "text-primary" },
  { label: "Usuarios Unicos", value: "892", change: "+8%", icon: Users, color: "text-blue-400" },
  { label: "Taxa de Cliques", value: "42%", change: "+5%", icon: MousePointer, color: "text-amber-400" },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.dataKey === 'visitas' ? 'bg-primary' : 'bg-blue-400'}`} />
            <span className="text-sm text-foreground capitalize">{item.dataKey}:</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ActivityChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="premium-card p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Atividade da Semana</h2>
            <p className="text-xs text-muted-foreground">Visitas e engajamento</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Visitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs text-muted-foreground">Cliques</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (index * 0.1) }}
            className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <div className="flex items-center gap-1 text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-xs font-medium">{stat.change}</span>
              </div>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="h-[200px] sm:h-[250px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 45%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142 76% 45%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="visitas" 
              stroke="hsl(142 76% 45%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVisitas)" 
            />
            <Area 
              type="monotone" 
              dataKey="cliques" 
              stroke="hsl(199 89% 48%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCliques)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}
