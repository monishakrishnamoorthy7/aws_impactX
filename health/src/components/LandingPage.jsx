import { Link } from 'react-router-dom'
import { Upload, Users, Hospital, ArrowRight, Shield, Brain, Stethoscope } from 'lucide-react'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Brain className="logo-icon" />
            <span className="logo-text">Smart Health Sentinel AI</span>
          </div>
          <nav className="nav">
            <Link to="/patient-login" className="nav-link">Patient Login</Link>
            <Link to="/hospital-login" className="nav-link">Hospital Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Early Disease Detection Using AI
            </h1>
            <p className="hero-subtitle">
              Login to upload lab reports and symptoms to get early risk alerts and hospital referrals.
            </p>
            <div className="hero-buttons">
              <Link to="/patient-login" className="btn btn-primary btn-large glow-effect">
                <Users size={20} />
                Get Started - Patient Login
              </Link>
              <Link to="/hospital-login" className="btn btn-secondary btn-large interactive-hover">
                <Hospital size={20} />
                Hospital Login
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="ai-animation">
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <Brain size={80} className="brain-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Flow Section */}
      <section className="flow-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="flow-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">
                <Users size={40} />
              </div>
              <h3 className="step-title">Login & Upload Reports</h3>
              <p className="step-description">
                Create account or login, then share your lab reports and health information securely
              </p>
            </div>
            
            <ArrowRight className="flow-arrow" size={24} />
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <Brain size={40} />
              </div>
              <h3 className="step-title">AI Detects Disease Risk</h3>
              <p className="step-description">
                Advanced AI analyzes your data to identify potential health risks early
              </p>
            </div>
            
            <ArrowRight className="flow-arrow" size={24} />
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <Stethoscope size={40} />
              </div>
              <h3 className="step-title">Hospital Treatment & Follow-up</h3>
              <p className="step-description">
                Get connected to specialized hospitals for treatment and monitoring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <Shield size={48} />
              <h3>Secure & Private</h3>
              <p>Your health data is encrypted and protected with medical-grade security</p>
            </div>
            <div className="feature-card">
              <Brain size={48} />
              <h3>AI-Powered Analysis</h3>
              <p>Advanced machine learning algorithms for accurate risk assessment</p>
            </div>
            <div className="feature-card">
              <Hospital size={48} />
              <h3>Hospital Network</h3>
              <p>Connected to specialized hospitals for immediate care coordination</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="disclaimer">
            <Shield size={20} />
            <span>AI-assisted system. Not a replacement for doctors.</span>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage