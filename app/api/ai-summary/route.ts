import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, history, systemPrompt } = await req.json()
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ message, history: history ?? [], systemPrompt: systemPrompt ?? '' }),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
