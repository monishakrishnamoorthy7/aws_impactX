# Quick Reference Card

## 🚀 Start Everything

```bash
# Terminal 1 - Backend
cd health/server
npm start

# Terminal 2 - Frontend  
cd health
npm run dev
```

## 🔑 Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in → Create API Key
3. Copy to `health/server/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health
- **Sample Response:** http://localhost:3001/api/sample-response

## 📋 Test Flow

1. Open http://localhost:5173
2. Click "Get Started - Patient Login"
3. Click "Start Health Assessment"
4. Fill form with sample data:
   - Symptoms: "fatigue, excessive thirst"
   - Duration: "1 month"
   - Diet: "High-sugar diet"
   - Sleep: "Poor" quality, "Less than 5 hours"
   - Medical History: Check "Diabetes"
   - Location: "New York"
   - Consent: Check box
5. Click "Analyze Health Risk with AI"
6. View AI results

## 🔒 Privacy Architecture

```
Raw Data → RAG Abstraction → Gemini API → Results
(Frontend)  (Backend)         (External)   (Frontend)
           ↓
    NO PII SENT TO GEMINI
```

## 📁 Key Files

```
health/
├── server/
│   ├── server.js              # API server
│   ├── ragProcessor.js        # Privacy layer
│   ├── geminiService.js       # AI integration
│   └── knowledgeBase.json     # Medical data
└── src/components/
    ├── PatientUpload.jsx      # Form + API call
    └── AIResultDashboard.jsx  # Display results
```

## 🎯 API Endpoint

```javascript
POST http://localhost:3001/api/analyze-health
Content-Type: application/json

{
  "symptoms": "fatigue, thirst",
  "symptomDuration": "1-month",
  "dietPattern": "High-sugar diet",
  "sleepQuality": "Poor",
  "medicalHistory": ["Diabetes"]
}
```

## 📊 Response Structure

```json
{
  "success": true,
  "analysis": {
    "risk_level": "medium",
    "risk_score": 65,
    "explanation": "...",
    "key_findings": [...],
    "possible_conditions": [...],
    "recommended_actions": [...],
    "disclaimer": "Not a medical diagnosis"
  },
  "hospital_assignment": {...},
  "metadata": {
    "privacy_note": "No raw personal data sent to AI"
  }
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check port 3001 is free |
| Gemini errors | Verify API key in `.env` |
| CORS errors | Ensure backend running first |
| Frontend can't connect | Check backend URL in code |
| No results | Check browser console logs |

## ✅ Demo Checklist

- [ ] Backend running (port 3001)
- [ ] Frontend running (port 5173)
- [ ] Gemini API key configured
- [ ] Health check returns "healthy"
- [ ] Sample response works
- [ ] Form submits successfully
- [ ] Results display correctly
- [ ] Privacy notice visible
- [ ] Disclaimer shown

## 🎤 Presentation Points

1. **Privacy-First:** RAG abstracts PII before Gemini
2. **AI-Powered:** Real Gemini API integration
3. **Robust:** Fallback mode if API fails
4. **Clear Disclaimers:** Not a diagnosis
5. **Complete Flow:** Patient → AI → Hospital

## 📞 Quick Commands

```bash
# Check backend health
curl http://localhost:3001/api/health

# Test sample response
curl http://localhost:3001/api/sample-response

# Stop servers
Ctrl+C in each terminal

# View backend logs
# Just watch Terminal 1

# Reinstall dependencies
cd health/server && npm install
cd health && npm install
```

## 🔧 Quick Fixes

**Backend not starting:**
```bash
cd health/server
rm -rf node_modules
npm install
npm start
```

**Frontend not connecting:**
```javascript
// Check PatientUpload.jsx line ~100
const response = await fetch('http://localhost:3001/api/analyze-health', {
  // Verify this URL matches your backend
});
```

**Gemini not working:**
- System uses fallback mode automatically
- Check `.env` file exists
- Verify API key is valid
- Check internet connection

## 📚 Documentation

- **Full Guide:** `INTEGRATION_GUIDE.md`
- **Backend Docs:** `server/README.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`
- **This Card:** `QUICK_REFERENCE.md`

---

**Ready to demo! 🎉**

Backend: ✅ | Frontend: ✅ | Integration: ✅ | Privacy: ✅
