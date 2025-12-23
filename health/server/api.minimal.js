/**
 * API Route - Health Analysis Endpoint
 * Connects RAG Processor → Gemini Service
 */

import express from 'express';
import RAGProcessor from './ragProcessor.minimal.js';
import GeminiService from './geminiService.minimal.js';

const router = express.Router();

// Initialize services
const ragProcessor = new RAGProcessor();
let geminiService;

try {
  geminiService = new GeminiService();
  console.log('✅ Gemini service initialized');
} catch (error) {
  console.warn('⚠️  Gemini service initialization failed:', error.message);
  console.warn('   API will use fallback responses');
}

/**
 * POST /api/analyze
 * Analyze patient health data
 */
router.post('/analyze', async (req, res) => {
  try {
    const patientData = req.body;

    console.log('\n📊 Health Analysis Request');
    console.log('   Symptoms:', patientData.symptoms?.substring(0, 50) + '...');

    // STEP 1: RAG Processing (Privacy-Preserving Abstraction)
    console.log('\n🔒 STEP 1: RAG Processing');
    const ragOutput = ragProcessor.process(patientData);
    console.log(`   ✓ Extracted ${ragOutput.indicators.length} indicators`);
    console.log(`   ✓ Risk Score: ${ragOutput.risk_score}/100`);
    console.log(`   ✓ Risk Level: ${ragOutput.risk_level.toUpperCase()}`);

    // STEP 2: Gemini API Call (Only abstracted data)
    console.log('\n🤖 STEP 2: Gemini API Call');
    let result;

    if (geminiService) {
      try {
        result = await geminiService.generateExplanation(ragOutput);
        console.log('   ✓ Gemini explanation generated');
      } catch (error) {
        console.error('   ❌ Gemini failed, using fallback');
        result = GeminiService.generateFallback(ragOutput);
      }
    } else {
      console.log('   ⚠️  Gemini not available, using fallback');
      result = GeminiService.generateFallback(ragOutput);
    }

    // STEP 3: Return structured response
    console.log('\n✅ Analysis Complete\n');

    res.json({
      success: true,
      ...result,
      metadata: {
        timestamp: new Date().toISOString(),
        privacy_note: 'No raw personal data was sent to external AI services'
      }
    });

  } catch (error) {
    console.error('\n❌ Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message
    });
  }
});

export default router;
