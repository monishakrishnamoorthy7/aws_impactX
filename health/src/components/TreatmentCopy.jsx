import { useState } from 'react'
import { 
  Download, 
  Calendar, 
  Pill, 
  FileText, 
  Volume2, 
  Globe,
  CheckCircle,
  Clock,
  User,
  Hospital
} from 'lucide-react'
import './TreatmentCopy.css'

const TreatmentCopy = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [isPlaying, setIsPlaying] = useState(false)

  // Mock treatment data
  const treatmentData = {
    patientName: 'John Smith',
    patientId: 'P001',
    hospitalName: 'City General Hospital',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Endocrinology',
    treatmentDate: '2024-01-15',
    diagnosis: 'Type 2 Diabetes Mellitus',
    treatmentDetails: `Based on comprehensive evaluation including lab results and AI risk assessment, 
    the patient has been diagnosed with Type 2 Diabetes. The treatment plan includes lifestyle 
    modifications, dietary changes, and medication management. Regular monitoring of blood glucose 
    levels is essential for optimal management.`,
    medicines: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        duration: '3 months'
      },
      {
        name: 'Glipizide',
        dosage: '5mg',
        frequency: 'Once daily before breakfast',
        duration: '3 months'
      }
    ],
    followUpDate: '2024-02-15',
    followUpInstructions: [
      'Monitor blood glucose levels daily',
      'Follow prescribed diet plan',
      'Exercise for 30 minutes daily',
      'Take medications as prescribed',
      'Return for follow-up in 4 weeks'
    ],
    dietaryRecommendations: [
      'Reduce carbohydrate intake',
      'Increase fiber-rich foods',
      'Avoid sugary drinks and snacks',
      'Eat regular, balanced meals',
      'Stay hydrated with water'
    ]
  }

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'spanish', name: 'Español' },
    { code: 'french', name: 'Français' },
    { code: 'hindi', name: 'हिंदी' },
    { code: 'arabic', name: 'العربية' }
  ]

  const handleDownload = () => {
    // Simulate prescription download
    const prescriptionData = {
      ...treatmentData,
      downloadedAt: new Date().toISOString(),
      language: selectedLanguage
    }
    
    const blob = new Blob([JSON.stringify(prescriptionData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prescription-${treatmentData.patientId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleVoiceExplanation = () => {
    setIsPlaying(!isPlaying)
    
    if (!isPlaying) {
      // Simulate voice explanation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Your diagnosis is ${treatmentData.diagnosis}. ${treatmentData.treatmentDetails}`
        )
        utterance.rate = 0.8
        utterance.onend = () => setIsPlaying(false)
        speechSynthesis.speak(utterance)
      }
    } else {
      speechSynthesis.cancel()
    }
  }

  return (
    <div className="treatment-copy">
      <div className="container">
        {/* Header */}
        <div className="treatment-header">
          <div className="header-content">
            <FileText size={32} />
            <div>
              <h1>Treatment Details</h1>
              <p>Your personalized treatment plan and prescription</p>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="language-selector">
              <Globe size={20} />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="btn btn-secondary voice-btn"
              onClick={handleVoiceExplanation}
            >
              <Volume2 size={20} />
              {isPlaying ? 'Stop' : 'Listen'}
            </button>
          </div>
        </div>

        {/* Patient Info */}
        <div className="patient-card">
          <div className="patient-details">
            <div className="detail-item">
              <User size={20} />
              <div>
                <span className="label">Patient Name</span>
                <span className="value">{treatmentData.patientName}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <FileText size={20} />
              <div>
                <span className="label">Patient ID</span>
                <span className="value">{treatmentData.patientId}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <Hospital size={20} />
              <div>
                <span className="label">Hospital</span>
                <span className="value">{treatmentData.hospitalName}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <User size={20} />
              <div>
                <span className="label">Doctor</span>
                <span className="value">{treatmentData.doctorName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="treatment-section">
          <div className="section-header">
            <FileText size={24} />
            <h2>Diagnosis</h2>
          </div>
          <div className="diagnosis-card">
            <h3>{treatmentData.diagnosis}</h3>
            <p>{treatmentData.treatmentDetails}</p>
          </div>
        </div>

        {/* Medications */}
        <div className="treatment-section">
          <div className="section-header">
            <Pill size={24} />
            <h2>Prescribed Medications</h2>
          </div>
          <div className="medicines-grid">
            {treatmentData.medicines.map((medicine, index) => (
              <div key={index} className="medicine-card">
                <div className="medicine-header">
                  <h4>{medicine.name}</h4>
                  <span className="dosage">{medicine.dosage}</span>
                </div>
                <div className="medicine-details">
                  <div className="detail-row">
                    <span className="label">Frequency:</span>
                    <span className="value">{medicine.frequency}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Duration:</span>
                    <span className="value">{medicine.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up Instructions */}
        <div className="treatment-section">
          <div className="section-header">
            <Calendar size={24} />
            <h2>Follow-up Instructions</h2>
          </div>
          
          <div className="followup-card">
            <div className="followup-date">
              <Calendar size={20} />
              <div>
                <span className="label">Next Appointment</span>
                <span className="date">{treatmentData.followUpDate}</span>
              </div>
            </div>
            
            <div className="instructions-list">
              <h4>Important Instructions:</h4>
              {treatmentData.followUpInstructions.map((instruction, index) => (
                <div key={index} className="instruction-item">
                  <CheckCircle size={16} />
                  <span>{instruction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dietary Recommendations */}
        <div className="treatment-section">
          <div className="section-header">
            <FileText size={24} />
            <h2>Dietary Recommendations</h2>
          </div>
          
          <div className="diet-card">
            <div className="diet-list">
              {treatmentData.dietaryRecommendations.map((recommendation, index) => (
                <div key={index} className="diet-item">
                  <CheckCircle size={16} />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="notes-section">
          <div className="notes-card">
            <div className="notes-header">
              <Clock size={20} />
              <h3>Important Notes</h3>
            </div>
            <div className="notes-content">
              <p>• Take medications exactly as prescribed</p>
              <p>• Do not skip doses or stop medication without consulting your doctor</p>
              <p>• Contact the hospital immediately if you experience severe side effects</p>
              <p>• Keep all follow-up appointments for optimal treatment outcomes</p>
              <p>• This treatment plan is based on AI analysis and doctor's evaluation</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary btn-large glow-effect" onClick={handleDownload}>
            <Download size={24} />
            Download Prescription
          </button>
          
          <button className="btn btn-secondary btn-large interactive-hover" onClick={handleVoiceExplanation}>
            <Volume2 size={24} />
            {isPlaying ? 'Stop Audio' : 'Voice Explanation'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TreatmentCopy