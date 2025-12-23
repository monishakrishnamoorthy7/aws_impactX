# RAG + Gemini Integration Guide

Complete guide for integrating privacy-preserving RAG and Google Gemini API into Smart Health Sentinel AI.

## Overview

This integration adds AI-powered health risk analysis while maintaining strict privacy standards:

- **RAG Layer:** Abstracts raw patient data into medical indicators
- **Gemini API:** Generates calm, informative health guidance
- **Privacy-First:** No personal data sent to external APIs

## Architecture Flow

```
┌─────────────────┐
│ PatientUpload   │ User fills 8-step health form
│   (Frontend)    │
└────────┬────────┘
         │ POST /api/analyze-health
         ↓
┌─────────────────┐
│  Express API    │ Receives structured patient data
│   (Backend)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ RAG Processor   │ Abstracts data:
│                 │ • Symptoms → patterns
│                 │ • Diet → risk factors
│                 │ • History → indicators
│                 │ • NO PII included
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Gemini Service  │ Generates:
│                 │ • Risk explanation
│                 │ • Key findings
│                 │ • Recommendations
│                 │ • Reassurance
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ AIResultDash    │ Displays:
│   (Frontend)    │ • Risk level & score
│                 │ • AI explanation
│                 │ • Hospital assignment
│                 │ • Privacy notice
└─────────────────┘
```

## Setup Instructions

### Step 1: Backend Setup

```bash
# Navigate to server directory
cd health/server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your Gemini API key
# Get key from: https://makersuite.google.com/app/apikey
```

Your `.env` file should look like:
```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
PORT=3001
```

### Step 2: Start Backend Server

```bash
# From health/server directory
npm start

# Or for development with auto-reload
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║  Smart Health Sentinel AI - Backend Server                ║
║  Privacy-Preserving RAG + Gemini Integration              ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:3001                  ║
║  Status: ✓ Gemini Active                                   ║
╚════════════════════════════════════════════════════════════╝
```

### Step 3: Start Frontend

```bash
# From health directory (in a new terminal)
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 4: Test the Integration

1. Open browser to `http://localhost:5173`
2. Click "Get Started - Patient Login"
3. Navigate to "Start Health Assessment"
4. Fill out the 8-step form:
   - **Step 1:** Symptoms (e.g., "fatigue, excessive thirst")
   - **Step 2:** Diet (select "High-sugar diet")
   - **Step 3:** Sleep (select "Poor" quality)
   - **Step 4:** Upload files (any PDF/image)
   - **Step 5:** Medical history (check "Diabetes")
   - **Step 6:** Location (enter city)
   - **Step 7:** Review climate info
   - **Step 8:** Accept consent
5. Click "Analyze Health Risk with AI"
6. View AI-generated results

## Key Files Modified/Created

### Backend Files (New)
```
health/server/
├── server.js              # Express API server
├── ragProcessor.js        # Privacy-preserving data abstraction
├── geminiService.js       # Gemini API integration
├── knowledgeBase.json     # Medical reference data
├── package.json           # Dependencies
├── .env.example           # Environment template
└── README.md              # Backend documentation
```

### Frontend Files (Modified)
```
health/src/components/
├── PatientUpload.jsx      # Updated: API call to backend
└── AIResultDashboard.jsx  # Updated: Display backend results
```

## API Request/Response Examples

### Request to Backend

```javascript
// From PatientUpload.jsx
const response = await fetch('http://localhost:3001/api/analyze-health', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    symptoms: "fatigue, excessive thirst, frequent urination",
    symptomDuration: "1-month",
    dietPattern: "High-sugar diet",
    frequentOutsideFood: true,
    sleepDuration: "less-than-5",
    sleepQuality: "Poor",
    nightShifts: false,
    medicalHistory: ["Diabetes"],
    city: "New York"
  })
});
```

### Response from Backend

```json
{
  "success": true,
  "analysis": {
    "risk_level": "medium",
    "risk_score": 65,
    "explanation": "Based on the health indicators analyzed, several factors suggest a moderate level of health risk. The combination of lifestyle patterns and symptom indicators warrants professional medical attention. Early intervention and lifestyle modifications can significantly improve health outcomes.",
    "key_findings": [
      "Elevated blood sugar indicators detected",
      "Sleep quality and duration below optimal levels",
      "Dietary patterns show high sugar intake"
    ],
    "possible_conditions": [
      {
        "name": "Type 2 Diabetes",
        "probability": 68,
        "sources": ["symptom_analysis", "lifestyle_analysis"]
      },
      {
        "name": "Metabolic Syndrome",
        "probability": 52,
        "sources": ["lifestyle_analysis", "medical_history"]
      }
    ],
    "recommended_actions": [
      "Schedule a consultation with an endocrinologist",
      "Get comprehensive blood work including HbA1c and fasting glucose",
      "Begin monitoring blood sugar levels regularly",
      "Implement dietary changes to reduce sugar intake",
      "Improve sleep hygiene and aim for 7-8 hours nightly"
    ],
    "reassurance": "Remember, identifying health risks early is a positive step. With proper medical guidance and lifestyle adjustments, many conditions can be effectively managed or prevented.",
    "disclaimer": "This is a health risk analysis based on abstracted indicators, not a medical diagnosis. Please consult qualified healthcare professionals for proper medical advice and treatment."
  },
  "hospital_assignment": {
    "name": "Metro Medical Center",
    "department": "Endocrinology",
    "doctor": "Dr. Michael Chen",
    "priority": "standard",
    "appointmentDate": "2024-01-20",
    "appointmentTime": "10:30 AM",
    "address": "123 Medical Center Drive, Downtown"
  },
  "metadata": {
    "analysis_timestamp": "2024-01-15T10:30:00.000Z",
    "privacy_note": "No raw personal data was sent to external AI services"
  }
}
```

