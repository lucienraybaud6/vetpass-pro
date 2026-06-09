import React, { useState } from 'react'
import { fichesEducatives } from '../../data/store.js'

export default function Fiches() {
  const [selected, setSelected] = useState(null)
  const cats = [...new Set(fichesEducatives.map(f => f.categorie))]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Éducation client</div>
        <h2 style={{ color: 'var(--slate-900)' }}>Fiches pratiques</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginTop: 4 }}>À partager avec vos clients après consultation</p>
      </div>
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} style={{ background: 'var(--slate-100)', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 20, fontFamily: 'inherit', color: 'var(--slate-600)' }}>← Retour</button>
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: '36px 40px', maxWidth: 680, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: '2.5rem' }}>{selected.icon}</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selected.categorie} · {selected.temps}</div>
                <h2 style={{ fontSize: '1.5rem', marginTop: 4 }}>{selected.titre}</h2>
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--slate-200)', margin: '0 0 20px' }} />
            <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{selected.contenu}</div>
            <button onClick={() => setSelected(null)} style={{ marginTop: 24, background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📤 Partager avec un patient</button>
          </div>
        </div>
      ) : (
        <div>
          {cats.map(cat => (
            <div key={cat} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{cat}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {fichesEducatives.filter(f => f.categorie === cat).map(f => (
                  <div key={f.id} onClick={() => setSelected(f)} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 22, cursor: 'pointer', transition: 'all .15s', boxShadow: 'var(--shadow-sm)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--teal-200)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--slate-200)' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{f.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-800)', marginBottom: 8 }}>{f.titre}</div>
                    <span style={{ fontSize: '0.7rem', background: 'var(--teal-100)', color: 'var(--teal-700)', padding: '2px 8px', borderRadius: 100 }}>{f.temps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
