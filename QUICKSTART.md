# 🚀 TunEdu - Quick Start Guide

## Step-by-Step Setup (5 minutes)

### 1️⃣ Backend Setup

Open PowerShell in the project root and run:

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Seed the database with demo data
npm run seed

# Start the backend server
npm run dev
```

✅ Backend should now be running on **http://localhost:3000**

You should see:
```
✅ Database initialized successfully
🚀 TunEdu Backend running on http://localhost:3000
📁 Uploads directory: d:\igl1\TunEdu Ongular\backend\uploads
```

---

### 2️⃣ Frontend Setup

Open a **NEW PowerShell window** and run:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Angular dev server
npm start
```

✅ Frontend should now be running on **http://localhost:4200**

---

### 3️⃣ Access the Application

Open your browser and go to: **http://localhost:4200**

---

## 🧪 Test Accounts

### Student Account
- **Email:** student@example.com
- **Password:** student123

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123

---

## 🎯 What to Try

1. **Login** with student account
2. Click **"Explorer"** in the header
3. Select **Primaire** → **3ème année** → **Mathématiques**
4. Click on the first lesson: **"Les nombres jusqu'à 100"**
5. Try the **vote buttons** (👍 👎)
6. Add a **comment**
7. Go back to **Dashboard** to see your stats updating

### Admin Features
1. **Logout** and login with admin account
2. Click **"Studio"** in the header
3. Explore the admin panel (create lesson, add videos, etc.)

---

## 🐛 Troubleshooting

### Port Already in Use
If you see "Port 3000 is already in use":
```powershell
# Find and kill the process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Module Not Found
```powershell
# Reinstall dependencies
rm -r node_modules
npm install
```

### Cannot Connect to Backend
Make sure:
- Backend is running on port 3000
- Frontend `environment.ts` has correct URL: `http://localhost:3000/api/v1`

---

## 📞 Need Help?

Check the main **README.md** for:
- Full API documentation
- Architecture details
- Database schema
- Troubleshooting guide

---

**Happy coding! 🎓📚**
