import { create } from 'zustand';
import type { Course, Progress, Enrollment, QuizAttempt, Certificate, Note } from '../types';

interface CourseState {
  courses: Course[];
  enrollments: Enrollment[];
  progress: Progress[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  notes: Note[];
  selectedCourse: Course | null;
  
  getCourses: () => Course[];
  getPublicCourses: () => Course[];
  getCourseById: (id: string) => Course | undefined;
  getEnrolledCourses: (userId: string) => Course[];
  getInstructorCourses: (instructorId: string) => Course[];
  getCourseProgress: (userId: string, courseId: string) => Progress | undefined;
  
  enrollInCourse: (userId: string, courseId: string) => void;
  updateProgress: (userId: string, courseId: string, lessonId: string) => void;
  setSelectedCourse: (course: Course | null) => void;
  
  createCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  
  // Quiz and Certificate methods
  saveQuizAttempt: (attempt: QuizAttempt) => void;
  generateCertificate: (userId: string, courseId: string, score: number) => Certificate;
  getUserCertificates: (userId: string) => Certificate[];
  getCourseQuizAttempts: (userId: string, courseId: string) => QuizAttempt[];
  hasCourseCompletion: (userId: string, courseId: string) => boolean;
  
  // Notes methods
  saveNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  getUserNotes: (userId: string) => Note[];
  getCourseNotes: (userId: string, courseId: string) => Note[];
}

// Mock data for demo
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Complete Digital Art Mastery',
    description: 'Learn digital art from scratch with industry professionals. Master tools like Photoshop, Procreate, and develop your unique artistic style.',
    thumbnail: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 149.99,
    duration: '12 hours',
    level: 'intermediate',
    category: 'Digital Art',
    enrolledStudents: 1247,
    rating: 4.8,
    isPublic: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    lessons: [
      {
        id: '1-1',
        courseId: '1',
        title: 'Introduction to Digital Art',
        description: 'Overview of digital art tools and techniques',
        type: 'video',
        content: 'https://www.youtube.com/embed/IAmtFtIBjx4',
        duration: 45,
        order: 1,
      },
      {
        id: '1-2',
        courseId: '1',
        title: 'Setting Up Your Workspace',
        description: 'Configuring Photoshop and essential brushes',
        type: 'video',
        content: 'https://www.youtube.com/embed/IyR_uYsRdPs',
        duration: 30,
        order: 2,
      },
      {
        id: '1-3',
        courseId: '1',
        title: 'Basic Drawing Techniques',
        description: 'Fundamental drawing skills for digital art',
        type: 'pdf',
        content: '/documents/basic-drawing-techniques.pdf',
        order: 3,
      },
      {
        id: '1-4',
        courseId: '1',
        title: 'Color Theory and Composition',
        description: 'Understanding color harmony and visual composition',
        type: 'video',
        content: 'https://www.youtube.com/embed/_2LLXnUdUIc',
        duration: 50,
        order: 4,
      },
      {
        id: '1-5',
        courseId: '1',
        title: 'Digital Painting Techniques',
        description: 'Advanced painting and blending methods',
        type: 'video',
        content: 'https://www.youtube.com/embed/JSev0GvkwWA',
        duration: 65,
        order: 5,
      },
      {
        id: '1-6',
        courseId: '1',
        title: 'Character Design Basics',
        description: 'Creating compelling digital characters',
        type: 'video',
        content: 'https://www.youtube.com/embed/7BKKaKT_dtM',
        duration: 55,
        order: 6,
      },
      {
        id: '1-7',
        courseId: '1',
        title: 'Knowledge Check: Art Basics',
        description: 'Test your understanding of basic concepts',
        type: 'quiz',
        content: 'quiz-1-7',
        order: 7,
      },
    ],
  },
  {
    id: '2',
    title: 'Cryptocurrency Trading Fundamentals',
    description: 'Master the basics of crypto trading, technical analysis, and risk management strategies for beginners.',
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 0,
    duration: '8 hours',
    level: 'beginner',
    category: 'Finance',
    enrolledStudents: 892,
    rating: 4.6,
    isPublic: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    lessons: [
      {
        id: '2-1',
        courseId: '2',
        title: 'What is Cryptocurrency?',
        description: 'Understanding blockchain and digital currencies',
        type: 'video',
        content: 'https://www.youtube.com/embed/VYWc9dFqROI',
        duration: 60,
        order: 1,
      },
      {
        id: '2-2',
        courseId: '2',
        title: 'Setting Up Your Trading Account',
        description: 'Choose and configure crypto exchanges',
        type: 'video',
        content: 'https://www.youtube.com/embed/8MhxhzPGbxY',
        duration: 40,
        order: 2,
      },
      {
        id: '2-3',
        courseId: '2',
        title: 'Technical Analysis Fundamentals',
        description: 'Reading crypto charts and indicators',
        type: 'video',
        content: 'https://www.youtube.com/embed/nC8ByFjeBJc',
        duration: 55,
        order: 3,
      },
      {
        id: '2-4',
        courseId: '2',
        title: 'Risk Management Strategies',
        description: 'Protecting your capital while trading',
        type: 'video',
        content: 'https://www.youtube.com/embed/w-k_ebgfKqc',
        duration: 45,
        order: 4,
      },
      {
        id: '2-5',
        courseId: '2',
        title: 'Trading Psychology',
        description: 'Managing emotions and discipline in trading',
        type: 'video',
        content: 'https://www.youtube.com/embed/Cr0QxLwM6AA',
        duration: 50,
        order: 5,
      },
    ],
  },
  {
    id: '3',
    title: 'Advanced React Development',
    description: 'Deep dive into React patterns, performance optimization, and modern development practices.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 249.99,
    duration: '16 hours',
    level: 'advanced',
    category: 'Programming',
    enrolledStudents: 634,
    rating: 4.9,
    isPublic: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    lessons: [
      {
        id: '3-1',
        courseId: '3',
        title: 'Advanced Hooks Patterns',
        description: 'Custom hooks and advanced React patterns',
        type: 'video',
        content: 'https://www.youtube.com/embed/Gc9qbCYZGlM',
        duration: 75,
        order: 1,
      },
      {
        id: '3-2',
        courseId: '3',
        title: 'State Management with Context',
        description: 'Advanced state management techniques',
        type: 'video',
        content: 'https://www.youtube.com/embed/5LrDIWkK_Bc',
        duration: 60,
        order: 2,
      },
      {
        id: '3-3',
        courseId: '3',
        title: 'Performance Optimization',
        description: 'React.memo, useMemo, and useCallback',
        type: 'video',
        content: 'https://www.youtube.com/embed/DEPwA3mv_R8',
        duration: 55,
        order: 3,
      },
      {
        id: '3-4',
        courseId: '3',
        title: 'Testing React Applications',
        description: 'Unit testing and integration testing strategies',
        type: 'video',
        content: 'https://www.youtube.com/embed/8Xwq35cPwYg',
        duration: 70,
        order: 4,
      },
      {
        id: '3-5',
        courseId: '3',
        title: 'Server-Side Rendering with Next.js',
        description: 'Advanced React with Next.js framework',
        type: 'video',
        content: 'https://www.youtube.com/embed/1WmNXEVia8I',
        duration: 80,
        order: 5,
      },
    ],
  },
  // Programming Courses
  {
    id: '4',
    title: 'Python for Data Science',
    description: 'Learn Python programming with a focus on data analysis, machine learning, and statistical modeling.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 179.99,
    duration: '14 hours',
    level: 'intermediate',
    category: 'Programming',
    enrolledStudents: 2156,
    rating: 4.7,
    isPublic: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30'),
    lessons: [
      {
        id: '4-1',
        courseId: '4',
        title: 'Python Fundamentals',
        description: 'Variables, data types, and control structures',
        type: 'video',
        content: 'https://www.youtube.com/embed/kqtD5dpn9C8',
        duration: 60,
        order: 1,
      },
      {
        id: '4-2',
        courseId: '4',
        title: 'NumPy for Data Analysis',
        description: 'Working with arrays and numerical computations',
        type: 'video',
        content: 'https://www.youtube.com/embed/QUT1VHiLmmI',
        duration: 45,
        order: 2,
      },
      {
        id: '4-3',
        courseId: '4',
        title: 'Pandas DataFrames',
        description: 'Data manipulation and analysis with Pandas',
        type: 'video',
        content: 'https://www.youtube.com/embed/vmEHCJofslg',
        duration: 55,
        order: 3,
      },
      {
        id: '4-4',
        courseId: '4',
        title: 'Data Visualization with Matplotlib',
        description: 'Creating charts and graphs for data insights',
        type: 'video',
        content: 'https://www.youtube.com/embed/3Xc3CA655Y4',
        duration: 40,
        order: 4,
      },
      {
        id: '4-5',
        courseId: '4',
        title: 'Machine Learning Basics',
        description: 'Introduction to ML concepts and scikit-learn',
        type: 'video',
        content: 'https://www.youtube.com/embed/7eh4d6sabA0',
        duration: 70,
        order: 5,
      },
    ],
  },
  {
    id: '5',
    title: 'JavaScript ES6+ Mastery',
    description: 'Master modern JavaScript features, async programming, and advanced concepts for web development.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
    instructorId: '1',
    instructorName: 'John Doe',
    price: 0,
    duration: '10 hours',
    level: 'beginner',
    category: 'Programming',
    enrolledStudents: 1832,
    rating: 4.6,
    isPublic: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
    lessons: [
      {
        id: '5-1',
        courseId: '5',
        title: 'Arrow Functions and Destructuring',
        description: 'Modern JavaScript syntax and features',
        type: 'video',
        content: 'https://www.youtube.com/embed/h33Srr5J9nY',
        duration: 45,
        order: 1,
      },
      {
        id: '5-2',
        courseId: '5',
        title: 'Promises and Async/Await',
        description: 'Handling asynchronous operations in JavaScript',
        type: 'video',
        content: 'https://www.youtube.com/embed/vn3tm0quoqE',
        duration: 50,
        order: 2,
      },
      {
        id: '5-3',
        courseId: '5',
        title: 'ES6 Modules and Classes',
        description: 'Modern JavaScript module system and OOP',
        type: 'video',
        content: 'https://www.youtube.com/embed/cRHQNNcYf6s',
        duration: 40,
        order: 3,
      },
      {
        id: '5-4',
        courseId: '5',
        title: 'Template Literals and Spread Operator',
        description: 'String templates and array/object manipulation',
        type: 'video',
        content: 'https://www.youtube.com/embed/OpD7SFqGx-g',
        duration: 35,
        order: 4,
      },
    ],
  },
  // Design Courses
  {
    id: '6',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn user interface and user experience design principles, wireframing, and prototyping techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 0,
    duration: '15 hours',
    level: 'beginner',
    category: 'Design',
    enrolledStudents: 1456,
    rating: 4.8,
    isPublic: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    lessons: [
      {
        id: '6-1',
        courseId: '6',
        title: 'Design Thinking Process',
        description: 'Understanding user-centered design methodology',
        type: 'video',
        content: 'https://www.youtube.com/embed/5fX1RLNq6DA',
        duration: 50,
        order: 1,
      },
      {
        id: '6-2',
        courseId: '6',
        title: 'User Research and Personas',
        description: 'Understanding your users through research',
        type: 'video',
        content: 'https://www.youtube.com/embed/mTyZLFBVtT8',
        duration: 45,
        order: 2,
      },
      {
        id: '6-3',
        courseId: '6',
        title: 'Wireframing and Prototyping',
        description: 'Creating low and high-fidelity prototypes',
        type: 'video',
        content: 'https://www.youtube.com/embed/KnZrypOaVCg',
        duration: 60,
        order: 3,
      },
      {
        id: '6-4',
        courseId: '6',
        title: 'Visual Design Principles',
        description: 'Color theory, typography, and layout',
        type: 'video',
        content: 'https://www.youtube.com/embed/qZWDJqY27bw',
        duration: 55,
        order: 4,
      },
      {
        id: '6-5',
        courseId: '6',
        title: 'Usability Testing',
        description: 'Testing and iterating on your designs',
        type: 'video',
        content: 'https://www.youtube.com/embed/GYt3TbNsIY0',
        duration: 40,
        order: 5,
      },
    ],
  },
  {
    id: '7',
    title: 'Advanced Logo Design',
    description: 'Create memorable brand identities and logos using design principles, typography, and color theory.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop',
    instructorId: '1',
    instructorName: 'John Doe',
    price: 159.99,
    duration: '9 hours',
    level: 'intermediate',
    category: 'Design',
    enrolledStudents: 743,
    rating: 4.5,
    isPublic: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-10'),
    lessons: [
      {
        id: '7-1',
        courseId: '7',
        title: 'Typography in Logo Design',
        description: 'Choosing and customizing fonts for brand identity',
        type: 'video',
        content: 'https://www.youtube.com/embed/sByzHoiYFX0',
        duration: 40,
        order: 1,
      },
      {
        id: '7-2',
        courseId: '7',
        title: 'Color Theory for Logos',
        description: 'Understanding color psychology and application',
        type: 'video',
        content: 'https://www.youtube.com/embed/Qj1FK8n7WgY',
        duration: 35,
        order: 2,
      },
      {
        id: '7-3',
        courseId: '7',
        title: 'Logo Design Process',
        description: 'From concept to final design workflow',
        type: 'video',
        content: 'https://www.youtube.com/embed/NwYz17qcUc8',
        duration: 50,
        order: 3,
      },
      {
        id: '7-4',
        courseId: '7',
        title: 'Brand Identity Systems',
        description: 'Creating comprehensive brand guidelines',
        type: 'video',
        content: 'https://www.youtube.com/embed/l-S2Y3SF3mM',
        duration: 45,
        order: 4,
      },
    ],
  },
  // Marketing Courses
  {
    id: '8',
    title: 'Digital Marketing Strategy',
    description: 'Comprehensive guide to online marketing, social media campaigns, and customer acquisition strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 199.99,
    duration: '12 hours',
    level: 'intermediate',
    category: 'Marketing',
    enrolledStudents: 1923,
    rating: 4.7,
    isPublic: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    lessons: [
      {
        id: '8-1',
        courseId: '8',
        title: 'Understanding Your Target Audience',
        description: 'Market research and customer persona development',
        type: 'video',
        content: 'https://www.youtube.com/embed/iWkQcHglbug',
        duration: 55,
        order: 1,
      },
      {
        id: '8-2',
        courseId: '8',
        title: 'Content Marketing Strategy',
        description: 'Creating valuable content that converts',
        type: 'video',
        content: 'https://www.youtube.com/embed/B_2yAHLfDkE',
        duration: 50,
        order: 2,
      },
      {
        id: '8-3',
        courseId: '8',
        title: 'Social Media Marketing',
        description: 'Building brand presence across platforms',
        type: 'video',
        content: 'https://www.youtube.com/embed/3wKOep0ZsO8',
        duration: 45,
        order: 3,
      },
      {
        id: '8-4',
        courseId: '8',
        title: 'Email Marketing Campaigns',
        description: 'Building and nurturing email lists',
        type: 'video',
        content: 'https://www.youtube.com/embed/89KO7EaOp3s',
        duration: 40,
        order: 4,
      },
      {
        id: '8-5',
        courseId: '8',
        title: 'Analytics and Optimization',
        description: 'Measuring and improving campaign performance',
        type: 'video',
        content: 'https://www.youtube.com/embed/67y-P2pyHgU',
        duration: 60,
        order: 5,
      },
    ],
  },
  {
    id: '9',
    title: 'SEO Mastery Course',
    description: 'Learn search engine optimization techniques to rank higher on Google and drive organic traffic.',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop',
    instructorId: '1',
    instructorName: 'John Doe',
    price: 0,
    duration: '11 hours',
    level: 'beginner',
    category: 'Marketing',
    enrolledStudents: 2087,
    rating: 4.6,
    isPublic: true,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-18'),
    lessons: [
      {
        id: '9-1',
        courseId: '9',
        title: 'Keyword Research Fundamentals',
        description: 'Finding profitable keywords for your content',
        type: 'video',
        content: 'https://www.youtube.com/embed/hOnxQYJTWRE',
        duration: 48,
        order: 1,
      },
      {
        id: '9-2',
        courseId: '9',
        title: 'On-Page SEO Optimization',
        description: 'Optimizing your website content for search engines',
        type: 'video',
        content: 'https://www.youtube.com/embed/DvwS7cV9GmQ',
        duration: 45,
        order: 2,
      },
      {
        id: '9-3',
        courseId: '9',
        title: 'Technical SEO Basics',
        description: 'Site speed, mobile optimization, and crawlability',
        type: 'video',
        content: 'https://www.youtube.com/embed/MYE6T_gd7H0',
        duration: 50,
        order: 3,
      },
      {
        id: '9-4',
        courseId: '9',
        title: 'Link Building Strategies',
        description: 'Building authority through quality backlinks',
        type: 'video',
        content: 'https://www.youtube.com/embed/6aPL8SrQ0dE',
        duration: 40,
        order: 4,
      },
    ],
  },
  // Business Courses
  {
    id: '10',
    title: 'Entrepreneurship Bootcamp',
    description: 'From idea to launch: learn how to start, validate, and grow your own successful business venture.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 299.99,
    duration: '20 hours',
    level: 'intermediate',
    category: 'Business',
    enrolledStudents: 1534,
    rating: 4.9,
    isPublic: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    lessons: [
      {
        id: '10-1',
        courseId: '10',
        title: 'Finding Your Business Idea',
        description: 'Identifying market opportunities and validating concepts',
        type: 'video',
        content: 'https://www.youtube.com/embed/SrZYP8sOp2Y',
        duration: 65,
        order: 1,
      },
      {
        id: '10-2',
        courseId: '10',
        title: 'Market Validation Techniques',
        description: 'Testing your business idea before launch',
        type: 'video',
        content: 'https://www.youtube.com/embed/tMVwaQS6lRY',
        duration: 50,
        order: 2,
      },
      {
        id: '10-3',
        courseId: '10',
        title: 'Business Model Canvas',
        description: 'Designing your business model systematically',
        type: 'video',
        content: 'https://www.youtube.com/embed/QoAOweEOKVU',
        duration: 55,
        order: 3,
      },
      {
        id: '10-4',
        courseId: '10',
        title: 'Funding Your Startup',
        description: 'Exploring funding options and investor pitches',
        type: 'video',
        content: 'https://www.youtube.com/embed/RBFRgR7yoC8',
        duration: 60,
        order: 4,
      },
      {
        id: '10-5',
        courseId: '10',
        title: 'Scaling Your Business',
        description: 'Growth strategies and operational scaling',
        type: 'video',
        content: 'https://www.youtube.com/embed/NHOwRj18p4g',
        duration: 70,
        order: 5,
      },
    ],
  },
  {
    id: '11',
    title: 'Project Management Professional',
    description: 'Master project management methodologies, tools, and leadership skills for successful project delivery.',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
    instructorId: '1',
    instructorName: 'John Doe',
    price: 249.99,
    duration: '18 hours',
    level: 'advanced',
    category: 'Business',
    enrolledStudents: 967,
    rating: 4.8,
    isPublic: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-08'),
    lessons: [
      {
        id: '11-1',
        courseId: '11',
        title: 'Project Lifecycle Overview',
        description: 'Understanding the phases of project management',
        type: 'video',
        content: 'https://www.youtube.com/embed/Qm7xe3dLj1Y',
        duration: 70,
        order: 1,
      },
      {
        id: '11-2',
        courseId: '11',
        title: 'Agile vs Waterfall Methodologies',
        description: 'Comparing different project management approaches',
        type: 'video',
        content: 'https://www.youtube.com/embed/9TycLR0TqFA',
        duration: 45,
        order: 2,
      },
      {
        id: '11-3',
        courseId: '11',
        title: 'Risk Management',
        description: 'Identifying and mitigating project risks',
        type: 'video',
        content: 'https://www.youtube.com/embed/dGD1cOm6fNU',
        duration: 50,
        order: 3,
      },
      {
        id: '11-4',
        courseId: '11',
        title: 'Team Leadership and Communication',
        description: 'Leading teams and stakeholder management',
        type: 'video',
        content: 'https://www.youtube.com/embed/3cFrM_KdK8s',
        duration: 55,
        order: 4,
      },
      {
        id: '11-5',
        courseId: '11',
        title: 'Project Tools and Software',
        description: 'Using modern tools for project management',
        type: 'video',
        content: 'https://www.youtube.com/embed/UNgBQJdF8Nk',
        duration: 40,
        order: 5,
      },
    ],
  },
  // Music Courses
  {
    id: '12',
    title: 'Music Production with Ableton Live',
    description: 'Create professional-quality music tracks using Ableton Live. Learn mixing, mastering, and sound design.',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 219.99,
    duration: '16 hours',
    level: 'intermediate',
    category: 'Music',
    enrolledStudents: 1876,
    rating: 4.7,
    isPublic: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lessons: [
      {
        id: '12-1',
        courseId: '12',
        title: 'Ableton Live Interface',
        description: 'Getting familiar with the DAW environment',
        type: 'video',
        content: 'https://www.youtube.com/embed/yZBTEhYgTJM',
        duration: 35,
        order: 1,
      },
      {
        id: '12-2',
        courseId: '12',
        title: 'MIDI and Audio Recording',
        description: 'Recording techniques and workflow basics',
        type: 'video',
        content: 'https://www.youtube.com/embed/cVBTF3eqLww',
        duration: 45,
        order: 2,
      },
      {
        id: '12-3',
        courseId: '12',
        title: 'Beat Making and Drum Programming',
        description: 'Creating rhythms and drum patterns',
        type: 'video',
        content: 'https://www.youtube.com/embed/7A7J8l_gFOI',
        duration: 50,
        order: 3,
      },
      {
        id: '12-4',
        courseId: '12',
        title: 'Mixing and Effects',
        description: 'Balancing tracks and using audio effects',
        type: 'video',
        content: 'https://www.youtube.com/embed/zP2vIdfEJPY',
        duration: 60,
        order: 4,
      },
      {
        id: '12-5',
        courseId: '12',
        title: 'Mastering Your Track',
        description: 'Final polish and preparation for release',
        type: 'video',
        content: 'https://www.youtube.com/embed/91qs3fux5WE',
        duration: 40,
        order: 5,
      },
    ],
  },
  {
    id: '13',
    title: 'Guitar for Beginners',
    description: 'Learn to play guitar from scratch. Master chords, strumming patterns, and popular songs.',
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=250&fit=crop',
    instructorId: '1',
    instructorName: 'John Doe',
    price: 0,
    duration: '8 hours',
    level: 'beginner',
    category: 'Music',
    enrolledStudents: 3421,
    rating: 4.5,
    isPublic: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    lessons: [
      {
        id: '13-1',
        courseId: '13',
        title: 'Holding the Guitar',
        description: 'Proper posture and guitar positioning',
        type: 'video',
        content: 'https://www.youtube.com/embed/F_3zks8p_yc',
        duration: 25,
        order: 1,
      },
      {
        id: '13-2',
        courseId: '13',
        title: 'Basic Chords',
        description: 'Learning your first major and minor chords',
        type: 'video',
        content: 'https://www.youtube.com/embed/BqLZUO-6-nM',
        duration: 40,
        order: 2,
      },
      {
        id: '13-3',
        courseId: '13',
        title: 'Strumming Patterns',
        description: 'Rhythm and strumming techniques',
        type: 'video',
        content: 'https://www.youtube.com/embed/jS0NkpwEqPE',
        duration: 35,
        order: 3,
      },
      {
        id: '13-4',
        courseId: '13',
        title: 'Your First Song',
        description: 'Playing complete songs with basic chords',
        type: 'video',
        content: 'https://www.youtube.com/embed/IGAfg-nFguE',
        duration: 30,
        order: 4,
      },
      {
        id: '13-5',
        courseId: '13',
        title: 'Fingerpicking Basics',
        description: 'Introduction to fingerstyle guitar playing',
        type: 'video',
        content: 'https://www.youtube.com/embed/NdpHzNWdGjg',
        duration: 45,
        order: 5,
      },
    ],
  },
  // Photography Courses
  {
    id: '14',
    title: 'Portrait Photography Masterclass',
    description: 'Master the art of portrait photography with lighting techniques, posing, and post-processing skills.',
    thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 189.99,
    duration: '13 hours',
    level: 'intermediate',
    category: 'Photography',
    enrolledStudents: 1245,
    rating: 4.8,
    isPublic: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-28'),
    lessons: [
      {
        id: '14-1',
        courseId: '14',
        title: 'Understanding Natural Light',
        description: 'Working with available light for portraits',
        type: 'video',
        content: 'https://www.youtube.com/embed/uCavM8i4wBM',
        duration: 42,
        order: 1,
      },
      {
        id: '14-2',
        courseId: '14',
        title: 'Portrait Posing Techniques',
        description: 'Directing subjects for flattering portraits',
        type: 'video',
        content: 'https://www.youtube.com/embed/ff7nltdBCHs',
        duration: 50,
        order: 2,
      },
      {
        id: '14-3',
        courseId: '14',
        title: 'Studio Lighting Setup',
        description: 'Working with artificial lighting for portraits',
        type: 'video',
        content: 'https://www.youtube.com/embed/IVGHaGsCD54',
        duration: 55,
        order: 3,
      },
      {
        id: '14-4',
        courseId: '14',
        title: 'Portrait Retouching',
        description: 'Post-processing techniques for portraits',
        type: 'video',
        content: 'https://www.youtube.com/embed/1YY3kNOK_QM',
        duration: 45,
        order: 4,
      },
    ],
  },
  {
    id: '15',
    title: 'Landscape Photography Essentials',
    description: 'Capture stunning landscape photos with composition techniques, timing, and equipment knowledge.',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    instructorId: '1',
    instructorName: 'John Doe',
    price: 0,
    duration: '10 hours',
    level: 'beginner',
    category: 'Photography',
    enrolledStudents: 1687,
    rating: 4.6,
    isPublic: true,
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-25'),
    lessons: [
      {
        id: '15-1',
        courseId: '15',
        title: 'Golden Hour Photography',
        description: 'Making the most of sunrise and sunset lighting',
        type: 'video',
        content: 'https://www.youtube.com/embed/l1MwHBJY9-Q',
        duration: 38,
        order: 1,
      },
      {
        id: '15-2',
        courseId: '15',
        title: 'Composition Techniques',
        description: 'Rule of thirds, leading lines, and framing',
        type: 'video',
        content: 'https://www.youtube.com/embed/7ZVyNjKSr0M',
        duration: 45,
        order: 2,
      },
      {
        id: '15-3',
        courseId: '15',
        title: 'Long Exposure Landscapes',
        description: 'Creating motion blur and smooth water effects',
        type: 'video',
        content: 'https://www.youtube.com/embed/dVCfCFJcnRA',
        duration: 50,
        order: 3,
      },
      {
        id: '15-4',
        courseId: '15',
        title: 'Landscape Post-Processing',
        description: 'Enhancing landscape photos in post-production',
        type: 'video',
        content: 'https://www.youtube.com/embed/r0XCuslSr8A',
        duration: 40,
        order: 4,
      },
    ],
  },
  // Additional Finance Courses
  {
    id: '16',
    title: 'Stock Market Investing for Beginners',
    description: 'Learn fundamental and technical analysis, portfolio diversification, and long-term investment strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 0,
    duration: '12 hours',
    level: 'beginner',
    category: 'Finance',
    enrolledStudents: 2234,
    rating: 4.7,
    isPublic: true,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-05'),
    lessons: [
      {
        id: '16-1',
        courseId: '16',
        title: 'Stock Market Basics',
        description: 'Understanding how stock markets work',
        type: 'video',
        content: 'https://www.youtube.com/embed/p7HKvqRI_Bo',
        duration: 52,
        order: 1,
      },
      {
        id: '16-2',
        courseId: '16',
        title: 'Fundamental Analysis',
        description: 'Analyzing company financials and value',
        type: 'video',
        content: 'https://www.youtube.com/embed/7pwHGyuFcVw',
        duration: 60,
        order: 2,
      },
      {
        id: '16-3',
        courseId: '16',
        title: 'Technical Analysis Basics',
        description: 'Reading charts and price patterns',
        type: 'video',
        content: 'https://www.youtube.com/embed/08c4YvEQs-s',
        duration: 55,
        order: 3,
      },
      {
        id: '16-4',
        courseId: '16',
        title: 'Portfolio Diversification',
        description: 'Managing risk through diversification',
        type: 'video',
        content: 'https://www.youtube.com/embed/uSIzXUVPvn8',
        duration: 45,
        order: 4,
      },
    ],
  },
  // Health & Fitness Courses
  {
    id: '17',
    title: 'Home Workout Revolution',
    description: 'Get fit at home with bodyweight exercises, HIIT routines, and flexible workout plans for all levels.',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
    instructorId: '1',
    instructorName: 'John Doe',
    price: 0,
    duration: '6 hours',
    level: 'beginner',
    category: 'Health & Fitness',
    enrolledStudents: 4567,
    rating: 4.4,
    isPublic: true,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-12'),
    lessons: [
      {
        id: '17-1',
        courseId: '17',
        title: 'Bodyweight Basics',
        description: 'Fundamental exercises you can do anywhere',
        type: 'video',
        content: 'https://www.youtube.com/embed/vc1E5CfRfos',
        duration: 30,
        order: 1,
      },
      {
        id: '17-2',
        courseId: '17',
        title: 'HIIT Workouts',
        description: 'High-intensity interval training routines',
        type: 'video',
        content: 'https://www.youtube.com/embed/ml6cT4AZdqI',
        duration: 25,
        order: 2,
      },
      {
        id: '17-3',
        courseId: '17',
        title: 'Strength Training at Home',
        description: 'Building muscle without equipment',
        type: 'video',
        content: 'https://www.youtube.com/embed/IODxDxX7oi4',
        duration: 35,
        order: 3,
      },
      {
        id: '17-4',
        courseId: '17',
        title: 'Flexibility and Mobility',
        description: 'Stretching and mobility routines',
        type: 'video',
        content: 'https://www.youtube.com/embed/L_xrDAtykMI',
        duration: 40,
        order: 4,
      },
    ],
  },
  {
    id: '18',
    title: 'Nutrition and Meal Planning',
    description: 'Learn to create balanced meal plans, understand macronutrients, and develop healthy eating habits.',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
    instructorId: '2',
    instructorName: 'Sarah Wilson',
    price: 0,
    duration: '9 hours',
    level: 'beginner',
    category: 'Health & Fitness',
    enrolledStudents: 2890,
    rating: 4.6,
    isPublic: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25'),
    lessons: [
      {
        id: '18-1',
        courseId: '18',
        title: 'Understanding Macronutrients',
        description: 'Proteins, carbohydrates, and fats explained',
        type: 'video',
        content: 'https://www.youtube.com/embed/YdqZNWmPSNI',
        duration: 45,
        order: 1,
      },
      {
        id: '18-2',
        courseId: '18',
        title: 'Meal Planning Strategies',
        description: 'Planning balanced meals for the week',
        type: 'video',
        content: 'https://www.youtube.com/embed/hu2zDLzjdRI',
        duration: 50,
        order: 2,
      },
      {
        id: '18-3',
        courseId: '18',
        title: 'Healthy Cooking Techniques',
        description: 'Preparing nutritious meals efficiently',
        type: 'video',
        content: 'https://www.youtube.com/embed/q3zq6oq2avA',
        duration: 40,
        order: 3,
      },
      {
        id: '18-4',
        courseId: '18',
        title: 'Supplements and Hydration',
        description: 'Understanding supplements and water intake',
        type: 'video',
        content: 'https://www.youtube.com/embed/OuTnr4fV_GU',
        duration: 35,
        order: 4,
      },
    ],
  },
];

