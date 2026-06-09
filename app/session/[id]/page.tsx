import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import SessionView from './SessionView'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const fullBg: React.CSSProperties = {
  background: 'linear-gradient(145deg, #0d8270 0%, #0B6E5F 35%, #064d42 70%, #03332b 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
}

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const now = new Date().toISOString()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vet_sessions?id=eq.${id}&select=id,animal_id,is_active,expires_at,clinic_name`,
    {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      }
    }
  )
  const sessions = await res.json()
  const session = sessions?.[0]
  if (!session) return notFound()

  if (!session.is_active || session.expires_at < now) {
    return (
      <div style={fullBg}>
        <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '48px 40px', maxWidth: 440, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,107,92,0.15)', border: '1px solid rgba(255,107,92,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="24" height="24" fill="none" stroke="#FF6B5C" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-space), sans-serif' }}>
            Session expirée ou invalide
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            Cette session de consultation a expiré ou a déjà été clôturée.<br /><br />
            Demandez au propriétaire de générer un nouvel accès depuis l&apos;application VetPass.
          </p>
          <a href="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#9FE1CB', color: '#0B3D34', fontWeight: 700, borderRadius: 14, fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-space), sans-serif' }}>
            ← Retour à l&apos;accueil
          </a>
        </div>
      </div>
    )
  }

  const animalId = session.animal_id

  // Fetch de l'animal d'abord — critique, on 404 si absent
  const { data: animal, error: animalErr } = await supabase
    .from('animals')
    .select('id, name, species, breed, birth_date, weight_kg, photo_url, vetpass_code, is_sterilized, created_at, allergies')
    .eq('id', animalId)
    .single()
  if (animalErr) console.error('[animals] error:', animalErr.message)
  if (!animal) return notFound()

  // Wrapper qui isole chaque requête : une table absente ou colonne incorrecte retourne [] sans planter la page
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeQuery = async (query: any, name: string) => {
    try {
      const { data, error } = await query
      if (error) console.error(`[${name}] error:`, error.message)
      return data || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(`[${name}] fetch failed:`, e.message)
      return []
    }
  }

  const [vaccinations, dewormings, medicalVisits, pinnedObs, treatments, weightRecords, chronic, medicationReminders, appointments] = await Promise.all([
    safeQuery(supabase.from('vaccinations').select('*').eq('animal_id', animalId).order('administered_at', { ascending: false }), 'vaccinations'),
    safeQuery(supabase.from('dewormings').select('*').eq('animal_id', animalId).order('administered_at', { ascending: false }), 'dewormings'),
    safeQuery(supabase.from('medical_visits').select('*').eq('animal_id', animalId).order('visit_date', { ascending: false }), 'visits'),
    safeQuery(supabase.from('owner_observations').select('*').eq('animal_id', animalId).eq('pinned', true).order('created_at', { ascending: false }), 'observations'),
    safeQuery(supabase.from('treatments').select('*').eq('animal_id', animalId), 'treatments'),
    safeQuery(supabase.from('weight_records').select('*').eq('animal_id', animalId).order('recorded_at', { ascending: false }).limit(5), 'weights'),
    safeQuery(supabase.from('chronic_conditions').select('*, chronic_records(*)').eq('animal_id', animalId).eq('is_active', true), 'chronic'),
    safeQuery(supabase.from('medication_reminders').select('*').eq('animal_id', animalId).eq('is_active', true), 'medications'),
    safeQuery(supabase.from('appointments').select('*').eq('animal_id', animalId).gt('appointment_date', new Date().toISOString()).order('appointment_date', { ascending: true }).limit(1), 'appointments'),
  ])

  const lastWeight = weightRecords.length > 0 ? weightRecords[0] : null
  const chronicCondition = chronic.length > 0 ? chronic[0] : null

  console.log('[DATA]', {
    vaccinations: vaccinations?.length,
    observations: pinnedObs?.length,
    treatments: treatments?.length,
    chronic: chronic?.length
  })

  return (
    <SessionView
      session={{ id: session.id, clinic_name: session.clinic_name, expires_at: session.expires_at }}
      animal={animal}
      pinnedObs={pinnedObs}
      treatments={treatments}
      vaccinations={vaccinations}
      dewormings={dewormings}
      medicalVisits={medicalVisits}
      lastWeight={lastWeight}
      chronicCondition={chronicCondition}
      appointments={appointments}
      medicationReminders={medicationReminders}
    />
  )
}
