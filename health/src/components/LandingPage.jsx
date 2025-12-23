import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Upload, 
  Users, 
  Hospital, 
  ArrowRight, 
  Shield, 
  Brain, 
  Stethoscope,
  User,
  Bell,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  LogOut,
  Atom,
  Microscope,
  Dna,
  Activity,
  Zap,
  Target,
  Hexagon,
  Circle,
  Plus
} from 'lucide-react'
import './LandingPage.css'

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [user, setUser] = useState(null)

  // Mock user data - in real app, this would come from authentication context
  const mockUser = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Downtown, New York',
    avatar: 'JS',
    userType: 'patient' // or 'hospital'
  }

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'AI Analysis Complete',
      message: 'Your health risk assessment is ready',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Appointment Scheduled',
      message: 'Your appointment with Dr. Johnson is confirmed',
      time: '1 day ago',
      unread: true
    },
    {
      id: 3,
      title: 'Lab Results Available',
      message: 'Your recent lab results have been uploaded',
      time: '3 days ago',
      unread: false
    }
  ]

  useEffect(() => {
    // Check if user is logged in (in real app, check localStorage, context, etc.)
    const loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      setIsLoggedIn(true)
      setUser(JSON.parse(loggedInUser))
    } else {
      // For demo purposes, simulate login after 3 seconds
      setTimeout(() => {
        setIsLoggedIn(true)
        setUser(mockUser)
        localStorage.setItem('user', JSON.stringify(mockUser))
      }, 3000)
    }
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setShowProfileDropdown(false)
    localStorage.removeItem('user')
  }

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown)
    setShowNotifications(false)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowProfileDropdown(false)
  }
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Brain className="logo-icon" />
            <span className="logo-text">Smart Health Sentinel AI</span>
          </div>
          
          {isLoggedIn && user ? (
            <div className="header-user-section">
              <div className="user-welcome">
                <span className="welcome-text">Welcome back, {user.name.split(' ')[0]}!</span>
              </div>
              
              {/* Notifications */}
              <div className="notification-container">
                <button 
                  className="notification-btn"
                  onClick={toggleNotifications}
                >
                  <Bell size={20} />
                  <span className="notification-badge">
                    {notifications.filter(n => n.unread).length}
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="dropdown-header">
                      <h3>Notifications</h3>
                      <span className="notification-count">
                        {notifications.filter(n => n.unread).length} new
                      </span>
                    </div>
                    <div className="notifications-list">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        >
                          <div className="notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                          {notification.unread && <div className="unread-dot"></div>}
                        </div>
                      ))}
                    </div>
                    <div className="dropdown-footer">
                      <button className="view-all-btn">View All Notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="profile-container">
                <button 
                  className="profile-btn"
                  onClick={toggleProfileDropdown}
                >
                  <div className="profile-avatar">
                    {user.avatar}
                  </div>
                  <ChevronDown size={16} />
                </button>
                
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="profile-avatar-large">
                        {user.avatar}
                      </div>
                      <div className="profile-info">
                        <h3>{user.name}</h3>
                        <span className="user-type">{user.userType === 'patient' ? 'Patient' : 'Hospital'}</span>
                      </div>
                    </div>
                    
                    <div className="profile-details">
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{user.email}</span>
                      </div>
                      <div className="detail-item">
                        <Phone size={16} />
                        <span>{user.phone}</span>
                      </div>
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{user.location}</span>
                      </div>
                    </div>
                    
                    <div className="dropdown-footer">
                      <Link to="/patient-dashboard" className="profile-link">
                        <User size={16} />
                        View Dashboard
                      </Link>
                      <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <nav className="nav">
              <Link to="/patient-login" className="nav-link">Patient Login</Link>
              <Link to="/hospital-login" className="nav-link">Hospital Login</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Floating Decorative Elements */}
        <div className="floating-elements">
          <div className="floating-icon floating-icon-1">
            <Atom size={48} />
          </div>
          <div className="floating-icon floating-icon-2">
            <Microscope size={42} />
          </div>
          <div className="floating-icon floating-icon-3">
            <Dna size={45} />
          </div>
          <div className="floating-icon floating-icon-4">
            <Activity size={40} />
          </div>
          <div className="floating-icon floating-icon-5">
            <Zap size={42} />
          </div>
          <div className="floating-icon floating-icon-6">
            <Target size={38} />
          </div>
          <div className="floating-icon floating-icon-7">
            <Hexagon size={40} />
          </div>
          <div className="floating-icon floating-icon-8">
            <Circle size={36} />
          </div>
          <div className="floating-icon floating-icon-9">
            <Plus size={38} />
          </div>
          <div className="floating-icon floating-icon-10">
            <Atom size={40} />
          </div>
          <div className="floating-icon floating-icon-11">
            <Activity size={42} />
          </div>
          <div className="floating-icon floating-icon-12">
            <Circle size={34} />
          </div>
        </div>

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