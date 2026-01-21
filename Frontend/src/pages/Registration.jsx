import React from 'react';

const Registration = () => {
  return (
    <div className="registration-page">
      {/* Hero Section - Light blue background with main title and info cards */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            {/* Left side - Main Title */}
            <div className="hero-left">
              <h1 className="main-title">
                All India Open<br />
                Sales & Distribution<br />
                <span className="highlight-text">Challenge 2025</span>
              </h1>
              <div className="tagline">
                <p>Unleash Your Sales Instincts.</p>
                <p>Redefine Distribution Excellence.</p>
              </div>
            </div>

            {/* Right side - Info Cards */}
            <div className="hero-right">
              <div className="info-card">
                <h3>About the Challenge</h3>
                <p>Step into the ultimate test of sales mastery!</p>
                <p>
                  The All India Open Sales & Distribution Challenge 2025 
                  is a nationwide 8-level online simulation competition that 
                  challenges participants to make smart, data-driven, and customer-
                  centric business decisions—just like real-world sales leaders do.
                </p>
              </div>

              <div className="info-card">
                <h3>Who Can Participate</h3>
                <ul>
                  <li>Sales & Marketing Professionals</li>
                  <li>MBA / Management Students</li>
                  <li>Entrepreneurs & Channel Partners</li>
                  <li>FMCG, Consumer Goods, Industrial & B2B Enthusiasts</li>
                </ul>
              </div>

              <div className="info-card">
                <h3>Why Participate</h3>
                <ul>
                  <li>Experience real-world sales decision-making</li>
                  <li>Compete with india's top sales talent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Format Section - White background */}
      <section className="format-section">
        <div className="format-container">
          <div className="format-content">
            {/* Left side - Competition Format */}
            <div className="format-left">
              <h2>Competition Format</h2>
              <h3>An 8-Level Online Simulation Challenge</h3>
              
              <div className="levels-list">
                <div className="level-item">
                  <span className="level-number">1</span>
                  <span>Market Entry & Positioning</span>
                </div>
                <div className="level-item">
                  <span className="level-number">2</span>
                  <span>Channel Partner Selection</span>
                </div>
                <div className="level-item">
                  <span className="level-number">3</span>
                  <span>Sales Forecasting & Demand Planning</span>
                </div>
                <div className="level-item">
                  <span className="level-number">4</span>
                  <span>Route-to-Market Optimization</span>
                </div>
                <div className="level-item">
                  <span className="level-number">5</span>
                  <span>Pricing & Promotion Strategy</span>
                </div>
                <div className="level-item">
                  <span className="level-number">6</span>
                  <span>Channel Conflict Resolution</span>
                </div>
                <div className="level-item">
                  <span className="level-number">7</span>
                  <span>Tech-enabled Sales Execution</span>
                </div>
                <div className="level-item">
                  <span className="level-number">8</span>
                  <span>Business Growth Plan Presentation</span>
                </div>
              </div>
            </div>

            {/* Right side - Combined Key Dates and Registration */}
            <div className="format-right">
              <div className="combined-card">
                <div className="dates-section">
                  <h2>Key Dates</h2>
                  <div className="date-block">
                    <strong>Registrations Open</strong><br />
                    20 November 2025
                  </div>
                  <div className="date-block">
                    <strong>Simulation Challenge Begins</strong><br />
                    30 November 2025
                  </div>
                </div>

                <div className="registration-section">
                  <h2>How to Register</h2>
                  <p>Complete the registration form with the following required information:</p>
                  
                  <div className="steps-list">
                    <div className="step-item">
                      <span className="step-number">1</span>
                      <span>Select Participation Type</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">2</span>
                      <span>Enter Participant Names</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">3</span>
                      <span>Provide Team Name</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">4</span>
                      <span>Enter Leader's Email Address</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">5</span>
                      <span>Fill Institute Details</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">6</span>
                      <span>Enter Course and Batch</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">7</span>
                      <span>Choose Preferred Slot</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSeWAYY5iu_ULUFJN30e1b6Oqe1oWieXKULVR0WVaDc3uUVHtA/viewform?usp=publish-editor', '_blank')}
                    className="register-btn"
                  >
                    Start Registration Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="awards-section">
        <div className="awards-container">
          <h2>Awards & Recognition</h2>
          <div className="awards-grid">
            <div className="award-card">
              <h3>Top 10 Teams</h3>
              <div className="award-content-center">
                <div>
                  <p style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}><strong>National Recognition</strong></p>
                  <p style={{ fontSize: '1.15rem', marginTop: '0', marginBottom: '0.5rem' }}>&</p>
                  <p style={{ fontSize: '1.15rem', marginTop: '0' }}><strong>Certificates of Excellence</strong></p>
                </div>
              </div>
            </div>
            
            <div className="award-card award-card-highlighted">
              <h3>Top 5 Teams</h3>
              <div className="award-content-center">
                <div className="award-with-image">
                  <img 
                    src="https://omgrhnknkcpnlsxklvzy.supabase.co/storage/v1/object/sign/summitintro%20videp/WhatsApp%20Image%202025-11-16%20at%2022.38.56_e182b1f6.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MWQ0OGEwMS1iOGUwLTQ0NjYtODc0Mi1hY2I1NWY3MzFjYzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdW1taXRpbnRybyB2aWRlcC9XaGF0c0FwcCBJbWFnZSAyMDI1LTExLTE2IGF0IDIyLjM4LjU2X2UxODJiMWY2LmpwZyIsImlhdCI6MTc2MzQ0OTc5MCwiZXhwIjoxNzk0OTg1NzkwfQ.YMX-5l8fdMuBAGKH9qxiPr5en3fC7ehNzyBk-bB0Sp8" 
                    alt="Tales of Sales Book"
                    className="book-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <p>Receive <strong>"Tales of Sales"</strong> by <strong>Priyaranjan Kumar</strong></p>
                </div>
              </div>
            </div>
            
            <div className="award-card">
              <h3>Top 3 B-School Teams/Individuals</h3>
              <div className="award-content-center">
                <div>
                  <p style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Receive personal mentoring by</p>
                  <p style={{ fontSize: '1.15rem', marginTop: '0', marginBottom: '0.5rem' }}><strong>Priyaranjan Kumar</strong></p>
                  <p style={{ fontSize: '1.15rem', marginTop: '0', marginBottom: '0.5rem' }}>for Placement Interview Preparation</p>
                  <p style={{ fontSize: '1.15rem', marginTop: '0' }}>& Career Readiness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 atkind. All rights reserved.</p>
        <p>Powered by <a href="https://atkind.com" style={{ color: '#4285f4', fontWeight: '500' }}>atkind.com</a></p>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .registration-page {
          min-height: 100vh;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        /* Hero Section - Light Blue Background */
        .hero-section {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
          padding: 4rem 0;
          min-height: 70vh;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          min-height: 60vh;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #1a237e;
          line-height: 1.1;
          margin-bottom: 2rem;
        }

        .highlight-text {
          color: #4285f4;
        }

        .tagline {
          font-size: 1.25rem;
          color: #1a237e;
          font-weight: 500;
          line-height: 1.4;
        }

        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(66, 133, 244, 0.2);
        }

        .info-card h3 {
          color: #4285f4;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .info-card p {
          color: #424242;
          line-height: 1.5;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
        }

        .info-card li {
          color: #424242;
          padding: 0.25rem 0;
          position: relative;
          padding-left: 1rem;
          font-size: 1rem;
        }

        .info-card li::before {
          content: '•';
          color: #4285f4;
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        /* Format Section - White Background */
        .format-section {
          background: white;
          padding: 4rem 0;
          border-top: 1px solid #e0e0e0;
        }

        .format-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .format-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .format-left,
        .format-right {
          display: flex;
          flex-direction: column;
        }

        .format-left {
          min-height: 100%;
        }

        .format-right {
          min-height: 100%;
          justify-content: flex-start;
        }

        .format-left h2 {
          color: #1a237e;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .format-left h3 {
          color: #666;
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 2rem;
        }

        .levels-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-top: 1rem;
        }

        .level-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #4285f4;
          min-height: 3.5rem;
          font-size: 1rem;
        }

        .level-number {
          background: #4285f4;
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .format-right {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          justify-content: flex-start;
        }

        .combined-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid #e0e0e0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .dates-section {
          margin-bottom: 2rem;
        }

        .registration-section {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .dates-card,
        .registration-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid #e0e0e0;
        }

        .dates-section h2,
        .registration-section h2 {
          color: #4285f4;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .date-block {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 3px solid #4285f4;
          color: #424242;
          font-size: 1rem;
        }

        .registration-section p {
          color: #424242;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          font-size: 1rem;
        }

        .steps-list {
          margin-bottom: 2rem;
          flex-grow: 1;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          color: #424242;
          font-size: 1rem;
        }

        .step-number {
          background: #4285f4;
          color: white;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .register-btn {
          background: linear-gradient(135deg, #4285f4 0%, #1e88e5 100%);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(66, 133, 244, 0.4);
        }

        .register-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .register-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .register-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(66, 133, 244, 0.6);
        }

        .register-btn:active {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(66, 133, 244, 0.4);
        }

        /* Awards Section */
        .awards-section {
          background: linear-gradient(180deg, #f8f9fc 0%, #ffffff 100%);
          padding: 5rem 0;
          position: relative;
        }

        .awards-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
        }

        .awards-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .awards-section h2 {
          color: #1a237e;
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .awards-section h2::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #4285f4, #1e88e5);
          border-radius: 2px;
        }

        .awards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3.5rem;
        }

        .award-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(66, 133, 244, 0.1);
          text-align: center;
          display: flex;
          flex-direction: column;
          min-height: 450px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .award-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4285f4, #1e88e5);
        }

        .award-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(66, 133, 244, 0.15);
          border-color: rgba(66, 133, 244, 0.3);
        }

        .award-card-highlighted {
          background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
          border: 2px solid rgba(66, 133, 244, 0.2);
        }

        .award-card-highlighted::before {
          height: 5px;
          background: linear-gradient(90deg, #4285f4, #1e88e5, #4285f4);
        }

        .award-content-center {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          margin-top: 1rem;
        }

        .award-with-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .book-image {
          width: 150px;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .book-image:hover {
          transform: scale(1.08) rotate(2deg);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        .award-card h3 {
          color: #1a237e;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0;
          padding-top: 0.5rem;
          line-height: 1.3;
        }

        .award-card p {
          color: #424242;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        /* Footer */
        .footer {
          background: rgba(255, 255, 255, 0.9);
          padding: 2rem 0;
          text-align: center;
          color: #666;
          font-size: 0.875rem;
          border-top: 1px solid #e0e0e0;
        }

        .footer p {
          margin-bottom: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content,
          .format-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .awards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .main-title {
            font-size: 2.5rem;
          }

          .hero-section,
          .format-section,
          .awards-section {
            padding: 2rem 0;
          }

          .hero-container,
          .format-container,
          .awards-container {
            padding: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem;
          }

          .info-card,
          .dates-card,
          .registration-card,
          .award-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Registration;