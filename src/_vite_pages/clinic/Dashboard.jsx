import React from 'react'
import { Link } from 'react-router-dom'
import { getPatients, getRdv, getFeedbacks, getStats } from '../../data/store.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function StatCard({ value, label, sub, color, icon, to }) {
  const card = (
    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '20px 24px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden', transition: 'transform .15s', cursor: to ? 'pointer' : 'default' }}
      onMouseEnter={e => to && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => to && (e.currentTarget.style.transform = '')}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--slate-900)', lineHeight: 1 }}>{value ?? '—'}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-600)', marginTop: 6 }}>{label}</div>
          {sub && <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: 2 }}>{sub}</div>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{icon}</div>
      </div>
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{card}</Link> : card
}

export default function Dashboard() {
  const patients = getPatients()
  const rdv = getRdv()
  const feedbacks = getFeedbacks()
  const stats = getStats()
  const now = new Date()

  // Rappels dans les 30 jours
  const rappelsUrgents = patients.filter(p => {
    if (!p.prochainVaccin && !p.prochainVermifuge) return false
    const dates = [p.prochainVaccin, p.prochainVermifuge, p.prochainAntiparasitaire].filter(Boolean)
    return dates.some(d => {
      const diff = (new Date(d) - now) / (1000 * 60 * 60 * 24)
      return diff < 30
    })
  })

  // RDV aujourd'hui
  const today = now.toISOString().slice(0, 10)
  const rdvAujourdhui = rdv.filter(r => r.date === today)

  // RDV du mois
  const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const rdvMois = rdv.filter(r => r.date?.startsWith(mois))

  const noteMoyenne = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.noteGlobale || 0), 0) / feedbacks.length).toFixed(1)
    : null

  const isEmpty = patients.length === 0

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Vue d'ensemble</div>
          <h2 style={{ color: 'var(--slate-900)' }}>Tableau de bord</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginTop: 4 }}>{now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Link to="/clinique/patients/nouveau">
          <button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>+ Nouveau patient</button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard value={patients.length} label="Patients actifs" color="var(--teal-600)" icon="🐾" to="/clinique/patients" />
        <StatCard value={rdvMois.length} label="RDV ce mois" sub={`${rdvAujourdhui.length} aujourd'hui`} color="var(--blue-500)" icon="📅" to="/clinique/calendrier" />
        <StatCard value={rappelsUrgents.length} label="Rappels < 30j" color="var(--amber-500)" icon="🔔" to="/clinique/patients" />
        <StatCard value={noteMoyenne ? `${noteMoyenne}★` : null} label="Satisfaction" sub={feedbacks.length ? `${feedbacks.length} avis` : 'Aucun avis'} color="var(--purple-500)" icon="⭐" to="/clinique/feedbacks" />
      </div>

      {isEmpty ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, var(--teal-900), var(--teal-800))', borderRadius: 16, padding: '36px 40px', color: '#fff' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>🚀 Bienvenue sur VetPass Pro</div>
            <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.8, maxWidth: 540, marginBottom: 24 }}>
              Votre espace vétérinaire est prêt. Ajoutez votre premier patient pour activer le tableau de bord complet — calendrier, rappels, facturation et satisfaction client.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/clinique/patients/nouveau"><button style={{ background: 'var(--teal-400)', color: 'var(--teal-900)', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>Ajouter le 1er patient →</button></Link>
              <Link to="/clinique/calendrier"><button style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, padding: '11px 24px', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>Voir le calendrier</button></Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Prochains RDV */}
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.9rem' }}>📅 Prochains rendez-vous</div>
              <Link to="/clinique/calendrier" style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 500 }}>Voir tout →</Link>
            </div>
            {rdv.filter(r => r.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map(r => (
              <div key={r.id} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--slate-100)', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--teal-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--teal-600)', fontWeight: 600 }}>{new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{r.patientNom || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{r.heure} · {r.motif} · {r.veterinaire}</div>
                </div>
              </div>
            ))}
            {rdv.filter(r => r.date >= today).length === 0 && <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem', padding: '12px 0', textAlign: 'center' }}>Aucun RDV planifié</div>}
          </div>

          {/* Rappels */}
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.9rem' }}>🔔 Rappels prioritaires</div>
              <Link to="/clinique/patients" style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 500 }}>Voir tout →</Link>
            </div>
            {rappelsUrgents.slice(0, 5).map(p => (
              <Link key={p.id} to={`/clinique/patients/${p.id}`} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--slate-100)', alignItems: 'center', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.4rem' }}>{p.avatar || '🐾'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{p.nom}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.proprietaire?.nom}</div>
                </div>
                <span style={{ fontSize: '0.7rem', background: 'var(--amber-100)', color: '#92400E', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>Rappel</span>
              </Link>
            ))}
            {rappelsUrgents.length === 0 && <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem', padding: '12px 0', textAlign: 'center' }}>✅ Aucun rappel urgent</div>}
          </div>

          {/* Derniers patients */}
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.9rem' }}>👥 Derniers patients ajoutés</div>
              <Link to="/clinique/patients" style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 500 }}>Voir tout →</Link>
            </div>
            {[...patients].sort((a, b) => b.dateCreation?.localeCompare(a.dateCreation)).slice(0, 5).map(p => (
              <Link key={p.id} to={`/clinique/patients/${p.id}`} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--slate-100)', alignItems: 'center', textDecoration: 'none' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{p.avatar || '🐾'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{p.nom} <span style={{ fontWeight: 400, color: 'var(--slate-400)' }}>— {p.race}</span></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.proprietaire?.nom}</div>
                </div>
                <span style={{ fontSize: '0.7rem', background: p.statutVaccinal === 'À jour' ? 'var(--teal-100)' : p.statutVaccinal === 'En retard' ? 'var(--red-100)' : 'var(--amber-100)', color: p.statutVaccinal === 'À jour' ? 'var(--teal-700)' : p.statutVaccinal === 'En retard' ? 'var(--red-500)' : '#92400E', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>{p.statutVaccinal || '—'}</span>
              </Link>
            ))}
          </div>

          {/* Derniers avis */}
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.9rem' }}>⭐ Derniers avis clients</div>
              <Link to="/clinique/feedbacks" style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 500 }}>Voir tout →</Link>
            </div>
            {feedbacks.slice(-5).reverse().map(f => (
              <div key={f.id} style={{ padding: '9px 0', borderBottom: '1px solid var(--slate-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{f.patientNom}</span>
                  <span style={{ color: 'var(--amber-500)', fontWeight: 700, fontSize: '0.9rem' }}>{'★'.repeat(f.noteGlobale || 0)}</span>
                </div>
                {f.commentaire && <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>"{f.commentaire}"</div>}
              </div>
            ))}
            {feedbacks.length === 0 && <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem', padding: '12px 0', textAlign: 'center' }}>Aucun avis pour l'instant</div>}
          </div>
        </div>
      )}
    </div>
  )
}
