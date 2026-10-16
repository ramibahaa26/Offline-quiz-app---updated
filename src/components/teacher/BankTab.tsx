import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Image as ImageIcon, Layers, AlertCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext.tsx';
import { getChoicesList } from '../../utils/quiz-logic.ts';
import { AddQuestionModal } from '../AddQuestionModal.tsx';
import { QuestionMedia } from '../QuestionMedia.tsx';

const CATEGORIES = ['All', 'General', 'Math', 'Science', 'History', 'Art', 'Geography', 'Chemistry'];

export const BankTab: React.FC = () => {
  const { questions, deleteQuestion, clearAllQuestions } = useQuiz();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredQuestions =
    selectedCategory === 'All'
      ? questions
      : questions.filter(
          (q) => (q.categoryTag || 'General').toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="relative min-h-[500px] pb-24 space-y-4 animate-in fade-in duration-150">
      {/* Top Controls & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#CAC4D0] shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-[#1C1B1F] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6750A4]" />
            <span>Question Bank ({questions.length})</span>
          </h3>
          <p className="text-xs text-gray-500">
            Offline question repository stored on device
          </p>
        </div>

        <div className="flex items-center gap-2">
          {questions.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              Clear Bank
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#6750A4] hover:bg-[#523e85] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count =
            cat === 'All'
              ? questions.length
              : questions.filter(
                  (q) => (q.categoryTag || 'General').toLowerCase() === cat.toLowerCase()
                ).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#6750A4] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Question Cards List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-[#6750A4] flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-800">No Questions Found</h4>
          <p className="text-xs text-gray-500 max-w-xs mt-1 mb-4">
            {selectedCategory === 'All'
              ? 'Your question bank is empty. Tap the button below to add your first question.'
              : `No questions under the "${selectedCategory}" category.`}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#6750A4] text-white text-xs font-semibold rounded-xl"
          >
            Add Question Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const choices = getChoicesList(q);
            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-5 border border-[#CAC4D0] shadow-xs hover:border-purple-300 transition-colors"
              >
                {/* Header: Tag + Question Number + Delete */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#EADDFF] text-[#21005D] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F3EDF7] text-[#6750A4]">
                      {q.categoryTag || 'General'}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    title="Delete question"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Text */}
                <h4 className="text-sm font-bold text-[#1C1B1F] leading-snug">
                  {q.text}
                </h4>

                {/* Optional Attached Image in Question Stem */}
                {q.imageUri && (
                  <div className="mt-3">
                    <QuestionMedia
                      imageUri={q.imageUri}
                      altText={`Diagram for ${q.text}`}
                      allowZoom={true}
                    />
                  </div>
                )}

                {/* Choices list */}
                <div className="mt-3.5 space-y-1.5">
                  {choices.map((choice, cIdx) => {
                    const isCorrect = cIdx === q.correctAnswerIndex;
                    return (
                      <div
                        key={cIdx}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold'
                            : 'bg-gray-50 text-gray-700 border border-gray-100'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + cIdx)}
                        </span>
                        <span className="flex-1">{choice}</span>
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowAddModal(true)}
        aria-label="Add Question"
        className="fixed bottom-24 right-5 sm:right-8 w-14 h-14 rounded-2xl bg-[#D0BCFF] text-[#21005D] hover:bg-[#c2a7fd] shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Confirmation Modal to Clear All Questions */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Clear Question Bank?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              This will remove all {questions.length} questions from the local database.
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
                  clearAllQuestions();
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

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};
