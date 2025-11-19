# 🔌 TunEdu API Documentation

**Base URL**: `http://localhost:3000/api/v1`

All endpoints return JSON in this format:
```json
{
  "data": <result> | null,
  "error": <error_message> | null
}
```

---

## 🔐 Authentication Endpoints

### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "student123",
  "firstName": "John",      // optional
  "lastName": "Doe"         // optional
}
```

**Response** (201 Created):
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT"
    }
  },
  "error": null
}
```

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "student123"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT"
    }
  },
  "error": null
}
```

---

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  },
  "error": null
}
```

---

### Logout
```http
POST /auth/logout
```

**Response** (200 OK):
```json
{
  "data": { "message": "Logged out successfully" },
  "error": null
}
```

*Note: Token clearing is handled on the frontend*

---

## 📚 Browse Endpoints

### Get All Levels
```http
GET /levels
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Primaire",
      "slug": "primaire",
      "order": 1,
      "year_count": 3
    },
    {
      "id": 2,
      "name": "Collège",
      "slug": "college",
      "order": 2,
      "year_count": 3
    }
  ],
  "error": null
}
```

---

### Get Years for a Level
```http
GET /levels/:slug/years
Authorization: Bearer <token>
```

**Example**: `GET /levels/primaire/years`

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "1ère année",
      "slug": "primaire-1",
      "order": 1
    },
    {
      "id": 2,
      "name": "2ème année",
      "slug": "primaire-2",
      "order": 2
    }
  ],
  "error": null
}
```

---

### Get Subjects for a Year
```http
GET /years/:slug/subjects
Authorization: Bearer <token>
```

**Example**: `GET /years/primaire-3/subjects`

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Mathématiques",
      "slug": "mathematiques-p3",
      "description": "Cours de mathématiques pour la 3ème année primaire",
      "manual_path": "sample-manual.pdf",
      "manual_url": "/uploads/sample-manual.pdf",
      "thumbnail_url": null
    }
  ],
  "error": null
}
```

---

## 📖 Subject Endpoints

### Get Subject Details
```http
GET /subjects/:slug
Authorization: Bearer <token>
```

**Example**: `GET /subjects/mathematiques-p3`

**Response**:
```json
{
  "data": {
    "id": 1,
    "name": "Mathématiques",
    "slug": "mathematiques-p3",
    "description": "Cours de mathématiques pour la 3ème année primaire",
    "manual_path": "sample-manual.pdf",
    "manual_url": "/uploads/sample-manual.pdf",
    "thumbnail_url": null,
    "class_year_name": "3ème année",
    "class_year_slug": "primaire-3",
    "level_name": "Primaire",
    "level_slug": "primaire",
    "lessons": [
      {
        "id": 1,
        "title": "Les nombres jusqu'à 100",
        "slug": "les-nombres-100",
        "summary": "Apprendre à compter et écrire les nombres jusqu'à 100",
        "order": 1,
        "score": 5
      }
    ]
  },
  "error": null
}
```

---

### Upload Manual (Admin Only)
```http
POST /subjects/:slug/manual
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  manual: <file>
```

**Response**:
```json
{
  "data": {
    "manual_url": "/uploads/1704123456789-manual.pdf"
  },
  "error": null
}
```

---

### Create Lesson (Admin Only)
```http
POST /subjects/:slug/lessons
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Les nombres jusqu'à 100",
  "summary": "Apprendre à compter et écrire les nombres",
  "order": 1
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": 1,
    "title": "Les nombres jusqu'à 100",
    "slug": "les-nombres-100-1704123456",
    "summary": "Apprendre à compter et écrire les nombres",
    "order": 1
  },
  "error": null
}
```

---

## 🎥 Lesson Endpoints

### Get Lesson Details
```http
GET /lessons/:slug
Authorization: Bearer <token>
```

**Example**: `GET /lessons/les-nombres-100`

**Response**:
```json
{
  "data": {
    "id": 1,
    "title": "Les nombres jusqu'à 100",
    "slug": "les-nombres-100",
    "summary": "Apprendre à compter et écrire les nombres jusqu'à 100",
    "score": 5,
    "subject_name": "Mathématiques",
    "subject_slug": "mathematiques-p3",
    "sessions": [
      {
        "id": 1,
        "title": "Introduction aux nombres",
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "duration_seconds": 600,
        "score": 2
      }
    ],
    "exercises": [
      {
        "id": 1,
        "title": "Exercice 1: Compter jusqu'à 100",
        "description": "Pratiquez le comptage des nombres",
        "difficulty": "EASY",
        "score": 1,
        "file_url": null
      }
    ]
  },
  "error": null
}
```

