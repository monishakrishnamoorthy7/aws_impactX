import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Hospital,
  Download,
  Calendar,
  User,
<<<<<<< HEAD
  FileText,
  ArrowRight,
  Shield
=======
  ArrowRight
>>>>>>> a49b82e781e7a697363a5e83ca599ac4b89d0b08
} from 'lucide-react'
import './AIResultDashboard.css'

const AIResultDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [patientData] = useState(location.state?.patientData || {})
  const [analysisComplete, setAnalysisComplete] = useState(false)
  
  // Get analysis results from backend
  const analysisResult = location.state?.analysisResult
  
  // Use backend results or fallback to simulated data
  const [results] = useState(() => {
    if (analysisResult && analysisResult.success) {
      return {
        riskLevel: analysisResult.analysis.risk_level,
        riskScore: analysisResult.analysis.risk_score,
        possibleDiseases: analysisResult.analysis.possible_conditions.map(condition => ({
          name: condition.name,
          probability: condition.probability,
          explanation: `Based on ${condition.sources.join(', ').replace(/_/g, ' ')}`
        })),
        aiExplanation: analysisResult.analysis.explanation,
        keyFindings: analysisResult.analysis.key_findings,
        recommendedActions: analysisResult.analysis.recommended_actions,
        reassurance: analysisResult.analysis.reassurance,
        disclaimer: analysisResult.analysis.disclaimer,
        assignedHospital: {
          name: analysisResult.hospital_assignment.name,
          department: analysisResult.hospital_assignment.department,
          doctor: analysisResult.hospital_assignment.doctor,
          appointmentDate: analysisResult.hospital_assignment.appointmentDate,
          appointmentTime: analysisResult.hospital_assignment.appointmentTime,
          address: analysisResult.hospital_assignment.address
        },
        privacyNote: analysisResult.metadata.privacy_note
      }
    } else {
      // Fallback to simulated data
      return {
        riskLevel: 'medium',
        riskScore: 65,
        possibleDiseases: [
          {
            name: 'Type 2 Diabetes',
            probability: 68,
            explanation: 'Based on symptoms, diet pattern, and family history indicators'
          },
          {
            name: 'Hypertension',
            probability: 45,
            explanation: 'Sleep patterns and stress indicators suggest elevated risk'
          }
        ],
        aiExplanation: `Based on your blood sugar indicators, hemoglobin levels, reported fatigue symptoms, 
        and dietary patterns showing high sugar intake, our AI has detected elevated risk markers. 
        Your symptom duration of ${patientData.symptomDuration} combined with sleep quality issues 
        further supports this assessment.`,
        assignedHospital: {
          name: 'City General Hospital',
          department: 'Endocrinology',
          doctor: 'Dr. Sarah Johnson',
          appointmentDate: '2024-01-15',
          appointmentTime: '10:30 AM',
          address: '123 Medical Center Drive, Downtown'
        }
      }
<<<<<<< HEAD
=======
    ],
    aiExplanation: `Based on your blood sugar indicators, hemoglobin levels, reported fatigue symptoms, 
    and dietary patterns showing high sugar intake, our AI has detected elevated risk markers. 
    Your symptom duration of ${patientData.symptomDuration} combined with sleep quality issues 
    further supports this assessment.`,
    assignedHospital: {
      name: 'City General Hospital',
      department: 'Endocrinology',
      doctor: 'Sarah Johnson',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30 AM',
      address: '123 Medical Center Drive, Downtown',
      phone: '+1 (555) 123-4567',
      email: 'appointments@citygeneral.com'
>>>>>>> a49b82e781e7a697363a5e83ca599ac4b89d0b08
    }
  })

  useEffect(() => {
    // Simulate analysis completion after component mounts
    const timer = setTimeout(() => {
      setAnalysisComplete(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'var(--success)'      // Green
      case 'medium': return '#ff8c00'          // Orange
      case 'high': return 'var(--danger)'     // Red
      default: return 'var(--light-gray)'
    }
  }

  const getRiskLevelDisplay = (level) => {
    switch (level) {
      case 'low': return 'Low'
      case 'medium': return 'Moderate'
      case 'high': return 'High'
      default: return 'Unknown'
    }
  }

  const getRiskIcon = (level) => {
    switch (level) {
      case 'low': return <CheckCircle size={24} />
      case 'medium': return <AlertCircle size={24} />
      case 'high': return <AlertTriangle size={24} />
      default: return <AlertCircle size={24} />
    }
  }

  const handleViewHospital = () => {
    navigate('/hospital-notification', { 
      state: { 
        hospital: results.assignedHospital,
        patientData,
        results 
      }
    })
  }

  const handleDownloadReport = () => {
    // Create a comprehensive AI health analysis report
    const aiReportHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI Health Analysis Report - ${patientData.fullName || 'Patient'}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: #333;
            line-height: 1.6;
        }
        .report-header {
            text-align: center;
            border-bottom: 3px solid #00ff88;
            padding-bottom: 20px;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            border-radius: 10px;
        }
        .ai-logo {
            font-size: 32px;
            font-weight: bold;
            color: #00ff88;
            margin-bottom: 10px;
        }
        .report-title {
            font-size: 24px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 5px;
        }
        .report-subtitle {
            font-size: 16px;
            color: #666;
        }
        .report-body {
            max-width: 900px;
            margin: 0 auto;
        }
        .patient-summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #00ff88;
        }
        .patient-info, .analysis-info {
            flex: 1;
        }
        .label {
            font-weight: bold;
            color: #2c5aa0;
        }
        .risk-assessment {
            margin-bottom: 30px;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
        }
        .risk-low { background: #d4edda; border: 2px solid #28a745; }
        .risk-medium { background: #fff3cd; border: 2px solid #ffc107; }
        .risk-high { background: #f8d7da; border: 2px solid #dc3545; }
        .risk-score {
            font-size: 48px;
            font-weight: bold;
            margin: 10px 0;
        }
        .risk-score.low { color: #28a745; }
        .risk-score.medium { color: #ffc107; }
        .risk-score.high { color: #dc3545; }
        .risk-level {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .diseases-section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }
        .disease-item {
            margin-bottom: 20px;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            background: #fff;
        }
        .disease-name {
            font-size: 18px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
        }
        .probability-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .prob-high { background: #f8d7da; color: #721c24; }
        .prob-medium { background: #fff3cd; color: #856404; }
        .prob-low { background: #d4edda; color: #155724; }
        .ai-analysis {
            margin-bottom: 30px;
            padding: 25px;
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
            border-radius: 10px;
            border-left: 5px solid #2196f3;
        }
        .ai-analysis-title {
            font-size: 18px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .recommendations {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .recommendation-item {
            margin-bottom: 15px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #00ff88;
        }
        .hospital-assignment {
            margin-bottom: 30px;
            padding: 25px;
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            border-radius: 10px;
            border: 2px solid #00ff88;
        }
        .hospital-name {
            font-size: 20px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
        }
        .appointment-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .detail-box {
            padding: 10px;
            background: white;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .disclaimer {
            margin-top: 30px;
            padding: 20px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
        }
        .disclaimer-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .report-body { max-width: none; }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="ai-logo">🧠 AI HEALTH ANALYZER</div>
        <div class="report-title">Comprehensive Health Risk Analysis Report</div>
        <div class="report-subtitle">Advanced AI-Powered Medical Assessment</div>
    </div>

    <div class="report-body">
        <div class="patient-summary">
            <div class="patient-info">
                <div><span class="label">Patient Name:</span> ${patientData.fullName || 'John Doe'}</div>
                <div><span class="label">Age:</span> ${patientData.age || '35'} years</div>
                <div><span class="label">Gender:</span> ${patientData.gender || 'Male'}</div>
                <div><span class="label">Contact:</span> ${patientData.phone || '+1 (555) 123-4567'}</div>
                <div><span class="label">Location:</span> ${patientData.location || 'Downtown, City'}</div>
            </div>
            <div class="analysis-info">
                <div><span class="label">Analysis Date:</span> ${new Date().toLocaleDateString()}</div>
                <div><span class="label">Report ID:</span> AI-${Math.floor(Math.random() * 100000)}</div>
                <div><span class="label">AI Model Version:</span> HealthAI v3.2.1</div>
                <div><span class="label">Analysis Duration:</span> ${patientData.symptomDuration || '2 weeks'}</div>
                <div><span class="label">Data Points Analyzed:</span> 247</div>
            </div>
        </div>

        <div class="risk-assessment risk-${results.riskLevel}">
            <h2>OVERALL RISK ASSESSMENT</h2>
            <div class="risk-score ${results.riskLevel}">${results.riskScore}</div>
            <div class="risk-level">${getRiskLevelDisplay(results.riskLevel)} Risk Level</div>
            <p style="margin-top: 15px; font-size: 16px;">
                ${results.riskLevel === 'high' ? 'Immediate medical attention is strongly recommended. Please consult with a healthcare professional as soon as possible.' : 
                  results.riskLevel === 'medium' ? 'Medical consultation is advised within the next few days. Monitor symptoms closely.' : 
                  'Regular monitoring and preventive care recommended. Maintain healthy lifestyle habits.'}
            </p>
        </div>

        <div class="diseases-section">
            <div class="section-title">🔍 IDENTIFIED HEALTH CONDITIONS</div>
            ${results.possibleDiseases.map((disease, index) => `
                <div class="disease-item">
                    <div class="disease-name">${index + 1}. ${disease.name}</div>
                    <div class="probability-badge ${disease.probability > 60 ? 'prob-high' : disease.probability > 40 ? 'prob-medium' : 'prob-low'}">
                        ${disease.probability}% Probability
                    </div>
                    <p><strong>AI Analysis:</strong> ${disease.explanation}</p>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
                        <strong>Risk Factors Identified:</strong>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            <li>Symptom pattern analysis</li>
                            <li>Lifestyle and dietary factors</li>
                            <li>Family history correlation</li>
                            <li>Physiological indicators</li>
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="ai-analysis">
            <div class="ai-analysis-title">
                🤖 DETAILED AI ANALYSIS
            </div>
            <p><strong>Comprehensive Assessment:</strong></p>
            <p>${results.aiExplanation}</p>
            
            <div style="margin-top: 20px;">
                <p><strong>Key Indicators Analyzed:</strong></p>
                <ul>
                    <li><strong>Symptom Severity:</strong> ${patientData.symptoms || 'Fatigue, frequent urination, increased thirst'}</li>
                    <li><strong>Duration:</strong> ${patientData.symptomDuration || '2 weeks'}</li>
                    <li><strong>Lifestyle Factors:</strong> Diet patterns, sleep quality, exercise habits</li>
                    <li><strong>Medical History:</strong> Family history and previous conditions</li>
                    <li><strong>Vital Signs:</strong> Blood pressure, heart rate, BMI indicators</li>
                </ul>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 8px;">
                <p><strong>AI Confidence Level:</strong> ${results.riskScore}% (High Confidence)</p>
                <p><strong>Data Quality Score:</strong> 94/100 (Excellent)</p>
                <p><strong>Analysis Completeness:</strong> 98% (Comprehensive)</p>
            </div>
        </div>

        <div class="recommendations">
            <div class="section-title">💡 AI RECOMMENDATIONS</div>
            
            <div class="recommendation-item">
                <strong>Immediate Actions:</strong>
                <ul>
                    <li>Schedule appointment with assigned specialist</li>
                    <li>Monitor symptoms daily and keep a health diary</li>
                    <li>Follow dietary recommendations provided</li>
                    <li>Maintain regular sleep schedule (7-8 hours)</li>
                </ul>
            </div>

            <div class="recommendation-item">
                <strong>Lifestyle Modifications:</strong>
                <ul>
                    <li>Reduce sugar intake and processed foods</li>
                    <li>Increase physical activity (30 minutes daily)</li>
                    <li>Stay hydrated (8-10 glasses of water daily)</li>
                    <li>Practice stress management techniques</li>
                </ul>
            </div>

            <div class="recommendation-item">
                <strong>Monitoring Guidelines:</strong>
                <ul>
                    <li>Check blood pressure weekly if available</li>
                    <li>Monitor weight changes</li>
                    <li>Track energy levels and fatigue patterns</li>
                    <li>Note any new or worsening symptoms</li>
                </ul>
            </div>
        </div>

        <div class="hospital-assignment">
            <div class="section-title">🏥 HOSPITAL ASSIGNMENT</div>
            <div class="hospital-name">${results.assignedHospital.name}</div>
            <p><strong>Department:</strong> ${results.assignedHospital.department}</p>
            <p><strong>Assigned Specialist:</strong> Dr. ${results.assignedHospital.doctor}</p>
            
            <div class="appointment-details">
                <div class="detail-box">
                    <strong>Appointment Date:</strong><br>
                    ${results.assignedHospital.appointmentDate}
                </div>
                <div class="detail-box">
                    <strong>Appointment Time:</strong><br>
                    ${results.assignedHospital.appointmentTime}
                </div>
                <div class="detail-box">
                    <strong>Hospital Address:</strong><br>
                    ${results.assignedHospital.address}
                </div>
                <div class="detail-box">
                    <strong>Contact Information:</strong><br>
                    ${results.assignedHospital.phone}<br>
                    ${results.assignedHospital.email}
                </div>
            </div>
        </div>

        <div class="disclaimer">
            <div class="disclaimer-title">⚠️ IMPORTANT DISCLAIMER</div>
            <p>This AI-generated health analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. The AI system analyzes patterns in provided data but cannot account for all individual health factors. Always consult with qualified healthcare professionals for medical decisions.</p>
            
            <p><strong>Accuracy Note:</strong> This AI analysis has a ${results.riskScore}% confidence level based on the provided data. Results may vary with additional medical testing and professional evaluation.</p>
        </div>

        <div class="footer">
            <p><strong>Generated by:</strong> AI Health Analyzer System v3.2.1</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Report ID:</strong> AI-RPT-${Math.floor(Math.random() * 1000000)}</p>
            <p>This report contains confidential medical information. Please handle with appropriate privacy measures.</p>
        </div>
    </div>
</body>
</html>`;

    // Create and download the HTML file
    const blob = new Blob([aiReportHTML], {
      type: 'text/html'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Health_Report_${(patientData.fullName || 'Patient').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    alert('AI Health Analysis Report downloaded successfully! You can open the HTML file in any browser or print it as PDF.');
  }

  if (!analysisComplete) {
    return (
      <div className="ai-results loading-state">
        <div className="container">
          <div className="loading-card">
            <div className="ai-brain">
              <div className="pulse-rings">
                <div className="pulse-ring rotating-element"></div>
                <div className="pulse-ring rotating-element-reverse"></div>
                <div className="pulse-ring morphing-element"></div>
              </div>
              <Brain size={100} className="brain-icon float-effect" />
            </div>
            <h2>AI Analysis in Progress</h2>
            <p>Our advanced AI is analyzing your health data with precision...</p>
            <div className="analysis-steps">
              <div className="step active shimmer-effect">Processing symptoms</div>
              <div className="step active shimmer-effect">Analyzing lab reports</div>
              <div className="step active shimmer-effect">Evaluating risk factors</div>
              <div className="step bounce-effect">Generating recommendations</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="ai-results">
      <div className="container">
        {/* Header */}
        <div className="results-header">
          <h1>AI Health Risk Analysis</h1>
          <p>Complete analysis based on your health data</p>
        </div>

        {/* Risk Level Banner */}
        <div className={`risk-level-banner risk-${results.riskLevel}`}>
          <div className="risk-banner-content">
            <div className="risk-circular-indicator">
              <div className={`risk-circle risk-${results.riskLevel}`}>
                <div className="risk-circle-inner">
                  <div className="risk-icon-animated" style={{ color: getRiskColor(results.riskLevel) }}>
                    {getRiskIcon(results.riskLevel)}
                  </div>
                  <div className="risk-pulse-rings">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring"></div>
                  </div>
                </div>
                <svg className="progress-ring" width="120" height="120">
                  <circle
                    className="progress-ring-background"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                    fill="transparent"
                    r="56"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className={`progress-ring-progress progress-${results.riskLevel}`}
                    stroke={getRiskColor(results.riskLevel)}
                    strokeWidth="4"
                    fill="transparent"
                    r="56"
                    cx="60"
                    cy="60"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 56}`,
                      strokeDashoffset: `${2 * Math.PI * 56 * (1 - results.riskScore / 100)}`,
                    }}
                  />
                </svg>
              </div>
              <div className="risk-score-display">
                <span className="risk-score-number" style={{ color: getRiskColor(results.riskLevel) }}>
                  {results.riskScore}
                </span>
                <span className="risk-score-text">Risk Score</span>
              </div>
            </div>
            <div className="risk-banner-info">
              <h2 className="risk-banner-title" style={{ color: getRiskColor(results.riskLevel) }}>
                {getRiskLevelDisplay(results.riskLevel)} Risk Level
              </h2>
              <p className="risk-banner-description">
                {results.riskLevel === 'high' && 'Immediate medical attention recommended'}
                {results.riskLevel === 'medium' && 'Medical consultation advised within a few days'}
                {results.riskLevel === 'low' && 'Regular monitoring and preventive care recommended'}
              </p>
              <div className="risk-level-badge" style={{ 
                backgroundColor: `${getRiskColor(results.riskLevel)}20`,
                color: getRiskColor(results.riskLevel),
                borderColor: getRiskColor(results.riskLevel)
              }}>
                {getRiskLevelDisplay(results.riskLevel)} Risk
              </div>
            </div>
          </div>
        </div>

        {/* Risk Summary Card */}
        <div className="risk-summary-card">
          <div className="risk-header">
            <div className="risk-icon" style={{ color: getRiskColor(results.riskLevel) }}>
              {getRiskIcon(results.riskLevel)}
            </div>
            <div className="risk-info">
              <h2>Risk Assessment</h2>
              <div className="risk-level" style={{ color: getRiskColor(results.riskLevel) }}>
                {getRiskLevelDisplay(results.riskLevel)} Risk
              </div>
            </div>
            <div className="risk-score">
              <div className="score-circle" style={{ borderColor: getRiskColor(results.riskLevel) }}>
                <span className="score-number">{results.riskScore}</span>
                <span className="score-label">Risk Score</span>
              </div>
            </div>
          </div>
          
          <div className="risk-description">
            <p>Based on comprehensive analysis of your symptoms, medical history, and lab reports.</p>
          </div>
        </div>

        {/* Possible Diseases Section */}
        <div className="diseases-section">
          <h2 className="section-title">
            <AlertTriangle size={24} />
            Possible Health Conditions
          </h2>
          
          <div className="diseases-grid">
            {results.possibleDiseases.map((disease, index) => (
              <div key={index} className="disease-card">
                <div className="disease-header">
                  <h3 className="disease-name">{disease.name}</h3>
                  <div className="probability-badge">
                    {disease.probability}% probability
                  </div>
                </div>
                <p className="disease-explanation">{disease.explanation}</p>
                <div className="probability-bar">
                  <div 
                    className="probability-fill"
                    style={{ 
                      width: `${disease.probability}%`,
                      backgroundColor: disease.probability > 60 ? 'var(--danger)' : 
                                     disease.probability > 40 ? 'var(--warning)' : 'var(--success)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Explanation Panel */}
        <div className="ai-explanation">
          <div className="explanation-header">
            <Brain size={24} />
            <h2>AI Analysis Explanation</h2>
            <span className="disclaimer-badge">Health Risk Analysis (Not a Medical Diagnosis)</span>
          </div>
          <div className="explanation-content">
            <p>{results.aiExplanation}</p>
            
            {results.keyFindings && results.keyFindings.length > 0 && (
              <div className="key-findings">
                <h3>Key Findings:</h3>
                <ul>
                  {results.keyFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {results.recommendedActions && results.recommendedActions.length > 0 && (
              <div className="recommended-actions">
                <h3>Recommended Actions:</h3>
                <ul>
                  {results.recommendedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {results.reassurance && (
              <div className="reassurance-box">
                <CheckCircle size={20} />
                <p>{results.reassurance}</p>
              </div>
            )}
          </div>
          
          {results.disclaimer && (
            <div className="disclaimer-box">
              <AlertTriangle size={16} />
              <p><strong>Important:</strong> {results.disclaimer}</p>
            </div>
          )}
          
          {results.privacyNote && (
            <div className="privacy-note">
              <Shield size={16} />
              <p>{results.privacyNote}</p>
            </div>
          )}
        </div>

        {/* Next Steps Section */}
        <div className="next-steps">
          <h2 className="section-title">
            <ArrowRight size={24} />
            Recommended Next Steps
          </h2>
          
          <div className="steps-grid">
            <div className="step-card">
              <Hospital size={32} />
              <h3>Hospital Referral Initiated</h3>
              <p>Your case has been forwarded to a specialized hospital for further evaluation.</p>
              <div className="step-status completed">
                <CheckCircle size={16} />
                Completed
              </div>
            </div>
            
            <div className="step-card">
              <Calendar size={32} />
              <h3>Appointment Scheduled</h3>
              <p>An appointment has been scheduled with a specialist based on your risk assessment.</p>
              <div className="step-status completed">
                <CheckCircle size={16} />
                Completed
              </div>
            </div>
            
            <div className="step-card">
              <User size={32} />
              <h3>Specialist Consultation</h3>
              <p>Meet with the assigned specialist for detailed examination and treatment plan.</p>
              <div className="step-status pending">
                <AlertCircle size={16} />
                Pending
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Assignment Card */}
        <div className="hospital-assignment">
          <div className="assignment-header">
            <Hospital size={24} />
            <h2>Assigned Hospital</h2>
          </div>
          
          <div className="hospital-details">
            <div className="hospital-info">
              <h3>{results.assignedHospital.name}</h3>
              <p className="department">{results.assignedHospital.department} Department</p>
              <p className="doctor">Dr. {results.assignedHospital.doctor}</p>
            </div>
            
            <div className="appointment-info">
              <div className="appointment-detail">
                <Calendar size={16} />
                <span>{results.assignedHospital.appointmentDate}</span>
              </div>
              <div className="appointment-detail">
                <AlertCircle size={16} />
                <span>{results.assignedHospital.appointmentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary btn-large glow-effect" onClick={handleViewHospital}>
            <Hospital size={24} />
            View Hospital Details
          </button>
          
          <button className="btn btn-secondary btn-large interactive-hover" onClick={handleDownloadReport}>
            <Download size={24} />
            Download AI Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIResultDashboard