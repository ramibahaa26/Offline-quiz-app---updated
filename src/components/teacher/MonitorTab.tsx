import React, { useState } from 'react';
import {
  Play,
  Square,
  Users,
  Layers,
  Clock,
  KeyRound,
  ShieldAlert,
  UserPlus,
  Trash2,
  Copy,
  Check,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext.tsx';
import { getStudentInitials } from '../../utils/quiz-logic.ts';
import { GenerateTeacherCodeModal } from '../GenerateTeacherCodeModal.tsx';
import { ChangeMasterPinModal } from '../ChangeMasterPinModal.tsx';

export const MonitorTab: React.FC = () => {
  const {
    settings,
    setQuizLive,
    questions,
    students,
    teacherAccounts,
    revokeTeacherCode,
  } = useQuiz();

  const [inputTimer, setInputTimer] = useState(settings.timeLimitMinutes.toString());
  const [showGenModal, setShowGenModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleTimerChange = (val: string) => {
    setInputTimer(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuizLive(settings.isLive, parsed);
    }
  };

  const setPresetMinutes = (mins: number) => {
    setInputTimer(mins.toString());
    setQuizLive(settings.isLive, mins);
  };

  const handleToggleLive = () => {
    const mins = parseInt(inputTimer, 10) || 30;
    setQuizLive(!settings.isLive, mins);
  };

  const handleCopy = (code: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopiedCode(code);
          setTimeout(() => setCopiedCode(null), 2000);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
      {/* Bento Card 1: Current Session & Transmitter status */}
      <div className="rounded-3xl bg-[#EADDFF] border border-[#D0BCFF] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#21005D] tracking-wide uppercase">
              Current Session
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                settings.isLive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {settings.isLive ? 'HOSTING LIVE' : 'TRANSMITTER STOPPED'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#21005D]/80 font-medium">
            <Wifi className="w-3.5 h-3.5" />
            <span>Local Offline</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-4xl sm:text-5xl font-light text-[#21005D] tracking-tight font-mono">
              {settings.isLive
                ? `${settings.timeLimitMinutes.toString().padStart(2, '0')}:00`
                : '00:00'}
            </div>
            <p className="text-xs text-[#21005D]/70 mt-1">
              {settings.isLive
                ? `Students can join and take quiz with a ${settings.timeLimitMinutes}m limit.`
                : 'Turn transmitter ON to allow students to log in and start.'}
            </p>
          </div>

          <button
            onClick={handleToggleLive}
            className={`px-6 py-3 rounded-full font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              settings.isLive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#6750A4] hover:bg-[#523e85] text-white'
            }`}
          >
            {settings.isLive ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>End Live Quiz</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Live Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bento Row 2: Specialty Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Connected Students Card */}
        <div className="rounded-3xl bg-[#FFD8E4] p-4 sm:p-5 flex flex-col justify-between min-h-[115px] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-full bg-[#633B48] text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#633B48] bg-white/60 px-2 py-0.5 rounded-full">
              Roster
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#31111D]">
              {students.length}
            </div>
            <div className="text-[11px] font-bold text-[#633B48]/80">
              Students Registered
            </div>
          </div>
        </div>

        {/* Active Bank Count Card */}
        <div className="rounded-3xl bg-[#D3E3FD] p-4 sm:p-5 flex flex-col justify-between min-h-[115px] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-full bg-[#0842A0] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#0842A0] bg-white/60 px-2 py-0.5 rounded-full">
              Bank
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#041E49]">
              {questions.length} / 100
            </div>
            <div className="text-[11px] font-bold text-[#0842A0]/80">
              Active Questions
            </div>
          </div>
        </div>
      </div>

      {/* Bento Card 3: Classroom Broadcast Settings */}
      <div className="rounded-3xl bg-white border border-[#CAC4D0] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[#6750A4]" />
          <h3 className="text-sm font-bold text-[#1C1B1F]">
            Broadcast & Timing Settings
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="time-limit-input"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Quiz Time Limit (Minutes)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="time-limit-input"
                type="number"
                min="1"
                max="180"
                value={inputTimer}
                onChange={(e) => handleTimerChange(e.target.value)}
                className="w-32 px-3 py-2 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-sm bg-gray-50 focus:bg-white font-mono font-semibold"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                {[10, 15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setPresetMinutes(mins)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      parseInt(inputTimer, 10) === mins
                        ? 'bg-[#6750A4] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#49454F] leading-relaxed pt-1">
            <strong>Neutral Wi-Fi Broadcast Mode:</strong> All participants connect to the same local classroom access point or mobile hotspot. No external internet or cloud uplink required.
          </p>
        </div>
      </div>

      {/* Bento Card 4: Teacher Passwords & Access Control */}
      <div className="rounded-3xl bg-white border border-[#CAC4D0] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E8DEF8] flex items-center justify-center text-[#6750A4]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C1B1F]">
                Teacher Passwords & Access Control
              </h3>
              <p className="text-xs text-[#49454F]">
                Prevents students from altering question banks or timer controls
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold text-[#6750A4] bg-[#E8DEF8] rounded-full">
            {teacherAccounts.length} Staff
          </span>
        </div>

        {/* Master Admin PIN Capsule */}
        <div className="p-3.5 rounded-2xl bg-[#F3EDF7] border border-purple-100 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8DEF8] text-[#6750A4] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1D192B] flex items-center gap-2">
                <span>Master Admin PIN:</span>
                <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-white border border-purple-200 text-[#6750A4]">
                  {settings.masterPin}
                </span>
              </div>
              <div className="text-[11px] text-[#49454F]">
                Master bypass key for head administrator
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPinModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-[#6750A4] hover:bg-white rounded-lg transition-colors border border-purple-200"
          >
            Change PIN
          </button>
        </div>

        {/* Action: Generate Code */}
        <button
          onClick={() => setShowGenModal(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors mb-4"
        >
          <UserPlus className="w-4 h-4" />
          <span>Generate New Teacher Code</span>
        </button>

        {/* Staff accounts list */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Authorized Instructors
          </div>
          {teacherAccounts.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center">
              No additional teacher codes generated.
            </p>
          ) : (
            <div className="space-y-2">
              {teacherAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F2FA] border border-[#E8DEF8] hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center font-bold text-xs">
                      {getStudentInitials(account.name)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1C1B1F]">
                        {account.name}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <span>Code:</span>
                        <span className="font-mono font-bold text-[#6750A4]">
                          {account.accessCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(account.accessCode)}
                      title="Copy code"
                      className="p-1.5 text-gray-500 hover:text-[#6750A4] hover:bg-white rounded-lg transition-colors"
                    >
                      {copiedCode === account.accessCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {teacherAccounts.length > 1 && (
                      <button
                        onClick={() => revokeTeacherCode(account.id)}
                        title="Revoke code"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <GenerateTeacherCodeModal
        isOpen={showGenModal}
        onClose={() => setShowGenModal(false)}
      />
      <ChangeMasterPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
      />
    </div>
  );
};
