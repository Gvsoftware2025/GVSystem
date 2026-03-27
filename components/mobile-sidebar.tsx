"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Zap,
  User,
  Mail,
  MessageSquare,
  Download,
  Menu,
  X,
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

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-xs font-bold text-primary-foreground select-none">GV</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground leading-tight">GV Software</h2>
              <p className="text-[10px] text-muted-foreground leading-tight">Admin</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25">
                    <span className="text-sm font-bold text-primary-foreground select-none">GV</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-sidebar-foreground leading-tight">GV Software</h2>
                    <p className="text-[11px] text-muted-foreground leading-tight">Painel Admin</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="px-3 py-5">
                <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Menu Principal
                </p>
                
                <div className="space-y-1">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-300",
                            isActive
                              ? "bg-primary/15 text-primary font-medium"
                              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                          )}
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
                            isActive 
                              ? "bg-primary/20" 
                              : "bg-sidebar-accent"
                          )}>
                            <Icon className={cn(
                              "w-4 h-4 transition-colors duration-300",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                          
                          <span>{item.label}</span>
                          
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-sidebar-border">
                <div className="glass-card rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
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
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
