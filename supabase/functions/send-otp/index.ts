import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const { email, otp, vet_name } = await req.json()

    if (!email || !otp) {
      return new Response(JSON.stringify({ success: false, error: 'email and otp are required' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')

    if (resendKey) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FBF9F4;">
          <div style="text-align: center; margin-bottom: 32px;">
            <span style="font-size: 28px; font-weight: 700; color: #0B6E5F;">Vet</span>
            <span style="font-size: 28px; font-weight: 700; color: #0B6E5F;">Pass</span>
            <span style="font-size: 22px; font-weight: 400; color: #999;"> Pro</span>
          </div>
          <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">
            Bonjour${vet_name ? ' ' + vet_name : ''},
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 28px;">
            Votre code de connexion VetPass Pro :
          </p>
          <div style="background: linear-gradient(135deg, #0B6E5F, #064d42); border-radius: 16px; padding: 28px; text-align: center; margin-bottom: 28px;">
            <span style="font-size: 44px; font-weight: 700; color: white; letter-spacing: 14px; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin-bottom: 32px;">
            Ce code est valable <strong>10 minutes</strong>.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 24px;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.<br />
            VetPass Pro — L'espace vétérinaire
          </p>
        </div>
      `

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'VetPass Pro <noreply@vetpasspro.fr>',
          to: [email],
          subject: `Votre code VetPass Pro : ${otp}`,
          html,
        }),
      })

      if (!res.ok) {
        console.error('[send-otp] Resend error:', await res.text())
      } else {
        console.log(`[send-otp] Email envoyé à ${email}`)
      }
    } else {
      // Fallback: log console (mode test)
      console.log(`[send-otp] MODE TEST — OTP pour ${email} (${vet_name ?? 'inconnu'}): ${otp}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[send-otp] Erreur:', err)
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
