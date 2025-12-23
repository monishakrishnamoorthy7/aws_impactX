import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Hospital, Lock, Mail, Brain, Shield } from 'lucide-react'
import './Login.css'

const HospitalLogin = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: login, 2: 2FA
  const [resendTimer, setResendTimer] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verificationCode: ['', '', '', '', '', '']
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      // Simulate sending 2FA code
      setStep(2)
      startResendTimer()
    } else {
      // Verify 2FA code and login
      const code = formData.verificationCode.join('')
      if (code.length === 6) {
        navigate('/hospital-dashboard')
      } else {
        alert('Please enter the complete verification code')
      }
    }
  }

  const startResendTimer = () => {
    setResendTimer(30)
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...formData.verificationCode]
      newCode[index] = value
      setFormData(prev => ({ ...prev, verificationCode: newCode }))
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name="hospital-code-${index + 1}"]`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleResendCode = () => {
    if (resendTimer === 0) {
      startResendTimer()
      // Simulate resending code
      alert('Verification code sent to your registered phone!')
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <Brain className="logo-icon" />
            <h1>Hospital Login</h1>
            <p>Access hospital dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {step === 1 ? (
              <>
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
                    <Lock size={16} />
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large glow-effect login-btn">
                  <Hospital size={24} />
                  Continue to Verification
                </button>
              </>
            ) : (
              <>
                <div className="two-factor-section">
                  <div className="two-factor-header">
                    <Shield size={20} />
                    <h3>Hospital Security Verification</h3>
                  </div>
                  <p style={{ color: 'var(--light-gray)', marginBottom: '20px', textAlign: 'center' }}>
                    Enter the 6-digit security code sent to your registered phone number
                  </p>
                  
                  <div className="verification-code-input">
                    {formData.verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        name={`hospital-code-${index}`}
                        className="code-digit"
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        maxLength="1"
                        required
                      />
                    ))}
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="resend-code"
                      onClick={handleResendCode}
                      disabled={resendTimer > 0}
                    >
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend security code'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-large glow-effect login-btn">
                  <Hospital size={24} />
                  Verify & Access Dashboard
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setStep(1)}
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  Back to Login
                </button>
              </>
            )}
          </form>

          <div className="login-footer">
            <p>Need access? <Link to="/hospital-signup" className="link">Register Hospital</Link></p>
            <Link to="/" className="link">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospitalLogin