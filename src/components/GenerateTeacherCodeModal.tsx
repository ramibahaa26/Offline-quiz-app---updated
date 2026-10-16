import React, { useState } from 'react';
import { UserPlus, Sparkles, X, Check } from 'lucide-react';
import { useQuiz } from '../context/QuizContext.tsx';

interface GenerateTeacherCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateTeacherCodeModal: React.FC<GenerateTeacherCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { generateTeacherCode } = useQuiz();
  const [teacherName, setTeacherName] = useState('');
  const [isAutoGenerate, setIsAutoGenerate] = useState(true);
  const [customCode, setCustomCode] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;
    if (!isAutoGenerate && !customCode.trim()) return;

    const generated = generateTeacherCode(
      teacherName,
      isAutoGenerate ? null : customCode
    );
    setCreatedCode(generated);
  };

  const handleDone = () => {
    setTeacherName('');
    setCustomCode('');
    setCreatedCode(null);
    setIsAutoGenerate(true);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gen-teacher-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100">
        <button
          onClick={handleDone}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#E8DEF8] flex items-center justify-center text-[#6750A4]">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 id="gen-teacher-title" className="text-xl font-bold text-[#1C1B1F]">
              New Teacher Password
            </h2>
            <p className="text-xs text-[#49454F]">
              Generate access credentials for instructor or staff
            </p>
          </div>
        </div>

        {createdCode ? (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Access Code Created!</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Share this code with <span className="font-semibold text-gray-800">{teacherName}</span> to grant Host Dashboard access.
            </p>
            <div className="w-full bg-[#F7F2FA] border border-[#E8DEF8] rounded-2xl p-4 flex items-center justify-between mb-6">
              <div className="text-left">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Access Code
                </span>
                <span className="text-2xl font-bold font-mono text-[#6750A4] tracking-wider">
                  {createdCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(createdCode).catch(() => {});
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-white text-[#6750A4] rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
              >
                Copy
              </button>
            </div>
            <button
              onClick={handleDone}
              className="w-full py-3 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white font-medium text-sm transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="teacher-name-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Teacher or Department Name
              </label>
              <input
                id="teacher-name-input"
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="e.g. Dr. Roberts or Math Dept"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-sm bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6750A4]" />
                <span className="text-xs font-medium text-gray-800">
                  Auto-Generate Random Code
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoGenerate}
                  onChange={(e) => setIsAutoGenerate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6750A4]"></div>
              </label>
            </div>

            {!isAutoGenerate ? (
              <div>
                <label
                  htmlFor="custom-code-input"
                  className="block text-xs font-semibold text-gray-700 mb-1"
                >
                  Custom Access Code
                </label>
                <input
                  id="custom-code-input"
                  type="text"
                  required
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Enter custom access code"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-sm bg-gray-50 focus:bg-white font-mono uppercase"
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#F3EDF7] text-[#49454F] text-xs leading-relaxed">
                A secure unique teacher authorization code will be generated and registered automatically.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={handleDone}
                className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white font-medium text-sm shadow-md transition-all"
              >
                Generate
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
