import React, { useState } from 'react'
import { rappels, messages, fichesEducatives } from '../../data/demo.js'

// ─── RAPPELS ──────────────────────────────────────────────────────────────────
export function Rappels() {
  const [filter, setFilter] = useState('tous')
  const filtered = filter === 'tous' ? rappels : rappels.filter(r => r.priorite === filter)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Suivi préventif</div>
        <h2 style={{ color: 'var(--slate-900)' }}>Rappels & Relances</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginTop: 4 }}>Gérez les rappels de vaccins, vermifuges et soins refusés</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'En retard', count: rappels.filter(r => r.statut === 'En retard').length, color: 'var(--red-500)', bg: 'var(--red-100)' },
          { label: 'Rappel proche', count: rappels.filter(r => r.statut === 'Rappel proche').length, color: '#92400E', bg: 'var(--amber-100)' },
          { label: 'À venir', count: rappels.filter(r => r.statut === 'À venir').length, color: 'var(--teal-700)', bg: 'var(--teal-100)' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color }}>{count}</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--slate-700)', fontSize: '0.9rem' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['tous', 'Tous'], ['haute', '🔴 Priorité haute'], ['moyenne', '🟡 Priorité moyenne'], ['basse', '🟢 Basse']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: '7px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 500, border: '1px solid', borderColor: filter === v ? 'var(--teal-700)' : 'var(--slate-200)', background: filter === v ? 'var(--teal-50)' : '#fff', color: filter === v ? 'var(--teal-800)' : 'var(--slate-600)', cursor: 'pointer' }}>{l}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: '#fff', border: `1px solid ${r.statut === 'En retard' ? '#FECACA' : r.statut === 'Rappel proche' ? '#FDE68A' : 'var(--slate-200)'}`, borderRadius: 'var(--radius-lg)', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '1.8rem' }}>{r.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{r.patient}</span>
                <span style={{ background: r.statut === 'En retard' ? 'var(--red-100)' : r.statut === 'Rappel proche' ? 'var(--amber-100)' : 'var(--teal-100)', color: r.statut === 'En retard' ? 'var(--red-500)' : r.statut === 'Rappel proche' ? '#92400E' : 'var(--teal-700)', fontSize: '0.72rem', fontWeight: 600, padding: '2px 10px', borderRadius: 100 }}>{r.statut}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{r.proprietaire} · {r.telephone}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: 2 }}>{r.type} — échéance: {new Date(r.echeance).toLocaleDateString('fr-FR')}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>📞 Appeler</button>
              <button style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}>✉️ SMS</button>
              <button style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}>✅ Fait</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MESSAGERIE ───────────────────────────────────────────────────────────────
export function Messagerie() {
  const [selected, setSelected] = useState(messages[0])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Communication tracée</div>
        <h2 style={{ color: 'var(--slate-900)' }}>Messagerie clinique</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, height: 'calc(100vh - 240px)', minHeight: 500 }}>
        {/* Sidebar messages */}
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', overflow: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)' }}>Tous les échanges ({messages.length})</div>
          {messages.map(m => (
            <div key={m.id} onClick={() => setSelected(m)} style={{ padding: '14px 20px', borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', background: selected?.id === m.id ? 'var(--teal-50)' : '#fff', borderLeft: selected?.id === m.id ? '3px solid var(--teal-700)' : '3px solid transparent', transition: 'all .1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{m.patient}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>{m.heure}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: 4 }}>{m.sujet}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: '0.7rem', background: m.type === 'entrant' ? 'var(--blue-100)' : 'var(--teal-100)', color: m.type === 'entrant' ? 'var(--blue-500)' : 'var(--teal-700)', padding: '1px 7px', borderRadius: 100, fontWeight: 500 }}>{m.type === 'entrant' ? '← Reçu' : '→ Envoyé'}</span>
                <span style={{ fontSize: '0.7rem', background: m.statut === 'Clôturé' ? 'var(--teal-100)' : m.statut === 'En attente réponse' ? 'var(--amber-100)' : 'var(--red-100)', color: m.statut === 'Clôturé' ? 'var(--teal-700)' : m.statut === 'En attente réponse' ? '#92400E' : 'var(--red-500)', padding: '1px 7px', borderRadius: 100, fontWeight: 500 }}>{m.statut}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Message detail */}
        {selected && (
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-100)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '1rem', marginBottom: 4 }}>{selected.sujet}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{selected.patient} · {selected.proprietaire} · {selected.canal} · {selected.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', background: 'var(--slate-100)', color: 'var(--slate-600)', padding: '4px 12px', borderRadius: 100 }}>Traité par: {selected.traite}</span>
                  <span style={{ fontSize: '0.75rem', background: selected.statut === 'Clôturé' ? 'var(--teal-100)' : 'var(--amber-100)', color: selected.statut === 'Clôturé' ? 'var(--teal-700)' : '#92400E', padding: '4px 12px', borderRadius: 100 }}>{selected.statut}</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ maxWidth: 600, margin: selected.type === 'entrant' ? '0 auto 0 0' : '0 0 0 auto' }}>
                <div style={{ background: selected.type === 'entrant' ? 'var(--slate-100)' : 'var(--teal-800)', color: selected.type === 'entrant' ? 'var(--slate-800)' : '#fff', borderRadius: 'var(--radius-lg)', padding: 20, fontSize: '0.9rem', lineHeight: 1.7 }}>{selected.contenu}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: 6, textAlign: selected.type === 'sortant' ? 'right' : 'left' }}>{selected.heure} · {selected.canal}</div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 12 }}>
              <input placeholder="Répondre..." style={{ flex: 1, border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', outline: 'none' }} />
              <button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Envoyer →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FICHES ───────────────────────────────────────────────────────────────────
export function Fiches() {
  const [selected, setSelected] = useState(null)

  const cats = ['Prévention', 'Parasitologie', 'Soins post-op', 'Urgences']

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Éducation client</div>
        <h2 style={{ color: 'var(--slate-900)' }}>Fiches pratiques vétérinaires</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginTop: 4 }}>À partager avec vos clients après consultation</p>
      </div>

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} style={{ background: 'var(--slate-100)', color: 'var(--slate-600)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 20 }}>← Retour aux fiches</button>
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', padding: '36px 40px', maxWidth: 700, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: '2.5rem' }}>{selected.icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selected.categorie} · {selected.temps} · {selected.difficulte}</div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--slate-900)', marginTop: 4 }}>{selected.titre}</h2>
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--slate-200)', margin: '20px 0' }} />
            <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.contenu}</div>
            <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
              <button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>📤 Partager avec un patient</button>
              <button style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontSize: '0.875rem', cursor: 'pointer' }}>🖨️ Imprimer</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {cats.map(cat => {
            const catFiches = fichesEducatives.filter(f => f.categorie === cat)
            if (!catFiches.length) return null
            return (
              <div key={cat} style={{ marginBottom: 32 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{cat}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {catFiches.map(f => (
                    <div key={f.id} onClick={() => setSelected(f)} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, cursor: 'pointer', transition: 'all .15s', boxShadow: 'var(--shadow-sm)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--teal-200)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--slate-200)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
                      <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem', marginBottom: 8 }}>{f.titre}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: '0.72rem', background: 'var(--teal-100)', color: 'var(--teal-700)', padding: '2px 8px', borderRadius: 100 }}>{f.temps}</span>
                        <span style={{ fontSize: '0.72rem', background: 'var(--slate-100)', color: 'var(--slate-500)', padding: '2px 8px', borderRadius: 100 }}>{f.difficulte}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Rappels
