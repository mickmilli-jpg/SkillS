import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, RefreshCw, FileText } from 'lucide-react';
import type { Course, CourseQuiz as CourseQuizType, QuizAttempt } from '../types';

interface CourseQuizProps {
  course: Course;
  quiz: CourseQuizType;
  onComplete: (attempt: QuizAttempt) => void;
  onClose: () => void;
}

const CourseQuiz: React.FC<CourseQuizProps> = ({ course, quiz, onComplete, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 3600); // Default 1 hour
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const submitQuiz = () => {
    if (!startTime) return;

    // Calculate score
    const correctAnswers = quiz.questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    const scorePercentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const isPassingScore = scorePercentage >= quiz.passingScore;

    // Calculate time spent
    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

    // Create quiz attempt
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      userId: 'current-user', // Should come from auth context
      courseId: course.id,
      answers,
      score: scorePercentage,
      passed: isPassingScore,
      completedAt: new Date(),
      timeSpent
    };

    setScore(scorePercentage);
    setPassed(isPassingScore);
    setQuizCompleted(true);
    setShowResults(true);
    onComplete(attempt);
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
    setScore(0);
    setPassed(false);
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : 3600);
    setQuizStarted(false);
    setStartTime(null);
  };

  if (!quizStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Assessment</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{course.title}</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h4 className="font-semibold text-gray-900 mb-4">Quiz Instructions:</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Questions:</strong> {quiz.questions.length} multiple-choice questions</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Time Limit:</strong> {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No time limit'}</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Passing Score:</strong> {quiz.passingScore}% or higher</span>
                </li>
                <li className="flex items-start">
                  <RefreshCw className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Retakes:</strong> Unlimited attempts allowed</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Certificate:</strong> Pass this assessment to earn your official Skillset completion certificate!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <Award className="h-10 w-10 text-green-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {passed ? '🎉 Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-xl font-semibold mb-4">
                Your Score: <span className={passed ? 'text-green-600' : 'text-red-600'}>{score}%</span>
              </p>
              <p className="text-gray-600 mb-6">
                {passed 
                  ? `You passed! You've earned your Skillset certificate for "${course.title}".`
                  : `You need ${quiz.passingScore}% to pass. Don't worry, you can retake the assessment anytime.`
                }
              </p>
            </div>

            {/* Detailed Results */}
            <div className="max-h-60 overflow-y-auto mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Question Review:</h3>
              <div className="space-y-3">
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  return (
                    <div key={question.id} className={`p-4 rounded-lg border ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium">Question {index + 1}</span>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{question.question}</p>
                      <div className="text-xs text-gray-600">
                        <p><strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}</p>
                        <p><strong>Correct answer:</strong> {question.options[question.correctAnswer]}</p>
                        {question.explanation && (
                          <p className="mt-1"><strong>Explanation:</strong> {question.explanation}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {!passed && (
                <button
                  onClick={retakeQuiz}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Retake Assessment
                </button>
              )}
              {passed && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Continue to Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Course Assessment</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </span>
              <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Navigation */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : answers[quiz.questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors border ${
                    answers[currentQuestion.id] === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 ${
                    answers[currentQuestion.id] === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-gray-900 leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </span>
              
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < quiz.questions.length}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-semibold"
                >
                  Submit Assessment
                </button>
              ) : (
                <button
                  onClick={goToNextQuestion}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseQuiz;