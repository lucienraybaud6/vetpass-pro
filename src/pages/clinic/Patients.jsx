import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { patients } from '../../data/demo.js'

function Badge({ label, color, bg }) {
  return <span style={{ background: bg, color, fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>{label}</span>
}

const scoreColor = s => s >= 80 ? ['#065F46', '#D1FAE5'] : s >= 60 ? ['#1E40AF', '#DBEAFE'] : s >= 40 ? ['#92400E', '#FEF3C7'] : ['#991B1B', '#FEE2E2']

export default function Patients() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('tous')

  const filtered = patients.filter(p => {
    const q = search.toLowerCase()
    const match = p.nom.toLowerCase().includes(q) || p.proprietaire.nom.toLowerCase().includes(q) || p.race.toLowerCase().includes(q)
    if (filter === 'tous') return match
    if (filter === 'retard') return match && p.statutVaccinal === 'En retard'
    if (filter === 'rappel') return match && p.statutVaccinal === 'Rappel proche < 1 mois'
    return match
  })

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>CRM Vétérinaire</div>
          <h2 style={{ color: 'var(--slate-900)' }}>Base patients</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginTop: 4 }}>{patients.length} patients enregistrés · données de démonstration</p>
        </div>
        <button style={{ background: 'var(--teal-800)', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          + Nouveau patient
        </button>
      </div>

      {/* Filters bar */}
      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Nom, race, propriétaire..."
          style={{ flex: 1, minWidth: 200, border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '9px 14px', fontSize: '0.875rem', outline: 'none', color: 'var(--slate-700)' }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {[['tous', 'Tous'], ['retard', '🔴 En retard'], ['rappel', '🟡 Rappel proche']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 500, border: '1px solid', borderColor: filter === v ? 'var(--teal-700)' : 'var(--slate-200)', background: filter === v ? 'var(--teal-50)' : '#fff', color: filter === v ? 'var(--teal-800)' : 'var(--slate-600)', cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--slate-200)', background: 'var(--slate-50)' }}>
              {['Patient', 'Propriétaire', 'Mode de vie', 'Profil client', 'Statut vaccinal', 'Score', 'Prochain RDV', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const [sc, sb] = scoreColor(p.proprietaire.score)
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background .12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${p.couleur}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{p.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-800)' }}>{p.nom}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.race} · {p.age}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--slate-700)', fontWeight: 500 }}>{p.proprietaire.nom.split(' ')[1]}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.proprietaire.telephone}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>{p.modeVie}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.activite}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', marginBottom: 3 }}>{p.proprietaire.sensibilitePrix}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.proprietaire.profilEmotionnel}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Badge
                      label={p.statutVaccinal}
                      color={p.statutVaccinal === 'À jour' ? 'var(--teal-700)' : p.statutVaccinal === 'En retard' ? 'var(--red-500)' : '#92400E'}
                      bg={p.statutVaccinal === 'À jour' ? 'var(--teal-100)' : p.statutVaccinal === 'En retard' ? 'var(--red-100)' : 'var(--amber-100)'}
                    />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--slate-100)', borderRadius: 10, overflow: 'hidden', minWidth: 60 }}>
                        <div style={{ height: '100%', width: `${p.proprietaire.score}%`, background: sc, borderRadius: 10, transition: 'width .5s' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: sc, background: sb, padding: '1px 7px', borderRadius: 100 }}>{p.proprietaire.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>{new Date(p.prochainRDV).toLocaleDateString('fr-FR')}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/clinique/patients/${p.id}`}>
                      <button style={{ background: 'var(--teal-50)', color: 'var(--teal-800)', border: '1px solid var(--teal-200)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Voir →</button>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 48, textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.9rem' }}>Aucun patient trouvé</div>}
      </div>
    </div>
  )
}
