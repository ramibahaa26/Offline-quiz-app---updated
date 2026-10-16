import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Trash2,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext.tsx';
import { exportToCsvContent, calculatePercentage } from '../../utils/quiz-logic.ts';
import { QuizSubmission } from '../../types/quiz.ts';

export const ResultsTab: React.FC = () => {
  const { submissions, questions, clearSubmissions } = useQuiz();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [expandedSubId, setExpandedSubId] = useState<number | null>(null);

  const totalQuestions = questions.length;
  const totalSubmissions = submissions.length;

  const avgScore =
    totalSubmissions > 0
      ? submissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions
      : 0;

  const topScore =
    totalSubmissions > 0
      ? Math.max(...submissions.map((s) => s.score))
      : 0;

  const passingSubmissions = submissions.filter(
    (s) => s.score / (s.totalQuestions || totalQuestions || 1) >= 0.5
  ).length;

  const passRate =
    totalSubmissions > 0
      ? Math.round((passingSubmissions / totalSubmissions) * 100)
      : 0;

  const handleExportCsv = () => {
    if (totalSubmissions === 0) return;
    const csvData = exportToCsvContent(submissions, totalQuestions);

    // Copy to clipboard safely
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(csvData)
        .then(() => {
          setCopiedToast(true);
          setTimeout(() => setCopiedToast(false), 3000);
        })
        .catch(() => {
          // In headless or unprivileged environments, continue without warning
        });
    }

    // Trigger file download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Classroom_Quiz_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (id: number) => {
    setExpandedSubId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
      {/* Summary Bento Cards */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CAC4D0] shadow-xs">
        <h3 className="text-sm font-bold text-[#1C1B1F] mb-4">
          Live Classroom Performance Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Average Score */}
          <div className="p-3.5 rounded-2xl bg-[#EADDFF] border border-[#D0BCFF] flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#21005D]/70 uppercase tracking-wider">
              Average Score
            </span>
            <div className="mt-1">
              <span className="text-2xl font-black text-[#21005D]">
                {avgScore.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-[#21005D]/70 ml-1">
                / {totalQuestions}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#21005D]/80 mt-1">
              {calculatePercentage(avgScore, totalQuestions)}% Accuracy
            </span>
          </div>

          {/* Submissions */}
          <div className="p-3.5 rounded-2xl bg-[#D3E3FD] border border-[#A8C7FA] flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#041E49]/70 uppercase tracking-wider">
              Submissions
            </span>
            <div className="mt-1">
              <span className="text-2xl font-black text-[#041E49]">
                {totalSubmissions}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#0842A0] mt-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Students Completed
            </span>
          </div>

          {/* Pass Rate */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-wider">
              Pass Rate (≥50%)
            </span>
            <div className="mt-1">
              <span className="text-2xl font-black text-emerald-800">
                {passRate}%
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 mt-1">
              {passingSubmissions} of {totalSubmissions} Passed
            </span>
          </div>

          {/* Top Score */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-amber-800/70 uppercase tracking-wider">
              Top Score
            </span>
            <div className="mt-1">
              <span className="text-2xl font-black text-amber-800">
                {topScore}
              </span>
              <span className="text-xs font-semibold text-amber-800/70 ml-1">
                / {totalQuestions}
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 mt-1 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Highest mark
            </span>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="space-y-2">
        <button
          onClick={handleExportCsv}
          disabled={totalSubmissions === 0}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            totalSubmissions === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#137333] hover:bg-[#0f5c29] text-white shadow-md hover:shadow-lg'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export & Download Excel CSV Report</span>
        </button>

        {copiedToast && (
          <div className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2 animate-in fade-in flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>CSV downloaded and copied to clipboard!</span>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CAC4D0] shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#1C1B1F]">
            Participant Results ({totalSubmissions})
          </h3>
          {totalSubmissions > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {totalSubmissions === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-gray-500">
              No submissions recorded yet. Once students complete the quiz on their devices, their scores and completed answers will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => {
              const scoreRatio = sub.score / (sub.totalQuestions || totalQuestions || 1);
              const percentage = calculatePercentage(sub.score, sub.totalQuestions || totalQuestions);
              const isPassing = scoreRatio >= 0.5;
              const isExpanded = expandedSubId === sub.id;

              const badgeColorClass =
                scoreRatio >= 0.8
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : scoreRatio >= 0.5
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div
                    onClick={() => toggleExpand(sub.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span>{sub.studentName}</span>
                        <span className="text-[11px] font-mono text-gray-500">
                          (Code: {sub.studentCode})
                        </span>
                        {sub.violation && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Auto-Terminated ({sub.violation})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>
                          {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(sub.timestamp).toLocaleDateString()}
                        </span>
                        {sub.lastAnsweredStem && (
                          <span className="text-gray-700 font-mono text-[10px] bg-gray-100 px-2 py-0.5 rounded-md">
                            Last Stem: {sub.lastAnsweredStem}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${badgeColorClass}`}
                      >
                        {sub.score} / {sub.totalQuestions || totalQuestions} ({percentage}%)
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 p-1"
                        aria-label="Expand answers details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && sub.selectedAnswers && (
                    <div className="p-4 bg-white border-t border-gray-200 space-y-2 animate-in fade-in">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Question Responses Breakdown
                      </div>
                      {questions.map((q, qIndex) => {
                        const chosen = sub.selectedAnswers?.[q.id];
                        const isCorrect = chosen !== undefined && chosen === q.correctAnswerIndex;
                        const choices = [q.choice1, q.choice2, q.choice3, q.choice4, q.choice5].filter(Boolean);

                        return (
                          <div
                            key={q.id}
                            className={`p-2.5 rounded-xl border text-xs ${
                              isCorrect
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                                : 'bg-rose-50/50 border-rose-200 text-rose-900'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span>Q{qIndex + 1}: {q.text}</span>
                              <span className="flex items-center gap-1 font-bold">
                                {isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Correct</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Incorrect</span>
                                  </>
                                )}
                              </span>
                            </div>
                            <div className="mt-1 text-[11px] text-gray-600 flex flex-col gap-0.5">
                              <div>
                                Student answer:{' '}
                                <span className="font-semibold text-gray-800">
                                  {chosen !== undefined ? choices[chosen] || `Option ${chosen + 1}` : 'No response'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="text-emerald-700">
                                  Correct answer: <span className="font-semibold">{choices[q.correctAnswerIndex]}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Clear All Submissions?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              This will permanently delete all {totalSubmissions} quiz responses and reset analytics.
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
                  clearSubmissions();
                  setShowConfirmClear(false);
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
