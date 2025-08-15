import React, { useState, useEffect } from 'react';
import { Bell, X, Settings } from 'lucide-react';

interface Notification {
  id: string;
  type: 'enrollment' | 'message' | 'review' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  courseId?: string;
  studentId?: string;
}

interface NotificationSystemProps {
  instructorId: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'enrollment',
      title: 'New Student Enrolled',
      message: 'Alice Johnson enrolled in "Complete Digital Art Mastery"',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
      priority: 'medium',
      courseId: '1',
      studentId: '1'
    },
    {
      id: '2',
      type: 'message',
      title: 'New Student Message',
      message: 'Bob Smith sent you a question about lesson 4',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      isRead: false,
      priority: 'high',
      courseId: '2',
      studentId: '2'
    },
    {
      id: '3',
      type: 'review',
      title: 'New 5-Star Review',
      message: 'Your course "Cryptocurrency Trading" received a 5-star review',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true,
      priority: 'low',
      courseId: '2'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Milestone Reached',
      message: 'Your course has reached 1000+ enrollments!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: false,
      priority: 'high',
      courseId: '1'
    },
    {
      id: '5',
      type: 'system',
      title: 'Platform Update',
      message: 'New analytics features are now available in your dashboard',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
      priority: 'low'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        addNewNotification();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addNewNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: Math.random() > 0.5 ? 'enrollment' : 'message',
      title: Math.random() > 0.5 ? 'New Student Enrolled' : 'New Message',
      message: Math.random() > 0.5 ? 
        'A new student just enrolled in your course!' : 
        'You have a new message from a student',
      timestamp: new Date(),
      isRead: false,
      priority: 'medium',
      courseId: '1'
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      if (filter === 'unread') return !notification.isRead;
      if (filter === 'high') return notification.priority === 'high';
      return true;
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return '👥';
      case 'message': return '💬';
      case 'review': return '⭐';
      case 'achievement': return '🏆';
      case 'system': return '🔔';
      default: return '📢';
    }
  };

  const getNotificationColor = (priority: string) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50';
    if (priority === 'medium') return 'border-l-yellow-500 bg-yellow-50';
    return 'border-l-blue-500 bg-blue-50';
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications ({unreadCount} unread)
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded-full ${filter === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-xs rounded-full ${filter === 'unread' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('high')}
                className={`px-3 py-1 text-xs rounded-full ${filter === 'high' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
              >
                High Priority
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${getNotificationColor(notification.priority)} ${!notification.isRead ? 'bg-opacity-80' : 'bg-opacity-40'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {notification.priority}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button className="w-full text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Notification Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;