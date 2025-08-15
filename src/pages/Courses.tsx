import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';
import { Search, Filter, Star, Clock, Users, BookOpen, MessageCircle } from 'lucide-react';
import CourseQABot from '../components/CourseQABot';
import PaymentModal from '../components/PaymentModal';

const Courses: React.FC = () => {
  const { getPublicCourses, enrollInCourse, enrollments } = useCourseStore();
  const { user } = useAuthStore();
  const courses = getPublicCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCourseForBot, setSelectedCourseForBot] = useState<string | null>(null);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<string | null>(null);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = [...new Set(courses.map(course => course.category))];
  const levels = ['beginner', 'intermediate', 'advanced'];

  const isEnrolled = (courseId: string) => {
    return user && enrollments.some(e => e.userId === user.id && e.courseId === courseId);
  };

  const handleEnroll = (courseId: string) => {
    if (!user) return;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Free courses (beginner level) can enroll directly
    if (course.level === 'beginner' || course.price === 0) {
      enrollInCourse(user.id, courseId);
    } else {
      // Paid courses need payment processing
      setSelectedCourseForPayment(courseId);
    }
  };

  const handlePaymentSuccess = () => {
    if (user && selectedCourseForPayment) {
      enrollInCourse(user.id, selectedCourseForPayment);
      setSelectedCourseForPayment(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Courses</h1>
          <p className="mt-2 text-gray-600">
            Master niche skills with expert-led courses tailored for specialized learning.
          </p>
          
          {/* Free Beginner Courses Notice */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Good news!</span> All beginner-level courses are completely free. 
                  Start your learning journey with zero cost and lifetime access to course materials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
                    alt={course.instructorName}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{course.instructorName}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.enrolledStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span>{course.rating.toFixed(1)} ({course.rating >= 4.5 ? 'Excellent' :
                                                          course.rating >= 4.0 ? 'Very Good' :
                                                          course.rating >= 3.5 ? 'Good' :
                                                          course.rating >= 3.0 ? 'Average' : 'Needs Improvement'})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {course.level === 'beginner' ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${course.price}`
                    )}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    {!isEnrolled(course.id) && (
                      <button
                        onClick={() => setSelectedCourseForBot(course.id)}
                        className="flex items-center space-x-1 px-3 py-2 border border-primary-300 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
                        title="Ask questions about this course"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Ask Bot</span>
                      </button>
                    )}
                    
                    {isEnrolled(course.id) ? (
                      <Link
                        to={`/course/${course.id}`}
                        className="flex items-center space-x-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Continue</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="btn-primary text-sm"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or browse all courses.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('');
                setSelectedCategory('');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Q&A Bot Modal */}
        {selectedCourseForBot && (
          <CourseQABot
            course={courses.find(c => c.id === selectedCourseForBot)!}
            onClose={() => setSelectedCourseForBot(null)}
          />
        )}

        {/* Payment Modal */}
        {selectedCourseForPayment && (
          <PaymentModal
            course={courses.find(c => c.id === selectedCourseForPayment)!}
            onClose={() => setSelectedCourseForPayment(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Courses;