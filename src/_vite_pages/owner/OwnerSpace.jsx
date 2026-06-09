import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getPatient, getActes, getMessages, saveMessage, saveFeedback, fichesEducatives } from '../../data/store.js'

function Section({ title, icon, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-sm)', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--slate-100)' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'var(--font-body)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function OwnerSpace() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('sante')
  const [msgText, setMsgText] = useState('')
  const [msgSent, setMsgSent] = useState(false)
  const [ficheOuverte, setFicheOuverte] = useState(null)
  const [feedback, setFeedback] = useState({ note: 0, commentaire: '', explications: 0, ecoute: 0 })
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [questionsLeft, setQuestionsLeft] = useState(3) // limite mensuelle

  const patient = getPatient(user?.patientId)
  const actes = getActes(user?.patientId)
  const msgs = getMessages(user?.patientId)

  const sendMsg = () => {
    if (!msgText.trim() || questionsLeft <= 0) return
    saveMessage({ patientId: user.patientId, contenu: msgText, type: 'entrant', auteur: user.nom })
    setMsgText('')
    setQuestionsLeft(q => q - 1)
    setMsgSent(true)
  }

  const sendFeedback = () => {
    if (feedback.note === 0) return
    saveFeedback({ patientId: user.patientId, patientNom: patient?.nom, proprietaireNom: user.nom, noteGlobale: feedback.note, noteExplications: feedback.explications, noteEcoute: feedback.ecoute, commentaire: feedback.commentaire })
    setFeedbackSent(true)
  }

  if (!patient) return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--teal-900)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.2rem' }}>🐾 VetPass <em style={{ color: 'var(--teal-400)' }}>Pro</em></div>
        <button onClick={() => { logout(); navigate('/connexion') }} style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>Déconnexion</button>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>🐾</div>
          <h2 style={{ color: 'var(--slate-800)', marginBottom: 10 }}>Bienvenue, {user?.nom} !</h2>
          <p style={{ color: 'var(--slate-500)', lineHeight: 1.7 }}>Votre dossier est en cours de configuration par votre vétérinaire. Il sera disponible très prochainement.</p>
        </div>
      </div>
    </div>
  )

  const TABS = [['sante', '🩺 Santé'], ['actes', '🧾 Actes'], ['calendrier', '📅 Rappels'], ['fiches', '📚 Conseils'], ['alerte', '🚨 Urgences'], ['contact', '💬 Contact'], ['avis', '⭐ Donner un avis']]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>
      <header style={{ background: 'var(--teal-900)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.2rem', display: 'flex', gap: 10, alignItems: 'center' }}>
          🐾 VetPass <em style={{ color: 'var(--teal-400)' }}>Pro</em>
          <span style={{ fontSize: '0.65rem', color: 'var(--teal-200)', background: 'rgba(255,255,255,.1)', padding: '2px 8px', borderRadius: 100, fontStyle: 'normal', fontFamily: 'var(--font-body)' }}>Propriétaire</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,.7)' }}>{user?.nom}</div>
          <button onClick={() => { logout(); navigate('/connexion') }} style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem' }}>🚪</button>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px' }}>
        {/* Carte animal */}
        <div style={{ background: 'linear-gradient(135deg, var(--teal-800), #1a5c48)', borderRadius: 16, padding: '24px 28px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 20, color: '#fff' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0 }}>{patient.avatar || '🐾'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', marginBottom: 4 }}>{patient.nom}</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,.7)' }}>{patient.race} · {patient.sexe} · {patient.poids ? `${patient.poids} kg` : ''}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.4)', marginBottom: 3 }}>Suivi par</div>
            <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 600 }}>Dr. Martin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--teal-200)' }}>Clinique du Parc</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 20, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: 5, flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)' }}>
          {TABS.map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: tab === v ? 600 : 400, background: tab === v ? 'var(--teal-800)' : 'transparent', color: tab === v ? '#fff' : 'var(--slate-600)', border: 'none', cursor: 'pointer', transition: 'all .15s' }}>{l}</button>
          ))}
        </div>

        {/* SANTÉ */}
        {tab === 'sante' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Section title="Fiche santé" icon="📋">
              {[['Espèce / Race', `${patient.espece} — ${patient.race}`], ['Date de naissance', patient.dateNaissance && new Date(patient.dateNaissance).toLocaleDateString('fr-FR')], ['Poids', patient.poids ? `${patient.poids} kg` : '—'], ['Puce', patient.puce], ['Mode de vie', patient.modeVie], ['Alimentation', patient.alimentation]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--slate-100)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--slate-500)' }}>{k}</span><span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{v || '—'}</span>
                </div>
              ))}
            </Section>
            <Section title="Traitements & Allergies" icon="💊">
              {patient.traitementsChroniques && patient.traitementsChroniques !== 'Aucun' && <div style={{ background: 'var(--amber-100)', border: '1px solid #FCD34D', borderRadius: 8, padding: 12, marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#92400E', marginBottom: 3 }}>Traitement en cours</div><div style={{ fontSize: '0.8rem', color: '#78350F' }}>{patient.traitementsChroniques}</div></div>}
              {patient.allergies && patient.allergies !== 'Aucune' && patient.allergies !== 'Aucune connue' && <div style={{ background: 'var(--red-100)', border: '1px solid #FECACA', borderRadius: 8, padding: 12 }}><div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--red-500)', marginBottom: 3 }}>⚠️ Allergie connue</div><div style={{ fontSize: '0.8rem', color: '#991B1B' }}>{patient.allergies}</div></div>}
              {(!patient.traitementsChroniques || patient.traitementsChroniques === 'Aucun') && (!patient.allergies || patient.allergies === 'Aucune') && <div style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>Aucun traitement ni allergie enregistrés</div>}
            </Section>
            {patient.historique?.length > 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <Section title="Dernière consultation" icon="🩺">
                  {(() => { const h = patient.historique[0]; return (
                    <div style={{ background: 'var(--teal-50)', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--teal-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{new Date(h.date).toLocaleDateString('fr-FR')} · {h.veterinaire}</div>
                      <div style={{ fontWeight: 600, color: 'var(--teal-900)', marginBottom: 10 }}>{h.motif}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        {[['Observation', h.diagnostic], ['Traitement', h.traitement], ['Prochain suivi', h.prochainRDV]].map(([k, v]) => (
                          <div key={k} style={{ background: '#fff', borderRadius: 8, padding: '10px 12px' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{k}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>{v || '—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )})()}
                </Section>
              </div>
            )}
          </div>
        )}

        {/* ACTES */}
        {tab === 'actes' && (
          <Section title="Historique des actes et factures" icon="🧾">
            {actes.length === 0 ? <div style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '32px 0' }}>Aucun acte enregistré pour l'instant</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'var(--slate-50)' }}>{['Date', 'Acte', 'Description', 'Montant', 'Statut'].map(h => <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {actes.sort((a, b) => b.date?.localeCompare(a.date)).map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '10px 12px', fontSize: '0.82rem', color: 'var(--slate-600)' }}>{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: '0.82rem' }}>{a.type}</td>
                      <td style={{ padding: '10px 12px', fontSize: '0.82rem', color: 'var(--slate-500)' }}>{a.description || '—'}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{parseFloat(a.montant || 0).toFixed(2)} €</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: a.statut === 'Payé' ? 'var(--teal-100)' : 'var(--red-100)', color: a.statut === 'Payé' ? 'var(--teal-700)' : 'var(--red-500)', fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>{a.statut}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {actes.length > 0 && <div style={{ marginTop: 14, textAlign: 'right', fontWeight: 700, color: 'var(--slate-800)' }}>Total : {actes.reduce((s, a) => s + parseFloat(a.montant || 0), 0).toFixed(2)} €</div>}
          </Section>
        )}

        {/* CALENDRIER */}
        {tab === 'calendrier' && (
          <Section title="Rappels préventifs" icon="📅">
            {[{ label: 'Vaccin annuel', date: patient.prochainVaccin, statut: patient.statutVaccinal, icon: '💉' }, { label: 'Antiparasitaire', date: patient.prochainAntiparasitaire, statut: 'À venir', icon: '🛡️' }, { label: 'Vermifuge', date: patient.prochainVermifuge, statut: 'À venir', icon: '💊' }].map(({ label, date, statut, icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--slate-100)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)' }}>{label}</div><div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{date ? `Prochain : ${new Date(date).toLocaleDateString('fr-FR')}` : 'Non planifié'}</div></div>
                <span style={{ background: statut === 'À jour' ? 'var(--teal-100)' : statut === 'En retard' ? 'var(--red-100)' : 'var(--amber-100)', color: statut === 'À jour' ? 'var(--teal-700)' : statut === 'En retard' ? 'var(--red-500)' : '#92400E', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{statut || 'À venir'}</span>
              </div>
            ))}
          </Section>
        )}

        {/* FICHES */}
        {tab === 'fiches' && (
          <div>
            {ficheOuverte ? (
              <div>
                <button onClick={() => setFicheOuverte(null)} style={{ background: 'var(--slate-100)', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: '0.82rem', cursor: 'pointer', marginBottom: 16, fontFamily: 'inherit', color: 'var(--slate-600)' }}>← Retour</button>
                <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: '28px 32px', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
                    <span style={{ fontSize: '2.2rem' }}>{ficheOuverte.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{ficheOuverte.categorie}</div>
                      <h2 style={{ fontSize: '1.4rem', marginTop: 4 }}>{ficheOuverte.titre}</h2>
                    </div>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--slate-200)', margin: '0 0 18px' }} />
                  <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{ficheOuverte.contenu}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {fichesEducatives.map(f => (
                  <div key={f.id} onClick={() => setFicheOuverte(f)} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all .15s', boxShadow: 'var(--shadow-sm)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--teal-200)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--slate-200)' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{f.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)', marginBottom: 7 }}>{f.titre}</div>
                    <span style={{ fontSize: '0.7rem', background: 'var(--teal-100)', color: 'var(--teal-700)', padding: '2px 8px', borderRadius: 100 }}>{f.temps}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* URGENCES */}
        {tab === 'alerte' && (
          <div>
            <div style={{ background: 'var(--red-100)', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem' }}>🚨</span>
              <div><div style={{ fontWeight: 700, color: 'var(--red-500)', marginBottom: 3 }}>Centre Antipoison Animal — 24h/24</div><div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#991B1B' }}>04 78 87 10 40</div></div>
            </div>
            {[
              { emoji: '🔴', title: 'Urgences absolues — Consultez immédiatement', items: ['Abdomen gonflé + vomissements sans résultat', 'Difficultés respiratoires sévères', 'Gencives blanches, bleues ou grises', 'Convulsions répétées', 'Incapacité totale à uriner (chat mâle)', 'Traumatisme grave', 'Coup de chaleur (T > 40,5°C)', 'Ingestion de toxique (chocolat, raisins, médicaments humains)'] },
              { emoji: '🟡', title: 'Semi-urgences — Dans les 24h', items: ['Vomissements > 3 fois', 'Diarrhée avec sang', 'Fièvre > 39,5°C persistante', 'Ne pose plus la patte', 'Œil rouge et fermé', 'Plaie par morsure'] },
              { emoji: '🟢', title: 'À surveiller — Pas d\'urgence', items: ['Éternuements sans autre signe', 'Légère boiterie', 'Selles molles (1 épisode)', 'Se gratte les oreilles'] },
            ].map(({ emoji, title, items }) => (
              <Section key={title} title={`${emoji} ${title}`} icon="">
                <ul style={{ paddingLeft: 18, margin: 0 }}>{items.map(i => <li key={i} style={{ fontSize: '0.875rem', color: 'var(--slate-700)', padding: '4px 0', lineHeight: 1.5 }}>{i}</li>)}</ul>
              </Section>
            ))}
          </div>
        )}

        {/* CONTACT */}
        {tab === 'contact' && (
          <Section title="Contacter la clinique" icon="💬">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
              {[['📞 Téléphone', '04 72 XX XX XX', 'Lun–Sam 8h30–19h30'], ['🚨 Urgences', '04 72 XX XX XX', 'Garde 24h/24'], ['✉️ Email', 'contact@clinique.fr', 'Réponse sous 24h'], ['📍 Adresse', '12 Rue du Parc', 'Lyon']].map(([k, v, s]) => (
                <div key={k} style={{ background: 'var(--slate-50)', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--teal-800)', fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: 4 }}>Envoyer un message</div>
            <div style={{ background: questionsLeft <= 0 ? 'var(--red-100)' : 'var(--teal-50)', border: '1px solid', borderColor: questionsLeft <= 0 ? '#FECACA' : 'var(--teal-200)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: '0.78rem', color: questionsLeft <= 0 ? 'var(--red-500)' : 'var(--teal-700)' }}>
              {questionsLeft > 0 ? `💬 ${questionsLeft} question${questionsLeft > 1 ? 's' : ''} restante${questionsLeft > 1 ? 's' : ''} ce mois` : '⚠️ Limite mensuelle atteinte — contactez la clinique par téléphone'}
            </div>
            {!msgSent ? (
              <div>
                <textarea rows={4} value={msgText} onChange={e => setMsgText(e.target.value)} disabled={questionsLeft <= 0} placeholder={`Votre question concernant ${patient.nom}...`} style={{ width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '10px 12px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
                <button onClick={sendMsg} disabled={questionsLeft <= 0 || !msgText.trim()} style={{ background: questionsLeft <= 0 ? 'var(--slate-200)' : 'var(--teal-800)', color: questionsLeft <= 0 ? 'var(--slate-400)' : '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: '0.875rem', cursor: questionsLeft <= 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>Envoyer →</button>
              </div>
            ) : (
              <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 10, padding: 18, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>✅</div>
                <div style={{ fontWeight: 600, color: 'var(--teal-800)', marginBottom: 4 }}>Message envoyé</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--teal-600)' }}>L'équipe vous répondra sous 24h ouvrables. ({questionsLeft} question{questionsLeft > 1 ? 's' : ''} restante{questionsLeft > 1 ? 's' : ''})</div>
              </div>
            )}
          </Section>
        )}

        {/* AVIS */}
        {tab === 'avis' && (
          <Section title="Donner un avis sur votre consultation" icon="⭐">
            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🙏</div>
                <div style={{ fontWeight: 700, color: 'var(--slate-800)', marginBottom: 8 }}>Merci pour votre avis !</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>Votre retour aide notre équipe à s'améliorer continuellement.</div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: 22 }}>Quelques secondes pour partager votre expérience lors de votre dernière visite.</p>
                {[['Note globale', 'note'], ['Qualité des explications', 'explications'], ['Écoute et empathie', 'ecoute']].map(([label, key]) => (
                  <div key={key} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-600)', marginBottom: 8 }}>{label}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setFeedback(f => ({ ...f, [key]: n }))} style={{ width: 44, height: 44, borderRadius: 10, border: '2px solid', borderColor: feedback[key] >= n ? 'var(--amber-500)' : 'var(--slate-200)', background: feedback[key] >= n ? 'var(--amber-100)' : '#fff', fontSize: '1.2rem', cursor: 'pointer', transition: 'all .1s' }}>⭐</button>
                      ))}
                      <span style={{ alignSelf: 'center', fontSize: '0.78rem', color: 'var(--slate-400)', marginLeft: 4 }}>{feedback[key] ? `${feedback[key]}/5` : ''}</span>
                    </div>
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-600)', marginBottom: 8 }}>Commentaire libre (optionnel)</div>
                  <textarea rows={3} value={feedback.commentaire} onChange={e => setFeedback(f => ({ ...f, commentaire: e.target.value }))} placeholder="Partagez votre expérience..." style={{ width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '10px 12px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button onClick={sendFeedback} disabled={feedback.note === 0} style={{ background: feedback.note === 0 ? 'var(--slate-200)' : 'var(--teal-800)', color: feedback.note === 0 ? 'var(--slate-400)' : '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontWeight: 700, fontSize: '0.875rem', cursor: feedback.note === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  Envoyer mon avis →
                </button>
              </div>
            )}
          </Section>
        )}
      </div>
    </div>
  )
}
