# Quick Start Guide

## Start Both Servers

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd health/server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd health
npm run dev
```

### Option 2: Windows Batch Script

Create `start-all.bat` in the `health` folder:
```batch
@echo off
echo Starting Smart Health Sentinel AI...
echo.

start "Backend Server" cmd /k "cd server && npm start"
timeout /t 3
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
```

Then run:
```bash
start-all.bat
```

## First Time Setup

### 1. Get Gemini API Key (Free)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### 2. Configure Backend

```bash
cd health/server
cp .env.example .env
```

Edit `.env` and paste your API key:
```
GEMINI_API_KEY=AIzaSy...your_key_here
PORT=3001
```

### 3. Install Dependencies (if not done)

**Backend:**
```bash
cd health/server
npm install
```

**Frontend:**
```bash
cd health
npm install
```

## Verify Everything Works

### 1. Check Backend Health
Open browser: http://localhost:3001/api/health

Should see:
```json
{
  "status": "healthy",
  "services": {
    "rag": "active",
    "gemini": "active"
  }
}
```

### 2. Test Sample Response
Open browser: http://localhost:3001/api/sample-response

Should see a complete analysis response.

### 3. Test Frontend
Open browser: http://localhost:5173

Should see the landing page.

## Test Complete Flow

1. Click "Get Started - Patient Login"
2. Click "Start Health Assessment"
3. Fill the form:
   - **Symptoms:** "fatigue, excessive thirst, frequent urination"
   - **Duration:** "1 month"
   - **Diet:** "High-sugar diet"
   - **Sleep Quality:** "Poor"
   - **Sleep Duration:** "Less than 5 hours"
   - **Medical History:** Check "Diabetes"
   - **Location:** "New York"
   - **Consent:** Check the box
4. Click "Analyze Health Risk with AI"
5. Wait for AI analysis (3-5 seconds)
6. View results with AI explanation

## Troubleshooting

### Backend won't start
- Check if port 3001 is in use
- Verify `.env` file exists
- Check Gemini API key is valid

### Frontend can't connect
- Ensure backend is running first
- Check console for CORS errors
- Verify backend URL in PatientUpload.jsx

### Gemini errors
- Verify API key is correct
- Check internet connection
- System will use fallback mode if Gemini fails

## Stop Servers

Press `Ctrl+C` in each terminal window.

## Production URLs

- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173
- **API Docs:** http://localhost:3001/api/health

---

**Ready to demo!** 🚀
