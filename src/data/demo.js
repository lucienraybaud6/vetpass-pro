export const patients = [
  {
    id: 'PAT-001',
    nom: 'Luna',
    espece: 'Chien',
    race: 'Labrador Retriever',
    dateNaissance: '2019-03-14',
    age: '6 ans',
    sexe: 'Femelle stérilisée',
    poids: 28.4,
    scoreCorps: 5,
    puce: '250268500123456',
    passeport: true,
    assurance: 'Oui - premium',
    avatar: '🐕',
    couleur: '#2563EB',
    modeVie: 'Maison avec jardin',
    alimentation: 'Croquettes premium',
    activite: 'Actif',
    environnement: ['Enfants < 12 ans'],
    allergies: 'Allergie légère poulet confirmée par test',
    contreIndications: 'Aucune',
    traitementsChroniques: 'Apoquel 16 mg — 1 cp/jour (dermatite atopique)',
    statutVaccinal: 'À jour',
    prochainVaccin: '2026-09-15',
    prochainVermifuge: '2026-06-01',
    prochainAntiparasitaire: '2026-05-10',
    dernierRDV: '2026-03-12',
    prochainRDV: '2026-09-15',
    proprietaire: {
      nom: 'Mme. Martin Isabelle',
      telephone: '06 12 34 56 78',
      email: 'isabelle.martin@gmail.com',
      contact: 'SMS',
      sensibilitePrix: '€€€ - Premium',
      implication: 'Très investi',
      profilEmotionnel: 'Émotionnel / anxieux',
      score: 88,
      frequence: '> 3x/an',
      panierMoyen: '> 300€',
      fidelite: 'Fidèle > 2 ans',
      rgpd: true,
    },
    soinsRefuses: 'Bilan biochimique complet — refusé 15/01/2026 (coût). Relance: 15/07/2026',
    notesVeto: 'Proprio très investie, anxieuse. Appelle souvent. Toujours expliquer en détail avant tout acte. Sensible au budget mais accepte si bien justifié.',
    historique: [
      { date: '2026-03-12', type: 'Consultation', motif: 'Visite annuelle + vaccin CHPL', diagnostic: 'Animal en bonne santé. Légère surcharge pondérale (sc 5/9).', traitement: 'Vaccin CHPL (lot VX2834A). Conseils alimentaires.', veterinaire: 'Dr. Martin', prochainRDV: 'Rappel vaccin 09/2026' },
      { date: '2025-11-20', type: 'Consultation', motif: 'Grattage intense, érythème ventral', diagnostic: 'Poussée dermatite atopique', traitement: 'Apoquel 16mg 1x/j — 30j. Bain Douxo S3 Atopic 2x/sem.', veterinaire: 'Dr. Leroy', prochainRDV: 'Contrôle 3 sem' },
      { date: '2025-07-05', type: 'Analyse', motif: 'Bilan sanguin annuel', diagnostic: 'NFS normale. Légère hyperphosphatasémie (non significative).', traitement: 'Contrôle dans 12 mois.', veterinaire: 'Dr. Martin', prochainRDV: '07/2026' },
    ],
  },
  {
    id: 'PAT-002',
    nom: 'Milo',
    espece: 'Chat',
    race: 'Maine Coon',
    dateNaissance: '2020-08-22',
    age: '5 ans',
    sexe: 'Mâle castré',
    poids: 7.2,
    scoreCorps: 6,
    puce: '250268500789012',
    passeport: false,
    assurance: 'Oui - base',
    avatar: '🐈',
    couleur: '#7C3AED',
    modeVie: 'Appartement strict',
    alimentation: 'Mixte',
    activite: 'Sédentaire',
    environnement: [],
    allergies: 'Aucune connue',
    contreIndications: 'Sensibilité AINS — vomissements épisode 02/2025',
    traitementsChroniques: 'Hills Urinary c/d — ration quotidienne 60g',
    statutVaccinal: 'Rappel proche < 1 mois',
    prochainVaccin: '2026-05-20',
    prochainVermifuge: '2026-07-01',
    prochainAntiparasitaire: '2026-05-01',
    dernierRDV: '2025-12-08',
    prochainRDV: '2026-05-20',
    proprietaire: {
      nom: 'M. Dubois Thomas',
      telephone: '07 23 45 67 89',
      email: 'thomas.dubois@hotmail.fr',
      contact: 'Email',
      sensibilitePrix: '€€ - Moyen',
      implication: 'Impliqué',
      profilEmotionnel: 'Rationnel / pragmatique',
      score: 62,
      frequence: '2-3x/an',
      panierMoyen: '150-300€',
      fidelite: 'Régulier < 2 ans',
      rgpd: true,
    },
    soinsRefuses: 'Échographie rénale préventive — refusée 08/12/2025 (coût). Relance: 08/06/2026',
    notesVeto: 'Proprio rationnel, veut des chiffres et des probabilités. Ne pas sur-vendre. Toujours chiffrer le bénéfice concret. Suivi urinaire à maintenir — chat à risque élevé FLUTD.',
    historique: [
      { date: '2025-12-08', type: 'Consultation', motif: 'Trouble urinaire — strangurie', diagnostic: 'Cystite idiopathique féline. Pas d\'obstruction. Pas de cristaux à l\'écho.', traitement: 'Hills c/d. Fontaine à eau. Enrichissement environnemental. Recalme si stress.', veterinaire: 'Dr. Leroy', prochainRDV: 'Contrôle 1 mois + vaccin' },
      { date: '2025-05-14', type: 'Consultation', motif: 'Vomissements répétés', diagnostic: 'Gastrite aiguë simple. Contexte stress (déménagement).', traitement: 'Diète 24h. Hills i/d 5j. Surveiller.', veterinaire: 'Dr. Martin', prochainRDV: 'Si récidive' },
    ],
  },
  {
    id: 'PAT-003',
    nom: 'Rex',
    espece: 'Chien',
    race: 'Berger Allemand',
    dateNaissance: '2016-11-03',
    age: '9 ans',
    sexe: 'Mâle castré',
    poids: 34.1,
    scoreCorps: 5,
    puce: '250268500345678',
    passeport: true,
    assurance: 'Non',
    avatar: '🐕‍🦺',
    couleur: '#D97706',
    modeVie: 'Extérieur / Rural',
    alimentation: 'Croquettes premium',
    activite: 'Actif',
    environnement: ['Autres chiens'],
    allergies: 'Aucune',
    contreIndications: 'Aucune',
    traitementsChroniques: 'Phénobarbital 30mg — 2x/jour (épilepsie idiopathique depuis 2022)',
    statutVaccinal: 'En retard',
    prochainVaccin: '2026-02-01',
    prochainVermifuge: '2026-05-15',
    prochainAntiparasitaire: '2026-05-01',
    dernierRDV: '2025-09-22',
    prochainRDV: '2026-06-01',
    proprietaire: {
      nom: 'M. Lefebvre Jean-Pierre',
      telephone: '06 87 65 43 21',
      email: 'jp.lefebvre@orange.fr',
      contact: 'Téléphone',
      sensibilitePrix: '€ - Budget serré',
      implication: 'Moyen',
      profilEmotionnel: 'Confiant',
      score: 41,
      frequence: '1x/an',
      panierMoyen: '50-150€',
      fidelite: 'Fidèle > 2 ans',
      rgpd: true,
    },
    soinsRefuses: 'Bilan phénobarbital (hépatique) — refusé 22/09/2025. URGENT à relancer. Contrôle phéno obligatoire tous les 6 mois. Risque hépatique.',
    notesVeto: '⚠️ ALERTE: Rex est sous phénobarb depuis 4 ans. Bilan hépatique non fait depuis 18 mois. M. Lefebvre sensible au prix mais fait confiance au véto. Expliquer le risque hépatique clairement — il ne sait pas. Vaccin en retard de 3 mois.',
    historique: [
      { date: '2025-09-22', type: 'Consultation', motif: 'Crise épileptique — 2e en 2 mois', diagnostic: 'Épilepsie idiopathique instable. Dose phéno insuffisante?', traitement: 'Augmentation phénobarbital 30→40mg 2x/j. Bilan phéno recommandé (refusé).', veterinaire: 'Dr. Martin', prochainRDV: 'Bilan phéno + vaccin — urgent' },
      { date: '2024-08-10', type: 'Consultation', motif: 'Visite annuelle + vaccin CHPL', diagnostic: 'Animal stable sous traitement. Légère spondylose lombaire débutante.', traitement: 'Vaccin CHPL. Antiparasitaire.', veterinaire: 'Dr. Leroy', prochainRDV: '08/2025' },
    ],
  },
  {
    id: 'PAT-004',
    nom: 'Noisette',
    espece: 'Chat',
    race: 'Européen',
    dateNaissance: '2022-04-30',
    age: '3 ans',
    sexe: 'Femelle stérilisée',
    poids: 3.8,
    scoreCorps: 4,
    puce: '250268500901234',
    passeport: false,
    assurance: 'Non',
    avatar: '🐱',
    couleur: '#059669',
    modeVie: 'Appartement strict',
    alimentation: 'Croquettes standard',
    activite: 'Modéré',
    environnement: ['Autres chats'],
    allergies: 'Aucune',
    contreIndications: 'Aucune',
    traitementsChroniques: 'Aucun',
    statutVaccinal: 'À jour',
    prochainVaccin: '2027-01-15',
    prochainVermifuge: '2026-08-01',
    prochainAntiparasitaire: '2026-06-15',
    dernierRDV: '2026-01-15',
    prochainRDV: '2027-01-15',
    proprietaire: {
      nom: 'Mme. Petit Sophie',
      telephone: '06 45 67 89 01',
      email: 'sophie.petit@gmail.com',
      contact: 'SMS',
      sensibilitePrix: '€ - Budget serré',
      implication: 'Peu impliqué',
      profilEmotionnel: 'Émotionnel / anxieux',
      score: 28,
      frequence: '1x/an',
      panierMoyen: '50-150€',
      fidelite: 'Nouveau client',
      rgpd: true,
    },
    soinsRefuses: 'Détartrage — refusé 15/01/2026. Relance: 15/07/2026',
    notesVeto: 'Nouvelle cliente. Proprio anxieuse mais budget serré. Toujours rassurer d\'abord. Proposer minimum vital. Sensibiliser progressivement à la prévention.',
    historique: [
      { date: '2026-01-15', type: 'Consultation', motif: 'Première visite + vaccination', diagnostic: 'Bonne santé générale. Légère gingivite débutante.', traitement: 'Vaccin RCP. Antiparasitaire Frontline. Détartrage suggéré (refusé).', veterinaire: 'Dr. Martin', prochainRDV: 'Rappel vaccin 01/2027' },
    ],
  },
];

