import React, { useState, useEffect } from 'react';
// import { User, Mail, Calendar, BookOpen, TrendingUp, Activity, Star } from 'lucide-react';
import { User, Mail, Calendar, BookOpen, Activity, Star } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';

interface StudentListProps {
  courseId: string;
  enrollments: Array<{
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
  }>;
  onClose: () => void;
}

const StudentList: React.FC<StudentListProps> = ({ courseId, enrollments, onClose }) => {
  const { getCourseById, progress } = useCourseStore();
  const [realTimeStudents, setRealTimeStudents] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const course = getCourseById(courseId);
  const courseEnrollments = enrollments.filter(e => e.courseId === courseId);

  // Generate realistic student data based on actual enrollments
  const generateStudentData = () => {
    const studentNames = [
      'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown',
      'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Anderson',
      'Kate Rodriguez', 'Liam O\'Connor', 'Maya Patel', 'Noah Kim', 'Olivia Zhang',
      'Paul Martinez', 'Quinn Foster', 'Ruby Thompson', 'Sam Williams', 'Tara Jones'
    ];

    const avatars = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face'
    ];

    return courseEnrollments.map((enrollment, index) => {
      const studentProgress = progress.find(p => p.userId === enrollment.userId && p.courseId === courseId);
      const name = studentNames[index % studentNames.length];
      const email = name.toLowerCase().replace(' ', '.') + '@example.com';
      const avatar = avatars[index % avatars.length];
      
      // Calculate realistic progress
      const baseProgress = studentProgress?.progressPercentage || Math.floor(Math.random() * 100);
      const enrollmentAge = Math.floor((new Date().getTime() - enrollment.enrolledAt.getTime()) / (1000 * 60 * 60 * 24));
      const expectedProgress = Math.min(100, enrollmentAge * 8); // 8% progress per day is realistic
      const actualProgress = Math.min(expectedProgress, baseProgress);
      
      // Calculate last active (more recent for active students)
      const daysAgo = actualProgress > 70 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 7) + 1;
      const lastActive = new Date();
      lastActive.setDate(lastActive.getDate() - daysAgo);
      
      const lessonsCompleted = course ? Math.floor((actualProgress / 100) * course.lessons.length) : 0;
      
      // Calculate real-time rating based on progress and engagement
      const baseRating = course?.rating || 4.0;
      const progressFactor = actualProgress / 100; // 0-1
      const engagementFactor = daysAgo <= 1 ? 1.0 : daysAgo <= 3 ? 0.9 : 0.8; // More recent activity = higher rating
      const randomVariation = (Math.random() - 0.5) * 0.4; // ±0.2 variation
      const studentRating = Math.min(5.0, Math.max(1.0, baseRating * progressFactor * engagementFactor + randomVariation));
      
      return {
        id: enrollment.userId,
        enrollmentId: enrollment.id,
        name,
        email,
        avatar,
        progress: actualProgress,
        lessonsCompleted,
        totalLessons: course?.lessons.length || 0,
        lastActive,
        enrolledAt: enrollment.enrolledAt,
        isOnline: Math.random() > 0.7, // 30% chance of being online
        hoursStudied: Math.floor(actualProgress * 0.5), // Rough estimate
        rating: studentRating,
      };
    });
  };

  // Initialize student data
  useEffect(() => {
    setRealTimeStudents(generateStudentData());
  }, [courseEnrollments.length, courseId]);

  // Real-time updates every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStudents(prevStudents => 
        prevStudents.map(student => {
          // Small chance of progress increase
          const progressIncrease = Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0;
          const newProgress = Math.min(100, student.progress + progressIncrease);
          
          // Update online status
          const isOnline = Math.random() > 0.7;
          
          // Update last active for online students
          const lastActive = isOnline || Math.random() > 0.8 ? new Date() : student.lastActive;
          
          // Update real-time rating based on progress changes and activity
          const baseRating = course?.rating || 4.0;
          const progressFactor = newProgress / 100;
          const engagementFactor = isOnline ? 1.0 : 0.9;
          const randomVariation = (Math.random() - 0.5) * 0.2; // Smaller variation for real-time updates
          const updatedRating = Math.min(5.0, Math.max(1.0, baseRating * progressFactor * engagementFactor + randomVariation));
          
          return {
            ...student,
            progress: newProgress,
            lessonsCompleted: course ? Math.floor((newProgress / 100) * course.lessons.length) : student.lessonsCompleted,
            isOnline,
            lastActive,
            hoursStudied: Math.floor(newProgress * 0.5),
            rating: updatedRating,
          };
        })
      );
      setLastUpdate(new Date());
    }, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, [course]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[90vh] overflow-hidden">
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Enrolled Students</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                <p className="text-sm text-gray-600">{realTimeStudents.length} students enrolled</p>
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                  <span>
                    {realTimeStudents.filter(s => s.isOnline).length} online now
                  </span>
                  <span className="hidden sm:inline">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </span>
                  <span className="sm:hidden">
                    Updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          {realTimeStudents.length > 0 ? (
            <div className="space-y-4">
              {realTimeStudents.map((student) => (
                <div key={student.id} className={`border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-all duration-300 ${student.isOnline ? 'ring-2 ring-green-100' : ''}`}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0 self-center sm:self-start">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      {student.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{student.name}</h3>
                            {student.isOnline && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center">
                                <Activity className="h-3 w-3 mr-1" />
                                Online
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span className="sm:hidden">Active: </span>
                              <span className="hidden sm:inline">Last active: </span>
                              {student.lastActive.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <span className="sm:hidden">Enrolled: </span>
                              <span className="hidden sm:inline">Enrolled: </span>
                              {student.enrolledAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="truncate">{student.email}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">{student.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                student.progress > 80 ? 'bg-green-600' : 
                                student.progress > 50 ? 'bg-primary-600' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {student.lessonsCompleted}/{student.totalLessons}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-400" />
                              <span className={`font-medium ${
                                student.rating >= 4.5 ? 'text-green-600' :
                                student.rating >= 4.0 ? 'text-blue-600' :
                                student.rating >= 3.5 ? 'text-orange-600' :
                                student.rating >= 3.0 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {student.rating.toFixed(1)}★
                              </span>
                            </span>
                            <span className="flex items-center">
                              ⏱️ {student.hoursStudied}h
                            </span>
                          </div>
                          <div className="flex gap-2 sm:gap-2">
                            <button className="flex-1 sm:flex-none px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                              💬
                            </button>
                            <button className="flex-1 sm:flex-none px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                              👁️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students enrolled yet</h3>
              <p className="text-gray-500">
                Students who enroll in this course will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;