"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const duration = 2200
    const steps = 60
    const increment = 100 / steps
    const intervalTime = duration / steps

    let current = 0
    const interval = setInterval(() => {
      current += increment
      // Ease-out curve for natural feel
      const eased = Math.min(100, current + Math.sin((current / 100) * Math.PI) * 8)
      setProgress(eased)
      if (current >= 100) {
        clearInterval(interval)
        setProgress(100)
      }
    }, intervalTime)

    const redirect = setTimeout(() => router.replace("/dashboard"), 2600)

    return () => {
      clearInterval(interval)
      clearTimeout(redirect)
    }
  }, [router])

  const statusText =
    progress < 25
      ? "Inicializando sistema..."
      : progress < 50
        ? "Carregando componentes..."
        : progress < 75
          ? "Preparando interface..."
          : progress < 100
            ? "Quase pronto..."
            : "Bem-vindo"

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(262 83% 58% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(262 83% 58% / 0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(262 83% 58%), transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Logo mark */}
        <div
          className="relative transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.9)",
          }}
        >
          {/* Outer ring */}
          <div
            className="absolute -inset-4 rounded-[28px] transition-opacity duration-700"
            style={{
              background: "conic-gradient(from 0deg, hsl(262 83% 58%), hsl(262 83% 30%), hsl(262 83% 58%))",
              opacity: progress < 100 ? 0.4 : 0,
              animation: "spin 3s linear infinite",
            }}
          />
          <div className="absolute -inset-3 rounded-[24px] bg-background" />

          {/* Inner glow */}
          <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-xl" />

          {/* Logo box */}
          <div className="relative w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-2xl font-bold text-primary-foreground tracking-tight select-none">GV</span>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center">
          <h1
            className="text-2xl font-semibold text-foreground tracking-tight transition-all duration-700 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transitionDelay: "300ms",
            }}
          >
            GV Software
          </h1>
          <p
            className="mt-1.5 text-sm text-muted-foreground tracking-wide transition-all duration-700 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transitionDelay: "450ms",
            }}
          >
            Painel Administrativo
          </p>
        </div>

        {/* Progress section */}
        <div
          className="w-56 transition-all duration-700 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "600ms",
          }}
        >
          {/* Progress track */}
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground font-mono">{statusText}</p>
            <p className="text-xs text-muted-foreground font-mono tabular-nums">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