export const messages = [
  {
    id: 1,
    patient: 'Luna',
    proprietaire: 'Mme. Martin Isabelle',
    date: '2026-04-28',
    heure: '09h14',
    type: 'entrant',
    canal: 'Email',
    sujet: 'Inquiétude grattage — Luna',
    contenu: 'Bonjour, Luna se gratte beaucoup depuis hier soir au niveau du ventre. Elle a l\'air d\'avoir chaud et la peau semble un peu rose. Dois-je m\'inquiéter ? Faut-il venir en urgence ?',
    statut: 'À relancer',
    traite: 'Dr. Martin',
  },
  {
    id: 2,
    patient: 'Luna',
    proprietaire: 'Mme. Martin Isabelle',
    date: '2026-04-28',
    heure: '10h30',
    type: 'sortant',
    canal: 'Email',
    sujet: 'RE: Inquiétude grattage — Luna',
    contenu: 'Bonjour Mme. Martin, merci pour votre message. D\'après la description, il s\'agit probablement d\'une petite poussée de dermatite atopique, fréquente chez Luna. Continuez l\'Apoquel, doublez le bain Douxo S3 cette semaine. Si la peau devient chaude, si Luna ne mange plus ou si la rougeur s\'étend, consultez rapidement. Sinon RDV de contrôle si pas d\'amélioration sous 5 jours. Bonne journée.',
    statut: 'Clôturé',
    traite: 'Dr. Martin',
  },
  {
    id: 3,
    patient: 'Milo',
    proprietaire: 'M. Dubois Thomas',
    date: '2026-04-25',
    heure: '16h02',
    type: 'entrant',
    canal: 'SMS',
    sujet: 'Rappel vaccin Milo',
    contenu: 'Bonjour, j\'ai reçu le rappel pour le vaccin de Milo. Je souhaite prendre RDV. Quelles sont vos disponibilités semaine 20 ?',
    statut: 'En attente réponse',
    traite: 'ASV Dubois',
  },
  {
    id: 4,
    patient: 'Rex',
    proprietaire: 'M. Lefebvre Jean-Pierre',
    date: '2026-04-20',
    heure: '11h45',
    type: 'sortant',
    canal: 'Appel sortant',
    sujet: 'Relance bilan hépatique urgent — Rex',
    contenu: 'Appel effectué. M. Lefebvre informé de l\'importance du bilan hépatique sous phénobarb. Expliqué risque hépatotoxicité. Il accepte RDV. Fixé le 05/05/2026 avec Rex.',
    statut: 'Clôturé',
    traite: 'Dr. Martin',
  },
];

