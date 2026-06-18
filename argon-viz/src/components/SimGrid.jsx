import { useEffect, useRef, useState } from 'react'

const SIM_RESULTS = [
  { id: 1, freq: 20, band: 'low', amplitude: 0.42, pressure: 1.18, cavitation: 0.31, status: 'stable', waveform: 'sinusoidal' },
  { id: 2, freq: 30, band: 'low', amplitude: 0.67, pressure: 1.85, cavitation: 0.54, status: 'stable', waveform: 'sinusoidal' },
  { id: 3, freq: 40, band: 'low', amplitude: 0.91, pressure: 2.43, cavitation: 0.78, status: 'stable', waveform: 'harmonic' },
  { id: 4, freq: 50, band: 'mid', amplitude: 1.24, pressure: 3.11, cavitation: 1.05, status: 'active', waveform: 'harmonic' },
  { id: 5, freq: 60, band: 'mid', amplitude: 1.58, pressure: 3.79, cavitation: 1.42, status: 'active', waveform: 'harmonic' },
  { id: 6, freq: 70, band: 'mid', amplitude: 1.87, pressure: 4.32, cavitation: 1.76, status: 'active', waveform: 'nonlinear' },
  { id: 7, freq: 80, band: 'high', amplitude: 2.14, pressure: 4.98, cavitation: 2.08, status: 'peak', waveform: 'nonlinear' },
  { id: 8, freq: 90, band: 'high', amplitude: 2.41, pressure: 5.52, cavitation: 2.35, status: 'peak', waveform: 'chaotic' },
  { id: 9, freq: 100, band: 'high', amplitude: 2.29, pressure: 5.18, cavitation: 2.17, status: 'active', waveform: 'chaotic' },
  { id: 10, freq: 110, band: 'high', amplitude: 1.93, pressure: 4.41, cavitation: 1.88, status: 'active', waveform: 'chaotic' }
]

const FILTERS = [
  { key: '*', label: 'All' },
  { key: 'low', label: '20–40 kHz' },
  { key: 'mid', label: '50–70 kHz' },
  { key: 'high', label: '80–110 kHz' },
  { key: 'peak', label: 'Peak' }
]

const STATUS_COLOR = {
  stable: '#2dce89',
  active: '#11cdef',
  peak: '#fb6340'
}

export default function SimGrid() {
  const gridRef = useRef(null)
  const isotopeRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('*')

  useEffect(() => {
    let iso = null
    import('isotope-layout').then(({ default: Isotope }) => {
      iso = new Isotope(gridRef.current, {
        itemSelector: '.sim-card',
        layoutMode: 'fitRows',
        transitionDuration: '0.4s',
        fitRows: { gutter: 16 }
      })
      isotopeRef.current = iso
    })
    return () => iso?.destroy()
  }, [])

  const applyFilter = (key) => {
    setActiveFilter(key)
    const filter = key === '*' ? '*' : `.band-${key}, .status-${key}`
    isotopeRef.current?.arrange({ filter })
  }

  return (
    <section className="section" id="results">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Isotope.js Grid</span>
          <h2 className="section-title">Simulation Results</h2>
          <p className="section-desc">
            FEA output for each frequency step — filter by band or operating mode.
          </p>
        </div>

        <div className="filter-bar">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => applyFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="isotope-grid">
          {SIM_RESULTS.map(r => (
            <div
              key={r.id}
              className={`sim-card band-${r.band} status-${r.status}`}
            >
              <div className="sim-card-header">
                <span className="sim-freq">{r.freq} kHz</span>
                <span
                  className="sim-status"
                  style={{ color: STATUS_COLOR[r.status] }}
                >
                  <span
                    className="status-dot"
                    style={{ background: STATUS_COLOR[r.status] }}
                  />
                  {r.status}
                </span>
              </div>

              <div className="sim-waveform-label">{r.waveform}</div>

              <div className="sim-metrics">
                <div className="sim-metric">
                  <span className="metric-label">Amplitude</span>
                  <div className="metric-bar-track">
                    <div
                      className="metric-bar"
                      style={{
                        width: `${(r.amplitude / 2.41) * 100}%`,
                        background: '#5e72e4'
                      }}
                    />
                  </div>
                  <span className="metric-val">{r.amplitude} MPa</span>
                </div>
                <div className="sim-metric">
                  <span className="metric-label">Pressure</span>
                  <div className="metric-bar-track">
                    <div
                      className="metric-bar"
                      style={{
                        width: `${(r.pressure / 5.52) * 100}%`,
                        background: '#11cdef'
                      }}
                    />
                  </div>
                  <span className="metric-val">{r.pressure} bar</span>
                </div>
                <div className="sim-metric">
                  <span className="metric-label">Cavitation</span>
                  <div className="metric-bar-track">
                    <div
                      className="metric-bar"
                      style={{
                        width: `${(r.cavitation / 2.35) * 100}%`,
                        background: '#fb6340'
                      }}
                    />
                  </div>
                  <span className="metric-val">{r.cavitation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
