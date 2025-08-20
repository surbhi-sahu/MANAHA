import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Smile, Frown, Meh, Heart, Zap } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: number;
  emotions: string[];
  note: string;
}

const moodLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
const moodColors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'];
const emotionOptions = ['Happy', 'Sad', 'Anxious', 'Calm', 'Energetic', 'Tired', 'Grateful', 'Frustrated'];

export default function MoodTracker() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number>(2);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [todaysEntry, setTodaysEntry] = useState<MoodEntry | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const stored = localStorage.getItem('mood-entries');
    if (stored) {
      const entries = JSON.parse(stored);
      setMoodEntries(entries);
      const todayEntry = entries.find((entry: MoodEntry) => entry.date === today);
      if (todayEntry) {
        setTodaysEntry(todayEntry);
        setSelectedMood(todayEntry.mood);
        setSelectedEmotions(todayEntry.emotions);
        setNote(todayEntry.note);
      }
    }
  }, [today]);

  const saveMoodEntry = () => {
    const entry: MoodEntry = {
      date: today,
      mood: selectedMood,
      emotions: selectedEmotions,
      note,
    };

    const updatedEntries = moodEntries.filter(e => e.date !== today);
    updatedEntries.push(entry);
    updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setMoodEntries(updatedEntries);
    setTodaysEntry(entry);
    localStorage.setItem('mood-entries', JSON.stringify(updatedEntries));
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const getWeeklyAverage = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyEntries = moodEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );
    
    if (weeklyEntries.length === 0) return 0;
    
    const sum = weeklyEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / weeklyEntries.length).toFixed(1);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mood Tracker</h2>
        <p className="text-gray-600">Track your daily emotions and see patterns over time.</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Today's Mood Entry */}
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            How are you feeling today?
          </h3>
          
          {/* Mood Scale */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Overall Mood</p>
            <div className="flex justify-between items-center space-x-4">
              {moodLabels.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMood(index)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                    selectedMood === index
                      ? 'bg-white shadow-lg scale-105'
                      : 'hover:bg-white/50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mb-2"
                    style={{ backgroundColor: moodColors[index] }}
                  />
                  <span className="text-xs font-medium text-gray-600">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Specific Emotions</p>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedEmotions.includes(emotion)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Additional Notes (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What influenced your mood today?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={saveMoodEntry}
            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            {todaysEntry ? 'Update Today\'s Entry' : 'Save Today\'s Mood'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Average</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {getWeeklyAverage()}/4
            </div>
            <p className="text-sm text-gray-600">
              {moodEntries.length > 0 ? 'Based on your recent entries' : 'Start tracking to see insights'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Entries</h3>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {moodEntries.length}
            </div>
            <p className="text-sm text-gray-600">
              Keep tracking to build healthy habits
            </p>
          </div>
        </div>

        {/* Recent Entries */}
        {moodEntries.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
            <div className="space-y-4">
              {moodEntries.slice(0, 7).map((entry) => (
                <div key={entry.date} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {entry.emotions.join(', ') || 'No emotions selected'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: moodColors[entry.mood] }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {moodLabels[entry.mood]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}