import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64 }}>
      <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--teal-800)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>🐾</span> VetPass <em style={{ color: 'var(--teal-600)' }}>Pro</em>
      </Link>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {[['/', 'Accueil'], ['/clinique', 'Démo'], ['/tarifs', 'Tarifs'], ['/contact', 'Contact']].map(([to, l]) => (
          <Link key={to} to={to} style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontWeight: 500 }}>{l}</Link>
        ))}
        <Link to="/contact"><button style={{ background: 'var(--teal-800)', color: '#fff', padding: '9px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Nous contacter</button></Link>
      </div>
    </nav>
  )
}

// ─── TARIFS ───────────────────────────────────────────────────────────────────
export function Tarifs() {
  const plans = [
    {
      name: 'Starter', price: 49, period: 'mois', color: 'var(--slate-700)', accent: 'var(--slate-200)',
      desc: 'Pour les petites cliniques qui démarrent',
      features: ['1 vétérinaire', 'Jusqu\'à 200 patients', 'Base CRM complète', 'Log communications', 'Fiches éducatives (bibliothèque)', 'Support email'],
      cta: 'Commencer'
    },
    {
      name: 'Clinique', price: 99, period: 'mois', color: 'var(--teal-800)', accent: 'var(--teal-400)',
      desc: 'La solution complète pour votre clinique', popular: true,
      features: ['3 vétérinaires', 'Patients illimités', 'Tout Starter +', 'Scoring client avancé', 'Feedbacks post-consultation', 'Rappels intelligents automatisés', 'Protocoles cliniques', 'Formation équipe incluse (2h)', 'Support prioritaire'],
      cta: 'Choisir Clinique'
    },
    {
      name: 'Premium', price: 179, period: 'mois', color: 'var(--purple-500)', accent: 'var(--purple-100)',
      desc: 'Pour les structures multi-vétérinaires',
      features: ['Vétérinaires illimités', 'Patients illimités', 'Tout Clinique +', 'Tableau de bord analytics avancé', 'API d\'intégration logiciel métier', 'Formation complète équipe', 'Support dédié 7j/7', 'Personnalisation branding clinique'],
      cta: 'Choisir Premium'
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <NavBar />
      <div style={{ paddingTop: 100, paddingBottom: 80, maxWidth: 1100, margin: '0 auto', padding: '100px 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'var(--teal-50)', color: 'var(--teal-700)', fontSize: '0.78rem', fontWeight: 600, padding: '4px 14px', borderRadius: 100, marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            🎉 Bêta — 3 mois offerts pour les 5 premières cliniques partenaires
          </div>
          <h1 style={{ fontSize: '3rem', color: 'var(--slate-900)', marginBottom: 20 }}>Des tarifs simples et transparents</h1>
          <p style={{ color: 'var(--slate-500)', maxWidth: 480, margin: '0 auto', fontSize: '1rem' }}>Pas de frais cachés. Annulez quand vous voulez. Tous les plans incluent un onboarding et une formation de votre équipe.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ background: plan.popular ? 'var(--teal-900)' : '#fff', border: plan.popular ? '2px solid var(--teal-400)' : '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', boxShadow: plan.popular ? 'var(--shadow-lg)' : 'var(--shadow-sm)', position: 'relative', transform: plan.popular ? 'scale(1.03)' : 'none' }}>
              {plan.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal-400)', color: 'var(--teal-900)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 18px', borderRadius: 100, whiteSpace: 'nowrap' }}>Le plus populaire</div>}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: plan.popular ? '#fff' : 'var(--slate-800)', marginBottom: 6 }}>{plan.name}</div>
                <div style={{ fontSize: '0.85rem', color: plan.popular ? 'rgba(255,255,255,.6)' : 'var(--slate-500)', marginBottom: 20 }}>{plan.desc}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: plan.popular ? 'var(--teal-400)' : 'var(--slate-900)' }}>{plan.price}€</span>
                  <span style={{ fontSize: '0.85rem', color: plan.popular ? 'rgba(255,255,255,.5)' : 'var(--slate-400)' }}>/{plan.period}</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', fontSize: '0.875rem', color: plan.popular ? 'rgba(255,255,255,.8)' : 'var(--slate-700)' }}>
                    <span style={{ color: plan.popular ? 'var(--teal-400)' : 'var(--teal-600)', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <button style={{ width: '100%', background: plan.popular ? 'var(--teal-400)' : 'var(--teal-800)', color: plan.popular ? 'var(--teal-900)' : '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '13px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{plan.cta}</button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bêta offer */}
        <div style={{ marginTop: 48, background: 'linear-gradient(135deg, var(--teal-900), var(--teal-800))', borderRadius: 'var(--radius-xl)', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--teal-400)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Offre bêta partenaire</div>
            <h3 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 12 }}>3 mois 100% gratuits</h3>
            <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.7, maxWidth: 480 }}>Nous cherchons 5 cliniques vétérinaires pour notre phase bêta. Accès complet à toutes les fonctionnalités, formation de votre équipe incluse, en échange de vos retours structurés.</p>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--teal-200)', marginBottom: 4 }}>Il reste</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--teal-400)', lineHeight: 1 }}>4</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--teal-200)', marginBottom: 20 }}>places disponibles</div>
            <Link to="/contact"><button style={{ background: 'var(--teal-400)', color: 'var(--teal-900)', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Devenir partenaire →</button></Link>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, fontSize: '1.8rem' }}>Questions fréquentes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              ['Peut-on utiliser VetPass Pro sans remplacer notre logiciel ?', 'Oui. VetPass Pro complète votre logiciel métier (Vétosoft, Vétup, etc.) — il ne le remplace pas. Votre logiciel gère les actes et la facturation, VetPass gère la relation client.'],
              ['Combien de temps prend la mise en place ?', 'L\'onboarding complet prend 2 heures en visio avec votre équipe. Votre ASV peut utiliser le formulaire d\'admission en moins de 30 minutes d\'apprentissage.'],
              ['Les données sont-elles sécurisées ?', 'VetPass Pro est hébergé sur des serveurs européens (conformité RGPD). Nous fournissons un modèle d\'accord RGPD propriétaire à faire signer lors de l\'inscription.'],
              ['Peut-on annuler à tout moment ?', 'Oui. Pas d\'engagement, pas de frais de résiliation. Vos données vous appartiennent et sont exportables à tout moment.'],
            ].map(([q, a]) => (
              <div key={q} style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                <div style={{ fontWeight: 600, color: 'var(--slate-800)', marginBottom: 10, fontSize: '0.9rem' }}>{q}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
export function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ nom: '', clinique: '', email: '', tel: '', message: '', offre: 'beta' })

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <NavBar />
      <div style={{ paddingTop: 100, maxWidth: 1000, margin: '0 auto', padding: '100px 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Parlons-nous</div>
            <h1 style={{ fontSize: '2.6rem', color: 'var(--slate-900)', marginBottom: 20 }}>Prenons 20 minutes pour vous montrer VetPass Pro</h1>
            <p style={{ color: 'var(--slate-600)', lineHeight: 1.8, marginBottom: 36 }}>Je suis étudiant en 4ème année de médecine vétérinaire. J'ai conçu VetPass Pro après avoir observé les lacunes des outils existants en stage. Je vous propose une démonstration personnalisée, sans engagement.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[['📧', 'vetpass.pro@gmail.com', 'Réponse sous 24h'], ['📱', '06 XX XX XX XX', 'Disponible 8h-20h'], ['🎯', 'Démo 20 min en visio', 'Sur RDV, selon vos disponibilités']].map(([icon, val, sub]) => (
                <div key={val} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, background: 'var(--teal-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.9rem' }}>{val}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', padding: '36px 32px', boxShadow: 'var(--shadow-lg)' }}>
            {!sent ? (
              <>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--slate-800)', marginBottom: 24, fontSize: '1.1rem' }}>Demande de démonstration</h3>
                {[
                  { label: 'Votre nom', key: 'nom', placeholder: 'Dr. Dupont Marie', type: 'text' },
                  { label: 'Nom de la clinique', key: 'clinique', placeholder: 'Clinique vétérinaire du Parc', type: 'text' },
                  { label: 'Email professionnel', key: 'email', placeholder: 'contact@clinique.fr', type: 'email' },
                  { label: 'Téléphone', key: 'tel', placeholder: '06 XX XX XX XX', type: 'tel' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: '100%', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 6 }}>Je suis intéressé par</label>
                  <select value={form.offre} onChange={e => setForm({ ...form, offre: e.target.value })}
                    style={{ width: '100%', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
                    <option value="beta">Bêta partenaire — 3 mois gratuits</option>
                    <option value="starter">Forfait Starter (49€/mois)</option>
                    <option value="clinique">Forfait Clinique (99€/mois)</option>
                    <option value="premium">Forfait Premium (179€/mois)</option>
                    <option value="info">Simplement en savoir plus</option>
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 6 }}>Message (optionnel)</label>
                  <textarea rows={3} placeholder="Questions, contexte, disponibilités pour une démo..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button onClick={() => setSent(true)} style={{ width: '100%', background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '13px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Envoyer la demande →
                </button>
                <p style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textAlign: 'center', marginTop: 12 }}>Réponse garantie sous 24h ouvrables · Aucun engagement</p>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--slate-800)', marginBottom: 12 }}>Demande reçue !</h3>
                <p style={{ color: 'var(--slate-600)', lineHeight: 1.7, marginBottom: 24 }}>Je vous contacterai personnellement sous 24h pour organiser votre démonstration de 20 minutes.</p>
                <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--teal-800)' }}>En attendant, explorez la <Link to="/clinique" style={{ color: 'var(--teal-700)', fontWeight: 600, textDecoration: 'underline' }}>démonstration interactive</Link> →</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tarifs
