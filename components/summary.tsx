import { BarChart3 } from "lucide-react"

export function Summary() {
  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-up stagger-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Resumo</h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Projetos</span>
            <span className="text-lg font-bold text-foreground">0</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-0 transition-all duration-1000" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Tecnologias</span>
            <span className="text-lg font-bold text-foreground">12</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-3/4 transition-all duration-1000" />
          </div>
        </div>
      </div>
    </div>
  )
}
