"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Zap,
  User,
  Mail,
  MessageSquare,
  Download,
  ChevronRight,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/projetos", label: "Projetos", icon: FileText },
  { href: "/dashboard/habilidades", label: "Habilidades", icon: Zap },
  { href: "/dashboard/sobre", label: "Sobre", icon: User },
  { href: "/dashboard/contatos", label: "Contatos", icon: Mail },
  { href: "/dashboard/feedbacks", label: "Feedbacks", icon: MessageSquare },
  { href: "/dashboard/download", label: "Download", icon: Download },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex flex-col bg-sidebar border-r border-sidebar-border relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Brand */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-5 py-6 border-b border-sidebar-border relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-sm font-bold text-primary-foreground select-none">GV</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-sidebar status-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground leading-tight">GV Software</h2>
            <p className="text-[11px] text-muted-foreground leading-tight">Painel Admin</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Menu Principal
        </motion.p>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive 
                      ? "bg-primary/20" 
                      : "bg-sidebar-accent group-hover:bg-primary/10"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4 transition-colors duration-300",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                  </div>
                  
                  <span className="flex-1">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </nav>

      {/* Settings Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-3 pb-3 relative z-10"
      >
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300 group"
        >
          <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
            <Settings className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
          </div>
          <span>Configuracoes</span>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-4 py-4 border-t border-sidebar-border relative z-10"
      >
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-sidebar-foreground truncate">contato.gvsoftwares</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  )
}
