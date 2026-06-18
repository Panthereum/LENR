import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <a className="navbar-brand" href="#top">
          <span className="brand-icon">⚛</span>
          <span className="brand-text">LENR <span className="brand-accent">Viz</span></span>
        </a>

        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {[
            { href: '#dashboard', label: 'Dashboard', icon: 'tachometer-alt' },
            { href: '#charts', label: 'Analysis', icon: 'chart-area' },
            { href: '#results', label: 'Results', icon: 'table' },
            { href: '#about', label: 'About', icon: 'info-circle' }
          ].map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <i className={`fas fa-${item.icon}`} />
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/panthereum/lenr"
              className="nav-link nav-link-github"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-github" /> Source
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
