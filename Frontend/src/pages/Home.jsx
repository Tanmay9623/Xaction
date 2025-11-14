import React from "react";
import { useNavigate } from "react-router-dom";
import { EvervaultCard, Icon } from "../components/ui/evervault-card";
import Chatbot from "../components/Chatbot/Chatbot";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="main-title">
              Demo Video and Brief about the simulation
            </h1>
            
            {/* Video Card */}
            <div className="video-card">
              <div className="video-container">
                <iframe
                  className="video-iframe"
                  src="https://www.youtube.com/embed/U89lSIFf16k?autoplay=1&mute=1&loop=1&playlist=U89lSIFf16k&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=1&playsinline=1&cc_load_policy=0&cc_lang_pref=en&widget_referrer=https://yourwebsite.com&origin=https://yourwebsite.com"
                  title="Simulation Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                
                {/* YouTube branding overlay */}
                <div className="youtube-overlay-1"></div>
                <div className="youtube-overlay-2"></div>
              </div>
              <div className="video-description">
                <p>
                  Experience the Area Manager Simulation – an immersive educational platform designed to help students 
                  understand real-world business management scenarios. Navigate through complex decision-making processes 
                  and build essential management skills in a safe learning environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="activities-section">
        <div className="activities-container">
          <div className="section-header">
            <h2 className="section-title">
              Our Coming Up Simulation & Other Activities
            </h2>
            <div className="title-underline"></div>
            <p className="section-description">
              Discover our upcoming interactive simulations designed to elevate your management skills
            </p>
          </div>

          <div className="activities-grid">
            {/* Card 1 - Team Management */}
            <div className="activity-card">
              <div className="card-icon">🎯</div>
              <h3>Team Management Simulation</h3>
              <p>
                Learn to manage diverse teams, allocate resources, and drive productivity in various business scenarios.
              </p>
              <div className="card-tags">
                <span className="tag">Leadership</span>
                <span className="tag">Teamwork</span>
              </div>
            </div>

            {/* Card 2 - Strategic Planning */}
            <div className="activity-card">
              <div className="card-icon">💡</div>
              <h3>Strategic Planning Workshop</h3>
              <p>
                Develop long-term strategic thinking skills through interactive planning exercises and real-world case studies.
              </p>
              <div className="card-tags">
                <span className="tag">Strategy</span>
                <span className="tag">Analysis</span>
              </div>
            </div>

            {/* Card 3 - Crisis Management */}
            <div className="activity-card">
              <div className="card-icon">⚡</div>
              <h3>Crisis Management Training</h3>
              <p>
                Master the art of making critical decisions under pressure and leading teams through challenging situations.
              </p>
              <div className="card-tags">
                <span className="tag">Decision Making</span>
                <span className="tag">Resilience</span>
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

      {/* Chatbot */}
      <Chatbot />

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .home-page {
          min-height: 100vh;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #1a237e 0%, #4285f4 50%, #90caf9 100%);
          padding: 4rem 0;
          min-height: 100vh;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero-content {
          text-align: center;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          line-height: 1.1;
          margin-bottom: 3rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .video-card {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: black;
          overflow: hidden;
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;
        }

        .youtube-overlay-1 {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 200px;
          height: 50px;
          background: linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
          pointer-events: none;
          z-index: 2;
        }

        .youtube-overlay-2 {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 120px;
          height: 40px;
          background: rgba(0,0,0,0.9);
          pointer-events: none;
          z-index: 3;
        }

        .video-description {
          padding: 2rem;
          background: white;
        }

        .video-description p {
          color: #424242;
          font-size: 1rem;
          line-height: 1.6;
          text-align: left;
        }

        /* Activities Section */
        .activities-section {
          background: white;
          padding: 4rem 0;
        }

        .activities-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          color: #1a237e;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .title-underline {
          width: 80px;
          height: 4px;
          background: linear-gradient(to right, #4285f4, #90caf9);
          margin: 0 auto 1.5rem auto;
          border-radius: 2px;
        }

        .section-description {
          color: #666;
          font-size: 1.125rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .activity-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(66, 133, 244, 0.2);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .activity-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #4285f4, #90caf9);
        }

        .activity-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .activity-card h3 {
          color: #1a237e;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .activity-card p {
          color: #424242;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .card-tags {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tag {
          background: #e3f2fd;
          color: #1565c0;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid #bbdefb;
        }

        /* Footer */
        .footer {
          background: #1a237e;
          padding: 2rem 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        .footer p {
          margin-bottom: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .main-title {
            font-size: 2.5rem;
          }

          .hero-section,
          .activities-section {
            padding: 2rem 0;
          }

          .hero-container,
          .activities-container {
            padding: 0 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .video-description {
            padding: 1.5rem;
          }

          .activity-card {
            padding: 1.5rem;
          }

          .activities-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem;
          }

          .video-description {
            padding: 1rem;
          }

          .activity-card {
            padding: 1.25rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .card-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;