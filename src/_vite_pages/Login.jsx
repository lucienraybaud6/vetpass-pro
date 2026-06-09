import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { loginVet, loginOwner, isVet, isOwner } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('role') === 'owner' ? 'owner' : params.get('role') === 'vet' ? 'vet' : 'choice')
  const [form, setForm] = useState({ login: '', password: '', email: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  useEffect(() => {
    if (isVet) navigate('/clinique')
    if (isOwner) navigate('/proprietaire')
  }, [isVet, isOwner])

  const handle = (fn, redirect) => (e) => {
    e.preventDefault(); setLoading(true); setError('')
    setTimeout(() => {
      const r = fn()
      if (r.success) navigate(redirect)
      else setError(r.error)
      setLoading(false)
    }, 500)
  }

  const inp = (key, type = 'text', placeholder = '') => ({
    type, placeholder, value: form[key],
    onChange: e => setForm({ ...form, [key]: e.target.value }),
    style: { width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '11px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: 14, fontFamily: 'inherit' },
    onFocus: e => e.target.style.borderColor = '#0F6E56',
    onBlur: e => e.target.style.borderColor = '#E2E8F0'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F3D35, #0a2e25)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: 6 }}>🐾</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', color: '#fff' }}>VetPass <em style={{ color: '#34C99A' }}>Pro</em></div>
          </Link>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,.35)', marginTop: 4 }}>Plateforme de suivi vétérinaire</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.3)' }}>

          {/* CHOIX */}
          {mode === 'choice' && (
            <div style={{ padding: '36px 32px' }}>
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: '#1E293B', marginBottom: 6 }}>Qui êtes-vous ?</div>
              <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94A3B8', marginBottom: 24 }}>Choisissez votre espace pour vous connecter</div>
              {[
                { icon: '🏥', title: 'Espace Vétérinaire', desc: 'Accès complet — patients, calendrier, facturation, équipe', action: () => setMode('vet'), dark: true },
                { icon: '👤', title: 'Espace Propriétaire', desc: 'Suivi de votre animal — santé, rappels, fiches, contact', action: () => setMode('owner'), dark: false },
              ].map(({ icon, title, desc, action, dark }) => (
                <button key={title} onClick={action} style={{ width: '100%', marginBottom: 10, padding: '18px 20px', background: dark ? 'linear-gradient(135deg, #0F3D35, #0F6E56)' : '#fff', border: dark ? 'none' : '2px solid #E2E8F0', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', fontFamily: 'inherit', transition: 'transform .15s', boxShadow: dark ? '0 4px 20px rgba(15,110,86,.2)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: dark ? 'rgba(255,255,255,.15)' : '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: dark ? '#fff' : '#1E293B', marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: '0.78rem', color: dark ? 'rgba(255,255,255,.65)' : '#64748B', lineHeight: 1.4 }}>{desc}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: dark ? 'rgba(255,255,255,.5)' : '#CBD5E1' }}>›</div>
                </button>
              ))}
            </div>
          )}

          {/* VÉTÉRINAIRE */}
          {mode === 'vet' && (
            <div style={{ padding: '36px 32px' }}>
              <button onClick={() => { setMode('choice'); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '0.85rem', marginBottom: 18, padding: 0, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>← Retour</button>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B', marginBottom: 2 }}>🏥 Connexion Vétérinaire</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: 22 }}>Accès complet à la plateforme</div>
              <form onSubmit={handle(() => loginVet(form.login, form.password), '/clinique')}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Identifiant</label>
                <input {...inp('login', 'text', 'vetpass-admin')} required autoFocus />
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Mot de passe</label>
                <input {...inp('password', 'password', '••••••••')} required />
                {error && <div style={{ background: '#FEE2E2', borderRadius: 8, padding: '9px 13px', fontSize: '0.8rem', color: '#EF4444', marginBottom: 14 }}>❌ {error}</div>}
                <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#CBD5E1' : '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>{loading ? 'Connexion...' : 'Se connecter →'}</button>
                <div style={{ marginTop: 12, background: '#F8FAFC', borderRadius: 8, padding: '9px 13px', fontSize: '0.74rem', color: '#64748B' }}>💡 Par défaut : <strong>vetpass-admin</strong> / <strong>clinique2026</strong></div>
              </form>
            </div>
          )}

          {/* PROPRIÉTAIRE */}
          {mode === 'owner' && !showForgot && (
            <div style={{ padding: '36px 32px' }}>
              <button onClick={() => { setMode('choice'); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '0.85rem', marginBottom: 18, padding: 0, fontFamily: 'inherit' }}>← Retour</button>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B', marginBottom: 2 }}>👤 Espace Propriétaire</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: 22 }}>Accédez au suivi de votre animal</div>
              <form onSubmit={handle(() => loginOwner(form.email, form.password), '/proprietaire')}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Votre email</label>
                <input {...inp('email', 'email', 'votre@email.fr')} required autoFocus />
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Code d'accès</label>
                <input {...inp('password', 'password', 'Code fourni par votre clinique')} required />
                {error && <div style={{ background: '#FEE2E2', borderRadius: 8, padding: '9px 13px', fontSize: '0.8rem', color: '#EF4444', marginBottom: 14 }}>❌ {error}</div>}
                <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#CBD5E1' : '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>{loading ? '...' : 'Accéder à mon espace →'}</button>
                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: '#0F6E56', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Code d'accès oublié ?</button>
                </div>
                <div style={{ marginTop: 12, background: '#EBF9F4', borderRadius: 8, padding: '9px 13px', fontSize: '0.74rem', color: '#0F6E56', textAlign: 'center' }}>🔑 Votre code est fourni par votre vétérinaire lors de l'inscription de votre animal.</div>
              </form>
            </div>
          )}

          {/* MOT DE PASSE OUBLIÉ */}
          {mode === 'owner' && showForgot && (
            <div style={{ padding: '36px 32px' }}>
              <button onClick={() => { setShowForgot(false); setForgotSent(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '0.85rem', marginBottom: 18, padding: 0, fontFamily: 'inherit' }}>← Retour</button>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B', marginBottom: 6 }}>🔑 Code d'accès oublié</div>
              {!forgotSent ? (
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: 18 }}>Entrez l'adresse email associée à votre compte. Votre clinique recevra une demande de rappel de code.</p>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Votre email</label>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="votre@email.fr" style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '11px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: 14, fontFamily: 'inherit' }} />
                  <button onClick={() => setForgotSent(true)} style={{ width: '100%', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Envoyer la demande →</button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>📧</div>
                  <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: 8 }}>Demande envoyée</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>Votre clinique a été notifiée. Elle vous communiquera votre code d'accès dans les plus brefs délais.</div>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.72rem', color: 'rgba(255,255,255,.2)' }}>VetPass Pro · 2026</div>
      </div>
    </div>
  )
}
