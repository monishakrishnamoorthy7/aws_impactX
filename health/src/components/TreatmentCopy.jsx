import { useState } from 'react'
import { 
  Download, 
  Calendar, 
  Pill, 
  FileText, 
  Volume2, 
  Globe,
  CheckCircle,
  Clock,
  User,
  Hospital
} from 'lucide-react'
import './TreatmentCopy.css'

const TreatmentCopy = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [isPlaying, setIsPlaying] = useState(false)

  // Mock treatment data
  const treatmentData = {
    patientName: 'John Smith',
    patientId: 'P001',
    hospitalName: 'City General Hospital',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Endocrinology',
    treatmentDate: '2024-01-15',
    diagnosis: 'Type 2 Diabetes Mellitus',
    treatmentDetails: `Based on comprehensive evaluation including lab results and AI risk assessment, 
    the patient has been diagnosed with Type 2 Diabetes. The treatment plan includes lifestyle 
    modifications, dietary changes, and medication management. Regular monitoring of blood glucose 
    levels is essential for optimal management.`,
    medicines: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        duration: '3 months'
      },
      {
        name: 'Glipizide',
        dosage: '5mg',
        frequency: 'Once daily before breakfast',
        duration: '3 months'
      }
    ],
    followUpDate: '2024-02-15',
    followUpInstructions: [
      'Monitor blood glucose levels daily',
      'Follow prescribed diet plan',
      'Exercise for 30 minutes daily',
      'Take medications as prescribed',
      'Return for follow-up in 4 weeks'
    ],
    dietaryRecommendations: [
      'Reduce carbohydrate intake',
      'Increase fiber-rich foods',
      'Avoid sugary drinks and snacks',
      'Eat regular, balanced meals',
      'Stay hydrated with water'
    ]
  }

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'spanish', name: 'Español' },
    { code: 'french', name: 'Français' },
    { code: 'hindi', name: 'हिंदी' },
    { code: 'arabic', name: 'العربية' }
  ]

  const handleDownload = () => {
    // Create a more realistic prescription document
    const prescriptionHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Medical Prescription - ${treatmentData.patientName}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
            line-height: 1.6;
        }
        .prescription-header {
            text-align: center;
            border-bottom: 3px solid #2c5aa0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .hospital-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 5px;
        }
        .hospital-details {
            font-size: 14px;
            color: #666;
        }
        .prescription-body {
            max-width: 800px;
            margin: 0 auto;
        }
        .patient-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .patient-details, .doctor-details {
            flex: 1;
        }
        .label {
            font-weight: bold;
            color: #2c5aa0;
        }
        .diagnosis-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
        }
        .diagnosis-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
        }
        .rx-section {
            margin-bottom: 30px;
        }
        .rx-title {
            font-size: 20px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 20px;
            text-decoration: underline;
        }
        .medicine-item {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 4px solid #2c5aa0;
            background: #f8f9fa;
        }
        .medicine-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .medicine-details {
            font-size: 14px;
            color: #555;
        }
        .instructions-section {
            margin-bottom: 30px;
            padding: 20px;
            background: #fff3cd;
            border-radius: 8px;
            border: 1px solid #ffeaa7;
        }
        .instructions-title {
            font-size: 16px;
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
        }
        .instruction-item {
            margin-bottom: 5px;
            padding-left: 15px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
        }
        .doctor-signature {
            margin-top: 30px;
            text-align: right;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            width: 200px;
            margin: 20px 0 5px auto;
        }
        .date-issued {
            text-align: right;
            margin-top: 20px;
            font-size: 14px;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .prescription-body { max-width: none; }
        }
    </style>
