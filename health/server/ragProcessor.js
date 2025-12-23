import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RAGProcessor {
  constructor() {
    const knowledgeBasePath = path.join(__dirname, 'knowledgeBase.json');
    this.knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));
  }

  /**
   * Main processing function - abstracts raw patient data
   * @param {Object} patientData - Raw patient data from frontend
   * @returns {Object} Abstracted medical indicators
   */
  processPatientData(patientData) {
    const abstracted = {
      medical_indicators: this.extractMedicalIndicators(patientData),
      symptom_profile: this.analyzeSymptoms(patientData.symptoms, patientData.symptomDuration),
      lifestyle_risk_profile: this.assessLifestyleRisks(patientData),
      medical_history_risk: this.assessMedicalHistory(patientData.medicalHistory),
      climate_risk: this.assessClimateRisk(patientData.city),
      overall_risk_score: 0
    };

    // Calculate overall risk score
    abstracted.overall_risk_score = this.calculateRiskScore(abstracted);
    
    // Retrieve relevant medical context
    const medicalContext = this.retrieveRelevantContext(abstracted);

    return {
      abstracted_data: abstracted,
      medical_context: medicalContext,
      risk_classification: this.classifyRisk(abstracted.overall_risk_score)
    };
  }

  /**
   * Extract high-level medical indicators from lab reports
   * Note: In production, this would parse actual lab report files
   */
  extractMedicalIndicators(patientData) {
    const indicators = [];

    // Simulate lab value extraction (in production, parse uploaded files)
    // For demo, we infer from symptoms and medical history
    
    if (patientData.symptoms?.toLowerCase().includes('thirst') || 
        patientData.symptoms?.toLowerCase().includes('urination')) {
      indicators.push({
        indicator: 'elevated_blood_sugar_suspected',
        severity: 'medium',
        reference: this.knowledgeBase.medicalRanges.blood_sugar_fasting
      });
    }

    if (patientData.symptoms?.toLowerCase().includes('fatigue') || 
        patientData.symptoms?.toLowerCase().includes('tired')) {
      indicators.push({
        indicator: 'low_hemoglobin_suspected',
        severity: 'low',
        reference: this.knowledgeBase.medicalRanges.hemoglobin
      });
    }

    if (patientData.symptoms?.toLowerCase().includes('chest pain') || 
        patientData.symptoms?.toLowerCase().includes('headache')) {
      indicators.push({
        indicator: 'elevated_blood_pressure_suspected',
        severity: 'high',
        reference: this.knowledgeBase.medicalRanges.blood_pressure_systolic
      });
    }

    return indicators;
  }

  /**
   * Analyze symptoms and map to risk patterns
   */
  analyzeSymptoms(symptomsText, duration) {
    if (!symptomsText) return { patterns: [], risk_score: 0 };

    const symptomsLower = symptomsText.toLowerCase();
    const patterns = [];
    let symptomRiskScore = 0;

    // Map symptoms to known risk patterns
    Object.entries(this.knowledgeBase.symptomRiskRules).forEach(([symptom, data]) => {
      const symptomKey = symptom.replace(/_/g, ' ');
      if (symptomsLower.includes(symptomKey.split('_')[0])) {
        patterns.push({
          pattern: symptom,
          related_conditions: data.conditions,
          risk_multiplier: data.risk_multiplier
        });
        // Increased multiplier from 10 to 15 for more impact
        symptomRiskScore += data.risk_multiplier * 15;
      }
    });

    // Duration increases risk
    const durationMultiplier = this.getDurationMultiplier(duration);
    symptomRiskScore *= durationMultiplier;

    return {
      patterns,
      duration_category: duration,
      risk_score: Math.min(symptomRiskScore, 100)
    };
  }

  /**
   * Assess lifestyle risk factors
   */
  assessLifestyleRisks(patientData) {
    const risks = [];
    let lifestyleRiskScore = 0;

    // Diet assessment
    if (patientData.dietPattern?.toLowerCase().includes('high-sugar')) {
      const riskData = this.knowledgeBase.lifestyleRiskFactors.high_sugar_diet;
      risks.push({
        factor: 'high_sugar_diet',
        risk_increase: riskData.risk_increase,
        affected_conditions: riskData.affected_conditions
      });
      lifestyleRiskScore += riskData.risk_increase;
    }

    if (patientData.dietPattern?.toLowerCase().includes('high-fat')) {
      const riskData = this.knowledgeBase.lifestyleRiskFactors.high_fat_diet;
      risks.push({
        factor: 'high_fat_diet',
        risk_increase: riskData.risk_increase,
        affected_conditions: riskData.affected_conditions
      });
      lifestyleRiskScore += riskData.risk_increase;
    }

    if (patientData.frequentOutsideFood) {
      const riskData = this.knowledgeBase.lifestyleRiskFactors.frequent_outside_food;
      risks.push({
        factor: 'frequent_outside_food',
        risk_increase: riskData.risk_increase,
        affected_conditions: riskData.affected_conditions
      });
      lifestyleRiskScore += riskData.risk_increase;
    }

    // Sleep assessment
    if (patientData.sleepQuality === 'Poor') {
      const riskData = this.knowledgeBase.lifestyleRiskFactors.sleep_poor_quality;
      risks.push({
        factor: 'sleep_poor_quality',
        risk_increase: riskData.risk_increase,
        affected_conditions: riskData.affected_conditions
      });
      lifestyleRiskScore += riskData.risk_increase;
    }

    if (patientData.sleepDuration === 'less-than-5') {
      const riskData = this.knowledgeBase.lifestyleRiskFactors.sleep_less_than_5_hours;
      risks.push({
        factor: 'sleep_less_than_5_hours',
        risk_increase: riskData.risk_increase,
        affected_conditions: riskData.affected_conditions
      });
      lifestyleRiskScore += riskData.risk_increase;
    }

    if (patientData.nightShifts) {
      const riskData = this.knowledgeBase.lifestyleRiskFactors.night_shifts;
      risks.push({
        factor: 'night_shifts',
        risk_increase: riskData.risk_increase,
        affected_conditions: riskData.affected_conditions
      });
      lifestyleRiskScore += riskData.risk_increase;
    }

    return {
      risk_factors: risks,
      risk_score: Math.min(lifestyleRiskScore, 100)
    };
  }

  /**
   * Assess medical history risk
   */
  assessMedicalHistory(medicalHistory) {
    if (!medicalHistory || medicalHistory.length === 0 || medicalHistory.includes('None')) {
      return { conditions: [], risk_score: 0 };
    }

    const conditions = [];
    let historyRiskScore = 0;

    medicalHistory.forEach(condition => {
      const conditionKey = condition.toLowerCase().replace(/ /g, '_');
      const riskData = this.knowledgeBase.medicalHistoryRisk[conditionKey];
      
      if (riskData) {
        conditions.push({
          condition: conditionKey,
          base_risk: riskData.base_risk,
          related_conditions: riskData.related_conditions
        });
        historyRiskScore += riskData.base_risk;
      }
    });

    return {
      conditions,
      risk_score: Math.min(historyRiskScore, 100)
    };
  }

  /**
   * Assess climate-related risks
   */
  assessClimateRisk(city) {
    // Simplified climate assessment
    // In production, integrate with weather API
    return {
      location_category: 'moderate_climate',
      risk_score: 10
    };
  }

  /**
   * Calculate overall risk score
   */
  calculateRiskScore(abstracted) {
    const weights = {
      medical_indicators: 0.30,      // Slightly reduced
      symptom_profile: 0.30,         // Same
      lifestyle_risk_profile: 0.25,  // Increased
      medical_history_risk: 0.25,    // Same
      climate_risk: 0.05             // Same (minimal impact)
    };

    let totalScore = 0;
    
    // Medical indicators - moderate weight per indicator
    totalScore += (abstracted.medical_indicators.length * 18) * weights.medical_indicators;
    
    // Symptom profile - direct score
    totalScore += abstracted.symptom_profile.risk_score * weights.symptom_profile;
    
    // Lifestyle risks - increased weight
    totalScore += abstracted.lifestyle_risk_profile.risk_score * weights.lifestyle_risk_profile;
    
    // Medical history - direct score
    totalScore += abstracted.medical_history_risk.risk_score * weights.medical_history_risk;
    totalScore += abstracted.climate_risk.risk_score * weights.climate_risk;
    
    // Add a baseline of 10 points to push scores up slightly
    totalScore += 10;

    return Math.min(Math.round(totalScore), 100);
  }

  /**
   * Classify risk level
   */
  classifyRisk(score) {
    if (score < 25) return 'low';      // Lowered from 35
    if (score < 75) return 'medium';   // Increased from 65
    return 'high';
  }

  /**
   * Retrieve relevant medical context for Gemini
   */
  retrieveRelevantContext(abstracted) {
    const context = {
      reference_ranges: {},
      risk_factors_info: [],
      general_guidance: []
    };

    // Add relevant reference ranges
    abstracted.medical_indicators.forEach(indicator => {
      context.reference_ranges[indicator.indicator] = indicator.reference;
    });

    // Add lifestyle risk information
    abstracted.lifestyle_risk_profile.risk_factors.forEach(factor => {
      context.risk_factors_info.push({
        factor: factor.factor,
        impact: `Increases risk by ${factor.risk_increase}%`,
        affects: factor.affected_conditions
      });
    });

    // Add general guidance
    context.general_guidance = [
      'Early detection and lifestyle modifications can significantly reduce health risks',
      'Regular monitoring and professional consultation are recommended',
      'Lifestyle changes including diet, sleep, and exercise can improve outcomes'
    ];

    return context;
  }

  /**
   * Helper: Get duration multiplier
   */
  getDurationMultiplier(duration) {
    const multipliers = {
      'less-than-1-week': 1.0,
      '1-2-weeks': 1.2,
      '1-month': 1.4,
      'more-than-1-month': 1.6
    };
    return multipliers[duration] || 1.0;
  }
}

export default RAGProcessor;
