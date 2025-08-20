import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

type Exercise = 'breathing' | 'meditation' | 'grounding';

export default function RelaxationZone() {
  const [currentExercise, setCurrentExercise] = useState<Exercise>('breathing');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const exercises = {
    breathing: {
      name: '4-7-8 Breathing',
      description: 'Inhale for 4 seconds, hold for 7, exhale for 8',
      duration: 60,
      icon: '🫁'
    },
    meditation: {
      name: 'Mindful Meditation',
      description: 'Focus on your breath and present moment',
      duration: 300,
      icon: '🧘‍♀️'
    },
    grounding: {
      name: '5-4-3-2-1 Grounding',
      description: 'Engage your senses to stay present',
      duration: 180,
      icon: '🌍'
    }
  };

  useEffect(() => {
    if (isActive && currentExercise === 'breathing') {
      startBreathingExercise();
    } else if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentExercise]);

  const startBreathingExercise = () => {
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let count = 0;
    let phaseTime = 0;
    const phaseDurations = { inhale: 4, hold: 7, exhale: 8 };
    
    intervalRef.current = setInterval(() => {
      phaseTime++;
      
      if (phaseTime >= phaseDurations[phase]) {
        phaseTime = 0;
        if (phase === 'inhale') {
          phase = 'hold';
        } else if (phase === 'hold') {
          phase = 'exhale';
        } else {
          phase = 'inhale';
          count++;
          setBreathCount(count);
        }
        setBreathPhase(phase);
      }
      
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return exercises[currentExercise].duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return exercises[currentExercise].duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeRemaining(exercises[currentExercise].duration);
    setBreathPhase('inhale');
    setBreathCount(0);
  };

  const switchExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setIsActive(false);
    setTimeRemaining(exercises[exercise].duration);
    setBreathPhase('inhale');
    setBreathCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBreathingGuide = () => (
    <div className="text-center">
      <div className="relative mb-8">
        <div 
          className={`w-32 h-32 mx-auto rounded-full transition-all duration-1000 ${
            breathPhase === 'inhale' ? 'bg-blue-400 scale-110' :
            breathPhase === 'hold' ? 'bg-purple-400 scale-110' :
            'bg-teal-400 scale-75'
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-sm font-medium capitalize">{breathPhase}</p>
            <p className="text-xs opacity-80">
              {breathPhase === 'inhale' ? '4s' : breathPhase === 'hold' ? '7s' : '8s'}
            </p>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {breathPhase === 'inhale' ? 'Breathe In' : 
         breathPhase === 'hold' ? 'Hold' : 'Breathe Out'}
      </h3>
      <p className="text-gray-600 mb-4">
        Breath cycle: {breathCount}
      </p>
    </div>
  );

  const renderMeditationGuide = () => (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
        <span className="text-4xl">🧘‍♀️</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Mindful Meditation</h3>
      <div className="space-y-3 text-gray-600">
        <p>• Find a comfortable seated position</p>
        <p>• Close your eyes and focus on your breath</p>
        <p>• Notice thoughts without judgment</p>
        <p>• Return attention to your breathing</p>
      </div>
    </div>
  );

  const renderGroundingGuide = () => (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
        <span className="text-4xl">🌍</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">5-4-3-2-1 Grounding</h3>
      <div className="space-y-3 text-gray-600 text-left max-w-sm mx-auto">
        <p><strong>5</strong> things you can see</p>
        <p><strong>4</strong> things you can touch</p>
        <p><strong>3</strong> things you can hear</p>
        <p><strong>2</strong> things you can smell</p>
        <p><strong>1</strong> thing you can taste</p>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Relaxation Zone</h2>
        <p className="text-gray-600">Take a moment to breathe, relax, and center yourself.</p>
      </div>

      <div className="p-6">
        {/* Exercise Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(exercises).map(([key, exercise]) => (
            <button
              key={key}
              onClick={() => switchExercise(key as Exercise)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                currentExercise === key
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-3">{exercise.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{exercise.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
              <p className="text-xs text-gray-500">
                {Math.floor(exercise.duration / 60)} minutes
              </p>
            </button>
          ))}
        </div>

        {/* Main Exercise Area */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 rounded-2xl p-8">
          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-gray-600">
              {isActive ? 'In progress...' : 'Ready to start'}
            </p>
          </div>

          {/* Exercise Content */}
          <div className="mb-8">
            {currentExercise === 'breathing' && renderBreathingGuide()}
            {currentExercise === 'meditation' && renderMeditationGuide()}
            {currentExercise === 'grounding' && renderGroundingGuide()}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleExercise}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>
            
            <button
              onClick={resetExercise}
              className="flex items-center space-x-2 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relaxation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Volume2 className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="font-medium text-gray-800">Create a calm environment</p>
                <p className="text-sm text-gray-600">Find a quiet space free from distractions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">🪑</span>
              <div>
                <p className="font-medium text-gray-800">Get comfortable</p>
                <p className="text-sm text-gray-600">Sit or lie in a comfortable position</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">📱</span>
              <div>
                <p className="font-medium text-gray-800">Minimize distractions</p>
                <p className="text-sm text-gray-600">Turn off notifications and focus inward</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">💙</span>
              <div>
                <p className="font-medium text-gray-800">Be patient with yourself</p>
                <p className="text-sm text-gray-600">It's normal for your mind to wander</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}