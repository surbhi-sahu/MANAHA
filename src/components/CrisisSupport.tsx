import React from 'react';
import { X, Phone, MessageCircle, Globe, Heart } from 'lucide-react';

interface CrisisSupportProps {
  onClose: () => void;
}

const crisisResources = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 free and confidential support',
    country: 'US'
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: '24/7 crisis support via text',
    country: 'US'
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referral and information service',
    country: 'US'
  },
  {
    name: 'International Association for Suicide Prevention',
    phone: 'Visit website',
    description: 'Global crisis centers directory',
    country: 'International'
  }
];

export default function CrisisSupport({ onClose }: CrisisSupportProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Crisis Support</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 font-medium mb-2">
              🚨 If you're having thoughts of self-harm or suicide, please reach out for help immediately.
            </p>
            <p className="text-red-700 text-sm">
              You are not alone. There are people who care and want to help you through this difficult time.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Immediate Support */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Immediate Support</h3>
            <div className="space-y-4">
              {crisisResources.map((resource, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {resource.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    {resource.phone.startsWith('Text') ? (
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                    ) : resource.phone === 'Visit website' ? (
                      <Globe className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Phone className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="font-mono text-lg text-blue-600">{resource.phone}</span>
                  </div>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coping Strategies */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Right Now, You Can:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🫁</span>
                  <div>
                    <p className="font-medium text-gray-800">Take deep breaths</p>
                    <p className="text-sm text-gray-600">Try the 4-7-8 breathing technique</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-medium text-gray-800">Reach out to someone</p>
                    <p className="text-sm text-gray-600">Call a friend, family member, or counselor</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🚶</span>
                  <div>
                    <p className="font-medium text-gray-800">Change your environment</p>
                    <p className="text-sm text-gray-600">Go to a public place or safe location</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">❄️</span>
                  <div>
                    <p className="font-medium text-gray-800">Use ice cubes</p>
                    <p className="text-sm text-gray-600">Hold ice to redirect intense feelings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-medium text-gray-800">Write down your feelings</p>
                    <p className="text-sm text-gray-600">Express what you're going through</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-medium text-gray-800">Wait it out</p>
                    <p className="text-sm text-gray-600">Intense feelings will pass with time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supportive Message */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">You Matter</h3>
            <p className="text-lg opacity-90 mb-4">
              Your life has value and meaning. The pain you're feeling right now is temporary, 
              but your life is precious.
            </p>
            <p className="opacity-80">
              There are people who care about you and want to help. Please reach out.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:988"
              className="flex-1 flex items-center justify-center space-x-2 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>Call 988 Now</span>
            </a>
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Return to Manaha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}