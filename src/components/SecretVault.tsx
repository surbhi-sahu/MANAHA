import React, { useState, useEffect } from 'react';
import { Plus, Search, Lock, Unlock, Eye, EyeOff, Trash2, Edit3, Shield, Key } from 'lucide-react';

interface Secret {
  id: string;
  title: string;
  content: string;
  category: string;
  isLocked: boolean;
  createdAt: string;
  lastAccessed: string;
}

const categories = [
  { id: 'personal', name: 'Personal Thoughts', icon: '💭', color: 'bg-purple-100 text-purple-700' },
  { id: 'passwords', name: 'Passwords & Accounts', icon: '🔑', color: 'bg-blue-100 text-blue-700' },
  { id: 'memories', name: 'Private Memories', icon: '📸', color: 'bg-pink-100 text-pink-700' },
  { id: 'confessions', name: 'Confessions', icon: '🤐', color: 'bg-red-100 text-red-700' },
  { id: 'dreams', name: 'Dreams & Goals', icon: '✨', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'fears', name: 'Fears & Worries', icon: '😰', color: 'bg-gray-100 text-gray-700' },
  { id: 'other', name: 'Other Secrets', icon: '🔒', color: 'bg-teal-100 text-teal-700' },
];

export default function SecretVault() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [isLocked, setIsLocked] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [unlockedSecrets, setUnlockedSecrets] = useState<Set<string>>(new Set());
  const [masterPassword, setMasterPassword] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isUnlockingVault, setIsUnlockingVault] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('manaha-auth') || '{}').username;
    if (currentUser) {
      const stored = localStorage.getItem(`manaha-secrets-${currentUser}`);
      if (stored) {
        setSecrets(JSON.parse(stored));
      }
    }
  }, []);

  const saveSecrets = (updatedSecrets: Secret[]) => {
    const currentUser = JSON.parse(localStorage.getItem('manaha-auth') || '{}').username;
    if (currentUser) {
      localStorage.setItem(`manaha-secrets-${currentUser}`, JSON.stringify(updatedSecrets));
    }
  };

  const unlockVault = () => {
    // Simple master password check (in real app, this would be more secure)
    if (masterPassword.length >= 4) {
      setVaultUnlocked(true);
      setIsUnlockingVault(false);
      setMasterPassword('');
    }
  };

  const saveSecret = () => {
    const secret: Secret = {
      id: editingSecret?.id || Date.now().toString(),
      title: title.trim() || 'Untitled Secret',
      content,
      category,
      isLocked,
      createdAt: editingSecret?.createdAt || new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    };

    let updatedSecrets;
    if (editingSecret) {
      updatedSecrets = secrets.map(s => s.id === editingSecret.id ? secret : s);
    } else {
      updatedSecrets = [secret, ...secrets];
    }

    setSecrets(updatedSecrets);
    saveSecrets(updatedSecrets);
    resetForm();
  };

  const deleteSecret = (id: string) => {
    const updatedSecrets = secrets.filter(s => s.id !== id);
    setSecrets(updatedSecrets);
    saveSecrets(updatedSecrets);
    setUnlockedSecrets(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const editSecret = (secret: Secret) => {
    setEditingSecret(secret);
    setTitle(secret.title);
    setContent(secret.content);
    setCategory(secret.category);
    setIsLocked(secret.isLocked);
    setIsCreating(true);
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingSecret(null);
    setTitle('');
    setContent('');
    setCategory('personal');
    setIsLocked(true);
  };

  const toggleSecretLock = (secretId: string) => {
    if (unlockedSecrets.has(secretId)) {
      setUnlockedSecrets(prev => {
        const newSet = new Set(prev);
        newSet.delete(secretId);
        return newSet;
      });
    } else {
      setUnlockedSecrets(prev => new Set(prev).add(secretId));
    }
  };

  const filteredSecrets = secrets.filter(secret => {
    const matchesSearch = secret.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         secret.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || secret.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!vaultUnlocked) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Secret Vault</h2>
            <p className="text-gray-600">
              Your private space for thoughts, secrets, and important information you don't want to forget.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Master Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showMasterPassword ? 'text' : 'password'}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter your master password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && unlockVault()}
                />
                <button
                  type="button"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showMasterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={unlockVault}
              disabled={masterPassword.length < 4}
              className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Unlock Vault
            </button>

            <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
              <h3 className="font-medium text-indigo-900 mb-2">🔐 Why Use Secret Vault?</h3>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Store thoughts you can't share with others</li>
                <li>• Remember important passwords and information</li>
                <li>• Keep private memories and confessions safe</li>
                <li>• Perfect for those who struggle to keep secrets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingSecret ? 'Edit Secret' : 'New Secret'}
            </h2>
            <div className="space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSecret}
                disabled={!content.trim()}
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingSecret ? 'Update' : 'Save Secret'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your secret a title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Level
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsLocked(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    !isLocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>Normal</span>
                </button>
                <button
                  onClick={() => setIsLocked(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLocked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Locked</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Secret
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your secret here... This is a safe space where you can share anything without judgment."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={12}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-indigo-600" />
              Secret Vault
            </h2>
            <p className="text-gray-600">Your private space for thoughts and secrets</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Secret</span>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your secrets..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredSecrets.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {secrets.length === 0 ? 'Your Vault is Empty' : 'No secrets found'}
            </h3>
            <p className="text-gray-400 mb-6">
              {secrets.length === 0 
                ? 'Create your first secret to start using your private vault.'
                : 'Try adjusting your search terms or category filter.'
              }
            </p>
            {secrets.length === 0 && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Create Your First Secret
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSecrets.map((secret) => {
              const categoryInfo = categories.find(c => c.id === secret.category) || categories[0];
              const isUnlocked = unlockedSecrets.has(secret.id);
              
              return (
                <div key={secret.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                          {categoryInfo.icon} {categoryInfo.name}
                        </span>
                        {secret.isLocked && (
                          <Lock className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{secret.title}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(secret.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editSecret(secret)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSecret(secret.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {secret.isLocked && !isUnlocked ? (
                      <div className="p-4 bg-gray-100 rounded-xl text-center">
                        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">This secret is locked</p>
                        <button
                          onClick={() => toggleSecretLock(secret.id)}
                          className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                        >
                          Unlock to View
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 mb-3 line-clamp-4">
                          {secret.content}
                        </p>
                        {secret.isLocked && (
                          <button
                            onClick={() => toggleSecretLock(secret.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            Lock Again
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}