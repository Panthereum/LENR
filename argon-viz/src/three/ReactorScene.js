import * as THREE from 'three'

export class ReactorScene {
  constructor(canvas) {
    this.canvas = canvas
    this.clock = new THREE.Clock()
    this.frame = null
    this._init()
  }

  _init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2

    // Scene & Camera
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 5)

    this._buildLights()
    this._buildReactorVessel()
    this._buildPlasmaBubble()
    this._buildAcousticWaves()
    this._buildParticleField()
    this._buildBackground()

    window.addEventListener('resize', this._onResize.bind(this))
    this._animate()
  }

  _buildLights() {
    const ambient = new THREE.AmbientLight(0x1a1a3e, 0.6)
    this.scene.add(ambient)

    const core = new THREE.PointLight(0x4488ff, 8, 10)
    core.position.set(0, 0, 0)
    this.scene.add(core)
    this.coreLight = core

    const rim = new THREE.DirectionalLight(0x88aaff, 1.5)
    rim.position.set(3, 3, 2)
    this.scene.add(rim)

    const fill = new THREE.DirectionalLight(0xff6644, 0.4)
    fill.position.set(-3, -2, -2)
    this.scene.add(fill)
  }

  _buildReactorVessel() {
    // Outer vessel — transparent glass cylinder
    const vesselGeo = new THREE.CylinderGeometry(2.2, 2.2, 3.5, 64, 1, true)
    const vesselMat = new THREE.MeshPhysicalMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 0.08,
      roughness: 0,
      metalness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    this.vessel = new THREE.Mesh(vesselGeo, vesselMat)
    this.scene.add(this.vessel)

    // Top & bottom caps
    const capGeo = new THREE.CircleGeometry(2.2, 64)
    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0x6688cc,
      transparent: true,
      opacity: 0.12,
      roughness: 0,
      metalness: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    const top = new THREE.Mesh(capGeo, capMat)
    top.position.y = 1.75
    top.rotation.x = Math.PI / 2
    this.scene.add(top)
    const bottom = top.clone()
    bottom.position.y = -1.75
    this.scene.add(bottom)

    // Electrode rods
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 12)
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xddaa44, metalness: 0.9, roughness: 0.1 })
    for (let i = 0; i < 6; i++) {
      const rod = new THREE.Mesh(rodGeo, rodMat)
      const angle = (i / 6) * Math.PI * 2
      rod.position.set(Math.cos(angle) * 1.9, 0, Math.sin(angle) * 1.9)
      this.scene.add(rod)
    }
  }

  _buildPlasmaBubble() {
    // Inner plasma bubble — the sonoluminescence core
    const geo = new THREE.SphereGeometry(0.35, 64, 64)
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      emissive: 0x2244ff,
      emissiveIntensity: 2.5,
      roughness: 0,
      metalness: 0,
      transparent: true,
      opacity: 0.9,
      transmission: 0.3,
      ior: 1.5
    })
    this.plasma = new THREE.Mesh(geo, mat)
    this.scene.add(this.plasma)

    // Outer glow halo
    const haloGeo = new THREE.SphereGeometry(0.55, 32, 32)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      depthWrite: false
    })
    this.halo = new THREE.Mesh(haloGeo, haloMat)
    this.scene.add(this.halo)
  }

  _buildAcousticWaves() {
    this.waves = []
    const count = 6
    for (let i = 0; i < count; i++) {
      const geo = new THREE.TorusGeometry(0.5 + i * 0.28, 0.012, 8, 120)
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 - i * 0.03, 0.9, 0.6),
        transparent: true,
        opacity: 0.5 - i * 0.06,
        depthWrite: false
      })
      const torus = new THREE.Mesh(geo, mat)
      torus.userData.phase = (i / count) * Math.PI * 2
      this.waves.push(torus)
      this.scene.add(torus)
    }
  }

  _buildParticleField() {
    const count = 1200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const r = 0.5 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      const hue = 0.55 + Math.random() * 0.1
      const color = new THREE.Color().setHSL(hue, 1, 0.7)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 2.5 + 0.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.particles = new THREE.Points(geo, mat)
    this.scene.add(this.particles)
  }

  _buildBackground() {
    // Starfield far background
    const count = 3000
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.4 })
    this.scene.add(new THREE.Points(geo, mat))
  }

  _animate() {
    this.frame = requestAnimationFrame(this._animate.bind(this))
    const t = this.clock.getElapsedTime()

    // Plasma bubble pulse (sonoluminescence oscillation)
    const pulse = 1 + 0.18 * Math.sin(t * 12) + 0.06 * Math.sin(t * 37)
    this.plasma.scale.setScalar(pulse)
    this.halo.scale.setScalar(pulse * 1.2 + 0.1 * Math.sin(t * 8))

    // Core light flicker
    this.coreLight.intensity = 6 + 4 * Math.abs(Math.sin(t * 12))

    // Acoustic wave propagation
    this.waves.forEach((w, i) => {
      const phase = w.userData.phase
      const scale = 1 + 0.06 * Math.sin(t * 8 + phase)
      w.scale.setScalar(scale)
      w.rotation.x = t * 0.3 + phase
      w.rotation.z = t * 0.2 + phase * 0.5
      w.material.opacity = (0.5 - i * 0.06) * (0.7 + 0.3 * Math.sin(t * 4 + phase))
    })

    // Particle drift
    this.particles.rotation.y = t * 0.05
    this.particles.rotation.x = Math.sin(t * 0.1) * 0.05

    // Slow vessel rotation
    this.vessel.rotation.y = t * 0.08

    // Camera gentle orbit
    this.camera.position.x = Math.sin(t * 0.15) * 0.6
    this.camera.position.y = Math.cos(t * 0.1) * 0.3
    this.camera.lookAt(0, 0, 0)

    this.renderer.render(this.scene, this.camera)
  }

  _onResize() {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  destroy() {
    if (this.frame) cancelAnimationFrame(this.frame)
    window.removeEventListener('resize', this._onResize.bind(this))
    this.renderer.dispose()
  }
}
