import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import CorporateSimulationQuiz from './CorporateSimulationQuiz';

const CorporateQuizList = ({ simulation, onQuizStateChange }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const { restartQuiz } = useQuiz();

  const handleStartQuiz = () => {
    // Initialize/restart the quiz from the context
    restartQuiz();
    setShowQuiz(true);
    onQuizStateChange && onQuizStateChange(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    onQuizStateChange && onQuizStateChange(false);
  };

  if (showQuiz) {
    return <CorporateSimulationQuiz onClose={handleCloseQuiz} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-6 text-white">Welcome to Your Capability Building Journey</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <p className="text-white text-lg leading-relaxed mb-4 font-medium">
            You have been with <span className="font-bold text-yellow-300">Zee Wellness</span> for just over three years now. <span className="font-bold text-yellow-300">Sahihabad</span>—your current posting in eastern Uttar Pradesh—was not the most glamorous territory, but it was critical. Wedged between Ghaziabad industrial belts and dense residential pockets, Sahihabad had a peculiar mix of high-volume kirana stores, cash-sensitive wholesalers, and fiercely competitive nutrition categories.
          </p>
          <p className="text-white text-lg leading-relaxed font-medium">
            Two weeks ago, your <span className="font-bold text-yellow-300">General Trade distributor</span> abruptly exited the business. The reasons were predictable in hindsight—excessive OD usage, uncontrolled retailer credit, and mounting overdue. What wasn't predictable was the speed at which the market began slipping. Glucose D facings disappeared within days. Kaplan orders dried up. Competition vans became more frequent visitors. <span className="font-bold text-yellow-300">You carry a clear mandate: appoint a new General Trade distributor within 30 days.</span>
          </p>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden hover:shadow-2xl transition-shadow">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                👔
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Capability Building Strategic Simulation
                </h3>
                <p className="text-gray-600">
                  Develop Critical Thinking Skills through strategic decision making scenarios in real world
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
              <div className="text-purple-600 font-semibold text-sm mb-1">Questions</div>
              <div className="text-2xl font-bold text-purple-700">10</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-green-600 font-semibold text-sm mb-1">Benchmark Score</div>
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
                      <li>Your decisions will be ranked based on strategic impact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
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
  );
};

export default CorporateQuizList;
