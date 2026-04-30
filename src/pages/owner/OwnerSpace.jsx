import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { patients, fichesEducatives } from '../../data/demo.js'

const p = patients[0] // Luna as demo owner view

function Section({ title, icon, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--slate-100)' }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'var(--font-body)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function OwnerSpace() {
  const [tab, setTab] = useState('sante')
  const [msgSent, setMsgSent] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>
      {/* Topbar */}
      <header style={{ background: 'var(--teal-900)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>🐾</span> VetPass <span style={{ color: 'var(--teal-400)', fontStyle: 'italic' }}>Pro</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--teal-200)', background: 'rgba(255,255,255,.1)', padding: '3px 10px', borderRadius: 100, marginLeft: 8, fontFamily: 'var(--font-body)', fontStyle: 'normal' }}>Espace Propriétaire</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{p.proprietaire.nom.replace('Mme. ', '').replace('M. ', '')}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--teal-200)' }}>Clinique du Parc</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-900)', fontWeight: 700, fontSize: '0.85rem' }}>IM</div>
          <Link to="/clinique" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.08)', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}>Espace clinique →</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        {/* Animal hero */}
        <div style={{ background: 'linear-gradient(135deg, var(--teal-800), #1a5c48)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 24, color: '#fff' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.6rem' }}>{p.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#fff', marginBottom: 6 }}>{p.nom}</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.7)', marginBottom: 12 }}>{p.race} · {p.sexe} · {p.age} · {p.poids} kg</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(52,201,154,.25)', color: 'var(--teal-200)', fontSize: '0.78rem', padding: '4px 12px', borderRadius: 100, fontWeight: 500 }}>✅ Vaccins à jour</span>
              <span style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)', fontSize: '0.78rem', padding: '4px 12px', borderRadius: 100 }}>Clinique du Parc — Dr. Martin</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>Prochain RDV</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff' }}>15 sept. 2026</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-200)', marginTop: 4 }}>Rappel vaccin annuel</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 6, width: 'fit-content', boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap' }}>
          {[['sante', '🩺 Santé'], ['calendrier', '📅 Calendrier'], ['comptes', '📄 Comptes-rendus'], ['fiches', '📚 Conseils'], ['alerte', '🚨 Urgences'], ['contact', '💬 Contact']].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: tab === v ? 600 : 400, background: tab === v ? 'var(--teal-800)' : 'transparent', color: tab === v ? '#fff' : 'var(--slate-600)', border: 'none', cursor: 'pointer', transition: 'all .15s' }}>{l}</button>
          ))}
        </div>

        {/* SANTÉ */}
        {tab === 'sante' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Section title="Fiche santé de Luna" icon="📋">
              {[['Espèce / Race', `${p.espece} — ${p.race}`], ['Date de naissance', new Date(p.dateNaissance).toLocaleDateString('fr-FR')], ['Poids', `${p.poids} kg`], ['Numéro de puce', p.puce], ['Mode de vie', p.modeVie], ['Alimentation', p.alimentation]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--slate-100)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--slate-500)' }}>{k}</span>
                  <span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </Section>
            <Section title="Traitements en cours" icon="💊">
              <div style={{ background: 'var(--amber-100)', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#92400E', marginBottom: 4 }}>Apoquel 16 mg</div>
                <div style={{ fontSize: '0.8rem', color: '#78350F' }}>1 comprimé par jour · Matin · Dermatite atopique</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', lineHeight: 1.7 }}>
                <p>⚠️ Ne jamais arrêter ce traitement sans avis vétérinaire.</p>
                <p style={{ marginTop: 8 }}>🚫 Allergies : <strong>Poulet</strong> — évitez les aliments et friandises contenant du poulet.</p>
              </div>
            </Section>
            <Section title="Dernière consultation" icon="🩺">
              <div style={{ background: 'var(--teal-50)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--teal-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>12 mars 2026 · Dr. Martin</div>
                <div style={{ fontWeight: 600, color: 'var(--teal-900)', marginBottom: 8 }}>Visite annuelle + vaccination</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>Luna est en bonne santé. Légère surcharge pondérale (score 5/9). Vaccin CHPL réalisé. Conseils alimentaires donnés.</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>📌 Consigne : réduire légèrement les rations de 10% pendant 3 mois.</div>
            </Section>
            <Section title="Documents" icon="📄">
              {['Compte-rendu consultation 12/03/2026', 'Résultats bilan sanguin 05/07/2025', 'Ordonnance Apoquel — 01/03/2026'].map(doc => (
                <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
                  <span style={{ fontSize: '1.2rem' }}>📄</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--slate-700)', flex: 1 }}>{doc}</span>
                  <button style={{ fontSize: '0.75rem', color: 'var(--teal-700)', background: 'var(--teal-50)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '4px 12px', cursor: 'pointer' }}>Voir</button>
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* CALENDRIER */}
        {tab === 'calendrier' && (
          <Section title="Calendrier préventif de Luna" icon="📅">
            {[
              { label: 'Vaccin CHPL annuel', date: '15 sept. 2026', statut: 'À jour', icon: '💉', color: 'var(--teal-700)', bg: 'var(--teal-100)' },
              { label: 'Antiparasitaire externe', date: '10 mai 2026', statut: 'Proche — dans 10 jours', icon: '🛡️', color: '#92400E', bg: 'var(--amber-100)' },
              { label: 'Vermifuge', date: '1er juin 2026', statut: 'À venir', icon: '💊', color: 'var(--slate-600)', bg: 'var(--slate-100)' },
              { label: 'Bilan de santé annuel', date: '15 sept. 2026', statut: 'Planifié', icon: '🩺', color: 'var(--blue-500)', bg: 'var(--blue-100)' },
            ].map(({ label, date, statut, icon, color, bg }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--slate-100)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-800)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Prochain : {date}</div>
                </div>
                <span style={{ background: bg, color, fontSize: '0.72rem', fontWeight: 600, padding: '3px 12px', borderRadius: 100 }}>{statut}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--teal-800)', fontWeight: 600, marginBottom: 6 }}>💡 Conseil de votre vétérinaire</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--teal-700)', lineHeight: 1.6 }}>Luna vit en maison avec jardin et est active — maintenez une protection antiparasitaire mensuelle d'avril à novembre. Vérifiez les oreilles chaque semaine (race prédisposée).</div>
            </div>
          </Section>
        )}

        {/* FICHES PRATIQUES */}
        {tab === 'fiches' && (
          <div>
            <div style={{ marginBottom: 20, fontSize: '0.875rem', color: 'var(--slate-600)', background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              💡 Fiches rédigées par votre équipe vétérinaire de la Clinique du Parc pour vous aider au quotidien.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {fichesEducatives.map(f => (
                <div key={f.id} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 22, boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-800)', marginBottom: 8 }}>{f.titre}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: '0.7rem', background: 'var(--teal-100)', color: 'var(--teal-700)', padding: '2px 8px', borderRadius: 100 }}>{f.temps}</span>
                    <span style={{ fontSize: '0.7rem', background: 'var(--slate-100)', color: 'var(--slate-500)', padding: '2px 8px', borderRadius: 100 }}>{f.difficulte}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URGENCES */}
        {tab === 'alerte' && (
          <div>
            <div style={{ background: 'var(--red-100)', border: '1px solid #FECACA', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
              <span style={{ fontSize: '2rem' }}>🚨</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--red-500)', fontSize: '1rem', marginBottom: 4 }}>Urgence 24h/24 : Centre Antipoison Animal</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#991B1B' }}>04 78 87 10 40</div>
                <div style={{ fontSize: '0.8rem', color: '#991B1B', marginTop: 2 }}>Clinique de garde : Clinique vétérinaire Urgence Lyon — 04 72 XX XX XX</div>
              </div>
            </div>
            {[
              { emoji: '🔴', title: 'Urgences absolues — Chez le vétérinaire MAINTENANT', items: ['Abdomen gonflé + vomissements sans résultat (DTG)', 'Difficultés respiratoires sévères', 'Gencives blanches, bleues ou grises', 'Convulsions répétées', 'Incapacité totale à uriner (chat mâle)', 'Traumatisme grave même sans saignement visible', 'Coup de chaleur (T > 40,5°C)'] },
              { emoji: '🟡', title: 'Semi-urgences — Consultez dans les 24h', items: ['Vomissements > 3 fois en quelques heures', 'Diarrhée avec sang', 'Fièvre > 39,5°C persistante', 'Ne pose plus la patte du tout', 'Œil rouge, douloureux, fermé'] },
              { emoji: '🟢', title: 'À surveiller — Pas d\'urgence', items: ['Éternuements répétés sans autre symptôme', 'Légère boiterie, pose encore la patte', 'Selles un peu molles (1 épisode)', 'Gratte les oreilles'] },
            ].map(({ emoji, title, items }) => (
              <Section key={title} title={`${emoji} ${title}`} icon="">
                <ul style={{ paddingLeft: 20 }}>
                  {items.map(item => <li key={item} style={{ fontSize: '0.875rem', color: 'var(--slate-700)', padding: '5px 0', lineHeight: 1.5 }}>{item}</li>)}
                </ul>
              </Section>
            ))}
          </div>
        )}

        {/* CONTACT */}
        {tab === 'contact' && (
          <Section title="Contacter la Clinique du Parc" icon="💬">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {[['📞 Téléphone', '04 72 XX XX XX', 'Lun–Sam 8h30–19h30'], ['🚨 Urgences 24h', '04 72 XX XX XX', 'Clinique de garde disponible'], ['✉️ Email', 'contact@clinique-parc.fr', 'Réponse sous 24h ouvrables'], ['📍 Adresse', '12 Rue du Parc, Lyon', 'Bus ligne 4 — arrêt Parc']].map(([k, v, sub]) => (
                <div key={k} style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--teal-800)', fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>
            {!msgSent ? (
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-700)', marginBottom: 14 }}>Envoyer un message à l'équipe</div>
                <input placeholder="Sujet de votre message..." style={{ width: '100%', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', marginBottom: 10, outline: 'none' }} />
                <textarea rows={4} placeholder="Décrivez votre question ou l'état de Luna..." style={{ width: '100%', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', marginBottom: 12, outline: 'none', resize: 'vertical' }} />
                <button onClick={() => setMsgSent(true)} style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '11px 24px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Envoyer le message →</button>
              </div>
            ) : (
              <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>✅</div>
                <div style={{ fontWeight: 600, color: 'var(--teal-800)', marginBottom: 6 }}>Message envoyé à la Clinique du Parc</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--teal-600)' }}>L'équipe vous répondra sous 24h ouvrables.</div>
              </div>
            )}
          </Section>
        )}

        {/* COMPTES-RENDUS */}
        {tab === 'comptes' && (
          <div>
            {p.historique.map((h, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '1rem', marginBottom: 4 }}>{h.motif}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{new Date(h.date).toLocaleDateString('fr-FR')} · {h.veterinaire} · Clinique du Parc</div>
                  </div>
                  <span style={{ background: 'var(--teal-100)', color: 'var(--teal-700)', fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 100 }}>{h.type}</span>
                </div>
                {[["Ce qui a été fait", h.diagnostic], ["Traitement prescrit", h.traitement], ["À suivre", h.prochainRDV]].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 10 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{k}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--slate-700)' }}>{v}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
