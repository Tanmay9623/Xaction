import React, { useState } from 'react';
import CorporateQuizList from './CorporateQuizList';
import { QuizProvider } from '../../context/QuizContext';

const CorporateParticipantDashboard = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  
  const participantInfo = {
    name: localStorage.getItem('userName') || 'Participant',
    organization: localStorage.getItem('organization') || 'Organization',
    email: localStorage.getItem('userEmail') || localStorage.getItem('email') || '',
    simulation: localStorage.getItem('corporateSimulation') || 'Leadership & Management'
  };

  const handleQuizStateChange = (isActive) => {
    setIsQuizActive(isActive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - Hidden when quiz is active */}
      {!isQuizActive && (
        <div className="bg-white shadow-md border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl">👔</div>
                  <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {participantInfo.simulation}
                    </h1>
                    <p className="text-sm text-gray-500">Corporate Training Simulation</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  Welcome, <span className="font-semibold text-blue-600">{participantInfo.name}</span>
                </p>
                <p className="text-sm text-gray-600">{participantInfo.organization}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/corporate-login';
                }}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${!isQuizActive ? 'py-8' : ''}`}>
        <QuizProvider>
          <CorporateQuizList 
            simulation={participantInfo.simulation}
            onQuizStateChange={handleQuizStateChange} 
          />
        </QuizProvider>
      </div>
    </div>
  );
};

export default CorporateParticipantDashboard;
