import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV = [
  { path: '/clinique', label: 'Tableau de bord', icon: '📊', exact: true },
  { path: '/clinique/patients', label: 'Patients', icon: '🐾' },
  { path: '/clinique/calendrier', label: 'Calendrier', icon: '📅' },
  { path: '/clinique/facturation', label: 'Actes & Facturation', icon: '🧾' },
  { path: '/clinique/messagerie', label: 'Messagerie', icon: '💬' },
  { path: '/clinique/feedbacks', label: 'Avis clients', icon: '⭐' },
  { path: '/clinique/fiches', label: 'Fiches éducatives', icon: '📚' },
]

export default function ClinicLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--slate-50)' }}>
      <aside style={{ width: collapsed ? 64 : 240, flexShrink: 0, background: 'var(--teal-900)', display: 'flex', flexDirection: 'column', transition: 'width .25s', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, overflowX: 'hidden' }}>
        <Link to="/" style={{ padding: collapsed ? '18px 16px' : '20px 22px 16px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10, minHeight: 64, textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🐾</span>
          {!collapsed && <div>
            <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.1rem', lineHeight: 1 }}>VetPass</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--teal-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pro · Vétérinaire</div>
          </div>}
        </Link>

        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {NAV.map(({ path, label, icon, exact }) => {
            const active = isActive(path, exact)
            return (
              <Link key={path} to={path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 8, color: active ? '#fff' : 'rgba(255,255,255,.55)', background: active ? 'rgba(255,255,255,.13)' : 'transparent', transition: 'all .15s', textDecoration: 'none', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.55)' } }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                {!collapsed && <span style={{ fontSize: '0.85rem', fontWeight: active ? 600 : 400 }}>{label}</span>}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          {!collapsed && user && <div style={{ padding: '10px 12px', marginBottom: 6, background: 'rgba(255,255,255,.07)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{user.nom}</div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,.4)' }}>{user.clinique}</div>
          </div>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, color: 'rgba(255,255,255,.35)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.8rem', marginBottom: 2 }}>
            <span>{collapsed ? '→' : '←'}</span>{!collapsed && 'Réduire'}
          </button>
          <button onClick={() => { logout(); navigate('/connexion') }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, color: 'rgba(255,100,100,.7)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.8rem' }}>
            <span>🚪</span>{!collapsed && 'Déconnexion'}
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: collapsed ? 64 : 240, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left .25s', minWidth: 0 }}>
        <header style={{ height: 56, background: '#fff', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--teal-700)', background: 'var(--teal-50)', padding: '4px 12px', borderRadius: 100, fontWeight: 600 }}>🏥 Espace Vétérinaire</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/clinique/patients/nouveau">
              <button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>+ Nouveau patient</button>
            </Link>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
              {user?.nom?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'DR'}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-700)' }}>{user?.nom}</div>
          </div>
        </header>
        <main style={{ flex: 1, padding: 28, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
