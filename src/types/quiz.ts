export interface QuizSettings {
  id: number;
  isLive: boolean;
  timeLimitMinutes: number;
  masterPin: string;
}

export interface Question {
  id: number;
  text: string;
  categoryTag: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  choice5: string;
  correctAnswerIndex: number; // 0 to 4
  imageUri?: string | null;
}

export interface ShuffledChoice {
  text: string;
  originalIndex: number;
}

export interface ShuffledQuestion extends Question {
  shuffledChoices: ShuffledChoice[];
}

export interface Student {
  code: string;
  name: string;
}

export interface QuizSubmission {
  id: number;
  studentCode: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
  selectedAnswers?: Record<number, number>; // questionId -> chosen original option index
  violation?: string | null;
  terminatedEarly?: boolean;
  lastAnsweredStem?: string | null;
  lastAnsweredStemIndex?: number | null;
}

export interface TeacherAccount {
  id: number;
  name: string;
  accessCode: string;
  createdAt: number;
}

export type StudentStep = 'LOGIN' | 'READY' | 'ACTIVE' | 'COMPLETED';

export type AppRole = 'CHOOSE_ROLE' | 'TEACHER' | 'STUDENT';
