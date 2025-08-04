import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Clock, Bell, Calendar, Plus, Edit3, X, Check, AlertCircle } from 'lucide-react';

interface StudyReminder {
  id: string;
  title: string;
  description: string;
  time: string;
  days: string[];
  isActive: boolean;
  reminderType: 'daily' | 'weekly' | 'custom';
  nextReminder: Date;
  createdAt: Date;
}

const StudyReminders: React.FC = () => {
  const { user } = useAuthStore();
  const [reminders, setReminders] = useState<StudyReminder[]>([
    {
      id: '1',
      title: 'Daily Study Session',
      description: 'Time for your daily learning routine',
      time: '19:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isActive: true,
      reminderType: 'daily',
      nextReminder: new Date('2024-08-02T19:00:00'),
      createdAt: new Date('2024-07-15'),
    },
    {
      id: '2',
      title: 'Weekend Project Work',
      description: 'Practice coding projects on weekends',
      time: '10:00',
      days: ['Saturday', 'Sunday'],
      isActive: true,
      reminderType: 'weekly',
      nextReminder: new Date('2024-08-03T10:00:00'),
      createdAt: new Date('2024-07-20'),
    },
    {
      id: '3',
      title: 'Review Session',
      description: 'Review completed lessons and notes',
      time: '20:30',
      days: ['Wednesday'],
      isActive: false,
      reminderType: 'weekly',
      nextReminder: new Date('2024-08-07T20:30:00'),
      createdAt: new Date('2024-07-25'),
    },
  ]);

  const [showAddReminder, setShowAddReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '',
    days: [] as string[],
    reminderType: 'daily' as 'daily' | 'weekly' | 'custom',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.time && newReminder.days.length > 0) {
      const reminder: StudyReminder = {
        id: Date.now().toString(),
        title: newReminder.title,
        description: newReminder.description,
        time: newReminder.time,
        days: newReminder.days,
        isActive: true,
        reminderType: newReminder.reminderType,
        nextReminder: getNextReminderDate(newReminder.days, newReminder.time),
        createdAt: new Date(),
      };
      setReminders([...reminders, reminder]);
      setNewReminder({ title: '', description: '', time: '', days: [], reminderType: 'daily' });
      setShowAddReminder(false);
    }
  };

  const getNextReminderDate = (days: string[], time: string): Date => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleLString('en-US', { weekday: 'long' });
      
      if (days.includes(dayName)) {
        date.setHours(hours, minutes, 0, 0);
        if (date > now) {
          return date;
        }
      }
    }
    
    // If no valid date found in next 7 days, return next week
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(hours, minutes, 0, 0);
    return nextWeek;
  };

  const toggleReminder = (reminderId: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  const updateReminder = (reminderId: string, updates: Partial<StudyReminder>) => {
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, ...updates }
        : reminder
    ));
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const formatNextReminder = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) {
        return 'In less than an hour';
      }
      return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  };

  const getUpcomingReminders = () => {
    return reminders
      .filter(r => r.isActive)
      .sort((a, b) => a.nextReminder.getTime() - b.nextReminder.getTime())
      .slice(0, 3);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Study Reminders</h1>
            <p className="mt-2 text-gray-600">
              Set up notifications to maintain consistent learning habits.
            </p>
          </div>
          <button
            onClick={() => setShowAddReminder(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reminders</p>
                <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reminders.filter(r => r.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reminders.filter(r => r.isActive && r.reminderType !== 'custom').length * 7}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Reminder</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getUpcomingReminders().length > 0 ? formatNextReminder(getUpcomingReminders()[0].nextReminder) : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Reminders */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Reminders</h2>
            </div>
            <div className="p-6">
              {getUpcomingReminders().length > 0 ? (
                <div className="space-y-4">
                  {getUpcomingReminders().map(reminder => (
                    <div key={reminder.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Bell className="w-5 h-5 text-primary-600" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{reminder.title}</h3>
                        <p className="text-xs text-gray-500">
                          {formatNextReminder(reminder.nextReminder)} at {reminder.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No active reminders</p>
              )}
            </div>
          </div>

          {/* All Reminders */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {reminders.map(reminder => (
                <div key={reminder.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{reminder.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          reminder.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {reminder.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {reminder.reminderType}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{reminder.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          reminder.isActive
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingReminder(editingReminder === reminder.id ? null : reminder.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{reminder.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{reminder.days.length === 7 ? 'Every day' : reminder.days.join(', ')}</span>
                      </div>
                    </div>
                    
                    {reminder.isActive && (
                      <span className="text-primary-600 font-medium">
                        Next: {formatNextReminder(reminder.nextReminder)}
                      </span>
                    )}
                  </div>

                  {editingReminder === reminder.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <input
                        type="text"
                        value={reminder.title}
                        onChange={(e) => updateReminder(reminder.id, { title: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                      <input
                        type="time"
                        value={reminder.time}
                        onChange={(e) => updateReminder(reminder.id, { time: e.target.value })}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {reminders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders set</h3>
                <p className="text-gray-500 mb-4">
                  Create your first study reminder to build consistent learning habits.
                </p>
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="btn-primary"
                >
                  Add Your First Reminder
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Reminder Modal */}
        {showAddReminder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Reminder</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Title</label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Daily Study Session"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                    placeholder="Brief description of the reminder..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days of the Week</label>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          newReminder.days.includes(day)
                            ? 'bg-primary-100 border-primary-300 text-primary-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Type</label>
                  <select
                    value={newReminder.reminderType}
                    onChange={(e) => setNewReminder({ ...newReminder, reminderType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  disabled={!newReminder.title || !newReminder.time || newReminder.days.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyReminders;