import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Mail, Phone, Brain, Eye, EyeOff } from 'lucide-react'
import './Login.css'

const PatientSignup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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
    // Simulate signup and redirect to patient dashboard
    navigate('/patient-dashboard')
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card signup-card">
          <div className="login-header">
            <Brain className="logo-icon" />
            <h1>Patient Sign Up</h1>
            <p>Create your health account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
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
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

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
              <User size={24} />
              Create Patient Account
            </button>
          </form>

          <div className="login-footer">
            <p>Already have an account? <Link to="/patient-login" className="link">Sign In</Link></p>
            <Link to="/" className="link">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientSignup