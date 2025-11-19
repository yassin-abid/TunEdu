# 📋 TunEdu - Features & Implementation Details

## Core Features Implemented

### 🔐 Authentication & Authorization

#### User Registration
- Email + password validation
- Password hashing with bcryptjs (10 rounds)
- Automatic JWT token generation
- Default role: STUDENT
- Returns user object + access token

#### User Login
- Email/password verification
- JWT token (7-day expiration)
- Token stored in localStorage (frontend)
- Auto-authentication on page reload

#### Authorization Middleware
- `isAuthenticated`: Verifies JWT token
- `isAdmin`: Checks ADMIN or TEACHER role
- Protected routes reject unauthorized access
- Frontend route guards mirror backend permissions

---

### 📚 Browse & Navigation

#### Three-Level Hierarchy
1. **Levels**: Primaire, Collège, Lycée
2. **Class Years**: 1ère année, 2ème année, etc.
3. **Subjects**: Mathématiques, Français, Sciences, etc.

#### Breadcrumb Navigation
- Always shows: Explorer → Level → Year → Subject
- Clickable breadcrumbs for quick navigation
- Back buttons on every page

#### Search & Filter
- Manual search (by subject name)
- Filter by level/year
- Future: Full-text search across lessons

---

### 📖 Subject Page

#### Manual Preview
- Embedded PDF viewer using `<object>` tag
- Fallback download link for unsupported browsers
- Full-screen preview option
- Download button for offline access

#### Lessons List
- Shows all lessons for a subject
- Displays lesson title, summary, and score
- Click to navigate to lesson detail
- Sorted by order (customizable by admin)

#### AI Assistant Panel (Placeholder)
- Text input field
- "Send" button
- Returns canned response:
  > "Fonctionnalité à venir. Je me base sur le manuel pour répondre."
- Backend endpoint ready for future LLM integration

---

### 🎥 Lesson Page

#### Video Player
- Supports YouTube, Vimeo, and direct MP4 URLs
- Auto-converts YouTube watch URLs to embed URLs
- Responsive video player
- Duration display
- Voting for each video session

#### Exercises Section
- Grid layout of exercise cards
- Shows title, description, difficulty badge
- Color-coded difficulty:
  - 🟢 EASY = Green
  - 🟡 MEDIUM = Yellow
  - 🔴 HARD = Red
- Download/Open button with file link
- Tracks "exercise opened" events

#### Voting System
- 👍 Upvote (+1)
- 👎 Downvote (-1)
- Score displayed next to vote buttons
- Optimistic UI updates
- Stored per user (unique constraint)

#### Comments Section
- Add new comments
- Display all comments with author and timestamp
- Delete own comments (or any as admin)
- Replies supported (parent_id field)
- Sorted by newest first

---

### 📊 Dashboard

#### Activity Stats
Shows 4 key metrics:

1. **Time Today** (seconds → formatted as "Xh Ym")
2. **Time This Week** (cumulative)
3. **Lessons Viewed** (distinct count)
4. **Exercises Opened** (distinct count)

#### Quick Actions
- "Explorer les cours" button → Browse
- "Reprendre où j'en étais" → Coming soon

#### Auto-Updates
- Stats update every time page is visited
- Real-time tracking via activity service

---

### ⏱️ Time Tracking

#### Automatic Tick System
- Every 15 seconds: POST `/api/v1/activity`
- Payload: `{ kind: 'TIME_TICK', valueInt: 15 }`
- Runs only when user is authenticated
- Pauses when user logs out
- Resumes on login

#### Activity Events
- `PAGE_VIEW`: Recorded on route navigation
- `VIDEO_OPEN`: When video is played
- `EXERCISE_OPEN`: When exercise is opened
- `LOGIN`: When user logs in
- `TIME_TICK`: Every 15 seconds

#### Analytics Query
- Groups by date for "today" and "last 7 days"
- Uses SQLite `datetime` functions
- Aggregates SUM for time, COUNT DISTINCT for views

---

### 🎓 Admin Studio

#### Content Management
Admins can:
- Create new lessons for subjects
- Add recorded sessions (videos) to lessons
- Upload exercises (with files)
- Upload subject manuals (PDFs)

#### Current Studio Features
- Dashboard with action cards
- Links to creation forms
- File upload interface with validation
- Success/error messages

#### Planned Studio Features
- Edit existing content
- Delete lessons/sessions/exercises
- Reorder lessons
- Bulk operations

---

## 🗃️ Database Schema Details

### users
```sql
- id: INTEGER PRIMARY KEY
- email: TEXT UNIQUE NOT NULL
- password_hash: TEXT NOT NULL
- first_name: TEXT
- last_name: TEXT
- role: TEXT (STUDENT|TEACHER|ADMIN)
- date_joined: DATETIME DEFAULT CURRENT_TIMESTAMP
- avatar_url: TEXT
```

### levels
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT NOT NULL
- slug: TEXT UNIQUE NOT NULL
- order: INTEGER NOT NULL
```

### class_years
```sql
- id: INTEGER PRIMARY KEY
- level_id: INTEGER → levels(id)
- name: TEXT NOT NULL
- slug: TEXT UNIQUE NOT NULL
- order: INTEGER NOT NULL
```

### subjects
```sql
- id: INTEGER PRIMARY KEY
- class_year_id: INTEGER → class_years(id)
- name: TEXT NOT NULL
- slug: TEXT UNIQUE NOT NULL
- description: TEXT
- manual_path: TEXT
- thumbnail_url: TEXT
```

### lessons
```sql
- id: INTEGER PRIMARY KEY
- subject_id: INTEGER → subjects(id)
- title: TEXT NOT NULL
- slug: TEXT UNIQUE NOT NULL
- summary: TEXT
- order: INTEGER NOT NULL
- score: INTEGER DEFAULT 0
```

### recorded_sessions
```sql
- id: INTEGER PRIMARY KEY
- lesson_id: INTEGER → lessons(id)
- title: TEXT NOT NULL
- video_url: TEXT NOT NULL
- duration_seconds: INTEGER
- score: INTEGER DEFAULT 0
```

### exercises
```sql
- id: INTEGER PRIMARY KEY
- lesson_id: INTEGER → lessons(id)
- title: TEXT NOT NULL
- description: TEXT
- file_path: TEXT
- difficulty: TEXT (EASY|MEDIUM|HARD)
- score: INTEGER DEFAULT 0
```

### votes
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER → users(id)
- target_type: TEXT (lesson|session|exercise)
- target_id: INTEGER
- value: INTEGER (+1|-1)
- UNIQUE(user_id, target_type, target_id)
```

### comments
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER → users(id)
- target_type: TEXT
- target_id: INTEGER
- body: TEXT NOT NULL
- parent_id: INTEGER → comments(id)
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP
```

### activity
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER → users(id)
- kind: TEXT NOT NULL
- target_type: TEXT
- target_id: INTEGER
- value_int: INTEGER
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl (TailwindCSS)
- Hamburger menu on mobile (future)
- Touch-friendly buttons and inputs

### Color Palette
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Gray (#6b7280)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Reusable Components
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.card` (white background, shadow, padding)
- `.input` (form fields with focus states)
- Header (navigation bar)
- Breadcrumbs (automatic from router)

### Accessibility
- Semantic HTML5 tags
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Alt text on images

---

## 🔒 Security Features

### Backend
- **JWT** with secret key (from .env)
- **bcryptjs** password hashing (10 rounds)
- **Prepared statements** for SQL (SQL injection protection)
- **File type validation** (multer fileFilter)
- **File size limits** (50MB max)
- **CORS** enabled for local dev

### Frontend
- **JWT stored in localStorage** (demo only; use httpOnly cookies in prod)
- **HTTP interceptor** adds Authorization header
- **Route guards** prevent unauthorized access
- **Form validation** (email, min length, required)
- **XSS protection** (Angular's DomSanitizer)

---

## 🚀 Performance Optimizations

### Backend
- **Prepared statements** cached by better-sqlite3
- **Indexed columns**: id, slug, email
- **Lazy loading**: Only fetch related data when needed
- **Static file serving**: Express serves uploads directly

### Frontend
- **Lazy loading routes**: Feature modules loaded on demand
- **Standalone components**: Smaller bundle sizes
- **RxJS operators**: Efficient data streams
- **OnPush change detection**: Future optimization
- **Tree-shaking**: Unused code removed in prod build

---

## 🧪 Testing Scenarios

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with existing user
- [ ] Browse levels → years → subjects
- [ ] View subject with manual preview
- [ ] Open lesson and play video
- [ ] Download exercise file
- [ ] Vote on lesson/session/exercise
- [ ] Post comment on lesson
- [ ] Check dashboard stats update
- [ ] Admin: Access studio
- [ ] Admin: Create lesson
- [ ] Admin: Upload manual
- [ ] Logout and verify redirect

### API Testing (Postman/curl)
```bash
# Register
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json
{"email": "test@example.com", "password": "test123"}

# Login
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json
{"email": "test@example.com", "password": "test123"}

# Get levels (requires auth)
GET http://localhost:3000/api/v1/levels
Authorization: Bearer <token>
```

---

## 📦 Deployment Notes (Future)

### Production Checklist
- [ ] Use environment variables for secrets
- [ ] Switch to PostgreSQL/MySQL for production
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Enable HTTPS
- [ ] Set up file storage (S3, Azure Blob)
- [ ] Add rate limiting
- [ ] Set up logging (winston, morgan)
- [ ] Add monitoring (Sentry, Datadog)
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Set up CI/CD pipeline

---

**This document is a living reference for the TunEdu project.**
