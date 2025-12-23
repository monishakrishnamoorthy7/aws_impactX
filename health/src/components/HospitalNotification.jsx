import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Hospital, 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react'
import './HospitalNotification.css'

const HospitalNotification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { hospital, patientData, results } = location.state || {}

  const getRiskLevelDisplay = (level) => {
    switch (level) {
      case 'low': return 'Low'
      case 'medium': return 'Medium'
      case 'high': return 'High'
      default: return 'Unknown'
    }
  }

  if (!hospital) {
    navigate('/ai-results')
    return null
  }

  return (
    <div className="hospital-notification">
      <div className="hospital-notification-wrapper">
        <div className="container">
        {/* Success Banner */}
        <div className="success-banner">
          <CheckCircle size={24} />
          <div className="banner-content">
            <h2>Your case has been forwarded to a specialized hospital.</h2>
            <p>An appointment has been scheduled based on your AI risk assessment.</p>
          </div>
        </div>

        {/* Hospital Details Card */}
        <div className="hospital-card">
          <div className="hospital-header">
            <Hospital size={32} />
            <div className="hospital-info">
              <h1>{hospital.name}</h1>
              <p className="department">{hospital.department} Department</p>
            </div>
          </div>

          <div className="hospital-details">
            <div className="detail-section">
              <h3>Assigned Doctor</h3>
              <div className="detail-item">
                <User size={20} />
                <span>{hospital.doctor}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Appointment Details</h3>
              <div className="detail-item">
                <Calendar size={20} />
                <span>{hospital.appointmentDate}</span>
              </div>
              <div className="detail-item">
                <Clock size={20} />
                <span>{hospital.appointmentTime}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Hospital Location</h3>
              <div className="detail-item">
                <MapPin size={20} />
                <span>{hospital.address}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-item">
                <Phone size={20} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="detail-item">
                <Mail size={20} />
                <span>appointments@citygeneral.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="risk-summary">
          <h3>Your Risk Assessment Summary</h3>
          <div className="risk-items">
            <div className="risk-item">
              <span className="risk-label">Risk Level:</span>
              <span className={`risk-value risk-${results?.riskLevel}`}>
                {getRiskLevelDisplay(results?.riskLevel)}
              </span>
            </div>
            <div className="risk-item">
              <span className="risk-label">Risk Score:</span>
              <span className="risk-value">{results?.riskScore}/100</span>
            </div>
            <div className="risk-item">
              <span className="risk-label">Primary Concern:</span>
              <span className="risk-value">{results?.possibleDiseases?.[0]?.name}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>What to Expect</h3>
          <div className="steps-timeline">
            <div className="timeline-item completed">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>AI Analysis Complete</h4>
                <p>Your health data has been analyzed and risk assessment completed.</p>
              </div>
            </div>
            
            <div className="timeline-item completed">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Hospital Assignment</h4>
                <p>You've been assigned to {hospital.name} for specialized care.</p>
              </div>
            </div>
            
            <div className="timeline-item active">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Upcoming Appointment</h4>
                <p>Attend your scheduled appointment on {hospital.appointmentDate} at {hospital.appointmentTime}.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Treatment Plan</h4>
                <p>Receive personalized treatment recommendations from your specialist.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Instructions */}
        <div className="preparation-card">
          <h3>Prepare for Your Appointment</h3>
          <div className="preparation-list">
            <div className="prep-item">
              <CheckCircle size={16} />
              <span>Bring your original lab reports and medical documents</span>
            </div>
            <div className="prep-item">
              <CheckCircle size={16} />
              <span>Arrive 15 minutes early for registration</span>
            </div>
            <div className="prep-item">
              <CheckCircle size={16} />
              <span>Bring a list of current medications</span>
            </div>
            <div className="prep-item">
              <CheckCircle size={16} />
              <span>Prepare questions about your condition</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary btn-large glow-effect"
            onClick={() => navigate('/treatment-copy')}
          >
            <ArrowRight size={24} />
            View Treatment Updates
          </button>
          
          <button 
            className="btn btn-secondary btn-large interactive-hover"
            onClick={() => navigate('/ai-results')}
          >
            Back to Results
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default HospitalNotification