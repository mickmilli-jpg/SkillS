import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { Plus, Trash2, Video, FileText, HelpCircle, Save } from 'lucide-react';
import type { Course, Lesson } from '../types';

const CreateCourse: React.FC = () => {
  const { user } = useAuthStore();
  const { createCourse } = useCourseStore();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    price: 0,
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
  });

  const [lessons, setLessons] = useState<Omit<Lesson, 'id' | 'courseId'>[]>([]);
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'pdf' | 'quiz',
    content: '',
    duration: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
    
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

  const addLesson = () => {
    if (!currentLesson.title || !currentLesson.description) {
      alert('Please fill in lesson title and description');
      return;
    }

    const newLesson = {
      ...currentLesson,
      order: lessons.length + 1,
    };

    setLessons(prev => [...prev, newLesson]);
    setCurrentLesson({
      title: '',
      description: '',
      type: 'video',
      content: '',
      duration: 0,
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
    if (courseData.price <= 0) newErrors.price = 'Price must be greater than 0';
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

      const newCourseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
        ...courseData,
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
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={courseData.price}
                  onChange={(e) => handleCourseChange('price', parseFloat(e.target.value) || 0)}
                  className={`input-field ${errors.price ? 'border-red-300' : ''}`}
                  placeholder="0.00"
                />
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
            </div>
          </div>

          {/* Lessons Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h2>
            
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
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentLesson.duration}
                    onChange={(e) => handleLessonChange('duration', parseInt(e.target.value) || 0)}
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content URL
                  </label>
                  <input
                    type="text"
                    value={currentLesson.content}
                    onChange={(e) => handleLessonChange('content', e.target.value)}
                    className="input-field"
                    placeholder={
                      currentLesson.type === 'video' ? 'Video URL (e.g., Vimeo embed link)' :
                      currentLesson.type === 'pdf' ? 'PDF file path or URL' :
                      'Quiz identifier'
                    }
                  />
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
                        {lesson.duration && lesson.duration > 0 && <span>{lesson.duration} min</span>}
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
    </div>
  );
};

export default CreateCourse;