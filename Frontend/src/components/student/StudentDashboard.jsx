import React, { useState } from 'react';
import SimulationQuiz from './SimulationQuiz';
import { QuizProvider } from '../../context/QuizContext';
import SimulationLockModal from '../SimulationLockModal';

const StudentDashboard = () => {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const studentInfo = {
    name: localStorage.getItem('fullName') || 'Student',
    college: localStorage.getItem('college') || localStorage.getItem('userCollege') || 'ABC College'
  };
  
  // Get user college for license checking
  const userCollege = localStorage.getItem('userCollege') || localStorage.getItem('college');

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleStartSimulation = () => {
    setSimulationStarted(true);
  };

  const handleQuizClose = () => {
    // Reset both states to go back to main simulations page
    setShowQuiz(false);
    setSimulationStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Simulation Lock Modal - Shows if license is invalid */}
      <SimulationLockModal userCollege={userCollege} />
      
      {/* Hide everything when quiz is active */}
      {!showQuiz && (
        <div>
          {/* Header */}
          <div className="bg-white shadow-md border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">🎓</div>
                    <div>
                      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Area Manager Simulation
                      </h1>
                      <p className="text-sm text-gray-500">MBA Training Program</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Welcome, <span className="font-semibold text-blue-600">{studentInfo.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">{studentInfo.college}</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
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
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!simulationStarted ? (
              <div className="space-y-6">

                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-white shadow-2xl">
                  <h2 className="text-4xl font-bold mb-6 text-white">Welcome to the Chocolate Company!</h2>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <p className="text-white text-lg leading-relaxed mb-4 font-medium">
                      You have joined as the <span className="font-bold text-yellow-300">Area Manager</span> of a Chocolate company. The company is famous for making world's best chocolate brands like <span className="font-bold">Gickers, Falaxy, Pluto, M&Gs, Founty, and Bwix</span>.
                    </p>
                    <p className="text-white text-lg leading-relaxed mb-4 font-medium">
                      It did not enter the India market for long because it was not sure about the retail infrastructure which would enable the chocolates to be served to customers in right quality. This reluctance of Pluto enabled Chocolate to monopolize the chocolate market in India.
                    </p>
                    <p className="text-white text-lg leading-relaxed mb-4 font-medium">
                      However, the company now feels that the time has arrived and therefore is building a team to carry out sales & distribution while the chocolates would get imported from across their factories in different parts of the world.
                    </p>
                    <p className="text-white text-lg leading-relaxed mb-4 font-medium">
                      The territory assigned to you is <span className="font-bold text-yellow-300">North India</span> with <span className="font-bold text-yellow-300">Delhi NCR</span> being the largest market for the category across India.
                    </p>
                    <p className="text-white text-lg leading-relaxed font-medium">
                      <span className="font-bold text-yellow-300">Your first task:</span> Build a team for NCR to set up the building blocks for distribution.
                    </p>
                  </div>
                </div>

                {/* Simulation Card */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                          🎯
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Area Manager Strategic Simulation
                          </h3>
                          <p className="text-gray-600">
                            Build your team and develop strategic thinking through real-world scenarios
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-blue-600 font-semibold text-sm mb-1">Duration</div>
                        <div className="text-2xl font-bold text-blue-700">60 min</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-purple-600 font-semibold text-sm mb-1">Challenges</div>
                        <div className="text-2xl font-bold text-purple-700">Multiple</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-green-600 font-semibold text-sm mb-1">Target Score</div>
                        <div className="text-2xl font-bold text-green-700">70%</div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Important Instructions</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <ul className="list-disc list-inside space-y-1">
                              <li>Read each scenario carefully before making decisions</li>
                              <li>Consider long-term implications of your choices</li>
                              <li>You cannot pause once the simulation starts</li>
                              <li>Your decisions will be evaluated based on strategic thinking</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleStartSimulation}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg text-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Simulation
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Status */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                      ✓
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Simulation in Progress</h2>
                      <p className="text-white/90 text-lg">You're ready to begin your first challenge</p>
                    </div>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Current Task</h3>
                    <p className="text-gray-600 mb-4">Build a team for NCR region</p>
                    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                      View Task Details
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">My Progress</h3>
                    <p className="text-gray-600 mb-4">Track your simulation progress</p>
                    <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors">
                      View Progress
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Resources</h3>
                    <p className="text-gray-600 mb-4">Access simulation materials</p>
                    <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors">
                      View Resources
                    </button>
                  </div>
                </div>

                {/* Start Challenge Card */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin?</h2>
                    <p className="text-gray-600 mb-6">
                      Simulation started successfully. Complete your first challenge to see your progress and begin building your team.
                    </p>
                    <button
                      onClick={handleStartQuiz}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg text-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start First Challenge
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Show quiz in full screen when active */}
      {showQuiz && (
        <SimulationQuiz onClose={handleQuizClose} />
      )}
    </div>
  );
};

export default StudentDashboard;
