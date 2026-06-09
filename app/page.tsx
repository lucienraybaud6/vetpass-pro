'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Phase = 'code' | 'email' | 'otp' | 'no_session'

interface StoredVet { id: string; email: string; first_name?: string | null; last_name?: string | null; clinic_name?: string | null; saved_at: number }

// ── Inline SVG icons ──────────────────────────────────────────────
function IconLock() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}
function IconClipboard() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// ── Shared styles ─────────────────────────────────────────────────
const fullBg: React.CSSProperties = {
  background: 'linear-gradient(145deg, #0d8270 0%, #0B6E5F 35%, #064d42 70%, #03332b 100%)',
  minHeight: '100vh',
  position: 'relative',
}
const gridOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
  pointerEvents: 'none',
}
const glassStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 24,
}
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 18px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 14,
  color: 'white',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'var(--font-inter), sans-serif',
  boxSizing: 'border-box',
}
const btnMint: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#9FE1CB',
  color: '#0B3D34',
  fontWeight: 700,
  borderRadius: 14,
  fontSize: 15,
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'var(--font-space), sans-serif',
  letterSpacing: '0.01em',
  transition: 'opacity 0.2s',
}

// ── Logo ──────────────────────────────────────────────────────────
function Logo() {
  return (
    <h1 style={{ fontFamily: 'var(--font-space), sans-serif', fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
      <span style={{ color: 'white' }}>Vet</span>
      <span style={{ color: '#9FE1CB' }}>Pass</span>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: 36 }}> Pro</span>
    </h1>
  )
}