---

### Create Session (Admin Only)
```http
POST /lessons/:slug/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction aux nombres",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "durationSeconds": 600
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": 1,
    "title": "Introduction aux nombres",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "durationSeconds": 600
  },
  "error": null
}
```

---

### Create Exercise (Admin Only)
```http
POST /lessons/:slug/exercises
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  title: "Exercice 1: Compter jusqu'à 100"
  description: "Pratiquez le comptage"
  difficulty: "EASY"
  file: <file>  // optional
```

**Response** (201 Created):
```json
{
  "data": {
    "id": 1,
    "title": "Exercice 1: Compter jusqu'à 100",
    "description": "Pratiquez le comptage",
    "difficulty": "EASY",
    "fileUrl": "/uploads/exercises/1704123456789-exercise.pdf"
  },
  "error": null
}
```

---

## 👍 Interaction Endpoints

### Vote
```http
POST /vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetType": "lesson",    // lesson|session|exercise
  "targetId": 1,
  "value": 1                  // 1 or -1
}
```

**Response**:
```json
{
  "data": { "success": true },
  "error": null
}
```

---

### Get Comments
```http
GET /comments?targetType=lesson&targetId=1
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "body": "Très bonne leçon !",
      "parent_id": null,
      "created_at": "2025-01-01T12:00:00.000Z",
      "user_id": 1,
      "user_email": "student@example.com",
      "user_first_name": "John",
      "user_last_name": "Doe"
    }
  ],
  "error": null
}
```

---

### Create Comment
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetType": "lesson",
  "targetId": 1,
  "body": "Très bonne leçon !",
  "parentId": null          // optional, for replies
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": 1,
    "body": "Très bonne leçon !",
    "parent_id": null,
    "created_at": "2025-01-01T12:00:00.000Z",
    "user_id": 1,
    "user_email": "student@example.com",
    "user_first_name": "John",
    "user_last_name": "Doe"
  },
  "error": null
}
```

---

### Delete Comment
```http
DELETE /comments/:id
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": { "success": true },
  "error": null
}
```

---

## 📊 Activity Endpoints

### Record Activity
```http
POST /activity
Authorization: Bearer <token>
Content-Type: application/json

{
  "kind": "TIME_TICK",       // TIME_TICK|PAGE_VIEW|VIDEO_OPEN|EXERCISE_OPEN|LOGIN
  "targetType": "lesson",    // optional
  "targetId": 1,             // optional
  "valueInt": 15             // optional, for TIME_TICK
}
```

**Response**:
```json
{
  "data": { "success": true },
  "error": null
}
```

---

### Get Dashboard Stats
```http
GET /activity/dashboard/me
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": {
    "timeToday": 450,          // seconds
    "timeWeek": 3600,          // seconds
    "lessonsViewed": 5,
    "exercisesOpened": 3
  },
  "error": null
}
```

---

## 🤖 AI Assistant Endpoints

### Ask Question (Placeholder)
```http
POST /assistant/ask
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjectSlug": "mathematiques-p3",
  "question": "Comment calculer 5 + 3 ?"
}
```

**Response**:
```json
{
  "data": {
    "answer": "Fonctionnalité à venir. Je me base sur le manuel pour répondre à vos questions sur le programme tunisien. Cette fonctionnalité d'assistant IA sera bientôt disponible pour vous aider dans vos études.",
    "citations": [],
    "timestamp": "2025-01-01T12:00:00.000Z"
  },
  "error": null
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "data": null,
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "data": null,
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "data": null,
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "data": null,
  "error": "Subject not found"
}
```

### 500 Internal Server Error
```json
{
  "data": null,
  "error": "Internal server error"
}
```

---

## 📝 Notes

1. **Authorization**: All endpoints (except auth) require `Authorization: Bearer <token>` header
2. **Admin Endpoints**: Create/Upload operations require admin role (ADMIN or TEACHER)
3. **File Uploads**: Use `multipart/form-data` with FormData
4. **Slugs**: Used for clean URLs (e.g., `mathematiques-p3` instead of ID)
5. **Dates**: ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`)
6. **Score**: Integer representing net votes (upvotes - downvotes)

---

**Last Updated**: November 2025
