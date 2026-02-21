"use client"

import { Button } from "@/components/ui/button"
import { Download, Smartphone, Monitor, Package, CheckCircle2, Github } from "lucide-react"

export default function DownloadPage() {
  const features = {
    desktop: [
      "Acesso direto do computador",
      "Interface nativa de desktop",
      "Sincronizacao automatica",
      "Funciona offline",
    ],
    mobile: [
      "Gerenciar do celular",
      "Notificacoes em tempo real",
      "Interface responsiva",
      "Suporte offline",
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Download className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Downloads</h1>
          <p className="text-sm text-muted-foreground">Baixe o painel para suas plataformas</p>
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            icon: Monitor,
            title: "Desktop",
            subtitle: "Windows / Mac / Linux",
            platform: "desktop",
            features: features.desktop,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            icon: Smartphone,
            title: "Mobile",
            subtitle: "Android / iOS",
            platform: "mobile",
            features: features.mobile,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map((item, index) => (
          <div
            key={item.platform}
            className="glass-card rounded-xl p-5 flex flex-col animate-fade-in-up"
            style={{ animationDelay: `${(index + 1) * 60}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
            </div>
            <ul className="space-y-2.5 mb-5 flex-1">
              {item.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
        ))}
      </div>

      {/* Source & GitHub */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Codigo Fonte</h3>
              <p className="text-xs text-muted-foreground">Repositorio completo do projeto</p>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-4 h-4 mr-2" /> Download do Codigo
          </Button>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in-up stagger-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Github className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">GitHub</h3>
              <p className="text-xs text-muted-foreground">Repositorio no GitHub</p>
            </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full">
              <Github className="w-4 h-4 mr-2" /> Visitar GitHub
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
