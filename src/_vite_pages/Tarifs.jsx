import React from 'react'
import { Link } from 'react-router-dom'

export function Tarifs() {
  const PLANS = [
    { name: 'Starter', price: '49', desc: 'Parfait pour une clinique solo', features: ['1 vétérinaire', 'Jusqu\'à 200 patients', 'Dossiers patients complets', 'Calendrier équipe', 'Messagerie propriétaires', 'Fiches éducatives', 'Support email'], cta: 'Démarrer', highlight: false },
    { name: 'Clinique', price: '99', desc: 'Pour les cliniques à plusieurs vétérinaires', features: ['Jusqu\'à 3 vétérinaires', 'Patients illimités', 'Tout le plan Starter', 'Actes & Facturation', 'Avis post-consultation', 'Rappels automatiques', 'Support prioritaire'], cta: 'Choisir Clinique', highlight: true },
    { name: 'Premium', price: '179', desc: 'Pour les structures multi-praticiens', features: ['Vétérinaires illimités', 'Patients illimités', 'Tout le plan Clinique', 'Statistiques avancées', 'Intégrations tierces', 'Onboarding personnalisé', 'Support dédié 7j/7'], cta: 'Contacter', highlight: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', fontFamily: 'var(--font-body)' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--slate-200)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--teal-800)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>🐾 VetPass <em style={{ color: 'var(--teal-600)' }}>Pro</em></Link>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--slate-600)', textDecoration: 'none' }}>Accueil</Link>
          <Link to="/contact" style={{ fontSize: '0.875rem', color: 'var(--slate-600)', textDecoration: 'none' }}>Contact</Link>
          <Link to="/connexion" style={{ background: 'var(--teal-800)', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--slate-900)', marginBottom: 14 }}>Tarifs transparents</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>Sans engagement. Changez de formule à tout moment. Les 3 premiers mois offerts pour les cliniques partenaires bêta.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {PLANS.map(({ name, price, desc, features, cta, highlight }) => (
            <div key={name} style={{ background: highlight ? 'linear-gradient(135deg, var(--teal-900), var(--teal-800))' : '#fff', border: highlight ? 'none' : '1px solid var(--slate-200)', borderRadius: 20, padding: '32px 28px', boxShadow: highlight ? '0 20px 60px rgba(15,110,86,.3)' : 'var(--shadow-sm)', position: 'relative', transform: highlight ? 'translateY(-8px)' : 'none' }}>
              {highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal-400)', color: 'var(--teal-900)', fontSize: '0.72rem', fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Le plus choisi</div>}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: highlight ? '#fff' : 'var(--slate-800)', marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: highlight ? '#fff' : 'var(--slate-900)', lineHeight: 1 }}>{price}€<span style={{ fontSize: '1rem', fontFamily: 'var(--font-body)', color: highlight ? 'rgba(255,255,255,.6)' : 'var(--slate-400)', fontWeight: 400 }}>/mois</span></div>
                <div style={{ fontSize: '0.82rem', color: highlight ? 'rgba(255,255,255,.6)' : 'var(--slate-400)', marginTop: 6 }}>{desc}</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: '0.85rem', color: highlight ? 'rgba(255,255,255,.85)' : 'var(--slate-600)', alignItems: 'flex-start' }}>
                    <span style={{ color: highlight ? 'var(--teal-300)' : 'var(--teal-500)', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <button style={{ width: '100%', background: highlight ? 'var(--teal-400)' : 'var(--teal-800)', color: highlight ? 'var(--teal-900)' : '#fff', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>{cta} →</button>
              </Link>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 16, padding: '28px 32px', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, color: 'var(--teal-800)', fontSize: '1.1rem', marginBottom: 8 }}>🤝 Programme Bêta Partenaire</div>
          <p style={{ color: 'var(--teal-700)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 18px' }}>Les 5 premières cliniques partenaires bénéficient de 3 mois offerts et d'un accompagnement personnalisé pour la prise en main.</p>
          <Link to="/contact"><button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Devenir partenaire bêta →</button></Link>
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', fontFamily: 'var(--font-body)' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--slate-200)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--teal-800)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>🐾 VetPass <em style={{ color: 'var(--teal-600)' }}>Pro</em></Link>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--slate-600)', textDecoration: 'none' }}>Accueil</Link>
          <Link to="/tarifs" style={{ fontSize: '0.875rem', color: 'var(--slate-600)', textDecoration: 'none' }}>Tarifs</Link>
          <Link to="/connexion" style={{ background: 'var(--teal-800)', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 32px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--slate-900)', marginBottom: 12 }}>Nous contacter</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', lineHeight: 1.7 }}>Vous souhaitez en savoir plus sur VetPass Pro, demander une démonstration ou devenir partenaire bêta ? Écrivez-nous.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          {[['✉️ Email', 'vetpass.pro@gmail.com'], ['⏱️ Réponse', 'Sous 48h ouvrables']].map(([k, v]) => (
            <div key={k} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--teal-800)', fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: '32px 28px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['Nom', 'text', 'Votre nom'], ['Email', 'email', 'votre@email.fr'], ['Clinique', 'text', 'Nom de votre clinique (optionnel)']].map(([l, t, p]) => (
              <div key={l}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 6 }}>{l}</label>
                <input type={t} placeholder={p} style={{ width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '10px 12px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = 'var(--teal-600)'} onBlur={e => e.target.style.borderColor = 'var(--slate-200)'} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 6 }}>Sujet</label>
              <select style={{ width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '10px 12px', fontSize: '0.875rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                {['Demande de démo', 'Partenariat bêta', 'Question technique', 'Autre'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 6 }}>Message</label>
              <textarea rows={4} placeholder="Votre message..." style={{ width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '10px 12px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <button style={{ background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>Envoyer →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
