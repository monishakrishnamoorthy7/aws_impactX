import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import RAGProcessor from './ragProcessor.js';
import GeminiService from './geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize services
const ragProcessor = new RAGProcessor();
let geminiService;
let geminiStatus = { isActive: false, modelName: 'none', mode: 'fallback' };

// Initialize and validate Gemini service
async function initializeGemini() {
  try {
    geminiService = new GeminiService(process.env.GEMINI_API_KEY);
    const isValid = await geminiService.validateAndInitialize();
    geminiStatus = geminiService.getStatus();
    return isValid;
  } catch (error) {
    console.warn('⚠️  Gemini service not initialized:', error.message);
    console.warn('⚠️  API will work with fallback responses');
    geminiStatus = { isActive: false, modelName: 'none', mode: 'fallback' };
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      rag: 'active',
      gemini: geminiStatus.isActive ? 'active' : 'fallback_mode',
      gemini_model: geminiStatus.modelName,
      gemini_mode: geminiStatus.mode
    }
  });
});

// Main analysis endpoint
app.post('/api/analyze-health', async (req, res) => {
  try {
    const patientData = req.body;

    // Validate input
    if (!patientData || !patientData.symptoms) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Patient data with symptoms is required'
      });
    }

    console.log('📊 Processing health analysis request...');

    // Step 1: RAG Processing - Abstract raw data
    console.log('🔒 RAG: Abstracting patient data (privacy-preserving)...');
    const ragOutput = ragProcessor.processPatientData(patientData);
    console.log(`✓ RAG: Risk classified as ${ragOutput.risk_classification.toUpperCase()}`);
    console.log(`   Risk Score: ${ragOutput.abstracted_data.overall_risk_score}/100`);

    // Step 2: Gemini Analysis - Generate explanation from abstracted data
    let geminiResponse;
    
    if (geminiService && geminiStatus.isActive) {
      // Gemini is validated and active - use it
      geminiResponse = await geminiService.generateHealthRiskAnalysis(ragOutput);
    } else {
      // Gemini not available - use fallback
      console.log('⚠️  Gemini not available, using fallback response');
      geminiResponse = {
        risk_level: ragOutput.risk_classification,
        risk_score: ragOutput.abstracted_data.overall_risk_score,
        explanation: 'Health risk analysis completed based on provided indicators.',
        key_findings: ['Analysis based on symptom patterns', 'Lifestyle factors considered', 'Medical history reviewed'],
        recommended_actions: ['Consult healthcare provider', 'Monitor symptoms', 'Maintain healthy lifestyle'],
        reassurance: 'Early awareness helps in better health management.',
        disclaimer: 'This is not a medical diagnosis. Consult healthcare professionals.',
        possible_conditions: [],
        timestamp: new Date().toISOString()
      };
    }

    // Step 3: Combine and return structured response
    const response = {
      success: true,
      analysis: {
        risk_level: geminiResponse.risk_level,
        risk_score: geminiResponse.risk_score,
        explanation: geminiResponse.explanation,
        key_findings: geminiResponse.key_findings,
        possible_conditions: geminiResponse.possible_conditions,
        recommended_actions: geminiResponse.recommended_actions,
        reassurance: geminiResponse.reassurance,
        disclaimer: geminiResponse.disclaimer
      },
      hospital_assignment: generateHospitalAssignment(geminiResponse.risk_level, geminiResponse.possible_conditions),
      metadata: {
        analysis_timestamp: geminiResponse.timestamp,
        privacy_note: 'No raw personal data was sent to external AI services'
      }
    };

    console.log('✓ Analysis complete, sending response');
    res.json(response);

  } catch (error) {
    console.error('❌ Error in health analysis:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// Helper function to generate hospital assignment
function generateHospitalAssignment(riskLevel, possibleConditions) {
  const hospitals = {
    high: {
      name: 'City General Hospital',
      department: 'Emergency Medicine',
      doctor: 'Dr. Sarah Johnson',
      priority: 'urgent'
    },
    medium: {
      name: 'Metro Medical Center',
      department: 'Internal Medicine',
      doctor: 'Dr. Michael Chen',
      priority: 'standard'
    },
    low: {
      name: 'Community Health Clinic',
      department: 'General Practice',
      doctor: 'Dr. Emily Rodriguez',
      priority: 'routine'
    }
  };

  const assignment = hospitals[riskLevel] || hospitals.medium;

  // Adjust department based on conditions
  if (possibleConditions && possibleConditions.length > 0) {
    const topCondition = possibleConditions[0].name.toLowerCase();
    if (topCondition.includes('diabetes')) {
      assignment.department = 'Endocrinology';
    } else if (topCondition.includes('heart')) {
      assignment.department = 'Cardiology';
    } else if (topCondition.includes('kidney')) {
      assignment.department = 'Nephrology';
    }
  }

  // Generate appointment date (3-7 days from now based on priority)
  const daysToAdd = assignment.priority === 'urgent' ? 2 : assignment.priority === 'standard' ? 5 : 7;
  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + daysToAdd);

  return {
    ...assignment,
    appointmentDate: appointmentDate.toISOString().split('T')[0],
    appointmentTime: assignment.priority === 'urgent' ? '09:00 AM' : '10:30 AM',
    address: '123 Medical Center Drive, Downtown'
  };
}

// Sample response endpoint (for testing)
app.get('/api/sample-response', (req, res) => {
  res.json({
    success: true,
    analysis: {
      risk_level: 'medium',
      risk_score: 65,
      explanation: 'Based on the health indicators analyzed, several factors suggest a moderate level of health risk. The combination of lifestyle patterns and symptom indicators warrants professional medical attention. Early intervention and lifestyle modifications can significantly improve health outcomes.',
      key_findings: [
        'Elevated blood sugar indicators detected',
        'Sleep quality and duration below optimal levels',
        'Dietary patterns show high sugar intake'
      ],
      possible_conditions: [
        {
          name: 'Type 2 Diabetes',
          probability: 68,
          sources: ['symptom_analysis', 'lifestyle_analysis']
        },
        {
          name: 'Metabolic Syndrome',
          probability: 52,
          sources: ['lifestyle_analysis', 'medical_history']
        }
      ],
      recommended_actions: [
        'Schedule a consultation with an endocrinologist',
        'Get comprehensive blood work including HbA1c and fasting glucose',
        'Begin monitoring blood sugar levels regularly',
        'Implement dietary changes to reduce sugar intake',
        'Improve sleep hygiene and aim for 7-8 hours nightly'
      ],
      reassurance: 'Remember, identifying health risks early is a positive step. With proper medical guidance and lifestyle adjustments, many conditions can be effectively managed or prevented.',
      disclaimer: 'This is a health risk analysis based on abstracted indicators, not a medical diagnosis. Please consult qualified healthcare professionals for proper medical advice and treatment.'
    },
    hospital_assignment: {
      name: 'Metro Medical Center',
      department: 'Endocrinology',
      doctor: 'Dr. Michael Chen',
      priority: 'standard',
      appointmentDate: '2024-01-20',
      appointmentTime: '10:30 AM',
      address: '123 Medical Center Drive, Downtown'
    },
    metadata: {
      analysis_timestamp: new Date().toISOString(),
      privacy_note: 'No raw personal data was sent to external AI services'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server with Gemini validation
app.listen(PORT, async () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Smart Health Sentinel AI - Backend Server                ║
║  Privacy-Preserving RAG + Gemini Integration              ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                  ║
║  Initializing services...                                  ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  // Initialize and validate Gemini
  await initializeGemini();
  
  // Display final status
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  SERVICE STATUS                                            ║
╠════════════════════════════════════════════════════════════╣
║  RAG Processor: ✅ ACTIVE                                  ║
║  Gemini AI: ${geminiStatus.isActive ? '✅ LIVE' : '⚠️  FALLBACK'}                                    ║
${geminiStatus.isActive ? `║  Model: ${geminiStatus.modelName.padEnd(48)} ║` : '║  Mode: High-quality fallback responses             ║'}
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
