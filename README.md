# 🐾 VetPass Pro — Guide complet

CRM vétérinaire par un étudiant en 4ème année.

## Lancer le site

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Structure des fichiers à modifier

| Fichier | Contenu |
|---------|---------|
| `src/data/demo.js` | ⭐ Toutes les données (patients, messages, stats) |
| `src/index.css` | Couleurs et variables CSS |
| `src/pages/Landing.jsx` | Page d'accueil |
| `src/pages/Tarifs.jsx` | Tarifs + Contact |
| `src/pages/clinic/Dashboard.jsx` | Tableau de bord |
| `src/pages/clinic/Patients.jsx` | Liste patients |
| `src/pages/clinic/PatientDetail.jsx` | Dossier patient |
| `src/pages/owner/OwnerSpace.jsx` | Espace propriétaire |

## Mettre en ligne (gratuit)

```bash
# Build
npm run build

# Option 1 : Glissez le dossier dist/ sur netlify.com/drop
# Option 2 : vercel (npm install -g vercel && vercel)
```

## Modifier les couleurs

Dans `src/index.css` :
```css
--teal-800: #0F6E56;   /* Couleur principale */
--teal-400: #34C99A;   /* Couleur accent */
```

Contact : vetpass.pro@gmail.com
