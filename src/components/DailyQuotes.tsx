import React, { useState, useEffect } from 'react';
import { RefreshCw, Heart, Star, Share } from 'lucide-react';

const quotes = [
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    category: "strength"
  },
  {
    text: "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
    author: "William James",
    category: "mindset"
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person. It makes you human.",
    author: "Lori Deschene",
    category: "acceptance"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer",
    category: "journey"
  },
  {
    text: "Self-care is not selfish. You cannot serve from an empty vessel.",
    author: "Eleanor Brown",
    category: "self-care"
  },
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown",
    category: "priority"
  },
  {
    text: "It's okay to not be okay all the time. Sometimes you need to feel the sadness, process it, and let it go.",
    author: "Unknown",
    category: "processing"
  },
  {
    text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
    author: "Julian Seifter",
    category: "identity"
  },
  {
    text: "Sometimes the smallest step in the right direction ends up being the biggest step of your life.",
    author: "Naeem Callaway",
    category: "progress"
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay",
    category: "healing"
  }
];

const affirmations = [
  "I am worthy of love and respect.",
  "I choose peace over worry.",
  "I am growing and learning every day.",
  "My feelings are valid and important.",
  "I have the strength to overcome challenges.",
  "I deserve happiness and joy.",
  "I am in control of my thoughts and reactions.",
  "I practice self-compassion daily.",
  "I am resilient and adaptable.",
  "I trust in my ability to handle whatever comes my way."
];

export default function DailyQuotes() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAffirmations, setShowAffirmations] = useState(false);

  useEffect(() => {
    // Set daily quote based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentQuote(quotes[dayOfYear % quotes.length]);
    setCurrentAffirmation(affirmations[dayOfYear % affirmations.length]);

    // Load favorites
    const stored = localStorage.getItem('favorite-quotes');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(affirmations[randomIndex]);
  };

  const toggleFavorite = (text: string) => {
    const newFavorites = favorites.includes(text)
      ? favorites.filter(fav => fav !== text)
      : [...favorites, text];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite-quotes', JSON.stringify(newFavorites));
  };

  const shareQuote = async () => {
    const text = showAffirmations 
      ? `"${currentAffirmation}" - Daily Affirmation`
      : `"${currentQuote.text}" - ${currentQuote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Inspiration from Manaha',
          text: text,
        });
      } catch (error) {
        // Handle share error
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Inspiration</h2>
        <p className="text-gray-600">Motivational quotes and affirmations to brighten your day.</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Toggle Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAffirmations(false)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              !showAffirmations
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Daily Quote
          </button>
          <button
            onClick={() => setShowAffirmations(true)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              showAffirmations
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Affirmations
          </button>
        </div>

        {/* Quote/Affirmation Card */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 rounded-2xl p-8 text-center">
          {showAffirmations ? (
            <div>
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
              <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-6">
                {currentAffirmation}
              </p>
              <p className="text-gray-600 mb-8">Personal Affirmation</p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">❝</span>
              </div>
              <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-6">
                {currentQuote.text}
              </p>
              <p className="text-gray-600 mb-8">— {currentQuote.author}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={showAffirmations ? getRandomAffirmation : getRandomQuote}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New {showAffirmations ? 'Affirmation' : 'Quote'}</span>
            </button>
            
            <button
              onClick={() => toggleFavorite(showAffirmations ? currentAffirmation : currentQuote.text)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors shadow-md ${
                favorites.includes(showAffirmations ? currentAffirmation : currentQuote.text)
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favorite</span>
            </button>
            
            <button
              onClick={shareQuote}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-md"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Quote Categories */}
        {!showAffirmations && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['strength', 'mindset', 'acceptance', 'healing'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  const categoryQuotes = quotes.filter(q => q.category === category);
                  const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
                  setCurrentQuote(randomQuote);
                }}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 text-center"
              >
                <div className="text-2xl mb-2">
                  {category === 'strength' && '💪'}
                  {category === 'mindset' && '🧠'}
                  {category === 'acceptance' && '🤝'}
                  {category === 'healing' && '🌱'}
                </div>
                <p className="text-sm font-medium text-gray-700 capitalize">{category}</p>
              </button>
            ))}
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              Your Favorites
            </h3>
            <div className="space-y-4">
              {favorites.slice(-3).map((favorite, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 italic">{favorite}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Motivation */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-3">Today's Reminder</h3>
          <p className="text-lg opacity-90">
            You've taken a positive step by being here. Every small action towards your mental health matters.
          </p>
        </div>
      </div>
    </div>
  );
}