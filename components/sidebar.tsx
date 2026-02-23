"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Zap,
  User,
  Mail,
  MessageSquare,
  Download,
  Store,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/projetos", label: "Projetos", icon: FileText },
  { href: "/dashboard/habilidades", label: "Habilidades", icon: Zap },
  { href: "/dashboard/sobre", label: "Sobre", icon: User },
  { href: "/dashboard/contatos", label: "Contatos", icon: Mail },
  { href: "/dashboard/feedbacks", label: "Feedbacks", icon: MessageSquare },
  { href: "/dashboard/clientes", label: "Clientes", icon: Store },
  { href: "/dashboard/databases", label: "Bancos de Dados", icon: Database },
  { href: "/dashboard/download", label: "Download", icon: Download },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 flex flex-col bg-card border-r border-border">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <span className="text-sm font-bold text-primary-foreground select-none">GV</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground leading-tight">GV Software</h2>
            <p className="text-[11px] text-muted-foreground leading-tight">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 animate-slide-in-left",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-foreground truncate">contato.gvsoftwares</p>
            <p className="text-[10px] text-muted-foreground">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
