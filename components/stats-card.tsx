"use client"

import type React from "react"
import Link from "next/link"

interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconColor: string
  href?: string
  delay?: number
}

export function StatsCard({ title, value, icon, iconColor, href, delay = 0 }: StatsCardProps) {
  const content = (
    <div
      className="glass-card rounded-xl p-5 cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColor} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground tabular-nums">{value}</p>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }

  return content
}
