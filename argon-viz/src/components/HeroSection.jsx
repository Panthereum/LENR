import { useEffect, useRef } from 'react'
import { ReactorScene } from '../three/ReactorScene'

export default function HeroSection() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    sceneRef.current = new ReactorScene(canvasRef.current)
    return () => sceneRef.current?.destroy()
  }, [])

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="reactor-canvas" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Live Simulation
        </div>
        <h1 className="hero-title">
          Sonoluminescence
          <br />
          <span className="gradient-text">LENR Reactor</span>
        </h1>
        <p className="hero-subtitle">
          Open-source Low Energy Nuclear Reaction visualization — acoustic cavitation,
          plasma dynamics, and real-time FEA results at your fingertips.
        </p>
        <div className="hero-actions">
          <a href="#dashboard" className="btn btn-primary">
            <i className="fas fa-chart-line" /> View Dashboard
          </a>
          <a
            href="https://github.com/panthereum/lenr"
            className="btn btn-outline"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-github" /> GitHub
          </a>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span>Scroll to explore</span>
        <i className="fas fa-chevron-down" />
      </div>
    </section>
  )
}
