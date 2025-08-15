import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, Clock, Download, Star, Calendar, BarChart3, RefreshCw } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';

interface AnalyticsData {
  courseId: string;
  courseName: string;
  views: number;
  enrollments: number;
  completionRate: number;
  averageRating: number;
  revenue: number;
  watchTime: number;
  viewsToday: number;
  enrollmentsToday: number;
  dailyViews: { date: string; views: number }[];
  studentProgress: { studentId: string; studentName: string; progress: number; lastActive: Date }[];
}

interface CourseAnalyticsProps {
  courseId: string;
  courseName: string;
  onClose: () => void;
}

const CourseAnalytics: React.FC<CourseAnalyticsProps> = ({ courseId, courseName, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const { getCourseById, enrollments } = useCourseStore();

  const generateAnalyticsData = (timeRange: '7d' | '30d' | '90d'): AnalyticsData => {
    const course = getCourseById(courseId);
    const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
    
    if (!course) {
      return {
        courseId,
        courseName,
        views: 0,
        enrollments: 0,
        completionRate: 0,
        averageRating: 0,
        revenue: 0,
        watchTime: 0,
        viewsToday: 0,
        enrollmentsToday: 0,
        dailyViews: [],
        studentProgress: []
      };
    }

    // Calculate base metrics
    const totalEnrollments = courseEnrollments.length;
    const revenue = totalEnrollments * course.price;
    const avgRating = course.rating;
    
    // Generate time-period specific data
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const baseViews = totalEnrollments * 8; // Assume 8 views per enrollment on average
    const viewsMultiplier = timeRange === '7d' ? 0.3 : timeRange === '30d' ? 1 : 2.5;
    const views = Math.floor(baseViews * viewsMultiplier);
    
    // Generate daily views data
    const dailyViews = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseDaily = Math.floor(views / days);
      const variance = Math.floor(baseDaily * 0.4 * (Math.random() - 0.5));
      dailyViews.push({
        date: date.toISOString().split('T')[0],
        views: Math.max(0, baseDaily + variance)
      });
    }

    // Calculate completion rate based on course complexity
    const lessonCount = course.lessons.length;
    const baseDifficulty = course.level === 'beginner' ? 0.8 : course.level === 'intermediate' ? 0.65 : 0.45;
    const lengthFactor = Math.max(0.3, 1 - (lessonCount - 5) * 0.05); // Longer courses have lower completion
    const completionRate = Math.floor(baseDifficulty * lengthFactor * 100);

    // Generate student progress data
    const studentNames = [
      'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown',
      'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Anderson'
    ];
    
    const studentProgress = courseEnrollments.slice(0, 5).map((enrollment, index) => {
      const progress = Math.floor(Math.random() * 100);
      const daysAgo = Math.floor(Math.random() * days);
      const lastActive = new Date();
      lastActive.setDate(lastActive.getDate() - daysAgo);
      
      return {
        studentId: enrollment.userId,
        studentName: studentNames[index % studentNames.length],
        progress,
        lastActive
      };
    });

    return {
      courseId,
      courseName,
      views,
      enrollments: totalEnrollments,
      completionRate,
      averageRating: avgRating,
      revenue,
      watchTime: Math.floor(totalEnrollments * lessonCount * 25), // 25 min average per lesson view
      viewsToday: Math.floor(views * 0.05), // 5% of total views today
      enrollmentsToday: Math.floor(Math.random() * 3), // 0-2 enrollments today
      dailyViews,
      studentProgress
    };
  };

  // Initialize with real data
  // const getInitialAnalytics = (): AnalyticsData => {
  //   return generateAnalyticsData(timeRange);
  // };

  useEffect(() => {
    // Simulate API call with real data
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData(timeRange));
    }, 500);
  }, [courseId, timeRange]);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (analyticsData) {
        setAnalyticsData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            views: prev.views + Math.floor(Math.random() * 5),
            viewsToday: prev.viewsToday + Math.floor(Math.random() * 3),
            enrollmentsToday: prev.enrollmentsToday + (Math.random() > 0.9 ? 1 : 0), // Occasional new enrollment
          };
        });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [analyticsData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh with updated real-time data
    setTimeout(() => {
      const refreshedData = generateAnalyticsData(timeRange);
      // Add small real-time variations
      setAnalyticsData({
        ...refreshedData,
        views: refreshedData.views + Math.floor(Math.random() * 50),
        viewsToday: refreshedData.viewsToday + Math.floor(Math.random() * 10),
        enrollmentsToday: refreshedData.enrollmentsToday + Math.floor(Math.random() * 2),
      });
      setIsRefreshing(false);
    }, 1000);
  };

  const exportData = () => {
    // In a real app, this would generate and download a CSV/PDF
    const csvContent = `Course Analytics Report
Course: ${courseName}
Date: ${new Date().toLocaleDateString()}

Metric,Value
Total Views,${analyticsData?.views}
Total Enrollments,${analyticsData?.enrollments}
Completion Rate,${analyticsData?.completionRate}%
Average Rating,${analyticsData?.averageRating}
Revenue,$${analyticsData?.revenue}
Watch Time,${analyticsData?.watchTime} hours
`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-analytics-${courseId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!analyticsData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Course Analytics</h2>
              <p className="text-sm text-gray-600">{courseName}</p>
            </div>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <button
                onClick={exportData}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">
                    Views ({timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'})
                  </p>
                  <p className="text-3xl font-bold">{analyticsData.views.toLocaleString()}</p>
                  <p className="text-blue-200 text-xs mt-1">+{analyticsData.viewsToday} today</p>
                </div>
                <Eye className="h-8 w-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Enrollments</p>
                  <p className="text-3xl font-bold">{analyticsData.enrollments.toLocaleString()}</p>
                  <p className="text-green-200 text-xs mt-1">+{analyticsData.enrollmentsToday} today</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold">{analyticsData.completionRate}%</p>
                  <p className="text-purple-200 text-xs mt-1">Above average</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Revenue</p>
                  <p className="text-3xl font-bold">${analyticsData.revenue.toLocaleString()}</p>
                  <p className="text-yellow-200 text-xs mt-1">+8.2% this month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Views Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Views ({timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {analyticsData.dailyViews.slice(-10).map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-16">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        ...(timeRange === '90d' && { year: '2-digit' })
                      })}
                    </span>
                    <div className="flex items-center space-x-3 flex-1 ml-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(day.views / Math.max(...analyticsData.dailyViews.map(d => d.views))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {day.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
              <div className="space-y-4">
                {analyticsData.studentProgress.map((student) => (
                  <div key={student.studentId} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600">
                        {student.studentName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{student.studentName}</span>
                        <span className="text-sm text-gray-600">{student.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        Last active: {student.lastActive.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-900">{analyticsData.averageRating}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-900">{analyticsData.watchTime.toLocaleString()}h</p>
              <p className="text-sm text-gray-600">Total Watch Time</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <Calendar className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-900">{Math.round(analyticsData.views / analyticsData.enrollments)}</p>
              <p className="text-sm text-gray-600">Avg. Views per Student</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;