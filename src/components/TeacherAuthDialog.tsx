import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import { useQuiz } from '../context/QuizContext.tsx';

interface TeacherAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherAuthDialog: React.FC<TeacherAuthDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { verifyAndLoginTeacher, teacherAuthError, clearTeacherAuthError } = useQuiz();
  const [codeOrPin, setCodeOrPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!codeOrPin.trim()) return;
    const success = verifyAndLoginTeacher(codeOrPin);
    if (success) {
      setCodeOrPin('');
      onSuccess();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Purple Lock Icon Badge */}
        <div className="w-14 h-14 rounded-full bg-[#E8DEF8] flex items-center justify-center mb-4 text-[#6750A4] shadow-xs">
          <Lock className="w-7 h-7" />
        </div>

        {/* Title & Info */}
        <h2
          id="teacher-auth-title"
          className="text-2xl font-bold text-[#1C1B1F] tracking-tight"
        >
          Teacher Verification
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#49454F] leading-relaxed">
          Enter your Teacher Access Code or Master Admin PIN to open the host dashboard and prevent student editing.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mt-6 flex flex-col gap-4">
          <div className="relative text-left">
            <label
              htmlFor="teacher-code-input"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Teacher Code or Master PIN
            </label>
            <div className="relative">
              <input
                id="teacher-code-input"
                type={showPassword ? 'text' : 'password'}
                value={codeOrPin}
                onChange={(e) => {
                  setCodeOrPin(e.target.value);
                  if (teacherAuthError) clearTeacherAuthError();
                }}
                placeholder="Enter Access Code or Master PIN"
                autoFocus
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {teacherAuthError && (
            <div
              role="alert"
              className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-center animate-in shake"
            >
              {teacherAuthError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
