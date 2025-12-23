import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Pill, 
  Calendar, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  User,
  Save
} from 'lucide-react'
import './TreatmentEntry.css'

const TreatmentEntry = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { patient } = location.state || {}
  
  const [treatmentData, setTreatmentData] = useState({
    diagnosis: '',
    treatmentDetails: '',
    medicines: '',
    followUpDate: '',
    prescriptionFiles: [],
    medicalEvidence: []
  })
  
  const [aiValidation, setAiValidation] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!patient) {
    navigate('/hospital-dashboard')
    return null
  }

  const handleInputChange = (field, value) => {
    setTreatmentData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Trigger AI validation when diagnosis or treatment changes
    if (field === 'diagnosis' || field === 'treatmentDetails') {
      validateTreatment(field === 'diagnosis' ? value : treatmentData.diagnosis, 
                       field === 'treatmentDetails' ? value : treatmentData.treatmentDetails)
    }
  }

  const validateTreatment = (diagnosis, treatment) => {
    if (!diagnosis || !treatment) {
      setAiValidation(null)
      return
    }

    // Simulate AI validation
    setTimeout(() => {
      const isConsistent = diagnosis.toLowerCase().includes(patient.disease.toLowerCase()) ||
                          treatment.toLowerCase().includes(patient.disease.toLowerCase())
      
      setAiValidation({
        isValid: isConsistent,
        message: isConsistent 
          ? "Treatment matches diagnosis and patient condition"
          : "Potential inconsistency detected between diagnosis and patient's AI-assessed condition"
      })
    }, 1000)
  }

  const handleFileUpload = (field, files) => {
    setTreatmentData(prev => ({
      ...prev,
      [field]: [...prev[field], ...files]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      
      // If AI validation shows inconsistency, show alert
      if (aiValidation && !aiValidation.isValid) {
        alert('AI detected potential inconsistency. Notifications sent to hospital and patient.')
      }
      
      navigate('/hospital-dashboard')
    }, 2000)
  }

  return (
    <div className="treatment-entry">
      <div className="container">
        {/* Patient Info Header */}
        <div className="patient-header">
          <div className="patient-info">
            <User size={24} />
            <div>
              <h2>{patient.name}</h2>
              <p>ID: {patient.id} • Age: {patient.age} • Risk: {patient.riskLevel.toUpperCase()}</p>
              <p className="ai-condition">AI Detected: {patient.disease}</p>
            </div>
          </div>
          <div className="risk-indicator">
            <div className={`risk-badge risk-${patient.riskLevel}`}>
              {patient.riskLevel.toUpperCase()} RISK
            </div>
            <div className="risk-score">Score: {patient.riskScore}</div>
          </div>
        </div>

        {/* Treatment Form */}
        <form onSubmit={handleSubmit} className="treatment-form">
          <div className="form-section">
            <div className="section-header">
              <FileText size={24} />
              <h3>Treatment Submission Form</h3>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Diagnosis <span className="required">*</span>
                </label>
                <textarea
                  className="form-input"
                  placeholder="Enter your diagnosis based on examination and tests"
                  value={treatmentData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Treatment Details <span className="required">*</span>
                </label>
                <textarea
                  className="form-input"
                  placeholder="Describe the treatment plan, procedures, and recommendations"
                  value={treatmentData.treatmentDetails}
                  onChange={(e) => handleInputChange('treatmentDetails', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Medicines Prescribed <span className="required">*</span>
                </label>
                <textarea
                  className="form-input"
                  placeholder="List all prescribed medications with dosage and frequency"
                  value={treatmentData.medicines}
                  onChange={(e) => handleInputChange('medicines', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Follow-up Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={treatmentData.followUpDate}
                  onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="form-section">
            <div className="section-header">
              <Upload size={24} />
              <h3>Upload Medical Evidence</h3>
            </div>

            <div className="upload-grid">
              <div className="upload-group">
                <label className="form-label">Prescription Proof</label>
                <div className="upload-box">
                  <Upload size={32} />
                  <p>Upload prescription documents</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('prescriptionFiles', Array.from(e.target.files))}
                    className="file-input"
                  />
                </div>
                {treatmentData.prescriptionFiles.length > 0 && (
                  <div className="uploaded-files">
                    {treatmentData.prescriptionFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <CheckCircle size={16} />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="upload-group">
                <label className="form-label">Medical Evidence</label>
                <div className="upload-box">
                  <Upload size={32} />
                  <p>Upload test results, X-rays, etc.</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('medicalEvidence', Array.from(e.target.files))}
                    className="file-input"
                  />
                </div>
                {treatmentData.medicalEvidence.length > 0 && (
                  <div className="uploaded-files">
                    {treatmentData.medicalEvidence.map((file, index) => (
                      <div key={index} className="file-item">
                        <CheckCircle size={16} />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Validation */}
          {aiValidation && (
            <div className={`ai-validation ${aiValidation.isValid ? 'valid' : 'invalid'}`}>
              <div className="validation-header">
                <Brain size={24} />
                <h3>AI Treatment Validation</h3>
              </div>
              <div className="validation-content">
                <div className="validation-icon">
                  {aiValidation.isValid ? (
                    <CheckCircle size={24} />
                  ) : (
                    <AlertTriangle size={24} />
                  )}
                </div>
                <div className="validation-message">
                  <p>{aiValidation.message}</p>
                  {!aiValidation.isValid && (
                    <div className="alert-actions">
                      <p className="alert-text">
                        <AlertTriangle size={16} />
                        AI detected possible wrong treatment. Notifications will be sent to hospital and patient.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/hospital-dashboard')}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary btn-large glow-effect submit-btn"
              disabled={isSubmitting || !treatmentData.diagnosis || !treatmentData.treatmentDetails}
            >
              {isSubmitting ? (
                <>
                  <div className="loading loading-large"></div>
                  Submitting Treatment...
                </>
              ) : (
                <>
                  <Save size={24} />
                  Submit Treatment Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TreatmentEntry