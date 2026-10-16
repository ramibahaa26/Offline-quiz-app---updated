import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  User,
  ShieldAlert,
  ArrowRight,
  Wifi,
  RotateCcw,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext.tsx';
import { TeacherAuthDialog } from './TeacherAuthDialog.tsx';

export const WelcomeRoleScreen: React.FC = () => {
  const {
    navigateToRole,
    loginStudent,
    loginError,
    settings,
    isTeacherAuthenticated,
    clearTeacherAuthError,
    resetToDefaults,
  } = useQuiz();

  const [inputCode, setInputCode] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = loginStudent(inputCode);
    if (ok) {
      navigateToRole('STUDENT');
    }
  };

  const handleHostClick = () => {
    if (isTeacherAuthenticated) {
      navigateToRole('TEACHER');
    } else {
      clearTeacherAuthError();
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2FA] text-[#1C1B1F] flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Bar with Local Wi-Fi indicator */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between text-xs text-gray-500 py-1">
        <div className="flex items-center gap-1.5 font-medium text-[#6750A4] bg-[#E8DEF8] px-3 py-1 rounded-full">
          <Wifi className="w-3.5 h-3.5" />
          <span>Offline Class Router Ready</span>
        </div>
        <button
          onClick={resetToDefaults}
          title="Reset database to initial sample demo data"
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Main Center Container */}
      <div className="max-w-md w-full mx-auto my-auto flex flex-col items-center text-center py-6">
        {/* App Logo Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#6750A4] via-[#7F67BE] to-[#D0BCFF] flex items-center justify-center text-white shadow-xl shadow-purple-200 mb-5">
          <Sparkles className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#1C1B1F] tracking-tight">
          Offline Class Quiz
        </h1>
        <p className="text-xs sm:text-sm text-[#49454F] mt-1.5 max-w-sm">
          No Internet Required • Connect via Local Wi-Fi Router
        </p>

        {/* Student Quick Join Card */}
        <div className="w-full mt-8 bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-purple-100/80">
          <h2 className="text-base font-bold text-[#1C1B1F]">
            Student Quick Portal
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 mb-4">
            Enter your secret code to participate in the live session
          </p>

          <form onSubmit={handleQuickJoin} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter participant code"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-sm bg-gray-50 focus:bg-white text-center font-mono font-bold tracking-wider"
              />
              <Lock className="w-4 h-4 text-[#6750A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {loginError && (
              <div
                role="alert"
                className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5 text-center"
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#6750A4] hover:bg-[#523e85] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Check Live Quiz & Login</span>
            </button>
          </form>

          {settings.isLive && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>A live quiz is currently hosted by teacher!</span>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            OR CHOOSE WORKSPACE
          </span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        {/* Role Navigation Buttons */}
        <div className="w-full grid grid-cols-2 gap-3.5">
          {/* Join as Student */}
          <button
            onClick={() => navigateToRole('STUDENT')}
            className="p-4 rounded-3xl bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm transition-all flex flex-col items-center justify-center gap-1.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gray-100 group-hover:bg-purple-100 text-gray-700 group-hover:text-[#6750A4] flex items-center justify-center transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800">
              Join as Student
            </span>
            <span className="text-[10px] text-gray-500">
              Enter exam room
            </span>
          </button>

          {/* Host (Secured) */}
          <button
            onClick={handleHostClick}
            className="p-4 rounded-3xl bg-[#6750A4] hover:bg-[#523e85] text-white shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
              {isTeacherAuthenticated ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs font-bold">
              {isTeacherAuthenticated ? 'Host Dashboard' : 'Host (Secured)'}
            </span>
            <span className="text-[10px] text-purple-200">
              {isTeacherAuthenticated ? 'Logged In' : 'PIN / Staff Code'}
            </span>
          </button>
        </div>
      </div>

      {/* Footer Info & Admin Fast Access */}
      <footer className="max-w-xl w-full mx-auto text-center text-[11px] text-gray-500 pt-2 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-gray-200">
        <span>ClassNode Local Engine • Zero External Cloud</span>
        <div className="flex items-center gap-2">
          <span>Master PIN: <strong className="font-mono text-[#6750A4]">{settings.masterPin}</strong></span>
          <span>•</span>
          <span>Teacher: <strong className="font-mono text-[#6750A4]">TEACH123</strong></span>
        </div>
      </footer>

      {/* Teacher Authentication Modal */}
      <TeacherAuthDialog
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigateToRole('TEACHER');
        }}
      />
    </div>
  );
};
