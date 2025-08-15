export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor';
  avatar?: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  lessons: Lesson[];
  enrolledStudents: number;
  rating: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'quiz' | 'image';
  content: string; // URL for video/pdf/image, quiz data for quiz
  duration?: number; // in minutes
  order: number;
  isCompleted?: boolean;
  fileSize?: number; // in bytes
  uploadedAt?: Date;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Progress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  progressPercentage: number;
  lastAccessed: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
}

export interface CourseQuiz {
  id: string;
  courseId: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  courseId: string;
  answers: Record<string, number>;
  score: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  issuedAt: Date;
  score: number;
  certificateNumber: string;
}

export interface Note {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}