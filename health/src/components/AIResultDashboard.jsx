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
  FileText,
  ArrowRight,
  Shield
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
      case 'low': return 'var(--success)'
      case 'medium': return 'var(--warning)'
      case 'high': return 'var(--danger)'
      default: return 'var(--light-gray)'
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
    // Simulate report download
    const reportData = {
      patientInfo: patientData,
      analysisResults: results,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'health-analysis-report.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

        {/* Risk Summary Card */}
        <div className="risk-summary-card">
          <div className="risk-header">
            <div className="risk-icon" style={{ color: getRiskColor(results.riskLevel) }}>
              {getRiskIcon(results.riskLevel)}
            </div>
            <div className="risk-info">
              <h2>Risk Assessment</h2>
              <div className="risk-level" style={{ color: getRiskColor(results.riskLevel) }}>
                {results.riskLevel.toUpperCase()} RISK
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
              <p className="address">{results.assignedHospital.address}</p>
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