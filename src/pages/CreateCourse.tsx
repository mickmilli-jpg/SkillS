import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { Plus, Trash2, Video, FileText, HelpCircle, Save, Upload, Image } from 'lucide-react';
import type { Course, Lesson } from '../types';

const CreateCourse: React.FC = () => {
  const { user } = useAuthStore();
  const { createCourse } = useCourseStore();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    price: '',
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
    isPublic: false,
  });

  const [lessons, setLessons] = useState<Omit<Lesson, 'id' | 'courseId'>[]>([]);
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'pdf' | 'quiz',
    content: '',
    duration: '',
    durationUnit: 'minutes' as 'minutes' | 'hours',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'image' | 'pdf'>('video');
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Check if basic course info is complete
  const isCourseInfoComplete = () => {
    const price = typeof courseData.price === 'string' ? parseFloat(courseData.price) : courseData.price;
    const isPriceValid = courseData.level === 'beginner' ? price >= 0 : price > 0;
    return courseData.title.trim() !== '' &&
           courseData.description.trim() !== '' &&
           courseData.category !== '' &&
           isPriceValid &&
           courseData.duration.trim() !== '';
  };

  const categories = [
    'Digital Art',
    'Programming',
    'Finance',
    'Languages',
    'Marketing',
    'Design',
    'Music',
    'Photography',
    'Cooking',
    'Fitness'
  ];

  const handleCourseChange = (field: string, value: any) => {
    setCourseData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Automatically set price to 0 when level is changed to beginner
      if (field === 'level' && value === 'beginner') {
        updated.price = '0';
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLessonChange = (field: string, value: any) => {
    setCurrentLesson(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (type: 'video' | 'image' | 'pdf') => {
    setUploadType(type);
    setUploadModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a cloud service
      // For demo purposes, we'll create a URL and update the lesson content
      const fileUrl = URL.createObjectURL(file);
      
      setCurrentLesson(prev => ({
        ...prev,
        content: fileUrl,
        type: uploadType === 'pdf' ? 'pdf' : uploadType === 'video' ? 'video' : prev.type
      }));
      
      setUploadModal(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const addLesson = () => {
    if (!currentLesson.title || !currentLesson.description) {
      alert('Please fill in lesson title and description');
      return;
    }

    // Convert duration to minutes for storage
    const durationValue = typeof currentLesson.duration === 'string' ? parseFloat(currentLesson.duration) : currentLesson.duration;
    const durationInMinutes = currentLesson.durationUnit === 'hours' ? durationValue * 60 : durationValue;

    const newLesson = {
      ...currentLesson,
      duration: durationInMinutes || 0,
      order: lessons.length + 1,
    };

    setLessons(prev => [...prev, newLesson]);
    setCurrentLesson({
      title: '',
      description: '',
      type: 'video',
      content: '',
      duration: '',
      durationUnit: 'minutes',
    });
  };

  const removeLesson = (index: number) => {
    setLessons(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!courseData.title) newErrors.title = 'Course title is required';
    if (!courseData.description) newErrors.description = 'Course description is required';
    if (!courseData.category) newErrors.category = 'Category is required';
    
    // Price validation - beginner courses are automatically free
    if (courseData.level === 'beginner') {
      // No price validation needed for beginner courses - they're automatically free
    } else {
      const price = typeof courseData.price === 'string' ? parseFloat(courseData.price) : courseData.price;
      if (!courseData.price || isNaN(price) || price <= 0) {
        newErrors.price = 'Price is required and must be greater than 0 for intermediate and advanced courses';
      }
    }
    
    if (!courseData.duration) newErrors.duration = 'Duration is required';
    if (lessons.length === 0) newErrors.lessons = 'At least one lesson is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsSubmitting(true);

    try {
      const lessonsWithIds: Lesson[] = lessons.map((lesson, index) => ({
        ...lesson,
        id: `temp-${index}`,
        courseId: 'temp',
      }));

      // Handle price based on course level
      let numericPrice: number;
      if (courseData.level === 'beginner') {
        // Beginner courses are always free
        numericPrice = 0;
      } else {
        // For other levels, validate the entered price
        const priceValue = courseData.price;
        numericPrice = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
        
        if (isNaN(numericPrice) || numericPrice <= 0) {
          alert('Intermediate and advanced courses must have a price greater than 0');
          setIsSubmitting(false);
          return;
        }
      }

      const newCourseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
        ...courseData,
        price: numericPrice,
        thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
        instructorId: user.id,
        instructorName: user.name,
        lessons: lessonsWithIds,
        enrolledStudents: 0,
        rating: 0,
      };

      createCourse(newCourseData);
      navigate(`/instructor`);
    } catch (error) {
      alert('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600">Build and publish your expertise as an online course</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleCourseChange('title', e.target.value)}
                  className={`input-field ${errors.title ? 'border-red-300' : ''}`}
                  placeholder="Enter course title"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => handleCourseChange('description', e.target.value)}
                  rows={4}
                  className={`input-field ${errors.description ? 'border-red-300' : ''}`}
                  placeholder="Describe what students will learn in this course"
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={courseData.category}
                  onChange={(e) => handleCourseChange('category', e.target.value)}
                  className={`input-field ${errors.category ? 'border-red-300' : ''}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) => handleCourseChange('level', e.target.value)}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                  {courseData.level === 'beginner' && (
                    <span className="ml-2 text-xs text-green-600 font-normal">
                      (Beginner courses are automatically free)
                    </span>
                  )}
                </label>
                {courseData.level === 'beginner' ? (
                  <div className="relative">
                    <input
                      type="text"
                      value="FREE"
                      readOnly
                      className="input-field bg-green-50 text-green-700 font-medium cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={courseData.price}
                    onChange={(e) => handleCourseChange('price', e.target.value)}
                    className={`input-field ${errors.price ? 'border-red-300' : ''}`}
                    placeholder="Enter course price"
                  />
                )}
                {courseData.level === 'beginner' && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All beginner courses are offered for free to make learning accessible to everyone
                  </p>
                )}
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  value={courseData.duration}
                  onChange={(e) => handleCourseChange('duration', e.target.value)}
                  className={`input-field ${errors.duration ? 'border-red-300' : ''}`}
                  placeholder="e.g., 10 hours"
                />
                {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL (optional)
                </label>
                <input
                  type="url"
                  value={courseData.thumbnail}
                  onChange={(e) => handleCourseChange('thumbnail', e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to use a default thumbnail
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={courseData.isPublic}
                      onChange={(e) => handleCourseChange('isPublic', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                      Make course public
                    </label>
                    <p className="text-sm text-gray-500">
                      When enabled, students can discover and enroll in your course. When disabled, your course will remain private and visible only to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h2>
            
            {!isCourseInfoComplete() && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Course Information First</h3>
                <p className="text-gray-600 mb-4">
                  Please fill in all the required course details above before adding lessons.
                </p>
                <div className="text-sm text-gray-500">
                  Required: Course Title, Description, Category, Price, and Duration
                </div>
              </div>
            )}

            {isCourseInfoComplete() && (
              <>
            
            {/* Add Lesson Form */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add New Lesson</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={currentLesson.title}
                    onChange={(e) => handleLessonChange('title', e.target.value)}
                    className="input-field"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Description
                  </label>
                  <textarea
                    value={currentLesson.description}
                    onChange={(e) => handleLessonChange('description', e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="Describe what this lesson covers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Type
                  </label>
                  <select
                    value={currentLesson.type}
                    onChange={(e) => handleLessonChange('type', e.target.value)}
                    className="input-field"
                  >
                    <option value="video">Video</option>
                    <option value="pdf">PDF Document</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={currentLesson.duration}
                      onChange={(e) => handleLessonChange('duration', e.target.value)}
                      className="input-field flex-1"
                      placeholder="Enter duration"
                    />
                    <select
                      value={currentLesson.durationUnit}
                      onChange={(e) => handleLessonChange('durationUnit', e.target.value)}
                      className="input-field w-24"
                    >
                      <option value="minutes">Min</option>
                      <option value="hours">Hrs</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentLesson.content}
                      onChange={(e) => handleLessonChange('content', e.target.value)}
                      className="input-field flex-1"
                      placeholder={
                        currentLesson.type === 'video' ? 'Video URL (e.g., Vimeo embed link)' :
                        currentLesson.type === 'pdf' ? 'PDF file path or URL' :
                        'Quiz identifier'
                      }
                    />
                    {currentLesson.type !== 'quiz' && (
                      <div className="flex space-x-2">
                        {currentLesson.type === 'video' && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('video')}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Upload Video"
                          >
                            <Video className="h-4 w-4" />
                          </button>
                        )}
                        {currentLesson.type === 'pdf' && (
                          <button
                            type="button"
                            onClick={() => handleFileUpload('pdf')}
                            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                            title="Upload PDF Document"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFileUpload('image')}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Upload Image/Thumbnail"
                        >
                          <Image className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You can enter a URL manually or use the upload buttons to select files
                  </p>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={addLesson}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Lesson</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            {lessons.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900">Course Lessons ({lessons.length})</h3>
                {lessons.map((lesson, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      {lesson.type === 'video' && <Video className="h-5 w-5 text-blue-500" />}
                      {lesson.type === 'pdf' && <FileText className="h-5 w-5 text-green-500" />}
                      {lesson.type === 'quiz' && <HelpCircle className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                      <p className="text-sm text-gray-500 truncate">{lesson.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                        <span className="capitalize">{lesson.type}</span>
                        {lesson.duration && lesson.duration > 0 && (
                          <span>
                            {lesson.duration >= 60 && lesson.duration % 60 === 0 
                              ? `${lesson.duration / 60} hr${lesson.duration / 60 !== 1 ? 's' : ''}`
                              : `${lesson.duration} min`
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

              {errors.lessons && <p className="text-red-600 text-sm mt-2">{errors.lessons}</p>}
              </>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/instructor')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating...' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* File Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload {uploadType === 'video' ? 'Video' : uploadType === 'pdf' ? 'PDF Document' : 'Image/Thumbnail'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Select a {uploadType} file to add to your lesson content.
            </p>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {uploadType === 'video' ? (
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                ) : uploadType === 'pdf' ? (
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                ) : (
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                )}
                <p className="text-sm text-gray-600 mb-4">
                  Click to select {uploadType} file or drag and drop
                </p>
                <input
                  ref={uploadType === 'video' ? videoInputRef : uploadType === 'pdf' ? pdfInputRef : imageInputRef}
                  type="file"
                  accept={uploadType === 'video' ? 'video/*' : uploadType === 'pdf' ? 'application/pdf' : 'image/*'}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (uploadType === 'video') {
                      videoInputRef.current?.click();
                    } else if (uploadType === 'pdf') {
                      pdfInputRef.current?.click();
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
                type="button"
                onClick={() => setUploadModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;