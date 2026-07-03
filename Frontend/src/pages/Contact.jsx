import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Chatbot from "../components/Chatbot/Chatbot";

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Mouse Enter Context for 3D effect
const MouseEnterContext = React.createContext(undefined);

// WobbleCard Component
const WobbleCard = ({ children, containerClassName, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn("mx-auto w-full relative rounded-2xl overflow-hidden", containerClassName)}
    >
      <div
        className="relative h-full sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full px-6 py-8", className)}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Create mailto URL for help@xaction.in
      const emailBody = `
Name: ${formData.fullName}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
      `.trim();

      const emailSubject = `Contact Form: ${formData.subject}`;
      const mailtoUrl = `mailto:help@xaction.in?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // Open mailto link
      window.open(mailtoUrl, '_blank');

      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="main-title"
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="tagline"
            >
              Have questions about our consulting services? Need support or want to discuss partnerships? We're here to help and would love to hear from you.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="content-container">
          {/* Contact Form */}
          <div className="form-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly</p>
                {submitStatus === 'success' && (
                  <div className="status-message success">
                    Message sent successfully!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="status-message error">
                    There was an error. Please try again or contact us directly.
                  </div>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    required
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    required
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="What's this about?"
                  required
                  className="form-input"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows={5}
                  name="message"
                  placeholder="Tell us how we can help you..."
                  required
                  className="form-input form-textarea"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>

          {/* Support Options */}
          <div className="section-wrapper">
            <h2 className="section-title">How We Can Help You</h2>
            <div className="support-grid">
              <div className="support-card">
                <div className="support-icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3>24/7 Support Chat</h3>
                <p>Get instant help through our live chat support available around the clock.</p>
              </div>
              
              <div className="support-card">
                <div className="support-icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3>Knowledge Base</h3>
                <p>Find answers to common questions in our comprehensive documentation.</p>
              </div>
              
              <div className="support-card">
                <div className="support-icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Expert Consultation</h3>
                <p>Schedule a one-on-one consultation with our consulting experts.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-card">
            <h2>Ready to Transform Your Business?</h2>
            <p>Skip the wait and discover how our consulting expertise can drive your success.</p>
            <div className="cta-buttons">
              <button 
                onClick={() => {
                  navigate('/simulation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cta-btn primary"
              >
                Start Your Journey
              </button>
              <button 
                onClick={() => {
                  navigate('/about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cta-btn secondary"
              >
                Learn More
              </button>
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

        .contact-page {
          min-height: 100vh;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
          padding: 4rem 0;
          min-height: 40vh;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #1a237e;
          line-height: 1.1;
          margin-bottom: 2rem;
        }

        .tagline {
          font-size: 1.125rem;
          color: #424242;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Content Section */
        .content-section {
          background: white;
          padding: 4rem 0;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .form-card {
          background: linear-gradient(135deg, #4285f4 0%, #1565c0 100%);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          color: white;
        }

        .contact-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          opacity: 0.9;
          font-size: 1rem;
        }

        .status-message {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-message.success {
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.5);
          color: #4caf50;
        }

        .status-message.error {
          background: rgba(244, 67, 54, 0.2);
          border: 1px solid rgba(244, 67, 54, 0.5);
          color: #f44336;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          opacity: 0.9;
        }

        .form-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.95);
          color: #424242;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: white;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          width: 100%;
          background: white;
          color: #4285f4;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #f5f5f5;
          transform: translateY(-2px);
        }

        .section-wrapper {
          width: 100%;
        }

        .section-title {
          color: #1a237e;
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
        }

        .support-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .support-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(66, 133, 244, 0.2);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .support-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .support-icon {
          color: #4285f4;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .support-card h3 {
          color: #1a237e;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .support-card p {
          color: #424242;
          line-height: 1.5;
          font-size: 1rem;
        }

        .cta-card {
          background: linear-gradient(135deg, #1a237e 0%, #4285f4 100%);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          color: white;
        }

        .cta-card h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-card p {
          font-size: 1.125rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .cta-btn.primary {
          background: white;
          color: #4285f4;
        }

        .cta-btn.primary:hover {
          background: #f5f5f5;
          transform: translateY(-2px);
        }

        .cta-btn.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .cta-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
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
          .main-title {
            font-size: 2.5rem;
          }

          .hero-section,
          .content-section {
            padding: 2rem 0;
          }

          .hero-container,
          .content-container {
            padding: 0 1rem;
          }

          .form-card,
          .support-card {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .support-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-btn {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem;
          }

          .form-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;