import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Play,
  Layers,
  Users,
  Trophy,
  Wifi,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext.tsx';
import { MonitorTab } from './teacher/MonitorTab.tsx';
import { BankTab } from './teacher/BankTab.tsx';
import { RosterTab } from './teacher/RosterTab.tsx';
import { ResultsTab } from './teacher/ResultsTab.tsx';

export const TeacherWorkspace: React.FC = () => {
  const {
    navigateToRole,
    settings,
    authenticatedTeacherName,
    logoutTeacher,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(0);

  return (
    <div className="min-h-screen bg-[#F7F2FA] text-[#1C1B1F] flex flex-col pb-24 sm:pb-28">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CAC4D0] px-4 py-3 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Back & Teacher Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToRole('CHOOSE_ROLE')}
              aria-label="Back to Role Selection"
              className="w-9 h-9 rounded-full bg-[#6750A4] text-white flex items-center justify-center hover:bg-[#523e85] transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#1C1B1F] tracking-tight">
                  ClassNode
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#6750A4]">
                  Host
                </span>
              </div>
              <p className="text-[11px] text-[#49454F] font-medium">
                Teacher: <span className="font-semibold">{authenticatedTeacherName || 'Admin'}</span>
              </p>
            </div>
          </div>

          {/* Controls: Lock & Live Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={logoutTeacher}
              title="Lock Dashboard & Logout"
              className="p-2 text-[#6750A4] hover:bg-[#F3EDF7] rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            {/* Live Indicator Pill */}
            <div className="px-3 py-1 rounded-full bg-[#E8DEF8] flex items-center gap-1.5 shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-bold text-[#1D192B]">
                {settings.isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 0 && <MonitorTab />}
        {activeTab === 1 && <BankTab />}
        {activeTab === 2 && <RosterTab />}
        {activeTab === 3 && <ResultsTab />}
      </main>

      {/* Bento Bottom Navigation Bar */}
      <nav
        aria-label="Teacher Dashboard Tabs"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#F3EDF7] border-t border-[#CAC4D0] px-4 py-2 sm:py-3 shadow-lg"
      >
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 sm:gap-2">
          {[
            { id: 0, label: 'Monitor', icon: Play },
            { id: 1, label: 'Bank', icon: Layers },
            { id: 2, label: 'Roster', icon: Users },
            { id: 3, label: 'Results', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 0 | 1 | 2 | 3)}
                className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-2 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-[#E8DEF8] text-[#21005D] shadow-xs'
                    : 'text-[#49454F] hover:bg-black/5 hover:text-[#1C1B1F]'
                }`}
              >
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#D0BCFF] text-[#21005D]' : 'text-current'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium ${
                    isSelected ? 'font-bold text-[#21005D]' : 'text-[#49454F]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
