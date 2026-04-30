import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { patients } from '../../data/demo.js'

function Badge({ label, color, bg }) {
  return <span style={{ background: bg, color, fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>{label}</span>
}
function Row({ label, value, warn }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', minWidth: 140 }}>{label}</span>
      <span style={{ fontSize: '0.875rem', color: warn ? 'var(--red-500)' : 'var(--slate-700)', fontWeight: warn ? 600 : 400, textAlign: 'right', flex: 1 }}>{value}</span>
    </div>
  )
}
function Section({ title, children, color = 'var(--teal-800)', icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--slate-100)' }}>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'var(--font-body)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

const scoreColor = s => s >= 80 ? ['#065F46', '#D1FAE5'] : s >= 60 ? ['#1E40AF', '#DBEAFE'] : s >= 40 ? ['#92400E', '#FEF3C7'] : ['#991B1B', '#FEE2E2']

export default function PatientDetail() {
  const { id } = useParams()
  const p = patients.find(x => x.id === id)
  const [tab, setTab] = useState('dossier')

  if (!p) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--slate-400)' }}>Patient introuvable</div>

  const [sc, sb] = scoreColor(p.proprietaire.score)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '0.85rem', color: 'var(--slate-400)' }}>
        <Link to="/clinique/patients" style={{ color: 'var(--teal-700)', fontWeight: 500 }}>Patients</Link>
        <span>›</span>
        <span style={{ color: 'var(--slate-600)' }}>{p.nom}</span>
        <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--slate-400)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: 100 }}>{p.id}</span>
      </div>

      {/* Hero card */}
      <div style={{ background: 'linear-gradient(135deg, var(--teal-900), var(--teal-800))', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 24, color: '#fff', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', flexShrink: 0 }}>{p.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h2 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{p.nom}</h2>
            <Badge label={p.statutVaccinal}
              color={p.statutVaccinal === 'À jour' ? 'var(--teal-900)' : '#fff'}
              bg={p.statutVaccinal === 'À jour' ? 'var(--teal-400)' : p.statutVaccinal === 'En retard' ? 'var(--red-500)' : 'var(--amber-500)'}
            />
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.7)', marginBottom: 16 }}>{p.race} · {p.sexe} · {p.age} · {p.poids} kg</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['Propriétaire', p.proprietaire.nom.replace('Mme. ', '').replace('M. ', '')], ['Téléphone', p.proprietaire.telephone], ['Score client', `${p.proprietaire.score}/100`], ['Puce', p.puce]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ background: 'var(--teal-400)', color: 'var(--teal-900)', border: 'none', borderRadius: 'var(--radius-md)', padding: '9px 18px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>+ Consultation</button>
          <button style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', borderRadius: 'var(--radius-md)', padding: '9px 18px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>📤 Partager fiche</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 6, width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
        {[['dossier', '📋 Dossier médical'], ['profil', '🧠 Profil client'], ['historique', '📅 Historique']].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: tab === v ? 600 : 400, background: tab === v ? 'var(--teal-800)' : 'transparent', color: tab === v ? '#fff' : 'var(--slate-600)', border: 'none', cursor: 'pointer', transition: 'all .15s' }}>{l}</button>
        ))}
      </div>

      {tab === 'dossier' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Section title="Identité animal" icon="🐾">
            <Row label="Espèce" value={`${p.espece} — ${p.race}`} />
            <Row label="Date de naissance" value={new Date(p.dateNaissance).toLocaleDateString('fr-FR')} />
            <Row label="Sexe" value={p.sexe} />
            <Row label="Poids" value={`${p.poids} kg — Score corporel ${p.scoreCorps}/9`} />
            <Row label="Numéro de puce" value={p.puce} />
            <Row label="Passeport européen" value={p.passeport ? '✅ Oui' : '❌ Non'} />
            <Row label="Assurance" value={p.assurance} />
          </Section>

          <Section title="Mode de vie" icon="🏡">
            <Row label="Environnement" value={p.modeVie} />
            <Row label="Alimentation" value={p.alimentation} />
            <Row label="Activité" value={p.activite} />
            <Row label="Cohabitation" value={p.environnement.length > 0 ? p.environnement.join(', ') : 'Seul'} />
          </Section>

          <Section title="Médical" icon="💊">
            <Row label="Allergies" value={p.allergies || 'Aucune connue'} warn={!!p.allergies && p.allergies !== 'Aucune connue' && p.allergies !== 'Aucune'} />
            <Row label="Contre-indications" value={p.contreIndications || 'Aucune'} warn={p.contreIndications !== 'Aucune' && p.contreIndications !== 'Aucune connue'} />
            <Row label="Traitements chroniques" value={p.traitementsChroniques || 'Aucun'} />
          </Section>

          <Section title="Prévention & Rappels" icon="📅">
            <Row label="Statut vaccinal" value={p.statutVaccinal} warn={p.statutVaccinal === 'En retard'} />
            <Row label="Prochain vaccin" value={new Date(p.prochainVaccin).toLocaleDateString('fr-FR')} />
            <Row label="Prochain vermifuge" value={new Date(p.prochainVermifuge).toLocaleDateString('fr-FR')} />
            <Row label="Prochain antiparasitaire" value={new Date(p.prochainAntiparasitaire).toLocaleDateString('fr-FR')} />
            <Row label="Dernier RDV" value={new Date(p.dernierRDV).toLocaleDateString('fr-FR')} />
          </Section>

          {p.soinsRefuses && (
            <div style={{ gridColumn: '1 / -1' }}>
              <Section title="⚠️ Soins refusés — à relancer" icon="">
                <div style={{ background: 'var(--amber-100)', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: 16 }}>
                  <p style={{ fontSize: '0.875rem', color: '#92400E' }}>{p.soinsRefuses}</p>
                </div>
              </Section>
            </div>
          )}

          {p.notesVeto && (
            <div style={{ gridColumn: '1 / -1' }}>
              <Section title="🔒 Notes internes vétérinaire (privé)" icon="">
                <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: 1.7 }}>{p.notesVeto}</p>
                </div>
              </Section>
            </div>
          )}
        </div>
      )}

      {tab === 'profil' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Section title="Profil propriétaire" icon="👤">
            <Row label="Nom" value={p.proprietaire.nom} />
            <Row label="Téléphone" value={p.proprietaire.telephone} />
            <Row label="Email" value={p.proprietaire.email} />
            <Row label="Contact préféré" value={p.proprietaire.contact} />
            <Row label="Accord RGPD" value="✅ Signé" />
          </Section>

          <Section title="Scoring & Comportement" icon="📊">
            <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: sc }}>{p.proprietaire.score}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: 4 }}>Score client / 100</div>
              <div style={{ margin: '16px auto', height: 8, background: 'var(--slate-100)', borderRadius: 10, width: '100%', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.proprietaire.score}%`, background: `linear-gradient(90deg, ${sc}, ${sc}cc)`, borderRadius: 10 }} />
              </div>
            </div>
            <Row label="Sensibilité prix" value={p.proprietaire.sensibilitePrix} />
            <Row label="Implication" value={p.proprietaire.implication} />
            <Row label="Profil émotionnel" value={p.proprietaire.profilEmotionnel} />
            <Row label="Fréquence visite" value={p.proprietaire.frequence} />
            <Row label="Panier moyen" value={p.proprietaire.panierMoyen} />
            <Row label="Fidélité" value={p.proprietaire.fidelite} />
          </Section>

          <div style={{ gridColumn: '1 / -1' }}>
            <Section title="💡 Guide adapté — Comment parler à ce propriétaire" icon="">
              {p.proprietaire.profilEmotionnel === 'Émotionnel / anxieux' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--teal-800)', marginBottom: 10 }}>✅ Ce qui fonctionne</div>
                    <ul style={{ fontSize: '0.8rem', color: 'var(--teal-700)', lineHeight: 1.8, paddingLeft: 16 }}>
                      <li>Commencer par rassurer avant d'informer</li>
                      <li>Langage chaleureux et accessible</li>
                      <li>Donner un canal de contact de suivi</li>
                      <li>Valider ses inquiétudes</li>
                    </ul>
                  </div>
                  <div style={{ background: 'var(--red-100)', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--red-500)', marginBottom: 10 }}>❌ À éviter</div>
                    <ul style={{ fontSize: '0.8rem', color: '#991B1B', lineHeight: 1.8, paddingLeft: 16 }}>
                      <li>Vocabulaire médical brut sans explication</li>
                      <li>Minimiser ses inquiétudes</li>
                      <li>Proposer trop d'options en même temps</li>
                    </ul>
                  </div>
                </div>
              )}
              {p.proprietaire.profilEmotionnel === 'Rationnel / pragmatique' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--blue-100)', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--blue-500)', marginBottom: 10 }}>✅ Ce qui fonctionne</div>
                    <ul style={{ fontSize: '0.8rem', color: '#1E40AF', lineHeight: 1.8, paddingLeft: 16 }}>
                      <li>Chiffres et probabilités</li>
                      <li>Expliquer le mécanisme d'action</li>
                      <li>Aller droit au but</li>
                    </ul>
                  </div>
                  <div style={{ background: 'var(--red-100)', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--red-500)', marginBottom: 10 }}>❌ À éviter</div>
                    <ul style={{ fontSize: '0.8rem', color: '#991B1B', lineHeight: 1.8, paddingLeft: 16 }}>
                      <li>Formulations vagues</li>
                      <li>Trop d'émotion dans le discours</li>
                    </ul>
                  </div>
                </div>
              )}
              {p.proprietaire.profilEmotionnel === 'Confiant' && (
                <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--teal-800)', lineHeight: 1.7 }}>Propriétaire confiant — délègue facilement. Simplifier et aller à l'essentiel. Valoriser sa confiance sans l'exploiter. Ne pas sous-proposer par peur de déranger.</p>
                </div>
              )}
            </Section>
          </div>
        </div>
      )}

      {tab === 'historique' && (
        <div>
          {p.historique.map((h, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    {h.type === 'Consultation' ? '🩺' : h.type === 'Analyse' ? '🧪' : '💊'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{h.motif}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{new Date(h.date).toLocaleDateString('fr-FR')} · {h.veterinaire}</div>
                  </div>
                </div>
                <Badge label={h.type} color="var(--teal-800)" bg="var(--teal-100)" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[['Diagnostic', h.diagnostic], ['Traitement', h.traitement], ['Prochain RDV', h.prochainRDV]].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{k}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>{v}</div>
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
