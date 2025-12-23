# Smart Health Sentinel AI - Backend

Privacy-preserving RAG (Retrieval-Augmented Generation) + Google Gemini API integration for health risk analysis.

## Architecture

```
Patient Data → RAG Processor → Gemini API → Structured Response
     ↓              ↓               ↓              ↓
  Raw Data    Abstracted      AI Analysis    Risk Assessment
              Indicators      (No PII)       + Guidance
```

## Privacy-Preserving Design

### What Gets Sent to Gemini:
- ✅ Abstracted medical indicators (e.g., "elevated_blood_sugar_suspected")
- ✅ Risk scores and classifications
- ✅ Symptom patterns (not raw text)
- ✅ Lifestyle risk categories
- ✅ Medical context from knowledge base

### What NEVER Gets Sent to Gemini:
- ❌ Patient names or identifiers
- ❌ Raw medical reports or lab files
- ❌ Exact symptom descriptions
- ❌ Personal location data
- ❌ Any personally identifiable information (PII)

## Setup

### 1. Install Dependencies

```bash
cd health/server
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. Get Gemini API Key (Free Tier)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

### 4. Start Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Server will start at: `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "rag": "active",
    "gemini": "active"
  }
}
```

### Analyze Health Data
```
POST /api/analyze-health
Content-Type: application/json
```

Request Body:
```json
{
  "symptoms": "fatigue, excessive thirst, frequent urination",
  "symptomDuration": "1-month",
  "dietPattern": "High-sugar diet",
  "frequentOutsideFood": true,
  "sleepDuration": "less-than-5",
  "sleepQuality": "Poor",
  "nightShifts": false,
  "medicalHistory": ["Diabetes"],
  "city": "New York"
}
```

Response:
```json
{
  "success": true,
  "analysis": {
    "risk_level": "medium",
    "risk_score": 65,
    "explanation": "Calm, reassuring explanation...",
    "key_findings": ["Finding 1", "Finding 2"],
    "possible_conditions": [
      {
        "name": "Type 2 Diabetes",
        "probability": 68,
        "sources": ["symptom_analysis", "lifestyle_analysis"]
      }
    ],
    "recommended_actions": ["Action 1", "Action 2"],
    "reassurance": "Supportive message...",
    "disclaimer": "Not a medical diagnosis..."
  },
  "hospital_assignment": {
    "name": "Metro Medical Center",
    "department": "Endocrinology",
    "doctor": "Dr. Michael Chen",
    "appointmentDate": "2024-01-20",
    "appointmentTime": "10:30 AM"
  },
  "metadata": {
    "analysis_timestamp": "2024-01-15T10:30:00.000Z",
    "privacy_note": "No raw personal data was sent to external AI services"
  }
}
```

### Sample Response (Testing)
```
GET /api/sample-response
```

Returns a sample analysis response for testing frontend integration.

## Modules

### RAG Processor (`ragProcessor.js`)

**Purpose:** Abstract raw patient data into privacy-preserving medical indicators.

**Key Functions:**
- `processPatientData(patientData)` - Main entry point
- `extractMedicalIndicators()` - Detect health indicators from symptoms
- `analyzeSymptoms()` - Map symptoms to risk patterns
- `assessLifestyleRisks()` - Evaluate lifestyle factors
- `assessMedicalHistory()` - Process medical history
- `calculateRiskScore()` - Compute overall risk (0-100)
- `retrieveRelevantContext()` - Get medical context from knowledge base

**Output Example:**
```json
{
  "abstracted_data": {
    "medical_indicators": [
      {
        "indicator": "elevated_blood_sugar_suspected",
        "severity": "medium"
      }
    ],
    "symptom_profile": {
      "patterns": ["fatigue_chronic", "excessive_thirst"],
      "risk_score": 45
    },
    "lifestyle_risk_profile": {
      "risk_factors": ["high_sugar_diet", "sleep_poor_quality"],
      "risk_score": 50
    },
    "overall_risk_score": 65
  },
  "risk_classification": "medium"
}
```

### Gemini Service (`geminiService.js`)

**Purpose:** Generate human-friendly health risk explanations using Google Gemini.

**Key Functions:**
- `generateHealthRiskAnalysis(ragOutput)` - Main analysis function
- `buildPrompt()` - Create privacy-preserving prompt
- `parseGeminiResponse()` - Structure AI response
- `extractPossibleConditions()` - Identify potential conditions
- `generateFallbackResponse()` - Backup if Gemini fails

**Prompt Guidelines:**
- Uses ONLY abstracted data (no PII)
- Instructs Gemini to be calm and non-alarming
- Explicitly states "DO NOT diagnose"
- Requests structured JSON output
- Emphasizes supportive, informative tone

### Knowledge Base (`knowledgeBase.json`)

**Purpose:** Local medical reference data (WHO ranges, risk rules).

**Contents:**
- Medical reference ranges (blood sugar, hemoglobin, blood pressure)
- Symptom-to-condition risk rules
- Lifestyle risk factors and multipliers
- Medical history risk assessments
- Climate risk factors

**Benefits:**
- No external API calls for basic medical context
- Consistent, evidence-based risk assessment
- Easily updatable with new medical guidelines

## Risk Calculation

Risk score is calculated using weighted factors:

```
Risk Score = 
  (Medical Indicators × 0.30) +
  (Symptom Profile × 0.25) +
  (Lifestyle Risks × 0.20) +
  (Medical History × 0.20) +
  (Climate Factors × 0.05)
```

**Risk Classification:**
- **Low:** 0-34 (Green)
- **Medium:** 35-64 (Yellow)
- **High:** 65-100 (Red)

## Fallback Mode

If Gemini API is unavailable or fails:
1. Server continues to work
2. RAG processing still occurs
3. Structured fallback responses are generated
4. All features remain functional

## Security Considerations

1. **No PII to External APIs:** Raw patient data never leaves your server
2. **Data Abstraction:** Only high-level indicators sent to Gemini
3. **Local Knowledge Base:** Medical context stored locally
4. **API Key Security:** Store in `.env`, never commit to git
5. **CORS Configuration:** Restrict to frontend domain in production

## Testing

### Test RAG Processing
```bash
curl -X POST http://localhost:3001/api/analyze-health \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "fatigue and thirst",
    "symptomDuration": "1-month",
    "dietPattern": "High-sugar diet",
    "sleepQuality": "Poor",
    "medicalHistory": ["Diabetes"]
  }'
```

### Test Health Check
```bash
curl http://localhost:3001/api/health
```

### Test Sample Response
```bash
curl http://localhost:3001/api/sample-response
```

## Production Deployment

### Environment Variables
```
GEMINI_API_KEY=your_production_key
PORT=3001
NODE_ENV=production
```

### Recommended Setup
1. Use environment-specific API keys
2. Enable HTTPS
3. Configure CORS for your frontend domain
4. Set up rate limiting
5. Add request logging
6. Monitor Gemini API usage
7. Implement caching for repeated queries

## Troubleshooting

### "Gemini service not initialized"
- Check if `GEMINI_API_KEY` is set in `.env`
- Verify API key is valid
- Server will work in fallback mode

### "Analysis failed"
- Check server logs for detailed error
- Verify request body format
- Ensure all required fields are present

### CORS errors
- Verify frontend URL in CORS configuration
- Check if server is running
- Ensure correct port (3001)

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check server logs: `npm start`
2. Test with sample endpoint: `/api/sample-response`
3. Verify Gemini API key is valid
4. Review knowledge base structure

---

**Remember:** This system provides health risk analysis, NOT medical diagnosis. Always encourage users to consult healthcare professionals.