export const rappels = [
  { id: 1, patient: 'Rex', proprietaire: 'M. Lefebvre Jean-Pierre', type: 'Vaccin CHPL', echeance: '2026-02-01', statut: 'En retard', priorite: 'haute', telephone: '06 87 65 43 21', avatar: '🐕‍🦺' },
  { id: 2, patient: 'Milo', proprietaire: 'M. Dubois Thomas', type: 'Vaccin RCP', echeance: '2026-05-20', statut: 'Rappel proche', priorite: 'moyenne', telephone: '07 23 45 67 89', avatar: '🐈' },
  { id: 3, patient: 'Noisette', proprietaire: 'Mme. Petit Sophie', type: 'Antiparasitaire', echeance: '2026-06-15', statut: 'À venir', priorite: 'basse', telephone: '06 45 67 89 01', avatar: '🐱' },
  { id: 4, patient: 'Luna', proprietaire: 'Mme. Martin Isabelle', type: 'Antiparasitaire', echeance: '2026-05-10', statut: 'Rappel proche', priorite: 'moyenne', telephone: '06 12 34 56 78', avatar: '🐕' },
  { id: 5, patient: 'Rex', proprietaire: 'M. Lefebvre Jean-Pierre', type: 'Bilan hépatique phénobarb', echeance: '2026-05-05', statut: 'Rappel proche', priorite: 'haute', telephone: '06 87 65 43 21', avatar: '🐕‍🦺' },
];

