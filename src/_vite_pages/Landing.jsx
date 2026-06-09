import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-body)' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--teal-800)', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span>🐾</span> VetPass <em style={{ color: 'var(--teal-600)' }}>Pro</em>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <a href="#fonctionnalites" style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontWeight: 500, textDecoration: 'none' }}>Fonctionnalités</a>
          <Link to="/contact" style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontWeight: 500, textDecoration: 'none' }}>Contact</Link>
          <Link to="/connexion?role=vet" onClick={() => {}} style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', padding: '9px 18px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Espace vétérinaire</Link>
          <Link to="/connexion?role=owner" style={{ background: 'var(--teal-800)', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Espace propriétaire</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 90, background: 'linear-gradient(135deg, var(--teal-900) 0%, #0a2e25 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(52,201,154,0.12) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(52,201,154,0.2)', border: '1px solid rgba(52,201,154,0.35)', borderRadius: 100, padding: '5px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-400)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--teal-200)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Plateforme vétérinaire tout-en-un</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#fff', lineHeight: 1.12, marginBottom: 24, maxWidth: 720 }}>
            Le lien digital entre la clinique et le propriétaire
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--teal-200)', lineHeight: 1.75, marginBottom: 40, maxWidth: 560 }}>
            VetPass Pro centralise le suivi patient, le calendrier de l'équipe, la facturation et la communication propriétaire dans une interface moderne et intuitive.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
            <Link to="/connexion"><button style={{ background: 'var(--teal-400)', color: 'var(--teal-900)', border: 'none', borderRadius: 10, padding: '13px 28px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>Accéder à la plateforme →</button></Link>
            <Link to="/contact"><button style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', borderRadius: 10, padding: '13px 28px', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>Demander une démo</button></Link>
          </div>
          {/* Stats rapides */}
          <div style={{ display: 'flex', gap: 40 }}>
            {[['Dossier complet', 'en 3 min'], ['2 espaces', 'Véto & Proprio'], ['100%', 'données sécurisées']].map(([v, l]) => (
              <div key={v}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff' }}>{v}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teal-200)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2 ACCÈS */}
      <section id="acces" style={{ padding: '80px 48px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--slate-900)', marginBottom: 14 }}>Deux espaces, une seule plateforme</h2>
          <p style={{ color: 'var(--slate-500)', maxWidth: 500, margin: '0 auto' }}>Chaque utilisateur accède uniquement à ce qui le concerne.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { icon: '🏥', title: 'Espace Vétérinaire', color: 'var(--teal-800)', bg: 'linear-gradient(135deg, var(--teal-900), var(--teal-800))', items: ['Dossiers patients enrichis (profil, mode de vie, comportement)', 'Calendrier de l\'équipe avec planning par vétérinaire', 'Actes et facturation intégrés', 'Messagerie tracée avec les propriétaires', 'Rappels vaccinaux et préventifs automatiques', 'Avis clients post-consultation'], to: '/connexion', cta: 'Accéder →', ctaBg: 'var(--teal-400)', ctaColor: 'var(--teal-900)' },
            { icon: '👤', title: 'Espace Propriétaire', color: 'var(--slate-800)', bg: '#fff', border: '2px solid var(--slate-200)', items: ['Fiche santé complète de son animal', 'Historique des consultations et actes', 'Calendrier préventif personnalisé', 'Fiches pratiques vétérinaires', 'Messagerie avec la clinique', 'Signes d\'alerte et urgences'], to: '/connexion', cta: 'Accéder →', ctaBg: 'var(--teal-800)', ctaColor: '#fff' },
          ].map(({ icon, title, color, bg, border, items, to, cta, ctaBg, ctaColor }) => (
            <div key={title} style={{ background: bg, border, borderRadius: 20, padding: '32px 28px', boxShadow: border ? 'var(--shadow-md)' : 'var(--shadow-lg)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: bg === '#fff' ? 'var(--slate-900)' : '#fff', marginBottom: 20 }}>{title}</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {items.map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: '0.875rem', color: bg === '#fff' ? 'var(--slate-600)' : 'rgba(255,255,255,.8)', alignItems: 'flex-start' }}>
                    <span style={{ color: bg === '#fff' ? 'var(--teal-500)' : 'var(--teal-400)', flexShrink: 0, marginTop: 1 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to={to}><button style={{ background: ctaBg, color: ctaColor, border: 'none', borderRadius: 10, padding: '11px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>{cta}</button></Link>
            </div>
          ))}
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="fonctionnalites" style={{ padding: '80px 48px', background: 'var(--slate-50)', borderTop: '1px solid var(--slate-200)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--slate-900)', marginBottom: 14 }}>Tout ce dont votre clinique a besoin</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              { icon: '🐾', title: 'Dossiers patients complets', desc: 'Profil animal, mode de vie, antécédents, allergies, traitements chroniques et profil comportemental du propriétaire.' },
              { icon: '📅', title: 'Calendrier d\'équipe', desc: 'Planning hebdomadaire par vétérinaire, gestion des rendez-vous avec motif, ASV peut saisir les RDV.' },
              { icon: '🧾', title: 'Actes & Facturation', desc: 'Enregistrement de chaque acte avec montant, statut de paiement et suivi par patient ou global.' },
              { icon: '💬', title: 'Messagerie clinique', desc: 'Communication tracée entre la clinique et les propriétaires, avec historique de chaque échange.' },
              { icon: '⭐', title: 'Avis post-consultation', desc: 'Questionnaire de satisfaction envoyé automatiquement après chaque consultation. Résultats visibles en temps réel.' },
              { icon: '📚', title: 'Fiches éducatives', desc: 'Bibliothèque de fiches pratiques à partager avec les propriétaires : gestes à domicile, signes d\'alerte, urgences.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)', transition: 'transform .15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 600, color: 'var(--slate-800)', marginBottom: 8, fontSize: '0.95rem' }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--teal-900), var(--teal-800))', padding: '72px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: 18, fontFamily: 'var(--font-display)' }}>Prêt à moderniser votre clinique ?</h2>
          <p style={{ color: 'var(--teal-200)', lineHeight: 1.75, marginBottom: 32 }}>Découvrez VetPass Pro en action ou contactez-nous pour une démonstration personnalisée.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Link to="/connexion"><button style={{ background: 'var(--teal-400)', color: 'var(--teal-900)', border: 'none', borderRadius: 10, padding: '12px 26px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>Accéder à la plateforme</button></Link>
            <Link to="/contact"><button style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', borderRadius: 10, padding: '12px 26px', fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>Nous contacter</button></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--slate-900)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.2rem', textDecoration: 'none' }}>🐾 VetPass <em style={{ color: 'var(--teal-400)' }}>Pro</em></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['/', 'Accueil'], ['/connexion', 'Se connecter'], ['/contact', 'Contact']].map(([to, l]) => <Link key={to} to={to} style={{ fontSize: '0.85rem', color: 'var(--slate-400)', textDecoration: 'none' }}>{l}</Link>)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>© 2026 VetPass Pro · vetpass.pro@gmail.com</div>
      </footer>
    </div>
  )
}
