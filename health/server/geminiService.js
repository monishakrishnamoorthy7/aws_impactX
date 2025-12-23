import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.apiKey = apiKey;
    this.model = null;
    this.modelName = null;
    this.isValidated = false;
  }

  /**
   * Validate Gemini connectivity and select available model
   */
  async validateAndInitialize() {
    try {
      console.log('🔍 Validating Gemini API connectivity...');
      
      // Try models in order of preference
      const modelsToTry = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro',
        'gemini-pro'
      ];

      for (const modelName of modelsToTry) {
        try {
          console.log(`   Trying model: ${modelName}...`);
          
          const testModel = this.genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          });

          // Test with a simple prompt
          const testResult = await testModel.generateContent('Say "OK" if you can read this.');
          const testResponse = await testResult.response;
          const testText = testResponse.text();

          if (testText) {
            this.model = testModel;
            this.modelName = modelName;
            this.isValidated = true;
            console.log(`✅ Gemini API validated successfully!`);
            console.log(`   Active Model: ${modelName}`);
            console.log(`   Status: LIVE (Real Gemini AI)`);
            return true;
          }
        } catch (modelError) {
          console.log(`   ❌ ${modelName} not available: ${modelError.message}`);
          continue;
        }
      }

      // If we get here, no models worked
      throw new Error('No available Gemini models found');

    } catch (error) {
      console.error('❌ Gemini validation failed:', error.message);
      console.log('   Status: FALLBACK MODE (High-quality fallback responses)');
      this.isValidated = false;
      return false;
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isActive: this.isValidated,
      modelName: this.modelName || 'none',
      mode: this.isValidated ? 'live' : 'fallback'
    };
  }

  /**
   * Generate health risk analysis from abstracted data
   * @param {Object} ragOutput - Abstracted data from RAG processor
   * @returns {Object} Structured health risk analysis
   */
  async generateHealthRiskAnalysis(ragOutput) {
    // Check if Gemini is validated and available
    if (!this.isValidated || !this.model) {
      console.log('⚠️  Gemini not available, using fallback response');
      return this.generateFallbackResponse(ragOutput);
    }

    try {
      console.log(`🤖 Generating AI analysis with ${this.modelName}...`);
      
      const prompt = this.buildPrompt(ragOutput);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Gemini response received successfully');
      console.log(`   Model: ${this.modelName}`);
      console.log(`   Response length: ${text.length} characters`);

      // Parse and structure the response
      return this.parseGeminiResponse(text, ragOutput);
    } catch (error) {
      console.error('❌ Gemini API Error:', {
        model: this.modelName,
        error: error.message,
        status: error.status || 'unknown'
      });
      console.log('   Falling back to high-quality fallback response');
      
      // Use fallback on error
      return this.generateFallbackResponse(ragOutput);
    }
  }

  /**
   * Build privacy-preserving prompt for Gemini
   */
  buildPrompt(ragOutput) {
    const { abstracted_data, medical_context, risk_classification } = ragOutput;

    const prompt = `You are a health risk analysis assistant. Analyze the following ABSTRACTED health indicators and provide a calm, reassuring risk assessment. DO NOT diagnose any disease. Only provide risk analysis and guidance.

IMPORTANT GUIDELINES:
- Use calm, non-alarming language
- Focus on risk factors, not diagnoses
- Encourage professional consultation
- Be supportive and informative
- Do not use medical jargon excessively
- Emphasize that this is NOT a medical diagnosis

ABSTRACTED HEALTH INDICATORS:
Risk Classification: ${risk_classification.toUpperCase()}
Overall Risk Score: ${abstracted_data.overall_risk_score}/100

Medical Indicators Detected:
${abstracted_data.medical_indicators.map(ind => `- ${ind.indicator} (severity: ${ind.severity})`).join('\n') || 'None detected'}

Symptom Patterns:
${abstracted_data.symptom_profile.patterns.map(p => `- ${p.pattern}: related to ${p.related_conditions.join(', ')}`).join('\n') || 'No significant patterns'}
Duration: ${abstracted_data.symptom_profile.duration_category || 'Not specified'}

Lifestyle Risk Factors:
${abstracted_data.lifestyle_risk_profile.risk_factors.map(f => `- ${f.factor}: +${f.risk_increase}% risk, affects ${f.affected_conditions.join(', ')}`).join('\n') || 'No significant lifestyle risks'}

Medical History Considerations:
${abstracted_data.medical_history_risk.conditions.map(c => `- ${c.condition}: base risk ${c.base_risk}%`).join('\n') || 'No significant history'}

MEDICAL CONTEXT:
${JSON.stringify(medical_context.general_guidance, null, 2)}

Please provide a structured response in the following JSON format:
{
  "risk_level": "${risk_classification}",
  "explanation": "A calm, 2-3 paragraph explanation of the risk factors and what they mean",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "recommended_actions": ["action 1", "action 2", "action 3"],
  "reassurance": "A supportive, reassuring statement",
  "disclaimer": "Clear statement that this is not a medical diagnosis"
}

Respond ONLY with valid JSON. No additional text.`;

    return prompt;
  }

  /**
   * Parse Gemini response into structured format
   */
  parseGeminiResponse(text, ragOutput) {
    try {
      // Extract JSON from response (Gemini sometimes adds markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Ensure all required fields are present
      return {
        risk_level: parsed.risk_level || ragOutput.risk_classification,
        risk_score: ragOutput.abstracted_data.overall_risk_score,
        explanation: parsed.explanation || 'Analysis completed. Please consult a healthcare professional.',
        key_findings: parsed.key_findings || [],
        recommended_actions: parsed.recommended_actions || [
          'Schedule a consultation with a healthcare provider',
          'Monitor your symptoms regularly',
          'Maintain a healthy lifestyle'
        ],
        reassurance: parsed.reassurance || 'Remember, early awareness and professional guidance can help manage health concerns effectively.',
        disclaimer: parsed.disclaimer || 'This is a health risk analysis, not a medical diagnosis. Please consult qualified healthcare professionals for proper medical advice.',
        possible_conditions: this.extractPossibleConditions(ragOutput),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      
      // Fallback response
      return this.generateFallbackResponse(ragOutput);
    }
  }

  /**
   * Extract possible conditions from RAG output
   */
  extractPossibleConditions(ragOutput) {
    const conditions = new Map();

    // From symptom patterns
    ragOutput.abstracted_data.symptom_profile.patterns.forEach(pattern => {
      pattern.related_conditions.forEach(condition => {
        if (!conditions.has(condition)) {
          conditions.set(condition, {
            name: this.formatConditionName(condition),
            probability: 0,
            sources: []
          });
        }
        const current = conditions.get(condition);
        current.probability += pattern.risk_multiplier * 10;
        current.sources.push('symptom_analysis');
      });
    });

    // From lifestyle risks
    ragOutput.abstracted_data.lifestyle_risk_profile.risk_factors.forEach(factor => {
      factor.affected_conditions.forEach(condition => {
        if (!conditions.has(condition)) {
          conditions.set(condition, {
            name: this.formatConditionName(condition),
            probability: 0,
            sources: []
          });
        }
        const current = conditions.get(condition);
        current.probability += factor.risk_increase * 0.5;
        current.sources.push('lifestyle_analysis');
      });
    });

    // From medical history
    ragOutput.abstracted_data.medical_history_risk.conditions.forEach(historyItem => {
      historyItem.related_conditions.forEach(condition => {
        if (!conditions.has(condition)) {
          conditions.set(condition, {
            name: this.formatConditionName(condition),
            probability: 0,
            sources: []
          });
        }
        const current = conditions.get(condition);
        current.probability += historyItem.base_risk * 0.3;
        current.sources.push('medical_history');
      });
    });

    // Convert to array and sort by probability
    const conditionsArray = Array.from(conditions.values())
      .map(c => ({
        ...c,
        probability: Math.min(Math.round(c.probability), 85), // Cap at 85%
        sources: [...new Set(c.sources)]
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3); // Top 3 conditions

    return conditionsArray;
  }

  /**
   * Format condition name for display
   */
  formatConditionName(condition) {
    return condition
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate fallback response if Gemini fails
   */
  generateFallbackResponse(ragOutput) {
    const riskLevel = ragOutput.risk_classification;
    const riskScore = ragOutput.abstracted_data.overall_risk_score;

    const explanations = {
      low: 'Based on the health indicators analyzed, your current risk level appears to be low. However, maintaining healthy lifestyle habits and regular check-ups remain important for long-term wellness.',
      medium: 'The analysis indicates some health risk factors that warrant attention. While not immediately concerning, these indicators suggest that lifestyle modifications and professional consultation would be beneficial.',
      high: 'The analysis has identified several health risk factors that require attention. We recommend scheduling a consultation with a healthcare provider for a comprehensive evaluation and personalized guidance.'
    };

    return {
      risk_level: riskLevel,
      risk_score: riskScore,
      explanation: explanations[riskLevel],
      key_findings: [
        'Multiple health indicators have been analyzed',
        'Risk assessment based on lifestyle and symptom patterns',
        'Professional medical evaluation recommended'
      ],
      recommended_actions: [
        'Schedule a consultation with a healthcare provider',
        'Monitor your symptoms and keep a health journal',
        'Consider lifestyle modifications based on identified risk factors',
        'Follow up regularly with medical professionals'
      ],
      reassurance: 'Early awareness is a positive step toward better health. With proper guidance and care, many health risks can be effectively managed.',
      disclaimer: 'This is a health risk analysis based on abstracted indicators, not a medical diagnosis. Please consult qualified healthcare professionals for proper medical advice and treatment.',
      possible_conditions: this.extractPossibleConditions(ragOutput),
      timestamp: new Date().toISOString()
    };
  }
}

export default GeminiService;