const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: '1',
    userId: '1',
    courseId: '1',
    enrolledAt: new Date('2024-01-16'),
  },
];

const MOCK_PROGRESS: Progress[] = [
  {
    userId: '1',
    courseId: '1',
    completedLessons: ['1-1', '1-2'],
    currentLesson: '1-3',
    progressPercentage: 50,
    lastAccessed: new Date(),
  },
];

export const useCourseStore = create<CourseState>()((set, get) => ({
  courses: MOCK_COURSES,
  enrollments: MOCK_ENROLLMENTS,
  progress: MOCK_PROGRESS,
  quizAttempts: [],
  certificates: [],
  notes: [],
  selectedCourse: null,
  
  getCourses: () => get().courses,
  
  getPublicCourses: () => get().courses.filter(course => course.isPublic),
  
  getCourseById: (id: string) => get().courses.find(course => course.id === id),
  
  getEnrolledCourses: (userId: string) => {
    const { courses, enrollments } = get();
    const userEnrollments = enrollments.filter(e => e.userId === userId);
    return courses.filter(course => 
      userEnrollments.some(e => e.courseId === course.id)
    );
  },
  
  getInstructorCourses: (instructorId: string) => {
    return get().courses.filter(course => course.instructorId === instructorId);
  },
  
  getCourseProgress: (userId: string, courseId: string) => {
    return get().progress.find(p => p.userId === userId && p.courseId === courseId);
  },
  
  enrollInCourse: (userId: string, courseId: string) => {
    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      userId,
      courseId,
      enrolledAt: new Date(),
    };
    
    const newProgress: Progress = {
      userId,
      courseId,
      completedLessons: [],
      currentLesson: '',
      progressPercentage: 0,
      lastAccessed: new Date(),
    };
    
    // Update course enrollment count
    set(state => ({
      enrollments: [...state.enrollments, newEnrollment],
      progress: [...state.progress, newProgress],
      courses: state.courses.map(course =>
        course.id === courseId
          ? { ...course, enrolledStudents: course.enrolledStudents + 1, updatedAt: new Date() }
          : course
      ),
    }));
  },
  
  updateProgress: (userId: string, courseId: string, lessonId: string) => {
    set(state => ({
      progress: state.progress.map(p => {
        if (p.userId === userId && p.courseId === courseId) {
          const course = state.courses.find(c => c.id === courseId);
          if (!course) return p;
          
          const completedLessons = [...new Set([...p.completedLessons, lessonId])];
          const progressPercentage = (completedLessons.length / course.lessons.length) * 100;
          
          return {
            ...p,
            completedLessons,
            progressPercentage: Math.round(progressPercentage),
            lastAccessed: new Date(),
          };
        }
        return p;
      }),
    }));
  },
  
  setSelectedCourse: (course: Course | null) => {
    set({ selectedCourse: course });
  },
  
  createCourse: (courseData) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...courseData, // Spread courseData after to avoid overriding
    };
    
    set(state => ({
      courses: [...state.courses, newCourse],
    }));
    
    return newCourse.id;
  },
  
  updateCourse: (courseId: string, updates: Partial<Course>) => {
    set(state => ({
      courses: state.courses.map(course =>
        course.id === courseId
          ? { ...course, ...updates, updatedAt: new Date() }
          : course
      ),
    }));
  },
  
  deleteCourse: (courseId: string) => {
    set(state => ({
      courses: state.courses.filter(course => course.id !== courseId),
    }));
  },

  // Quiz and Certificate methods
  saveQuizAttempt: (attempt: QuizAttempt) => {
    set(state => ({
      quizAttempts: [...state.quizAttempts, attempt],
    }));
  },

  generateCertificate: (userId: string, courseId: string, score: number) => {
    const course = get().getCourseById(courseId);
    if (!course) throw new Error('Course not found');

    const certificate: Certificate = {
      id: Date.now().toString(),
      userId,
      courseId,
      courseName: course.title,
      instructorName: course.instructorName,
      issuedAt: new Date(),
      score,
      certificateNumber: `SKILLSET-${courseId}-${userId}-${Date.now().toString().slice(-6)}`,
    };

    set(state => ({
      certificates: [...state.certificates, certificate],
    }));

    return certificate;
  },

  getUserCertificates: (userId: string) => {
    return get().certificates.filter(cert => cert.userId === userId);
  },

  getCourseQuizAttempts: (userId: string, courseId: string) => {
    return get().quizAttempts.filter(attempt => 
      attempt.userId === userId && attempt.courseId === courseId
    );
  },

  hasCourseCompletion: (userId: string, courseId: string) => {
    const attempts = get().getCourseQuizAttempts(userId, courseId);
    return attempts.some(attempt => attempt.passed);
  },

  // Notes methods
  saveNote: (noteData) => {
    const newNote: Note = {
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...noteData,
    };

    set(state => ({
      notes: [...state.notes, newNote],
    }));
  },

  updateNote: (noteId: string, updates: Partial<Note>) => {
    set(state => ({
      notes: state.notes.map(note =>
        note.id === noteId
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      ),
    }));
  },

  deleteNote: (noteId: string) => {
    set(state => ({
      notes: state.notes.filter(note => note.id !== noteId),
    }));
  },

  getUserNotes: (userId: string) => {
    return get().notes.filter(note => note.userId === userId);
  },

  getCourseNotes: (userId: string, courseId: string) => {
    return get().notes.filter(note => 
      note.userId === userId && note.courseId === courseId
    );
  },
}));