## Privacy Guarantees

### What RAG Processor Does

**Input (Raw Patient Data):**
```json
{
  "symptoms": "I have been feeling very tired and thirsty for the past month",
  "name": "John Doe",
  "age": 45
}
```

**Output (Abstracted Indicators):**
```json
{
  "medical_indicators": [
    {
      "indicator": "elevated_blood_sugar_suspected",
      "severity": "medium"
    }
  ],
  "symptom_profile": {
    "patterns": ["fatigue_chronic", "excessive_thirst"],
    "duration_category": "1-month"
  }
}
```

**Sent to Gemini:** Only the abstracted output (no names, no raw text)

### Privacy Checklist

- ✅ Patient names: **Never sent to Gemini**
- ✅ Raw symptom text: **Abstracted to patterns**
- ✅ Medical reports: **Processed locally, not uploaded**
- ✅ Location: **Converted to climate category**
- ✅ Age/Gender: **Not included in Gemini prompt**
- ✅ Contact info: **Never collected or sent**

## Customization

### Modify Risk Calculation

Edit `health/server/ragProcessor.js`:

```javascript
calculateRiskScore(abstracted) {
  const weights = {
    medical_indicators: 0.30,    // Adjust these weights
    symptom_profile: 0.25,
    lifestyle_risk_profile: 0.20,
    medical_history_risk: 0.20,
    climate_risk: 0.05
  };
  // ... calculation logic
}
```

### Add New Medical Conditions

Edit `health/server/knowledgeBase.json`:

```json
{
  "symptomRiskRules": {
    "your_new_symptom": {
      "conditions": ["condition1", "condition2"],
      "risk_multiplier": 1.5
    }
  }
}
```

### Customize Gemini Prompt

Edit `health/server/geminiService.js`:

```javascript
buildPrompt(ragOutput) {
  const prompt = `
    You are a health risk analysis assistant...
    
    [Modify instructions here]
    
    IMPORTANT GUIDELINES:
    - Your custom guideline 1
    - Your custom guideline 2
  `;
  return prompt;
}
```

### Change Hospital Assignment Logic

Edit `health/server/server.js`:

```javascript
function generateHospitalAssignment(riskLevel, possibleConditions) {
  // Customize hospital selection logic
  const hospitals = {
    high: { name: 'Your Hospital', department: 'Your Dept' },
    // ...
  };
}
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is available
netstat -ano | findstr :3001

# Try different port in .env
PORT=3002
```

### Frontend can't connect to backend
```javascript
// Update API URL in PatientUpload.jsx if needed
const response = await fetch('http://localhost:3001/api/analyze-health', {
  // ...
});
```

### Gemini API errors
```bash
# Check API key is valid
curl https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_KEY

# Server will use fallback mode if Gemini fails
# Check server logs for details
```

### CORS errors
```javascript
// In server.js, update CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

## Production Deployment

### Backend Deployment (e.g., Railway, Render, Heroku)

1. Set environment variables:
   ```
   GEMINI_API_KEY=your_key
   PORT=3001
   NODE_ENV=production
   ```

2. Update CORS in `server.js`:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

3. Deploy backend

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update API URL in `PatientUpload.jsx`:
   ```javascript
   const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
   const response = await fetch(`${API_URL}/api/analyze-health`, {
     // ...
   });
   ```

2. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

3. Deploy frontend

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Sample response works: `GET /api/sample-response`
- [ ] Frontend connects to backend
- [ ] Patient upload form submits successfully
- [ ] AI results display correctly
- [ ] Privacy notice is visible
- [ ] Disclaimer is clearly shown
- [ ] Hospital assignment appears
- [ ] Risk level matches score
- [ ] Possible conditions list correctly

## Demo Script

For hackathon presentation:

1. **Show Privacy Architecture** (30 sec)
   - Explain RAG abstraction layer
   - Highlight "No PII to Gemini" guarantee

2. **Live Demo** (2 min)
   - Fill patient form with sample data
   - Click "Analyze with AI"
   - Show loading state
   - Display results with explanation

3. **Show Backend Logs** (30 sec)
   - Point out abstraction step
   - Show Gemini API call
   - Highlight privacy note in response

4. **Explain Fallback** (30 sec)
   - Demonstrate system works without Gemini
   - Show graceful degradation

## Next Steps

### Enhancements
- [ ] Add file parsing for actual lab reports (OCR)
- [ ] Integrate real weather API for climate data
- [ ] Add user authentication
- [ ] Store analysis history in database
- [ ] Implement caching for repeated queries
- [ ] Add rate limiting
- [ ] Create admin dashboard for monitoring
- [ ] Add multi-language support

### Advanced Features
- [ ] Real-time symptom tracking
- [ ] Medication interaction checking
- [ ] Appointment scheduling integration
- [ ] Telemedicine video consultation
- [ ] Wearable device integration
- [ ] Family health history analysis

## Resources

- **Gemini API Docs:** https://ai.google.dev/docs
- **RAG Pattern:** https://www.promptingguide.ai/techniques/rag
- **Medical Reference Ranges:** WHO Guidelines
- **Privacy Best Practices:** HIPAA Compliance Guide

## Support

Questions? Check:
1. Backend README: `health/server/README.md`
2. Server logs for detailed errors
3. Test with sample endpoint first
4. Verify environment variables

---

**Built for AWS ImpactX Hackathon**
Privacy-First • AI-Powered • Healthcare Innovation
