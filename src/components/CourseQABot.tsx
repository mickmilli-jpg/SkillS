import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, HelpCircle } from 'lucide-react';
import type { Course } from '../types';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface CourseQABotProps {
  course: Course;
  onClose: () => void;
}

const CourseQABot: React.FC<CourseQABotProps> = ({ course, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: `👋 Hi! I'm your course assistant for "${course.title}". I can help answer questions about this course before you enroll. Feel free to ask me anything!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [course.title]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Course duration questions
    if (message.includes('duration') || message.includes('long') || message.includes('time')) {
      return `📅 This course has a total duration of ${course.duration} and contains ${course.lessons.length} lessons. You can learn at your own pace!`;
    }

    // Price questions
    if (message.includes('price') || message.includes('cost') || message.includes('fee') || message.includes('money')) {
      if (course.level === 'beginner') {
        return `🎉 Great news! This beginner course is completely FREE! As part of our commitment to making education accessible, all beginner-level courses have no cost and give you lifetime access to all materials.`;
      }
      return `💰 The course price is $${course.price}. This is a one-time payment that gives you lifetime access to all course materials.`;
    }

    // Level/difficulty questions
    if (message.includes('level') || message.includes('difficulty') || message.includes('beginner') || message.includes('advanced')) {
      const levelAdvice = {
        beginner: 'Perfect for newcomers! No prior experience needed. We start from the basics.',
        intermediate: 'Best suited for those with some basic knowledge. We build on fundamental concepts.',
        advanced: 'Designed for experienced learners. Assumes solid foundation in the subject matter.'
      };
      return `📊 This is a ${course.level} level course. ${levelAdvice[course.level]}`;
    }

    // Prerequisites questions
    if (message.includes('prerequisite') || message.includes('requirement') || message.includes('need to know')) {
      const prereqs = {
        beginner: 'No prerequisites required! Just bring your enthusiasm to learn.',
        intermediate: 'Basic understanding of the fundamentals would be helpful.',
        advanced: 'Strong foundation in the subject area is recommended.'
      };
      return `📋 Prerequisites: ${prereqs[course.level]}`;
    }

    // Content/curriculum questions
    if (message.includes('content') || message.includes('curriculum') || message.includes('learn') || message.includes('cover')) {
      const lessonTypes = course.lessons.map(l => l.type).filter((type, index, arr) => arr.indexOf(type) === index);
      return `📚 The course covers ${course.lessons.length} comprehensive lessons including ${lessonTypes.join(', ')} content. You'll learn: ${course.description}`;
    }

    // Instructor questions
    if (message.includes('instructor') || message.includes('teacher') || message.includes('who teaches')) {
      return `👨‍🏫 This course is taught by ${course.instructorName}, an experienced instructor in ${course.category}. They bring real-world expertise to help you succeed.`;
    }

    // Rating/reviews questions
    if (message.includes('rating') || message.includes('review') || message.includes('feedback') || message.includes('quality')) {
      return `⭐ This course has an average rating of ${course.rating}/5 from ${course.enrolledStudents} students. Students love the practical approach and clear explanations!`;
    }

    // Category/field questions
    if (message.includes('category') || message.includes('field') || message.includes('subject')) {
      return `🎯 This course falls under ${course.category}. It's designed to give you practical skills in this field.`;
    }

    // Enrollment questions
    if (message.includes('enroll') || message.includes('sign up') || message.includes('register') || message.includes('join')) {
      return `✅ Ready to enroll? Just click the "Enroll Now" button! You'll get immediate access to all course materials and can start learning right away.`;
    }

    // Support questions
    if (message.includes('support') || message.includes('help') || message.includes('stuck') || message.includes('question')) {
      return `🆘 Once enrolled, you'll have access to community forums and can ask questions anytime. The instructor is very responsive to student queries!`;
    }

    // Certificate questions
    if (message.includes('certificate') || message.includes('completion') || message.includes('credential')) {
      return `🏆 Yes! You'll receive a certificate of completion when you finish the course. This can be added to your LinkedIn profile and resume.`;
    }

    // Device/access questions
    if (message.includes('device') || message.includes('mobile') || message.includes('tablet') || message.includes('access')) {
      return `📱 You can access the course on any device - desktop, tablet, or mobile. All content is optimized for mobile learning!`;
    }

    // Refund/guarantee questions
    if (message.includes('refund') || message.includes('guarantee') || message.includes('money back')) {
      return `💯 We offer a 30-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within 30 days.`;
    }

    // Default response with suggestions
    return `🤔 I'd be happy to help you with that! Here are some things I can tell you about:

• Course duration and structure
• Pricing and payment options  
• Difficulty level and prerequisites
• What you'll learn and course content
• Instructor information
• Student ratings and reviews
• Enrollment process
• Technical requirements
• Certificates and completion

Feel free to ask me anything specific about "${course.title}"!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputMessage),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How long is this course?",
    "What's the difficulty level?",
    "What will I learn?",
    "How much does it cost?",
    "What are the prerequisites?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Course Assistant</h3>
              <p className="text-sm text-primary-100">Ask me anything about this course!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'bot' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {message.type === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] ${
                message.type === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-3 rounded-lg text-sm ${
                  message.type === 'bot'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-primary-600 text-white'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this course..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseQABot;