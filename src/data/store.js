// ═══════════════════════════════════════════════════════════════════════
// VETPASS PRO — STORE CENTRAL
// Toutes les données de l'application, persistées en localStorage
// ═══════════════════════════════════════════════════════════════════════

const KEYS = {
  patients: 'vp_patients',
  actes: 'vp_actes',
  rdv: 'vp_rdv',
  messages: 'vp_messages',
  feedbacks: 'vp_feedbacks',
  equipe: 'vp_equipe',
  clinique: 'vp_clinique',
}

// ── Helpers localStorage ──────────────────────────────────────────────
const load = (key, fallback = []) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
const save = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// ── Générer un ID unique ──────────────────────────────────────────────
export const uid = (prefix = 'ID') => `${prefix}-${Date.now().toString(36).toUpperCase()}`

// ═══════════════════════════════════════════════════════════════════════
// PATIENTS
// ═══════════════════════════════════════════════════════════════════════
export const getPatients = () => load(KEYS.patients, [])

export const savePatient = (patient) => {
  const list = getPatients()
  const idx = list.findIndex(p => p.id === patient.id)
  if (idx >= 0) list[idx] = patient
  else list.push(patient)
  save(KEYS.patients, list)
  return patient
}

export const deletePatient = (id) => {
  save(KEYS.patients, getPatients().filter(p => p.id !== id))
}

export const getPatient = (id) => getPatients().find(p => p.id === id)

// ═══════════════════════════════════════════════════════════════════════
// ACTES & FACTURATION
// ═══════════════════════════════════════════════════════════════════════
export const getActes = (patientId = null) => {
  const all = load(KEYS.actes, [])
  return patientId ? all.filter(a => a.patientId === patientId) : all
}

export const saveActe = (acte) => {
  const list = load(KEYS.actes, [])
  const idx = list.findIndex(a => a.id === acte.id)
  if (idx >= 0) list[idx] = acte
  else list.push(acte)
  save(KEYS.actes, list)
  return acte
}

export const deleteActe = (id) => {
  save(KEYS.actes, load(KEYS.actes, []).filter(a => a.id !== id))
}

// ═══════════════════════════════════════════════════════════════════════
// RENDEZ-VOUS & CALENDRIER
// ═══════════════════════════════════════════════════════════════════════
export const getRdv = () => load(KEYS.rdv, [])

export const saveRdv = (rdv) => {
  const list = getRdv()
  const idx = list.findIndex(r => r.id === rdv.id)
  if (idx >= 0) list[idx] = rdv
  else list.push(rdv)
  save(KEYS.rdv, list)
  return rdv
}

export const deleteRdv = (id) => {
  save(KEYS.rdv, getRdv().filter(r => r.id !== id))
}

// ═══════════════════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════════════════
export const getMessages = (patientId = null) => {
  const all = load(KEYS.messages, [])
  return patientId ? all.filter(m => m.patientId === patientId) : all
}

export const saveMessage = (msg) => {
  const list = load(KEYS.messages, [])
  list.push({ ...msg, id: uid('MSG'), createdAt: new Date().toISOString() })
  save(KEYS.messages, list)
}

// ═══════════════════════════════════════════════════════════════════════
// FEEDBACKS POST-CONSULTATION
// ═══════════════════════════════════════════════════════════════════════
export const getFeedbacks = () => load(KEYS.feedbacks, [])

export const saveFeedback = (fb) => {
  const list = load(KEYS.feedbacks, [])
  list.push({ ...fb, id: uid('FB'), createdAt: new Date().toISOString() })
  save(KEYS.feedbacks, list)
}

// ═══════════════════════════════════════════════════════════════════════
// ÉQUIPE VÉTÉRINAIRE
// ═══════════════════════════════════════════════════════════════════════
const DEFAULT_EQUIPE = [
  { id: 'VET-1', nom: 'Dr. Martin', role: 'Vétérinaire', color: '#0F6E56', initiales: 'DM' },
  { id: 'VET-2', nom: 'Dr. Leroy', role: 'Vétérinaire', color: '#2563EB', initiales: 'DL' },
  { id: 'ASV-1', nom: 'Sophie (ASV)', role: 'ASV', color: '#7C3AED', initiales: 'SO' },
]

export const getEquipe = () => load(KEYS.equipe, DEFAULT_EQUIPE)

export const saveEquipeMember = (member) => {
  const list = getEquipe()
  const idx = list.findIndex(m => m.id === member.id)
  if (idx >= 0) list[idx] = member
  else list.push(member)
  save(KEYS.equipe, list)
}

// ═══════════════════════════════════════════════════════════════════════
// STATS DYNAMIQUES
// ═══════════════════════════════════════════════════════════════════════
export const getStats = () => {
  const patients = getPatients()
  const rdv = getRdv()
  const feedbacks = getFeedbacks()
  const now = new Date()
  const moisCourant = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const rdvCeMois = rdv.filter(r => r.date?.startsWith(moisCourant)).length
  const rappels = patients.filter(p => {
    if (!p.prochainVaccin) return false
    const diff = (new Date(p.prochainVaccin) - now) / (1000 * 60 * 60 * 24)
    return diff < 30
  })

  const notesMoyenne = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.noteGlobale || 0), 0) / feedbacks.length).toFixed(1)
    : null

  return {
    patientsActifs: patients.length,
    rdvCeMois,
    rappelsUrgents: rappels.length,
    satisfactionMoyenne: notesMoyenne,
    feedbacksTotal: feedbacks.length,
  }
}

