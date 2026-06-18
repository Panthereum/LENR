import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsPanel from './components/StatsPanel'
import FrequencyChart from './components/FrequencyChart'
import SimGrid from './components/SimGrid'

export default function App() {
  return (
    <>
      <Navbar />

      <main id="top">
        <HeroSection />
        <StatsPanel />
        <FrequencyChart />
        <SimGrid />

        <section className="section" id="about">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">About</span>
              <h2 className="section-title">Technology Stack</h2>
            </div>
            <div className="tech-grid">
              {[
                {
                  icon: 'fas fa-cube',
                  color: '#5e72e4',
                  name: 'Three.js r176',
                  desc: '3D sonoluminescence reactor scene with WebGL — plasma bubble physics, acoustic wave rings, particle field.'
                },
                {
                  icon: 'fas fa-chart-bar',
                  color: '#11cdef',
                  name: 'D3.js v7',
                  desc: 'Interactive frequency-response spectrum chart with animated SVG paths and hover tooltips.'
                },
                {
                  icon: 'fas fa-layer-group',
                  color: '#2dce89',
                  name: 'Vue.js 3',
                  desc: 'Composition API reactive component for live telemetry — co-mounted alongside React via createApp.'
                },
                {
                  icon: 'fas fa-th',
                  color: '#fb6340',
                  name: 'Isotope.js v3',
                  desc: 'Filterable, animated masonry grid of FEA simulation result cards across 20–110 kHz.'
                },
                {
                  icon: 'fab fa-react',
                  color: '#61dafb',
                  name: 'React 19',
                  desc: 'Primary application shell with hooks-based component architecture and concurrent rendering.'
                },
                {
                  icon: 'fas fa-bolt',
                  color: '#ffd600',
                  name: 'Vite 6',
                  desc: 'ESM-native build tool powering simultaneous React + Vue plugin compilation with HMR.'
                }
              ].map(t => (
                <div key={t.name} className="tech-card">
                  <div className="tech-icon" style={{ color: t.color }}>
                    <i className={t.icon} />
                  </div>
                  <h3 className="tech-name">{t.name}</h3>
                  <p className="tech-desc">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>
            Open-source LENR Reactor Project &mdash; MIT License
          </p>
          <p className="footer-stack">
            Built with Three.js · D3.js · Vue 3 · Isotope.js · React 19 · Vite 6
          </p>
        </div>
      </footer>
    </>
  )
}
