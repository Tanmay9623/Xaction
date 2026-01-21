import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Chatbot from "../components/Chatbot/Chatbot";

// External image URLs from Google Drive
const imageUrls = {
  p1: "https://lh3.googleusercontent.com/d/1UjLW2Whs70tgO4lV6YP50ft66nUypM8G",
  p2: "https://lh3.googleusercontent.com/d/1ZEWjmr3KlV7iZmifIccoxHmLKvYZ0JMX",
  p3: "https://lh3.googleusercontent.com/d/1pCW5CXnznuJHzV9nGkSIXE37rxFPpVQq"
};

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// 3D Card Components
const MouseEnterContext = React.createContext(undefined);

const CardContainer = ({ children, className, containerClassName }) => {
  const containerRef = React.useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("py-8 flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("flex items-center justify-center relative transition-all duration-200 ease-linear", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

const CardBody = ({ children, className }) => {
  return (
    <div className={cn("h-auto w-full [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  );
};

const CardItem = ({ as: Tag = "div", children, className, translateZ = 0, ...rest }) => {
  const ref = React.useRef(null);
  const context = React.useContext(MouseEnterContext);
  const [isMouseEntered] = context || [false];

  React.useEffect(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateZ(${translateZ}px)`;
    } else {
      ref.current.style.transform = `translateZ(0px)`;
    }
  }, [isMouseEntered, translateZ]);

  return (
    <Tag ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Tag>
  );
};

// Wobble Card Component
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

// Main About Component
const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="main-title"
            >
              About Us
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sub-title"
            >
              Transforming Business Education
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="tagline"
            >
              Our simulation platform is a cutting-edge educational tool designed to bridge the gap between theoretical knowledge and practical business management experience.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="content-container">
          {/* About Xaction Card */}
          <div className="info-card large-card">
            <h2>About Xaction</h2>
            <div className="card-content">
              <p>
                Xaction is a business vertical of <span className="highlight-text">Ground Up Consulting</span> which focuses on building simulations as close to real life as possible for management students. Xaction simulations are not operating at 30,000 ft from the ground level but mimic the real challenges that any management graduate is likely to face in their first 5 years of their career.
              </p>
              <p>
                The simulations will test your decision making capability in face of the challenges and the constraints. This becomes critical because decisions in real life are always taken with constraints because the resources are minimal.
              </p>
            </div>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid-container">
            <div className="info-card">
              <h3>Our Mission</h3>
              <p>
                To empower next generation of business leaders by providing cutting-edge experiential education that enhances critical thinking, decision-making, and leadership skills in a highly realistic business environment.
              </p>
            </div>
            <div className="info-card">
              <h3>Our Vision</h3>
              <p>
                To become the leading platform for business simulation education globally, revolutionizing how students learn management skills by providing immersive, technology-driven learning experiences.
              </p>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="section-wrapper">
            <h2 className="section-title">What Makes Us Different</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4>Collaborative Learning</h4>
                <p>Work in teams, make collective decisions, and learn from diverse perspectives in a collaborative environment that mirrors real business dynamics.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4>Real-World Scenarios</h4>
                <p>Experience authentic business challenges based on actual industry cases and current market conditions that cannot be simulated in conventional classrooms.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4>Performance Analytics</h4>
                <p>Track your progress, analyze decision outcomes, and receive detailed feedback to continuously improve your management and leadership capabilities.</p>
              </div>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="section-wrapper">
            <h2 className="section-title">Our Leadership Team</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-image">
                  <img src={imageUrls.p1} alt="Priyaranjan Kumar" loading="lazy" />
                </div>
                <h4>Priyaranjan Kumar</h4>
                <div className="team-bio">
                  <p>
                    Priyaranjan Kumar is an Engineer and Management Post Graduate by Education but a Salesman by choice. He has spent 20 years in the corporate world in leadership & CXO positions with Aditya Birla Fashion & Retail (Pantaloons), Mars Wrigley India, Nivea India, Snapdeal, Iconic Fashion and Guardian Pharmacy.
                  </p>
                  <p>
                    He is the founder of Ground up Consulting which specialises in GTM execution, Retail Store Location Analytics and Business Transformation for D2C brands in Offline distribution and Fashion & Wellness Retail.
                  </p>
                  <p>
                    He is a visiting faculty at IIM Kashipur, IIM Vizag, BIM Trichy, XIM Bhubaneswar, IRMA and IMI Delhi where teaches courses on Sales & Distribution and Retail Management. He is also pursuing Executive PHD in Strategy from SP Jain Institute of Management & Research Mumbai.
                  </p>
                  <p>
                    He has recently turned an Author with his best seller 'Tales of Sales' written specifically for graduating students and early stage professionals as a Fun, Factual and Fundamental guide for navigating their careers.
                  </p>
                </div>
                <a href="https://www.linkedin.com/in/priyaranjan-kumar-09927220/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                  LinkedIn Profile →
                </a>
              </div>
              <div className="team-card">
                <div className="team-image">
                  <img src={imageUrls.p2} alt="Akshansh Vidyarthy" loading="lazy" />
                </div>
                <h4>Akshansh Vidyarthy</h4>
                <div className="team-bio">
                  <p>
                    Akshansh is a marketing enthusiast with an MBA in Marketing, bringing strong experience in sales, retail management, and brand development. He specializes in consumer insights, market research, and go-to-market execution, with a sharp focus on building strategies that resonate with evolving customer needs.
                  </p>
                  <p>
                    His background includes channel development projects and entrepreneurial ventures, where he learned to align strategic vision with on-ground realities. With a passion for brand storytelling and sustainable growth, he thrives at bridging strategy with execution, ensuring ideas are not only conceptualized but also effectively implemented.
                  </p>
                  <p>
                    Driven to create impactful learning and growth experiences, he leverages business simulations and real-world problem-solving to deliver results that inspire both teams and organizations.
                  </p>
                </div>
                <a href="https://www.linkedin.com/in/akshansh-vidyarthy-845a2412a/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                  LinkedIn Profile →
                </a>
              </div>
              <div className="team-card">
                <div className="team-image">
                  <img src={imageUrls.p3} alt="Ayushant Khandekar" loading="lazy" />
                </div>
                <h4>Ayushant Khandekar</h4>
                <div className="team-bio">
                  <p>
                    Ayushant is an expert in tech development and AI-driven solutions, Founder of Atkind, a Founder Member at TrayaTech Labs, and building FairPlace.in, an AI-driven e-commerce solution for retailers in a Bengaluru-based startup.
                  </p>
                  <p>
                    He also serves as a Technical Advisor to a Turkey-based venture and lead teams at peakprosys pvt ltd(peakprosys.in)
                  </p>
                  <p>
                    His expertise spans full-stack development, UI/UX design, automation, and AI integration, enabling the creation of scalable digital products that combine creativity with engineering depth.
                  </p>
                  <p>
                    With experience across founder, advisor, and leadership roles, he is passionate about harnessing emerging technologies to transform bold ideas into future-ready realities.
                  </p>
                </div>
                <a href="https://www.linkedin.com/in/ayushant" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                  LinkedIn Profile →
                </a>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-card">
            <h2>Ready to Transform Your Learning Experience?</h2>
            <p>Join thousands of students who've enhanced their business acumen through our innovative simulation platform.</p>
            <div className="cta-buttons">
              <button 
                onClick={() => {
                  navigate('/simulation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cta-btn primary"
              >
                Start Simulation
              </button>
              <button 
                onClick={() => {
                  navigate('/contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cta-btn secondary"
              >
                Contact Us
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

        .about-page {
          min-height: 100vh;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
          padding: 4rem 0;
          min-height: 50vh;
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
          margin-bottom: 1rem;
        }

        .sub-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #4285f4;
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

        .info-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(66, 133, 244, 0.2);
        }

        .large-card {
          background: linear-gradient(135deg, #4285f4 0%, #1565c0 100%);
          color: white;
        }

        .large-card h2 {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .card-content p {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          text-align: justify;
          color: white !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .highlight-text {
          color: #ffeb3b;
          font-weight: 600;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .info-card h3 {
          color: #4285f4;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }

        .info-card p {
          color: #424242;
          line-height: 1.6;
          font-size: 1rem;
          text-align: justify;
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

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .feature-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(66, 133, 244, 0.2);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          color: #4285f4;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .feature-card h4 {
          color: #1a237e;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #424242;
          line-height: 1.5;
          font-size: 1rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .team-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(66, 133, 244, 0.2);
          display: flex;
          flex-direction: column;
          height: 600px;
        }

        .team-image {
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem auto;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #4285f4;
          flex-shrink: 0;
        }

        .team-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .team-card h4 {
          color: #1a237e;
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .team-bio {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 1rem;
          padding-right: 0.5rem;
        }

        .team-bio p {
          color: #424242;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
          text-align: left;
        }

        .linkedin-link {
          color: #4285f4;
          text-decoration: none;
          font-weight: 500;
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
          flex-shrink: 0;
        }

        .linkedin-link:hover {
          color: #1565c0;
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

          .sub-title {
            font-size: 1.25rem;
          }

          .hero-section,
          .content-section {
            padding: 2rem 0;
          }

          .hero-container,
          .content-container {
            padding: 0 1rem;
          }

          .info-card,
          .feature-card,
          .team-card {
            padding: 1.5rem;
          }

          .team-grid {
            grid-template-columns: 1fr;
          }

          .team-card {
            height: auto;
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

          .features-grid,
          .grid-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default About;