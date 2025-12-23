/**
 * Gemini Service - AI-Powered Health Risk Explanation
 * Uses Google Gemini API to generate calm, informative explanations
 * Receives ONLY abstracted indicators (no personal data)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use currently supported model
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });
  }

  /**
   * Generate health risk explanation from RAG output
   */
  async generateExplanation(ragOutput) {
    try {
      console.log('🤖 Calling Gemini API...');
      console.log(`   Indicators: ${ragOutput.indicators.length}`);
      console.log(`   Risk Level: ${ragOutput.risk_level.toUpperCase()}`);

      const prompt = this.buildPrompt(ragOutput);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Gemini response received');
      console.log(`   Response length: ${text.length} characters`);

      return this.parseResponse(text, ragOutput);

    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      throw error; // Let caller handle fallback
    }
  }

  /**
   * Build privacy-preserving prompt
   */
  buildPrompt(ragOutput) {
    const { indicators, retrieved_context, risk_level, risk_score } = ragOutput;

    return `You are a health risk analysis assistant. Provide a calm, reassuring explanation based on ABSTRACTED health indicators.

IMPORTANT:
- Use calm, non-alarming language
- DO NOT diagnose any disease
- Focus on risk factors and general guidance
- Encourage professional medical consultation
- Be supportive and informative

ABSTRACTED INDICATORS (NO PERSONAL DATA):
Risk Level: ${risk_level.toUpperCase()}
Risk Score: ${risk_score}/100

Indicators Detected:
${indicators.map(ind => `- ${ind}`).join('\n')}

Medical Context:
${retrieved_context.map(ctx => `- ${ctx}`).join('\n')}

Provide a response in this JSON format:
{
  "explanation": "2-3 sentences explaining the risk factors in calm language",
  "recommended_actions": ["action 1", "action 2", "action 3"],
  "reassurance": "A supportive statement"
}

Respond with ONLY valid JSON. No markdown, no extra text.`;
  }

  /**
   * Parse Gemini response
   */
  parseResponse(text, ragOutput) {
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        risk_level: ragOutput.risk_level,
        risk_score: ragOutput.risk_score,
        explanation: parsed.explanation || 'Health risk analysis completed.',
        recommended_actions: parsed.recommended_actions || [
          'Schedule a consultation with a healthcare provider',
          'Monitor your symptoms regularly',
          'Maintain a healthy lifestyle'
        ],
        reassurance: parsed.reassurance || 'Early awareness helps in better health management.',
        disclaimer: 'This is a health risk analysis, NOT a medical diagnosis. Please consult qualified healthcare professionals for proper medical advice.'
      };

    } catch (error) {
      console.error('⚠️  Error parsing Gemini response:', error.message);
      throw error;
    }
  }

  /**
   * Generate safe fallback response
   */
  static generateFallback(ragOutput) {
    const explanations = {
      low: 'Based on the health indicators analyzed, your current risk level appears to be low. However, maintaining healthy lifestyle habits and regular check-ups remain important.',
      medium: 'The analysis indicates some health risk factors that warrant attention. Lifestyle modifications and professional consultation would be beneficial.',
      high: 'The analysis has identified several health risk factors that require attention. We recommend scheduling a consultation with a healthcare provider for comprehensive evaluation.'
    };

    return {
      risk_level: ragOutput.risk_level,
      risk_score: ragOutput.risk_score,
      explanation: explanations[ragOutput.risk_level],
      recommended_actions: [
        'Schedule a consultation with a healthcare provider',
        'Monitor your symptoms and keep a health journal',
        'Consider lifestyle modifications based on identified risk factors',
        'Follow up regularly with medical professionals'
      ],
      reassurance: 'Early awareness is a positive step toward better health. With proper guidance, many health risks can be effectively managed.',
      disclaimer: 'This is a health risk analysis, NOT a medical diagnosis. Please consult qualified healthcare professionals for proper medical advice.'
    };
  }
}

export default GeminiService;
