'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Listes vaccins par espèce ─────────────────────────────────────
const VAX_BY_SPECIES: Record<string, string[]> = {
  dog: ['Rage', 'CHPPiL (Carré/Hépatite/Parvo/Parainfluenza/Leptospirose)', 'Toux du chenil (Bordetella)', 'Leishmaniose', 'Piroplasmose'],
  cat: ['Typhus (Panleucopénie/Rhinotrachéite/Calicivirus)', 'Leucose (FeLV)', 'Rage', 'Chlamydiose', 'FIV'],
}

// ── Traduction des clés de suivi chronique ────────────────────────
const CHRONIC_LABELS: Record<string, string> = {
  // Diabète
  glucose_morning: 'Glycémie matin',
  glucose_evening: 'Glycémie soir',
  glucose_unit: 'Unité',
  insulin_dose: 'Dose insuline',
  insulin_unit: 'Unité insuline',
  signs: 'Signes cliniques',
  ketones: 'Cétones',
  // Hyperthyroïdie
  weight: 'Poids',
  appetite: 'Appétit',
  vomiting: 'Vomissements',
  agitation: 'Agitation',
  heart_rate: 'Fréquence cardiaque',
  // IRC
  drinking: 'Consommation d\'eau',
  urination: 'Urination',
  energy: 'Énergie',
  creatinine: 'Créatinine',
  // Épilepsie
  seizures: 'Crises',
  seizure_duration: 'Durée des crises',
  medication_given: 'Médicament administré',
  // Cardiopathie
  cough: 'Toux',
  breathing: 'Respiration',
  exercise_tolerance: 'Tolérance à l\'effort',
  // Arthrose
  mobility: 'Mobilité',
  pain_level: 'Niveau de douleur',
  // Cushing
  water_intake: 'Consommation d\'eau',
  urination_frequency: 'Fréquence urination',
  pot_belly: 'Ventre distendu',
  // MICI
  stool_quality: 'Qualité des selles',
  blood_in_stool: 'Sang dans les selles',
  nausea: 'Nausées',
  // Asthme
  wheezing: 'Sifflements',
  coughing: 'Toux',
  breathing_difficulty: 'Difficulté respiratoire',
  // Hypothyroïdie
  lethargy: 'Léthargie',
  cold_intolerance: 'Intolérance au froid',
  hair_loss: 'Perte de poils',
  // Commun
  temperature: 'Température',
  blood_pressure: 'Tension artérielle',
  notes: 'Notes',
}
function translateKey(k: string): string {
  return CHRONIC_LABELS[k] ?? k.replace(/_/g, ' ')
}
function hasValue(v: unknown): boolean {
  return v !== false && v !== null && v !== undefined && v !== ''
}
function formatChronicValue(v: unknown): { text: string; isTrue: boolean } {
  if (v === true) return { text: 'Oui', isTrue: true }
  return { text: String(v), isTrue: false }
}

// ── Traduction des noms de conditions chroniques ──────────────────
const CONDITION_LABELS: Record<string, string> = {
  diabetes:    'Diabète sucré',
  kidney:      'Insuffisance rénale chronique',
  hyperthyroid:'Hyperthyroïdie',
  epilepsy:    'Épilepsie',
  cushing:     'Syndrome de Cushing',
  cardio:      'Cardiopathie',
  arthrosis:   'Arthrose',
  asthma:      'Asthme félin',
  ibd:         'MICI (intestin inflammatoire)',
  hypothyroid: 'Hypothyroïdie',
}
const CONDITION_DESCRIPTIONS: Record<string, string> = {
  diabetes:    'Surveillance glycémique quotidienne — suivi des doses d\'insuline et des corps cétoniques',
  kidney:      'Suivi de la fonction rénale — hydratation, énergie et créatinine',
  hyperthyroid:'Surveillance de la thyroïde — suivi du poids, appétit et signes cliniques',
  epilepsy:    'Suivi des crises épileptiques — fréquence, durée et traitements administrés',
  cushing:     'Surveillance du syndrome de Cushing — consommation d\'eau et signes cliniques',
  cardio:      'Surveillance cardiaque — toux, respiration et tolérance à l\'effort',
  arthrosis:   'Suivi orthopédique — douleur et mobilité articulaire',
  asthma:      'Surveillance respiratoire — sifflements, toux et difficultés respiratoires',
  ibd:         'Suivi digestif — qualité des selles, nausées et appétit',
  hypothyroid: 'Surveillance thyroïdienne — énergie, poids et tolérance au froid',
}
function translateCondition(c: string): string {
  return CONDITION_LABELS[c] ?? c.replace(/_/g, ' ')
}
function describeCondition(c: string): string {
  return CONDITION_DESCRIPTIONS[c] ?? ''
}

// ── Types ────────────────────────────────────────────────────────
interface Animal {
  id: string; name: string; species: string; breed?: string | null
  birth_date?: string | null; weight_kg?: number | null; photo_url?: string | null
  vetpass_code: string; is_sterilized?: boolean; allergies?: string[] | null
}
interface PinnedObs { id: string; note: string; created_at: string; photo_url?: string | null }
interface Treatment { id: string; name: string; dose?: string | null; frequency?: string | null; is_ongoing?: boolean }
interface Vaccination { id: string; vaccine_name: string; administered_at?: string | null; next_due_at?: string | null; batch_number?: string | null }
interface Deworming { id: string; product_name?: string | null; administered_at?: string | null; next_due_at?: string | null }
interface MedicalVisit { id: string; visit_date: string; reason?: string | null; diagnosis?: string | null; acts?: string | null; prescription?: string | null; clinic_name?: string | null; vet_name?: string | null; locked?: boolean; created_by?: string | null }
interface Appointment { id: string; appointment_date: string; reason?: string | null; clinic_name?: string | null }
interface MedicationReminder { id: string; name: string; dose?: string | null; frequency?: string | null; next_due_at?: string | null; notes?: string | null }
interface SessionViewProps {
  session: { id: string; clinic_name?: string | null; expires_at: string }
  animal: Animal
  pinnedObs: PinnedObs[]
  treatments: Treatment[]
  vaccinations: Vaccination[]
  dewormings: Deworming[]
  medicalVisits: MedicalVisit[]
  lastWeight: { weight_kg: number; recorded_at: string } | null
  chronicCondition: { id: string; condition: string; chronic_records: Array<{ id: string; recorded_at: string; data: Record<string, unknown> }> } | null
  appointments: Appointment[]
  medicationReminders: MedicationReminder[]
}

// ── Utilities ────────────────────────────────────────────────────
function fmt(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}
function age(birth: string): string {
  const b = new Date(birth), n = new Date()
  const m = (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth())
  if (m < 1) return 'Moins d\'1 mois'
  if (m < 12) return `${m} mois`
  const y = Math.floor(m / 12), mo = m % 12
  return mo > 0 ? `${y} an${y > 1 ? 's' : ''} et ${mo} mois` : `${y} an${y > 1 ? 's' : ''}`
}
function speciesLabel(s: string): string {
  return ({ dog: 'Chien', cat: 'Chat', horse: 'Cheval', nac: 'NAC', other: 'Autre' } as Record<string, string>)[s] ?? s
}
function vaxStatus(nextDue: string | null | undefined) {
  if (!nextDue) return null
  const days = Math.floor((new Date(nextDue).getTime() - Date.now()) / 86400000)
  if (days < 0) return { kind: 'overdue' as const, label: `En retard · ${Math.abs(days)}j` }
  if (days <= 30) return { kind: 'soon' as const, label: `Dans ${days}j` }
  return { kind: 'ok' as const, label: 'À jour' }
}
function formatTimer(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function computeRecallDate(vaccineName: string, administeredAt: string): string {
  if (!administeredAt) return ''
  const lower = vaccineName.toLowerCase()
  const base = new Date(administeredAt)
  const years = lower.includes('titre vaccinal') || lower.includes('titre rabique') ? 3 : 1
  base.setFullYear(base.getFullYear() + years)
  return base.toISOString().split('T')[0]
}

// ── Actes chips ──────────────────────────────────────────────────
const ACT_CHIPS = ['Consultation générale', 'Vaccination', 'Radiographie', 'Prise de sang', 'Vermifuge', 'Détartrage', 'Castration', 'Stérilisation', 'Échographie', 'Suturation', 'Analyse urinaire', 'ECG']

// ── Sidebar nav items ─────────────────────────────────────────────
const NAV = [
  { id: 'apercu', label: 'Aperçu' },
  { id: 'observations', label: 'À montrer au véto' },
  { id: 'vaccinations', label: 'Vaccinations' },
  { id: 'vermifugations', label: 'Vermifugations' },
  { id: 'suivi', label: 'Suivi médical' },
  { id: 'historique', label: 'Historique' },
  { id: 'actes', label: 'Actes du jour' },
  { id: 'ordonnance', label: 'Ordonnance' },
]

// ── Small reusable pieces ────────────────────────────────────────
function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2e2a', fontFamily: 'var(--font-space), sans-serif', margin: 0 }}>{title}</h3>
      {action}
    </div>
  )
}
function WhiteCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8e3da', padding: 20, ...style }}>
      {children}
    </div>
  )
}
function StatusBadge({ kind, label }: { kind: 'ok' | 'soon' | 'overdue' | null | undefined; label: string }) {
  const map = { ok: { bg: '#d1fae5', color: '#065f46' }, soon: { bg: '#fef3c7', color: '#92400e' }, overdue: { bg: '#fee2e2', color: '#991b1b' } }
  const c = kind ? map[kind] : { bg: '#f3f4f6', color: '#6b7280' }
  return <span style={{ ...c, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{label}</span>
}
function TextArea({ label, value, onChange, placeholder, rows = 4, note }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; note?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: '100%', padding: '10px 14px', background: '#FBF9F4', border: '1.5px solid #e8e3da', borderRadius: 12, fontSize: 14, color: '#1a2e2a', fontFamily: 'var(--font-inter), sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
      />
      {note && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, fontStyle: 'italic' }}>{note}</p>}
    </div>
  )
}
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#FBF9F4', border: '1px solid #e8e3da', borderRadius: 12, padding: '12px 16px' }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#1a2e2a', fontFamily: 'var(--font-space), sans-serif' }}>{value || '—'}</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function SessionView({ session, animal, pinnedObs, treatments, vaccinations, dewormings, medicalVisits, lastWeight, chronicCondition, appointments, medicationReminders }: SessionViewProps) {

  // Form state
  const [clinicName, setClinicName] = useState(session.clinic_name ?? '')
  const [vetName, setVetName] = useState('')
  const [motif, setMotif] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [selectedActs, setSelectedActs] = useState<string[]>([])
  const [prescriptionText, setPrescriptionText] = useState('')
  const [prescriptionUrl, setPrescriptionUrl] = useState('')
  const [patientSummary, setPatientSummary] = useState('')
  const [watchOut, setWatchOut] = useState('')

  // UI state
  const [activeSection, setActiveSection] = useState('apercu')
  const [timeLeft, setTimeLeft] = useState(0)
  const [vetId, setVetId] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validated, setValidated] = useState(false)
  const [formError, setFormError] = useState('')

  // Vaccination modal
  const [showVaxModal, setShowVaxModal] = useState(false)
  const [newVax, setNewVax] = useState({ vaccine_name: '', administered_at: '', next_due_at: '' })
  const [vaxUseCustom, setVaxUseCustom] = useState(false)
  const [savingVax, setSavingVax] = useState(false)
  const [localVax, setLocalVax] = useState(vaccinations)

  // Deworming modal
  const [showDewModal, setShowDewModal] = useState(false)
  const [newDew, setNewDew] = useState({ product_name: '', administered_at: '', next_due_at: '' })
  const [dewUseCustom, setDewUseCustom] = useState(false)
  const [dewFrequency, setDewFrequency] = useState('3months')
  const [savingDew, setSavingDew] = useState(false)
  const [localDew, setLocalDew] = useState(dewormings)

  // PDF ordonnance
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [pdfFileName, setPdfFileName] = useState('')

  // Countdown timer
  useEffect(() => {
    const update = () => setTimeLeft(Math.max(0, new Date(session.expires_at).getTime() - Date.now()))
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [session.expires_at])

  // Get vet_id from localStorage
  useEffect(() => {
    setVetId(localStorage.getItem('vet_id'))
  }, [])

  // Scroll to section
  const scrollTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // PDF upload ordonnance
  const handlePdfUpload = async (file: File) => {
    setUploadingPdf(true)
    try {
      const { data, error } = await supabase.storage
        .from('medical-docs')
        .upload(`ordonnances/${animal.id}/${Date.now()}.pdf`, file, {
          contentType: 'application/pdf',
          upsert: false,
        })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('medical-docs').getPublicUrl(data.path)
      setPrescriptionUrl(urlData.publicUrl)
      setPdfFileName(file.name)
    } catch (e: unknown) {
      alert('Erreur upload PDF : ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setUploadingPdf(false)
    }
  }

  // Generate AI summary
  const generateAI = async () => {
    if (!diagnosis && selectedActs.length === 0) return
    setAiLoading(true)
    try {
      const watchOutPart = watchOut.trim() ? ` Points à surveiller absolument : ${watchOut.trim()}. Mets ces points en évidence dans le résumé.` : ''
      const promptText = `Génère un résumé clair en français pour le propriétaire de cette consultation vétérinaire. Diagnostic: ${diagnosis}. Actes réalisés: ${selectedActs.join(', ')}. Ordonnance: ${prescriptionText}.${watchOutPart} Explique en langage simple, sans jargon médical.`
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          history: [],
          systemPrompt: 'Tu es un assistant vétérinaire bienveillant. Réponds toujours en français, de façon claire et rassurante pour le propriétaire.',
        }),
      })
      console.log('[AI] status:', res.status)
      const raw = await res.text()
      console.log('[AI] raw response:', raw)
      const data = JSON.parse(raw)
      const summary = data?.response || ''
      if (summary) setPatientSummary(summary)
    } catch (e: unknown) {
      console.error('[AI] error:', e)
      alert('Erreur IA : ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setAiLoading(false)
    }
  }

  // Add vaccination
  const handleAddVax = async () => {
    if (!newVax.vaccine_name.trim() || !newVax.administered_at) return
    setSavingVax(true)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/vaccinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          animal_id: animal.id,
          vaccine_name: newVax.vaccine_name.trim(),
          administered_at: newVax.administered_at,
          next_due_at: newVax.next_due_at || null,
          vet_name: vetName || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Erreur lors de l\'ajout du vaccin')
      if (data?.[0]) setLocalVax(prev => [data[0], ...prev])
      setShowVaxModal(false)
      setVaxUseCustom(false)
      setNewVax({ vaccine_name: '', administered_at: '', next_due_at: '' })
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erreur lors de l\'ajout du vaccin')
    } finally {
      setSavingVax(false)
    }
  }

  // Add deworming
  const handleAddDew = async () => {
    if (!newDew.product_name.trim() || !newDew.administered_at) return
    setSavingDew(true)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/dewormings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          animal_id: animal.id,
          product_name: newDew.product_name.trim(),
          administered_at: newDew.administered_at,
          next_due_at: newDew.next_due_at || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Erreur lors de l\'ajout du vermifuge')
      if (data?.[0]) setLocalDew(prev => [data[0], ...prev])
      setShowDewModal(false)
      setDewUseCustom(false)
      setDewFrequency('3months')
      setNewDew({ product_name: '', administered_at: '', next_due_at: '' })
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erreur lors de l\'ajout du vermifuge')
    } finally {
      setSavingDew(false)
    }
  }

  // Toggle act chip
  const toggleAct = (act: string) => {
    setSelectedActs(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act])
  }

  // Validate consultation
  const handleValidate = async () => {
    if (!diagnosis && selectedActs.length === 0) {
      alert('Veuillez remplir au moins le diagnostic ou les actes réalisés')
      return
    }
    setValidating(true)
    setFormError('')
    try {
      // 1. Insérer la consultation via proxy
      const visitBody = {
        animal_id: animal.id,
        session_id: session.id,
        clinic_name: clinicName.trim() || null,
        visit_date: new Date().toISOString(),
        reason: motif.trim() || selectedActs.join(', ') || null,
        diagnosis: diagnosis.trim() || null,
        prescription: prescriptionText.trim() || null,
        prescription_url: prescriptionUrl.trim() || null,
        summary_owner: patientSummary.trim() || null,
        acts: selectedActs.join(', ') || null,
        locked: true,
        created_by: 'clinic',
        vet_id: vetId ?? null,
        watch_out: watchOut.trim() || null,
      }
      console.log('[VALIDATE] body:', JSON.stringify(visitBody))
      const visitRes = await fetch('/api/validate-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitBody),
      })
      if (!visitRes.ok) {
        const err = await visitRes.json().catch(() => ({}))
        throw new Error(err?.message || `Erreur enregistrement consultation (${visitRes.status})`)
      }

      // 2. Fermer la session via proxy
      await fetch('/api/close-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, closed_at: new Date().toISOString() }),
      })

      // 3. Afficher confirmation
      setValidated(true)
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Erreur lors de la validation')
    } finally {
      setValidating(false)
    }
  }

  // ── Confirmation screen ───────────────────────────────────────
  if (validated) {
    return (
      <div style={{ background: 'linear-gradient(145deg, #0d8270 0%, #0B6E5F 35%, #064d42 70%, #03332b 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '52px 44px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(159,225,203,0.2)', border: '2px solid #9FE1CB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" fill="none" stroke="#9FE1CB" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 style={{ color: 'white', fontSize: 26, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-space), sans-serif' }}>
            ✓ Consultation enregistrée
          </h2>
          <p style={{ color: '#9FE1CB', fontSize: 20, fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-space), sans-serif' }}>
            {animal.name}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            La fiche a été certifiée et transmise au propriétaire dans l&apos;application VetPass.
          </p>
          {selectedActs.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 20px', marginBottom: 24 }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Actes réalisés</p>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{selectedActs.join(' · ')}</p>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 16px', marginBottom: 28, color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'monospace' }}>
            Session {session.id.slice(0, 8)}… fermée
          </div>
          <button
            onClick={() => { window.location.href = '/' }}
            style={{ display: 'inline-block', padding: '13px 32px', background: '#9FE1CB', color: '#0B3D34', fontWeight: 700, borderRadius: 14, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-space), sans-serif' }}
          >
            Nouvelle consultation
          </button>
        </div>
      </div>
    )
  }

  // ── Main layout ───────────────────────────────────────────────
  const sidebarGrad = 'linear-gradient(180deg, #0d8270 0%, #0B6E5F 50%, #064d42 100%)'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════════ */}
      <aside style={{ width: 280, minWidth: 280, background: sidebarGrad, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>

        {/* Logo */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontFamily: 'var(--font-space), sans-serif', fontSize: 22, fontWeight: 700 }}>
            <span style={{ color: 'white' }}>Vet</span>
            <span style={{ color: '#9FE1CB' }}>Pass</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: 17 }}> Pro</span>
          </span>
        </div>

        {/* Mini fiche animal */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {animal.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={animal.photo_url} alt={animal.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.25)', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-space), sans-serif', margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {animal.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 }}>
                {speciesLabel(animal.species)}{animal.breed ? ` · ${animal.breed}` : ''}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
            {animal.birth_date && <span style={{ color: 'rgba(255,255,255,0.6)' }}>{age(animal.birth_date)}</span>}
            {lastWeight && <span style={{ color: 'rgba(255,255,255,0.6)' }}>{lastWeight.weight_kg} kg</span>}
          </div>
          <div style={{ marginTop: 10 }}>
            <span style={{ background: 'rgba(159,225,203,0.15)', border: '1px solid rgba(159,225,203,0.35)', borderRadius: 99, padding: '4px 10px', color: '#9FE1CB', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>
              #{animal.vetpass_code}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '12px 12px', flex: 1 }}>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: activeSection === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: activeSection === item.id ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: activeSection === item.id ? 600 : 400,
                fontFamily: 'var(--font-inter), sans-serif',
                textAlign: 'left', marginBottom: 2, transition: 'all 0.15s',
              }}
            >
              {item.label}
              {item.id === 'observations' && pinnedObs.length > 0 && (
                <span style={{ background: '#FF6B5C', color: 'white', borderRadius: 99, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>
                  {pinnedObs.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Timer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Session expire dans</p>
          <p style={{ color: '#FF6B5C', fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-space), monospace', letterSpacing: '0.05em' }}>
            {formatTimer(timeLeft)}
          </p>
        </div>

        {/* Validate button */}
        <div style={{ padding: '16px 16px 24px' }}>
          <button
            onClick={handleValidate}
            disabled={validating}
            style={{ width: '100%', padding: '13px', background: '#9FE1CB', color: '#0B3D34', fontWeight: 700, borderRadius: 14, fontSize: 14, cursor: validating ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'var(--font-space), sans-serif', opacity: validating ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {validating ? (
              <>
                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(11,61,52,0.3)', borderTop: '2px solid #0B3D34', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Enregistrement…
              </>
            ) : '✓ Valider et fermer'}
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          MAIN
      ═══════════════════════════════════════════ */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#FBF9F4' }}>

        {/* Sticky mini-header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', borderBottom: '1px solid #e8e3da', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>Consultation du </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a2e2a' }}>
              {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {formError && (
              <span style={{ color: '#FF6B5C', fontSize: 12, background: '#fff1f0', border: '1px solid #ffc4bf', borderRadius: 8, padding: '4px 12px' }}>{formError}</span>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={clinicName}
                onChange={e => setClinicName(e.target.value)}
                placeholder="Clinique"
                style={{ padding: '7px 12px', borderRadius: 10, border: '1.5px solid #e8e3da', fontSize: 13, background: '#FBF9F4', color: '#1a2e2a', outline: 'none', width: 140 }}
              />
              <input
                type="text"
                value={vetName}
                onChange={e => setVetName(e.target.value)}
                placeholder="Dr. Martin"
                style={{ padding: '7px 12px', borderRadius: 10, border: '1.5px solid #e8e3da', fontSize: 13, background: '#FBF9F4', color: '#1a2e2a', outline: 'none', width: 120 }}
              />
            </div>
            <button
              onClick={handleValidate}
              disabled={validating}
              style={{ padding: '8px 20px', background: '#0B6E5F', color: 'white', fontWeight: 700, borderRadius: 10, fontSize: 13, border: 'none', cursor: validating ? 'not-allowed' : 'pointer', opacity: validating ? 0.7 : 1, fontFamily: 'var(--font-space), sans-serif' }}
            >
              {validating ? 'Enregistrement…' : '✓ Valider'}
            </button>
          </div>
        </div>

        <div style={{ padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* ── Section Aperçu ── */}
          <section id="apercu">
            <SectionTitle title="Aperçu" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <Field label="Espèce" value={speciesLabel(animal.species)} />
              <Field label="Race" value={animal.breed ?? '—'} />
              <Field label="Stérilisé(e)" value={animal.is_sterilized ? 'Oui' : 'Non'} />
              <Field label="Naissance" value={animal.birth_date ? `${fmt(animal.birth_date)} (${age(animal.birth_date)})` : '—'} />
              <Field label="Poids" value={lastWeight ? `${lastWeight.weight_kg} kg — ${fmt(lastWeight.recorded_at)}` : animal.weight_kg ? `${animal.weight_kg} kg` : '—'} />
              <Field label="Code VetPass" value={`#${animal.vetpass_code}`} />
            </div>
            {animal.allergies && animal.allergies.length > 0 && (
              <div style={{ background: '#fff5f4', border: '1.5px solid #FF6B5C', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#FF6B5C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>⚠ Allergies connues</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {animal.allergies.map((a, i) => (
                    <span key={i} style={{ background: '#FF6B5C', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Traitements en cours */}
              <WhiteCard>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Traitements en cours</p>
                {treatments.length === 0 && medicationReminders.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#c4bfb5', fontStyle: 'italic' }}>Aucun traitement en cours</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {treatments.slice(0, 4).map(t => (
                      <div key={t.id} style={{ background: '#f5f0ff', border: '1px solid #e9d8fd', borderRadius: 10, padding: '10px 14px' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#4c1d95', margin: 0 }}>{t.name}</p>
                        {t.dose && <p style={{ fontSize: 12, color: '#7c3aed', margin: '2px 0 0' }}>{t.dose}{t.frequency ? ` · ${t.frequency}` : ''}</p>}
                      </div>
                    ))}
                    {medicationReminders.slice(0, 3).map(r => (
                      <div key={r.id} style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '10px 14px' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0c4a6e', margin: 0 }}>{r.name}</p>
                        {r.dose && <p style={{ fontSize: 12, color: '#0369a1', margin: '2px 0 0' }}>{r.dose}{r.frequency ? ` · ${r.frequency}` : ''}{r.next_due_at ? ` · prochain ${fmt(r.next_due_at)}` : ''}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </WhiteCard>

              {/* Prochain RDV */}
              <WhiteCard>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Prochain rendez-vous</p>
                {appointments.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#c4bfb5', fontStyle: 'italic' }}>Aucun RDV planifié</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {appointments.map(a => (
                      <div key={a.id} style={{ background: '#f0fdf9', border: '1px solid #a7f3d0', borderRadius: 10, padding: '10px 14px' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#065f46', fontFamily: 'var(--font-space), sans-serif', margin: 0 }}>{fmt(a.appointment_date)}</p>
                        {a.reason && <p style={{ fontSize: 12, color: '#047857', margin: '2px 0 0' }}>{a.reason}</p>}
                        {a.clinic_name && <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{a.clinic_name}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </WhiteCard>
            </div>
          </section>

          {/* ── Section À montrer au véto ── */}
          <section id="observations">
            <SectionTitle title="À montrer au vétérinaire" />
            <div style={{ background: '#FFF8F0', border: '1.5px solid #fed7aa', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Déclaré par le propriétaire
              </p>
              {pinnedObs.length === 0 ? (
                <p style={{ fontSize: 14, color: '#c4bfb5', fontStyle: 'italic' }}>Aucune observation épinglée par le propriétaire</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {pinnedObs.map(obs => (
                    <div key={obs.id} style={{ background: 'white', border: '1px solid #fed7aa', borderRadius: 12, padding: 16 }}>
                      <p style={{ fontSize: 14, color: '#1a2e2a', lineHeight: 1.6, margin: 0 }}>{obs.note}</p>
                      {obs.photo_url && (
                        <a href={obs.photo_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 12 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={obs.photo_url} alt="" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 10, objectFit: 'cover', cursor: 'pointer' }} />
                        </a>
                      )}
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>{fmt(obs.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Section Vaccinations ── */}
          <section id="vaccinations">
            <SectionTitle
              title="Vaccinations"
              action={
                <button
                  onClick={() => setShowVaxModal(true)}
                  style={{ background: '#0B6E5F', color: 'white', border: 'none', borderRadius: 10, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span style={{ fontSize: 16 }}>+</span> Ajouter
                </button>
              }
            />
            <WhiteCard>
              {localVax.length === 0 ? (
                <p style={{ fontSize: 14, color: '#c4bfb5', fontStyle: 'italic' }}>Aucune vaccination enregistrée</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        {['Vaccin', 'Administré', 'Rappel', 'Statut'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px 12px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {localVax.map((v, i) => {
                        const st = vaxStatus(v.next_due_at)
                        return (
                          <tr key={v.id} style={{ borderBottom: i < localVax.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                            <td style={{ padding: '12px 12px', fontWeight: 600, color: '#1a2e2a' }}>{v.vaccine_name}</td>
                            <td style={{ padding: '12px 12px', color: '#6b7280' }}>{fmt(v.administered_at)}</td>
                            <td style={{ padding: '12px 12px', color: '#6b7280' }}>{v.next_due_at ? fmt(v.next_due_at) : '—'}</td>
                            <td style={{ padding: '12px 12px' }}>
                              <StatusBadge kind={st?.kind} label={st?.label ?? '—'} />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </WhiteCard>

          </section>

          {/* ── Section Vermifugations ── */}
          <section id="vermifugations">
            <SectionTitle
              title="Vermifugations"
              action={
                <button
                  onClick={() => setShowDewModal(true)}
                  style={{ background: '#0B6E5F', color: 'white', border: 'none', borderRadius: 10, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span style={{ fontSize: 16 }}>+</span> Ajouter
                </button>
              }
            />
            <WhiteCard>
              {localDew.length === 0 ? (
                <p style={{ fontSize: 14, color: '#c4bfb5', fontStyle: 'italic' }}>Aucune vermifugation enregistrée</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        {['Produit', 'Administré', 'Rappel', 'Statut'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px 12px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {localDew.map((d, i) => {
                        const st = vaxStatus(d.next_due_at)
                        return (
                          <tr key={d.id} style={{ borderBottom: i < localDew.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                            <td style={{ padding: '12px 12px', fontWeight: 600, color: '#1a2e2a' }}>{d.product_name ?? 'Vermifuge'}</td>
                            <td style={{ padding: '12px 12px', color: '#6b7280' }}>{fmt(d.administered_at)}</td>
                            <td style={{ padding: '12px 12px', color: '#6b7280' }}>{d.next_due_at ? fmt(d.next_due_at) : '—'}</td>
                            <td style={{ padding: '12px 12px' }}>
                              <StatusBadge kind={st?.kind} label={st?.label ?? '—'} />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </WhiteCard>
          </section>

          {/* ── Section Suivi médical ── */}
          <section id="suivi">
            <SectionTitle title="Suivi médical" />
            {!chronicCondition ? (
              <WhiteCard><p style={{ fontSize: 14, color: '#c4bfb5', fontStyle: 'italic' }}>Aucune condition chronique enregistrée</p></WhiteCard>
            ) : (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8e3da', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ borderLeft: '3px solid #0B6E5F', padding: '18px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#0B6E5F', fontFamily: 'var(--font-space), sans-serif', margin: '0 0 4px' }}>
                      {translateCondition(chronicCondition.condition)}
                    </p>
                    {describeCondition(chronicCondition.condition) && (
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                        {describeCondition(chronicCondition.condition)}
                      </p>
                    )}
                  </div>
                  <span style={{ flexShrink: 0, background: '#d1fae5', color: '#065f46', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, letterSpacing: '0.03em' }}>
                    Suivi actif
                  </span>
                </div>

                {chronicCondition.chronic_records && chronicCondition.chronic_records.length > 0 ? (
                  <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                      Derniers enregistrements
                    </p>
                    {chronicCondition.chronic_records.slice(0, 3).map(rec => {
                      const filledEntries = Object.entries(rec.data ?? {}).filter(([, v]) => hasValue(v))
                      return (
                        <div key={rec.id} style={{ background: '#F8FCFB', border: '1px solid #d1fae5', borderRadius: 12, padding: '14px 18px' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2e2a', fontFamily: 'var(--font-space), sans-serif', marginBottom: 12 }}>
                            {fmt(rec.recorded_at)}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                            {filledEntries.map(([k, v]) => {
                              const { text, isTrue } = formatChronicValue(v)
                              return (
                                <div key={k} style={{ background: 'white', border: '1px solid #e8e3da', borderRadius: 8, padding: '8px 12px' }}>
                                  <p style={{ fontSize: 9, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                                    {translateKey(k)}
                                  </p>
                                  <p style={{ fontSize: 15, fontWeight: 700, color: isTrue ? '#FF6B5C' : '#0B6E5F', margin: 0 }}>{text}</p>
                                </div>
                              )
                            })}
                          </div>
                          <p style={{ fontSize: 11, color: '#c4bfb5', fontStyle: 'italic', margin: '12px 0 0' }}>
                            Seules les valeurs renseignées par le propriétaire sont affichées.
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '16px 24px 24px' }}>
                    <p style={{ fontSize: 13, color: '#c4bfb5', fontStyle: 'italic' }}>Aucun enregistrement</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Section Historique ── */}
          <section id="historique">
            <SectionTitle title="Historique des consultations" />
            {medicalVisits.length === 0 ? (
              <WhiteCard><p style={{ fontSize: 14, color: '#c4bfb5', fontStyle: 'italic' }}>Aucune consultation enregistrée</p></WhiteCard>
            ) : (
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div style={{ position: 'absolute', left: 10, top: 10, bottom: 10, width: 2, background: 'linear-gradient(180deg, #0B6E5F 0%, rgba(11,110,95,0.1) 100%)', borderRadius: 2 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {medicalVisits.map(v => (
                    <div key={v.id} style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: -23, top: 16, width: 12, height: 12, borderRadius: '50%', background: v.locked ? '#0B6E5F' : '#d1d5db', border: '2px solid white', boxShadow: '0 0 0 2px ' + (v.locked ? '#0B6E5F' : '#d1d5db') }} />
                      <WhiteCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a2e2a', fontFamily: 'var(--font-space), sans-serif', margin: 0 }}>{fmt(v.visit_date)}</p>
                          <span style={{ background: v.locked ? '#d1fae5' : '#f3f4f6', color: v.locked ? '#065f46' : '#6b7280', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {v.locked ? '✓ Certifié vétérinaire' : 'Déclaré propriétaire'}
                          </span>
                        </div>
                        {v.reason && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>Motif : {v.reason}</p>}
                        {v.diagnosis && <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 4px' }}>Diagnostic : {v.diagnosis}</p>}
                        {v.prescription && <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 4px' }}>Ordonnance : {v.prescription}</p>}
                        {(v.clinic_name || v.vet_name) && (
                          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                            {[v.vet_name, v.clinic_name].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </WhiteCard>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── Section Actes du jour ── */}
          <section id="actes">
            <SectionTitle title="Actes du jour" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <WhiteCard>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Sélectionner les actes réalisés</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {ACT_CHIPS.map(act => {
                    const selected = selectedActs.includes(act)
                    return (
                      <button
                        key={act}
                        onClick={() => toggleAct(act)}
                        style={{
                          padding: '8px 16px', borderRadius: 99, border: selected ? '2px solid #0B6E5F' : '2px solid #e8e3da',
                          background: selected ? '#0B6E5F' : 'white', color: selected ? 'white' : '#374151',
                          fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                          fontFamily: 'var(--font-inter), sans-serif',
                        }}
                      >
                        {act}
                      </button>
                    )
                  })}
                </div>
              </WhiteCard>

              <WhiteCard>
                <TextArea
                  label="Diagnostic et observations cliniques"
                  value={diagnosis}
                  onChange={setDiagnosis}
                  placeholder="Examens réalisés, résultats, observations…"
                  rows={5}
                />
              </WhiteCard>

              {/* ⚠️ Points à surveiller */}
              <div style={{ background: '#FFF4E6', borderLeft: '4px solid #FF6B5C', borderRadius: 12, padding: '18px 20px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#FF6B5C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  ⚠️ Points à surveiller par le propriétaire
                </p>
                <textarea
                  value={watchOut}
                  onChange={e => setWatchOut(e.target.value)}
                  placeholder="Ex : Surveiller l'appétit, vérifier la plaie chaque jour, consulter si fièvre > 39,5°C…"
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(255,107,92,0.25)', borderRadius: 10, fontSize: 14, color: '#1a2e2a', fontFamily: 'var(--font-inter), sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <WhiteCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Résumé pour le propriétaire</label>
                  <button
                    onClick={generateAI}
                    disabled={aiLoading || (!diagnosis.trim() && !prescriptionText.trim())}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: aiLoading ? '#f3f4f6' : '#f0fdf9', border: '1px solid ' + (aiLoading ? '#e8e3da' : '#a7f3d0'), borderRadius: 10, fontSize: 12, fontWeight: 600, color: aiLoading ? '#9ca3af' : '#065f46', cursor: aiLoading ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
                  >
                    {aiLoading ? (
                      <>
                        <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(6,95,70,0.2)', borderTop: '2px solid #065f46', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Génération…
                      </>
                    ) : '✨ Générer via IA'}
                  </button>
                </div>
                <textarea
                  value={patientSummary}
                  onChange={e => setPatientSummary(e.target.value)}
                  placeholder="Résumé en langage simple pour le propriétaire…"
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', background: '#FBF9F4', border: '1.5px solid #e8e3da', borderRadius: 12, fontSize: 14, color: '#1a2e2a', fontFamily: 'var(--font-inter), sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
                {patientSummary && (
                  <div style={{ background: '#f0fdf9', border: '1px solid #a7f3d0', borderRadius: 12, padding: '14px 16px', marginTop: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>✨ Résumé généré</p>
                    <p style={{ fontSize: 14, color: '#1a2e2a', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{patientSummary}</p>
                  </div>
                )}
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, fontStyle: 'italic' }}>Visible par le propriétaire dans l&apos;app VetPass</p>
              </WhiteCard>
            </div>
          </section>

          {/* ── Section Ordonnance ── */}
          <section id="ordonnance">
            <SectionTitle title="Ordonnance" />
            <WhiteCard style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TextArea
                label="Texte de l'ordonnance"
                value={prescriptionText}
                onChange={setPrescriptionText}
                placeholder="Médicaments, dosages, durée de traitement…"
                rows={5}
                note="Sera traduite en langage simple pour le propriétaire via l'IA"
              />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Ordonnance PDF</p>
                {!prescriptionUrl ? (
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 10, padding: '28px 20px',
                    background: '#F8FCFB', border: '2px dashed rgba(11,110,95,0.3)', borderRadius: 14,
                    cursor: uploadingPdf ? 'not-allowed' : 'pointer',
                    opacity: uploadingPdf ? 0.6 : 1, transition: 'all 0.2s',
                  }}>
                    <svg width="32" height="32" fill="none" stroke="#0B6E5F" strokeWidth="1.5" viewBox="0 0 24 24" opacity="0.6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0B6E5F', margin: 0 }}>
                        {uploadingPdf ? 'Upload en cours…' : 'Glisser un PDF ou cliquer pour choisir'}
                      </p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>Ordonnance au format PDF uniquement</p>
                    </div>
                    <input
                      type="file" accept=".pdf" style={{ display: 'none' }}
                      disabled={uploadingPdf}
                      onChange={e => { if (e.target.files?.[0]) handlePdfUpload(e.target.files[0]) }}
                    />
                  </label>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#F8FCFB', border: '1.5px solid rgba(11,110,95,0.2)', borderRadius: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(11,110,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" fill="none" stroke="#0B6E5F" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0B6E5F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                        {pdfFileName || 'Ordonnance.pdf'}
                      </p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>PDF uploadé avec succès</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <a href={prescriptionUrl} target="_blank" rel="noopener noreferrer"
                        style={{ padding: '6px 14px', background: '#0B6E5F', color: 'white', borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                        Voir →
                      </a>
                      <label style={{ padding: '6px 14px', background: '#F8FCFB', border: '1px solid rgba(11,110,95,0.2)', color: '#0B6E5F', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Remplacer
                        <input type="file" accept=".pdf" style={{ display: 'none' }} disabled={uploadingPdf}
                          onChange={e => { if (e.target.files?.[0]) handlePdfUpload(e.target.files[0]) }} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </WhiteCard>
          </section>

          {/* ── Validation finale ── */}
          <section style={{ paddingBottom: 48 }}>
            {formError && (
              <div style={{ background: '#fff1f0', border: '1px solid #ffc4bf', borderRadius: 14, padding: '14px 20px', color: '#c0392b', fontSize: 14, marginBottom: 16 }}>
                {formError}
              </div>
            )}
            <button
              onClick={handleValidate}
              disabled={validating}
              style={{ width: '100%', padding: '18px', background: '#0B6E5F', color: 'white', fontWeight: 700, borderRadius: 16, fontSize: 16, cursor: validating ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'var(--font-space), sans-serif', opacity: validating ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, letterSpacing: '0.01em' }}
            >
              {validating ? (
                <>
                  <span style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTop: '2.5px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Enregistrement en cours…
                </>
              ) : '✓ Valider la consultation'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
              La consultation sera certifiée et visible par le propriétaire dans l&apos;app VetPass
            </p>
          </section>

        </div>
      </main>

      {/* ── Modal ajout vaccination ── */}
      {showVaxModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowVaxModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div style={{ background: 'white', borderRadius: 24, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0B6E5F', marginBottom: 24, fontFamily: 'var(--font-space), sans-serif' }}>
              Ajouter une vaccination
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Chips vaccins */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Vaccin *</label>
                {!vaxUseCustom ? (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(VAX_BY_SPECIES[animal.species] ?? []).map(v => {
                        const sel = newVax.vaccine_name === v
                        return (
                          <button key={v} type="button"
                            onClick={() => {
                              const recall = newVax.administered_at ? computeRecallDate(v, newVax.administered_at) : ''
                              setNewVax(p => ({ ...p, vaccine_name: v, next_due_at: recall || p.next_due_at }))
                            }}
                            style={{ padding: '8px 16px', borderRadius: 100, border: sel ? '1.5px solid #0B6E5F' : '1px solid rgba(11,110,95,0.15)', background: sel ? '#0B6E5F' : '#E4F4EF', color: sel ? 'white' : '#0B6E5F', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: sel ? '0 4px 12px rgba(11,110,95,0.25)' : 'none', transition: 'all 0.15s' }}
                          >{v}</button>
                        )
                      })}
                      <button type="button"
                        onClick={() => { setVaxUseCustom(true); setNewVax(p => ({ ...p, vaccine_name: '' })) }}
                        style={{ padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(11,110,95,0.15)', background: '#E4F4EF', color: '#0B6E5F', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontStyle: 'italic' }}
                      >Autre…</button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={newVax.vaccine_name}
                      onChange={e => {
                        const name = e.target.value
                        const recall = newVax.administered_at ? computeRecallDate(name, newVax.administered_at) : ''
                        setNewVax(p => ({ ...p, vaccine_name: name, next_due_at: recall || p.next_due_at }))
                      }}
                      placeholder="Nom du vaccin…"
                      autoFocus
                      style={{ flex: 1, padding: '12px 16px', background: '#F8FCFB', border: '1.5px solid rgba(11,110,95,0.2)', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-space), sans-serif', color: '#0B6E5F' }}
                    />
                    {VAX_BY_SPECIES[animal.species] && (
                      <button type="button" onClick={() => { setVaxUseCustom(false); setNewVax(p => ({ ...p, vaccine_name: '' })) }}
                        style={{ padding: '10px 14px', background: '#E4F4EF', border: '1px solid rgba(11,110,95,0.15)', borderRadius: 12, fontSize: 12, cursor: 'pointer', color: '#0B6E5F', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        ← Liste
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Date administration */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Date d&apos;administration *</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" fill="none" stroke="#0B6E5F" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <input type="date" value={newVax.administered_at}
                    onChange={e => {
                      const date = e.target.value
                      const recall = newVax.vaccine_name ? computeRecallDate(newVax.vaccine_name, date) : ''
                      setNewVax(p => ({ ...p, administered_at: date, next_due_at: recall || p.next_due_at }))
                    }}
                    style={{ width: '100%', padding: '12px 16px 12px 40px', background: '#F8FCFB', border: '1.5px solid rgba(11,110,95,0.2)', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-space), sans-serif', color: '#0B6E5F' }}
                  />
                </div>
              </div>
              {/* Date rappel */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Rappel (auto-calculé)</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" fill="none" stroke="#0B6E5F" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <input type="date" value={newVax.next_due_at}
                    onChange={e => setNewVax(p => ({ ...p, next_due_at: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px 12px 40px', background: '#F8FCFB', border: '1.5px solid rgba(11,110,95,0.2)', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-space), sans-serif', color: '#0B6E5F' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => { setShowVaxModal(false); setVaxUseCustom(false); setNewVax({ vaccine_name: '', administered_at: '', next_due_at: '' }) }}
                style={{ flex: 1, padding: '12px', background: '#F8FCFB', border: '1px solid rgba(11,110,95,0.15)', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}>
                Annuler
              </button>
              <button onClick={handleAddVax} disabled={savingVax || !newVax.vaccine_name.trim() || !newVax.administered_at}
                style={{ flex: 2, padding: '12px', background: '#0B6E5F', color: 'white', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: savingVax ? 'not-allowed' : 'pointer', opacity: savingVax || !newVax.vaccine_name.trim() || !newVax.administered_at ? 0.6 : 1, fontFamily: 'var(--font-space), sans-serif', boxShadow: '0 4px 12px rgba(11,110,95,0.25)' }}>
                {savingVax ? 'Enregistrement…' : 'Ajouter la vaccination'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal ajout vermifuge ── */}
      {showDewModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowDewModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div style={{ background: 'white', borderRadius: 24, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0B6E5F', marginBottom: 24, fontFamily: 'var(--font-space), sans-serif' }}>
              Ajouter une vermifugation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Chips produits */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Produit *</label>
                {!dewUseCustom ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Milbemax', 'Drontal', 'Panacur', 'Advocate', 'Stronghold', 'Bravecto', 'NexGard Spectra'].map(p => {
                      const sel = newDew.product_name === p
                      return (
                        <button key={p} type="button"
                          onClick={() => setNewDew(prev => ({ ...prev, product_name: p }))}
                          style={{ padding: '8px 16px', borderRadius: 100, border: sel ? '1.5px solid #0B6E5F' : '1px solid rgba(11,110,95,0.15)', background: sel ? '#0B6E5F' : '#E4F4EF', color: sel ? 'white' : '#0B6E5F', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: sel ? '0 4px 12px rgba(11,110,95,0.25)' : 'none', transition: 'all 0.15s' }}
                        >{p}</button>
                      )
                    })}
                    <button type="button"
                      onClick={() => { setDewUseCustom(true); setNewDew(p => ({ ...p, product_name: '' })) }}
                      style={{ padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(11,110,95,0.15)', background: '#E4F4EF', color: '#0B6E5F', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontStyle: 'italic' }}
                    >Autre…</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" value={newDew.product_name}
                      onChange={e => setNewDew(p => ({ ...p, product_name: e.target.value }))}
                      placeholder="Nom du produit…" autoFocus
                      style={{ flex: 1, padding: '12px 16px', background: '#F8FCFB', border: '1.5px solid rgba(11,110,95,0.2)', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-space), sans-serif', color: '#0B6E5F' }}
                    />
                    <button type="button" onClick={() => { setDewUseCustom(false); setNewDew(p => ({ ...p, product_name: '' })) }}
                      style={{ padding: '10px 14px', background: '#E4F4EF', border: '1px solid rgba(11,110,95,0.15)', borderRadius: 12, fontSize: 12, cursor: 'pointer', color: '#0B6E5F', fontWeight: 600 }}>
                      ← Liste
                    </button>
                  </div>
                )}
              </div>
              {/* Date administration */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Date d&apos;administration *</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" fill="none" stroke="#0B6E5F" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <input type="date" value={newDew.administered_at}
                    onChange={e => {
                      const date = e.target.value
                      if (date && dewFrequency) {
                        const base = new Date(date)
                        const months = dewFrequency === 'month' ? 1 : dewFrequency === '3months' ? 3 : 6
                        base.setMonth(base.getMonth() + months)
                        setNewDew(p => ({ ...p, administered_at: date, next_due_at: base.toISOString().split('T')[0] }))
                      } else {
                        setNewDew(p => ({ ...p, administered_at: date }))
                      }
                    }}
                    style={{ width: '100%', padding: '12px 16px 12px 40px', background: '#F8FCFB', border: '1.5px solid rgba(11,110,95,0.2)', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-space), sans-serif', color: '#0B6E5F' }}
                  />
                </div>
              </div>
              {/* Chips fréquence */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Fréquence de rappel</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { value: 'month', label: '1 mois', sub: 'Chiots/chatons' },
                    { value: '3months', label: '3 mois', sub: 'Standard' },
                    { value: '6months', label: '6 mois', sub: 'Faible risque' },
                  ].map(({ value, label, sub }) => {
                    const sel = dewFrequency === value
                    return (
                      <button key={value} type="button"
                        onClick={() => {
                          setDewFrequency(value)
                          if (newDew.administered_at) {
                            const base = new Date(newDew.administered_at)
                            const months = value === 'month' ? 1 : value === '3months' ? 3 : 6
                            base.setMonth(base.getMonth() + months)
                            setNewDew(p => ({ ...p, next_due_at: base.toISOString().split('T')[0] }))
                          }
                        }}
                        style={{ padding: '8px 18px', borderRadius: 100, border: sel ? '1.5px solid #0B6E5F' : '1px solid rgba(11,110,95,0.15)', background: sel ? '#0B6E5F' : '#E4F4EF', color: sel ? 'white' : '#0B6E5F', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: sel ? '0 4px 12px rgba(11,110,95,0.25)' : 'none', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                      >
                        <span>{label}</span>
                        <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.75 }}>{sub}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* Date rappel */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Rappel (calculé automatiquement)</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" fill="none" stroke="#0B6E5F" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <input type="date" value={newDew.next_due_at}
                    onChange={e => setNewDew(p => ({ ...p, next_due_at: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px 12px 40px', background: '#F8FCFB', border: '1.5px solid rgba(11,110,95,0.2)', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-space), sans-serif', color: '#0B6E5F' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => setShowDewModal(false)} style={{ flex: 1, padding: '12px', background: '#F8FCFB', border: '1px solid rgba(11,110,95,0.15)', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}>
                Annuler
              </button>
              <button
                onClick={handleAddDew}
                disabled={savingDew || !newDew.product_name.trim() || !newDew.administered_at}
                style={{ flex: 2, padding: '12px', background: '#0B6E5F', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: savingDew ? 'not-allowed' : 'pointer', opacity: savingDew || !newDew.product_name.trim() || !newDew.administered_at ? 0.6 : 1, fontFamily: 'var(--font-space), sans-serif' }}
              >
                {savingDew ? 'Enregistrement…' : 'Ajouter la vermifugation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
