import React from 'react'
import { getFeedbacks } from '../../data/store.js'

export default function FeedbacksPage() {
  const feedbacks = getFeedbacks()
  const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + (f.noteGlobale || 0), 0) / feedbacks.length).toFixed(1) : null
  const dist = [5, 4, 3, 2, 1].map(n => ({ n, count: feedbacks.filter(f => f.noteGlobale === n).length }))

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Satisfaction client</div>
        <h2 style={{ color: 'var(--slate-900)' }}>Avis post-consultation</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginTop: 4 }}>Envoyés automatiquement 1h30 après chaque consultation</p>
      </div>

      {feedbacks.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed var(--slate-200)', borderRadius: 16, padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⭐</div>
          <div style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Aucun avis pour l'instant</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-400)', maxWidth: 400, margin: '0 auto' }}>Les avis apparaîtront ici automatiquement lorsque vos clients auront complété le questionnaire post-consultation envoyé après chaque rendez-vous.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
          {/* Stats */}
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)', alignSelf: 'start' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--amber-500)' }}>{avg}</div>
              <div style={{ color: 'var(--amber-500)', fontSize: '1.4rem' }}>{'★'.repeat(Math.round(avg))}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: 4 }}>{feedbacks.length} avis</div>
            </div>
            {dist.map(({ n, count }) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', width: 20, textAlign: 'right' }}>{n}★</span>
                <div style={{ flex: 1, height: 8, background: 'var(--slate-100)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: feedbacks.length ? `${(count / feedbacks.length) * 100}%` : '0%', background: 'var(--amber-500)', borderRadius: 100 }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', width: 20 }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Liste */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {feedbacks.slice().reverse().map(f => (
              <div key={f.id} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{f.patientNom}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>{f.proprietaireNom} · {new Date(f.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--amber-500)', fontSize: '1.1rem', textAlign: 'right' }}>{'★'.repeat(f.noteGlobale || 0)}{'☆'.repeat(5 - (f.noteGlobale || 0))}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textAlign: 'right' }}>{f.noteGlobale}/5</div>
                  </div>
                </div>
                {f.commentaire && <div style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontStyle: 'italic', lineHeight: 1.6, background: 'var(--slate-50)', borderRadius: 8, padding: '10px 14px' }}>"{f.commentaire}"</div>}
                <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                  {[['Explications', f.noteExplications], ['Écoute', f.noteEcoute], ['Qualité soins', f.noteQualite]].map(([k, v]) => v && (
                    <div key={k} style={{ fontSize: '0.72rem', background: 'var(--teal-50)', color: 'var(--teal-700)', padding: '3px 10px', borderRadius: 100 }}>{k}: {v}/5</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
