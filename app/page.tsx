"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; hue: number }[]>([])

  // Advanced particle system with orbs
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

    // Initialize orbs
    if (orbsRef.current.length === 0) {
      for (let i = 0; i < 5; i++) {
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 200 + Math.random() * 150,
          hue: 262 + (Math.random() - 0.5) * 20,
        })
      }
    }

    // Stars
    const stars: { x: number; y: number; size: number; speed: number }[] = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    let frame = 0
    const animate = () => {
      frame++
      ctx.fillStyle = "rgba(9, 9, 11, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw floating orbs with blur effect
      orbsRef.current.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy

        if (orb.x < -orb.size) orb.x = canvas.width + orb.size
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size)
        gradient.addColorStop(0, `hsla(${orb.hue}, 83%, 58%, 0.15)`)
        gradient.addColorStop(0.5, `hsla(${orb.hue}, 83%, 58%, 0.05)`)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw twinkling stars
      stars.forEach((star) => {
        const twinkle = Math.sin(frame * star.speed * 0.1) * 0.5 + 0.5
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.6})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2)
        ctx.fill()
      })

      // Central glow pulse
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const pulseSize = 250 + Math.sin(frame * 0.02) * 50
      const centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize)
      centerGrad.addColorStop(0, `hsla(262, 83%, 58%, ${0.1 + Math.sin(frame * 0.02) * 0.05})`)
      centerGrad.addColorStop(1, "transparent")
      ctx.fillStyle = centerGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2)
      ctx.fill()

      // Rotating ring
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(frame * 0.005)
      ctx.strokeStyle = `hsla(262, 83%, 58%, ${0.1 + Math.sin(frame * 0.03) * 0.05})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, 180, 0, Math.PI * 2)
      ctx.stroke()
      
      // Dots on ring
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + frame * 0.01
        const dotX = Math.cos(angle) * 180
        const dotY = Math.sin(angle) * 180
        ctx.fillStyle = `hsla(262, 83%, 58%, ${0.4 + Math.sin(frame * 0.05 + i) * 0.3})`
        ctx.beginPath()
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

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

    const duration = 3000
    const steps = 100
    const increment = 100 / steps
    const intervalTime = duration / steps

    let current = 0
    const interval = setInterval(() => {
      current += increment + Math.random() * 0.5
      const eased = Math.min(100, current)
      setProgress(eased)
      if (current >= 100) {
        clearInterval(interval)
        setProgress(100)
        setPhase(1)
        setTimeout(() => {
          setPhase(2)
          setTimeout(() => router.replace("/dashboard"), 600)
        }, 800)
      }
    }, intervalTime)

    return () => clearInterval(interval)
  }, [router])

  // Text animation
  useEffect(() => {
    const texts = ["Inicializando sistema...", "Conectando ao servidor...", "Carregando modulos...", "Preparando interface...", "Quase pronto..."]
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const loadingTexts = ["Inicializando sistema...", "Conectando ao servidor...", "Carregando modulos...", "Preparando interface...", "Quase pronto..."]

  return (
    <div
      className="fixed inset-0 bg-[#09090b] flex items-center justify-center overflow-hidden"
      style={{
        opacity: phase === 2 ? 0 : 1,
        transform: phase === 2 ? "scale(1.1)" : "scale(1)",
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)" }} />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated rings behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: 120 + ring * 60,
                height: 120 + ring * 60,
                borderColor: `hsla(262, 83%, 58%, ${0.1 - ring * 0.02})`,
                animation: `pulse-ring ${2 + ring * 0.5}s ease-in-out infinite ${ring * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Logo container */}
        <div
          className="relative mb-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(0.7)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Outer glow */}
          <div
            className="absolute -inset-8 rounded-3xl blur-3xl"
            style={{
              background: phase === 1 
                ? "linear-gradient(135deg, hsla(142, 76%, 46%, 0.4), hsla(142, 76%, 46%, 0.2))"
                : "linear-gradient(135deg, hsla(262, 83%, 58%, 0.4), hsla(280, 70%, 50%, 0.2))",
              transition: "all 0.8s ease",
            }}
          />

          {/* Spinning outer border */}
          <div
            className="absolute -inset-1 rounded-2xl"
            style={{
              background: phase === 1
                ? "conic-gradient(from 0deg, hsl(142 76% 46%), hsl(142 76% 60%), hsl(142 76% 46%))"
                : "conic-gradient(from 0deg, hsl(262 83% 58%), hsl(280 70% 50%), hsl(320 80% 50%), hsl(262 83% 58%))",
              animation: "spin 3s linear infinite",
              opacity: 0.8,
              transition: "all 0.8s ease",
            }}
          />
          <div className="absolute inset-0 rounded-2xl bg-[#09090b]" />

          {/* Inner card */}
          <div
            className="relative w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: phase === 1
                ? "linear-gradient(135deg, hsl(142 76% 46%), hsl(142 76% 36%))"
                : "linear-gradient(135deg, hsl(262 83% 58%), hsl(280 70% 50%))",
              boxShadow: phase === 1
                ? "0 20px 60px hsla(142, 76%, 46%, 0.4), inset 0 1px 0 hsla(142, 76%, 70%, 0.3)"
                : "0 20px 60px hsla(262, 83%, 58%, 0.4), inset 0 1px 0 hsla(262, 83%, 80%, 0.3)",
              transition: "all 0.8s ease",
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)",
              }}
            />
            
            {/* Moving shine */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ opacity: phase === 1 ? 0 : 1, transition: "opacity 0.5s" }}
            >
              <div
                className="absolute w-full h-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  animation: "shine 2s ease-in-out infinite",
                }}
              />
            </div>

            <span 
              className="relative text-4xl font-black text-white tracking-tight select-none"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              GV
            </span>
          </div>
        </div>

        {/* Title with typing effect */}
        <div className="text-center space-y-3 mb-10">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              background: phase === 1
                ? "linear-gradient(135deg, hsl(142 76% 46%), hsl(142 76% 60%))"
                : "linear-gradient(135deg, #fff, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GV Software
          </h1>
          <p
            className="text-sm tracking-[0.3em] uppercase font-medium"
            style={{
              opacity: mounted ? 0.6 : 0,
              transform: mounted ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
              color: "hsl(262 30% 70%)",
            }}
          >
            Painel Administrativo
          </p>
        </div>

        {/* Progress section */}
        <div
          className="w-80"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        >
          {/* Progress bar container */}
          <div className="relative">
            {/* Background track */}
            <div className="h-2 rounded-full bg-white/5 overflow-hidden backdrop-blur-sm border border-white/5">
              {/* Animated background shimmer */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.1), transparent)",
                  animation: "shimmer 2s linear infinite",
                  opacity: phase === 1 ? 0 : 1,
                  transition: "opacity 0.5s",
                }}
              />
              
              {/* Progress fill */}
              <div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: phase === 1
                    ? "linear-gradient(90deg, hsl(142 76% 46%), hsl(142 76% 56%))"
                    : "linear-gradient(90deg, hsl(262 83% 58%), hsl(280 70% 50%), hsl(320 80% 50%))",
                  backgroundSize: "200% 100%",
                  animation: phase === 1 ? "none" : "gradient-move 2s linear infinite",
                  boxShadow: phase === 1
                    ? "0 0 20px hsl(142 76% 46% / 0.6), 0 0 40px hsl(142 76% 46% / 0.3)"
                    : "0 0 20px hsl(262 83% 58% / 0.6), 0 0 40px hsl(262 83% 58% / 0.3)",
                  transition: "width 0.1s ease-out, background 0.8s ease, box-shadow 0.8s ease",
                }}
              >
                {/* Shine on progress */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                    animation: "progress-shine 1s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* Percentage indicator */}
            <div
              className="absolute -top-7 transition-all duration-100 ease-out"
              style={{ left: `${Math.min(progress, 95)}%` }}
            >
              <span
                className="text-xs font-mono font-bold px-2 py-1 rounded-md"
                style={{
                  background: phase === 1 ? "hsl(142 76% 46%)" : "hsl(262 83% 58%)",
                  color: "white",
                  boxShadow: phase === 1
                    ? "0 4px 12px hsl(142 76% 46% / 0.4)"
                    : "0 4px 12px hsl(262 83% 58% / 0.4)",
                  transition: "all 0.5s ease",
                }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Status text with animation */}
          <div className="mt-6 h-5 flex items-center justify-center">
            {phase === 1 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Sistema pronto</span>
              </div>
            ) : (
              <p
                className="text-sm text-white/50 font-mono"
                style={{
                  animation: "fade-text 0.3s ease-in-out",
                }}
                key={textIndex}
              >
                {loadingTexts[textIndex]}
              </p>
            )}
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div
          className="mt-12 flex items-center gap-4"
          style={{
            opacity: mounted ? 0.3 : 0,
            transition: "opacity 1s ease 1s",
          }}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-500"
                style={{
                  animation: `bounce-dot 1s ease-in-out ${i * 0.15}s infinite`,
                  opacity: phase === 1 ? 0 : 1,
                  transition: "opacity 0.5s",
                }}
              />
            ))}
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[10px] text-white/30 font-mono tracking-widest">v2.0</span>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[10px] text-white/30 font-mono">GV SOFTWARE</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes progress-shine {
          0%, 100% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.1; }
        }
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fade-text {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
