import React from 'react';
import { ViewType } from '../App';
import { DivideIcon as LucideIcon, LogOut, User } from 'lucide-react';

interface MenuItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  currentUser: string | null;
  onLogout: () => void;
}

export default function Sidebar({ menuItems, currentView, onViewChange, currentUser, onLogout }: SidebarProps) {
  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manaha</h1>
            <p className="text-sm text-gray-600">Your wellness companion</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="mb-6 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Welcome, {currentUser}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : item.color}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2">Daily Reminder</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Taking care of your mental health is a journey, not a destination. 
            You're doing great by being here.
          </p>
        </div>
      </div>
    </div>
  );
}