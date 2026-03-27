"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, TrendingUp } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconColor: string
  href?: string
  delay?: number
  trend?: number
}

export function StatsCard({ title, value, icon, iconColor, href, delay = 0, trend }: StatsCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay / 1000,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="premium-card p-5 cursor-pointer group"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColor} transition-all duration-300 group-hover:scale-110`}
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            {icon}
          </motion.div>
          
          {href && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (delay / 1000) + 0.2 }}
              className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary/20"
            >
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          )}
        </div>

        {/* Title */}
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
        
        {/* Value */}
        <div className="flex items-end justify-between">
          <motion.p 
            className="text-4xl font-bold text-foreground tabular-nums"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: (delay / 1000) + 0.1,
              type: "spring",
              stiffness: 200
            }}
          >
            {value}
          </motion.p>
          
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (delay / 1000) + 0.3 }}
              className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span>{trend >= 0 ? '+' : ''}{trend}%</span>
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              delay: (delay / 1000) + 0.2,
              duration: 1,
              ease: "easeOut"
            }}
          />
        </div>
      </div>
    </motion.div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }

  return content
}
