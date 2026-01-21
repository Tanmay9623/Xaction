import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import Timer from '../Timer';

const CorporateStrategicOptionsRanking = ({ onBack }) => {
  const { 
    question, 
    submitAnswer, 
    submitQuiz,
    currentQuestion, 
    totalQuestions, 
    timeLeft, 
    isTimerActive, 
    handleTimeUp,
    setTimeLeft 
  } = useQuiz();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Initialize options from the current question
    setOptions(question.options.map((opt, index) => ({
      ...opt,
      order: index + 1
    })));
  }, [question]);

  const [reasoning, setReasoning] = useState('');
  
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

  return (
    <div className="bg-white rounded-xl shadow-2xl border-t-4 border-linkedin-blue">
      {/* Header */}
      <div className="border-b-2 border-linkedin-lightblue p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-linkedin-darkgray">Leadership Scenario {currentQuestion + 1} of {totalQuestions}</h2>
            <p className="text-linkedin-gray mt-1 flex items-center">
              <span className="w-2 h-2 bg-linkedin-blue rounded-full mr-2"></span>
              Decision Point {currentQuestion + 1}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-linkedin-blue">Strategic Leadership</p>
            <p className="text-sm text-linkedin-gray">Progress: {currentQuestion + 1}/{totalQuestions} scenarios</p>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="text-linkedin-blue hover:text-linkedin-darkblue font-semibold flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Scenario Details
        </button>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-linkedin-darkgray mb-3 flex items-center">
            <span className="w-1 h-8 bg-linkedin-blue mr-3 rounded"></span>
            Prioritize Your Strategic Options
          </h3>
          <p className="text-linkedin-gray">Use the arrow buttons to arrange options by priority (1 = Highest Priority).</p>
        </div>

        {/* Ranking Options */}
        <div className="space-y-4 mb-8">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-4 bg-gradient-to-r from-linkedin-lightblue/20 to-white p-5 rounded-xl border-2 border-linkedin-lightblue hover:border-linkedin-blue transition-all shadow-sm hover:shadow-md">
              <div className="w-10 h-10 bg-linkedin-blue text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
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
              <div className="w-12 h-12 bg-gradient-to-br from-linkedin-blue to-linkedin-darkblue text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                {option.order}
              </div>
            </div>
          ))}
        </div>

        {/* Current Ranking */}
        <div className="bg-gradient-to-br from-linkedin-lightblue/30 to-white p-6 rounded-xl mb-8 border-2 border-linkedin-lightblue">
          <h4 className="font-bold text-linkedin-darkgray mb-4 text-lg flex items-center">
            <svg className="w-6 h-6 mr-2 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Your Strategic Priority Ranking:
          </h4>
          <ol className="space-y-3">
            {options.sort((a, b) => a.order - b.order).map((option, index) => (
              <li key={option.id} className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-linkedin-blue text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  {index + 1}
                </span>
                <span className="text-linkedin-darkgray pt-1">{option.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Strategic Reasoning */}
        <div className="mb-8">
          <h4 className="font-bold text-linkedin-darkgray mb-3 text-lg flex items-center">
            <svg className="w-6 h-6 mr-2 text-linkedin-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Strategic Reasoning <span className="text-linkedin-gray text-sm font-normal ml-2">(Optional - 20-100 words)</span>
          </h4>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="Explain your strategic thinking and decision rationale. Why did you prioritize these options in this specific order? Consider organizational impact, resource allocation, and long-term implications..."
            className="w-full h-40 p-4 border-2 border-linkedin-lightblue rounded-xl resize-none focus:ring-2 focus:ring-linkedin-blue focus:border-linkedin-blue transition-all bg-white text-linkedin-darkgray"
            maxLength={500}
          />
          <div className="flex justify-between text-sm mt-2">
            {reasoning.length > 0 && (
              <p className={`font-semibold ${countWords(reasoning) < 20 ? 'text-red-600' : countWords(reasoning) > 100 ? 'text-red-600' : 'text-green-600'}`}>
                Word count: {countWords(reasoning)} {countWords(reasoning) < 20 ? '(minimum 20)' : countWords(reasoning) > 100 ? '(maximum 100 exceeded)' : '✓'}
              </p>
            )}
            <p className="text-linkedin-gray ml-auto">
              {reasoning.length}/500 characters
            </p>
          </div>
        </div>

        {/* Execute Button */}
        {currentQuestion === totalQuestions - 1 ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-5 mb-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-amber-800 font-bold text-base">Final Leadership Decision</p>
                  <p className="text-amber-700 text-sm mt-1">This is your last scenario. Review your choices carefully before submitting. This assessment cannot be retaken.</p>
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
            className="w-full bg-gradient-to-r from-linkedin-blue to-linkedin-darkblue text-white py-5 px-8 rounded-xl font-bold hover:from-linkedin-darkblue hover:to-linkedin-blue transition-all text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Confirm Decision & Continue to Next Scenario
          </button>
        )}
      </div>
    </div>
  );
};

export default CorporateStrategicOptionsRanking;