// ═══════════════════════════════════════════════════════════════════════
// FICHES ÉDUCATIVES (contenu fixe)
// ═══════════════════════════════════════════════════════════════════════
export const fichesEducatives = [
  { id: 1, titre: 'Prendre la température', categorie: 'Prévention', icon: '🌡️', temps: '3 min', difficulte: 'Facile', contenu: `Matériel : thermomètre rectal + vaseline\n\nTempératures normales :\n• Chien adulte : 38,0 – 39,0°C\n• Chat adulte : 38,0 – 39,5°C\n\nTechnique :\n1. Lubrifiez l'embout\n2. Soulevez délicatement la queue\n3. Insérez 2-3 cm dans le rectum\n4. Attendez le bip (15-30 sec)\n\n🟡 > 39,5°C → Appelez votre vétérinaire\n🔴 > 40,5°C → Urgence immédiate\n🔵 < 37,5°C → Hypothermie — urgence` },
  { id: 2, titre: 'Retirer une tique', categorie: 'Parasitologie', icon: '🔬', temps: '5 min', difficulte: 'Facile', contenu: `⚠️ Ne jamais brûler, écraser ou mettre d'huile.\n\nMatériel : tire-tique (Tick Twister)\n\nTechnique :\n1. Écartez les poils\n2. Glissez le crochet sous la tique\n3. Tournez en sens anti-horaire\n4. Tirez doucement sans écraser\n5. Désinfectez à la chlorhexidine\n6. Notez la date, surveillez 3 semaines\n\nSignes d'alerte : fièvre, abattement → suspicion piroplasmose` },
  { id: 3, titre: 'Soigner une plaie', categorie: 'Soins', icon: '🩹', temps: '10 min', difficulte: 'Moyen', contenu: `Pour les plaies superficielles uniquement.\n\n1. Tondez autour si possible\n2. Rincez au sérum physiologique (étape clé)\n3. Désinfectez à la chlorhexidine — pas d'alcool\n4. Compresse stérile + bande cohésive\n5. Collier élisabéthain obligatoire\n\n🔴 Consultez si : plaie profonde, morsure, infection après 48h` },
  { id: 4, titre: 'Coup de chaleur', categorie: 'Urgences', icon: '☀️', temps: '5 min', difficulte: 'Essentiel', contenu: `Urgence vitale — races brachycéphales +++\n\nSignes : halètement excessif, salivation, gencives rouge vif ou bleues, animal prostré\n\nPremiers gestes :\n1. Sortir de la zone chaude\n2. Eau fraîche (pas froide) sur le corps\n3. Ventiler l'animal\n4. Ne PAS donner à boire si inconscient\n5. Appeler en urgence\n\n📞 CAPSA 24h/24 : 04 78 87 10 40` },
  { id: 5, titre: 'Nettoyer les oreilles', categorie: 'Soins', icon: '👂', temps: '5 min', difficulte: 'Facile', contenu: `Si votre animal secoue la tête ou gratte, consultez avant de nettoyer.\n\nMatériel : lotion auriculaire vétérinaire + coton\n\n1. Instillez généreusement dans le conduit\n2. Massez la base 30 secondes\n3. Laissez secouer la tête\n4. Nettoyez le pavillon avec un coton\n⚠️ Jamais de coton-tige dans le conduit\n\nFréquence : 1x/semaine (oreilles tombantes), 1x/mois (autres)` },
  { id: 6, titre: 'Donner un médicament', categorie: 'Soins', icon: '💊', temps: '5 min', difficulte: 'Moyen', contenu: `En comprimé : placez loin sur la langue, tenez le museau vers le haut jusqu'à déglutition. Ou cachez dans du fromage.\n\nEn liquide : seringue dans la commissure des lèvres, injectez lentement.\n\n🚫 JAMAIS sans ordonnance :\n• Ibuprofène\n• Paracétamol\n• Aspirine\n→ Toxiques voire mortels pour les animaux` },
  { id: 7, titre: 'Mon animal ne va pas bien ?', categorie: 'Urgences', icon: '🚨', temps: '5 min', difficulte: 'Essentiel', contenu: `🔴 URGENCE IMMÉDIATE :\n• Abdomen gonflé + vomissements sans résultat\n• Difficultés respiratoires sévères\n• Gencives blanches, bleues ou grises\n• Convulsions répétées\n• Ne peut pas uriner (chat mâle)\n• Traumatisme grave\n\n🟡 CONSULTEZ DANS LES 24H :\n• Vomissements > 3 fois\n• Diarrhée avec sang\n• Fièvre > 39,5°C persistante\n• Ne pose plus la patte du tout\n• Œil rouge et fermé\n\n🟢 SURVEILLEZ :\n• Éternuements sans autre signe\n• Légère boiterie\n• Selles molles (1 épisode)` },
  { id: 8, titre: 'Toxiques courants', categorie: 'Urgences', icon: '⚠️', temps: '5 min', difficulte: 'Essentiel', contenu: `🍫 Aliments dangereux :\n• Chocolat (surtout noir)\n• Raisins et raisins secs\n• Oignons, ail, poireaux\n• Xylitol (édulcorant)\n• Avocat, alcool\n\n💊 Médicaments humains :\n• Ibuprofène, Paracétamol, Aspirine\n\n🌱 Plantes toxiques :\n• Lys (fatal pour les chats)\n• Laurier-rose, Muguet\n\n🧴 Produits ménagers :\n• Javel, antigel, raticides\n• Huiles essentielles (chats)\n\n📞 Urgence : CAPSA 04 78 87 10 40` },
]
