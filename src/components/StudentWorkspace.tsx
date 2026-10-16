import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Wifi,
  ChevronRight,
  ShieldAlert,
  EyeOff,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext.tsx';
import { calculatePercentage } from '../utils/quiz-logic.ts';
import { QuestionMedia } from './QuestionMedia.tsx';
import { QuizTimerGauge } from './QuizTimerGauge.tsx';

export const StudentWorkspace: React.FC = () => {
  const {
    navigateToRole,
    studentStep,
    currentStudent,
    loginError,
    loginStudent,
    startQuiz,
    activeShuffledQuestions,
    studentAnswers,
    saveAnswer,
    timeRemaining,
    initialTotalSeconds,
    studentScore,
    earlyTerminationReason,
    submitStudentQuiz,
    resetStudentState,
    settings,
    submissions,
  } = useQuiz();

  const [inputCode, setInputCode] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [screenshotAttemptWarning, setScreenshotAttemptWarning] = useState<string | null>(null);

  const totalQuestions = activeShuffledQuestions.length;
  const answeredCount = Object.keys(studentAnswers).length;

  // -------------------------------------------------------------
  // ANTI-CHEAT: SCREEN EXIT / TAB SWITCH & SCREENSHOT PREVENTION
  // -------------------------------------------------------------
  const activeQuizRef = useRef(false);
  activeQuizRef.current = studentStep === 'ACTIVE';

  const submitStudentQuizRef = useRef(submitStudentQuiz);
  submitStudentQuizRef.current = submitStudentQuiz;

  useEffect(() => {
    if (studentStep !== 'ACTIVE') return;

    // 1. Detect Screen Exit / Window Blur / Tab Switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && activeQuizRef.current) {
        submitStudentQuizRef.current('Screen Exit / Tab Switch Detected');
      }
    };

    const handleWindowBlur = () => {
      if (activeQuizRef.current) {
        submitStudentQuizRef.current('Screen Exit / Tab Switch Detected');
      }
    };

    const handlePageHide = () => {
      if (activeQuizRef.current) {
        submitStudentQuizRef.current('Screen Exit / Tab Switch Detected');
      }
    };

    // 2. Prevent Screenshots, DevTools & AI Scraping shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen detection
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setScreenshotAttemptWarning('Screenshot blocked: Screen capture is prohibited during secure exam mode.');
        setTimeout(() => setScreenshotAttemptWarning(null), 4000);
        try {
          navigator.clipboard.writeText('');
        } catch {}
        return false;
      }

      // Prohibited combinations: Ctrl/Cmd + (C, X, V, U, P, S) or F12 / DevTools
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'x', 'v', 'u', 'p', 's'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        setScreenshotAttemptWarning('Copying/printing exam content is disabled to protect test integrity.');
        setTimeout(() => setScreenshotAttemptWarning(null), 3000);
        return false;
      }

      // DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        return false;
      }

      // Mac screenshot shortcuts: Cmd + Shift + 3 / 4 / 5
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        setScreenshotAttemptWarning('Screen recording / screenshot hotkeys are disabled.');
        setTimeout(() => setScreenshotAttemptWarning(null), 4000);
        return false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [studentStep]);

  // STEP 1: LOGIN (No password examples given in placeholder or helpers)
  if (studentStep === 'LOGIN') {
    return (
      <div className="min-h-screen bg-[#F7F2FA] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 flex flex-col items-center text-center">
          <button
            onClick={() => navigateToRole('CHOOSE_ROLE')}
            className="self-start text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Hub</span>
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6750A4] to-[#D0BCFF] flex items-center justify-center text-white mb-4 shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-[#1C1B1F]">
            Student Exam Portal
          </h2>
          <p className="text-xs text-[#49454F] mt-1 mb-6">
            Enter your assigned participant code to join the live session.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputCode.trim()) loginStudent(inputCode);
            }}
            className="w-full space-y-4"
          >
            <div className="text-left">
              <label
                htmlFor="student-login-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Participant Secret Code
              </label>
              <input
                id="student-login-input"
                type="text"
                autoFocus
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter Student Code"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-center font-mono font-bold text-lg bg-gray-50 focus:bg-white tracking-widest"
              />
            </div>

            {loginError && (
              <div
                role="alert"
                className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-center animate-in shake"
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Connect Profile</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security status notice */}
          <div className="mt-6 pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
            <span
              className={`w-2 h-2 rounded-full ${
                settings.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>
              {settings.isLive
                ? 'Teacher live broadcast is ACTIVE'
                : 'Teacher transmitter is currently OFFLINE'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: READY
  if (studentStep === 'READY') {
    return (
      <div className="min-h-screen bg-[#F7F2FA] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 flex flex-col items-center text-center">
          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Classroom Synchronized!</span>
          </div>

          <h2 className="text-2xl font-black text-[#1C1B1F]">
            Welcome, {currentStudent?.name}!
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1 mb-5">
            Student Profile Verified
          </p>

          {/* Anti-Cheating & Integrity Notice */}
          <div className="w-full p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Anti-Cheating Security Enforced</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Warning:</strong> Exiting the screen, switching tabs, or minimizing the window will <strong>immediately terminate your exam</strong> and submit your last recorded answers. If unanswered, a score of 0 will be recorded.
            </p>
          </div>

          {/* Quiz Host Parameters */}
          <div className="w-full p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-left space-y-2 mb-6">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Quiz Host Parameters
            </div>
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span>Time Limit:</span>
              <strong className="font-mono text-purple-900">{settings.timeLimitMinutes} Minutes</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Server Status:</span>
              <span className={settings.isLive ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                {settings.isLive ? 'Hosting Live' : 'Offline (Inactive)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Randomization:</span>
              <span className="font-semibold text-purple-700">Questions & Choices Shuffled</span>
            </div>
          </div>

          {loginError && (
            <div className="w-full text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-center mb-4">
              {loginError}
            </div>
          )}

          <button
            onClick={() => startQuiz()}
            disabled={!settings.isLive}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              settings.isLive
                ? 'bg-[#6750A4] hover:bg-[#523e85] text-white shadow-purple-200 hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{settings.isLive ? 'Enter Live Quiz Arena' : 'Quiz Not Activated Yet'}</span>
          </button>

          <button
            onClick={resetStudentState}
            className="mt-3 text-xs text-gray-500 hover:text-gray-800 font-medium"
          >
            Switch Student Profile
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: ACTIVE QUIZ ARENA (Anti-AI, Anti-Screenshot, Shuffled choices)
  if (studentStep === 'ACTIVE') {
    return (
      <div
        className="min-h-screen bg-[#F7F2FA] text-[#1C1B1F] flex flex-col pb-28 select-none relative"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {/* Anti-AI Background Security Watermark */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] overflow-hidden flex flex-wrap gap-16 p-8 items-center justify-center font-mono text-xs uppercase"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="-rotate-12 whitespace-nowrap">
              ClassNode Secure Exam • {currentStudent?.name} ({currentStudent?.code}) • Prohibited Screen Capture
            </div>
          ))}
        </div>

        {/* Screenshot / Copying Warning Toast */}
        {screenshotAttemptWarning && (
          <div
            role="alert"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-200"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{screenshotAttemptWarning}</span>
          </div>
        )}

        {/* Sticky Header with Dynamic Visual Timer Gauge and Progress */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#CAC4D0] px-4 py-3 shadow-xs">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#1C1B1F]">
                  Classroom Arena
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#6750A4]">
                  {currentStudent?.name}
                </span>
              </div>
              <div className="text-[11px] text-[#49454F] mt-0.5">
                Completed: <span className="font-bold text-[#6750A4]">{answeredCount}</span> of {totalQuestions} questions
              </div>
            </div>

            {/* Dynamic Visual Timer Progress Indicator */}
            <QuizTimerGauge
              timeRemaining={timeRemaining}
              totalSeconds={initialTotalSeconds}
            />
          </div>

          {/* Linear Progress Bar for Questions Answered */}
          <div className="max-w-3xl mx-auto mt-2.5 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#6750A4] h-full transition-all duration-300"
              style={{
                width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
              }}
            />
          </div>
        </header>

        {/* Anti-Screen Exit Warning Banner */}
        <div className="max-w-3xl w-full mx-auto px-4 pt-3">
          <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
            <EyeOff className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>Active Security Protocol:</strong> Do not switch tabs or minimize the window. Doing so will immediately submit your current progress and terminate the exam.
            </span>
          </div>
        </div>

        {/* Questions Arena Content */}
        <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-5 relative z-10">
          {activeShuffledQuestions.map((question, qIdx) => {
            const selectedOriginalIndex = studentAnswers[question.id];

            return (
              <div
                key={question.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CAC4D0] shadow-xs"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-[#6750A4] tracking-wide">
                    QUESTION {qIdx + 1} OF {totalQuestions}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F3EDF7] text-[#6750A4]">
                    {question.categoryTag || 'General'}
                  </span>
                </div>

                {/* Question Text (Stem) */}
                <h3 className="text-base sm:text-lg font-bold text-[#1C1B1F] leading-snug">
                  {question.text}
                </h3>

                {/* Media Graphic in Question Stem */}
                {question.imageUri && (
                  <QuestionMedia
                    imageUri={question.imageUri}
                    altText={`Figure for Question ${qIdx + 1}: ${question.text}`}
                  />
                )}

                {/* Shuffled Choices (Randomized for every student) */}
                <div className="mt-4 space-y-2">
                  {question.shuffledChoices.map((choice, optIdx) => {
                    const isSelected = selectedOriginalIndex === choice.originalIndex;
                    return (
                      <button
                        key={choice.originalIndex}
                        type="button"
                        onClick={() => saveAnswer(question.id, choice.originalIndex)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#E8DEF8] border-[#6750A4] shadow-xs'
                            : 'bg-gray-50/50 hover:bg-gray-100/70 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'border-[#6750A4] bg-[#6750A4]'
                              : 'border-gray-400 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span
                          className={`text-xs sm:text-sm ${
                            isSelected ? 'font-bold text-[#21005D]' : 'font-medium'
                          }`}
                        >
                          {choice.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Submit Action Card */}
          <div className="p-4 bg-white rounded-3xl border border-[#CAC4D0] shadow-xs text-center space-y-3">
            <p className="text-xs text-gray-500">
              You have completed <span className="font-bold text-[#6750A4]">{answeredCount}</span> of {totalQuestions} questions.
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-4 rounded-2xl bg-[#6750A4] hover:bg-[#523e85] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Submit All Answers
            </button>
          </div>
        </main>

        {/* Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-[#6750A4] flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Submit Quiz?</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                {answeredCount < totalQuestions ? (
                  <span className="text-amber-600 font-semibold block">
                    You have {totalQuestions - answeredCount} unanswered questions!
                  </span>
                ) : (
                  'All questions answered!'
                )}
                Are you ready to submit your exam to the classroom server?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  Review
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    submitStudentQuiz();
                  }}
                  className="py-2.5 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white text-xs font-semibold shadow-md"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STEP 4: COMPLETED (Shows normal celebration OR termination alert)
  return (
    <div className="min-h-screen bg-[#F7F2FA] text-[#1C1B1F] flex flex-col justify-center items-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 flex flex-col items-center text-center">
        {/* Early Termination Alert if screen exit occurred */}
        {earlyTerminationReason ? (
          <div className="w-full p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-left mb-6 shadow-xs">
            <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm mb-1.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>EXAM TERMINATED AUTOMATICALLY</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed mb-3">
              Screen exit, window hide, or tab switch was detected while the quiz was active. Under security rules, the exam was immediately ended and your last answered question stem was submitted. If no questions were answered, a final mark of 0 was recorded.
            </p>
            <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs space-y-1">
              <div className="font-bold text-gray-700 flex items-center justify-between">
                <span>Last Answered Stem:</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {studentScore === 0 && answeredCount === 0 ? 'Mark: 0' : `Score: ${studentScore}`}
                </span>
              </div>
              <div className="text-rose-900 font-mono text-[11px] font-medium leading-normal break-words">
                {submissions[0]?.lastAnsweredStem || (answeredCount === 0 ? 'No answers recorded (Mark: 0)' : 'Answers recorded')}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1B1F]">
          {earlyTerminationReason ? 'Exam Concluded' : 'Quiz Submitted Successfully!'}
        </h2>
        <p className="text-xs text-[#49454F] mt-1 mb-6">
          Results synced to host classroom successfully.
        </p>

        {/* Score Card */}
        <div className={`w-full p-6 rounded-3xl border flex flex-col items-center mb-6 ${
          earlyTerminationReason
            ? 'bg-rose-50/70 border-rose-200'
            : 'bg-[#EADDFF] border-[#D0BCFF]'
        }`}>
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
            Your Final Score
          </span>
          <div className="text-5xl font-black text-[#1C1B1F] my-1 font-mono">
            {studentScore} / {totalQuestions}
          </div>
          <div className="text-sm font-bold text-gray-700 mt-1">
            Success Rate: {calculatePercentage(studentScore, totalQuestions)}%
          </div>
        </div>

        {/* Question-by-Question Review */}
        <div className="w-full text-left space-y-3 mb-6">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Review Submitted Answers
          </h4>
          <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {activeShuffledQuestions.map((q, idx) => {
              const studentChoice = studentAnswers[q.id];
              const isCorrect = studentChoice !== undefined && studentChoice === q.correctAnswerIndex;
              const rawChoices = [q.choice1, q.choice2, q.choice3, q.choice4, q.choice5].filter(Boolean);

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border text-xs ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-rose-50/70 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-[#1C1B1F]">Q{idx + 1}: {q.text}</span>
                    <span className="shrink-0 flex items-center gap-1">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> {studentChoice !== undefined ? 'Incorrect' : 'Unanswered'}
                        </span>
                      )}
                    </span>
                  </div>

                  {q.imageUri && (
                    <div className="my-2">
                      <QuestionMedia imageUri={q.imageUri} allowZoom={false} />
                    </div>
                  )}

                  <div className="space-y-0.5 text-[11px]">
                    <div className="text-gray-600">
                      Your answer:{' '}
                      <span className="font-semibold text-gray-900">
                        {studentChoice !== undefined ? rawChoices[studentChoice] || 'No answer' : 'No answer recorded'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="text-emerald-700 font-semibold">
                        Correct answer: {rawChoices[q.correctAnswerIndex]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            resetStudentState();
            navigateToRole('CHOOSE_ROLE');
          }}
          className="w-full py-3.5 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white font-bold text-sm shadow-md transition-all"
        >
          Return to Hub
        </button>
      </div>
    </div>
  );
};
