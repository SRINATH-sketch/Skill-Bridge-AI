import React from 'react';
import { Target, Sparkles, Layers, BarChart3, BookOpen, CheckCircle2 } from 'lucide-react';
import { JobRole } from '../types';

interface NavbarProps {
  activeTab: 'journey' | 'progress' | 'guide';
  setActiveTab: (tab: 'journey' | 'progress' | 'guide') => void;
  selectedRole?: JobRole;
  readinessScore: number;
  completedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRole,
  readinessScore,
  completedCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('journey')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SkillBridge AI</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Placement Prep
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Personalized Skill Planning, Task Verification & Anti-Plagiarism</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'journey'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Full Journey</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'progress'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Progress & Mastery</span>
              <span className="sm:hidden">Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Architecture</span>
            </button>
          </nav>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-medium">
                {selectedRole ? selectedRole.title : 'Target Role'}
              </div>
              <div className="text-xs font-bold text-slate-800">
                {readinessScore}% Placement Ready
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
