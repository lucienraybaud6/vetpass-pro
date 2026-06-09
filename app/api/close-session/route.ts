import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { sessionId, closed_at } = await req.json()
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vet_sessions?id=eq.${sessionId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({ is_active: false, closed_at }),
    }
  )
  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : res.status })
}
