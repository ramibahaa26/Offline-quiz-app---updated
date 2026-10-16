import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTime } from '../utils/quiz-logic.ts';

interface QuizTimerGaugeProps {
  timeRemaining: number; // in seconds
  totalSeconds: number; // initial total duration in seconds
}

export const QuizTimerGauge: React.FC<QuizTimerGaugeProps> = ({
  timeRemaining,
  totalSeconds,
}) => {
  const safeTotal = totalSeconds > 0 ? totalSeconds : 1800;
  const clampedRemaining = Math.max(0, Math.min(timeRemaining, safeTotal));
  const progressRatio = clampedRemaining / safeTotal;
  const progressPercent = Math.round(progressRatio * 100);

  const isUrgent = clampedRemaining <= 60 || progressRatio < 0.15;
  const isWarning = !isUrgent && progressRatio < 0.35;

  // Colors based on time remaining
  const colorScheme = isUrgent
    ? {
        border: 'border-rose-400',
        bg: 'bg-rose-50 text-rose-700',
        ring: '#EF4444',
        track: '#FFE4E6',
        badge: 'bg-rose-600 text-white',
      }
    : isWarning
    ? {
        border: 'border-amber-400',
        bg: 'bg-amber-50 text-amber-800',
        ring: '#F59E0B',
        track: '#FEF3C7',
        badge: 'bg-amber-600 text-white',
      }
    : {
        border: 'border-[#D0BCFF]',
        bg: 'bg-[#EADDFF] text-[#21005D]',
        ring: '#6750A4',
        track: '#EADDFF',
        badge: 'bg-[#6750A4] text-white',
      };

  // Circular gauge SVG parameters
  const size = 44;
  const strokeWidth = 4;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(clampedRemaining)}`}
      className={`px-3 py-1.5 rounded-2xl border ${colorScheme.border} ${colorScheme.bg} flex items-center gap-2.5 shadow-xs transition-colors duration-300 ${
        isUrgent ? 'animate-pulse' : ''
      }`}
    >
      {/* Circular Gauge */}
      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
        <svg
          className="w-9 h-9 -rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={colorScheme.track}
            strokeWidth={strokeWidth}
          />
          {/* Animated Dynamic Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={colorScheme.ring}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {isUrgent ? (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 absolute" />
        ) : (
          <Clock className="w-3.5 h-3.5 text-current absolute" />
        )}
      </div>

      {/* Digital Time & Percentage */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-sm sm:text-base tracking-tight leading-none">
            {formatTime(clampedRemaining)}
          </span>
          <span className="text-[10px] font-semibold opacity-75 hidden sm:inline">
            left
          </span>
        </div>
        <div className="text-[9px] font-bold opacity-75 mt-0.5 flex items-center gap-1">
          <span>{progressPercent}% time remaining</span>
        </div>
      </div>
    </div>
  );
};
