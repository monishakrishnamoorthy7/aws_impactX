import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import PatientDashboard from './components/PatientDashboard'
import PatientUpload from './components/PatientUpload'
import AIResultDashboard from './components/AIResultDashboard'
import HospitalNotification from './components/HospitalNotification'
import HospitalDashboard from './components/HospitalDashboard'
import TreatmentEntry from './components/TreatmentEntry'
import TreatmentCopy from './components/TreatmentCopy'
import AdminDashboard from './components/AdminDashboard'
import PatientLogin from './components/PatientLogin'
import PatientSignup from './components/PatientSignup'
import HospitalLogin from './components/HospitalLogin'
import HospitalSignup from './components/HospitalSignup'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient-signup" element={<PatientSignup />} />
          <Route path="/hospital-login" element={<HospitalLogin />} />
          <Route path="/hospital-signup" element={<HospitalSignup />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient-upload" element={<PatientUpload />} />
          <Route path="/ai-results" element={<AIResultDashboard />} />
          <Route path="/hospital-notification" element={<HospitalNotification />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/treatment-entry" element={<TreatmentEntry />} />
          <Route path="/treatment-copy" element={<TreatmentCopy />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