</head>
<body>
    <div class="prescription-header">
        <div class="hospital-name">${treatmentData.hospitalName}</div>
        <div class="hospital-details">
            ${treatmentData.department} Department<br>
            123 Medical Center Drive, Downtown<br>
            Phone: +1 (555) 123-4567 | Email: appointments@citygeneral.com
        </div>
    </div>

    <div class="prescription-body">
        <div class="patient-info">
            <div class="patient-details">
                <div><span class="label">Patient Name:</span> ${treatmentData.patientName}</div>
                <div><span class="label">Patient ID:</span> ${treatmentData.patientId}</div>
                <div><span class="label">Date of Birth:</span> January 15, 1985</div>
                <div><span class="label">Gender:</span> Male</div>
            </div>
            <div class="doctor-details">
                <div><span class="label">Doctor:</span> ${treatmentData.doctorName}</div>
                <div><span class="label">Department:</span> ${treatmentData.department}</div>
                <div><span class="label">License No:</span> MD-2024-${Math.floor(Math.random() * 10000)}</div>
                <div><span class="label">Date:</span> ${new Date().toLocaleDateString()}</div>
            </div>
        </div>

        <div class="diagnosis-section">
            <div class="diagnosis-title">DIAGNOSIS</div>
            <div><strong>${treatmentData.diagnosis}</strong></div>
            <p>${treatmentData.treatmentDetails}</p>
        </div>

        <div class="rx-section">
            <div class="rx-title">℞ PRESCRIPTION</div>
            ${treatmentData.medicines.map((medicine, index) => `
                <div class="medicine-item">
                    <div class="medicine-name">${index + 1}. ${medicine.name} ${medicine.dosage}</div>
                    <div class="medicine-details">
                        <strong>Sig:</strong> ${medicine.frequency}<br>
                        <strong>Duration:</strong> ${medicine.duration}<br>
                        <strong>Quantity:</strong> ${medicine.duration === '3 months' ? '90 tablets' : '30 tablets'}<br>
                        <strong>Refills:</strong> 2
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="instructions-section">
            <div class="instructions-title">PATIENT INSTRUCTIONS</div>
            ${treatmentData.followUpInstructions.map(instruction => `
                <div class="instruction-item">• ${instruction}</div>
            `).join('')}
            
            <div style="margin-top: 15px;">
                <strong>Dietary Recommendations:</strong>
                ${treatmentData.dietaryRecommendations.map(diet => `
                    <div class="instruction-item">• ${diet}</div>
                `).join('')}
            </div>
        </div>

        <div class="footer">
            <div><strong>Next Appointment:</strong> ${treatmentData.followUpDate}</div>
            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                This prescription is generated based on AI analysis and medical evaluation.<br>
                For any questions or concerns, please contact the hospital immediately.
            </div>
        </div>

        <div class="doctor-signature">
            <div class="signature-line"></div>
            <div>${treatmentData.doctorName}</div>
            <div>${treatmentData.department} Specialist</div>
            <div class="date-issued">Date: ${new Date().toLocaleDateString()}</div>
        </div>
    </div>
</body>
</html>`;

    // Create and download the HTML file
    const blob = new Blob([prescriptionHTML], {
      type: 'text/html'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_${treatmentData.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    alert('Prescription downloaded successfully! You can open the HTML file in any browser or print it as PDF.');
  }

  const handleVoiceExplanation = () => {
    setIsPlaying(!isPlaying)
    
    if (!isPlaying) {
      // Simulate voice explanation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Your diagnosis is ${treatmentData.diagnosis}. ${treatmentData.treatmentDetails}`
        )
        utterance.rate = 0.8
        utterance.onend = () => setIsPlaying(false)
        speechSynthesis.speak(utterance)
      }
    } else {
      speechSynthesis.cancel()
    }
  }

  return (
    <div className="treatment-copy">
      <div className="container">
        {/* Header */}
        <div className="treatment-header">
          <div className="header-content">
            <FileText size={32} />
            <div>
              <h1>Treatment Details</h1>
              <p>Your personalized treatment plan and prescription</p>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="language-selector">
              <Globe size={20} />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="btn btn-secondary voice-btn"
              onClick={handleVoiceExplanation}
            >
              <Volume2 size={20} />
              {isPlaying ? 'Stop' : 'Listen'}
            </button>
          </div>
        </div>

        {/* Patient Info */}
        <div className="patient-card">
          <div className="patient-details">
            <div className="detail-item">
              <User size={20} />
              <div>
                <span className="label">Patient Name</span>
                <span className="value">{treatmentData.patientName}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <FileText size={20} />
              <div>
                <span className="label">Patient ID</span>
                <span className="value">{treatmentData.patientId}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <Hospital size={20} />
              <div>
                <span className="label">Hospital</span>
                <span className="value">{treatmentData.hospitalName}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <User size={20} />
              <div>
                <span className="label">Doctor</span>
                <span className="value">{treatmentData.doctorName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="treatment-section">
          <div className="section-header">
            <FileText size={24} />
            <h2>Diagnosis</h2>
          </div>
          <div className="diagnosis-card">
            <h3>{treatmentData.diagnosis}</h3>
            <p>{treatmentData.treatmentDetails}</p>
          </div>
        </div>

        {/* Medications */}
        <div className="treatment-section">
          <div className="section-header">
            <Pill size={24} />
            <h2>Prescribed Medications</h2>
          </div>
          <div className="medicines-grid">
            {treatmentData.medicines.map((medicine, index) => (
              <div key={index} className="medicine-card">
                <div className="medicine-header">
                  <h4>{medicine.name}</h4>
                  <span className="dosage">{medicine.dosage}</span>
                </div>
                <div className="medicine-details">
                  <div className="detail-row">
                    <span className="label">Frequency:</span>
                    <span className="value">{medicine.frequency}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Duration:</span>
                    <span className="value">{medicine.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up Instructions */}
        <div className="treatment-section">
          <div className="section-header">
            <Calendar size={24} />
            <h2>Follow-up Instructions</h2>
          </div>
          
          <div className="followup-card">
            <div className="followup-date">
              <Calendar size={20} />
              <div>
                <span className="label">Next Appointment</span>
                <span className="date">{treatmentData.followUpDate}</span>
              </div>
            </div>
            
            <div className="instructions-list">
              <h4>Important Instructions:</h4>
              {treatmentData.followUpInstructions.map((instruction, index) => (
                <div key={index} className="instruction-item">
                  <CheckCircle size={16} />
                  <span>{instruction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dietary Recommendations */}
        <div className="treatment-section">
          <div className="section-header">
            <FileText size={24} />
            <h2>Dietary Recommendations</h2>
          </div>
          
          <div className="diet-card">
            <div className="diet-list">
              {treatmentData.dietaryRecommendations.map((recommendation, index) => (
                <div key={index} className="diet-item">
                  <CheckCircle size={16} />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="notes-section">
          <div className="notes-card">
            <div className="notes-header">
              <Clock size={20} />
              <h3>Important Notes</h3>
            </div>
            <div className="notes-content">
              <p>• Take medications exactly as prescribed</p>
              <p>• Do not skip doses or stop medication without consulting your doctor</p>
              <p>• Contact the hospital immediately if you experience severe side effects</p>
              <p>• Keep all follow-up appointments for optimal treatment outcomes</p>
              <p>• This treatment plan is based on AI analysis and doctor's evaluation</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary btn-large glow-effect" onClick={handleDownload}>
            <Download size={24} />
            Download Prescription
          </button>
          
          <button className="btn btn-secondary btn-large interactive-hover" onClick={handleVoiceExplanation}>
            <Volume2 size={24} />
            {isPlaying ? 'Stop Audio' : 'Voice Explanation'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TreatmentCopy