import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { API_URL } from '../../config/api';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

/**
 * Premium Gaming Ranking Quiz Component
 * NO TIMER - Strategic thinking focused
 * Features: Drag-and-drop ranking, futuristic UI, particle effects
 */

// Sortable Item Component with Premium Gaming UI
function SortableItem({ id, rank, text }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move group transition-all ${
        isDragging
          ? 'scale-105 z-50 border-blue-500 shadow-lg'
          : 'hover:border-gray-300 hover:shadow-md'
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Rank Badge */}
      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
        {rank}
      </span>

      {/* Option Text */}
      <span className="text-sm text-gray-800 flex-1">{text}</span>
    </div>
  );
}

const RankingQuiz = ({ quiz, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rankedOptions, setRankedOptions] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [allAnswers, setAllAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStrategicOptions, setShowStrategicOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Initialize ranked options for current question
  useEffect(() => {
    if (currentQuestion) {
      const options = currentQuestion.options.map((opt, index) => ({
        id: `option-${index}`,
        text: opt.text,
        rank: index + 1
      }));
      setRankedOptions(options);
      setInstruction('');
      setShowStrategicOptions(false);
    }
  }, [currentQuestionIndex, currentQuestion]);

  // ✅ LOAD PREVIOUS PROGRESS ON MOUNT (Using localStorage)
  useEffect(() => {
    if (quiz && quiz._id) {
      loadPreviousProgress();
    }
  }, [quiz?._id]);

  /**
   * ✅ RESUME FROM LAST QUESTION
   * Uses localStorage to save and restore progress (no API calls needed)
   */
  const loadPreviousProgress = () => {
    try {
      // Safety check: ensure quiz is defined
      if (!quiz || !quiz._id || !quiz.questions) {
        console.log('⚠️  Quiz data not ready yet');
        setCurrentQuestionIndex(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      const quizProgressKey = `quiz-progress-${quiz._id}`;
      const savedProgress = localStorage.getItem(quizProgressKey);
      
      console.log('🚀 Loading quiz progress from browser storage...');
      
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        console.log(`✅ RESUMING QUIZ: Total answered: ${progress.answeredQuestions.length}`);
        
        // Restore all answers
        const restoredAnswers = {};
        progress.answeredQuestions.forEach(answer => {
          restoredAnswers[answer.questionIndex] = {
            selectedRanking: answer.selectedRanking,
            instruction: answer.instruction
          };
        });
        
        setAllAnswers(Object.keys(restoredAnswers).map((index) => ({
          questionIndex: parseInt(index),
          selectedRanking: restoredAnswers[index].selectedRanking,
          instruction: restoredAnswers[index].instruction
        })));

        // Calculate next question = max(answered) + 1
        const answeredIndices = Object.keys(restoredAnswers).map(Number);
        console.log('🔢 Answered indices:', answeredIndices);
        
        const nextQuestion = Math.max(...answeredIndices) + 1;
        const questionToStart = Math.min(nextQuestion, quiz.questions.length - 1);
        
        console.log(`🎯 Resuming from question index ${questionToStart} (Q${questionToStart + 1})`);
        setCurrentQuestionIndex(questionToStart);
      } else {
        console.log('🆕 Starting NEW quiz session (no previous answers)');
        setCurrentQuestionIndex(0);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading progress:', err);
      setCurrentQuestionIndex(0);
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRankedOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        return newItems.map((item, index) => ({
          ...item,
          rank: index + 1
        }));
      });
    }
  };

  const handleViewStrategicOptions = () => {
    setShowStrategicOptions(true);
  };

  /**
   * ✅ SAVE PROGRESS WHEN STUDENT ABANDONS QUIZ
   * Called when user leaves quiz without completing
   */
  const handleAbandonQuiz = () => {
    try {
      const quizProgressKey = `quiz-progress-${quiz._id}`;
      const existingProgress = localStorage.getItem(quizProgressKey);
      
      if (existingProgress) {
        const progress = JSON.parse(existingProgress);
        progress.abandonedAt = new Date().toISOString();
        progress.abandoned = true;
        localStorage.setItem(quizProgressKey, JSON.stringify(progress));
        
        console.log('💾 Quiz progress saved before abandonment');
      }
    } catch (err) {
      console.error('Error saving abandoned progress:', err);
    }
    
    if (onBack) {
      onBack();
    }
  };

  const handleNext = () => {
    if (!instruction || instruction.trim().length === 0) {
  alert('⚠️ Please provide your strategic reason before proceeding');
      return;
    }

    const wordCount = countWords(instruction);
    if (wordCount < 20) {
      alert(`⚠️ Instruction must be at least 20 words (current: ${wordCount} words)`);
      return;
    }

    if (wordCount > 100) {
      alert(`⚠️ Instruction must not exceed 100 words (current: ${wordCount} words)`);
      return;
    }

    const cleanedRanking = rankedOptions.map(option => ({
      text: option.text,
      rank: option.rank
    }));
    
    const answer = {
      questionId: currentQuestion._id,
      questionText: currentQuestion.text,
      selectedRanking: cleanedRanking,
      instruction: instruction.trim()
    };

    const updatedAnswers = [...allAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAllAnswers(updatedAnswers);

    // ✅ SAVE ANSWER TO DATABASE
    saveAnswerToDatabase(currentQuestionIndex, cleanedRanking, instruction.trim());

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(updatedAnswers);
    }
  };

  /**
   * ✅ SAVE EACH ANSWER TO BROWSER STORAGE (localStorage)
   */
  const saveAnswerToDatabase = async (questionIndex, selectedRanking, instruction) => {
    try {
      const quizProgressKey = `quiz-progress-${quiz._id}`;
      
      // Get existing progress or create new
      const existingProgress = localStorage.getItem(quizProgressKey);
      let progress = existingProgress ? JSON.parse(existingProgress) : {
        quizId: quiz._id,
        answeredQuestions: [],
        startedAt: new Date().toISOString()
      };
      
      // Add or update this answer
      progress.answeredQuestions = progress.answeredQuestions.filter(a => a.questionIndex !== questionIndex);
      progress.answeredQuestions.push({
        questionIndex,
        selectedRanking,
        instruction,
        answeredAt: new Date().toISOString()
      });
      
      // Sort by question index for easy retrieval
      progress.answeredQuestions.sort((a, b) => a.questionIndex - b.questionIndex);
      
      // Save to localStorage
      localStorage.setItem(quizProgressKey, JSON.stringify(progress));
      
      console.log(`💾 Answer saved for question ${questionIndex} (saved ${progress.answeredQuestions.length} total)`);
    } catch (err) {
      console.error(`❌ Error saving answer for question ${questionIndex}:`, err);
    }
  };

  const handleSubmit = async (answers) => {
    setIsSubmitting(true);
    
    const cleanedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      questionText: answer.questionText,
      selectedRanking: answer.selectedRanking.map(option => ({
        text: option.text,
        rank: option.rank
      })),
      instruction: answer.instruction
    }));
    
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        quizId: quiz._id,
        answers: cleanedAnswers
      };
      
      const response = await axios.post(
        `${API_URL}/scores/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (onComplete) {
        onComplete(response.data.data);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit quiz';
      alert(`❌ ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
      }}>
        <div className="gaming-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">

      <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={handleAbandonQuiz}
              className="mb-6 px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center transition-all group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Mission Select
            </button>
          )}

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600 uppercase">Mission Progress</span>
              <span className="text-sm font-bold text-blue-600">{currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
              <div
                className="bg-blue-600 rounded-full h-3 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{Math.round(progressPercentage)}%</span>
          </div>

          {/* Mission Header */}
          <div className="bg-white rounded-xl shadow-2xl border-t-4 border-blue-600 mb-6">
            <div className="border-b-2 border-blue-100 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">MISSION {currentQuestionIndex + 1}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">Strategic Decision</h2>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    No Time Limit
                  </p>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-lg p-6 shadow-md">
                <p className="text-gray-800 leading-relaxed text-base font-medium">{currentQuestion.text}</p>
              </div>
            </div>

            {/* Constraints Section */}
            {currentQuestion.points && currentQuestion.points.length > 0 && (
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Constraints</h3>
                    <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-bold uppercase">Important</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Critical information points (read-only)</p>
                  <div className="space-y-3">
                    {currentQuestion.points.map((point, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 flex items-start shadow-sm border border-gray-200">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-sm text-gray-800 flex-1 leading-relaxed">{point.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View Strategic Options Button */}
          {!showStrategicOptions && (
            <div className="bg-white rounded-xl shadow-2xl border-t-4 border-blue-600 p-8 mb-6">
              <button
                onClick={handleViewStrategicOptions}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                VIEW STRATEGIC OPTIONS
              </button>
            </div>
          )}

          {/* Strategic Options Section */}
          {showStrategicOptions && (
            <div className="bg-white rounded-xl shadow-2xl border-t-4 border-blue-600 p-8">
              {/* Ranking Instructions */}
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-lg font-bold text-blue-800 mb-2">RANKING PROTOCOL</p>
                    <p className="text-gray-700 text-base leading-relaxed">
                      Drag and drop options to rank them from <strong className="text-green-600">highest priority (1st)</strong> to <strong className="text-orange-600">lowest priority (last)</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Drag and Drop Ranking */}
              <div className="mb-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={rankedOptions.map(opt => opt.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {rankedOptions.map((option) => (
                        <SortableItem
                          key={option.id}
                          id={option.id}
                          rank={option.rank}
                          text={option.text}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Instruction Field */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-6">
                <label className="block">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="text-lg font-bold text-yellow-800">
                        Your Strategic Reason <span className="text-red-600">*</span>
                      </span>
                      <p className="text-gray-700 text-sm mt-1">
                        Explain your ranking choice (20-100 words required)
                      </p>
                    </div>
                  </div>
                  <textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="Provide your strategic reasoning for this ranking decision..."
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-base text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-32 resize-y"
                    required
                  />
                </label>
                <div className="mt-3 flex justify-between text-sm">
                  <p className={`font-bold ${
                    countWords(instruction) < 20 ? 'text-red-600' : 
                    countWords(instruction) > 100 ? 'text-red-600' : 
                    'text-green-600'
                  }`}>
                    Words: {countWords(instruction)}/20-100
                  </p>
                  <p className="text-gray-600">
                    {instruction.length} chars
                  </p>
                </div>
              </div>

              {/* Navigation Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : currentQuestionIndex === totalQuestions - 1 ? (
                    <>
                      <span>COMPLETE MISSION</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Next Challenge</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default RankingQuiz;
