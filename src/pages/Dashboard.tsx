import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { Clock, BookOpen, TrendingUp, Play, Calendar, User, Mail, Edit3, Check, X } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { getEnrolledCourses, getCourseProgress } = useCourseStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const enrolledCourses = user ? getEnrolledCourses(user.id) : [];
  
  const progressData = enrolledCourses.map(course => {
    const progress = user ? getCourseProgress(user.id, course.id) : undefined;
    return {
      course,
      progress: progress?.progressPercentage || 0,
      lastAccessed: progress?.lastAccessed || new Date(),
      completedLessons: progress?.completedLessons.length || 0,
      totalLessons: course.lessons.length,
    };
  });

  const recentCourses = progressData
    .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
    .slice(0, 3);

  const totalProgress = progressData.length > 0 
    ? Math.round(progressData.reduce((sum, item) => sum + item.progress, 0) / progressData.length)
    : 0;

  const completedCourses = progressData.filter(item => item.progress === 100).length;

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Continue your learning journey where you left off.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900">{totalProgress}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                  )}
                </div>
                <div className="text-white min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold truncate">{user?.name}</h2>
                  <p className="text-primary-100 text-sm capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="mt-3 sm:mt-0 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
              >
                {isEditingProfile ? (
                  <>
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 text-sm sm:text-base truncate">{user?.name}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 text-sm sm:text-base truncate">{user?.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditingProfile && (
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-2 sm:space-y-0 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Continue Learning */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
              <p className="text-sm text-gray-600">Pick up where you left off</p>
            </div>
            <div className="p-6">
              {recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map(({ course, progress, completedLessons, totalLessons }) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {completedLessons} of {totalLessons} lessons completed
                        </p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
                      </div>
                      <Link
                        to={`/course/${course.id}`}
                        className="flex items-center justify-center w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-full transition-colors"
                      >
                        <Play className="h-4 w-4 text-primary-600" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No courses enrolled yet</p>
                  <Link
                    to="/courses"
                    className="btn-primary"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
              <p className="text-sm text-gray-600">Based on your interests</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=64&h=64&fit=crop"
                    alt="Advanced React Development"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      Advanced React Development
                    </h3>
                    <p className="text-sm text-gray-500">16 hours • Advanced</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-gray-900">$249.99</span>
                      <span className="ml-2 text-xs text-yellow-600">★ 4.9</span>
                    </div>
                  </div>
                  <Link
                    to="/course/3"
                    className="btn-secondary text-sm"
                  >
                    View
                  </Link>
                </div>

                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=64&h=64&fit=crop"
                    alt="Cryptocurrency Trading"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      Cryptocurrency Trading Fundamentals
                    </h3>
                    <p className="text-sm text-gray-500">8 hours • Beginner</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-gray-900">$199.99</span>
                      <span className="ml-2 text-xs text-yellow-600">★ 4.6</span>
                    </div>
                  </div>
                  <Link
                    to="/course/2"
                    className="btn-secondary text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/courses"
              className="flex items-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Browse Courses</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Discover new skills</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">View Profile</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Update your info</p>
              </div>
            </Link>

            <Link
              to="/study-goals"
              className="flex items-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Learning Goals</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Set and track goals</p>
              </div>
            </Link>

            <Link
              to="/study-reminders"
              className="flex items-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Study Reminders</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Manage notifications</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;