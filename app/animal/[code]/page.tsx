import { notFound, redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function AnimalByCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const normalized = decodeURIComponent(code).replace(/^#/, '').toUpperCase()

  // ── Find animal by vetpass_code ───────────────────────────────
  const { data: animal, error: animalErr } = await supabase
    .from('animals')
    .select('id, name, vetpass_code')
    .ilike('vetpass_code', normalized)
    .single()

  if (animalErr || !animal) return notFound()

  // ── Check for existing active session ─────────────────────────
  const now = new Date().toISOString()
  const { data: existing } = await supabase
    .from('vet_sessions')
    .select('id')
    .eq('animal_id', animal.id)
    .eq('is_active', true)
    .gt('expires_at', now)
    .limit(1)
    .single()

  if (existing) {
    redirect(`/session/${existing.id}`)
  }

  // ── Create new 48h session ─────────────────────────────────────
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  const { data: session, error: sessionErr } = await supabase
    .from('vet_sessions')
    .insert({ animal_id: animal.id, is_active: true, expires_at: expiresAt })
    .select('id')
    .single()

  if (sessionErr || !session) {
    return (
      <main className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-[#0B6E5F]">Vet</span>
            <span className="text-[#FF6B5C]">Pass</span>
            <span className="text-gray-400 font-normal text-3xl"> Pro</span>
          </h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Erreur de session</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Impossible de créer une session pour cet animal.<br />
            Veuillez réessayer depuis la page d&apos;accueil.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-[#0B6E5F] text-white text-sm font-semibold rounded-xl hover:bg-[#0a6356] transition"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </main>
    )
  }

  redirect(`/session/${session.id}`)
}
