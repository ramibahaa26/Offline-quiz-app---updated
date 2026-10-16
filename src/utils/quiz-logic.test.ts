import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScore,
  calculatePercentage,
  shuffleQuestions,
  prepareStudentExam,
  verifyTeacherAccess,
  findStudentByCode,
  generateTeacherCode,
  getChoicesList,
  exportToCsvContent,
  formatTime,
  getLastAnsweredStem,
} from './quiz-logic.ts';
import type { Question, Student, QuizSubmission, TeacherAccount } from '../types/quiz.ts';

const mockQuestions: Question[] = [
  {
    id: 1,
    text: 'What is the capital of France?',
    categoryTag: 'Geography',
    choice1: 'Paris',
    choice2: 'London',
    choice3: 'Berlin',
    choice4: 'Madrid',
    choice5: 'Rome',
    correctAnswerIndex: 0,
  },
  {
    id: 2,
    text: 'Which planet is known as the Red Planet?',
    categoryTag: 'Science',
    choice1: 'Venus',
    choice2: 'Jupiter',
    choice3: 'Mars',
    choice4: 'Saturn',
    choice5: 'Mercury',
    correctAnswerIndex: 2,
  },
  {
    id: 3,
    text: 'Solve: 12 + 4 * (10 - 7)',
    categoryTag: 'Math',
    choice1: '48',
    choice2: '24',
    choice3: '36',
    choice4: '30',
    choice5: '16',
    correctAnswerIndex: 1,
  },
];

const mockStudents: Student[] = [
  { code: '1234', name: 'Ahmed' },
  { code: '5678', name: 'Sara' },
];

const mockTeachers: TeacherAccount[] = [
  { id: 1, name: 'Faculty Host', accessCode: 'TEACH123', createdAt: 1700000000000 },
  { id: 2, name: 'Dr. Roberts', accessCode: 'TCH-8421', createdAt: 1700000001000 },
];

test('calculateScore calculates correct score accurately', () => {
  // Question 1 correct (0), Question 2 correct (2), Question 3 wrong (0 instead of 1)
  const answers = { 1: 0, 2: 2, 3: 0 };
  const score = calculateScore(mockQuestions, answers);
  assert.equal(score, 2);

  // All correct
  const allCorrect = { 1: 0, 2: 2, 3: 1 };
  assert.equal(calculateScore(mockQuestions, allCorrect), 3);

  // None correct or unanswered (student exits early without answering -> mark 0)
  assert.equal(calculateScore(mockQuestions, {}), 0);
});

test('prepareStudentExam shuffles both questions and choices preserving original indices', () => {
  const prepared = prepareStudentExam(mockQuestions);
  assert.equal(prepared.length, mockQuestions.length);

  for (const q of prepared) {
    assert.ok(q.shuffledChoices.length >= 2);
    // Verify each choice has originalIndex and text
    const originalIndices = q.shuffledChoices.map((c) => c.originalIndex).sort();
    assert.deepEqual(originalIndices, [0, 1, 2, 3, 4]);

    // Grading with correct originalIndex works
    const testAnswer = { [q.id]: q.correctAnswerIndex };
    assert.equal(calculateScore([q], testAnswer), 1);
  }
});

test('calculatePercentage rounds accurately', () => {
  assert.equal(calculatePercentage(2, 4), 50);
  assert.equal(calculatePercentage(3, 4), 75);
  assert.equal(calculatePercentage(1, 3), 33);
  assert.equal(calculatePercentage(0, 0), 0);
});

test('getChoicesList filters empty choices', () => {
  const choices = getChoicesList(mockQuestions[0]);
  assert.equal(choices.length, 5);
  assert.equal(choices[0], 'Paris');
});

test('shuffleQuestions preserves all items and length', () => {
  const shuffled = shuffleQuestions(mockQuestions);
  assert.equal(shuffled.length, mockQuestions.length);
  const ids = shuffled.map((q) => q.id).sort();
  assert.deepEqual(ids, [1, 2, 3]);
});

