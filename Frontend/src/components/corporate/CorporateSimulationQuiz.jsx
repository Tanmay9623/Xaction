import React, { useState, useEffect } from 'react';
import Timer from '../Timer';
import { useQuiz } from '../../context/QuizContext';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CorporateSimulationQuiz = ({ onClose }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  const [previousScore, setPreviousScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [reasoning, setReasoning] = useState('');
  const [showLeadershipProfile, setShowLeadershipProfile] = useState(false);
  const [leadershipScores, setLeadershipScores] = useState(null);
  const [isAnalyzingReasoning, setIsAnalyzingReasoning] = useState(false);
  
  const { 
    currentQuestion, 
    totalQuestions, 
    question,
    quizQuestions, // Add quizQuestions from context
    showResults, 
    score, 
    answers, 
    timeLeft, 
    isTimerActive, 
    handleTimeUp,
    submitAnswer,
    submitQuiz 
  } = useQuiz();

  useEffect(() => {
    // Initialize options from the current question
    if (question && question.options) {
      // Sort by correctOrder to display options in the right sequence
      const sortedOptions = [...question.options].sort((a, b) => a.correctOrder - b.correctOrder);
      setOptions(sortedOptions.map((opt, index) => ({
        ...opt,
        order: index + 1
      })));
    }
  }, [question, currentQuestion]);

  // Reset options when showOptions changes
  useEffect(() => {
    if (showOptions && question && question.options) {
      const sortedOptions = [...question.options].sort((a, b) => a.correctOrder - b.correctOrder);
      setOptions(sortedOptions.map((opt, index) => ({
        ...opt,
        order: index + 1
      })));
    }
  }, [showOptions]);

  // Helper function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const moveOption = (id, direction) => {
    const newOptions = [...options];
    const index = newOptions.findIndex(opt => opt.id === id);
    if (direction === 'up' && index > 0) {
      const temp = newOptions[index].order;
      newOptions[index].order = newOptions[index - 1].order;
      newOptions[index - 1].order = temp;
    } else if (direction === 'down' && index < newOptions.length - 1) {
      const temp = newOptions[index].order;
      newOptions[index].order = newOptions[index + 1].order;
      newOptions[index + 1].order = temp;
    }
    setOptions(newOptions.sort((a, b) => a.order - b.order));
  };

  const handleSubmit = () => {
    // Validate word count if reasoning is provided
    if (reasoning) {
      const wordCount = countWords(reasoning);
      if (wordCount < 20) {
        alert(`Reasoning must be at least 20 words (current: ${wordCount} words)`);
        return;
      }
      if (wordCount > 100) {
        alert(`Reasoning must not exceed 100 words (current: ${wordCount} words)`);
        return;
      }
    }
    
    submitAnswer(question.id, options, reasoning);
    setShowOptions(false);
    setReasoning('');
  };

  const handleFinalSubmit = () => {
    // Validate word count if reasoning is provided
    if (reasoning) {
      const wordCount = countWords(reasoning);
      if (wordCount < 20) {
        alert(`Reasoning must be at least 20 words (current: ${wordCount} words)`);
        return;
      }
      if (wordCount > 100) {
        alert(`Reasoning must not exceed 100 words (current: ${wordCount} words)`);
        return;
      }
    }
    // Submit current answer first
    submitAnswer(question.id, options, reasoning);
    // Then submit the entire quiz
    setTimeout(() => {
      submitQuiz();
    }, 100);
  };

  // Analyze strategic reasoning with AI
  const analyzeReasoningWithAI = async (resultId) => {
    try {
      console.log('Starting AI analysis for result:', resultId);
      setIsAnalyzingReasoning(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/corporate-simulation/analyze-reasoning/${resultId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AI Analysis Response:', data);
        if (data.success && data.data.reasoningScores) {
          setLeadershipScores(prev => ({
            ...prev,
            reasoningScores: data.data.reasoningScores,
            reasoningAnalysis: data.data.reasoningAnalysis,
            alignmentScore: data.data.alignmentScore
          }));
          console.log('✅ Reasoning scores updated:', data.data.reasoningScores);
        }
      } else {
        console.error('AI analysis request failed:', response.status);
      }
    } catch (error) {
      console.error('Error analyzing reasoning with AI:', error);
    } finally {
      setIsAnalyzingReasoning(false);
    }
  };

  // Submit simulation data when results are shown
  useEffect(() => {
    if (showResults && answers.length > 0 && !isSubmitted) {
      const submitSimulationData = async () => {
        try {
          // Calculate max possible marks
          const maxPossibleMarks = quizQuestions.reduce((total, question) => {
            const maxMarks = Math.max(...question.options.map(opt => opt.marks || opt.points || 0));
            return total + maxMarks;
          }, 0);
          
          const percentageScore = (score / maxPossibleMarks) * 100;
          const averageAccuracy = answers.reduce((acc, curr) => acc + (curr?.totalAccuracy || 0), 0) / answers.length;
          
          const token = localStorage.getItem('token');
          
          if (token) {
            const response = await fetch(`${API_BASE_URL}/api/corporate-simulation/submit`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                simulationName: 'Leadership & Management Simulation',
                score: score,
                maxPossibleMarks: maxPossibleMarks,
                percentageScore: percentageScore,
                averageAccuracy: averageAccuracy,
                totalQuestions: totalQuestions,
                answers: answers
              })
            });

            const data = await response.json();
            
            if (data.success) {
              console.log('Corporate simulation result saved to database:', data);
              // Store leadership scores from response
              if (data.data && data.data.leadershipScores) {
                setLeadershipScores(data.data.leadershipScores);
                console.log('Leadership Scores:', data.data.leadershipScores);
                
                // Trigger AI analysis for reasoning scores
                if (data.data._id) {
                  analyzeReasoningWithAI(data.data._id);
                }
              }
            } else {
              console.error('Failed to save to database:', data.message);
            }
          }
          
          setIsSubmitted(true);
        } catch (error) {
          console.error('Failed to save corporate simulation:', error);
          setIsSubmitted(true);
        }
      };

      submitSimulationData();
    }
  }, [showResults, answers, score, totalQuestions, isSubmitted, quizQuestions]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-linkedin-blue">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-3 border-linkedin-blue mx-auto"></div>
          <p className="mt-4 text-linkedin-darkgray font-medium">Preparing your leadership challenge...</p>
        </div>
      </div>
    );
  }

  if (showResults && answers.length > 0) {
    // Calculate maximum possible marks
    const maxPossibleMarks = quizQuestions.reduce((total, question) => {
      const maxMarks = Math.max(...question.options.map(opt => opt.marks || opt.points || 0));
      return total + maxMarks;
    }, 0);
    
    const percentageScore = (score / maxPossibleMarks) * 100;
    const averageAccuracy = answers.reduce((acc, curr) => acc + (curr?.totalAccuracy || 0), 0) / answers.length;
    
    // Helper function to normalize scores to 0-5 scale for radar chart
    const normalizeScore = (parameter, score) => {
      const maxScores = {
        BJ: 30,  // Maximum possible for BJ
        FR: 10,  // Maximum possible for FR
        TC: 18,  // Maximum possible for TC
        RD: 18,  // Maximum possible for RD
        GC: 24,  // Maximum possible for GC
        GT: 18   // Maximum possible for GT
      };
      return (score / maxScores[parameter]) * 5;
    };
    
    // Generate dynamic radar chart data from actual leadership scores
    const generateRadarData = () => {
      if (!leadershipScores) {
        // Default data if scores not loaded yet
        return [
          { dimension: 'Business Judgment', value: 0, fullMark: 5, actualScore: 0, level: 'low' },
          { dimension: 'Financial Risk', value: 0, fullMark: 5, actualScore: 0, level: 'low' },
          { dimension: 'Talent Assessment', value: 0, fullMark: 5, actualScore: 0, level: 'low' },
          { dimension: 'Risk Design', value: 0, fullMark: 5, actualScore: 0, level: 'low' },
          { dimension: 'Governance', value: 0, fullMark: 5, actualScore: 0, level: 'low' },
          { dimension: 'Market Execution', value: 0, fullMark: 5, actualScore: 0, level: 'low' },
        ];
      }
      
      return [
        { 
          dimension: 'Business Judgment', 
          value: normalizeScore('BJ', leadershipScores.BJ.score), 
          fullMark: 5,
          actualScore: leadershipScores.BJ.score,
          level: leadershipScores.BJ.level
        },
        { 
          dimension: 'Financial Risk', 
          value: normalizeScore('FR', leadershipScores.FR.score), 
          fullMark: 5,
          actualScore: leadershipScores.FR.score,
          level: leadershipScores.FR.level
        },
        { 
          dimension: 'Talent Assessment', 
          value: normalizeScore('TC', leadershipScores.TC.score), 
          fullMark: 5,
          actualScore: leadershipScores.TC.score,
          level: leadershipScores.TC.level
        },
        { 
          dimension: 'Risk Design', 
          value: normalizeScore('RD', leadershipScores.RD.score), 
          fullMark: 5,
          actualScore: leadershipScores.RD.score,
          level: leadershipScores.RD.level
        },
        { 
          dimension: 'Governance', 
          value: normalizeScore('GC', leadershipScores.GC.score), 
          fullMark: 5,
          actualScore: leadershipScores.GC.score,
          level: leadershipScores.GC.level
        },
        { 
          dimension: 'Market Execution', 
          value: normalizeScore('GT', leadershipScores.GT.score), 
          fullMark: 5,
          actualScore: leadershipScores.GT.score,
          level: leadershipScores.GT.level
        },
      ];
    };
    
    const radarData = generateRadarData();
    
    // Generate Self Management radar data from AI-analyzed reasoning scores
    const generateSelfManagementData = () => {
      console.log('🔍 Self Management Data Generation:', {
        hasLeadershipScores: !!leadershipScores,
        hasReasoningScores: !!leadershipScores?.reasoningScores,
        reasoningScores: leadershipScores?.reasoningScores
      });
      
      if (!leadershipScores || !leadershipScores.reasoningScores) {
        return [
          { dimension: 'Business Judgment', value: 0, fullMark: 5 },
          { dimension: 'Financial Risk', value: 0, fullMark: 5 },
          { dimension: 'Talent Assessment', value: 0, fullMark: 5 },
          { dimension: 'Risk Design', value: 0, fullMark: 5 },
          { dimension: 'Governance', value: 0, fullMark: 5 },
          { dimension: 'Market Execution', value: 0, fullMark: 5 },
        ];
      }

      const rs = leadershipScores.reasoningScores;
      
      return [
        { 
          dimension: 'Business Judgment', 
          value: (rs.BJ / 30) * 5, 
          fullMark: 5 
        },
        { 
          dimension: 'Financial Risk', 
          value: (rs.FR / 10) * 5, 
          fullMark: 5 
        },
        { 
          dimension: 'Talent Assessment', 
          value: (rs.TC / 18) * 5, 
          fullMark: 5 
        },
        { 
          dimension: 'Risk Design', 
          value: (rs.RD / 18) * 5, 
          fullMark: 5 
        },
        { 
          dimension: 'Governance', 
          value: (rs.GC / 24) * 5, 
          fullMark: 5 
        },
        { 
          dimension: 'Market Execution', 
          value: (rs.GT / 18) * 5, 
          fullMark: 5 
        },
      ];
    };
    
    const selfManagementData = generateSelfManagementData();
    
    // Calculate percentage match between self assessment and self management
    const calculateMatchPercentage = () => {
      if (!leadershipScores || !leadershipScores.reasoningScores) {
        return { overall: 0, dimensions: {} };
      }

      const dimensions = {};
      let totalMatch = 0;
      const dimensionCount = 6;

      // Calculate match for each dimension
      radarData.forEach((item, index) => {
        const selfAssessmentValue = item.value;
        const selfManagementValue = selfManagementData[index]?.value || 0;
        
        // Calculate percentage match (100% - percentage difference)
        const maxValue = 5;
        const difference = Math.abs(selfAssessmentValue - selfManagementValue);
        const matchPercentage = Math.max(0, ((maxValue - difference) / maxValue) * 100);
        
        dimensions[item.dimension] = matchPercentage.toFixed(1);
        totalMatch += matchPercentage;
      });

      return {
        overall: (totalMatch / dimensionCount).toFixed(1),
        dimensions
      };
    };

    const matchData = calculateMatchPercentage();
    
    // Show Leadership Assessment Profile page
    if (showLeadershipProfile) {
      return (
        <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-linkedin-blue">
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-linkedin-darkgray mb-3">Leadership Assessment Profile</h1>
            <p className="text-xl text-linkedin-gray">Comprehensive evaluation across six critical leadership dimensions</p>
          </div>

          {/* Individual Leadership Assessment Charts */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-linkedin-darkgray mb-4 text-center">Your Leadership Assessment</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Self Assessment Chart - Dynamic based on user answers */}
              <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-6 border-2 border-red-200 shadow-lg">
                <h4 className="font-bold text-center text-linkedin-darkgray mb-4 flex items-center justify-center">
                  <span className="w-4 h-4 bg-red-600 rounded-full mr-2"></span>
                  Self Assessment
                </h4>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#dc2626" strokeWidth={1.5} />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#000', fontSize: 11, fontWeight: 600 }}
                      stroke="#dc2626"
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fill: '#666', fontSize: 10 }}
                      stroke="#dc2626"
                    />
                    <Radar
                      name="Self Assessment"
                      dataKey="value"
                      stroke="#e63946"
                      fill="#e63946"
                      fillOpacity={0.6}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                {!leadershipScores && (
                  <p className="text-xs text-center text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                    ⏳ Loading your assessment results...
                  </p>
                )}
                <p className="text-xs text-center text-red-700 mt-2">Dynamic evaluation based on your actual decisions</p>
              </div>
              
              {/* Self Management Chart - Based on Strategic Reasoning */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200 shadow-lg">
                <h4 className="font-bold text-center text-linkedin-darkgray mb-4 flex items-center justify-center">
                  <span className="w-4 h-4 bg-purple-600 rounded-full mr-2"></span>
                  Self Management
                </h4>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={selfManagementData}>
                    <PolarGrid stroke="#9333ea" strokeWidth={1.5} />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#000', fontSize: 11, fontWeight: 600 }}
                      stroke="#9333ea"
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fill: '#666', fontSize: 10 }}
                      stroke="#9333ea"
                    />
                    <Radar
                      name="Self Management"
                      dataKey="value"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.6}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                {isAnalyzingReasoning && (
                  <p className="text-xs text-center text-blue-700 mt-2 bg-blue-50 p-2 rounded animate-pulse">
                    🤖 AI is analyzing your strategic reasoning...
                  </p>
                )}
                {!isAnalyzingReasoning && (!leadershipScores?.reasoningScores || Object.values(leadershipScores.reasoningScores).every(v => v === 0)) && (
                  <p className="text-xs text-center text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                    ⏳ Waiting for AI analysis results...
                  </p>
                )}
                {!isAnalyzingReasoning && leadershipScores?.reasoningScores && Object.values(leadershipScores.reasoningScores).some(v => v > 0) && (
                  <p className="text-xs text-center text-purple-700 mt-2 bg-purple-50 p-2 rounded">
                    ✅ AI-analyzed based on your strategic reasoning quality
                  </p>
                )}
              </div>
            </div>

            {/* Comparison Chart - Both Assessments Combined */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-300 shadow-xl">
                <h3 className="text-2xl font-bold text-center text-linkedin-darkgray mb-2 flex items-center justify-center">
                  <svg className="w-8 h-8 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Combined Assessment Comparison
                </h3>
                <p className="text-center text-linkedin-gray mb-6">Visual comparison of Self Assessment vs Self Management</p>
                
                <ResponsiveContainer width="100%" height={500}>
                  <RadarChart data={[
                    { 
                      dimension: radarData[0]?.dimension || 'BJ', 
                      selfAssessment: radarData[0]?.value || 0,
                      selfManagement: selfManagementData[0]?.value || 0,
                      fullMark: 5 
                    },
                    { 
                      dimension: radarData[1]?.dimension || 'FR', 
                      selfAssessment: radarData[1]?.value || 0,
                      selfManagement: selfManagementData[1]?.value || 0,
                      fullMark: 5 
                    },
                    { 
                      dimension: radarData[2]?.dimension || 'TC', 
                      selfAssessment: radarData[2]?.value || 0,
                      selfManagement: selfManagementData[2]?.value || 0,
                      fullMark: 5 
                    },
                    { 
                      dimension: radarData[3]?.dimension || 'RD', 
                      selfAssessment: radarData[3]?.value || 0,
                      selfManagement: selfManagementData[3]?.value || 0,
                      fullMark: 5 
                    },
                    { 
                      dimension: radarData[4]?.dimension || 'GC', 
                      selfAssessment: radarData[4]?.value || 0,
                      selfManagement: selfManagementData[4]?.value || 0,
                      fullMark: 5 
                    },
                    { 
                      dimension: radarData[5]?.dimension || 'GT', 
                      selfAssessment: radarData[5]?.value || 0,
                      selfManagement: selfManagementData[5]?.value || 0,
                      fullMark: 5 
                    },
                  ]}>
                    <PolarGrid stroke="#6366f1" strokeWidth={1.5} />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#000', fontSize: 12, fontWeight: 600 }}
                      stroke="#6366f1"
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fill: '#666', fontSize: 11 }}
                      stroke="#6366f1"
                    />
                    {/* Self Assessment - Red */}
                    <Radar
                      name="Self Assessment (Leadership)"
                      dataKey="selfAssessment"
                      stroke="#dc2626"
                      fill="#ef4444"
                      fillOpacity={0.35}
                      strokeWidth={3}
                    />
                    {/* Self Management - Purple */}
                    <Radar
                      name="Self Management (Reasoning)"
                      dataKey="selfManagement"
                      stroke="#9333ea"
                      fill="#a855f7"
                      fillOpacity={0.35}
                      strokeWidth={3}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                      formatter={(value) => <span style={{ color: '#374151', fontWeight: '600', fontSize: '14px' }}>{value}</span>}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                
                {/* AI Analysis Summary */}
                {leadershipScores?.reasoningAnalysis && (
                  <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border-2 border-purple-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                          Strategic Reasoning Analysis
                          {leadershipScores?.alignmentScore !== undefined && (
                            <span className="ml-3 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                              Alignment: {leadershipScores.alignmentScore}%
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {leadershipScores.reasoningAnalysis}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Leadership Scores Summary - Centered */}
            {leadershipScores && (
              <div className="bg-white rounded-xl p-8 border-2 border-linkedin-blue shadow-lg">
                <h3 className="text-2xl font-bold text-center text-linkedin-darkgray mb-6 flex items-center justify-center">
                  <svg className="w-7 h-7 mr-2 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Your Leadership Scores
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {/* BJ Score */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-bold text-blue-800 mb-2">BJ</div>
                    <div className="text-4xl font-bold text-blue-900 mb-2">{leadershipScores.BJ.score}</div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      leadershipScores.BJ.level === 'high' ? 'bg-green-500 text-white' :
                      leadershipScores.BJ.level === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {leadershipScores.BJ.level.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* FR Score */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-bold text-purple-800 mb-2">FR</div>
                    <div className="text-4xl font-bold text-purple-900 mb-2">{leadershipScores.FR.score}</div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      leadershipScores.FR.level === 'high' ? 'bg-green-500 text-white' :
                      leadershipScores.FR.level === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {leadershipScores.FR.level.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* TC Score */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-bold text-green-800 mb-2">TC</div>
                    <div className="text-4xl font-bold text-green-900 mb-2">{leadershipScores.TC.score}</div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      leadershipScores.TC.level === 'high' ? 'bg-green-500 text-white' :
                      leadershipScores.TC.level === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {leadershipScores.TC.level.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* RD Score */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-bold text-orange-800 mb-2">RD</div>
                    <div className="text-4xl font-bold text-orange-900 mb-2">{leadershipScores.RD.score}</div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      leadershipScores.RD.level === 'high' ? 'bg-green-500 text-white' :
                      leadershipScores.RD.level === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {leadershipScores.RD.level.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* GC Score */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-bold text-red-800 mb-2">GC</div>
                    <div className="text-4xl font-bold text-red-900 mb-2">{leadershipScores.GC.score}</div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      leadershipScores.GC.level === 'high' ? 'bg-green-500 text-white' :
                      leadershipScores.GC.level === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {leadershipScores.GC.level.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* GT Score */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-bold text-indigo-800 mb-2">GT</div>
                    <div className="text-4xl font-bold text-indigo-900 mb-2">{leadershipScores.GT.score}</div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      leadershipScores.GT.level === 'high' ? 'bg-green-500 text-white' :
                      leadershipScores.GT.level === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {leadershipScores.GT.level.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dimension Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-linkedin-darkgray mb-4">Leadership Dimensions Explained</h3>
            <div className="space-y-3">
              <div className="bg-white/80 rounded-lg p-3 flex items-center shadow-sm border border-linkedin-lightblue">
                <span className="w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">BJ</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-linkedin-darkgray">Business Judgment & Long-Term Thinking</p>
                  <p className="text-xs text-linkedin-gray">Strategic decision-making and vision</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg p-3 flex items-center shadow-sm border border-linkedin-lightblue">
                <span className="w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">FR</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-linkedin-darkgray">Financial & Credit Risk Acumen</p>
                  <p className="text-xs text-linkedin-gray">Financial analysis and risk management</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg p-3 flex items-center shadow-sm border border-linkedin-lightblue">
                <span className="w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">TC</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-linkedin-darkgray">Talent & Capability Assessment</p>
                  <p className="text-xs text-linkedin-gray">People evaluation and development</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg p-3 flex items-center shadow-sm border border-linkedin-lightblue">
                <span className="w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">RD</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-linkedin-darkgray">Risk Design & Decision Structuring</p>
                  <p className="text-xs text-linkedin-gray">Framework design and decision architecture</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg p-3 flex items-center shadow-sm border border-linkedin-lightblue">
                <span className="w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">GC</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-linkedin-darkgray">Governance & Compliance Orientation</p>
                  <p className="text-xs text-linkedin-gray">Regulatory adherence and ethical standards</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg p-3 flex items-center shadow-sm border border-linkedin-lightblue">
                <span className="w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">GT</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-linkedin-darkgray">Market & Execution Understanding</p>
                  <p className="text-xs text-linkedin-gray">Market dynamics and operational execution</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowLeadershipProfile(false)}
              className="bg-gray-200 text-linkedin-darkgray py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              ← Back to Results
            </button>
            <button
              onClick={onClose}
              className="bg-linkedin-blue text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-linkedin-darkblue transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
    
    // Show main results page
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-linkedin-blue">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-linkedin-lightblue rounded-full mb-4">
            <svg className="w-16 h-16 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-linkedin-darkgray mb-3">Leadership Assessment Complete!</h1>
          <p className="text-xl text-linkedin-gray">You've successfully completed the Leadership & Management Simulation</p>
          {isSubmitted && (
            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg inline-block">
              <p className="text-green-700 font-semibold flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Results saved successfully!
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-linkedin-blue to-linkedin-darkblue rounded-xl p-8 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2 text-black">{score} / {maxPossibleMarks}</div>
              <p className="text-linkedin-lightblue text-sm font-semibold mb-1">Total Marks</p>
              <p className="text-white/80 text-xs text-black">{percentageScore.toFixed(1)}% Achievement Rate</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2 text-black">{averageAccuracy.toFixed(1)}%</div>
              <p className="text-linkedin-lightblue text-sm font-semibold mb-1">Decision Accuracy</p>
              <p className="text-white/80 text-xs text-black">Strategic Alignment Score</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2 text-black">{totalQuestions}</div>
              <p className="text-linkedin-lightblue text-sm font-semibold mb-1">Scenarios Completed</p>
              <p className="text-white/80 text-xs">Leadership Challenges</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-linkedin-darkgray mb-6 flex items-center">
            <span className="w-1 h-8 bg-linkedin-blue mr-3 rounded"></span>
            Decision Performance Analysis
          </h2>
          <div className="space-y-6">
            {answers.map((answer, index) => (
              <div key={index} className="bg-linkedin-lightblue/30 rounded-xl p-6 border-l-4 border-linkedin-blue hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-4 text-linkedin-darkgray flex items-center">
                  <span className="w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center mr-3 text-sm">
                    {index + 1}
                  </span>
                  {answer.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-linkedin-darkgray mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      Decision Accuracy
                    </h4>
                    {answer.orderedOptions.map((option) => {
                      const accuracy = answer.accuracyPerOption[option.id];
                      return (
                        <div key={option.id} className="flex justify-between items-center mb-3">
                          <span className="text-sm text-linkedin-gray flex-1">{option.text}</span>
                          <div className="flex items-center ml-4">
                            <span className="text-sm font-bold text-linkedin-blue mr-2 w-12 text-right">
                              {accuracy.accuracy}%
                            </span>
                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-linkedin-blue rounded-full h-2.5 transition-all"
                                style={{ width: `${accuracy.accuracy}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-linkedin-darkgray mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Performance Metrics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-linkedin-gray">Strategic Score:</span>
                        <span className="text-sm font-bold text-linkedin-blue">{answer.score - answer.reasoningPoints} pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-linkedin-gray">Reasoning Bonus:</span>
                        <span className="text-sm font-bold text-green-600">{answer.reasoningPoints} pts</span>
                      </div>
                      <div className="flex justify-between border-t border-linkedin-lightblue pt-2 mt-2">
                        <span className="text-sm font-semibold text-linkedin-darkgray">Total Points:</span>
                        <span className="text-sm font-bold text-linkedin-blue">{answer.score} pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-linkedin-gray">Avg Accuracy:</span>
                        <span className="text-sm font-semibold text-linkedin-blue">{answer.totalAccuracy.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-linkedin-gray">Time Taken:</span>
                        <span className="text-sm font-semibold text-linkedin-gray">{answer.timeTaken}s</span>
                      </div>
                      {answer.isAutoSubmitted && (
                        <p className="text-xs text-red-600 mt-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Auto-submitted (time expired)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowLeadershipProfile(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            View Leadership Assessment Profile
          </button>
          <button
            onClick={onClose}
            className="bg-linkedin-blue text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-linkedin-darkblue transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentQuestion + 1) / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-xl shadow-2xl border-t-4 border-linkedin-blue">
      {/* Quiz Header */}
      <div className="border-b-2 border-linkedin-lightblue p-8">
        {/* Mission Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-linkedin-gray uppercase">Mission Progress</span>
            <span className="text-sm font-bold text-linkedin-blue">{currentQuestion + 1} of {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div
              className="bg-linkedin-blue rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-linkedin-gray">{progressPercentage}%</span>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs font-bold text-linkedin-blue uppercase tracking-wide mb-2">MISSION {currentQuestion + 1}</div>
            <h2 className="text-3xl font-bold text-linkedin-darkgray mb-1">Strategic Decision</h2>
            <p className="text-sm text-linkedin-gray flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              No Time Limit
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="p-8">
        {/* Highlighted Question at Top */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-lg p-6 shadow-md">
          <p className="text-linkedin-darkgray leading-relaxed text-base font-medium">{question.description}</p>
        </div>

        {/* Constraints */}
        {question.rules && question.rules.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-linkedin-lightblue/10 to-transparent rounded-lg p-6 border-l-4 border-linkedin-blue mb-4">
              <h3 className="text-xl font-bold text-linkedin-darkgray mb-2 flex items-center">
                <svg className="w-6 h-6 mr-2 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Constraints
              </h3>
              <p className="text-linkedin-gray text-sm">Critical information points (read-only)</p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
              <div className="space-y-3">
                {question.rules.map((rule, index) => (
                  <div key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-linkedin-darkgray leading-relaxed text-sm">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ranking Protocol - Show when Next Challenge is clicked */}
        {showOptions && (
          <div className="mb-8 mt-8 border-t-2 border-linkedin-lightblue pt-8">
            <h3 className="text-xl font-bold text-linkedin-darkgray mb-4 flex items-center">
              <span className="w-1 h-8 bg-linkedin-blue mr-3 rounded"></span>
              RANKING PROTOCOL
            </h3>
            <p className="text-linkedin-gray mb-6">Drag and drop options to rank them from highest priority (1st) to lowest priority (last)</p>

            {/* Ranking Options */}
            <div className="space-y-4 mb-8">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-4 bg-gradient-to-r from-linkedin-lightblue/20 to-white p-5 rounded-xl border-2 border-linkedin-lightblue hover:border-linkedin-blue transition-all shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 bg-linkedin-blue text-black rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
                    {option.id}
                  </div>
                  <p className="flex-grow text-linkedin-darkgray font-medium">{option.text}</p>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => moveOption(option.id, 'up')}
                      className="p-2 hover:bg-linkedin-blue hover:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-linkedin-lightblue text-linkedin-blue font-bold disabled:hover:bg-linkedin-lightblue disabled:hover:text-linkedin-blue"
                      disabled={option.order === 1}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveOption(option.id, 'down')}
                      className="p-2 hover:bg-linkedin-blue hover:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-linkedin-lightblue text-linkedin-blue font-bold disabled:hover:bg-linkedin-lightblue disabled:hover:text-linkedin-blue"
                      disabled={option.order === options.length}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-linkedin-blue to-linkedin-darkblue text-black rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                    {option.order}
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Reasoning */}
            <div className="mb-8">
              <h4 className="font-bold text-linkedin-darkgray mb-3 text-lg flex items-center">
                <svg className="w-6 h-6 mr-2 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Your Strategic Reason <span className="text-red-600">*</span>
              </h4>
              <p className="text-linkedin-gray text-sm mb-3">Explain your ranking choice (20-100 words required)</p>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Provide your strategic reasoning for this ranking decision..."
                className="w-full h-40 p-4 border-2 border-linkedin-lightblue rounded-xl resize-none focus:ring-2 focus:ring-linkedin-blue focus:border-linkedin-blue transition-all bg-white text-linkedin-darkgray"
                maxLength={500}
              />
              <div className="flex justify-between text-sm mt-2">
                {reasoning.length > 0 && (
                  <p className={`font-semibold ${countWords(reasoning) < 20 ? 'text-red-600' : countWords(reasoning) > 100 ? 'text-red-600' : 'text-green-600'}`}>
                    Words: {countWords(reasoning)} {countWords(reasoning) < 20 ? '(minimum 20)' : countWords(reasoning) > 100 ? '(maximum 100 exceeded)' : '✓'}
                  </p>
                )}
                <p className="text-linkedin-gray ml-auto">
                  {reasoning.length} chars
                </p>
              </div>
            </div>

            {/* Submit Button */}
            {currentQuestion === totalQuestions - 1 ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-5 mb-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-amber-800 font-bold text-base">Final Leadership Decision</p>
                      <p className="text-amber-700 text-sm mt-1">This is your last scenario. Review your choices carefully before submitting.</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleFinalSubmit}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-5 px-8 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Final Decision & Complete Assessment
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-linkedin-blue to-linkedin-darkblue text-black py-5 px-8 rounded-xl font-bold hover:from-linkedin-darkblue hover:to-linkedin-blue transition-all text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Confirm Decision & Continue to Next Scenario
              </button>
            )}
          </div>
        )}

        {/* Action Buttons - Show when options are not visible */}
        {!showOptions && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setShowOptions(true)}
              className="w-full bg-linkedin-blue text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-linkedin-darkblue transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              VIEW STRATEGIC OPTIONS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateSimulationQuiz;
