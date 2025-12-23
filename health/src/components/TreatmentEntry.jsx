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

  const getRiskLevelDisplay = (level) => {
    switch (level) {
      case 'low': return 'Low'
      case 'medium': return 'Medium'
      case 'high': return 'High'
      default: return 'Unknown'
    }
  }

  const sendEmailNotification = async (patientEmail, treatmentData, patient) => {
    // Simulate sending email notification
    const emailContent = {
      to: patientEmail,
      subject: `Treatment Plan Submitted - ${patient.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #00ff88; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .treatment-details { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #00ff88; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
            .btn { background: #00ff88; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🧠 AI Health Platform</h1>
            <h2>Treatment Plan Notification</h2>
          </div>
          
          <div class="content">
            <h3>Dear ${patient.name},</h3>
            
            <p>Your doctor has submitted a new treatment plan for your condition. Here are the details:</p>
            
            <div class="treatment-details">
              <h4>📋 Patient Information</h4>
              <p><strong>Name:</strong> ${patient.name}</p>
              <p><strong>Patient ID:</strong> ${patient.id}</p>
              <p><strong>Age:</strong> ${patient.age}</p>
              <p><strong>Risk Level:</strong> ${patient.riskLevel.toUpperCase()}</p>
              <p><strong>AI Detected Condition:</strong> ${patient.disease}</p>
            </div>
            
            <div class="treatment-details">
              <h4>🩺 Treatment Details</h4>
              <p><strong>Diagnosis:</strong> ${treatmentData.diagnosis}</p>
              <p><strong>Treatment Plan:</strong> ${treatmentData.treatmentDetails}</p>
              <p><strong>Prescribed Medicines:</strong> ${treatmentData.medicines}</p>
              <p><strong>Follow-up Date:</strong> ${treatmentData.followUpDate}</p>
            </div>
            
            <div class="treatment-details">
              <h4>📄 Uploaded Documents</h4>
              <p><strong>Prescription Files:</strong> ${treatmentData.prescriptionFiles.length} file(s) uploaded</p>
              <p><strong>Medical Evidence:</strong> ${treatmentData.medicalEvidence.length} file(s) uploaded</p>
            </div>
            
            <p>Please log in to your patient dashboard to view complete details and download your prescription.</p>
            
            <a href="#" class="btn">View Treatment Plan</a>
            
            <p><strong>Important:</strong> Please follow the prescribed treatment plan and attend your follow-up appointment on the scheduled date.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from AI Health Platform</p>
            <p>City General Hospital - Endocrinology Department</p>
            <p>If you have any questions, please contact your healthcare provider</p>
          </div>
        </body>
        </html>
      `
    }
    
    // Log the email content (in real app, this would be sent via email service)
    console.log('📧 Email Notification Sent:', emailContent)
    
    // Show success message
    alert(`✅ Treatment plan submitted successfully!\n\n📧 Email notification sent to: ${patientEmail}\n\n📱 Patient dashboard updated with new treatment plan.`)
    
    return emailContent
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    setTimeout(async () => {
      setIsSubmitting(false)
      
      // Send email notification to patient
      const patientEmail = 'alamuvellakovil@gmail.com' // Using the provided email
      await sendEmailNotification(patientEmail, treatmentData, patient)
      
      // Store treatment plan in localStorage for patient dashboard
      const existingTreatments = JSON.parse(localStorage.getItem('patientTreatments') || '[]')
      const newTreatment = {
        id: Date.now(),
        patientId: patient.id,
        patientName: patient.name,
        patientEmail: patientEmail,
        diagnosis: treatmentData.diagnosis,
        treatmentDetails: treatmentData.treatmentDetails,
        medicines: treatmentData.medicines,
        followUpDate: treatmentData.followUpDate,
        prescriptionFiles: treatmentData.prescriptionFiles.length,
        medicalEvidence: treatmentData.medicalEvidence.length,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'active',
        riskLevel: patient.riskLevel,
        aiCondition: patient.disease
      }
      
      existingTreatments.push(newTreatment)
      localStorage.setItem('patientTreatments', JSON.stringify(existingTreatments))
      
      // If AI validation shows inconsistency, show additional alert
      if (aiValidation && !aiValidation.isValid) {
        alert('⚠️ AI detected potential inconsistency. Additional notifications sent to hospital administration and patient.')
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
              <p>ID: {patient.id} • Age: {patient.age} • Risk: {getRiskLevelDisplay(patient.riskLevel)}</p>
              <p className="ai-condition">AI Detected: {patient.disease}</p>
            </div>
          </div>
          <div className="risk-indicator">
            <div className={`risk-badge risk-${patient.riskLevel}`}>
              {getRiskLevelDisplay(patient.riskLevel)} Risk
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
              {/* Test Data Button for easier testing */}
              <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setTreatmentData({
                      diagnosis: `Patient diagnosed with ${patient.disease} based on AI analysis and clinical examination. Symptoms include ${patient.symptoms}. Risk level assessed as ${patient.riskLevel}.`,
                      treatmentDetails: `Comprehensive treatment plan for ${patient.disease} management. Includes lifestyle modifications, medication therapy, and regular monitoring. Patient education provided regarding condition management and warning signs.`,
                      medicines: `1. Metformin 500mg - Take twice daily with meals\n2. Lisinopril 10mg - Take once daily in morning\n3. Atorvastatin 20mg - Take once daily at bedtime\n4. Aspirin 81mg - Take once daily with food`,
                      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
                      prescriptionFiles: [],
                      medicalEvidence: []
                    })
                  }}
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Fill Sample Data (For Testing)
                </button>
              </div>

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
            
            {/* Show validation message if fields are missing */}
            {(!treatmentData.diagnosis || !treatmentData.treatmentDetails || !treatmentData.medicines || !treatmentData.followUpDate) && (
              <div className="validation-message" style={{ color: 'var(--warning)', fontSize: '14px', margin: '10px 0' }}>
                Please fill in all required fields: 
                {!treatmentData.diagnosis && ' Diagnosis'}
                {!treatmentData.treatmentDetails && ' Treatment Details'}
                {!treatmentData.medicines && ' Medicines'}
                {!treatmentData.followUpDate && ' Follow-up Date'}
              </div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary btn-large glow-effect submit-btn"
              disabled={isSubmitting || !treatmentData.diagnosis || !treatmentData.treatmentDetails || !treatmentData.medicines || !treatmentData.followUpDate}
              onClick={(e) => {
                console.log('Submit button clicked!', treatmentData)
                if (!treatmentData.diagnosis || !treatmentData.treatmentDetails || !treatmentData.medicines || !treatmentData.followUpDate) {
                  e.preventDefault()
                  alert('Please fill in all required fields before submitting.')
                  return
                }
              }}
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