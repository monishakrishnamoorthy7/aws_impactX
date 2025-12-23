import { useState } from 'react'
import { 
  Shield, 
  Users, 
  Hospital, 
  BarChart3, 
  Eye, 
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics')

  // Mock analytics data
  const analytics = {
    totalPatients: 1247,
    totalHospitals: 23,
    activeAnalyses: 156,
    completedTreatments: 892,
    highRiskCases: 89,
    averageRiskScore: 52,
    monthlyGrowth: 15.3,
    accuracyRate: 94.2
  }

  // Mock patient data (anonymized)
  const patientData = [
    { id: 'P***1', age: '40-50', gender: 'M', riskLevel: 'high', condition: 'Diabetes', hospital: 'City General' },
    { id: 'P***2', age: '30-40', gender: 'F', riskLevel: 'medium', condition: 'Hypertension', hospital: 'Metro Hospital' },
    { id: 'P***3', age: '50-60', gender: 'M', riskLevel: 'high', condition: 'Heart Disease', hospital: 'Central Medical' },
    { id: 'P***4', age: '20-30', gender: 'F', riskLevel: 'low', condition: 'Thyroid', hospital: 'City General' },
    { id: 'P***5', age: '60-70', gender: 'M', riskLevel: 'medium', condition: 'Kidney Disease', hospital: 'Metro Hospital' }
  ]

  // Mock hospital access control
  const hospitalAccess = [
    { hospital: 'City General Hospital', department: 'Endocrinology', accessLevel: 'Full', patientsAssigned: 45 },
    { hospital: 'Metro Hospital', department: 'Cardiology', accessLevel: 'Limited', patientsAssigned: 32 },
    { hospital: 'Central Medical Center', department: 'Nephrology', accessLevel: 'Full', patientsAssigned: 28 },
    { hospital: 'Regional Health Center', department: 'Internal Medicine', accessLevel: 'Limited', patientsAssigned: 19 }
  ]

  // Mock audit logs
  const auditLogs = [
    { timestamp: '2024-01-15 10:30', action: 'Patient Data Access', user: 'Dr. Johnson', hospital: 'City General', status: 'Success' },
    { timestamp: '2024-01-15 09:45', action: 'Treatment Submission', user: 'Dr. Smith', hospital: 'Metro Hospital', status: 'Success' },
    { timestamp: '2024-01-15 09:20', action: 'AI Analysis Request', user: 'System', hospital: 'N/A', status: 'Success' },
    { timestamp: '2024-01-15 08:55', action: 'Unauthorized Access Attempt', user: 'Unknown', hospital: 'N/A', status: 'Blocked' },
    { timestamp: '2024-01-15 08:30', action: 'Data Export', user: 'Admin', hospital: 'All', status: 'Success' }
  ]

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'var(--success)'
      case 'medium': return 'var(--warning)'
      case 'high': return 'var(--danger)'
      default: return 'var(--light-gray)'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'var(--success)'
      case 'Blocked': return 'var(--danger)'
      case 'Warning': return 'var(--warning)'
      default: return 'var(--light-gray)'
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <Shield size={32} />
            <div>
              <h1>Admin Dashboard</h1>
              <p>Centralized Data & Access Control</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{analytics.totalPatients}</span>
              <span className="stat-label">Total Patients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{analytics.totalHospitals}</span>
              <span className="stat-label">Hospitals</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={20} />
            Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'access' ? 'active' : ''}`}
            onClick={() => setActiveTab('access')}
          >
            <Settings size={20} />
            Access Control
          </button>
          <button 
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <Eye size={20} />
            Audit Logs
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            {/* Key Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">
                  <Users size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{analytics.activeAnalyses}</span>
                  <span className="metric-label">Active Analyses</span>
                </div>
                <div className="metric-trend positive">
                  <TrendingUp size={16} />
                  +12%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{analytics.completedTreatments}</span>
                  <span className="metric-label">Completed Treatments</span>
                </div>
                <div className="metric-trend positive">
                  <TrendingUp size={16} />
                  +8%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{analytics.highRiskCases}</span>
                  <span className="metric-label">High Risk Cases</span>
                </div>
                <div className="metric-trend negative">
                  <TrendingUp size={16} />
                  -5%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Activity size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{analytics.accuracyRate}%</span>
                  <span className="metric-label">AI Accuracy</span>
                </div>
                <div className="metric-trend positive">
                  <TrendingUp size={16} />
                  +2%
                </div>
              </div>
            </div>

            {/* Anonymized Patient Data */}
            <div className="data-section">
              <h2 className="section-title">
                <Users size={24} />
                Anonymized Patient Analytics
              </h2>
              
              <div className="data-table">
                <div className="table-header">
                  <div className="header-cell">Patient ID</div>
                  <div className="header-cell">Age Group</div>
                  <div className="header-cell">Gender</div>
                  <div className="header-cell">Risk Level</div>
                  <div className="header-cell">Condition</div>
                  <div className="header-cell">Hospital</div>
                </div>
                
                <div className="table-body">
                  {patientData.map((patient, index) => (
                    <div key={index} className="table-row">
                      <div className="cell">{patient.id}</div>
                      <div className="cell">{patient.age}</div>
                      <div className="cell">{patient.gender}</div>
                      <div className="cell">
                        <span 
                          className="risk-badge"
                          style={{ 
                            backgroundColor: `${getRiskColor(patient.riskLevel)}20`,
                            color: getRiskColor(patient.riskLevel)
                          }}
                        >
                          {patient.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="cell">{patient.condition}</div>
                      <div className="cell">{patient.hospital}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Access Control Tab */}
        {activeTab === 'access' && (
          <div className="tab-content">
            <div className="data-section">
              <h2 className="section-title">
                <Hospital size={24} />
                Hospital Access Control
              </h2>
              
              <div className="access-table">
                <div className="table-header">
                  <div className="header-cell">Hospital</div>
                  <div className="header-cell">Department</div>
                  <div className="header-cell">Access Level</div>
                  <div className="header-cell">Patients Assigned</div>
                  <div className="header-cell">Actions</div>
                </div>
                
                <div className="table-body">
                  {hospitalAccess.map((hospital, index) => (
                    <div key={index} className="table-row">
                      <div className="cell">
                        <div className="hospital-info">
                          <Hospital size={16} />
                          {hospital.hospital}
                        </div>
                      </div>
                      <div className="cell">{hospital.department}</div>
                      <div className="cell">
                        <span 
                          className={`access-badge ${hospital.accessLevel.toLowerCase()}`}
                        >
                          {hospital.accessLevel}
                        </span>
                      </div>
                      <div className="cell">{hospital.patientsAssigned}</div>
                      <div className="cell">
                        <button className="btn btn-secondary btn-sm">
                          <Settings size={14} />
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="tab-content">
            <div className="data-section">
              <h2 className="section-title">
                <Eye size={24} />
                System Audit Logs
              </h2>
              
              <div className="audit-table">
                <div className="table-header">
                  <div className="header-cell">Timestamp</div>
                  <div className="header-cell">Action</div>
                  <div className="header-cell">User</div>
                  <div className="header-cell">Hospital</div>
                  <div className="header-cell">Status</div>
                </div>
                
                <div className="table-body">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="table-row">
                      <div className="cell">{log.timestamp}</div>
                      <div className="cell">{log.action}</div>
                      <div className="cell">{log.user}</div>
                      <div className="cell">{log.hospital}</div>
                      <div className="cell">
                        <span 
                          className="status-badge"
                          style={{ color: getStatusColor(log.status) }}
                        >
                          {log.status === 'Success' && <CheckCircle size={14} />}
                          {log.status === 'Blocked' && <AlertTriangle size={14} />}
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard