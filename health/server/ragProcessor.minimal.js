/**
 * RAG Processor - Privacy-Preserving Data Abstraction
 * Converts raw patient data into high-level medical indicators
 * NO personal data, NO diagnosis
 */

class RAGProcessor {
  /**
   * Process patient data and return abstracted indicators
   */
  process(patientData) {
    const indicators = this.extractIndicators(patientData);
    const context = this.retrieveContext(indicators);
    const riskScore = this.calculateRisk(indicators, patientData);
    const riskLevel = this.classifyRisk(riskScore);

    return {
      indicators,
      retrieved_context: context,
      risk_score: riskScore,
      risk_level: riskLevel
    };
  }

  /**
   * Extract high-level indicators from patient data
   */
  extractIndicators(data) {
    const indicators = [];

    // Symptom-based indicators
    if (data.symptoms) {
      const symptomsLower = data.symptoms.toLowerCase();
      
      if (symptomsLower.includes('thirst') || symptomsLower.includes('urination')) {
        indicators.push('elevated_blood_sugar_suspected');
      }
      if (symptomsLower.includes('fatigue') || symptomsLower.includes('tired')) {
        indicators.push('low_energy_levels');
      }
      if (symptomsLower.includes('chest') || symptomsLower.includes('pain')) {
        indicators.push('cardiovascular_concern');
      }
      if (symptomsLower.includes('headache') || symptomsLower.includes('dizzy')) {
        indicators.push('elevated_blood_pressure_suspected');
      }
    }

    // Lifestyle indicators
    if (data.dietPattern?.toLowerCase().includes('high-sugar')) {
      indicators.push('high_sugar_intake');
    }
    if (data.sleepQuality === 'Poor' || data.sleepDuration === 'less-than-5') {
      indicators.push('inadequate_sleep');
    }
    if (data.frequentOutsideFood) {
      indicators.push('irregular_diet_pattern');
    }

    // Medical history indicators
    if (data.medicalHistory && data.medicalHistory.length > 0) {
      if (data.medicalHistory.includes('Diabetes')) {
        indicators.push('diabetes_history');
      }
      if (data.medicalHistory.includes('Hypertension')) {
        indicators.push('hypertension_history');
      }
      if (data.medicalHistory.includes('Heart Disease')) {
        indicators.push('cardiac_history');
      }
    }

    return [...new Set(indicators)]; // Remove duplicates
  }

  /**
   * Retrieve medical context for indicators
   */
  retrieveContext(indicators) {
    const contextMap = {
      'elevated_blood_sugar_suspected': 'Blood sugar regulation may need attention',
      'low_energy_levels': 'Energy levels and metabolic function assessment recommended',
      'cardiovascular_concern': 'Cardiovascular health evaluation advised',
      'elevated_blood_pressure_suspected': 'Blood pressure monitoring recommended',
      'high_sugar_intake': 'Dietary modifications may reduce health risks',
      'inadequate_sleep': 'Sleep quality impacts overall health significantly',
      'irregular_diet_pattern': 'Consistent nutrition supports better health outcomes',
      'diabetes_history': 'Regular monitoring important for diabetes management',
      'hypertension_history': 'Blood pressure control is essential',
      'cardiac_history': 'Cardiovascular health requires ongoing attention'
    };

    return indicators.map(ind => contextMap[ind] || 'Medical evaluation recommended');
  }

  /**
   * Calculate risk score (0-100)
   */
  calculateRisk(indicators, data) {
    let score = 10; // Baseline

    // Indicators contribute to score
    score += indicators.length * 8;

    // Duration increases risk
    if (data.symptomDuration === 'more-than-1-month') score += 15;
    else if (data.symptomDuration === '1-month') score += 10;
    else if (data.symptomDuration === '1-2-weeks') score += 5;

    // Lifestyle factors
    if (data.sleepQuality === 'Poor') score += 10;
    if (data.nightShifts) score += 8;
    if (data.frequentOutsideFood) score += 5;

    // Medical history
    if (data.medicalHistory && data.medicalHistory.length > 0) {
      score += data.medicalHistory.length * 12;
    }

    return Math.min(score, 100);
  }

  /**
   * Classify risk level
   */
  classifyRisk(score) {
    if (score < 25) return 'low';
    if (score < 75) return 'medium';
    return 'high';
  }
}

export default RAGProcessor;
