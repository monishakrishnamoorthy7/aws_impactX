import { Link } from 'react-router-dom'
import { 
  Upload, 
  FileText, 
  Activity, 
  Calendar, 
  User,
  LogOut,
  Brain
} from 'lucide-react'
import './PatientDashboard.css'

const PatientDashboard = () => {
  return (
    <div className="patient-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <Brain size={32} />
            <div>
              <h1>Welcome to Your Health Dashboard</h1>
              <p>Manage your health assessments and view AI-powered insights</p>
            </div>
          </div>
          <Link to="/" className="btn btn-secondary">
            <LogOut size={20} />
            Logout
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/patient-upload" className="action-card primary">
              <Upload size={48} />
              <h3>Start Health Assessment</h3>
              <p>Upload lab reports and symptoms for AI analysis</p>
            </Link>
            
            <Link to="/ai-results" className="action-card">
              <Activity size={48} />
              <h3>View Results</h3>
              <p>Check your latest health risk assessments</p>
            </Link>
            
            <Link to="/treatment-copy" className="action-card">
              <FileText size={48} />
              <h3>Treatment History</h3>
              <p>Access your treatment plans and prescriptions</p>
            </Link>
            
            <Link to="/hospital-notification" className="action-card">
              <Calendar size={48} />
              <h3>Appointments</h3>
              <p>View scheduled hospital appointments</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard