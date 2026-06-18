import * as d3 from 'd3'

// Simulation data extracted from LENR Elmer-3a results (20kHz – 110kHz sweep)
const SIMULATION_DATA = [
  { freq: 20, amplitude: 0.42, pressure: 1.18, cavitation: 0.31 },
  { freq: 30, amplitude: 0.67, pressure: 1.85, cavitation: 0.54 },
  { freq: 40, amplitude: 0.91, pressure: 2.43, cavitation: 0.78 },
  { freq: 50, amplitude: 1.24, pressure: 3.11, cavitation: 1.05 },
  { freq: 60, amplitude: 1.58, pressure: 3.79, cavitation: 1.42 },
  { freq: 70, amplitude: 1.87, pressure: 4.32, cavitation: 1.76 },
  { freq: 80, amplitude: 2.14, pressure: 4.98, cavitation: 2.08 },
  { freq: 90, amplitude: 2.41, pressure: 5.52, cavitation: 2.35 },
  { freq: 100, amplitude: 2.29, pressure: 5.18, cavitation: 2.17 },
  { freq: 110, amplitude: 1.93, pressure: 4.41, cavitation: 1.88 }
]

export function drawFrequencyChart(container) {
  const el = typeof container === 'string' ? document.querySelector(container) : container
  if (!el) return

  // Clear previous
  d3.select(el).selectAll('*').remove()

  const margin = { top: 24, right: 32, bottom: 52, left: 56 }
  const totalW = el.clientWidth || 680
  const totalH = el.clientHeight || 320
  const W = totalW - margin.left - margin.right
  const H = totalH - margin.top - margin.bottom

  const svg = d3.select(el)
    .append('svg')
    .attr('width', totalW)
    .attr('height', totalH)
    .style('overflow', 'visible')

  // Defs — gradient fills
  const defs = svg.append('defs')

  const areaGrad = defs.append('linearGradient')
    .attr('id', 'area-grad-amplitude')
    .attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1')
  areaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#5e72e4').attr('stop-opacity', 0.5)
  areaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#5e72e4').attr('stop-opacity', 0.02)

  const pressGrad = defs.append('linearGradient')
    .attr('id', 'area-grad-pressure')
    .attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1')
  pressGrad.append('stop').attr('offset', '0%').attr('stop-color', '#11cdef').attr('stop-opacity', 0.4)
  pressGrad.append('stop').attr('offset', '100%').attr('stop-color', '#11cdef').attr('stop-opacity', 0.02)

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  // Scales
  const xScale = d3.scaleLinear()
    .domain([15, 115])
    .range([0, W])

  const yLeft = d3.scaleLinear()
    .domain([0, d3.max(SIMULATION_DATA, d => d.amplitude) * 1.15])
    .range([H, 0])

  const yRight = d3.scaleLinear()
    .domain([0, d3.max(SIMULATION_DATA, d => d.pressure) * 1.15])
    .range([H, 0])

  // Grid lines
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yLeft).ticks(5).tickSize(-W).tickFormat(''))
    .call(g2 => g2.select('.domain').remove())
    .call(g2 => g2.selectAll('line').attr('stroke', '#ffffff14').attr('stroke-dasharray', '3,4'))

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${H})`)
    .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => `${d}k`))
    .call(ax => ax.select('.domain').attr('stroke', '#ffffff30'))
    .call(ax => ax.selectAll('text').attr('fill', '#adb5bd').attr('font-size', 11))
    .call(ax => ax.selectAll('line').attr('stroke', '#ffffff20'))

  g.append('g')
    .call(d3.axisLeft(yLeft).ticks(5).tickFormat(d => `${d.toFixed(1)} MPa`))
    .call(ax => ax.select('.domain').attr('stroke', '#ffffff30'))
    .call(ax => ax.selectAll('text').attr('fill', '#adb5bd').attr('font-size', 11))
    .call(ax => ax.selectAll('line').attr('stroke', '#ffffff20'))

  g.append('g')
    .attr('transform', `translate(${W},0)`)
    .call(d3.axisRight(yRight).ticks(5).tickFormat(d => `${d.toFixed(1)} bar`))
    .call(ax => ax.select('.domain').attr('stroke', '#ffffff30'))
    .call(ax => ax.selectAll('text').attr('fill', '#adb5bd').attr('font-size', 11))
    .call(ax => ax.selectAll('line').attr('stroke', '#ffffff20'))

  // Area — amplitude
  const areaAmplitude = d3.area()
    .x(d => xScale(d.freq))
    .y0(H)
    .y1(d => yLeft(d.amplitude))
    .curve(d3.curveCatmullRom.alpha(0.5))

  g.append('path')
    .datum(SIMULATION_DATA)
    .attr('fill', 'url(#area-grad-amplitude)')
    .attr('d', areaAmplitude)

  // Area — pressure
  const areaPressure = d3.area()
    .x(d => xScale(d.freq))
    .y0(H)
    .y1(d => yRight(d.pressure))
    .curve(d3.curveCatmullRom.alpha(0.5))

  g.append('path')
    .datum(SIMULATION_DATA)
    .attr('fill', 'url(#area-grad-pressure)')
    .attr('d', areaPressure)

  // Line — amplitude
  const lineAmplitude = d3.line()
    .x(d => xScale(d.freq))
    .y(d => yLeft(d.amplitude))
    .curve(d3.curveCatmullRom.alpha(0.5))

  const ampPath = g.append('path')
    .datum(SIMULATION_DATA)
    .attr('fill', 'none')
    .attr('stroke', '#5e72e4')
    .attr('stroke-width', 2.5)
    .attr('d', lineAmplitude)

  // Animate line draw
  const ampLen = ampPath.node().getTotalLength()
  ampPath
    .attr('stroke-dasharray', `${ampLen} ${ampLen}`)
    .attr('stroke-dashoffset', ampLen)
    .transition().duration(1200).ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0)

  // Line — pressure
  const linePressure = d3.line()
    .x(d => xScale(d.freq))
    .y(d => yRight(d.pressure))
    .curve(d3.curveCatmullRom.alpha(0.5))

  const pressPath = g.append('path')
    .datum(SIMULATION_DATA)
    .attr('fill', 'none')
    .attr('stroke', '#11cdef')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6,3')
    .attr('d', linePressure)

  const pressLen = pressPath.node().getTotalLength()
  pressPath
    .attr('stroke-dasharray', `${pressLen} ${pressLen}`)
    .attr('stroke-dashoffset', pressLen)
    .transition().delay(300).duration(1200).ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0)
    .on('end', () => pressPath.attr('stroke-dasharray', '6,3'))

  // Dots — amplitude (interactive)
  const tooltip = d3.select(el)
    .append('div')
    .attr('class', 'chart-tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(10,12,30,0.92)')
    .style('border', '1px solid #5e72e4')
    .style('border-radius', '6px')
    .style('padding', '8px 12px')
    .style('font-size', '12px')
    .style('color', '#fff')
    .style('pointer-events', 'none')
    .style('opacity', 0)

  g.selectAll('.dot-amp')
    .data(SIMULATION_DATA)
    .enter().append('circle')
    .attr('class', 'dot-amp')
    .attr('cx', d => xScale(d.freq))
    .attr('cy', d => yLeft(d.amplitude))
    .attr('r', 0)
    .attr('fill', '#5e72e4')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .transition().delay((_, i) => i * 100 + 600).duration(400)
    .attr('r', 5)

  g.selectAll('.dot-amp-hit')
    .data(SIMULATION_DATA)
    .enter().append('circle')
    .attr('class', 'dot-amp-hit')
    .attr('cx', d => xScale(d.freq))
    .attr('cy', d => yLeft(d.amplitude))
    .attr('r', 14)
    .attr('fill', 'transparent')
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      d3.select(this.parentNode)
        .selectAll('.dot-amp')
        .filter(dd => dd.freq === d.freq)
        .transition().duration(100).attr('r', 8)
      tooltip
        .style('opacity', 1)
        .html(`
          <b>${d.freq} kHz</b><br/>
          Amplitude: <span style="color:#5e72e4">${d.amplitude.toFixed(2)} MPa</span><br/>
          Pressure: <span style="color:#11cdef">${d.pressure.toFixed(2)} bar</span><br/>
          Cavitation: <span style="color:#fb6340">${d.cavitation.toFixed(2)} index</span>
        `)
    })
    .on('mousemove', function (event) {
      const rect = el.getBoundingClientRect()
      tooltip
        .style('left', (event.clientX - rect.left + 14) + 'px')
        .style('top', (event.clientY - rect.top - 40) + 'px')
    })
    .on('mouseout', function (event, d) {
      d3.select(this.parentNode)
        .selectAll('.dot-amp')
        .filter(dd => dd.freq === d.freq)
        .transition().duration(100).attr('r', 5)
      tooltip.style('opacity', 0)
    })

  // Axis labels
  g.append('text')
    .attr('x', W / 2).attr('y', H + 44)
    .attr('text-anchor', 'middle')
    .attr('fill', '#adb5bd').attr('font-size', 12)
    .text('Driving Frequency (kHz)')

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -H / 2).attr('y', -42)
    .attr('text-anchor', 'middle')
    .attr('fill', '#5e72e4').attr('font-size', 12)
    .text('Acoustic Amplitude (MPa)')

  // Legend
  const legend = g.append('g').attr('transform', `translate(${W - 200}, 0)`)
  ;[
    { color: '#5e72e4', label: 'Amplitude (MPa)' },
    { color: '#11cdef', label: 'Pressure (bar)' }
  ].forEach((item, i) => {
    const row = legend.append('g').attr('transform', `translate(0, ${i * 22})`)
    row.append('line')
      .attr('x1', 0).attr('x2', 20).attr('y1', 6).attr('y2', 6)
      .attr('stroke', item.color).attr('stroke-width', 2.5)
    row.append('text')
      .attr('x', 26).attr('y', 10)
      .attr('fill', '#cdd3e0').attr('font-size', 11)
      .text(item.label)
  })
}
