import React, { useEffect, useState } from 'react';

/**
 * Premium Gaming Mission Accomplished Component
 * Celebration screen with particles, animations, and detailed results
 * NO TIME STATS - Focus on strategic achievement
 */

const QuizResults = ({ result, results, onBack, onReturnToDashboard, onRetakeQuiz }) => {
  const data = result || results;
  const [showCelebration, setShowCelebration] = useState(true);
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate celebration particles
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.02,
      color: ['#fbbf24', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);

    // Hide celebration after animation
    setTimeout(() => setShowCelebration(false), 3000);
  }, []);
  
    if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)'
      }}>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-gray-200">
          <p className="text-gray-700 text-xl">No results available.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 px-8 py-3 text-gray-800 hover:text-black font-semibold"
            >
              ← Back to Mission Select
            </button>
          )}
        </div>
      </div>
    );
  }
  
  const scoreData = data.score || data;
  const {
    totalScore = 0,
    percentage = data.percentage || 0,
    answers = [],
    quiz = data.quiz || {},
    completedAt = new Date(),
    displayScore,
    displayMaxMarks
  } = scoreData;

  const getPerformance = (percentage) => {
    if (percentage >= 90) return { 
      level: 'LEGENDARY', 
      description: 'Perfect Strategic Execution',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      icon: '🏆'
    };
    if (percentage >= 75) return { 
      level: 'EXCELLENT', 
      description: 'Outstanding Performance',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      icon: '⭐'
    };
    if (percentage >= 60) return { 
      level: 'GOOD', 
      description: 'Solid Strategic Thinking',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      icon: '👍'
    };
    return { 
      level: 'COMPLETE', 
      description: 'Mission Finished',
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      icon: '✓'
    };
  };

  const performance = getPerformance(percentage);
  // Prefer backend-provided displayMaxMarks (Super Admin total), then maxMarks
  const derivedMaxMarks = (typeof displayMaxMarks === 'number' && displayMaxMarks > 0)
    ? displayMaxMarks
    : (typeof scoreData.maxMarks === 'number' && scoreData.maxMarks > 0)
      ? scoreData.maxMarks
      : (typeof quiz.maxMarks === 'number' && quiz.maxMarks > 0)
        ? quiz.maxMarks
        : 0; // show 0 if missing to surface config issue

  // Numerator: prefer displayScore if present, else totalScore
  const totalScoreDisplay = (typeof displayScore === 'number') ? displayScore : totalScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Celebration Particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute celebration-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                animationDelay: `${particle.delay}s`,
                '--tx': `${(Math.random() - 0.5) * 200}vw`,
                '--ty': `${(Math.random() - 0.5) * 200}vh`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center mb-8 border-t-4 border-blue-600">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-3">
              MISSION ACCOMPLISHED!
            </h1>
            <p className="text-xl text-gray-600">
              Strategic Simulation Complete
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center mb-8 border-t-4 border-blue-600">
            <div className="text-6xl font-bold text-transparent bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text mb-4">
              {Number(totalScoreDisplay).toFixed(0)} / {derivedMaxMarks}
            </div>
            <div className="text-xl text-gray-600 mb-6">
              Final Score: <span className="text-gray-800 font-semibold">{Number(totalScoreDisplay).toFixed(0)} / {derivedMaxMarks}</span>
            </div>
            {/* Performance Badge */}
            <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-xl ${performance.bg} ${performance.color} font-bold text-xl border-2 border-current shadow-lg`}>
              <span className="text-4xl">{performance.icon}</span>
              <div className="text-left">
                <div className="text-2xl mb-1">{performance.level}</div>
                <div className="text-base opacity-90 font-normal">{performance.description}</div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Your Score */}
            <div className="bg-white rounded-xl shadow-2xl p-6 text-center border-t-4 border-blue-600">
              <div className="p-3 rounded-xl bg-blue-100 mb-3 inline-block">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-transparent bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text mb-2">
                {Math.round(totalScore)}
              </div>
              <div className="text-blue-600 font-semibold text-lg mb-1">Your Score</div>
              <div className="text-gray-600">{Math.round(percentage)}% ranking accuracy</div>
            </div>

            {/* Missions Completed */}
            <div className="bg-white rounded-xl shadow-2xl p-6 text-center border-t-4 border-purple-600">
              <div className="p-3 rounded-xl bg-purple-100 mb-3 inline-block">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-transparent bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text mb-2">
                {answers.length}
              </div>
              <div className="text-purple-600 font-semibold text-lg mb-1">Missions Completed</div>
              <div className="text-gray-600">Strategic decisions executed</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mission Analysis & Results
            </h2>
            <div className="space-y-6">
              {answers.map((answer, index) => {
                const isRankingQuestion = answer.questionType === 'ranking' && answer.selectedRanking && answer.correctRanking;
                const score = answer.rankingScore || answer.points || 0;
                
                return (
                  <div key={index} className="bg-white rounded-xl shadow-2xl p-6 border-t-4 border-blue-600">
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-xl text-gray-800">
                          Mission {index + 1}
                        </h3>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <p className="text-gray-700 font-medium">{answer.questionText}</p>
                    </div>

                    {isRankingQuestion ? (
                      <>
                        {/* Your Ranking */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                          <h4 className="font-bold text-blue-600 mb-3 flex items-center text-lg">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            Your Strategic Ranking
                          </h4>
                          <div className="space-y-2">
                            {answer.selectedRanking
                              .sort((a, b) => a.rank - b.rank)
                              .map((option, idx) => (
                                <div key={idx} className="flex items-center bg-white rounded-lg p-3 border border-blue-200">
                                  <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold mr-3">
                                    {option.rank}
                                  </div>
                                  <span className="text-gray-700">{option.text}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Your Instruction */}
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <h4 className="font-bold text-purple-600 mb-2 flex items-center text-lg">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Your Strategic Explanation
                          </h4>
                          <p className="text-gray-700 italic">{answer.instruction}</p>
                        </div>
                        
                        {/* Option Points Overview - Only show top choice */}
                        {answer.options && answer.options.length > 0 && answer.selectedRanking && answer.selectedRanking.length > 0 && (
                          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200 mt-4">
                            <h4 className="font-bold text-cyan-600 mb-2 flex items-center text-lg">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
                              </svg>
                              Option Points (Your Top Choice)
                            </h4>
                            <div className="space-y-2">
                              {(() => {
                                // Find the student's top choice (rank 1)
                                const topChoice = answer.selectedRanking.find(r => r.rank === 1);
                                if (!topChoice) return null;
                                
                                // Find the corresponding option with points
                                const topOption = answer.options.find(opt => opt.text === topChoice.text);
                                if (!topOption) return null;
                                
                                const earnedPoints = typeof topOption.points === 'number' ? topOption.points : 0;
                                const maxPoints = typeof topOption.maxPoints === 'number' ? topOption.maxPoints : earnedPoints;
                                const correctRankInfo = answer.correctRanking?.find(r => r.text === topOption.text);
                                const correctRank = correctRankInfo?.rank;
                                const isCorrectPosition = correctRank === 1;
                                const hasPoints = earnedPoints > 0;
                                
                                return (
                                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                                    isCorrectPosition ? 'bg-green-100 border-green-300 text-green-700' : 
                                    hasPoints ? 'bg-yellow-100 border-yellow-300 text-yellow-700' :
                                    'bg-gray-100 border-gray-300 text-gray-700'
                                  }`}>
                                    <div className="flex-1">
                                      <span className="text-sm block font-medium">{topOption.text}</span>
                                      <span className="text-xs opacity-70">
                                        Your rank: #1 {correctRank && `• Correct: #${correctRank}`}
                                      </span>
                                    </div>
                                    <span className="font-bold ml-3">
                                      {Math.round(earnedPoints)} pts
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Option Impact */}
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 mt-4">
                          <h4 className="font-bold text-indigo-600 mb-2 flex items-center text-lg">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Choice Impact & Feedback
                          </h4>
                          <p className="text-gray-700">
                            {answer.selectedOptionImpact && answer.selectedOptionImpact.trim().length > 0
                              ? answer.selectedOptionImpact
                              : 'No impact explanation provided for this option.'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Your Answer:</p>
                          <p className="text-gray-700 font-medium">{answer.selectedAnswer || answer.selectedOption}</p>
                        </div>
                        
                        {/* Option Points Overview - Only show selected option */}
                        {answer.options && answer.options.length > 0 && answer.selectedOption && (
                          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200 mt-4">
                            <p className="text-xs text-cyan-600 font-semibold mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
                              </svg>
                              Option Points (Your Choice)
                            </p>
                            <div className="space-y-2">
                              {(() => {
                                // Only show the option that the student selected
                                const selectedOpt = answer.options.find(opt => opt.text === answer.selectedOption);
                                if (!selectedOpt) return null;
                                
                                return (
                                  <div className="flex items-center justify-between p-3 rounded-lg border bg-green-100 border-green-300 text-green-700">
                                    <span className="text-sm font-medium">{selectedOpt.text}</span>
                                    <span className="font-bold">{Math.round(typeof selectedOpt.points === 'number' ? selectedOpt.points : 0)} pts</span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Option Impact */}
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mt-4">
                          <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Option Impact & Feedback:
                          </p>
                          <p className="text-gray-700 italic">
                            {answer.selectedOptionImpact && answer.selectedOptionImpact.trim().length > 0
                              ? answer.selectedOptionImpact
                              : 'No impact explanation provided for this option.'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 border-t-4 border-blue-600">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-7 h-7 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              Performance Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-green-600 font-bold mb-3 flex items-center text-lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Strengths
                </p>
                <ul className="text-gray-700 space-y-2">
                  {percentage >= 90 && <li className="flex items-start"><span className="text-green-500 mr-2">▸</span>Exceptional ranking accuracy!</li>}
                  {percentage >= 75 && percentage < 90 && <li className="flex items-start"><span className="text-green-500 mr-2">▸</span>Strong overall performance</li>}
                  {answers.filter(a => a.instruction && a.instruction.length > 50).length > 0 && (
                    <li className="flex items-start"><span className="text-green-500 mr-2">▸</span>Detailed strategic explanations</li>
                  )}
                  {answers.filter(a => (a.rankingScore || a.points || 0) >= 90).length > 0 && (
                    <li className="flex items-start"><span className="text-green-500 mr-2">▸</span>Perfect scores on {answers.filter(a => (a.rankingScore || a.points || 0) >= 90).length} mission(s)</li>
                  )}
                  {answers.every(a => a.instruction) && <li className="flex items-start"><span className="text-green-500 mr-2">▸</span>All instructions completed</li>}
                </ul>
              </div>

              {/* Growth Areas */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-orange-600 font-bold mb-3 flex items-center text-lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  Growth Opportunities
                </p>
                <ul className="text-gray-700 space-y-2">
                  {percentage < 75 && <li className="flex items-start"><span className="text-orange-500 mr-2">▸</span>Review ranking criteria and practice</li>}
                  {answers.filter(a => (a.rankingScore || a.points || 0) < 60).length > 0 && (
                    <li className="flex items-start"><span className="text-orange-500 mr-2">▸</span>{answers.filter(a => (a.rankingScore || a.points || 0) < 60).length} mission(s) need attention</li>
                  )}
                  {answers.filter(a => !a.instruction || a.instruction.length < 30).length > 0 && (
                    <li className="flex items-start"><span className="text-orange-500 mr-2">▸</span>Provide more detailed explanations</li>
                  )}
                  {percentage < 60 && <li className="flex items-start"><span className="text-orange-500 mr-2">▸</span>Focus on strategic thinking patterns</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBack || onReturnToDashboard}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return to Command Center
              </span>
            </button>
            {onRetakeQuiz && (
              <button
                onClick={onRetakeQuiz}
                className="px-10 py-4 rounded-xl font-semibold text-lg text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Mission
              </button>
            )}
          </div>

          {/* Completion Details */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Mission completed on {new Date(completedAt).toLocaleString()}</p>
            <p className="mt-1">All data has been securely transmitted to command</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