test('verifyTeacherAccess supports Master PIN 1998123450 and teacher codes', () => {
  // Master PIN check with 1998123450
  const res1 = verifyTeacherAccess('1998123450', '1998123450', mockTeachers);
  assert.equal(res1.valid, true);
  assert.equal(res1.teacherName, 'Master Admin');

  // Teacher code check (case-insensitive)
  const res2 = verifyTeacherAccess('teach123', '1998123450', mockTeachers);
  assert.equal(res2.valid, true);
  assert.equal(res2.teacherName, 'Faculty Host');

  // Second teacher code
  const res3 = verifyTeacherAccess('TCH-8421', '1998123450', mockTeachers);
  assert.equal(res3.valid, true);
  assert.equal(res3.teacherName, 'Dr. Roberts');

  // Invalid PIN/code
  const res4 = verifyTeacherAccess('wrong-code', '1998123450', mockTeachers);
  assert.equal(res4.valid, false);

  // Blank code
  const res5 = verifyTeacherAccess('   ', '1998123450', mockTeachers);
  assert.equal(res5.valid, false);
});

test('findStudentByCode matches student codes reliably', () => {
  const s1 = findStudentByCode('1234', mockStudents);
  assert.ok(s1);
  assert.equal(s1?.name, 'Ahmed');

  const s2 = findStudentByCode(' 5678 ', mockStudents);
  assert.ok(s2);
  assert.equal(s2?.name, 'Sara');

  const s3 = findStudentByCode('9999', mockStudents);
  assert.equal(s3, null);
});

test('generateTeacherCode returns expected format', () => {
  const code = generateTeacherCode('TCH');
  assert.match(code, /^TCH-\d{4}$/);
});

test('formatTime formats seconds into MM:SS correctly', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(1800), '30:00');
  assert.equal(formatTime(-5), '00:00');
});

test('getLastAnsweredStem retrieves the last answered stem and choice correctly', () => {
  const prepared = prepareStudentExam(mockQuestions);
  // Student answered questions 1 and 2, but has not answered 3
  const answers = { [prepared[0].id]: prepared[0].correctAnswerIndex, [prepared[1].id]: prepared[1].correctAnswerIndex };
  const lastStem = getLastAnsweredStem(prepared, answers);
  assert.ok(lastStem);
  assert.equal(lastStem.stemIndex, 2);
  assert.equal(lastStem.questionText, prepared[1].text);
  assert.ok(lastStem.stemText.includes(prepared[1].text));

  // If student answered no questions
  assert.equal(getLastAnsweredStem(prepared, {}), null);
});

test('exportToCsvContent builds valid CSV table with integrity status and last answered stem', () => {
  const submissions: QuizSubmission[] = [
    {
      id: 1,
      studentCode: '1234',
      studentName: 'Ahmed',
      score: 3,
      totalQuestions: 3,
      timestamp: 1700000000000,
      terminatedEarly: false,
      lastAnsweredStem: 'All Stems Completed',
    },
    {
      id: 2,
      studentCode: '5678',
      studentName: 'Sara',
      score: 0,
      totalQuestions: 3,
      timestamp: 1700000010000,
      violation: 'Screen Exit / Tab Switch Detected',
      terminatedEarly: true,
      lastAnsweredStem: 'None (No answers - Mark 0)',
    },
  ];

  const csv = exportToCsvContent(submissions, 3);
  assert.ok(csv.includes('Student Code,Name,Score,Total Questions,Success Rate,Status / Integrity,Last Answered Stem,Date Completed'));
  assert.ok(csv.includes('"1234","Ahmed",3,3,"100%","Completed Normally","All Stems Completed"'));
  assert.ok(csv.includes('"5678","Sara",0,3,"0%","Terminated (Screen Exit / Tab Switch Detected)","None (No answers - Mark 0)"'));
  assert.ok(csv.includes('Integrity Violations Detected,1'));
});
