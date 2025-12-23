# Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SMART HEALTH SENTINEL AI                         │
│              Privacy-Preserving RAG + Gemini Integration            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   FRONTEND      │
│  React + Vite   │
│  Port: 5173     │
└────────┬────────┘
         │
         │ HTTP POST /api/analyze-health
         │ {symptoms, diet, sleep, history, ...}
         │
         ↓
┌─────────────────┐
│   BACKEND       │
│  Express API    │
│  Port: 3001     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  RAG PROCESSOR  │
│  Privacy Layer  │
└────────┬────────┘
         │
         │ Abstracted Data Only
         │ {indicators, patterns, risk_scores}
         │ NO PII!
         │
         ↓
┌─────────────────┐
│ GEMINI SERVICE  │
│  AI Analysis    │
└────────┬────────┘
         │
         │ API Call
         │
         ↓
┌─────────────────┐
│  GOOGLE GEMINI  │
│   External API  │
└────────┬────────┘
         │
         │ AI Explanation
         │
         ↓
┌─────────────────┐
│   RESPONSE      │
│  Structured     │
│  JSON Result    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  AI RESULTS     │
│   Dashboard     │
└─────────────────┘
```

## Privacy-Preserving Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: PATIENT INPUT (Frontend)                                │
├──────────────────────────────────────────────────────────────────┤
│  Raw Personal Data:                                              │
│  • Name: "John Doe"                                             │
│  • Age: 45                                                       │
│  • Symptoms: "I feel very tired and thirsty all the time"      │
│  • Diet: "I eat a lot of sweets and fast food"                 │
│  • Sleep: "I sleep only 4-5 hours per night"                   │
│  • Medical History: "My father had diabetes"                    │
│  • Lab Reports: [blood_test.pdf, xray.jpg]                     │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 2: RAG ABSTRACTION (Backend)                              │
├──────────────────────────────────────────────────────────────────┤
│  Abstracted Indicators:                                          │
│  • medical_indicators: ["elevated_blood_sugar_suspected"]       │
│  • symptom_patterns: ["fatigue_chronic", "excessive_thirst"]   │
│  • lifestyle_risks: ["high_sugar_diet", "sleep_deprivation"]   │
│  • medical_history_risk: ["diabetes_family_history"]           │
│  • risk_score: 65                                               │
│  • risk_level: "medium"                                         │
│                                                                  │
│  ⚠️ NO NAMES, NO RAW TEXT, NO PERSONAL DATA                     │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 3: GEMINI PROMPT (Backend)                                │
├──────────────────────────────────────────────────────────────────┤
│  Prompt to Gemini:                                               │
│  "Analyze these ABSTRACTED health indicators:                   │
│   - Risk Level: MEDIUM                                          │
│   - Risk Score: 65/100                                          │
│   - Indicators: elevated_blood_sugar_suspected                  │
│   - Patterns: fatigue_chronic, excessive_thirst                 │
│   - Lifestyle: high_sugar_diet, sleep_deprivation               │
│                                                                  │
│   Provide calm, non-alarming risk analysis.                     │
│   DO NOT diagnose. Focus on risk factors."                      │
│                                                                  │
│  ✅ ONLY ABSTRACTED DATA SENT TO GEMINI                         │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 4: GEMINI RESPONSE (External API)                         │
├──────────────────────────────────────────────────────────────────┤
│  AI-Generated Explanation:                                       │
│  "Based on the health indicators analyzed, several factors      │
│   suggest a moderate level of health risk. The combination      │
│   of lifestyle patterns and symptom indicators warrants         │
│   professional medical attention. Early intervention and        │
│   lifestyle modifications can significantly improve health      │
│   outcomes."                                                     │
│                                                                  │
│  Key Findings:                                                   │
│  • Elevated blood sugar indicators detected                     │
│  • Sleep quality and duration below optimal levels              │
│  • Dietary patterns show high sugar intake                      │
│                                                                  │
│  Recommended Actions:                                            │
│  • Schedule consultation with endocrinologist                   │
│  • Get comprehensive blood work                                 │
│  • Implement dietary changes                                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 5: STRUCTURED RESPONSE (Backend)                          │
├──────────────────────────────────────────────────────────────────┤
│  {                                                               │
│    "success": true,                                             │
│    "analysis": {                                                │
│      "risk_level": "medium",                                    │
│      "risk_score": 65,                                          │
│      "explanation": "...",                                      │
│      "key_findings": [...],                                     │
│      "possible_conditions": [                                   │
│        {                                                        │
│          "name": "Type 2 Diabetes",                            │
│          "probability": 68,                                     │
│          "sources": ["symptom_analysis", "lifestyle"]          │
│        }                                                        │
│      ],                                                         │
│      "recommended_actions": [...],                              │
│      "disclaimer": "Not a medical diagnosis"                    │
│    },                                                           │
│    "hospital_assignment": {...},                                │
│    "metadata": {                                                │
│      "privacy_note": "No raw personal data sent to AI"         │
│    }                                                            │
│  }                                                              │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 6: DISPLAY RESULTS (Frontend)                             │
├──────────────────────────────────────────────────────────────────┤
│  AI Results Dashboard:                                           │
│  • Risk Level: MEDIUM (Yellow badge)                            │
│  • Risk Score: 65/100                                           │
│  • AI Explanation (calm, informative)                           │
│  • Key Findings (bullet list)                                   │
│  • Possible Conditions (with probabilities)                     │
│  • Recommended Actions (actionable steps)                       │
│  • Hospital Assignment (auto-assigned)                          │
│  • Disclaimer: "Not a Medical Diagnosis" (prominent)            │
│  • Privacy Notice: "No raw data sent to AI" (visible)          │
└──────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND MODULES                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   server.js      │  Express API Server
│                  │  • Routes: /api/health, /api/analyze-health
│                  │  • CORS configuration
│                  │  • Error handling
│                  │  • Hospital assignment logic
└────────┬─────────┘
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ↓                                             ↓
┌──────────────────┐                        ┌──────────────────┐
│ ragProcessor.js  │                        │ geminiService.js │
│                  │                        │                  │
│ • processData()  │                        │ • generateAI()   │
│ • extractInd()   │                        │ • buildPrompt()  │
│ • analyzeSym()   │                        │ • parseResp()    │
│ • assessLife()   │                        │ • fallback()     │
│ • calcRisk()     │                        │                  │
└────────┬─────────┘                        └────────┬─────────┘
         │                                           │
         ↓                                           ↓
┌──────────────────┐                        ┌──────────────────┐
│ knowledgeBase    │                        │  Gemini API      │
│     .json        │                        │  (External)      │
│                  │                        │                  │
│ • Medical ranges │                        │ • AI generation  │
│ • Symptom rules  │                        │ • Text analysis  │
│ • Lifestyle data │                        │                  │
│ • History risks  │                        │                  │
└──────────────────┘                        └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPONENTS                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  LandingPage     │  Entry point
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ PatientDashboard │  Main hub
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ PatientUpload    │  8-step form
│                  │  • Symptoms
│                  │  • Diet
│                  │  • Sleep
│                  │  • Reports
│                  │  • History
│                  │  • Location
│                  │  • Climate
│                  │  • Consent
│                  │
│  [Analyze] ──────┼──→ POST /api/analyze-health
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ AIResultDash     │  Display results
│                  │  • Risk level
│                  │  • AI explanation
│                  │  • Key findings
│                  │  • Conditions
│                  │  • Actions
│                  │  • Hospital
│                  │  • Disclaimer
│                  │  • Privacy note
└──────────────────┘
```

