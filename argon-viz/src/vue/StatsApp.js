import { createApp, defineComponent, ref, onMounted, onUnmounted } from 'vue'

const StatsPanel = defineComponent({
  name: 'StatsPanel',
  setup() {
    const frequency = ref(80)
    const pressure = ref(4.98)
    const cavitation = ref(2.08)
    const temperature = ref(5000)
    const status = ref('ACTIVE')
    const uptime = ref(0)

    let tick = null
    let uptimeTimer = null

    onMounted(() => {
      // Simulate live readings with slight noise
      tick = setInterval(() => {
        frequency.value = parseFloat((80 + (Math.random() - 0.5) * 2).toFixed(1))
        pressure.value = parseFloat((4.98 + (Math.random() - 0.5) * 0.3).toFixed(2))
        cavitation.value = parseFloat((2.08 + (Math.random() - 0.5) * 0.15).toFixed(2))
        temperature.value = Math.round(5000 + (Math.random() - 0.5) * 800)
      }, 1200)

      uptimeTimer = setInterval(() => { uptime.value++ }, 1000)
    })

    onUnmounted(() => {
      clearInterval(tick)
      clearInterval(uptimeTimer)
    })

    const formatUptime = (s) => {
      const h = Math.floor(s / 3600).toString().padStart(2, '0')
      const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
      const sec = (s % 60).toString().padStart(2, '0')
      return `${h}:${m}:${sec}`
    }

    return { frequency, pressure, cavitation, temperature, status, uptime, formatUptime }
  },
  template: `
    <div class="vue-stats-panel">
      <div class="stats-header">
        <span class="stats-badge" :class="status === 'ACTIVE' ? 'badge-active' : 'badge-idle'">
          <span class="pulse-dot"></span>{{ status }}
        </span>
        <span class="stats-uptime">{{ formatUptime(uptime) }}</span>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-wave-square"></i></div>
          <div class="stat-body">
            <div class="stat-value blue">{{ frequency }} <span class="stat-unit">kHz</span></div>
            <div class="stat-label">Drive Frequency</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-compress-arrows-alt"></i></div>
          <div class="stat-body">
            <div class="stat-value cyan">{{ pressure }} <span class="stat-unit">bar</span></div>
            <div class="stat-label">Acoustic Pressure</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-circle-notch"></i></div>
          <div class="stat-body">
            <div class="stat-value orange">{{ cavitation }} <span class="stat-unit">idx</span></div>
            <div class="stat-label">Cavitation Index</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-thermometer-half"></i></div>
          <div class="stat-body">
            <div class="stat-value red">{{ temperature.toLocaleString() }} <span class="stat-unit">K</span></div>
            <div class="stat-label">Plasma Temp</div>
          </div>
        </div>
      </div>
    </div>
  `
})

export function mountStatsPanel(selector) {
  const el = document.querySelector(selector)
  if (!el) return null
  const app = createApp(StatsPanel)
  app.mount(el)
  return app
}
