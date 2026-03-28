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
    progress < 20 ? "Inicializando..." :
    progress < 40 ? "Autenticando..." :
    progress < 60 ? "Carregando dados..." :
    progress < 80 ? "Preparando dashboard..." :
    progress < 100 ? "Finalizando..." : "Bem-vindo"

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #030303 0%, #0a0a0a 50%, #030303 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Orb 1 - Green */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'floatOrb1 8s ease-in-out infinite',
      }} />
      
      {/* Orb 2 - Cyan */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
        filter: 'blur(100px)',
        animation: 'floatOrb2 10s ease-in-out infinite',
      }} />
      
      {/* Orb 3 - Purple */}
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '20%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
        filter: 'blur(90px)',
        animation: 'floatOrb3 12s ease-in-out infinite',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 1s ease',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '48px',
        padding: '24px',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        
        {/* Logo */}
        <div style={{ position: 'relative' }}>
          {/* Rotating Ring */}
          <div style={{
            position: 'absolute',
            inset: '-16px',
            borderRadius: '32px',
            background: 'conic-gradient(from 0deg, #22c55e, #06b6d4, #a855f7, #22c55e)',
            opacity: progress < 100 ? 0.6 : 0,
            animation: 'spinSlow 4s linear infinite',
            transition: 'opacity 0.5s ease',
          }} />
          <div style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '28px',
            background: '#050505',
          }} />
          
          {/* Glow */}
          <div style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '24px',
            background: 'rgba(34, 197, 94, 0.4)',
            filter: 'blur(25px)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }} />
          
          {/* Logo Box */}
          <div style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(34, 197, 94, 0.5)',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
              animation: 'shine 3s infinite',
            }} />
            <span style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
              position: 'relative',
              zIndex: 1,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>GV</span>
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #22c55e 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            letterSpacing: '-1px',
          }}>
            GV Software
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Painel Administrativo
          </p>
        </div>

        {/* Progress */}
        <div style={{ width: '320px' }}>
          <div style={{
            height: '8px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #22c55e, #06b6d4, #a855f7)',
              borderRadius: '10px',
              transition: 'width 0.15s ease-out',
              boxShadow: `0 0 30px rgba(34, 197, 94, ${progress / 100 * 0.8})`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                animation: 'shimmerMove 1.5s infinite',
              }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 500,
            }}>{statusText}</span>
            <span style={{
              fontSize: '16px',
              color: '#22c55e',
              fontWeight: 700,
              fontFamily: 'monospace',
            }}>{Math.round(progress)}%</span>
          </div>

          {/* Loading Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '32px',
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                  animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 40px) scale(1.05); }
          66% { transform: translate(35px, -45px) scale(0.9); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -40px) scale(1.15); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
