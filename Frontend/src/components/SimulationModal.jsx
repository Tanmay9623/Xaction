import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimulationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleMBASimulation = () => {
    navigate('/simulation');
    onClose();
  };

  const handleCorporateSimulation = () => {
    // Navigate to corporate simulation route
    navigate('/corporate-simulations');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="modal-overlay" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="modal-container">
        <div className="modal-content">
          {/* Close button */}
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Header */}
          <div className="modal-header">
            <h2>Choose Simulation Type</h2>
            <p>Select the simulation you want to access</p>
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <button 
              className="modal-option-btn mba-btn"
              onClick={handleMBASimulation}
            >
              <div className="btn-icon">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div className="btn-content">
                <h3>Simulations for Students</h3>
                <p>Sales & Distribution, Retail, Marketing, Operations, Organizational Behaviour Simulations</p>
              </div>
            </button>

            <button 
              className="modal-option-btn corporate-btn"
              onClick={handleCorporateSimulation}
            >
              <div className="btn-icon">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className="btn-content">
                <h3>Simulations for Business</h3>
                <p>Need Gap Identification, Capability Building Solutions (Industry & Role Agnostic)</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Modal Container */
        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        @keyframes slideIn {
          from {
            transform: translate(-50%, -45%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }

        /* Modal Content */
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          min-width: 300px;
        }

        /* Close Button */
        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }

        .modal-close-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        /* Header */
        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-header p {
          font-size: 0.95rem;
          color: #6b7280;
          margin: 0;
        }

        /* Buttons Container */
        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Option Buttons */
        .modal-option-btn {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          min-height: 100px;
        }

        .modal-option-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .mba-btn {
          border-color: #3b82f6;
        }

        .mba-btn:hover {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-color: #2563eb;
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.2);
        }

        .corporate-btn {
          border-color: #8b5cf6;
        }

        .corporate-btn:hover {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border-color: #7c3aed;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
        }

        /* Button Icon */
        .btn-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .mba-btn .btn-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .corporate-btn .btn-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }

        .modal-option-btn:hover .btn-icon {
          transform: scale(1.1);
        }

        /* Button Content */
        .btn-content {
          flex: 1;
        }

        .btn-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
        }

        .btn-content p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        /* Responsive Design */
        
        /* Mobile: 320px - 767px */
        @media (max-width: 767px) {
          .modal-content {
            padding: 1.5rem;
            border-radius: 12px;
            max-width: 95%;
          }

          .modal-header h2 {
            font-size: 1.375rem;
          }

          .modal-header p {
            font-size: 0.875rem;
          }

          .modal-option-btn {
            flex-direction: column;
            text-align: center;
            padding: 1.25rem;
            gap: 1rem;
            min-height: auto;
          }

          .btn-icon {
            width: 56px;
            height: 56px;
          }

          .btn-content h3 {
            font-size: 1rem;
          }

          .btn-content p {
            font-size: 0.8125rem;
          }
        }

        /* Tablet: 768px - 1023px */
        @media (min-width: 768px) and (max-width: 1023px) {
          .modal-content {
            padding: 2rem;
            min-width: 500px;
          }

          .modal-header h2 {
            font-size: 1.875rem;
          }

          .btn-content h3 {
            font-size: 1.125rem;
          }
        }

        /* Laptop: 1024px - 1439px */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .modal-content {
            padding: 2.5rem;
            min-width: 550px;
          }

          .modal-header h2 {
            font-size: 2rem;
          }
        }

        /* Desktop: 1440px - 1919px */
        @media (min-width: 1440px) and (max-width: 1919px) {
          .modal-content {
            padding: 2.5rem;
            min-width: 600px;
          }

          .modal-header h2 {
            font-size: 2rem;
          }

          .btn-content h3 {
            font-size: 1.25rem;
          }

          .btn-content p {
            font-size: 1rem;
          }
        }

        /* Large Desktop/Full HD: 1920px+ */
        @media (min-width: 1920px) {
          .modal-content {
            padding: 3rem;
            min-width: 700px;
          }

          .modal-header h2 {
            font-size: 2.25rem;
          }

          .modal-header p {
            font-size: 1.125rem;
          }

          .modal-option-btn {
            padding: 2rem;
            min-height: 120px;
          }

          .btn-icon {
            width: 64px;
            height: 64px;
          }

          .btn-content h3 {
            font-size: 1.5rem;
          }

          .btn-content p {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
};

export default SimulationModal;
