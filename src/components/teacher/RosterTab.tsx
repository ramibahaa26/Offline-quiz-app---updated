import React, { useState } from 'react';
import { UserPlus, Users, Trash2, Shield, AlertCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext.tsx';
import { getStudentInitials } from '../../utils/quiz-logic.ts';

export const RosterTab: React.FC = () => {
  const { students, addStudent, deleteStudent, clearStudents } = useQuiz();
  const [studentCode, setStudentCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!studentCode.trim() || !studentName.trim()) {
      setError('Please provide both a Secret Participant Code and a Display Name.');
      return;
    }

    const success = addStudent(studentCode, studentName);
    if (!success) {
      setError(`Student with code "${studentCode.trim()}" already exists in roster.`);
      return;
    }

    setStudentCode('');
    setStudentName('');
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
      {/* Register Student Form Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CAC4D0] shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#E8DEF8] flex items-center justify-center text-[#6750A4]">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1C1B1F]">
              Register Student Participant
            </h3>
            <p className="text-xs text-gray-500">
              Assign secret codes to students to authenticate into the offline exam
            </p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="student-code-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Secret Access Code *
              </label>
              <input
                id="student-code-input"
                type="text"
                required
                value={studentCode}
                onChange={(e) => {
                  setStudentCode(e.target.value);
                  setError(null);
                }}
                placeholder="Assign student participant code"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-xs bg-gray-50 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="student-name-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Student Display Name *
              </label>
              <input
                id="student-name-input"
                type="text"
                required
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setError(null);
                }}
                placeholder="Enter student full name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-xs bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-center"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student to Local Registry</span>
          </button>
        </form>
      </div>

      {/* Roster Registry List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CAC4D0] shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6750A4]" />
            <h3 className="text-sm font-bold text-[#1C1B1F]">
              Roster Registry ({students.length})
            </h3>
          </div>
          {students.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-500">
              No students enrolled in the registry yet. Use the form above to add students.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {students.map((student) => (
              <div
                key={student.code}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F2FA] border border-[#E8DEF8] hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center font-bold text-xs shadow-2xs">
                    {getStudentInitials(student.name)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1C1B1F]">
                      {student.name}
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                      <Shield className="w-3 h-3 text-[#6750A4]" />
                      <span>Code:</span>
                      <span className="font-bold text-[#6750A4]">{student.code}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteStudent(student.code)}
                  title="Remove student"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal to Clear All Students */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Clear Student Roster?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              This will remove all {students.length} students from the classroom registry.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearStudents();
                  setShowConfirmClear(false);
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
