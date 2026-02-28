"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

function FloatingParticle({ delay, size, x, duration }: { delay: number; size: number; x: number; duration: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "-10%",
        background: `radial-gradient(circle, hsl(262 83% 58% / 0.6), transparent)`,
        animation: `floatUp ${duration}s ease-out ${delay}s infinite`,
        opacity: 0,
      }}
    />
  )
}

export default function Home() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0) // 0: loading, 1: complete, 2: exiting
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated grid background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let frame = 0
    const animate = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw subtle grid lines that pulse
      const gridSize = 60
      const pulse = Math.sin(frame * 0.02) * 0.3 + 0.7

      ctx.strokeStyle = `rgba(139, 92, 246, ${0.03 * pulse})`
      ctx.lineWidth = 0.5

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw a few glowing intersection points
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 200 + Math.sin(frame * 0.015) * 50

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
          if (dist < radius) {
            const intensity = (1 - dist / radius) * 0.4 * pulse
            ctx.beginPath()
            ctx.arc(x, y, 1.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(139, 92, 246, ${intensity})`
            ctx.fill()
          }
        }
      }

      requestAnimationFrame(animate)
    }
    const animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  // Progress animation
  useEffect(() => {
    setMounted(true)

    const duration = 2400
    const steps = 80
    const increment = 100 / steps
    const intervalTime = duration / steps

    let current = 0
    const interval = setInterval(() => {
      current += increment
      const eased = Math.min(100, current + Math.sin((current / 100) * Math.PI) * 10)
      setProgress(eased)
      if (current >= 100) {
        clearInterval(interval)
        setProgress(100)
        setPhase(1)
        setTimeout(() => {
          setPhase(2)
          setTimeout(() => router.replace("/dashboard"), 400)
        }, 600)
      }
    }, intervalTime)

    return () => clearInterval(interval)
  }, [router])

  const statusItems = [
    { threshold: 0, text: "Inicializando nucleo..." },
    { threshold: 20, text: "Conectando ao servidor..." },
    { threshold: 40, text: "Autenticando credenciais..." },
    { threshold: 60, text: "Carregando modulos..." },
    { threshold: 80, text: "Preparando interface..." },
    { threshold: 95, text: "Sistema pronto" },
  ]

  const currentStatus = [...statusItems].reverse().find(s => progress >= s.threshold)?.text || ""

  return (
    <div
      className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden"
      style={{
        opacity: phase === 2 ? 0 : 1,
        transform: phase === 2 ? "scale(1.05)" : "scale(1)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {/* Animated canvas grid */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{
          background: "radial-gradient(circle, hsl(262 83% 58% / 0.15), transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.4}
          size={Math.random() * 4 + 2}
          x={Math.random() * 100}
          duration={4 + Math.random() * 3}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div
          className="relative"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(30px) scale(0.8)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Spinning border */}
          <div
            className="absolute -inset-[3px] rounded-2xl"
            style={{
              background: "conic-gradient(from 0deg, hsl(262 83% 58%), transparent 30%, transparent 70%, hsl(262 83% 58%))",
              opacity: phase === 1 ? 0 : 0.6,
              animation: "spin 2.5s linear infinite",
              transition: "opacity 0.5s ease",
            }}
          />
          <div className="absolute -inset-[1px] rounded-2xl bg-background" />

          {/* Glow effect */}
          <div
            className="absolute -inset-6 rounded-3xl blur-2xl"
            style={{
              background: "hsl(262 83% 58% / 0.2)",
              opacity: phase === 1 ? 0.8 : 0.3,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Logo box */}
          <div
            className="relative w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: phase === 1
                ? "linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 45%))"
                : "linear-gradient(135deg, hsl(262 83% 58% / 0.9), hsl(262 83% 45% / 0.9))",
              boxShadow: "0 8px 32px hsl(262 83% 58% / 0.3), inset 0 1px 0 hsl(262 83% 70% / 0.2)",
              transition: "all 0.5s ease",
            }}
          >
            {/* Inner shine */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
              }}
            />
            <span className="relative text-3xl font-bold text-white tracking-tight select-none">GV</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-bold text-foreground tracking-tight"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            GV Software
          </h1>
          <p
            className="text-sm text-muted-foreground tracking-widest uppercase"
            style={{
              opacity: mounted ? 0.7 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s",
            }}
          >
            Painel Administrativo
          </p>
        </div>

        {/* Progress area */}
        <div
          className="w-72"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}
        >
          {/* Progress bar */}
          <div className="relative h-1.5 bg-secondary/60 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Shimmer */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ opacity: progress < 100 ? 1 : 0, transition: "opacity 0.5s" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(262 83% 58% / 0.1), transparent)",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
            </div>
            {/* Fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: phase === 1
                  ? "linear-gradient(90deg, hsl(142 76% 46%), hsl(142 76% 56%))"
                  : "linear-gradient(90deg, hsl(262 83% 58%), hsl(262 83% 68%))",
                boxShadow: phase === 1
                  ? "0 0 12px hsl(142 76% 46% / 0.5)"
                  : "0 0 12px hsl(262 83% 58% / 0.4)",
                transition: "width 0.15s ease-out, background 0.5s ease, box-shadow 0.5s ease",
              }}
            />
          </div>

          {/* Status line */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-[11px] text-muted-foreground font-mono">
              {phase === 1 ? (
                <span className="text-emerald-400">Sistema carregado</span>
              ) : (
                currentStatus
              )}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono tabular-nums">
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          className="flex items-center gap-2 mt-2"
          style={{
            opacity: mounted ? 0.4 : 0,
            transition: "opacity 1s ease 0.8s",
          }}
        >
          <div className="w-8 h-px bg-border" />
          <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-[0.2em]">v2.0</span>
          <div className="w-8 h-px bg-border" />
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0); }
          10% { opacity: 0.6; }
          90% { opacity: 0; }
          100% { opacity: 0; transform: translateY(-100vh); }
        }
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  )
}
