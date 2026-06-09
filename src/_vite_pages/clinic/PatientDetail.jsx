import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPatient, savePatient, deletePatient, getActes, getMessages } from '../../data/store.js'

function Row({ label, value, warn }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--slate-100)', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--slate-500)', minWidth: 140 }}>{label}</span>
      <span style={{ color: warn ? 'var(--red-500)' : 'var(--slate-700)', fontWeight: warn ? 600 : 400, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  )
}

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dossier')
  const [showConsult, setShowConsult] = useState(false)
  const [consultForm, setConsultForm] = useState({ date: new Date().toISOString().slice(0, 10), motif: '', diagnostic: '', traitement: '', prochainRDV: '', veterinaire: 'Dr. Martin' })

  const p = getPatient(id)
  const actes = getActes(id)
  const messages = getMessages(id)

  if (!p) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</div>
      <div style={{ color: 'var(--slate-500)' }}>Patient introuvable</div>
      <Link to="/clinique/patients"><button style={{ marginTop: 16, background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', cursor: 'pointer', fontFamily: 'inherit' }}>← Retour</button></Link>
    </div>
  )

  const addConsult = () => {
    const updated = { ...p, historique: [{ ...consultForm, type: 'Consultation' }, ...(p.historique || [])] }
    savePatient(updated)
    setShowConsult(false)
    window.location.reload()
  }

  const TABS = [['dossier', '📋 Dossier'], ['profil', '🧠 Profil client'], ['actes', '🧾 Actes'], ['historique', '📅 Historique']]

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, fontSize: '0.85rem', color: 'var(--slate-400)' }}>
        <Link to="/clinique/patients" style={{ color: 'var(--teal-700)', fontWeight: 500 }}>Patients</Link>
        <span>›</span><span style={{ color: 'var(--slate-600)' }}>{p.nom}</span>
        <span style={{ fontSize: '0.72rem', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: 100 }}>{p.id}</span>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--teal-900), var(--teal-800))', borderRadius: 16, padding: '24px 28px', marginBottom: 22, display: 'flex', gap: 20, alignItems: 'flex-start', color: '#fff' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>{p.avatar || '🐾'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>{p.nom}</h2>
            <span style={{ background: p.statutVaccinal === 'À jour' ? 'var(--teal-400)' : 'var(--amber-500)', color: p.statutVaccinal === 'À jour' ? 'var(--teal-900)' : '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>{p.statutVaccinal || '—'}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,.7)', marginBottom: 14 }}>{p.race} · {p.sexe} · {p.poids ? `${p.poids} kg` : ''}</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[['Propriétaire', p.proprietaire?.nom?.replace('Mme. ','').replace('M. ','')], ['Tél.', p.proprietaire?.telephone], ['Code accès', p.codeAcces], ['Puce', p.puce]].map(([k, v]) => v && (
              <div key={k}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => setShowConsult(true)} style={{ background: 'var(--teal-400)', color: 'var(--teal-900)', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>+ Consultation</button>
          <button onClick={() => { if (window.confirm('Supprimer ce patient ?')) { deletePatient(id); navigate('/clinique/patients') } }} style={{ background: 'rgba(239,68,68,.15)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '8px 14px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: 5, width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
        {TABS.map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: '7px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: tab === v ? 600 : 400, background: tab === v ? 'var(--teal-800)' : 'transparent', color: tab === v ? '#fff' : 'var(--slate-600)', border: 'none', cursor: 'pointer', transition: 'all .15s' }}>{l}</button>
        ))}
      </div>

      {tab === 'dossier' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: '🐾 Identité', rows: [['Espèce / Race', `${p.espece} — ${p.race}`], ['Date naissance', p.dateNaissance && new Date(p.dateNaissance).toLocaleDateString('fr-FR')], ['Sexe', p.sexe], ['Poids / Score', p.poids ? `${p.poids} kg · ${p.scoreCorps}/9` : '—'], ['Puce', p.puce], ['Passeport', p.passeport ? '✅ Oui' : '❌ Non'], ['Assurance', p.assurance]] },
            { title: '🏡 Mode de vie', rows: [['Environnement', p.modeVie], ['Alimentation', p.alimentation], ['Activité', p.activite], ['Cohabitation', p.environnement?.join(', ') || 'Seul']] },
            { title: '💊 Médical', rows: [['Allergies', p.allergies, !!p.allergies], ['Contre-indications', p.contreIndications, !!p.contreIndications], ['Traitements chroniques', p.traitementsChroniques]] },
            { title: '📅 Prévention', rows: [['Statut vaccinal', p.statutVaccinal, p.statutVaccinal === 'En retard'], ['Prochain vaccin', p.prochainVaccin && new Date(p.prochainVaccin).toLocaleDateString('fr-FR')], ['Prochain vermifuge', p.prochainVermifuge && new Date(p.prochainVermifuge).toLocaleDateString('fr-FR')], ['Prochain antiparasitaire', p.prochainAntiparasitaire && new Date(p.prochainAntiparasitaire).toLocaleDateString('fr-FR')]] },
          ].map(({ title, rows }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-800)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--slate-100)' }}>{title}</div>
              {rows.map(([k, v, w]) => <Row key={k} label={k} value={v} warn={w} />)}
            </div>
          ))}
          {p.soinsRefuses && (
            <div style={{ gridColumn: '1 / -1', background: 'var(--amber-100)', border: '1px solid #FCD34D', borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#92400E', marginBottom: 6 }}>⚠️ Soins refusés — à relancer</div>
              <p style={{ fontSize: '0.875rem', color: '#78350F' }}>{p.soinsRefuses}</p>
            </div>
          )}
          {p.notesVeto && (
            <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 18, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: 8 }}>🔒 Notes internes (privées)</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.7 }}>{p.notesVeto}</p>
            </div>
          )}
          <div style={{ gridColumn: '1 / -1', background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--teal-800)', marginBottom: 6 }}>🔑 Code d'accès propriétaire</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700, color: 'var(--teal-700)' }}>{p.codeAcces}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--teal-600)' }}>Email : {p.proprietaire?.email || '—'} · À communiquer au propriétaire pour accéder à l'espace VetPass Pro</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'profil' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--slate-100)' }}>👤 Propriétaire</div>
            {[['Nom', p.proprietaire?.nom], ['Téléphone', p.proprietaire?.telephone], ['Email', p.proprietaire?.email], ['Contact préféré', p.proprietaire?.contact]].map(([k, v]) => <Row key={k} label={k} value={v} />)}
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--slate-100)' }}>🧠 Comportement</div>
            {[['Sensibilité prix', p.sensibilitePrix], ['Implication', p.implication], ['Profil émotionnel', p.profilEmotionnel]].map(([k, v]) => <Row key={k} label={k} value={v} />)}
          </div>
          <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 14 }}>💡 Comment communiquer avec ce propriétaire</div>
            {p.profilEmotionnel === 'Émotionnel / anxieux' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 10, padding: 14 }}><div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--teal-800)', marginBottom: 8 }}>✅ Ce qui fonctionne</div><ul style={{ fontSize: '0.8rem', color: 'var(--teal-700)', paddingLeft: 16, lineHeight: 1.8 }}><li>Rassurer avant d'informer</li><li>Langage chaleureux et simple</li><li>Valider ses inquiétudes</li></ul></div>
              <div style={{ background: 'var(--red-100)', border: '1px solid #FECACA', borderRadius: 10, padding: 14 }}><div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--red-500)', marginBottom: 8 }}>❌ À éviter</div><ul style={{ fontSize: '0.8rem', color: '#991B1B', paddingLeft: 16, lineHeight: 1.8 }}><li>Jargon médical brut</li><li>Minimiser ses inquiétudes</li></ul></div>
            </div>}
            {p.profilEmotionnel === 'Rationnel / pragmatique' && <div style={{ background: 'var(--blue-100)', borderRadius: 10, padding: 14, fontSize: '0.85rem', color: '#1E40AF' }}>Veut des chiffres et des probabilités. Expliquer le mécanisme d'action. Aller droit au but. Éviter le flou.</div>}
            {p.profilEmotionnel === 'Confiant' && <div style={{ background: 'var(--teal-50)', borderRadius: 10, padding: 14, fontSize: '0.85rem', color: 'var(--teal-800)' }}>Fait confiance, délègue. Simplifier et aller à l'essentiel. Ne pas sur-expliquer. Ne pas sous-proposer.</div>}
            {p.profilEmotionnel === 'Méfiant' && <div style={{ background: 'var(--orange-100)', borderRadius: 10, padding: 14, fontSize: '0.85rem', color: 'var(--orange-500)' }}>Transparence totale sur les prix avant tout acte. Expliquer pourquoi chaque recommandation. Lui laisser le choix. Aucune pression.</div>}
          </div>
        </div>
      )}

      {tab === 'actes' && (
        <div>
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>{['Date', 'Type', 'Description', 'Montant', 'Statut'].map(h => <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                {actes.sort((a, b) => b.date?.localeCompare(a.date)).map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem' }}>{a.type}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--slate-500)' }}>{a.description || '—'}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>{parseFloat(a.montant || 0).toFixed(2)} €</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ background: a.statut === 'Payé' ? 'var(--teal-100)' : 'var(--red-100)', color: a.statut === 'Payé' ? 'var(--teal-700)' : 'var(--red-500)', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{a.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {actes.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-400)' }}>Aucun acte enregistré pour ce patient<br /><Link to="/clinique/facturation" style={{ color: 'var(--teal-700)', fontWeight: 500, marginTop: 8, display: 'inline-block' }}>→ Aller à la facturation</Link></div>}
          </div>
        </div>
      )}

      {tab === 'historique' && (
        <div>
          {(p.historique || []).map((h, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 22, marginBottom: 14, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🩺</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{h.motif}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>{new Date(h.date).toLocaleDateString('fr-FR')} · {h.veterinaire}</div>
                  </div>
                </div>
                <span style={{ background: 'var(--teal-100)', color: 'var(--teal-700)', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{h.type}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[['Diagnostic', h.diagnostic], ['Traitement', h.traitement], ['Prochain RDV', h.prochainRDV]].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--slate-50)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{k}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>{v || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {(!p.historique || p.historique.length === 0) && <div style={{ background: '#fff', border: '2px dashed var(--slate-200)', borderRadius: 14, padding: '40px', textAlign: 'center', color: 'var(--slate-400)' }}>Aucune consultation enregistrée<br /><button onClick={() => setShowConsult(true)} style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: 16 }}>+ Ajouter une consultation</button></div>}
        </div>
      )}

      {/* Modal consultation */}
      {showConsult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowConsult(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 22 }}>🩺 Nouvelle consultation</div>
            {[
              { label: 'Date', el: <input type="date" style={INP} value={consultForm.date} onChange={e => setConsultForm(f => ({ ...f, date: e.target.value }))} /> },
              { label: 'Motif', el: <input style={INP} value={consultForm.motif} onChange={e => setConsultForm(f => ({ ...f, motif: e.target.value }))} placeholder="Ex: Visite annuelle" /> },
              { label: 'Diagnostic', el: <textarea rows={2} style={{ ...INP, resize: 'vertical' }} value={consultForm.diagnostic} onChange={e => setConsultForm(f => ({ ...f, diagnostic: e.target.value }))} placeholder="Ex: Animal en bonne santé..." /> },
              { label: 'Traitement prescrit', el: <textarea rows={2} style={{ ...INP, resize: 'vertical' }} value={consultForm.traitement} onChange={e => setConsultForm(f => ({ ...f, traitement: e.target.value }))} placeholder="Ex: Vaccin CHPL, Milbemax..." /> },
              { label: 'Prochain RDV', el: <input style={INP} value={consultForm.prochainRDV} onChange={e => setConsultForm(f => ({ ...f, prochainRDV: e.target.value }))} placeholder="Ex: Rappel vaccin dans 1 an" /> },
              { label: 'Vétérinaire', el: <input style={INP} value={consultForm.veterinaire} onChange={e => setConsultForm(f => ({ ...f, veterinaire: e.target.value }))} placeholder="Ex: Dr. Martin" /> },
            ].map(({ label, el }) => (
              <div key={label} style={{ marginBottom: 13 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 5 }}>{label}</label>
                {el}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowConsult(false)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--slate-200)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={addConsult} style={{ padding: '9px 20px', borderRadius: 8, background: 'var(--teal-800)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const INP = { width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
