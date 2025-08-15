import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import StudentList from '../components/StudentList';
import MessagingSystem from '../components/MessagingSystem';
import CourseAnalytics from '../components/CourseAnalytics';
import NotificationSystem from '../components/NotificationSystem';
import { PlusCircle, BookOpen, Users, TrendingUp, Edit, Trash2, Eye, Upload, Video, Image, UserCheck, Star, MessageCircle, BarChart3, Download, Globe, Lock } from 'lucide-react';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getInstructorCourses, deleteCourse, enrollments, updateCourse } = useCourseStore();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'image'>('video');
  const [studentListModal, setStudentListModal] = useState(false);
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<string | null>(null);
  const [messagingModal, setMessagingModal] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [selectedCourseForAnalytics, setSelectedCourseForAnalytics] = useState<{ id: string; name: string } | null>(null);
  const [realTimeStats, setRealTimeStats] = useState({
    todayEnrollments: 0,
    todayViews: 0,
    onlineStudents: 0,
    messageCount: 0,
    realTimeRating: 0,
    realTimeRevenue: 0,
    totalViews: 0
  });
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const instructorCourses = user ? getInstructorCourses(user.id) : [];
  
  const totalStudents = instructorCourses.reduce((total, course) => 
    total + enrollments.filter(e => e.courseId === course.id).length, 0
  );
  
  const totalRevenue = instructorCourses.reduce((total, course) => {
    const courseEnrollments = enrollments.filter(e => e.courseId === course.id).length;
    return total + (course.price * courseEnrollments);
  }, 0);
  
  const averageRating = instructorCourses.length > 0 
    ? Math.min(5, Math.max(1, instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.length))
    : 0;

  const hasUploadedCourses = instructorCourses.length > 0;

  // Initialize real-time stats with current values
  useEffect(() => {
    setRealTimeStats(prev => ({
      ...prev,
      realTimeRating: averageRating,
      realTimeRevenue: totalRevenue,
      totalViews: totalStudents * 4.2
    }));
  }, [averageRating, totalRevenue, totalStudents]);

  // Real-time data simulation - only when instructor has uploaded courses
  useEffect(() => {
    if (!hasUploadedCourses) {
      return; // Don't start real-time updates if no courses uploaded
    }

    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        todayEnrollments: prev.todayEnrollments + Math.floor(Math.random() * 2),
        todayViews: prev.todayViews + Math.floor(Math.random() * 5),
        onlineStudents: Math.floor(Math.random() * 50) + 20,
        messageCount: prev.messageCount + (Math.random() > 0.8 ? 1 : 0),
        realTimeRating: Math.min(5, Math.max(1, prev.realTimeRating + (Math.random() - 0.5) * 0.1)),
        realTimeRevenue: totalRevenue + Math.floor(Math.random() * (totalRevenue * 0.05)),
        totalViews: prev.totalViews + Math.floor(Math.random() * 10) + 5
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [hasUploadedCourses]);

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId);
    }
  };

  const handleFileUpload = (courseId: string, type: 'video' | 'image') => {
    setSelectedCourse(courseId);
    setUploadType(type);
    setUploadModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCourse) {
      // In a real app, you'd upload to a cloud service
      // For demo purposes, we'll just show a success message
      const fileUrl = URL.createObjectURL(file);
      console.log(`File uploaded: ${file.name}, URL: ${fileUrl}`);
      
      // Update course with new media
      const course = instructorCourses.find(c => c.id === selectedCourse);
      if (course) {
        const newLesson = {
          id: `${selectedCourse}-${Date.now()}`,
          courseId: selectedCourse,
          title: `${uploadType === 'video' ? 'Video' : 'Image'}: ${file.name}`,
          description: `Uploaded ${uploadType} content`,
          type: uploadType as 'video',
          content: fileUrl,
          duration: uploadType === 'video' ? 30 : undefined,
          order: course.lessons.length + 1,
        };
        
        updateCourse(selectedCourse, {
          lessons: [...course.lessons, newLesson],
          updatedAt: new Date()
        });
      }
      
      setUploadModal(false);
      setSelectedCourse(null);
    }
  };

  const getEnrolledStudents = (courseId: string) => {
    return enrollments.filter(e => e.courseId === courseId);
  };

  const handleViewStudents = (courseId: string) => {
    setSelectedCourseForStudents(courseId);
    setStudentListModal(true);
  };

  const handleOpenMessaging = () => {
    setMessagingModal(true);
  };

  const handleOpenAnalytics = (courseId: string, courseName: string) => {
    setSelectedCourseForAnalytics({ id: courseId, name: courseName });
    setAnalyticsModal(true);
  };

  const handleToggleVisibility = (courseId: string, currentVisibility: boolean) => {
    updateCourse(courseId, { isPublic: !currentVisibility });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-600">Manage your courses and track your teaching success</p>
            {hasUploadedCourses && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  {realTimeStats.onlineStudents} students online
                </span>
                <span>•</span>
                <span>{realTimeStats.todayEnrollments} new enrollments today</span>
                <span>•</span>
                <span>{realTimeStats.todayViews} course views today</span>
              </div>
            )}
            {!hasUploadedCourses && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>📚 Create your first course to start tracking real-time analytics</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <NotificationSystem instructorId={user?.id || ''} />
            <Link
              to="/instructor/create-course"
              className="btn-primary flex items-center space-x-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create Course</span>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Active Courses</p>
                <p className="text-3xl font-bold">{instructorCourses.length}</p>
                <p className="text-primary-200 text-xs mt-1">+2 this month</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents}</p>
                <p className="text-green-200 text-xs mt-1">+{realTimeStats.todayEnrollments} today</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">
                  ${hasUploadedCourses ? realTimeStats.realTimeRevenue.toLocaleString() : totalRevenue.toLocaleString()}
                </p>
                <p className="text-blue-200 text-xs mt-1">
                  {hasUploadedCourses ? '+8.2% from last month' : 'Upload courses to start earning'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Avg. Rating</p>
                <p className="text-3xl font-bold">
                  {hasUploadedCourses ? realTimeStats.realTimeRating.toFixed(1) : averageRating.toFixed(1)}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-200 mr-1" />
                  <p className="text-yellow-200 text-xs">
                    {hasUploadedCourses ? 
                      (realTimeStats.realTimeRating >= 4.5 ? 'Excellent' :
                       realTimeStats.realTimeRating >= 4.0 ? 'Very Good' :
                       realTimeStats.realTimeRating >= 3.5 ? 'Good' :
                       realTimeStats.realTimeRating >= 3.0 ? 'Average' : 'Needs Improvement') 
                      : 'No rating yet'}
                  </p>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Course Views</p>
                <p className="text-3xl font-bold">
                  {hasUploadedCourses ? Math.floor(realTimeStats.totalViews).toLocaleString() : Math.floor(totalStudents * 4.2).toLocaleString()}
                </p>
                <p className="text-purple-200 text-xs mt-1">
                  {hasUploadedCourses ? `+${realTimeStats.todayViews} today` : 'Create courses to get views'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-3 gap-8">
          {/* Enhanced Course Management */}
          <div className="lg:col-span-3 xl:col-span-2">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
                    <p className="text-sm text-gray-600">Manage content, view analytics, and supervise students</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {instructorCourses.length > 0 ? (
                  <div className="space-y-6">
                    {instructorCourses.map((course) => {
                      const courseStudents = getEnrolledStudents(course.id);
                      const courseRevenue = course.price * courseStudents.length;
                      
                      return (
                        <div key={course.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-1 text-xs rounded-full flex items-center ${
                                        course.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {course.isPublic ? (
                                          <>
                                            <Globe className="h-3 w-3 mr-1" />
                                            Public
                                          </>
                                        ) : (
                                          <>
                                            <Lock className="h-3 w-3 mr-1" />
                                            Private
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{course.category} • {course.level} • {course.lessons.length} lessons</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <Users className="h-4 w-4 mr-1" />
                                      {courseStudents.length} students
                                    </span>
                                    <span className="flex items-center">
                                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                      {course.rating.toFixed(1)} ({course.rating >= 4.5 ? 'Excellent' :
                                                                    course.rating >= 4.0 ? 'Very Good' :
                                                                    course.rating >= 3.5 ? 'Good' :
                                                                    course.rating >= 3.0 ? 'Average' : 'Needs Improvement'})
                                    </span>
                                    <span className="flex items-center">
                                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                                      ${courseRevenue.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleFileUpload(course.id, 'video')}
                                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                      title="Upload Video"
                                    >
                                      <Video className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleFileUpload(course.id, 'image')}
                                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                      title="Upload Image"
                                    >
                                      <Image className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleToggleVisibility(course.id, course.isPublic)}
                                  className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                    course.isPublic 
                                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                  title={course.isPublic ? 'Make Private' : 'Make Public'}
                                >
                                  {course.isPublic ? (
                                    <>
                                      <Lock className="h-4 w-4 mr-1" />
                                      Make Private
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="h-4 w-4 mr-1" />
                                      Make Public
                                    </>
                                  )}
                                </button>
                                <Link
                                  to={`/course/${course.id}`}
                                  className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Link>
                                <Link
                                  to={`/instructor/edit-course/${course.id}`}
                                  className="inline-flex items-center px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit Content
                                </Link>
                                <button
                                  onClick={() => handleOpenAnalytics(course.id, course.title)}
                                  className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                  <BarChart3 className="h-4 w-4 mr-1" />
                                  Analytics
                                </button>
                                <button
                                  onClick={() => handleViewStudents(course.id)}
                                  className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  View Students ({courseStudents.length})
                                </button>
                                <button
                                  onClick={handleOpenMessaging}
                                  className="inline-flex items-center px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Messages
                                  {realTimeStats.messageCount > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                      {realTimeStats.messageCount}
                                    </span>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="inline-flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-500 mb-6">
                      Create your first course to start teaching and earning.
                    </p>
                    <Link
                      to="/instructor/create-course"
                      className="btn-primary"
                    >
                      Create Your First Course
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Supervision Panel */}
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Student Activity</h2>
                <p className="text-xs sm:text-sm text-gray-600">Recent enrollments and progress</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {enrollments.slice(0, 5).map((enrollment) => {
                    const course = instructorCourses.find(c => c.id === enrollment.courseId);
                    if (!course) return null;
                    
                    return (
                      <div key={enrollment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900">New student enrolled</p>
                          <p className="text-xs text-gray-500 truncate">{course.title}</p>
                          <p className="text-xs text-gray-400">{enrollment.enrolledAt.toLocaleDateString()}</p>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    );
                  })}
                  
                  {enrollments.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No student activity yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-lg">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  <Link
                    to="/instructor/create-course"
                    className="w-full flex items-center p-2 sm:p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Create New Course</span>
                  </Link>
                  <button 
                    onClick={handleOpenMessaging}
                    className="w-full flex items-center p-2 sm:p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Student Messages</span>
                    {realTimeStats.messageCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                        {realTimeStats.messageCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Modal */}
        {uploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload {uploadType === 'video' ? 'Video' : 'Image'}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Select a {uploadType} file to add to your course content.
              </p>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {uploadType === 'video' ? (
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  ) : (
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <p className="text-sm text-gray-600 mb-4">
                    Click to select {uploadType} file or drag and drop
                  </p>
                  <input
                    ref={uploadType === 'video' ? videoInputRef : imageInputRef}
                    type="file"
                    accept={uploadType === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      if (uploadType === 'video') {
                        videoInputRef.current?.click();
                      } else {
                        imageInputRef.current?.click();
                      }
                    }}
                    className="btn-primary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setUploadModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student List Modal */}
        {studentListModal && selectedCourseForStudents && (
          <StudentList
            courseId={selectedCourseForStudents}
            enrollments={enrollments}
            onClose={() => {
              setStudentListModal(false);
              setSelectedCourseForStudents(null);
            }}
          />
        )}

        {/* Messaging System Modal */}
        {messagingModal && (
          <MessagingSystem
            instructorId={user?.id || ''}
            onClose={() => setMessagingModal(false)}
          />
        )}

        {/* Course Analytics Modal */}
        {analyticsModal && selectedCourseForAnalytics && (
          <CourseAnalytics
            courseId={selectedCourseForAnalytics.id}
            courseName={selectedCourseForAnalytics.name}
            onClose={() => {
              setAnalyticsModal(false);
              setSelectedCourseForAnalytics(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;