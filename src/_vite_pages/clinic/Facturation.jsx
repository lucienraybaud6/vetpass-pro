import React, { useState } from 'react'
import { getActes, saveActe, deleteActe, getPatients, uid } from '../../data/store.js'

const ACTE_TYPES = ['Consultation', 'Vaccination', 'Chirurgie', 'Analyses', 'Imagerie (radio/écho)', 'Détartrage', 'Antiparasitaire', 'Vermifuge', 'Suture / Pansement', 'Hospitalisation', 'Autre']
const INP_STYLE = { width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
const SEL_STYLE = { ...INP_STYLE, background: '#fff' }

export default function Facturation() {
  const [showModal, setShowModal] = useState(false)
  const [filterPatient, setFilterPatient] = useState('')
  const [form, setForm] = useState({ patientId: '', date: new Date().toISOString().slice(0, 10), type: 'Consultation', description: '', montant: '', statut: 'Payé', notes: '' })

  const patients = getPatients()
  const allActes = getActes()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filteredActes = filterPatient ? allActes.filter(a => a.patientId === filterPatient) : allActes

  const totalCA = filteredActes.reduce((s, a) => s + (parseFloat(a.montant) || 0), 0)
  const totalPaye = filteredActes.filter(a => a.statut === 'Payé').reduce((s, a) => s + (parseFloat(a.montant) || 0), 0)
  const totalImpaye = filteredActes.filter(a => a.statut === 'Impayé').reduce((s, a) => s + (parseFloat(a.montant) || 0), 0)

  const handleSave = () => {
    const p = patients.find(x => x.id === form.patientId)
    saveActe({ ...form, id: uid('ACT'), patientNom: p?.nom || '—', createdAt: new Date().toISOString() })
    setShowModal(false)
    setForm({ patientId: '', date: new Date().toISOString().slice(0, 10), type: 'Consultation', description: '', montant: '', statut: 'Payé', notes: '' })
  }

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Suivi financier</div>
          <h2 style={{ color: 'var(--slate-900)' }}>Actes & Facturation</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginTop: 4 }}>Gérez les actes réalisés et les paiements</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>+ Nouvel acte</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total actes', value: `${totalCA.toFixed(0)} €`, sub: `${filteredActes.length} actes`, color: 'var(--teal-600)' },
          { label: 'Payé', value: `${totalPaye.toFixed(0)} €`, sub: `${filteredActes.filter(a => a.statut === 'Payé').length} actes`, color: 'var(--green-500)' },
          { label: 'Impayé', value: `${totalImpaye.toFixed(0)} €`, sub: `${filteredActes.filter(a => a.statut === 'Impayé').length} actes`, color: totalImpaye > 0 ? 'var(--red-500)' : 'var(--slate-400)' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '20px 24px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--slate-900)' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <select style={{ ...SEL_STYLE, maxWidth: 250 }} value={filterPatient} onChange={e => setFilterPatient(e.target.value)}>
          <option value="">Tous les patients</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.nom} ({p.race})</option>)}
        </select>
        {filterPatient && <button onClick={() => setFilterPatient('')} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--slate-200)', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--slate-600)', fontFamily: 'inherit' }}>✕ Effacer</button>}
      </div>

      {/* Liste actes */}
      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
              {['Date', 'Patient', 'Type d\'acte', 'Description', 'Montant', 'Statut', ''].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredActes.sort((a, b) => b.date?.localeCompare(a.date)).map(acte => (
              <tr key={acte.id} style={{ borderBottom: '1px solid var(--slate-100)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>{new Date(acte.date).toLocaleDateString('fr-FR')}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{acte.patientNom}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>{acte.type}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--slate-500)', maxWidth: 200 }}>{acte.description || '—'}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-800)' }}>{parseFloat(acte.montant || 0).toFixed(2)} €</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: acte.statut === 'Payé' ? 'var(--teal-100)' : acte.statut === 'Impayé' ? 'var(--red-100)' : 'var(--amber-100)', color: acte.statut === 'Payé' ? 'var(--teal-700)' : acte.statut === 'Impayé' ? 'var(--red-500)' : '#92400E', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{acte.statut}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => deleteActe(acte.id) || window.location.reload()} style={{ fontSize: '0.75rem', color: 'var(--slate-400)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredActes.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--slate-400)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🧾</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Aucun acte enregistré</div>
            <div style={{ fontSize: '0.85rem' }}>Cliquez sur "+ Nouvel acte" pour commencer</div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 24 }}>🧾 Nouvel acte</div>
            {[
              { label: 'Patient', el: <select style={SEL_STYLE} value={form.patientId} onChange={e => set('patientId', e.target.value)}><option value="">— Sélectionner —</option>{patients.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}</select> },
              { label: 'Date', el: <input type="date" style={INP_STYLE} value={form.date} onChange={e => set('date', e.target.value)} /> },
              { label: 'Type d\'acte', el: <select style={SEL_STYLE} value={form.type} onChange={e => set('type', e.target.value)}>{ACTE_TYPES.map(t => <option key={t}>{t}</option>)}</select> },
              { label: 'Description', el: <input style={INP_STYLE} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Détail de l'acte..." /> },
              { label: 'Montant (€)', el: <input type="number" step="0.01" style={INP_STYLE} value={form.montant} onChange={e => set('montant', e.target.value)} placeholder="Ex: 85.00" /> },
              { label: 'Statut', el: <select style={SEL_STYLE} value={form.statut} onChange={e => set('statut', e.target.value)}>{['Payé', 'Impayé', 'En attente'].map(s => <option key={s}>{s}</option>)}</select> },
              { label: 'Notes', el: <textarea rows={2} style={{ ...INP_STYLE, resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notes internes..." /> },
            ].map(({ label, el }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 5 }}>{label}</label>
                {el}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--slate-200)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={handleSave} style={{ padding: '9px 20px', borderRadius: 8, background: 'var(--teal-800)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
