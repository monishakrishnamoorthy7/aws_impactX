import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Filter,
  Search,
  Brain,
  Hospital
} from 'lucide-react'
import './HospitalDashboard.css'

const HospitalDashboard = () => {
  const navigate = useNavigate()
  const [filterRisk, setFilterRisk] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock patient data
  const [patients] = useState([
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      riskLevel: 'high',
      riskScore: 85,
      disease: 'Type 2 Diabetes',
      status: 'pending',
      assignedDate: '2024-01-10',
      symptoms: 'Fatigue, excessive thirst, frequent urination'
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      age: 38,
      riskLevel: 'medium',
      riskScore: 65,
      disease: 'Hypertension',
      status: 'in-progress',
      assignedDate: '2024-01-09',
      symptoms: 'Headaches, dizziness, chest pain'
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      age: 52,
      riskLevel: 'high',
      riskScore: 78,
      disease: 'Heart Disease',
      status: 'completed',
      assignedDate: '2024-01-08',
      symptoms: 'Chest pain, shortness of breath'
    },
    {
      id: 'P004',
      name: 'Emily Davis',
      age: 29,
      riskLevel: 'low',
      riskScore: 35,
      disease: 'Thyroid',
      status: 'pending',
      assignedDate: '2024-01-11',
      symptoms: 'Weight changes, fatigue, mood swings'
    },
    {
      id: 'P005',
      name: 'Robert Wilson',
      age: 61,
      riskLevel: 'medium',
      riskScore: 58,
      disease: 'Kidney Disease',
      status: 'in-progress',
      assignedDate: '2024-01-07',
      symptoms: 'Swelling, changes in urination'
    }
  ])

  const filteredPatients = patients.filter(patient => {
    const matchesRisk = filterRisk === 'all' || patient.riskLevel === filterRisk
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.disease.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRisk && matchesSearch
  })

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
      case 'pending': return 'var(--warning)'
      case 'in-progress': return 'var(--primary-green)'
      case 'completed': return 'var(--success)'
      default: return 'var(--light-gray)'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'in-progress': return <AlertTriangle size={16} />
      case 'completed': return <CheckCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const handleViewCase = (patient) => {
    navigate('/treatment-entry', { state: { patient } })
  }

  const stats = {
    total: patients.length,
    pending: patients.filter(p => p.status === 'pending').length,
    inProgress: patients.filter(p => p.status === 'in-progress').length,
    completed: patients.filter(p => p.status === 'completed').length,
    highRisk: patients.filter(p => p.riskLevel === 'high').length
  }

  return (
    <div className="hospital-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <Hospital size={32} />
            <div>
              <h1>Hospital Dashboard</h1>
              <p>City General Hospital - Endocrinology Department</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Patients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{ color: 'var(--danger)' }}>{stats.highRisk}</span>
              <span className="stat-label">High Risk</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-title">Pending Cases</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon in-progress">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-title">In Progress</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon completed">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-title">Completed</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon high-risk">
              <Brain size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.highRisk}</span>
              <span className="stat-title">High Risk</span>
            </div>
          </div>
        </div>
        {/* Filters and Search */}
        <div className="controls-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search patients by name, ID, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <Filter size={20} />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Patient List */}
        <div className="patients-section">
          <h2 className="section-title">
            <Users size={24} />
            Assigned Patients ({filteredPatients.length})
          </h2>
          
          <div className="patients-table">
            <div className="table-header">
              <div className="header-cell">Patient Info</div>
              <div className="header-cell">Risk Level</div>
              <div className="header-cell">Condition</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Assigned Date</div>
              <div className="header-cell">Action</div>
            </div>
            
            <div className="table-body">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="table-row">
                  <div className="patient-info">
                    <div className="patient-name">{patient.name}</div>
                    <div className="patient-details">
                      ID: {patient.id} • Age: {patient.age}
                    </div>
                    <div className="patient-symptoms">{patient.symptoms}</div>
                  </div>
                  
                  <div className="risk-cell">
                    <div 
                      className={`risk-badge risk-${patient.riskLevel}`}
                      style={{ backgroundColor: `${getRiskColor(patient.riskLevel)}20`, color: getRiskColor(patient.riskLevel) }}
                    >
                      {patient.riskLevel.toUpperCase()}
                    </div>
                    <div className="risk-score">Score: {patient.riskScore}</div>
                  </div>
                  
                  <div className="condition-cell">
                    <div className="condition-name">{patient.disease}</div>
                  </div>
                  
                  <div className="status-cell">
                    <div 
                      className="status-badge"
                      style={{ color: getStatusColor(patient.status) }}
                    >
                      {getStatusIcon(patient.status)}
                      {patient.status.replace('-', ' ').toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="date-cell">
                    {patient.assignedDate}
                  </div>
                  
                  <div className="action-cell">
                    <button 
                      className="btn btn-primary view-btn"
                      onClick={() => handleViewCase(patient)}
                    >
                      <Eye size={16} />
                      View Case
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="empty-state">
              <Users size={48} />
              <h3>No patients found</h3>
              <p>No patients match your current search and filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HospitalDashboard