"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const duration = 2500
    const steps = 100
    const increment = 100 / steps
    const intervalTime = duration / steps

    let current = 0
    const interval = setInterval(() => {
      current += increment
      const eased = Math.min(100, current + Math.sin((current / 100) * Math.PI) * 6)
      setProgress(eased)
      if (current >= 100) {
        clearInterval(interval)
        setProgress(100)
      }
    }, intervalTime)

    const redirect = setTimeout(() => router.replace("/dashboard"), 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(redirect)
    }
  }, [router])

  const statusText =
    progress < 20
      ? "Inicializando..."
      : progress < 40
        ? "Autenticando..."
        : progress < 60
          ? "Carregando dados..."
          : progress < 80
            ? "Preparando dashboard..."
            : progress < 100
              ? "Finalizando..."
              : "Bem-vindo"

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(142 76% 45%) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{
            background: "radial-gradient(circle, hsl(199 89% 48%) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, hsl(280 65% 60%) 0%, transparent 70%)",
            animation: "float 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-4">
        {/* Animated logo */}
        <div
          className="relative"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(0.8)",
            transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Rotating circles background */}
          <div
            className="absolute -inset-8 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, hsl(142 76% 45%), hsl(199 89% 48%), hsl(280 65% 60%), hsl(142 76% 45%))",
              opacity: progress < 100 ? 0.3 : 0,
              animation: "spin 4s linear infinite",
              transition: "opacity 0.5s ease",
            }}
          />
          <div className="absolute -inset-6 rounded-full bg-background" />

          {/* Glow effect */}
          <div className="absolute -inset-3 rounded-full bg-primary/15 blur-2xl" />

          {/* Main logo */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/40 overflow-hidden">
            {/* Shine effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              style={{
                animation: "shimmer-fast 3s infinite",
              }}
            />
            <span className="text-4xl font-bold text-primary-foreground tracking-tighter select-none relative z-10">GV</span>
          </div>
        </div>

        {/* Animated text */}
        <div className="text-center">
          <h1
            className="text-4xl font-bold text-foreground tracking-tight"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
              background: "linear-gradient(135deg, hsl(0 0% 95%), hsl(142 76% 45%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GV Software
          </h1>
          <p
            className="mt-2 text-base text-muted-foreground tracking-wide"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s",
            }}
          >
            Painel Administrativo Moderno
          </p>
        </div>

        {/* Advanced progress section */}
        <div
          className="w-72"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s",
          }}
        >
          {/* Animated progress container */}
          <div className="relative h-2 bg-secondary/30 rounded-full overflow-hidden border border-primary/10 backdrop-blur-sm">
            {/* Gradient progress bar */}
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, hsl(142 76% 45%), hsl(199 89% 48%), hsl(142 76% 45%))`,
                boxShadow: `0 0 20px hsla(142, 76%, 45%, ${progress / 100})`,
              }}
            />
            {/* Animated shimmer on progress */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "shimmer-fast 2s infinite",
                transform: `translateX(${progress * 3}%)`,
              }}
            />
          </div>

          {/* Status text and percentage */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground font-medium">{statusText}</p>
            <p className="text-sm font-mono text-primary font-semibold tabular-nums">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/60"
                style={{
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom hint text */}
        <p
          className="text-xs text-muted-foreground/50 mt-4"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease-out 1s",
          }}
        >
          Preparando seu ambiente...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(0px); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }

        @keyframes shimmer-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
