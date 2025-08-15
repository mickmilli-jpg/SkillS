import React, { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Edit3, Trash2, BookOpen, Clock, Search } from 'lucide-react';
import type { Note, Course, Lesson } from '../types';

interface CourseNotepadProps {
  course: Course;
  currentLesson?: Lesson;
  userId: string;
  notes: Note[];
  onSaveNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
}

const CourseNotepad: React.FC<CourseNotepadProps> = ({
  course,
  currentLesson,
  userId,
  notes,
  onSaveNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Filter notes by course and optionally by search term
  const filteredNotes = notes
    .filter(note => note.courseId === course.id)
    .filter(note => 
      searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) : null;

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (!selectedNote && !isCreating) return;
    if (!editTitle.trim() && !editContent.trim()) return;

    setAutoSaveStatus('saving');

    const timer = setTimeout(() => {
      if (selectedNote) {
        // Update existing note
        onUpdateNote(selectedNote.id, {
          title: editTitle || 'Untitled Note',
          content: editContent,
          updatedAt: new Date(),
        });
      } else if (isCreating) {
        // Create new note
        onSaveNote({
          userId,
          courseId: course.id,
          lessonId: currentLesson?.id,
          title: editTitle || 'Untitled Note',
          content: editContent,
        });
        setIsCreating(false);
        setEditTitle('');
        setEditContent('');
      }
      setAutoSaveStatus('saved');
    }, 800);

    return () => clearTimeout(timer);
  }, [editTitle, editContent, selectedNote, isCreating, userId, course.id, currentLesson?.id, onUpdateNote, onSaveNote]);

  // Auto-save when content changes
  useEffect(() => {
    if (editTitle || editContent) {
      setAutoSaveStatus('unsaved');
      const cleanup = autoSave();
      return cleanup;
    }
  }, [editTitle, editContent, autoSave]);

  // Load selected note content
  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setIsCreating(false);
    }
  }, [selectedNote]);

  const startNewNote = () => {
    setSelectedNoteId(null);
    setIsCreating(true);
    setEditTitle('');
    setEditContent('');
  };

  const selectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsCreating(false);
  };

  const deleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(noteId);
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
        setEditTitle('');
        setEditContent('');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getLessonTitle = (lessonId?: string) => {
    if (!lessonId) return 'General Notes';
    const lesson = course.lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : 'Unknown Lesson';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Course Notes</h3>
          </div>
          <button
            onClick={startNewNote}
            className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Notes List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Edit3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs text-gray-400">Create your first note to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedNoteId === note.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate flex-1">
                      {note.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {note.content.replace(/\n/g, ' ').substring(0, 100)}
                    {note.content.length > 100 ? '...' : ''}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{getLessonTitle(note.lessonId)}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note Editor */}
        <div className="flex-1 flex flex-col">
          {(selectedNote || isCreating) ? (
            <>
              {/* Editor Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    {currentLesson ? `Lesson: ${currentLesson.title}` : 'General Notes'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 text-xs ${
                      autoSaveStatus === 'saved' ? 'text-green-600' : 
                      autoSaveStatus === 'saving' ? 'text-blue-600' : 
                      'text-orange-600'
                    }`}>
                      <Save className="h-3 w-3" />
                      <span>
                        {autoSaveStatus === 'saved' ? 'Saved' : 
                         autoSaveStatus === 'saving' ? 'Saving...' : 
                         'Unsaved'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 p-4">
                <textarea
                  placeholder="Start writing your notes here..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full resize-none border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm leading-relaxed"
                  style={{ minHeight: '300px' }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Edit3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No note selected</h3>
                <p className="text-gray-500 mb-4">Choose a note from the sidebar or create a new one</p>
                <button
                  onClick={startNewNote}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseNotepad;