# 📂 TunEdu Project Structure

```
TunEdu/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # 5-minute setup guide
├── 📄 PROJECT_SUMMARY.md           # What we built
├── 📄 FEATURES.md                  # Feature details
├── 📄 API.md                       # API documentation
├── 📄 LICENSE                      # MIT License
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 backend/                     # Node.js + Express Backend
│   │
│   ├── 📄 package.json             # Dependencies & scripts
│   ├── 📄 .env                     # Environment variables
│   ├── 📄 .env.example             # Example env file
│   ├── 📄 .gitignore               # Backend ignore rules
│   ├── 📄 tunedu.db                # SQLite database (generated)
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📄 app.js               # 🚀 Main Express application
│   │   ├── 📄 db.js                # 🗄️ SQLite helper & schema
│   │   │
│   │   ├── 📁 middleware/
│   │   │   └── 📄 auth.js          # 🔐 JWT authentication
│   │   │
│   │   └── 📁 routes/
│   │       ├── 📄 auth.js          # Login/Register/Logout
│   │       ├── 📄 browse.js        # Levels/Years/Subjects
│   │       ├── 📄 subjects.js      # Subject CRUD + manual upload
│   │       ├── 📄 lessons.js       # Lesson CRUD + sessions/exercises
│   │       ├── 📄 interactions.js  # Votes & Comments
│   │       ├── 📄 activity.js      # Time tracking & analytics
│   │       └── 📄 assistant.js     # AI placeholder endpoint
│   │
│   ├── 📁 scripts/
│   │   └── 📄 seed.js              # 🌱 Database seeding script
│   │
│   └── 📁 uploads/                 # 📤 Uploaded files
│       ├── 📄 README.md            # Upload directory info
│       ├── 📄 sample-manual.pdf    # (place sample PDF here)
│       └── 📁 exercises/           # Exercise files
│
└── 📁 frontend/                    # Angular 20 Frontend
    │
    ├── 📄 package.json             # Dependencies & scripts
    ├── 📄 angular.json             # Angular CLI config
    ├── 📄 tsconfig.json            # TypeScript config
    ├── 📄 tsconfig.app.json        # App-specific TS config
    ├── 📄 tailwind.config.js       # TailwindCSS config
    ├── 📄 postcss.config.js        # PostCSS config
    ├── 📄 .gitignore               # Frontend ignore rules
    │
    └── 📁 src/
        │
        ├── 📄 index.html           # HTML entry point
        ├── 📄 main.ts              # Bootstrap Angular app
        ├── 📄 styles.css           # Global styles (Tailwind)
        │
        ├── 📁 environments/
        │   └── 📄 environment.ts   # Environment config (API URL)
        │
        └── 📁 app/
            │
            ├── 📄 app.component.ts     # 🎯 Root component
            ├── 📄 app.routes.ts        # 🛣️ Route configuration
            │
            ├── 📁 core/                # Core services & utilities
            │   │
            │   ├── 📁 services/
            │   │   ├── 📄 auth.service.ts      # 🔐 Authentication
            │   │   ├── 📄 api.service.ts       # 🌐 HTTP API calls
            │   │   └── 📄 activity.service.ts  # ⏱️ Time tracking
            │   │
            │   ├── 📁 guards/
            │   │   └── 📄 auth.guard.ts        # 🛡️ Route protection
            │   │
            │   └── 📁 interceptors/
            │       └── 📄 auth.interceptor.ts  # 🔑 JWT header injection
            │
            ├── 📁 shared/              # Shared components
            │   └── 📁 components/
            │       └── 📁 header/
            │           └── 📄 header.component.ts  # 📊 Navigation header
            │
            └── 📁 features/            # Feature modules
                │
                ├── 📁 auth/            # 🔐 Authentication
                │   ├── 📄 auth.routes.ts
                │   ├── 📁 login/
                │   │   └── 📄 login.component.ts
                │   └── 📁 register/
                │       └── 📄 register.component.ts
                │
                ├── 📁 dashboard/       # 📊 User Dashboard
                │   └── 📄 dashboard.component.ts
                │
                ├── 📁 browse/          # 📚 Browse Curriculum
                │   ├── 📄 browse.routes.ts
                │   ├── 📄 browse.component.ts      # Levels
                │   ├── 📄 years.component.ts       # Years
                │   └── 📄 subjects.component.ts    # Subjects
                │
                ├── 📁 subject/         # 📖 Subject Page
                │   └── 📄 subject.component.ts     # Manual + AI assistant
                │
                ├── 📁 lesson/          # 🎥 Lesson Page
                │   └── 📄 lesson.component.ts      # Videos + Exercises + Comments
                │
                └── 📁 studio/          # 🎓 Admin Studio
                    ├── 📄 studio.routes.ts
                    └── 📄 studio.component.ts
```

---

## 📊 File Count

| Category | Count |
|----------|-------|
| Backend files | 15 |
| Frontend files | 26 |
| Documentation | 6 |
| Configuration | 9 |
| **Total** | **56+** |

---

## 🎨 Color Legend

- 🚀 **Application Entry Points**
- 🗄️ **Database & Storage**
- 🔐 **Authentication & Security**
- 🛣️ **Routing & Navigation**
- 🌐 **API & HTTP**
- ⏱️ **Activity & Tracking**
- 📊 **UI Components**
- 🎓 **Admin Features**
- 🌱 **Utilities & Scripts**
- 📤 **Uploads & Files**

---

## 🔗 Key Relationships

```
app.js ──► routes/ ──► controllers (inline) ──► db.js ──► SQLite
                                                    │
                                                    └──► tunedu.db

main.ts ──► app.component.ts ──► app.routes.ts ──► features/
                                        │
                                        └──► core/services/ ──► Backend API
```

---

## 📝 Quick Navigation

### Start Here
- 📄 `QUICKSTART.md` - Get up and running in 5 minutes
- 📄 `README.md` - Full documentation

### For Developers
- 📄 `API.md` - Complete API reference
- 📄 `FEATURES.md` - Feature implementation details
- 📄 `backend/src/app.js` - Backend entry point
- 📄 `frontend/src/main.ts` - Frontend entry point

### For Learning
- 📄 `PROJECT_SUMMARY.md` - What we built and why
- 📄 `backend/scripts/seed.js` - Database schema & sample data
- 📄 `frontend/src/app/app.routes.ts` - Application routing

---

**Navigate with confidence! 🧭**