// ── Error banner ──────────────────────────────────────────────────
function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div style={{ background: 'rgba(255,107,92,0.15)', border: '1px solid rgba(255,107,92,0.35)', borderRadius: 12, padding: '10px 16px', color: '#FF6B5C', fontSize: 13, textAlign: 'center' }}>
      {msg}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function HomePage() {
  const [phase, setPhase] = useState<Phase>('code')
  const [knownVet, setKnownVet] = useState<StoredVet | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vet_profile')
      if (raw) {
        const profile: StoredVet = JSON.parse(raw)
        const ageDays = (Date.now() - profile.saved_at) / 86400000
        if (ageDays < 90) setKnownVet(profile)
      }
    } catch { /* ignore */ }
  }, [])

  // Phase code
  const [code, setCode] = useState('')

  // Phase email
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [clinicInput, setClinicInput] = useState('')
  const [isNewVet, setIsNewVet] = useState(false)
  const [vetNeedsInfo, setVetNeedsInfo] = useState(false)

  // Phase OTP
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Shared
  const [vetEmail, setVetEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devOtp, setDevOtp] = useState('')

  // ── Phase 1: find animal + active session ─────────────────────
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const normalized = code.replace(/[#\s]/g, '').toUpperCase()
      const { data: animal } = await supabase
        .from('animals')
        .select('id, name')
        .ilike('vetpass_code', normalized)
        .maybeSingle()

      if (!animal) {
        setError('Aucun animal trouvé avec ce code VetPass.')
        return
      }

      const now = new Date().toISOString()
      const { data: session } = await supabase
        .from('vet_sessions')
        .select('id')
        .eq('animal_id', animal.id)
        .eq('is_active', true)
        .gt('expires_at', now)
        .maybeSingle()

      if (!session) {
        setPhase('no_session')
        return
      }

      sessionStorage.setItem('vp_state', JSON.stringify({ animalId: animal.id, sessionId: session.id, animalName: animal.name }))

      // Véto reconnu → accès direct sans email ni OTP
      if (knownVet) {
        window.location.href = `/session/${session.id}`
        return
      }

      setPhase('email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // ── Phase 2: send OTP ─────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const emailNorm = email.trim().toLowerCase()

      if (!vetNeedsInfo) {
        const { data: vet } = await supabase
          .from('vets')
          .select('id')
          .eq('email', emailNorm)
          .maybeSingle()
        if (!vet) {
          setIsNewVet(true)
          setVetNeedsInfo(true)
          setLoading(false)
          return
        }
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

      await supabase.from('vet_otps').insert({ email: emailNorm, otp, expires_at: expiresAt, used: false })
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNorm, otp, firstName: firstName.trim() || undefined }),
      })

      setDevOtp(otp)
      setVetEmail(emailNorm)
      setPhase('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi du code")
    } finally {
      setLoading(false)
    }
  }

  // ── Phase 3: verify OTP ───────────────────────────────────────
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otpDigits.join('')
    if (otpCode.length !== 6) { setError('Entrez les 6 chiffres du code'); return }
    setLoading(true)
    setError('')
    try {
      const now = new Date().toISOString()
      const { data: otpRecord } = await supabase
        .from('vet_otps')
        .select('id')
        .eq('email', vetEmail)
        .eq('otp', otpCode)
        .eq('used', false)
        .gt('expires_at', now)
        .maybeSingle()

      if (!otpRecord) {
        setError('Code incorrect ou expiré. Vérifiez votre email ou renvoyez un code.')
        setLoading(false)
        return
      }

      await supabase.from('vet_otps').update({ used: true }).eq('id', otpRecord.id)

      if (isNewVet) {
        const { data: newVet } = await supabase
          .from('vets')
          .upsert({ email: vetEmail, first_name: firstName.trim() || null, last_name: lastName.trim() || null, clinic_name: clinicInput.trim() || null }, { onConflict: 'email' })
          .select('id, first_name, last_name, clinic_name').single()
        if (newVet?.id) {
          localStorage.setItem('vet_id', newVet.id)
          localStorage.setItem('vet_profile', JSON.stringify({ id: newVet.id, email: vetEmail, first_name: newVet.first_name, last_name: newVet.last_name, clinic_name: newVet.clinic_name, saved_at: Date.now() }))
        }
      } else {
        const { data: existingVet } = await supabase.from('vets').select('id, first_name, last_name, clinic_name').eq('email', vetEmail).maybeSingle()
        if (existingVet?.id) {
          localStorage.setItem('vet_id', existingVet.id)
          localStorage.setItem('vet_profile', JSON.stringify({ id: existingVet.id, email: vetEmail, first_name: existingVet.first_name, last_name: existingVet.last_name, clinic_name: existingVet.clinic_name, saved_at: Date.now() }))
        }
      }

      const stored = JSON.parse(sessionStorage.getItem('vp_state') || '{}')
      const sid = stored.sessionId
      if (!sid) {
        setError('Session perdue, recommencez depuis l\'étape 1 en saisissant le code animal.')
        setLoading(false)
        return
      }
      window.location.href = `/session/${sid}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la vérification')
    } finally {
      setLoading(false)
    }
  }

  // ── OTP input handlers ────────────────────────────────────────
  const handleOtpChange = (i: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otpDigits]
    next[i] = value
    setOtpDigits(next)
    if (value && i < 5) otpRefs.current[i + 1]?.focus()
  }
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otpDigits]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtpDigits(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={fullBg}>
      <div style={gridOverlay} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '32px 16px' }}>

        {/* Logo */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <Logo />
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 10, fontFamily: 'var(--font-inter), sans-serif' }}>
            L&apos;espace vétérinaire VetPass
          </p>
        </div>

        {/* ── État 1 — Saisie code ── */}
        {phase === 'code' && (
          <>
            <div style={{ ...glassStyle, maxWidth: 440, width: '100%', padding: 40 }}>
              {knownVet ? (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ background: 'rgba(159,225,203,0.1)', border: '1px solid rgba(159,225,203,0.25)', borderRadius: 14, padding: '14px 18px', marginBottom: 8 }}>
                    <p style={{ color: '#9FE1CB', fontSize: 15, fontWeight: 700, marginBottom: 2, fontFamily: 'var(--font-space), sans-serif' }}>
                      Bonjour Dr. {[knownVet.first_name, knownVet.last_name].filter(Boolean).join(' ') || 'Docteur'} 👋
                    </p>
                    {knownVet.clinic_name && (
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>{knownVet.clinic_name}</p>
                    )}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 20 }}>
                    Saisissez le code VetPass du patient pour accéder directement à sa fiche.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('vet_id')
                      localStorage.removeItem('vet_profile')
                      window.location.reload()
                    }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Ce n&apos;est pas vous ?
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-space), sans-serif' }}>
                    Accéder à un patient
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                    Saisissez le code VetPass du patient pour accéder à sa fiche médicale complète.
                  </p>
                </>
              )}
              <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
                  placeholder="TONY-1580"
                  autoFocus
                  autoComplete="off"
                  style={{
                    ...inputStyle,
                    fontSize: 26,
                    textAlign: 'center',
                    letterSpacing: '0.14em',
                    fontFamily: 'var(--font-space), sans-serif',
                    fontWeight: 600,
                  }}
                />
                {error && <ErrorBanner msg={error} />}
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  style={{ ...btnMint, opacity: loading || !code.trim() ? 0.5 : 1 }}
                >
                  {loading ? 'Recherche en cours…' : 'Accéder à la fiche →'}
                </button>
              </form>
            </div>

            {/* 3 étapes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 440, width: '100%', marginTop: 28 }}>
              {[
                { icon: <IconLock />, title: 'Le proprio autorise', desc: "Il génère un accès depuis son application VetPass" },
                { icon: <IconClipboard />, title: 'Fiche complète', desc: "Historique, vaccins, traitements en un clin d'œil" },
                { icon: <IconCheck />, title: 'Vous validez', desc: "La consultation est certifiée et visible pour le propriétaire" },
              ].map(step => (
                <div key={step.title} style={{ ...glassStyle, padding: '20px 14px', textAlign: 'center' }}>
                  <div style={{ color: '#9FE1CB', display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                    {step.icon}
                  </div>
                  <p style={{ color: 'white', fontSize: 11, fontWeight: 600, marginBottom: 6, fontFamily: 'var(--font-space), sans-serif', lineHeight: 1.4 }}>{step.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── État no_session ── */}
        {phase === 'no_session' && (
          <div style={{ ...glassStyle, maxWidth: 440, width: '100%', padding: 48, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,107,92,0.15)', border: '1px solid rgba(255,107,92,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" fill="none" stroke="#FF6B5C" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-space), sans-serif' }}>
              Accès non autorisé
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Le propriétaire doit d&apos;abord autoriser l&apos;accès depuis son application VetPass.
            </p>
            <button
              onClick={() => { setPhase('code'); setCode(''); setError('') }}
              style={{ ...btnMint, width: 'auto', padding: '12px 32px' }}
            >
              ← Retour
            </button>
          </div>
        )}

        {/* ── État 2 — Email ── */}
        {phase === 'email' && (
          <div style={{ ...glassStyle, maxWidth: 440, width: '100%', padding: 40 }}>
            <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-space), sans-serif' }}>
              Identification vétérinaire
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              {vetNeedsInfo
                ? 'Première connexion — complétez votre profil vétérinaire.'
                : 'Entrez votre email professionnel pour recevoir votre code de connexion.'}
            </p>
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="votre@clinique.fr"
                autoFocus={!vetNeedsInfo}
                disabled={vetNeedsInfo}
                style={{ ...inputStyle, opacity: vetNeedsInfo ? 0.65 : 1 }}
              />
              {vetNeedsInfo && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" autoFocus style={inputStyle} />
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" style={inputStyle} />
                  </div>
                  <input type="text" value={clinicInput} onChange={e => setClinicInput(e.target.value)} placeholder="Clinique (optionnel)" style={inputStyle} />
                </>
              )}
              {error && <ErrorBanner msg={error} />}
              <button type="submit" disabled={loading || !email.trim()} style={{ ...btnMint, opacity: loading || !email.trim() ? 0.5 : 1 }}>
                {loading ? 'Vérification…' : vetNeedsInfo ? 'Créer mon profil et recevoir le code' : 'Recevoir le code →'}
              </button>
              <button
                type="button"
                onClick={() => { setPhase('code'); setVetNeedsInfo(false); setIsNewVet(false); setError('') }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 8 }}
              >
                ← Retour
              </button>
            </form>
          </div>
        )}

        {/* ── État 2b — OTP ── */}
        {phase === 'otp' && (
          <div style={{ ...glassStyle, maxWidth: 440, width: '100%', padding: 40 }}>
            <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-space), sans-serif' }}>
              Code de vérification
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
              Un code à 6 chiffres a été envoyé à{' '}
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{vetEmail}</strong>.
              <br />Valable 10 minutes.
            </p>
            {devOtp && (
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}>Mode dev — Code :</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#9FE1CB', fontFamily: 'var(--font-space), monospace', letterSpacing: '0.1em' }}>{devOtp}</span>
              </div>
            )}
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={i === 0}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    style={{
                      width: 52,
                      height: 60,
                      textAlign: 'center',
                      fontSize: 28,
                      fontWeight: 700,
                      fontFamily: 'var(--font-space), sans-serif',
                      background: digit ? 'rgba(159,225,203,0.15)' : 'rgba(255,255,255,0.08)',
                      border: digit ? '2px solid rgba(159,225,203,0.7)' : '2px solid rgba(255,255,255,0.18)',
                      borderRadius: 14,
                      color: 'white',
                      outline: 'none',
                      caretColor: '#9FE1CB',
                      transition: 'all 0.15s',
                      boxSizing: 'border-box',
                    }}
                  />
                ))}
              </div>
              {error && <ErrorBanner msg={error} />}
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length < 6}
                style={{ ...btnMint, opacity: loading || otpDigits.join('').length < 6 ? 0.5 : 1 }}
              >
                {loading ? 'Vérification…' : 'Vérifier →'}
              </button>
              <button
                type="button"
                onClick={() => { setPhase('email'); setOtpDigits(['', '', '', '', '', '']); setVetNeedsInfo(false); setError('') }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 8 }}
              >
                ← Renvoyer un nouveau code
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
