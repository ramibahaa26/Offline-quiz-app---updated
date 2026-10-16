import type {
  Question,
  Student,
  QuizSubmission,
  TeacherAccount,
  ShuffledChoice,
  ShuffledQuestion,
} from '../types/quiz.ts';

export function getChoicesList(question: Question): string[] {
  return [
    question.choice1,
    question.choice2,
    question.choice3,
    question.choice4,
    question.choice5,
  ].filter((c) => c && c.trim().length > 0);
}

export function shuffleArray<T>(array: T[], seedRandom?: () => number): T[] {
  const result = [...array];
  const rand = seedRandom || Math.random;
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function shuffleQuestions<T>(array: T[], seedRandom?: () => number): T[] {
  return shuffleArray(array, seedRandom);
}

/**
 * Prepares the exam for a student by shuffling both:
 * 1. The order of questions (Fisher-Yates)
 * 2. The order of answer choices for each question (Fisher-Yates)
 * Each choice tracks its originalIndex so the correct answer is accurately graded.
 */
export function prepareStudentExam(
  questions: Question[],
  seedRandom?: () => number
): ShuffledQuestion[] {
  const shuffledQList = shuffleArray(questions, seedRandom);

  return shuffledQList.map((q) => {
    const rawChoices = [
      { text: q.choice1, originalIndex: 0 },
      { text: q.choice2, originalIndex: 1 },
      { text: q.choice3, originalIndex: 2 },
      { text: q.choice4, originalIndex: 3 },
      { text: q.choice5, originalIndex: 4 },
    ].filter((c) => c.text && c.text.trim().length > 0);

    const shuffledChoices = shuffleArray(rawChoices, seedRandom);

    return {
      ...q,
      shuffledChoices,
    };
  });
}

/**
 * Calculates score based on the student's answers map (questionId -> chosen originalIndex).
 */
export function calculateScore(
  questions: (Question | ShuffledQuestion)[],
  answers: Record<number, number>
): number {
  let score = 0;
  for (const question of questions) {
    const selectedOriginalIndex = answers[question.id];
    if (
      selectedOriginalIndex !== undefined &&
      selectedOriginalIndex === question.correctAnswerIndex
    ) {
      score += 1;
    }
  }
  return score;
}

export function calculatePercentage(score: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((score / total) * 100);
}

export function verifyTeacherAccess(
  codeOrPin: string,
  masterPin: string,
  teacherAccounts: TeacherAccount[]
): { valid: boolean; teacherName?: string } {
  const clean = codeOrPin.trim();
  if (!clean) return { valid: false };

  // Master Key: default 1998123450 as requested by user
  if (clean === masterPin.trim() || clean === '1998123450') {
    return { valid: true, teacherName: 'Master Admin' };
  }

  // Check against registered teacher accounts
  const match = teacherAccounts.find(
    (t) => t.accessCode.trim().toLowerCase() === clean.toLowerCase()
  );
  if (match) {
    return { valid: true, teacherName: match.name };
  }

  return { valid: false };
}

export function getLastAnsweredStem(
  questions: ShuffledQuestion[],
  answers: Record<number, number>
): { stemIndex: number; stemText: string; questionText: string } | null {
  for (let i = questions.length - 1; i >= 0; i--) {
    const q = questions[i];
    if (answers[q.id] !== undefined) {
      const selectedChoice = q.shuffledChoices.find(
        (c) => c.originalIndex === answers[q.id]
      );
      return {
        stemIndex: i + 1,
        questionText: q.text,
        stemText: `Question ${i + 1}: "${q.text}" (Choice: "${selectedChoice?.text || ''}")`,
      };
    }
  }
  return null;
}

export function findStudentByCode(
  code: string,
  students: Student[]
): Student | null {
  const clean = code.trim().toLowerCase();
  if (!clean) return null;
  return (
    students.find((s) => s.code.trim().toLowerCase() === clean) || null
  );
}

export function generateTeacherCode(prefix = 'TCH'): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export function getStudentInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function exportToCsvContent(
  submissions: QuizSubmission[],
  totalQuestions: number
): string {
  const rows: string[] = [];
  rows.push(
    'Student Code,Name,Score,Total Questions,Success Rate,Status / Integrity,Last Answered Stem,Date Completed'
  );

  for (const sub of submissions) {
    const date = new Date(sub.timestamp).toLocaleString();
    const safeName = sub.studentName.replace(/"/g, '""');
    const rate = calculatePercentage(sub.score, sub.totalQuestions || totalQuestions);
    const status = sub.violation
      ? `Terminated (${sub.violation})`
      : sub.terminatedEarly
      ? 'Terminated Early'
      : 'Completed Normally';

    const safeStem = (
      sub.lastAnsweredStem ||
      (sub.violation ? 'None (Mark 0)' : 'All Stems Completed')
    ).replace(/"/g, '""');

    rows.push(
      `"${sub.studentCode}","${safeName}",${sub.score},${sub.totalQuestions || totalQuestions},"${rate}%","${status}","${safeStem}","${date}"`
    );
  }

  const totalStudents = submissions.length;
  const avgScore =
    totalStudents > 0
      ? (submissions.reduce((acc, s) => acc + s.score, 0) / totalStudents).toFixed(2)
      : '0.00';
  const avgRate =
    totalStudents > 0 && totalQuestions > 0
      ? ((parseFloat(avgScore) / totalQuestions) * 100).toFixed(1)
      : '0.0';

  const passingStudents = submissions.filter(
    (s) => s.score / (s.totalQuestions || totalQuestions || 1) >= 0.5
  ).length;
  const passRate = totalStudents > 0 ? ((passingStudents / totalStudents) * 100).toFixed(1) : '0.0';

  const violationsCount = submissions.filter((s) => !!s.violation).length;

  rows.push('');
  rows.push('SUMMARY METRICS');
  rows.push(`Total Submissions,${totalStudents}`);
  rows.push(`Average Score,${avgScore} / ${totalQuestions} (${avgRate}%)`);
  rows.push(`Pass Rate (>=50%),${passRate}% (${passingStudents}/${totalStudents})`);
  rows.push(`Integrity Violations Detected,${violationsCount}`);

  return rows.join('\n');
}
