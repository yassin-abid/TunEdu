# TunEdu - Plateforme Éducative Tunisienne

![TunEdu Banner](https://img.shields.io/badge/TunEdu-Educational%20Platform-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Angular](https://img.shields.io/badge/Angular-20-red)
![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey)

Une plateforme éducative moderne et élégante pour le programme scolaire tunisien (Primaire, Collège, Lycée) avec Angular 20 et Node.js.

## 🎯 Fonctionnalités

### Pour les Étudiants
- ✅ **Authentification** - Inscription et connexion sécurisées
- 📚 **Exploration du Curriculum** - Navigation par niveau (Primaire/Collège/Lycée) → Année → Matière
- 📖 **Manuels Scolaires** - Prévisualisation et téléchargement de PDFs
- 🎥 **Cours Vidéo** - Lectures enregistrées (YouTube/Vimeo/MP4)
- 📝 **Exercices** - Téléchargement et consultation d'exercices
- 👍👎 **Votes** - System de vote pour les leçons, vidéos et exercices
- 💬 **Commentaires** - Discussion sur les leçons
- 📊 **Tableau de Bord** - Statistiques personnelles (temps passé, leçons consultées, exercices ouverts)
- 🤖 **Assistant IA** - Interface placeholder pour l'assistance future

### Pour les Administrateurs
- 🎓 **Studio de Gestion** - Création et édition de contenu
- 📤 **Upload de Manuels** - Téléversement de fichiers PDF
- ➕ **Gestion des Leçons** - Création de leçons, sessions vidéo et exercices

## 🏗️ Architecture

```
TunEdu/
├── backend/                    # Node.js + Express + SQLite
│   ├── src/
│   │   ├── app.js             # Point d'entrée Express
│   │   ├── db.js              # Helper SQLite + schéma
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication
│   │   └── routes/
│   │       ├── auth.js        # Login/Register
│   │       ├── browse.js      # Levels/Years/Subjects
│   │       ├── subjects.js    # Subject details
│   │       ├── lessons.js     # Lesson details
│   │       ├── interactions.js # Votes/Comments
│   │       ├── activity.js    # Time tracking
│   │       └── assistant.js   # AI placeholder
│   ├── scripts/
│   │   └── seed.js            # Données de démonstration
│   ├── uploads/               # Fichiers uploadés
│   └── package.json
│
└── frontend/                   # Angular 20 + TailwindCSS
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── services/
    │   │   │   │   ├── auth.service.ts
    │   │   │   │   ├── api.service.ts
    │   │   │   │   └── activity.service.ts
    │   │   │   ├── guards/
    │   │   │   │   └── auth.guard.ts
    │   │   │   └── interceptors/
    │   │   │       └── auth.interceptor.ts
    │   │   ├── features/
    │   │   │   ├── auth/          # Login/Register
    │   │   │   ├── dashboard/     # Tableau de bord
    │   │   │   ├── browse/        # Exploration
    │   │   │   ├── subject/       # Page matière
    │   │   │   ├── lesson/        # Page leçon
    │   │   │   └── studio/        # Admin panel
    │   │   └── shared/
    │   │       └── components/
    │   │           └── header/    # En-tête navigation
    │   └── environments/
    └── package.json
```

## 🚀 Installation et Démarrage Rapide

### Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- Un navigateur moderne (Chrome, Firefox, Edge)

### 1. Backend Setup

```powershell
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
copy .env.example .env

# Initialiser la base de données et créer les données de test
npm run seed

# Démarrer le serveur (mode développement)
npm run dev

# OU en mode production
npm start
```

Le backend démarre sur **http://localhost:3000**

### 2. Frontend Setup

Ouvrir un **nouveau terminal PowerShell** :

```powershell
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement Angular
npm start
```

Le frontend démarre sur **http://localhost:4200**

### 3. Accéder à l'Application

Ouvrir votre navigateur et aller sur : **http://localhost:4200**

## 👤 Comptes de Test

Après avoir exécuté `npm run seed`, deux comptes sont disponibles :

### Étudiant
- **Email** : `student@example.com`
- **Mot de passe** : `student123`
- Accès : Dashboard, Explorer, Leçons

### Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`
- Accès : Dashboard, Explorer, Leçons, **Studio**

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter |
| GET | `/auth/me` | Utilisateur actuel |
| POST | `/auth/logout` | Se déconnecter |

### Browse (Public with Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/levels` | Liste des niveaux |
| GET | `/levels/:slug/years` | Années d'un niveau |
| GET | `/years/:slug/subjects` | Matières d'une année |

### Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subjects/:slug` | Détails d'une matière |
| GET | `/lessons/:slug` | Détails d'une leçon |

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/subjects/:slug/lessons` | Créer une leçon |
| POST | `/subjects/:slug/manual` | Upload manuel PDF |
| POST | `/lessons/:slug/sessions` | Ajouter une vidéo |
| POST | `/lessons/:slug/exercises` | Ajouter un exercice |

### Interactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vote` | Voter (+1/-1) |
| GET | `/comments` | Lister les commentaires |
| POST | `/comments` | Créer un commentaire |
| DELETE | `/comments/:id` | Supprimer un commentaire |

### Activity & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/activity` | Enregistrer une activité |
| GET | `/activity/dashboard/me` | Stats personnelles |

### AI Assistant (Placeholder)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/assistant/ask` | Poser une question |

## 🗃️ Modèle de Données

### Tables Principales

- **users** - Comptes utilisateurs (STUDENT, TEACHER, ADMIN)
- **levels** - Niveaux éducatifs (Primaire, Collège, Lycée)
- **class_years** - Années scolaires (1ère année, 2ème année, etc.)
- **subjects** - Matières (Mathématiques, Français, etc.)
- **lessons** - Leçons d'une matière
- **recorded_sessions** - Vidéos de cours
- **exercises** - Exercices et séries
- **votes** - System de vote
- **comments** - Commentaires
- **activity** - Tracking d'activité utilisateur

## ⏱️ Time Tracking

Le système enregistre automatiquement le temps passé :

- **Tick automatique** : Toutes les 15 secondes, un POST est envoyé à `/api/v1/activity` avec `kind: TIME_TICK` et `valueInt: 15`
- **Page views** : Navigation enregistrée avec `kind: PAGE_VIEW`
- **Actions** : Ouverture de vidéos (`VIDEO_OPEN`) et exercices (`EXERCISE_OPEN`)

Les stats sont affichées dans le tableau de bord :
- Temps aujourd'hui
- Temps cette semaine
- Nombre de leçons consultées
- Nombre d'exercices ouverts

## 🤖 Assistant IA (Placeholder)

L'assistant IA est une **fonctionnalité placeholder** :

- Interface UI fonctionnelle avec champ de texte et bouton
- Endpoint backend `/api/v1/assistant/ask` retourne une réponse prédéfinie
- Message : *"Fonctionnalité à venir. Je me base sur le manuel pour répondre à vos questions..."*
- **Aucun appel LLM réel** n'est effectué

## 🎨 Styles & UI

- **TailwindCSS** pour le styling
- Design responsive (mobile-first)
- Composants réutilisables :
  - `.btn`, `.btn-primary`, `.btn-secondary`
  - `.card` pour les conteneurs
  - `.input` pour les champs de formulaire
- Palette de couleurs primaire : bleu (#0ea5e9)

## 📁 Uploads & Static Files

Les fichiers uploadés sont stockés dans `backend/uploads/` :
- **Manuels** : `backend/uploads/*.pdf`
- **Exercices** : `backend/uploads/exercises/*`

Servis statiquement via Express : `http://localhost:3000/uploads/...`

## 🔒 Sécurité

- **JWT** pour l'authentification (token stocké dans localStorage)
- **bcryptjs** pour le hashage des mots de passe
- **Guards Angular** pour protéger les routes (`authGuard`, `adminGuard`)
- **Middleware Express** pour vérifier les permissions (`isAuthenticated`, `isAdmin`)

## 🐛 Debugging & Logs

- Backend logs dans la console du terminal
- Frontend : Ouvrir les DevTools du navigateur (F12)
- Erreurs réseau : Onglet Network des DevTools
- Base de données : Fichier `backend/tunedu.db` (peut être ouvert avec DB Browser for SQLite)

## 🧪 Tests

Pour tester l'application :

1. **Seed la base de données** : `npm run seed` (dans backend/)
2. **Tester l'authentification** : Connexion avec student@example.com / admin@example.com
3. **Explorer le curriculum** : Primaire → 3ème année → Mathématiques
4. **Consulter une leçon** : Cliquer sur "Les nombres jusqu'à 100"
5. **Voter et commenter** : Utiliser les boutons de vote et ajouter un commentaire
6. **Vérifier le dashboard** : Les statistiques doivent augmenter
7. **Tester le studio** (admin uniquement) : Accéder à /studio

## 📦 Scripts Disponibles

### Backend
```powershell
npm start       # Démarrer le serveur
npm run dev     # Démarrer en mode watch (nodemon)
npm run seed    # Initialiser la DB et créer les données de test
```

### Frontend
```powershell
npm start       # Démarrer le dev server (ng serve)
npm run build   # Build de production
npm run watch   # Build en mode watch
```

## 🚫 Limitations & Scope

Cette application est une **démo pédagogique** :

- ❌ **Pas de Docker** ni de conteneurisation
- ❌ **Pas de déploiement** CI/CD configuré
- ❌ **Pas de Redis/Celery** ou autres services externes
- ❌ **Pas de cloud storage** (S3, Azure Blob, etc.)
- ❌ **L'assistant IA** est un placeholder (pas d'intégration LLM réelle)
- ✅ **SQLite uniquement** pour la simplicité
- ✅ **Fichiers locaux** pour les uploads
- ✅ **JWT simple** (pas de refresh tokens)

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** 18+
- **Express** 4.x - Framework web
- **better-sqlite3** - Base de données SQLite
- **jsonwebtoken** - Authentification JWT
- **bcryptjs** - Hashage de mots de passe
- **multer** - Upload de fichiers
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables d'environnement

### Frontend
- **Angular** 20 - Framework frontend
- **TypeScript** 5.6
- **TailwindCSS** 3.4 - Styling
- **RxJS** 7.8 - Programmation réactive
- **Standalone Components** - Architecture moderne Angular

## 🤝 Contribution

Ce projet est à but pédagogique. Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

Développé pour une démonstration du curriculum tunisien avec des technologies modernes.

## 🙏 Remerciements

- Programme scolaire tunisien
- Communauté Angular
- Communauté Node.js
- TailwindCSS

---

**🎓 TunEdu** - *L'éducation tunisienne modernisée* 📚
