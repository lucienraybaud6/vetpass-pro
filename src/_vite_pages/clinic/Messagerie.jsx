import React, { useState } from 'react'
import { getMessages, saveMessage, getPatients } from '../../data/store.js'

export default function Messagerie() {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [reply, setReply] = useState('')
  const patients = getPatients()
  const allMessages = getMessages()

  const patientsWithMessages = patients.filter(p => allMessages.some(m => m.patientId === p.id))

  const msgs = selectedPatient ? getMessages(selectedPatient.id) : []

  const send = () => {
    if (!reply.trim() || !selectedPatient) return
    saveMessage({ patientId: selectedPatient.id, contenu: reply, type: 'sortant', auteur: 'Clinique' })
    setReply('')
    window.location.reload()
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Communication</div>
        <h2 style={{ color: 'var(--slate-900)' }}>Messagerie clinique</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, height: 'calc(100vh - 220px)', minHeight: 400 }}>
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, overflow: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--slate-100)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)' }}>Conversations ({patientsWithMessages.length})</div>
          {patientsWithMessages.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
              Les messages des propriétaires apparaîtront ici
            </div>
          )}
          {patientsWithMessages.map(p => (
            <div key={p.id} onClick={() => setSelectedPatient(p)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', background: selectedPatient?.id === p.id ? 'var(--teal-50)' : '#fff', borderLeft: selectedPatient?.id === p.id ? '3px solid var(--teal-700)' : '3px solid transparent' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)' }}>{p.nom}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{p.proprietaire?.nom}</div>
            </div>
          ))}
          {patients.filter(p => !patientsWithMessages.includes(p)).map(p => (
            <div key={p.id} onClick={() => setSelectedPatient(p)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', background: selectedPatient?.id === p.id ? 'var(--teal-50)' : '#fff', borderLeft: selectedPatient?.id === p.id ? '3px solid var(--teal-700)' : '3px solid transparent', opacity: 0.6 }}>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--slate-600)' }}>{p.nom}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>{p.proprietaire?.nom}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
          {!selectedPatient ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
                <div>Sélectionnez un patient pour voir la conversation</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)', fontWeight: 700, color: 'var(--slate-800)' }}>{selectedPatient.nom} — {selectedPatient.proprietaire?.nom}</div>
              <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {msgs.length === 0 && <div style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem', marginTop: 40 }}>Aucun message pour l'instant</div>}
                {msgs.map(m => (
                  <div key={m.id} style={{ maxWidth: '70%', alignSelf: m.type === 'sortant' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ background: m.type === 'sortant' ? 'var(--teal-800)' : 'var(--slate-100)', color: m.type === 'sortant' ? '#fff' : 'var(--slate-800)', borderRadius: 12, padding: '10px 14px', fontSize: '0.875rem', lineHeight: 1.5 }}>{m.contenu}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: 3, textAlign: m.type === 'sortant' ? 'right' : 'left' }}>{new Date(m.createdAt).toLocaleString('fr-FR')}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 16px', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 10 }}>
                <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Répondre..." style={{ flex: 1, border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '9px 14px', fontSize: '0.875rem', outline: 'none' }} />
                <button onClick={send} style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Envoyer</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