## Risk Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    RISK SCORING ALGORITHM                        │
└─────────────────────────────────────────────────────────────────┘

Input Data
    │
    ├─→ Medical Indicators (30% weight)
    │   • Lab value analysis
    │   • Indicator severity
    │   • Reference range comparison
    │   → Score: 0-100
    │
    ├─→ Symptom Profile (25% weight)
    │   • Pattern matching
    │   • Duration multiplier
    │   • Risk multipliers
    │   → Score: 0-100
    │
    ├─→ Lifestyle Risks (20% weight)
    │   • Diet assessment
    │   • Sleep quality
    │   • Exercise habits
    │   → Score: 0-100
    │
    ├─→ Medical History (20% weight)
    │   • Past conditions
    │   • Family history
    │   • Related risks
    │   → Score: 0-100
    │
    └─→ Climate Factors (5% weight)
        • Temperature
        • Humidity
        • Air quality
        → Score: 0-100

                ↓
        Weighted Average
                ↓
        Overall Risk Score (0-100)
                ↓
        ┌───────────────────┐
        │ Risk              │
        │ Classification    │
        ├───────────────────┤
        │ 0-34:   LOW       │
        │ 35-64:  MEDIUM    │
        │ 65-100: HIGH      │
        └───────────────────┘
```

## Security & Privacy Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Frontend
    • Input validation
    • Client-side sanitization
    • HTTPS (production)
    • No sensitive data in localStorage

Layer 2: API Gateway
    • CORS protection
    • Rate limiting (production)
    • Request validation
    • Error handling

Layer 3: RAG Processor (PRIVACY LAYER)
    • Data abstraction
    • PII removal
    • Pattern extraction
    • Indicator generation
    ⚠️ CRITICAL: No raw data passes this layer

Layer 4: Gemini Service
    • Prompt sanitization
    • Response validation
    • Fallback mechanism
    • API key security

Layer 5: External API
    • Receives ONLY abstracted data
    • No access to personal information
    • Encrypted communication
    • Rate limited

Layer 6: Response Processing
    • Output sanitization
    • Structured formatting
    • Disclaimer injection
    • Privacy notice addition
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                         │
└─────────────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
    • Static hosting
    • CDN distribution
    • HTTPS enabled
    • Environment variables
    URL: https://health-sentinel.vercel.app

Backend (Railway/Render/Heroku)
    • Node.js runtime
    • Environment variables
    • Auto-scaling
    • Health monitoring
    URL: https://health-sentinel-api.railway.app

Database (Future)
    • PostgreSQL/MongoDB
    • Encrypted at rest
    • Backup enabled
    • HIPAA compliant

External Services
    • Google Gemini API
    • Weather API (future)
    • SMS/Email notifications (future)

Monitoring
    • Error tracking (Sentry)
    • Performance monitoring
    • API usage tracking
    • Uptime monitoring
```

