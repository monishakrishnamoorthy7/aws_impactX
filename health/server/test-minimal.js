/**
 * Test Script for Minimal RAG + Gemini Implementation
 */

import dotenv from 'dotenv';
import RAGProcessor from './ragProcessor.minimal.js';
import GeminiService from './geminiService.minimal.js';

// Load environment variables
dotenv.config();

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  Testing RAG + Gemini Integration                         ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Sample patient data
const patientData = {
  symptoms: 'fatigue, excessive thirst, frequent urination',
  symptomDuration: '1-month',
  dietPattern: 'High-sugar diet',
  frequentOutsideFood: true,
  sleepDuration: 'less-than-5',
  sleepQuality: 'Poor',
  nightShifts: false,
  medicalHistory: ['Diabetes'],
  city: 'New York'
};

async function test() {
  try {
    // Test RAG Processor
    console.log('📊 Testing RAG Processor...\n');
    const ragProcessor = new RAGProcessor();
    const ragOutput = ragProcessor.process(patientData);
    
    console.log('RAG Output:');
    console.log('  Indicators:', ragOutput.indicators);
    console.log('  Risk Score:', ragOutput.risk_score);
    console.log('  Risk Level:', ragOutput.risk_level);
    console.log('  Context Items:', ragOutput.retrieved_context.length);
    console.log('');

    // Test Gemini Service
    console.log('🤖 Testing Gemini Service...\n');
    
    try {
      const geminiService = new GeminiService();
      const result = await geminiService.generateExplanation(ragOutput);
      
      console.log('✅ Gemini Response:');
      console.log('  Risk Level:', result.risk_level);
      console.log('  Explanation:', result.explanation.substring(0, 100) + '...');
      console.log('  Actions:', result.recommended_actions.length);
      console.log('  Disclaimer:', result.disclaimer.substring(0, 50) + '...');
      console.log('');
      console.log('✅ All tests passed!');
      
    } catch (error) {
      console.log('⚠️  Gemini API Error:', error.message);
      console.log('   Testing fallback...\n');
      
      const fallback = GeminiService.generateFallback(ragOutput);
      console.log('✅ Fallback Response:');
      console.log('  Risk Level:', fallback.risk_level);
      console.log('  Explanation:', fallback.explanation.substring(0, 100) + '...');
      console.log('');
      console.log('✅ Fallback works!');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

test();
