import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';
import { Play, FileText, HelpCircle, Clock, ArrowLeft, ArrowRight, MessageCircle, Award, StickyNote } from 'lucide-react';
import CourseQABot from '../components/CourseQABot';
import CourseQuiz from '../components/CourseQuiz';
import Certificate from '../components/Certificate';
import CourseNotepad from '../components/CourseNotepad';
import { generateCourseQuiz } from '../data/quizQuestions';
import type { QuizAttempt } from '../types';

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuthStore();
  const { 
    getCourseById, 
    getCourseProgress, 
    enrollments, 
    saveQuizAttempt, 
    generateCertificate, 
    getUserCertificates,
    hasCourseCompletion,
    getCourseNotes,
    saveNote,
    updateNote,
    deleteNote
  } = useCourseStore();
  
  const course = courseId ? getCourseById(courseId) : undefined;
  const progress = user && courseId ? getCourseProgress(user.id, courseId) : undefined;
  const isEnrolled = user && courseId && enrollments.some(e => e.userId === user.id && e.courseId === courseId);
  const hasCompleted = user && courseId ? hasCourseCompletion(user.id, courseId) : false;
  const courseNotes = user && courseId ? getCourseNotes(user.id, courseId) : [];
  
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showQABot, setShowQABot] = useState(false);
  const [showCourseQuiz, setShowCourseQuiz] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);

  useEffect(() => {
    if (course && course.lessons.length > 0) {
      const currentLesson = progress?.currentLesson || course.lessons[0].id;
      setSelectedLessonId(currentLesson);
    }
  }, [course, progress]);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  if (!isEnrolled) {
    return <Navigate to="/courses" replace />;
  }

  const selectedLesson = course.lessons.find(lesson => lesson.id === selectedLessonId);
  const currentLessonIndex = course.lessons.findIndex(lesson => lesson.id === selectedLessonId);

  const navigateToLesson = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentLessonIndex - 1 : currentLessonIndex + 1;
    if (newIndex >= 0 && newIndex < course.lessons.length) {
      setSelectedLessonId(course.lessons[newIndex].id);
      setShowQuiz(false);
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const mockQuizData = {
    questions: [
      {
        id: '1',
        question: 'What is the primary purpose of digital art layers?',
        options: [
          'To make files larger',
          'To organize elements and enable non-destructive editing',
          'To slow down the computer',
          'To make colors brighter'
        ],
        correctAnswer: 1,
        explanation: 'Layers allow artists to organize different elements of their artwork and make changes without affecting other parts.'
      },
      {
        id: '2',
        question: 'Which brush type is best for creating smooth gradients?',
        options: [
          'Hard round brush',
          'Texture brush',
          'Soft round brush',
          'Pattern brush'
        ],
        correctAnswer: 2,
        explanation: 'Soft round brushes have feathered edges that blend smoothly, making them ideal for gradients.'
      }
    ]
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const getQuizScore = () => {
    const correctAnswers = mockQuizData.questions.filter(q => 
      quizAnswers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / mockQuizData.questions.length) * 100);
  };

  const handleCourseQuizComplete = (attempt: QuizAttempt) => {
    if (!user || !course) return;
    
    // Save the quiz attempt
    saveQuizAttempt(attempt);
    
    // If passed, generate certificate
    if (attempt.passed) {
      generateCertificate(user.id, course.id, attempt.score);
      // Certificate will be shown after quiz modal closes
      setTimeout(() => setShowCertificate(true), 500);
    }
    
    setShowCourseQuiz(false);
  };

  const isAllLessonsCompleted = () => {
    if (!course || !progress) return false;
    return progress.completedLessons.length === course.lessons.length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 transition-all duration-300 ${
          showNotepad 
            ? 'grid-cols-1 xl:grid-cols-6' 
            : 'grid-cols-1 lg:grid-cols-4'
        }`}>
          {/* Course Sidebar */}
          <div className={showNotepad ? 'xl:col-span-1' : 'lg:col-span-1'}>
            <div className="bg-white rounded-lg shadow sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 truncate">{course.title}</h2>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress?.progressPercentage || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {progress?.progressPercentage || 0}% complete
                  </p>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLessonId(lesson.id);
                      setShowQuiz(false);
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedLessonId === lesson.id ? 'bg-primary-50 border-primary-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-100 text-gray-600">
                        <span>{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {lesson.type === 'video' && <Play className="h-4 w-4 text-gray-400" />}
                          {lesson.type === 'pdf' && <FileText className="h-4 w-4 text-gray-400" />}
                          {lesson.type === 'quiz' && <HelpCircle className="h-4 w-4 text-gray-400" />}
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {lesson.title}
                          </span>
                        </div>
                        {lesson.duration && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{lesson.duration} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={showNotepad ? 'xl:col-span-3' : 'lg:col-span-3'}>
            <div className="bg-white rounded-lg shadow">
              {selectedLesson && (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {selectedLesson.title}
                      </h1>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowNotepad(!showNotepad)}
                          className={`p-2 rounded-lg border transition-colors ${
                            showNotepad 
                              ? 'border-primary-300 bg-primary-50 text-primary-600' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                          title="Toggle Notes"
                        >
                          <StickyNote className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigateToLesson('prev')}
                          disabled={currentLessonIndex === 0}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigateToLesson('next')}
                          disabled={currentLessonIndex === course.lessons.length - 1}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">{selectedLesson.description}</p>
                  </div>

                  <div className="p-6">
                    {selectedLesson.type === 'video' && (
                      <div className="aspect-video bg-black rounded-lg mb-6">
                        <iframe
                          src={selectedLesson.content}
                          className="w-full h-full rounded-lg"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={selectedLesson.title}
                        />
                      </div>
                    )}

                    {selectedLesson.type === 'pdf' && (
                      <div className="border border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-6">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Document</h3>
                        <p className="text-gray-600 mb-4">
                          This lesson contains a PDF document with important information.
                        </p>
                        <button className="btn-primary">
                          Download PDF
                        </button>
                      </div>
                    )}

                    {selectedLesson.type === 'quiz' && (
                      <div className="mb-6">
                        {!showQuiz ? (
                          <div className="text-center py-8">
                            <HelpCircle className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Ready for the quiz?
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Test your understanding of the concepts covered in this lesson.
                            </p>
                            <button
                              onClick={() => setShowQuiz(true)}
                              className="btn-primary"
                            >
                              Start Quiz
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Lesson Quiz
                            </h3>
                            {mockQuizData.questions.map((question, qIndex) => (
                              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-3">
                                  {qIndex + 1}. {question.question}
                                </h4>
                                <div className="space-y-2">
                                  {question.options.map((option, oIndex) => (
                                    <label
                                      key={oIndex}
                                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                                        quizSubmitted
                                          ? oIndex === question.correctAnswer
                                            ? 'bg-green-100 border-green-300'
                                            : quizAnswers[question.id] === oIndex && oIndex !== question.correctAnswer
                                            ? 'bg-red-100 border-red-300'
                                            : 'bg-gray-50'
                                          : quizAnswers[question.id] === oIndex
                                          ? 'bg-primary-100 border-primary-300'
                                          : 'bg-gray-50 hover:bg-gray-100'
                                      } border`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={quizAnswers[question.id] === oIndex}
                                        onChange={() => handleQuizAnswer(question.id, oIndex)}
                                        disabled={quizSubmitted}
                                        className="sr-only"
                                      />
                                      <span className="text-sm">{option}</span>
                                    </label>
                                  ))}
                                </div>
                                {quizSubmitted && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800 font-medium">Explanation:</p>
                                    <p className="text-sm text-blue-700">{question.explanation}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            {!quizSubmitted ? (
                              <button
                                onClick={submitQuiz}
                                disabled={Object.keys(quizAnswers).length !== mockQuizData.questions.length}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Submit Quiz
                              </button>
                            ) : (
                              <div className="bg-primary-50 rounded-lg p-4">
                                <h4 className="font-medium text-primary-900 mb-2">
                                  Quiz Completed! 🎉
                                </h4>
                                <p className="text-primary-800">
                                  Your score: {getQuizScore()}%
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Lesson Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        {/* Course Assessment Section */}
                        {isAllLessonsCompleted() && (
                          <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-primary-900 mb-1">
                                  {hasCompleted ? '🎉 Course Completed!' : '📋 Take Final Assessment'}
                                </h4>
                                <p className="text-sm text-primary-700">
                                  {hasCompleted 
                                    ? 'You have successfully completed this course and earned your certificate!'
                                    : 'Complete the final assessment to earn your Skillset certificate.'
                                  }
                                </p>
                              </div>
                              <div className="flex items-center space-x-3 ml-4">
                                {hasCompleted ? (
                                  <>
                                    <button
                                      onClick={() => setShowCertificate(true)}
                                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                      <Award className="h-4 w-4" />
                                      <span>View Certificate</span>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => setShowCourseQuiz(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span>Start Assessment</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Lesson {currentLessonIndex + 1} of {course.lessons.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notepad Sidebar */}
          {showNotepad && (
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg shadow sticky top-6" style={{ height: 'calc(100vh - 120px)' }}>
                {user && course && (
                  <CourseNotepad
                    course={course}
                    currentLesson={selectedLesson}
                    userId={user.id}
                    notes={courseNotes}
                    onSaveNote={saveNote}
                    onUpdateNote={updateNote}
                    onDeleteNote={deleteNote}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Floating Q&A Bot Button */}
        <button
          onClick={() => setShowQABot(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
          title="Ask questions about this course"
        >
          <MessageCircle className="h-6 w-6" />
        </button>

        {/* Q&A Bot Modal */}
        {showQABot && (
          <CourseQABot
            course={course}
            onClose={() => setShowQABot(false)}
          />
        )}

        {/* Course Assessment Quiz Modal */}
        {showCourseQuiz && course && (
          <CourseQuiz
            course={course}
            quiz={generateCourseQuiz(course)}
            onComplete={handleCourseQuizComplete}
            onClose={() => setShowCourseQuiz(false)}
          />
        )}

        {/* Certificate Modal */}
        {showCertificate && courseId && user && (() => {
          const cert = getUserCertificates(user.id).find(cert => cert.courseId === courseId);
          return cert ? (
            <Certificate
              certificate={cert}
              onClose={() => setShowCertificate(false)}
            />
          ) : null;
        })()}
      </div>
    </div>
  );
};

export default CourseView;