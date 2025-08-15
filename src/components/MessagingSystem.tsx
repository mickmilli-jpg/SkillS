import React, { useState, useEffect } from 'react';
import { Send, Search, MoreVertical, Star, Archive, Clock, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  courseId: string;
  courseName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'question' | 'assignment' | 'general';
}

interface MessagingSystemProps {
  instructorId: string;
  onClose: () => void;
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent'>('all');

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'Alice Johnson',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      courseId: '1',
      courseName: 'Complete Digital Art Mastery',
      content: 'Hi! I\'m having trouble with the color blending technique in lesson 4. Could you provide some additional guidance?',
      timestamp: new Date('2024-01-22T10:30:00'),
      isRead: false,
      priority: 'high',
      type: 'question'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Bob Smith',
      studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      courseId: '2',
      courseName: 'Cryptocurrency Trading Fundamentals',
      content: 'Thank you for the excellent course! I just completed my first successful trade using your strategies.',
      timestamp: new Date('2024-01-21T15:45:00'),
      isRead: true,
      priority: 'low',
      type: 'general'
    },
    {
      id: '3',
      studentId: '3',
      studentName: 'Carol Davis',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      courseId: '1',
      courseName: 'Complete Digital Art Mastery',
      content: 'When is the assignment for lesson 6 due? I want to make sure I submit it on time.',
      timestamp: new Date('2024-01-20T09:15:00'),
      isRead: false,
      priority: 'medium',
      type: 'assignment'
    },
    {
      id: '4',
      studentId: '4',
      studentName: 'David Wilson',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      courseId: '3',
      courseName: 'Advanced React Development',
      content: 'The useEffect hook example in lesson 2 isn\'t working as expected. Could you check the code?',
      timestamp: new Date('2024-01-19T14:20:00'),
      isRead: false,
      priority: 'high',
      type: 'question'
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && !message.isRead) ||
                         (filterType === 'urgent' && message.priority === 'high');
    
    return matchesSearch && matchesFilter;
  });

  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isRead: true } : m
      ));
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending reply:', replyText, 'to student:', selectedMessage.studentName);
    setReplyText('');
    
    // Show success feedback
    alert('Reply sent successfully!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return '❓';
      case 'assignment': return '📋';
      case 'general': return '💬';
      default: return '💬';
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 h-[90vh] overflow-hidden flex">
        {/* Messages List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Messages ({unreadCount} unread)
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-xs rounded-full ${filterType === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-3 py-1 text-xs rounded-full ${filterType === 'unread' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilterType('urgent')}
                className={`px-3 py-1 text-xs rounded-full ${filterType === 'urgent' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
              >
                Urgent
              </button>
            </div>
          </div>
          
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageSelect(message)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedMessage?.id === message.id ? 'bg-primary-50 border-primary-200' : ''} ${!message.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={message.studentAvatar}
                    alt={message.studentName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.studentName}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">{getTypeIcon(message.type)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{message.courseName}</p>
                    <p className={`text-sm mt-1 line-clamp-2 ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleDateString()} {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!message.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMessages.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No messages found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Message Detail */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedMessage.studentAvatar}
                      alt={selectedMessage.studentName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedMessage.studentName}</h3>
                      <p className="text-sm text-gray-600">{selectedMessage.courseName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                          {selectedMessage.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">
                          {selectedMessage.type === 'question' ? 'Question' : 
                           selectedMessage.type === 'assignment' ? 'Assignment' : 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50">
                      <Star className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Archive className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900">{selectedMessage.studentName}</span>
                    <span className="text-xs text-gray-500">
                      {selectedMessage.timestamp.toLocaleDateString()} at {selectedMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedMessage.content}</p>
                </div>
              </div>
              
              {/* Reply Section */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="self-end px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Schedule</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark as resolved</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Send className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
                <p>Choose a message from the list to view and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;