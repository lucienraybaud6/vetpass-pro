import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const S = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64 },
  logo: { fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--teal-800)', display: 'flex', alignItems: 'center', gap: 10 },
  navLinks: { display: 'flex', gap: 32, alignItems: 'center' },
  navLink: { fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 500, transition: 'color .2s' },
  btnPrimary: { background: 'var(--teal-800)', color: '#fff', padding: '10px 22px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, transition: 'all .2s', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)' },
  btnOutline: { background: 'transparent', color: 'var(--teal-800)', padding: '10px 22px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, border: '1.5px solid var(--teal-800)', transition: 'all .2s', cursor: 'pointer', fontFamily: 'var(--font-body)' },
}

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo}>
          <span style={{ fontSize: '1.8rem' }}>🐾</span>
          <span>VetPass <span style={{ color: 'var(--teal-600)', fontStyle: 'italic' }}>Pro</span></span>
        </div>
        <div style={S.navLinks}>
          <Link to="/clinique" style={S.navLink}>Espace Clinique</Link>
          <Link to="/proprietaire" style={S.navLink}>Espace Propriétaire</Link>
          <Link to="/tarifs" style={S.navLink}>Tarifs</Link>
          <Link to="/contact" style={S.navLink}>Contact</Link>
          <Link to="/clinique"><button style={S.btnOutline}>Démo</button></Link>
          <Link to="/contact"><button style={S.btnPrimary}>Nous contacter</button></Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 100, background: 'linear-gradient(135deg, var(--teal-900) 0%, var(--teal-800) 50%, #1a5c48 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(52,201,154,0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(52,201,154,0.2)', border: '1px solid rgba(52,201,154,0.4)', borderRadius: 100, padding: '5px 16px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-400)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--teal-200)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>CRM Vétérinaire — Bêta 2026</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', color: '#fff', lineHeight: 1.1, marginBottom: 24 }}>
              La relation client<br /><em style={{ color: 'var(--teal-400)' }}>transformée</em><br />pour les cliniques vétérinaires
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--teal-200)', lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
              VetPass Pro est le premier CRM conçu par un étudiant vétérinaire pour les cliniques. Dossiers enrichis, profils comportementaux, suivi des soins refusés, messagerie tracée — tout ce que votre logiciel actuel ne fait pas.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/clinique"><button style={{ ...S.btnPrimary, background: 'var(--teal-400)', color: 'var(--teal-900)', padding: '14px 28px', fontSize: '1rem' }}>Voir la démo ↗</button></Link>
              <Link to="/tarifs"><button style={{ ...S.btnOutline, borderColor: 'rgba(255,255,255,0.4)', color: '#fff', padding: '14px 28px', fontSize: '1rem' }}>3 mois gratuits — Bêta partenaire</button></Link>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
              {[['142+', 'Patients gérés'], ['4.6/5', 'Satisfaction'], ['2min30', 'Admission patient']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff' }}>{v}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--teal-200)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* DASHBOARD PREVIEW */}
          <DashboardPreview />
        </div>
      </section>

      {/* PROBLÈMES */}
      <section style={{ padding: '96px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Le constat</span>
          <h2 style={{ marginTop: 12, marginBottom: 20 }}>Ce que votre logiciel actuel ne fait pas</h2>
          <p style={{ color: 'var(--slate-600)', maxWidth: 540, margin: '0 auto' }}>Les logiciels vétérinaires gèrent les actes et la facturation. Mais la relation client, eux, ils ne la gèrent pas.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '👤', title: 'Profil client pauvre', desc: 'Nom, téléphone, vaccins. C\'est tout. Aucune donnée comportementale, aucun profil émotionnel, aucune sensibilité au prix.' },
            { icon: '📵', title: 'Aucune trace des échanges', desc: 'Pas d\'historique des appels, pas de log des conseils donnés. Chaque consultation repart de zéro.' },
            { icon: '🚪', title: 'Soins refusés oubliés', desc: 'Un détartrage refusé en janvier disparaît. Six mois plus tard, personne ne relance. Revenu perdu définitivement.' },
            { icon: '📊', title: 'Aucun scoring client', desc: 'Vous ne savez pas quels clients sont les plus fidèles, les plus rentables, ou les plus à risque de partir.' },
            { icon: '🐾', title: 'Zéro data lifestyle animal', desc: 'Âge et espèce, c\'est tout. Pas de mode de vie, pas d\'alimentation, pas d\'environnement — pourtant essentiels en prévention.' },
            { icon: '📋', title: 'Suivi post-consultation inexistant', desc: 'Après la sortie, le propriétaire est seul. Pas de fiche, pas de feedback, pas de suivi de l\'observance.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-sm)', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: '1rem', marginBottom: 10, fontFamily: 'var(--font-body)', fontWeight: 600 }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ padding: '96px 48px', background: 'var(--teal-50)', borderTop: '1px solid var(--teal-100)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>La solution</span>
            <h2 style={{ marginTop: 12, marginBottom: 20 }}>VetPass Pro — Ce que ça change concrètement</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { icon: '🧠', color: 'var(--purple-100)', colorIcon: 'var(--purple-500)', title: 'Profil comportemental complet', desc: 'Sensibilité au prix, degré d\'implication, profil émotionnel — sachez à qui vous parlez avant d\'entrer dans le cabinet.' },
              { icon: '📞', color: 'var(--blue-100)', colorIcon: 'var(--blue-500)', title: 'Log de communication total', desc: 'Chaque appel, SMS, email tracé avec résumé. L\'ASV sait ce qui a été dit. Le vétérinaire retrouve le contexte instantanément.' },
              { icon: '🔄', color: 'var(--orange-100)', colorIcon: 'var(--orange-500)', title: 'Relance intelligente des soins refusés', desc: 'Un détartrage refusé en janvier ? Le système vous rappelle de relancer en juillet. Aucun revenu perdu.' },
              { icon: '⭐', color: 'var(--amber-100)', colorIcon: 'var(--amber-500)', title: 'Scoring client 1-100', desc: 'Fréquence, panier moyen, fidélité, acceptation des soins. Connaissez la valeur de chaque client en 3 secondes.' },
              { icon: '🐾', color: 'var(--teal-100)', colorIcon: 'var(--teal-700)', title: 'Lifestyle animal complet', desc: 'Mode de vie, alimentation, niveau d\'activité, cohabitation. Des données essentielles pour une médecine préventive personnalisée.' },
              { icon: '📚', color: 'var(--green-100)', colorIcon: 'var(--green-500)', title: 'Fiches éducatives post-consultation', desc: 'Partagez une fiche personnalisée après chaque consultation. Le propriétaire comprend, retient, et fait confiance.' },
            ].map(({ icon, color, colorIcon, title, desc }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', gap: 20, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{icon}</div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-body)', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section style={{ padding: '96px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Retour sur investissement</span>
            <h2 style={{ marginTop: 12, marginBottom: 20 }}>Un seul détartrage récupéré rembourse votre abonnement</h2>
            <p style={{ color: 'var(--slate-600)', lineHeight: 1.7, marginBottom: 32 }}>Le forfait Starter est à 49€/mois. Un détartrage moyen en clinique vétérinaire coûte entre 80 et 150€. La relance d\'un seul soin refusé vous met en positif chaque mois.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['+2 à 5%', '+15 min', '74%'].map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--teal-700)', minWidth: 80 }}>{v}</div>
                  <span style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>{['de revenus récupérables par relances intelligentes', 'gagnées par consultation grâce aux dossiers enrichis', 'taux d\'honoré des rappels avec relance structurée'][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--teal-900)', borderRadius: 'var(--radius-xl)', padding: 36, color: '#fff' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 24 }}>Calcul rapide pour votre clinique</div>
            {[['Soins refusés/mois en moyenne', '~12'], ['Taux de récupération VetPass', '25%'], ['Valeur moyenne d\'un soin', '85€'], ['Revenus récupérés/mois', '255€'], ['Abonnement VetPass Pro', '99€']].map(([label, val], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,.7)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: i === 4 ? 'var(--teal-400)' : '#fff' }}>{val}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(52,201,154,.15)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--teal-200)' }}>Bénéfice net mensuel estimé</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--teal-400)' }}>+156€</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--teal-800), var(--teal-900))', padding: '80px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', marginBottom: 20, fontSize: '2.2rem' }}>Testez VetPass Pro gratuitement 3 mois</h2>
          <p style={{ color: 'var(--teal-200)', marginBottom: 36, lineHeight: 1.7 }}>Nous recherchons 5 cliniques partenaires pour notre phase bêta. Accès complet, formation incluse, en échange de vos retours.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/clinique"><button style={{ ...S.btnPrimary, background: 'var(--teal-400)', color: 'var(--teal-900)', padding: '14px 32px', fontSize: '1rem' }}>Voir la démonstration</button></Link>
            <Link to="/contact"><button style={{ ...S.btnOutline, borderColor: 'rgba(255,255,255,.4)', color: '#fff', padding: '14px 32px', fontSize: '1rem' }}>Devenir clinique partenaire</button></Link>
          </div>
          <p style={{ marginTop: 24, fontSize: '0.8rem', color: 'rgba(255,255,255,.4)' }}>Conçu par un étudiant en 4ème année de médecine vétérinaire · France · 2026</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--slate-900)', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.2rem' }}>🐾 VetPass <em style={{ color: 'var(--teal-400)' }}>Pro</em></div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['/', 'Accueil'], ['/clinique', 'Espace Clinique'], ['/tarifs', 'Tarifs'], ['/contact', 'Contact']].map(([to, label]) => (
            <Link key={to} to={to} style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>{label}</Link>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>© 2026 VetPass Pro · vetpass.pro@gmail.com</div>
      </footer>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 'var(--radius-xl)', padding: 20, backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {[['142', 'Patients actifs', 'var(--teal-400)'], ['4.6★', 'Satisfaction', '#F59E0B'], ['74%', 'Rappels honorés', 'var(--blue-500)'], ['8', 'Nouveaux ce mois', 'var(--purple-500)']].map(([v, l, c]) => (
          <div key={l} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: c }}>{v}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 'var(--radius-md)', padding: 16 }}>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.4)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rappels urgents</div>
        {[['🐕‍🦺', 'Rex', 'Vaccin en retard', 'var(--red-500)'], ['🐈', 'Milo', 'Vaccin RCP — dans 20j', 'var(--amber-500)'], ['🐕', 'Luna', 'Antiparasitaire — dans 10j', 'var(--amber-500)']].map(([av, name, label, c]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <span>{av}</span>
            <span style={{ flex: 1, fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{name}</span>
            <span style={{ fontSize: '0.75rem', color: c, background: `${c}22`, padding: '2px 8px', borderRadius: 100 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