## Data Flow Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEQUENCE DIAGRAM                              │
└─────────────────────────────────────────────────────────────────┘

Patient    Frontend    Backend    RAG    Gemini    Response
  │           │          │         │        │         │
  │──Fill─────→          │         │        │         │
  │  Form     │          │         │        │         │
  │           │          │         │        │         │
  │──Submit───→          │         │        │         │
  │           │          │         │        │         │
  │           │──POST────→         │        │         │
  │           │  /analyze│         │        │         │
  │           │          │         │        │         │
  │           │          │──Process→        │         │
  │           │          │  Data   │        │         │
  │           │          │         │        │         │
  │           │          │         │──Abstract        │
  │           │          │         │  (Remove PII)    │
  │           │          │         │        │         │
  │           │          │←────────┘        │         │
  │           │          │  Abstracted      │         │
  │           │          │                  │         │
  │           │          │──────────────────→         │
  │           │          │  Generate AI     │         │
  │           │          │                  │         │
  │           │          │                  │──API────→
  │           │          │                  │  Call   │
  │           │          │                  │         │
  │           │          │                  │←────────┘
  │           │          │                  │  AI Text│
  │           │          │                  │         │
  │           │          │←─────────────────┘         │
  │           │          │  Structured               │
  │           │          │                           │
  │           │          │───────────────────────────→
  │           │          │  Add Hospital, Disclaimer │
  │           │          │                           │
  │           │←─────────┘                           │
  │           │  JSON Response                       │
  │           │                                      │
  │←──Display─┘                                      │
  │  Results                                         │
  │                                                  │
```

---

**Use these diagrams in your presentation to explain the architecture!**
