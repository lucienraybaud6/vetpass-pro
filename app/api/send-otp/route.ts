import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, otp, firstName } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'VetPass Pro <onboarding@resend.dev>',
      to: email,
      subject: 'Votre code de connexion VetPass Pro',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #FBF9F4;">
          <div style="background: linear-gradient(135deg, #0B6E5F, #073d34); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #fff; font-size: 28px; margin: 0; letter-spacing: -0.5px;">Vet<span style="color: #9FE1CB;">Pass</span> Pro</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">L'espace vétérinaire</p>
          </div>
          <div style="background: #fff; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
            <p style="color: #0F2A24; font-size: 16px; margin: 0 0 24px;">Bonjour${firstName ? ' Dr. ' + firstName : ''},</p>
            <p style="color: #6B6B6B; font-size: 14px; margin: 0 0 24px;">Votre code de connexion VetPass Pro :</p>
            <div style="background: #F8FCFB; border: 2px solid #0B6E5F; border-radius: 14px; padding: 20px; margin: 0 0 24px;">
              <span style="font-family: monospace; font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #0B6E5F;">${otp}</span>
            </div>
            <p style="color: #9A958C; font-size: 12px; margin: 0;">Ce code expire dans <strong>10 minutes</strong>.<br/>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
          </div>
          <p style="text-align: center; color: #B0ABA1; font-size: 11px; margin: 24px 0 0;">VetPass Pro · vetpass-pro.vercel.app</p>
        </div>
      `
    })
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
