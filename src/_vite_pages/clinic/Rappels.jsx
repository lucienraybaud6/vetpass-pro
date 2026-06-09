import React from 'react'
import { Link } from 'react-router-dom'
import { getPatients } from '../../data/store.js'

export function Rappels() {
  const patients = getPatients()
  const now = new Date()
  const rappels = patients.filter(p => {
    const dates = [p.prochainVaccin, p.prochainVermifuge, p.prochainAntiparasitaire].filter(Boolean)
    return dates.some(d => {
      const diff = (new Date(d) - now) / (1000 * 60 * 60 * 24)
      return diff < 30
    })
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Prévention</div>
        <h2 style={{ color: 'var(--slate-900)' }}>Rappels à traiter</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginTop: 4 }}>{rappels.length} patient{rappels.length !== 1 ? 's' : ''} avec rappel dans les 30 prochains jours</p>
      </div>
      {rappels.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed var(--slate-200)', borderRadius: 16, padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>✅</div>
          <div style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: 6 }}>Aucun rappel urgent</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>Tous les patients sont à jour sur leurs vaccins et traitements.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rappels.map(p => {
            const urgentDates = [
              { label: 'Vaccin', date: p.prochainVaccin },
              { label: 'Vermifuge', date: p.prochainVermifuge },
              { label: 'Antiparasitaire', date: p.prochainAntiparasitaire },
            ].filter(x => x.date && (new Date(x.date) - now) / 86400000 < 30)
            return (
              <div key={p.id} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{p.avatar || '🐾'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--slate-800)', marginBottom: 4 }}>{p.nom} <span style={{ fontWeight: 400, color: 'var(--slate-400)', fontSize: '0.85rem' }}>— {p.race}</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: 6 }}>{p.proprietaire?.nom} · {p.proprietaire?.telephone}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {urgentDates.map(({ label, date }) => {
                      const diff = Math.round((new Date(date) - now) / 86400000)
                      return <span key={label} style={{ background: diff < 0 ? 'var(--red-100)' : diff < 7 ? 'var(--amber-100)' : 'var(--teal-100)', color: diff < 0 ? 'var(--red-500)' : diff < 7 ? '#92400E' : 'var(--teal-700)', fontSize: '0.72rem', fontWeight: 600, padding: '2px 10px', borderRadius: 100 }}>{label} : {diff < 0 ? `${Math.abs(diff)}j de retard` : `dans ${diff}j`}</span>
                    })}
                  </div>
                </div>
                <Link to={`/clinique/patients/${p.id}`}><button style={{ background: 'var(--teal-50)', color: 'var(--teal-800)', border: '1px solid var(--teal-200)', borderRadius: 8, padding: '7px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Dossier →</button></Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Messagerie() {
  return null // handled by Messagerie.jsx
}

export function Fiches() {
  return null // handled by Fiches.jsx
}