export const stats = {
  patientsActifs: 142,
  rdvCeMois: 38,
  rappelsEnvoyes: 23,
  rappelsHonores: 17,
  satisfactionMoyenne: 4.6,
  nouveauxPatients: 8,
  fichesPart: 31,
  revenuEstime: 8420,
};

export const fichesEducatives = [
  {
    id: 1,
    titre: 'Prendre la température de son animal',
    categorie: 'Prévention',
    icon: '🌡️',
    temps: '3 min',
    difficulte: 'Facile',
    contenu: `La prise de température est un geste simple qui vous permet d'évaluer rapidement l'état de santé de votre animal.

**Matériel nécessaire :** Thermomètre rectal digital + vaseline

**Températures normales :**
- Chien adulte : 38,0°C à 39,0°C
- Chat adulte : 38,0°C à 39,5°C

**Technique :**
1. Lubrifiez l'embout avec de la vaseline
2. Soulevez délicatement la queue
3. Insérez 2 à 3 cm dans le rectum
4. Attendez le signal sonore (15-30 sec)

**Quand s'inquiéter ?**
- 🟡 > 39,5°C → Appelez votre vétérinaire
- 🔴 > 40,5°C → Urgence vétérinaire immédiate
- 🔵 < 37,5°C → Hypothermie — urgence également`,
  },
  {
    id: 2,
    titre: 'Retirer une tique correctement',
    categorie: 'Parasitologie',
    icon: '🔬',
    temps: '5 min',
    difficulte: 'Facile',
    contenu: `Ne jamais brûler la tique, l'écraser ou mettre d'huile dessus.

**Matériel :** Tire-tique (Tick Twister)

**Technique :**
1. Écartez les poils autour de la tique
2. Glissez le crochet sous la tique
3. Tournez en sens anti-horaire
4. Tirez doucement sans écraser
5. Désinfectez à la chlorhexidine
6. Notez la date — surveillez 3 semaines

**Signes d'alerte post-tique :**
Fièvre, abattement, manque d'appétit → suspicion piroplasmose`,
  },
  {
    id: 3,
    titre: 'Soins de plaie à domicile',
    categorie: 'Soins post-op',
    icon: '🩹',
    temps: '10 min',
    difficulte: 'Moyen',
    contenu: `Pour les plaies superficielles uniquement.

**Étapes :**
1. Tondre les poils autour si possible
2. Rincer abondamment au sérum physiologique
3. Désinfecter avec chlorhexidine (pas d'alcool)
4. Couvrir avec compresse stérile + bande cohésive
5. Empêcher le léchage — collier élisabéthain

**Consultez si :**
- Plaie profonde ou béante
- Morsure (même petite)
- Signes d'infection après 48h`,
  },
  {
    id: 4,
    titre: 'Reconnaître un coup de chaleur',
    categorie: 'Urgences',
    icon: '☀️',
    temps: '5 min',
    difficulte: 'Essentiel',
    contenu: `Urgence vitale, surtout en été et races brachycéphales.

**Signes :**
- Halètement excessif et rapide
- Salivation abondante
- Gencives rouge vif ou bleues
- Animal prostré ou inconscient

**Premiers gestes :**
1. Sortir de la zone chaude immédiatement
2. Eau fraîche (pas froide) sur le corps
3. Ventiler l'animal
4. NE PAS donner à boire si inconscient
5. Appeler en urgence — fatal en minutes`,
  },
];
