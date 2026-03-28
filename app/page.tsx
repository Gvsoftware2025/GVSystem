"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [exit, setExit] = useState(false)

  useEffect(() => {
    const duration = 2500
    const start = Date.now()

    const animate = () => {
      const elapsed = Date.now() - start
      const p = Math.min((elapsed / duration) * 100, 100)
      setProgress(p)

      if (p < 100) {
        requestAnimationFrame(animate)
      } else {
        setReady(true)
        setTimeout(() => {
          setExit(true)
          setTimeout(() => router.replace("/dashboard"), 500)
        }, 600)
      }
    }

    requestAnimationFrame(animate)
  }, [router])

  return (
    <div
      className={`fixed inset-0 bg-zinc-950 flex items-center justify-center transition-all duration-500 ${exit ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite 1s",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div 
          className="relative mb-8"
          style={{
            animation: "float 3s ease-in-out infinite",
          }}
        >
          {/* Glow */}
          <div 
            className={`absolute -inset-4 rounded-3xl blur-2xl transition-all duration-700 ${ready ? "bg-emerald-500/40" : "bg-violet-500/40"}`}
          />
          
          {/* Spinning border */}
          <div className="absolute -inset-[3px] rounded-2xl overflow-hidden">
            <div 
              className={`w-full h-full transition-all duration-700 ${ready ? "bg-emerald-500" : "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"}`}
              style={{
                animation: ready ? "none" : "spin 2s linear infinite",
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          {/* Logo box */}
          <div 
            className={`relative w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-700 ${ready ? "bg-emerald-500" : "bg-gradient-to-br from-violet-600 to-fuchsia-600"}`}
            style={{
              boxShadow: ready 
                ? "0 20px 50px rgba(16,185,129,0.4)" 
                : "0 20px 50px rgba(139,92,246,0.4)",
            }}
          >
            <span className="text-4xl font-black text-white">GV</span>
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-3xl font-bold mb-2 transition-all duration-700 ${ready ? "text-emerald-400" : "text-white"}`}
        >
          GV Software
        </h1>
        <p className="text-zinc-500 text-sm tracking-widest uppercase mb-10">
          Painel Administrativo
        </p>

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${ready ? "bg-emerald-500" : "bg-gradient-to-r from-violet-500 to-fuchsia-500"}`}
              style={{ 
                width: `${progress}%`,
                boxShadow: ready 
                  ? "0 0 20px rgba(16,185,129,0.6)" 
                  : "0 0 20px rgba(139,92,246,0.6)",
              }}
            />
          </div>

          {/* Status */}
          <div className="mt-4 text-center">
            {ready ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Pronto</span>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">{Math.round(progress)}%</p>
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-12 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-700 ${ready ? "bg-emerald-500" : "bg-violet-500"}`}
              style={{
                animation: ready ? "none" : `bounce 1s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
