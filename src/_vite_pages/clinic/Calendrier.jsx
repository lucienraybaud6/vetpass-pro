import React, { useState } from 'react'
import { getRdv, saveRdv, deleteRdv, getPatients, getEquipe, uid } from '../../data/store.js'

const HEURES = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00']
const JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam']
const MOTIFS = ['Visite annuelle', 'Vaccination', 'Consultation maladie', 'Chirurgie', 'Suivi post-op', 'Urgence', 'Détartrage', 'Analyse', 'Autre']

function getWeekDates(offset = 0) {
  const now = new Date()
  const day = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + 1 + offset * 7)
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function Calendrier() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedVet, setSelectedVet] = useState('tous')
  const [showModal, setShowModal] = useState(false)
  const [editRdv, setEditRdv] = useState(null)
  const [form, setForm] = useState({ date: '', heure: '09:00', motif: 'Visite annuelle', patientId: '', patientNom: '', veterinaire: '', notes: '' })

  const equipe = getEquipe()
  const patients = getPatients()
  const allRdv = getRdv()
  const weekDates = getWeekDates(weekOffset)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const rdvFiltres = allRdv.filter(r => selectedVet === 'tous' || r.veterinaire === selectedVet)

  const getRdvForCell = (date, heure) => {
    const dateStr = date.toISOString().slice(0, 10)
    return rdvFiltres.filter(r => r.date === dateStr && r.heure === heure)
  }

  const openNew = (date, heure) => {
    setEditRdv(null)
    setForm({ date: date.toISOString().slice(0, 10), heure, motif: 'Visite annuelle', patientId: '', patientNom: '', veterinaire: equipe[0]?.nom || '', notes: '' })
    setShowModal(true)
  }

  const openEdit = (rdv) => {
    setEditRdv(rdv)
    setForm({ date: rdv.date, heure: rdv.heure, motif: rdv.motif, patientId: rdv.patientId || '', patientNom: rdv.patientNom, veterinaire: rdv.veterinaire, notes: rdv.notes || '' })
    setShowModal(true)
  }

  const handleSave = () => {
    const p = patients.find(x => x.id === form.patientId)
    const rdv = {
      ...form,
      id: editRdv?.id || uid('RDV'),
      patientNom: p?.nom || form.patientNom,
      veterinaire: form.veterinaire || equipe[0]?.nom || 'Dr. Martin',
    }
    saveRdv(rdv)
    setShowModal(false)
    window.location.reload()
  }

  const vetColors = {}
  equipe.forEach(v => { vetColors[v.nom] = v.color })

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Planning</div>
          <h2 style={{ color: 'var(--slate-900)' }}>Calendrier de l'équipe</h2>
        </div>
        <button onClick={() => { setEditRdv(null); setForm({ date: today, heure: '09:00', motif: 'Visite annuelle', patientId: '', patientNom: '', veterinaire: equipe[0]?.nom || '', notes: '' }); setShowModal(true) }}
          style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Nouveau RDV
        </button>
      </div>

      {/* Filtres vétérinaires */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setSelectedVet('tous')} style={{ padding: '6px 16px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid', borderColor: selectedVet === 'tous' ? 'var(--teal-700)' : 'var(--slate-200)', background: selectedVet === 'tous' ? 'var(--teal-50)' : '#fff', color: selectedVet === 'tous' ? 'var(--teal-800)' : 'var(--slate-600)', cursor: 'pointer' }}>
          Toute l'équipe
        </button>
        {equipe.map(v => (
          <button key={v.id} onClick={() => setSelectedVet(selectedVet === v.nom ? 'tous' : v.nom)}
            style={{ padding: '6px 16px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid', borderColor: selectedVet === v.nom ? v.color : 'var(--slate-200)', background: selectedVet === v.nom ? `${v.color}15` : '#fff', color: selectedVet === v.nom ? v.color : 'var(--slate-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color }} />
            {v.nom}
          </button>
        ))}
      </div>

      {/* Navigation semaine */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <button onClick={() => setWeekOffset(w => w - 1)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--slate-200)', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}>←</button>
        <div style={{ fontWeight: 600, color: 'var(--slate-700)', fontSize: '0.9rem' }}>
          Semaine du {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {weekDates[5].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <button onClick={() => setWeekOffset(w => w + 1)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--slate-200)', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}>→</button>
        <button onClick={() => setWeekOffset(0)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--slate-200)', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--slate-600)' }}>Aujourd'hui</button>
      </div>

      {/* Grille calendrier */}
      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* Header jours */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(6, 1fr)', borderBottom: '1px solid var(--slate-200)', background: 'var(--slate-50)' }}>
          <div />
          {weekDates.map((d, i) => {
            const ds = d.toISOString().slice(0, 10)
            const isToday = ds === today
            return (
              <div key={i} style={{ padding: '12px 8px', textAlign: 'center', borderLeft: '1px solid var(--slate-200)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{JOURS[i]}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: isToday ? 'var(--teal-700)' : 'var(--slate-800)', marginTop: 2, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px auto 0', borderRadius: '50%', background: isToday ? 'var(--teal-100)' : 'transparent' }}>
                  {d.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Lignes heures */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {HEURES.map(h => (
            <div key={h} style={{ display: 'grid', gridTemplateColumns: '60px repeat(6, 1fr)', borderBottom: '1px solid var(--slate-100)', minHeight: 52 }}>
              <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: 'var(--slate-400)', fontWeight: 500, borderRight: '1px solid var(--slate-200)', display: 'flex', alignItems: 'flex-start', paddingTop: 8 }}>{h}</div>
              {weekDates.map((d, i) => {
                const rdvList = getRdvForCell(d, h)
                return (
                  <div key={i} onClick={() => rdvList.length === 0 && openNew(d, h)}
                    style={{ borderLeft: '1px solid var(--slate-100)', padding: '3px 4px', cursor: rdvList.length === 0 ? 'pointer' : 'default', background: d.toISOString().slice(0, 10) === today ? 'rgba(15,110,86,.02)' : 'transparent', transition: 'background .1s' }}
                    onMouseEnter={e => rdvList.length === 0 && (e.currentTarget.style.background = 'var(--teal-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = d.toISOString().slice(0, 10) === today ? 'rgba(15,110,86,.02)' : 'transparent')}>
                    {rdvList.map(r => (
                      <div key={r.id} onClick={e => { e.stopPropagation(); openEdit(r) }}
                        style={{ background: vetColors[r.veterinaire] || 'var(--teal-600)', borderRadius: 6, padding: '3px 7px', marginBottom: 2, cursor: 'pointer' }}>
                        <div style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.patientNom}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.8)' }}>{r.motif}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        {equipe.map(v => (
          <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--slate-600)' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: v.color }} />
            {v.nom} <span style={{ color: 'var(--slate-400)' }}>({v.role})</span>
          </div>
        ))}
        <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginLeft: 'auto' }}>Cliquez sur une case vide pour ajouter un RDV</div>
      </div>

      {/* MODAL RDV */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--slate-800)', marginBottom: 24 }}>
              {editRdv ? '✏️ Modifier le rendez-vous' : '+ Nouveau rendez-vous'}
            </div>

            {[
              { label: 'Date', el: <input type="date" style={{ ...INP_STYLE }} value={form.date} onChange={e => set('date', e.target.value)} /> },
              { label: 'Heure', el: <select style={{ ...SEL_STYLE }} value={form.heure} onChange={e => set('heure', e.target.value)}>{HEURES.map(h => <option key={h}>{h}</option>)}</select> },
              { label: 'Vétérinaire', el: <select style={{ ...SEL_STYLE }} value={form.veterinaire} onChange={e => set('veterinaire', e.target.value)}>{equipe.map(v => <option key={v.id}>{v.nom}</option>)}</select> },
              { label: 'Patient', el: <select style={{ ...SEL_STYLE }} value={form.patientId} onChange={e => { const p = patients.find(x => x.id === e.target.value); set('patientId', e.target.value); if (p) set('patientNom', p.nom) }}><option value="">— Sélectionner —</option>{patients.map(p => <option key={p.id} value={p.id}>{p.nom} ({p.race})</option>)}</select> },
              { label: 'Motif', el: <select style={{ ...SEL_STYLE }} value={form.motif} onChange={e => set('motif', e.target.value)}>{MOTIFS.map(m => <option key={m}>{m}</option>)}</select> },
              { label: 'Notes', el: <textarea rows={2} style={{ ...INP_STYLE, resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notes supplémentaires..." /> },
            ].map(({ label, el }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 5 }}>{label}</label>
                {el}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              {editRdv && <button onClick={() => { deleteRdv(editRdv.id); setShowModal(false); window.location.reload() }} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--red-100)', color: 'var(--red-500)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Supprimer</button>}
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--slate-200)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={handleSave} style={{ padding: '9px 20px', borderRadius: 8, background: 'var(--teal-800)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const INP_STYLE = { width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
const SEL_STYLE = { ...INP_STYLE, background: '#fff' }
