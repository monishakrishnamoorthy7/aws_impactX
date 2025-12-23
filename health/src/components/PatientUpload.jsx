import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Upload, 
  MapPin, 
  Clock, 
  FileText, 
  Heart, 
  Utensils, 
  Moon, 
  Shield,
  CheckCircle,
  AlertCircle,
  Brain
} from 'lucide-react'
import './PatientUpload.css'

const PatientUpload = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    symptoms: '',
    symptomDuration: '',
    dietPattern: '',
    frequentOutsideFood: false,
    sleepDuration: '',
    sleepQuality: '',
    nightShifts: false,
    uploadedFiles: [],
    medicalHistory: [],
    otherIllness: '',
    city: '',
    autoDetectLocation: false,
    consent: false
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const totalSteps = 8
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }))
  }

  const handleMedicalHistoryChange = (condition) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(item => item !== condition)
        : [...prev.medicalHistory, condition]
    }))
  }
  const isStepValid = (step) => {
    switch (step) {
      case 1: return formData.symptoms && formData.symptomDuration
      case 2: return formData.dietPattern
      case 3: return formData.sleepDuration && formData.sleepQuality
      case 4: return formData.uploadedFiles.length > 0
      case 5: return formData.medicalHistory.length > 0
      case 6: return formData.city
      case 7: return true // AI info section
      case 8: return formData.consent
      default: return false
    }
  }

  const canProceed = () => {
    for (let i = 1; i <= currentStep; i++) {
      if (!isStepValid(i)) return false
    }
    return true
  }

  const handleAnalyze = async () => {
    if (!canProceed()) return
    
    setIsAnalyzing(true)
    
    try {
      // Send to backend for RAG + Gemini analysis
      const response = await fetch('http://localhost:3001/api/analyze-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResult = await response.json();
      
      // Navigate to results with analysis data
      navigate('/ai-results', { 
        state: { 
          patientData: formData,
          analysisResult: analysisResult 
        } 
      });
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze health data. Please try again.');
      setIsAnalyzing(false);
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <FileText className="step-icon" />
              <h2>Current Symptoms</h2>
              <span className="required">*Required</span>
            </div>
            
            <div className="form-group">
              <label className="form-label">Describe your symptoms</label>
              <textarea
                className="form-input"
                placeholder="Describe your symptoms (e.g., fatigue, headache, chest pain)"
                value={formData.symptoms}
                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Symptom Duration</label>
              <select
                className="form-input"
                value={formData.symptomDuration}
                onChange={(e) => handleInputChange('symptomDuration', e.target.value)}
              >
                <option value="">Select duration</option>
                <option value="less-than-1-week">Less than 1 week</option>
                <option value="1-2-weeks">1–2 weeks</option>
                <option value="1-month">1 month</option>
                <option value="more-than-1-month">More than 1 month</option>
              </select>
              <p className="helper-text">Mention when the symptoms started.</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <Utensils className="step-icon" />
              <h2>Diet & Food Habits</h2>
              <span className="required">*Required</span>
            </div>
            
            <div className="diet-options">
              {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Mixed', 'High-sugar diet', 'High-fat diet'].map(diet => (
                <div
                  key={diet}
                  className={`diet-card ${formData.dietPattern === diet ? 'selected' : ''}`}
                  onClick={() => handleInputChange('dietPattern', diet)}
                >
                  <div className="diet-name">{diet}</div>
                </div>
              ))}
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.frequentOutsideFood}
                  onChange={(e) => handleInputChange('frequentOutsideFood', e.target.checked)}
                />
                <span className="checkmark"></span>
                Frequent outside food
              </label>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <Moon className="step-icon" />
              <h2>Sleep Pattern</h2>
              <span className="required">*Required</span>
            </div>
            
            <div className="form-group">
              <label className="form-label">Average Sleep Duration</label>
              <select
                className="form-input"
                value={formData.sleepDuration}
                onChange={(e) => handleInputChange('sleepDuration', e.target.value)}
              >
                <option value="">Select duration</option>
                <option value="less-than-5">Less than 5 hours</option>
                <option value="5-7">5–7 hours</option>
                <option value="7-9">7–9 hours</option>
                <option value="more-than-9">More than 9 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sleep Quality</label>
              <div className="radio-group">
                {['Poor', 'Moderate', 'Good'].map(quality => (
                  <label key={quality} className="radio-label">
                    <input
                      type="radio"
                      name="sleepQuality"
                      value={quality}
                      checked={formData.sleepQuality === quality}
                      onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
                    />
                    <span className="radio-mark"></span>
                    {quality}
                  </label>
                ))}
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.nightShifts}
                  onChange={(e) => handleInputChange('nightShifts', e.target.checked)}
                />
                <span className="checkmark"></span>
                Night shifts / irregular sleep
              </label>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="step-content">
            <div className="step-header">
              <Upload className="step-icon" />
              <h2>Medical Reports Upload</h2>
              <span className="required">*Required</span>
            </div>
            
            <div className="upload-section">
              <div className="upload-box">
                <Upload size={48} />
                <h3>Full Body Checkup Report</h3>
                <p>Drag and drop files here or click to browse</p>
                <p className="file-types">Accepted formats: PDF, JPG, PNG</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                  className="file-input"
                />
              </div>
              
              {formData.uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  <h4>Uploaded Files:</h4>
                  {formData.uploadedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <CheckCircle size={16} />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {formData.uploadedFiles.length === 0 && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  Full body scan report is required to continue.
                </div>
              )}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="step-content">
            <div className="step-header">
              <Heart className="step-icon" />
              <h2>Past Medical History</h2>
              <span className="required">*Required</span>
            </div>
            
            <div className="medical-history">
              {['Diabetes', 'Hypertension', 'Thyroid', 'Heart Disease', 'Asthma', 'Kidney Disease', 'None'].map(condition => (
                <label key={condition} className="checkbox-label medical-condition">
                  <input
                    type="checkbox"
                    checked={formData.medicalHistory.includes(condition)}
                    onChange={() => handleMedicalHistoryChange(condition)}
                  />
                  <span className="checkmark"></span>
                  {condition}
                </label>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Any other past illness or surgery</label>
              <textarea
                className="form-input"
                placeholder="Describe any other medical conditions or surgeries"
                value={formData.otherIllness}
                onChange={(e) => handleInputChange('otherIllness', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="step-content">
            <div className="step-header">
              <MapPin className="step-icon" />
              <h2>Location Details</h2>
              <span className="required">*Required</span>
            </div>
            
            <div className="form-group">
              <label className="form-label">City / Region</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your city or region"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.autoDetectLocation}
                  onChange={(e) => handleInputChange('autoDetectLocation', e.target.checked)}
                />
                <span className="checkmark"></span>
                Auto-detect location
              </label>
            </div>

            <div className="info-text">
              <MapPin size={16} />
              Location is used to analyze climate-related health risks.
            </div>
          </div>
        )

      case 7:
        return (
          <div className="step-content">
            <div className="step-header">
              <Brain className="step-icon" />
              <h2>Climate & Symptom Analysis</h2>
              <span className="auto-info">Auto-Generated</span>
            </div>
            
            <div className="ai-info-card">
              <div className="climate-info">
                <h4>Current Climate:</h4>
                <div className="climate-details">
                  <div className="climate-item">
                    <span>Temperature:</span>
                    <span>28°C</span>
                  </div>
                  <div className="climate-item">
                    <span>Humidity:</span>
                    <span>65%</span>
                  </div>
                  <div className="climate-item">
                    <span>Air Quality Index:</span>
                    <span>Moderate (AQI: 85)</span>
                  </div>
                </div>
              </div>
              
              <div className="symptom-summary">
                <h4>Symptom Duration Summary:</h4>
                <p>Symptoms present for: {formData.symptomDuration?.replace('-', ' ')}</p>
              </div>
              
              <div className="ai-analysis">
                <Brain size={20} />
                <span>AI will analyze climate impact on symptoms</span>
              </div>
            </div>
          </div>
        )
      case 8:
        return (
          <div className="step-content">
            <div className="step-header">
              <Shield className="step-icon" />
              <h2>Consent & Privacy</h2>
              <span className="required">*Required</span>
            </div>
            
            <div className="consent-section">
              <div className="checkbox-group">
                <label className="checkbox-label consent-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => handleInputChange('consent', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  I consent to AI-based analysis of my health data
                </label>
              </div>
              
              <div className="privacy-links">
                <a href="#privacy" className="privacy-link">Privacy Policy</a>
              </div>
              
              <div className="consent-info">
                <Shield size={16} />
                <p>Your data is encrypted and processed securely. We follow medical-grade privacy standards.</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="patient-upload">
      <div className="container">
        {/* Header */}
        <div className="upload-header">
          <h1>Patient Health Intake</h1>
          <p>Complete your health assessment for AI-powered risk analysis</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Step Content */}
        <div className="upload-content">
          <div className="step-card">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation">
          {currentStep > 1 && (
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Previous
            </button>
          )}
          
          <div className="nav-spacer"></div>
          
          {currentStep < totalSteps ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!isStepValid(currentStep)}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-primary btn-xl glow-effect analyze-btn"
              onClick={handleAnalyze}
              disabled={!canProceed() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="loading loading-large"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain size={24} />
                  Analyze Health Risk with AI
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientUpload