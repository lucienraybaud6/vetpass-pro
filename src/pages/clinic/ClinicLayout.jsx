import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'

const NAV = [
  { path: '/clinique', label: 'Tableau de bord', icon: '📊', exact: true },
  { path: '/clinique/patients', label: 'Patients', icon: '🐾' },
  { path: '/clinique/rappels', label: 'Rappels', icon: '🔔', badge: 3 },
  { path: '/clinique/messagerie', label: 'Messagerie', icon: '💬', badge: 2 },
  { path: '/clinique/fiches', label: 'Fiches éducatives', icon: '📚' },
]

export default function ClinicLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--slate-50)' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? 64 : 240, flexShrink: 0, background: 'var(--teal-900)',
        display: 'flex', flexDirection: 'column', transition: 'width .25s', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 50, overflowX: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 16px' : '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10, minHeight: 72 }}>
          <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🐾</span>
          {!collapsed && <div>
            <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.2rem', lineHeight: 1 }}>VetPass</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--teal-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pro · Clinique</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ path, label, icon, badge, exact }) => {
            const active = isActive(path, exact)
            return (
              <Link key={path} to={path} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 'var(--radius-md)', color: active ? '#fff' : 'rgba(255,255,255,.55)',
                background: active ? 'rgba(255,255,255,.12)' : 'transparent',
                transition: 'all .15s', position: 'relative', textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.55)' } }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
                {!collapsed && <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}>{label}</span>}
                {!collapsed && badge && <span style={{ marginLeft: 'auto', background: 'var(--teal-400)', color: 'var(--teal-900)', fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px', borderRadius: 100 }}>{badge}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link to="/proprietaire" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', color: 'rgba(255,255,255,.5)', textDecoration: 'none', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
            <span>👤</span>{!collapsed && 'Vue Propriétaire'}
          </Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', color: 'rgba(255,255,255,.5)', textDecoration: 'none', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
            <span>🏠</span>{!collapsed && 'Site public'}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', color: 'rgba(255,255,255,.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', width: '100%', whiteSpace: 'nowrap' }}>
            <span>{collapsed ? '→' : '←'}</span>{!collapsed && 'Réduire'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft: collapsed ? 64 : 240, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left .25s', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 60, background: '#fff', borderBottom: '1px solid var(--slate-200)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', position: 'sticky', top: 0, zIndex: 40, gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--slate-100)', borderRadius: 'var(--radius-md)', padding: '7px 14px' }}>
              <span style={{ fontSize: '0.8rem' }}>🔍</span>
              <input placeholder="Rechercher un patient..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', color: 'var(--slate-700)', width: 200 }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--slate-100)', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>🔔</button>
              <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, background: 'var(--teal-600)', borderRadius: '50%', fontSize: '0.65rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--teal-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>DM</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-800)', lineHeight: 1 }}>Dr. Martin</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>Clinique du Parc</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 32, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
