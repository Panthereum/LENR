import { useEffect, useRef } from 'react'
import { drawFrequencyChart } from '../d3/FrequencyChart'

export default function FrequencyChart() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    drawFrequencyChart(containerRef.current)

    const observer = new ResizeObserver(() => drawFrequencyChart(containerRef.current))
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section" id="charts">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">D3.js Analysis</span>
          <h2 className="section-title">Frequency Response Spectrum</h2>
          <p className="section-desc">
            Acoustic amplitude and cavity pressure across the 20–110 kHz ultrasonic sweep,
            derived from Elmer FEM finite-element simulation.
          </p>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <div className="card-title-row">
              <span className="card-title">
                <i className="fas fa-chart-area" /> Amplitude &amp; Pressure vs. Frequency
              </span>
              <div className="chart-legend-inline">
                <span className="legend-dot" style={{ background: '#5e72e4' }} />
                Amplitude (MPa)
                <span className="legend-dot ml-16" style={{ background: '#11cdef' }} />
                Pressure (bar)
              </div>
            </div>
          </div>
          <div ref={containerRef} className="chart-container" style={{ height: 320 }} />
        </div>
      </div>
    </section>
  )
}
