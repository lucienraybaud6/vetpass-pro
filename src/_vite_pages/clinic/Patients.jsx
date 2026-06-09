import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getPatients, deletePatient } from '../../data/store.js'

export default function Patients() {
  const [search, setSearch] = useState('')
  const patients = getPatients()

  const filtered = patients.filter(p => {
    const q = search.toLowerCase()
    return !q || p.nom?.toLowerCase().includes(q) || p.race?.toLowerCase().includes(q) || p.proprietaire?.nom?.toLowerCase().includes(q)
  })

  const scoreColor = s => s >= 70 ? ['#065F46', '#D1FAE5'] : s >= 40 ? ['#1E40AF', '#DBEAFE'] : ['#92400E', '#FEF3C7']

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>CRM Vétérinaire</div>
          <h2 style={{ color: 'var(--slate-900)' }}>Base patients</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginTop: 4 }}>{patients.length} patient{patients.length !== 1 ? 's' : ''} enregistré{patients.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/clinique/patients/nouveau">
          <button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>+ Nouveau patient</button>
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: 14, marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Rechercher par nom, race, propriétaire..." style={{ width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '9px 14px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {patients.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed var(--teal-200)', borderRadius: 16, padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🐾</div>
          <div style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Aucun patient pour l'instant</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-400)', marginBottom: 24 }}>Ajoutez votre premier patient pour commencer</div>
          <Link to="/clinique/patients/nouveau"><button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter un patient</button></Link>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                {['Patient', 'Propriétaire', 'Mode de vie', 'Profil', 'Statut vaccinal', 'Code accès', ''].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{p.avatar || '🐾'}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)' }}>{p.nom}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--slate-400)' }}>{p.race} · {p.sexe?.split(' ')[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-700)', fontWeight: 500 }}>{p.proprietaire?.nom?.replace('Mme. ', '').replace('M. ', '') || '—'}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--slate-400)' }}>{p.proprietaire?.telephone}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--slate-600)' }}>{p.modeVie || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--slate-500)' }}>{p.sensibilitePrix || '—'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: p.statutVaccinal === 'À jour' ? 'var(--teal-100)' : p.statutVaccinal === 'En retard' ? 'var(--red-100)' : 'var(--amber-100)', color: p.statutVaccinal === 'À jour' ? 'var(--teal-700)' : p.statutVaccinal === 'En retard' ? 'var(--red-500)' : '#92400E', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{p.statutVaccinal || '—'}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'var(--slate-100)', padding: '3px 8px', borderRadius: 6, color: 'var(--slate-700)' }}>{p.codeAcces || '—'}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <Link to={`/clinique/patients/${p.id}`}>
                      <button style={{ background: 'var(--teal-50)', color: 'var(--teal-800)', border: '1px solid var(--teal-200)', borderRadius: 7, padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Dossier →</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && search && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--slate-400)' }}>Aucun résultat pour "{search}"</div>}
        </div>
      )}
    </div>
  )
}
