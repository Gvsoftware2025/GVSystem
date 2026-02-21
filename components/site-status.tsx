import { Activity } from "lucide-react"

export function SiteStatus() {
  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-up stagger-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-emerald-400" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Status do Site</h2>
      </div>

      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Online</span>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Uptime</span>
          <span className="text-xs font-medium text-foreground">99.9%</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Atualizado</span>
          <span className="text-xs font-medium text-foreground">Agora</span>
        </div>
      </div>
    </div>
  )
}
