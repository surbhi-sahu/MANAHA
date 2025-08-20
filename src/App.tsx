import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, BookOpen, Sun, Wind, LifeBuoy, Lock } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import MoodTracker from './components/MoodTracker';
import Journal from './components/Journal';
import DailyQuotes from './components/DailyQuotes';
import RelaxationZone from './components/RelaxationZone';
import CrisisSupport from './components/CrisisSupport';
import SecretVault from './components/SecretVault';
import AuthScreen from './components/AuthScreen';

export type ViewType = 'chat' | 'mood' | 'journal' | 'quotes' | 'relaxation' | 'crisis' | 'secrets';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('manaha-auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setCurrentUser(authData.username);
    }
  }, []);
  const menuItems = [
    { id: 'chat' as ViewType, label: 'Chat with Manaha', icon: MessageCircle, color: 'text-blue-600' },
    { id: 'mood' as ViewType, label: 'Mood Tracker', icon: Heart, color: 'text-pink-600' },
    { id: 'journal' as ViewType, label: 'Journal', icon: BookOpen, color: 'text-purple-600' },
    { id: 'secrets' as ViewType, label: 'Secret Vault', icon: Lock, color: 'text-indigo-600' },
    { id: 'quotes' as ViewType, label: 'Daily Quotes', icon: Sun, color: 'text-yellow-600' },
    { id: 'relaxation' as ViewType, label: 'Relaxation Zone', icon: Wind, color: 'text-teal-600' },
    { id: 'crisis' as ViewType, label: 'Crisis Support', icon: LifeBuoy, color: 'text-red-600' },
  ];

  useEffect(() => {
    document.title = 'Manaha - Your Mental Health Companion';
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    localStorage.setItem('manaha-auth', JSON.stringify({ username, loginTime: Date.now() }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('manaha-auth');
    setCurrentView('chat');
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }
  const renderView = () => {
    if (showCrisisSupport) {
      return <CrisisSupport onClose={() => setShowCrisisSupport(false)} />;
    }

    switch (currentView) {
      case 'chat':
        return <ChatInterface onCrisisDetected={() => setShowCrisisSupport(true)} />;
      case 'mood':
        return <MoodTracker />;
      case 'journal':
        return <Journal />;
      case 'secrets':
        return <SecretVault />;
      case 'quotes':
        return <DailyQuotes />;
      case 'relaxation':
        return <RelaxationZone />;
      case 'crisis':
        return <CrisisSupport onClose={() => setCurrentView('chat')} />;
      default:
        return <ChatInterface onCrisisDetected={() => setShowCrisisSupport(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Sidebar
        menuItems={menuItems}
        currentView={currentView}
        onViewChange={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-200">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;