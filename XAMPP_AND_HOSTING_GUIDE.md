# 🚀 XAMPP + HOSTING SETUP GUIDE

## Current Status ✅
- ✅ .env file created with XAMPP configuration
- ✅ Dependencies installed (frontend + backend)
- ✅ Project ready for hosting
- ⚠️ MySQL needs to be started

---

## 🔧 LOCAL DEVELOPMENT WITH XAMPP

### Step 1: Start XAMPP MySQL

1. **Open XAMPP Control Panel** (search "XAMPP" in Windows)
2. Click **"Start"** button next to **MySQL**
3. Wait until status shows **"Running"** (green background)

### Step 2: Create Database

**Option A: Using phpMyAdmin (Easiest)**
1. Open browser: http://localhost/phpmyadmin
2. Click **"New"** in left sidebar
3. Database name: `postly_db`
4. Click **"Create"**
5. Select `postly_db` database from left sidebar
6. Click **"Import"** tab at the top
7. Click **"Choose File"** 
8. Navigate to: `C:\Users\MostafaRamma_4uiuncw\Documents\Projects\Postly1\server\config\db-schema.sql`
9. Click **"Import"** at the bottom
10. You should see: "Import has been successfully finished"

**Option B: Using Command Line**
```bash
# Open PowerShell in project directory
cd C:\Users\MostafaRamma_4uiuncw\Documents\Projects\Postly1

# Import schema (using XAMPP MySQL)
C:\xampp\mysql\bin\mysql -u root -p < server\config\db-schema.sql
# Press Enter when asked for password (XAMPP default has no password)
```

### Step 3: Verify Database Created

1. Go to http://localhost/phpmyadmin
2. You should see `postly_db` in the left sidebar
3. Click it and verify these tables exist:
   - users
   - posts
   - comments
   - categories

### Step 4: Start Backend Server

```bash
# Terminal 1: Backend
cd C:\Users\MostafaRamma_4uiuncw\Documents\Projects\Postly1\server
npm start
```

**Expected output:**
```
✅ Database connected successfully
╔════════════════════════════════════════╗
║   Postly Backend Server                ║
║   Server running on port 5000          ║
╚════════════════════════════════════════╝
```

### Step 5: Start Frontend

```bash
# Terminal 2: Frontend (NEW terminal window)
cd C:\Users\MostafaRamma_4uiuncw\Documents\Projects\Postly1
npm start
```

Browser opens at: http://localhost:3000

### Step 6: Create Admin Account

```bash
# Terminal 3: Create admin (NEW terminal window)
cd C:\Users\MostafaRamma_4uiuncw\Documents\Projects\Postly1\server
npm run create-admin
```

Follow prompts to create admin user.

---

## 🌐 HOSTING DEPLOYMENT

Your project is **already configured for hosting**! Here's how the database connection works:

### How It Works

**LOCAL (XAMPP):**
```
Your .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=postly_db
```

**PRODUCTION (Railway):**
```
Railway environment variables (set in Railway dashboard):
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=abcd1234efgh5678
DB_NAME=railway
DB_PORT=6543
```

**The same code works for both!** The `database.js` file reads from environment variables.

### Deploy to Railway

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Railway:**
   - Go to https://railway.app
   - Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your Postly repository
   - Click "Deploy Now"

3. **Add MySQL Database:**
   - In Railway project, click "+ New"
   - Select "Database" → "Add MySQL"
   - Wait for provisioning

4. **Connect Backend to Database:**
   - Click on your backend service
   - Go to "Variables" tab
   - Click "Add Reference Variables"
   - Select MySQL database
   - Railway will auto-add: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, etc.

5. **Add Your Environment Variables:**
   - In backend service "Variables" tab
   - Add these (manually):
     ```
     NODE_ENV=production
     PORT=5000
     JWT_SECRET=<generate new one for production>
     FRONTEND_URL=<your frontend URL after deployment>
     ```

6. **Set Root Directory:**
   - Backend service → "Settings" tab
   - Root Directory: `server`
   - Start Command: `npm start` (auto-detected)

7. **Import Database Schema:**
   - In MySQL service, go to "Connect" tab
   - Get connection command or use Railway CLI:
   ```bash
   railway login
   railway link
   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < server/config/db-schema.sql
   ```

8. **Get Backend URL:**
   - Your backend will be at: `https://your-app.up.railway.app`
   - Test health: `https://your-app.up.railway.app/api/health`

9. **Deploy Frontend (Vercel):**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Framework: Create React App
   - Root Directory: `/`
   - Add environment variable:
     - `REACT_APP_API_URL` = `https://your-app.up.railway.app/api`
   - Deploy!

---

## 🔑 KEY DIFFERENCES

### XAMPP (Local):
- ✅ Free forever
- ✅ Easy to set up
- ✅ Full control
- ❌ Only accessible on your computer
- ❌ Must keep computer running
- ❌ No public URL

### Railway/Vercel (Hosting):
- ✅ Accessible from anywhere (public URL)
- ✅ Always online (24/7)
- ✅ Automatic deployments
- ✅ Free tier available
- ❌ Limited free resources
- ❌ Need to manage two platforms

---

## 🎯 YOUR CURRENT .ENV FILE

Located at: `server/.env`

```env
DB_HOST=localhost          # For XAMPP
DB_USER=root               # XAMPP default
DB_PASSWORD=               # Empty for XAMPP
DB_NAME=postly_db          # Your database
JWT_SECRET=<generated>     # Already set
FRONTEND_URL=http://localhost:3000
```

**For Railway hosting:**
- These values are OVERRIDDEN by Railway environment variables
- You don't need to change this file for deployment
- Railway injects its own DB credentials automatically

---

## 📝 NEXT STEPS

1. ✅ Start XAMPP MySQL
2. ✅ Create database using phpMyAdmin
3. ✅ Run backend: `cd server && npm start`
4. ✅ Run frontend: `npm start`
5. ✅ Create admin: `cd server && npm run create-admin`
6. ✅ Test locally at http://localhost:3000
7. ✅ Push to GitHub when ready
8. ✅ Deploy to Railway + Vercel

---

## ❓ TROUBLESHOOTING

**"Database connection failed"**
- Start MySQL in XAMPP Control Panel
- Check XAMPP MySQL is on port 3306
- Verify .env file has correct credentials

**"Port 5000 already in use"**
- Change PORT in .env to 5001
- Update REACT_APP_API_URL in frontend

**"Cannot connect to backend"**
- Make sure backend is running (Terminal 1)
- Check backend URL: http://localhost:5000/api/health
- Verify CORS is configured correctly

**Railway deployment fails**
- Check "Build Logs" in Railway
- Ensure `railway.json` exists (it does!)
- Verify environment variables are set
- Check database schema was imported
