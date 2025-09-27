import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Bell, CreditCard as Edit3, Trash2, Filter } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  category: 'therapy' | 'medication' | 'exercise' | 'social' | 'work' | 'personal' | 'reminder';
  location?: string;
  reminder: number; // minutes before event
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

const eventCategories = [
  { id: 'therapy', name: 'Therapy/Counseling', color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-100' },
  { id: 'medication', name: 'Medication', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-100' },
  { id: 'exercise', name: 'Exercise/Wellness', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-100' },
  { id: 'social', name: 'Social Activities', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-100' },
  { id: 'work', name: 'Work/Study', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-100' },
  { id: 'personal', name: 'Personal Time', color: 'bg-pink-500', textColor: 'text-pink-700', bgLight: 'bg-pink-100' },
  { id: 'reminder', name: 'Reminders', color: 'bg-gray-500', textColor: 'text-gray-700', bgLight: 'bg-gray-100' },
];

const reminderOptions = [
  { value: 0, label: 'At time of event' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
];

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState<CalendarEvent['category']>('personal');
  const [location, setLocation] = useState('');
  const [reminder, setReminder] = useState(15);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('manaha-auth') || '{}').username;
    if (currentUser) {
      const stored = localStorage.getItem(`manaha-calendar-${currentUser}`);
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    }
  }, []);

  const saveEvents = (updatedEvents: CalendarEvent[]) => {
    const currentUser = JSON.parse(localStorage.getItem('manaha-auth') || '{}').username;
    if (currentUser) {
      localStorage.setItem(`manaha-calendar-${currentUser}`, JSON.stringify(updatedEvents));
    }
  };

  const saveEvent = () => {
    if (!title.trim() || !date || !time) return;

    const event: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      duration,
      category,
      location: location.trim(),
      reminder,
      isRecurring,
      recurringType: isRecurring ? recurringType : undefined,
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
    };

    let updatedEvents;
    if (editingEvent) {
      updatedEvents = events.map(e => e.id === editingEvent.id ? event : e);
    } else {
      updatedEvents = [...events, event];
    }

    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    resetForm();
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  const editEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setTime(event.time);
    setDuration(event.duration);
    setCategory(event.category);
    setLocation(event.location || '');
    setReminder(event.reminder);
    setIsRecurring(event.isRecurring);
    setRecurringType(event.recurringType || 'weekly');
    setShowEventModal(true);
  };

  const resetForm = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setDuration(60);
    setCategory('personal');
    setLocation('');
    setReminder(15);
    setIsRecurring(false);
    setRecurringType('weekly');
  };

  const openNewEventModal = (selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
    setShowEventModal(true);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (filterCategory !== 'all' && event.category !== filterCategory) {
        return false;
      }
      return event.date === dateString;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryInfo = (categoryId: string) => {
    return eventCategories.find(cat => cat.id === categoryId) || eventCategories[0];
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredEvents = events.filter(event => 
    filterCategory === 'all' || event.category === filterCategory
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
              Calendar
            </h2>
            <p className="text-gray-600">Schedule and track your mental health activities</p>
          </div>
          <button
            onClick={() => openNewEventModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Categories</option>
                {eventCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Calendar Grid */}
        <div className="flex-1 p-6">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50">
              {dayNames.map(day => (
                <div key={day} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-32 border-r border-b border-gray-200 last:border-r-0" />;
                }

                const dayEvents = getEventsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === day.toDateString();

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-32 border-r border-b border-gray-200 last:border-r-0 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday ? 'bg-blue-50' : ''
                    } ${isSelected ? 'bg-blue-100' : ''}`}
                    onClick={() => {
                      setSelectedDate(day);
                      if (dayEvents.length === 0) {
                        openNewEventModal(day);
                      }
                    }}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => {
                        const categoryInfo = getCategoryInfo(event.category);
                        return (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded ${categoryInfo.bgLight} ${categoryInfo.textColor} truncate cursor-pointer hover:opacity-80`}
                            onClick={(e) => {
                              e.stopPropagation();
                              editEvent(event);
                            }}
                          >
                            {formatTime(event.time)} {event.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Today's Events */}
        <div className="w-80 border-l border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Today\'s Events'}
          </h3>
          
          <div className="space-y-4">
            {(selectedDate ? getEventsForDate(selectedDate) : getEventsForDate(new Date())).map(event => {
              const categoryInfo = getCategoryInfo(event.category);
              return (
                <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`} />
                        <span className="text-sm font-medium text-gray-900">{event.title}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(event.time)}</span>
                        </div>
                        <span>{event.duration} min</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => editEvent(event)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {(selectedDate ? getEventsForDate(selectedDate) : getEventsForDate(new Date())).length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No events scheduled</p>
                <button
                  onClick={() => openNewEventModal(selectedDate || new Date())}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Add an event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                    min="15"
                    step="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {eventCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add event details..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Reminder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder
                </label>
                <select
                  value={reminder}
                  onChange={(e) => setReminder(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {reminderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Recurring */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                    Recurring Event
                  </label>
                </div>
                {isRecurring && (
                  <select
                    value={recurringType}
                    onChange={(e) => setRecurringType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEvent}
                disabled={!title.trim() || !date || !time}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
