import { useEffect } from 'react'
import { mountStatsPanel } from '../vue/StatsApp'

export default function StatsPanel() {
  useEffect(() => {
    const app = mountStatsPanel('#vue-stats-mount')
    return () => app?.unmount()
  }, [])

  return (
    <section className="section" id="dashboard">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Vue.js Live Telemetry</span>
          <h2 className="section-title">Reactor Telemetry</h2>
          <p className="section-desc">
            Real-time operating parameters updated every 1.2 s — powered by a Vue 3 reactive component
            mounted alongside the React app.
          </p>
        </div>
        <div id="vue-stats-mount" />
      </div>
    </section>
  )
}
