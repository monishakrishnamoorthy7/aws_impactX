import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Hospital, Lock, Mail, Phone, Brain, Eye, EyeOff, Building, User } from 'lucide-react'
import './Login.css'

const HospitalSignup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    hospitalName: '',
    contactPerson: '',
    email: '',
    phone: '',
    licenseNumber: '',
    department: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (!formData.agreeTerms) {
      alert('Please agree to terms and conditions')
      return
    }
    // Simulate signup and redirect to hospital dashboard
    navigate('/hospital-dashboard')
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card signup-card hospital-signup">
          <div className="login-header">
            <Brain className="logo-icon" />
            <h1>Hospital Registration</h1>
            <p>Register your medical facility</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Building size={16} />
                  Hospital Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter hospital name"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Contact Person
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} />
                  Hospital Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter hospital email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Hospital size={16} />
                  License Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter medical license number"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Building size={16} />
                  Department
                </label>
                <select
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="endocrinology">Endocrinology</option>
                  <option value="nephrology">Nephrology</option>
                  <option value="internal-medicine">Internal Medicine</option>
                  <option value="general-medicine">General Medicine</option>
                  <option value="emergency">Emergency Medicine</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  Password
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  Confirm Password
                </label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  required
                />
                <span className="checkmark"></span>
                I agree to the <Link to="#terms" className="link">Terms & Conditions</Link> and <Link to="#privacy" className="link">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-large glow-effect login-btn">
              <Hospital size={24} />
              Register Hospital
            </button>
          </form>

          <div className="login-footer">
            <p>Already registered? <Link to="/hospital-login" className="link">Sign In</Link></p>
            <Link to="/" className="link">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospitalSignup