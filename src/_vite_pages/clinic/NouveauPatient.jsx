import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { savePatient, uid } from '../../data/store.js'

const CHAMP = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: 6 }}>
      {label}{required && <span style={{ color: 'var(--teal-600)', marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
)

const INP_STYLE = { width: '100%', border: '1.5px solid var(--slate-200)', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: 'var(--slate-800)' }
const SEL_STYLE = { ...INP_STYLE, background: '#fff', cursor: 'pointer' }

const genCode = (nom) => {
  const base = nom?.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'ANIM'
  return base + Math.floor(1000 + Math.random() * 9000)
}

export default function NouveauPatient() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    // Animal
    nom: '', espece: 'Chien', race: '', dateNaissance: '', sexe: 'Mâle entier',
    poids: '', scoreCorps: '5', puce: '', passeport: false, assurance: 'Non',
    avatar: '🐾',
    // Lifestyle
    modeVie: 'Maison avec jardin', alimentation: 'Croquettes premium', activite: 'Modéré',
    environnement: [],
    // Médical
    allergies: '', contreIndications: '', traitementsChroniques: '',
    statutVaccinal: 'Inconnu', prochainVaccin: '', prochainVermifuge: '', prochainAntiparasitaire: '',
    // Propriétaire
    propNom: '', propTelephone: '', propEmail: '', propContact: 'SMS',
    // Profil
    sensibilitePrix: '€€ - Moyen', implication: 'Impliqué', profilEmotionnel: 'Confiant',
    soinsRefuses: '', notesVeto: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const codeAcces = genCode(form.nom)

  const STEPS = ['Animal', 'Mode de vie', 'Médical', 'Propriétaire', 'Profil client', 'Récapitulatif']

  const handleSave = () => {
    setSaving(true)
    const id = uid('PAT')
    const patient = {
      id,
      ...form,
      poids: parseFloat(form.poids) || 0,
      scoreCorps: parseInt(form.scoreCorps) || 5,
      codeAcces,
      dateCreation: new Date().toISOString(),
      historique: [],
      proprietaire: {
        nom: form.propNom,
        telephone: form.propTelephone,
        email: form.propEmail,
        contact: form.propContact,
        sensibilitePrix: form.sensibilitePrix,
        implication: form.implication,
        profilEmotionnel: form.profilEmotionnel,
        score: 50,
        clinique: 'Clinique du Parc',
      }
    }
    savePatient(patient)
    setTimeout(() => navigate(`/clinique/patients/${id}`), 400)
  }

  const AVATAR_OPTIONS = ['🐕', '🐈', '🐕‍🦺', '🐱', '🦜', '🐇', '🐠', '🦎', '🐾']

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--teal-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Nouveau dossier</div>
        <h2 style={{ color: 'var(--slate-900)', marginBottom: 4 }}>Ajouter un patient</h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>Remplissez les informations pour créer le dossier complet.</p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div onClick={() => i < step - 1 && setStep(i + 1)} style={{ height: 4, background: i < step ? 'var(--teal-600)' : 'var(--slate-200)', borderRadius: 100, marginBottom: 5, transition: 'background .3s', cursor: i < step - 1 ? 'pointer' : 'default' }} />
            <div style={{ fontSize: '0.68rem', color: i === step - 1 ? 'var(--teal-700)' : 'var(--slate-400)', fontWeight: i === step - 1 ? 700 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)' }}>

        {/* STEP 1 — Animal */}
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--slate-800)', marginBottom: 24, fontSize: '1rem' }}>🐾 Identité de l'animal</h3>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', marginBottom: 10 }}>Avatar</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {AVATAR_OPTIONS.map(a => (
                  <button key={a} onClick={() => set('avatar', a)} style={{ width: 44, height: 44, borderRadius: 10, border: form.avatar === a ? '2px solid var(--teal-600)' : '2px solid var(--slate-200)', background: form.avatar === a ? 'var(--teal-50)' : '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>{a}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <CHAMP label="Nom de l'animal" required><input style={INP_STYLE} value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Ex: Luna" /></CHAMP>
              <CHAMP label="Espèce" required><select style={SEL_STYLE} value={form.espece} onChange={e => set('espece', e.target.value)}>{['Chien', 'Chat', 'Lapin', 'Oiseau', 'Reptile', 'Autre'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
              <CHAMP label="Race"><input style={INP_STYLE} value={form.race} onChange={e => set('race', e.target.value)} placeholder="Ex: Labrador Retriever" /></CHAMP>
              <CHAMP label="Sexe" required><select style={SEL_STYLE} value={form.sexe} onChange={e => set('sexe', e.target.value)}>{['Mâle entier', 'Mâle castré', 'Femelle entière', 'Femelle stérilisée'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
              <CHAMP label="Date de naissance"><input type="date" style={INP_STYLE} value={form.dateNaissance} onChange={e => set('dateNaissance', e.target.value)} /></CHAMP>
              <CHAMP label="Poids (kg)"><input type="number" step="0.1" style={INP_STYLE} value={form.poids} onChange={e => set('poids', e.target.value)} placeholder="Ex: 12.5" /></CHAMP>
              <CHAMP label="Numéro de puce"><input style={INP_STYLE} value={form.puce} onChange={e => set('puce', e.target.value)} placeholder="15 chiffres" /></CHAMP>
              <CHAMP label="Score corporel (/9)"><select style={SEL_STYLE} value={form.scoreCorps} onChange={e => set('scoreCorps', e.target.value)}>{[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}/9</option>)}</select></CHAMP>
              <CHAMP label="Passeport européen"><select style={SEL_STYLE} value={form.passeport ? 'Oui' : 'Non'} onChange={e => set('passeport', e.target.value === 'Oui')}><option>Non</option><option>Oui</option></select></CHAMP>
              <CHAMP label="Assurance animale"><select style={SEL_STYLE} value={form.assurance} onChange={e => set('assurance', e.target.value)}>{['Non', 'Oui - base', 'Oui - premium'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
            </div>
          </div>
        )}

        {/* STEP 2 — Mode de vie */}
        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>🏡 Mode de vie de l'animal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <CHAMP label="Environnement de vie"><select style={SEL_STYLE} value={form.modeVie} onChange={e => set('modeVie', e.target.value)}>{['Appartement strict', 'Maison avec jardin', 'Extérieur / Rural', 'Sport / Travail', 'Chasse', 'Élevage'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
              <CHAMP label="Alimentation"><select style={SEL_STYLE} value={form.alimentation} onChange={e => set('alimentation', e.target.value)}>{['Croquettes standard', 'Croquettes premium', 'Pâtée', 'BARF / Cru', 'Fait maison', 'Mixte'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
              <CHAMP label="Niveau d'activité"><select style={SEL_STYLE} value={form.activite} onChange={e => set('activite', e.target.value)}>{['Sédentaire', 'Modéré', 'Actif', 'Très actif / Sport'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
            </div>
            <CHAMP label="Cohabitation">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Autres chiens', 'Autres chats', 'Enfants < 12 ans', 'Personnes âgées', 'Animaux de ferme'].map(o => (
                  <button key={o} onClick={() => set('environnement', form.environnement.includes(o) ? form.environnement.filter(x => x !== o) : [...form.environnement, o])}
                    style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', border: '1.5px solid', borderColor: form.environnement.includes(o) ? 'var(--teal-600)' : 'var(--slate-200)', background: form.environnement.includes(o) ? 'var(--teal-50)' : '#fff', color: form.environnement.includes(o) ? 'var(--teal-800)' : 'var(--slate-600)', cursor: 'pointer' }}>{o}</button>
                ))}
              </div>
            </CHAMP>
          </div>
        )}

        {/* STEP 3 — Médical */}
        {step === 3 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>💊 Informations médicales</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <CHAMP label="Statut vaccinal"><select style={SEL_STYLE} value={form.statutVaccinal} onChange={e => set('statutVaccinal', e.target.value)}>{['À jour', 'Rappel proche < 1 mois', 'En retard', 'Non vacciné', 'Inconnu'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
              <CHAMP label="Prochain vaccin"><input type="date" style={INP_STYLE} value={form.prochainVaccin} onChange={e => set('prochainVaccin', e.target.value)} /></CHAMP>
              <CHAMP label="Prochain vermifuge"><input type="date" style={INP_STYLE} value={form.prochainVermifuge} onChange={e => set('prochainVermifuge', e.target.value)} /></CHAMP>
              <CHAMP label="Prochain antiparasitaire"><input type="date" style={INP_STYLE} value={form.prochainAntiparasitaire} onChange={e => set('prochainAntiparasitaire', e.target.value)} /></CHAMP>
            </div>
            <CHAMP label="Allergies connues"><textarea rows={2} style={INP_STYLE} value={form.allergies} onChange={e => set('allergies', e.target.value)} placeholder="Ex: Allergie au poulet confirmée par test" /></CHAMP>
            <CHAMP label="Contre-indications"><textarea rows={2} style={INP_STYLE} value={form.contreIndications} onChange={e => set('contreIndications', e.target.value)} placeholder="Ex: Intolérance AINS — vomissements" /></CHAMP>
            <CHAMP label="Traitements chroniques"><textarea rows={2} style={INP_STYLE} value={form.traitementsChroniques} onChange={e => set('traitementsChroniques', e.target.value)} placeholder="Ex: Apoquel 16mg — 1cp/jour" /></CHAMP>
          </div>
        )}

        {/* STEP 4 — Propriétaire */}
        {step === 4 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>👤 Informations propriétaire</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <CHAMP label="Nom complet" required><input style={INP_STYLE} value={form.propNom} onChange={e => set('propNom', e.target.value)} placeholder="Ex: Mme. Martin Isabelle" /></CHAMP>
              <CHAMP label="Téléphone"><input type="tel" style={INP_STYLE} value={form.propTelephone} onChange={e => set('propTelephone', e.target.value)} placeholder="06 XX XX XX XX" /></CHAMP>
              <CHAMP label="Email" required><input type="email" style={INP_STYLE} value={form.propEmail} onChange={e => set('propEmail', e.target.value)} placeholder="email@exemple.fr" /></CHAMP>
              <CHAMP label="Contact préféré"><select style={SEL_STYLE} value={form.propContact} onChange={e => set('propContact', e.target.value)}>{['SMS', 'Email', 'Téléphone'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
            </div>
            <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--teal-800)', marginBottom: 4 }}>🔑 Code d'accès propriétaire généré automatiquement</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', color: 'var(--teal-700)', fontWeight: 700 }}>{genCode(form.nom)}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--teal-600)', marginTop: 4 }}>À communiquer au propriétaire pour accéder à l'espace VetPass Pro. Il se connecte avec son email + ce code.</div>
            </div>
          </div>
        )}

        {/* STEP 5 — Profil client */}
        {step === 5 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>🧠 Profil client <span style={{ fontWeight: 400, color: 'var(--slate-400)', fontSize: '0.85rem' }}>(usage interne uniquement)</span></h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: 24, lineHeight: 1.6 }}>Ces informations ne sont jamais visibles du propriétaire. Elles vous aident à adapter votre discours.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <CHAMP label="Sensibilité au prix"><select style={SEL_STYLE} value={form.sensibilitePrix} onChange={e => set('sensibilitePrix', e.target.value)}>{['€ - Budget serré', '€€ - Moyen', '€€€ - Premium'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
              <CHAMP label="Degré d'implication"><select style={SEL_STYLE} value={form.implication} onChange={e => set('implication', e.target.value)}>{['Très investi', 'Impliqué', 'Moyen', 'Peu impliqué', 'Laxiste'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
              <CHAMP label="Profil émotionnel"><select style={SEL_STYLE} value={form.profilEmotionnel} onChange={e => set('profilEmotionnel', e.target.value)}>{['Rationnel / pragmatique', 'Émotionnel / anxieux', 'Méfiant', 'Confiant', 'Surprotecteur'].map(o => <option key={o}>{o}</option>)}</select></CHAMP>
            </div>
            <CHAMP label="Soins refusés (à noter pour relance ultérieure)"><textarea rows={2} style={INP_STYLE} value={form.soinsRefuses} onChange={e => set('soinsRefuses', e.target.value)} placeholder="Ex: Détartrage refusé — raison: coût" /></CHAMP>
            <CHAMP label="Notes internes vétérinaire (privées)"><textarea rows={3} style={INP_STYLE} value={form.notesVeto} onChange={e => set('notesVeto', e.target.value)} placeholder="Ex: Proprio anxieux, toujours expliquer en détail avant tout acte..." /></CHAMP>
          </div>
        )}

        {/* STEP 6 — Récap */}
        {step === 6 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>✅ Récapitulatif du dossier</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {[
                { title: '🐾 Animal', items: [[form.avatar + ' Nom', form.nom || '—'], ['Espèce / Race', `${form.espece} — ${form.race || '—'}`], ['Sexe', form.sexe], ['Poids', form.poids ? `${form.poids} kg` : '—'], ['Puce', form.puce || '—']] },
                { title: '👤 Propriétaire', items: [['Nom', form.propNom || '—'], ['Email', form.propEmail || '—'], ['Téléphone', form.propTelephone || '—'], ['Code accès', codeAcces], ['Contact', form.propContact]] },
                { title: '🏡 Mode de vie', items: [['Environnement', form.modeVie], ['Alimentation', form.alimentation], ['Activité', form.activite]] },
                { title: '🧠 Profil client', items: [['Budget', form.sensibilitePrix], ['Implication', form.implication], ['Profil', form.profilEmotionnel]] },
              ].map(({ title, items }) => (
                <div key={title} style={{ background: 'var(--slate-50)', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: 10 }}>{title}</div>
                  {items.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--slate-500)' }}>{k}</span>
                      <span style={{ color: 'var(--slate-800)', fontWeight: 500, maxWidth: 160, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--teal-800)', marginBottom: 6 }}>🔑 Code d'accès propriétaire : <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{codeAcces}</span></div>
              <div style={{ fontSize: '0.8rem', color: 'var(--teal-700)' }}>Communiquez ce code à {form.propNom || 'le propriétaire'} ({form.propEmail || 'email non renseigné'}) pour accéder à l'espace VetPass Pro.</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--slate-100)' }}>
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/clinique/patients')} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid var(--slate-200)', background: '#fff', color: 'var(--slate-600)', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>
            {step > 1 ? '← Précédent' : 'Annuler'}
          </button>
          {step < 6 ? (
            <button onClick={() => setStep(step + 1)} style={{ padding: '9px 24px', borderRadius: 8, background: 'var(--teal-800)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>
              Suivant →
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 24px', borderRadius: 8, background: saving ? 'var(--slate-300)' : 'var(--teal-700)', color: '#fff', border: 'none', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>
              {saving ? 'Enregistrement...' : '✅ Créer le dossier'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
