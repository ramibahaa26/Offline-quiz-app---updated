import React, { useState } from 'react';
import { HelpCircle, Image as ImageIcon, X, Trash2, CheckCircle2 } from 'lucide-react';
import { useQuiz } from '../context/QuizContext.tsx';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['General', 'Math', 'Science', 'History', 'Art', 'Geography', 'Chemistry'];

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ isOpen, onClose }) => {
  const { addQuestion } = useQuiz();
  const [category, setCategory] = useState('General');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [choice1, setChoice1] = useState('');
  const [choice2, setChoice2] = useState('');
  const [choice3, setChoice3] = useState('');
  const [choice4, setChoice4] = useState('');
  const [choice5, setChoice5] = useState('');
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageUri(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError('Question text cannot be empty.');
      return;
    }

    if (!choice1.trim() || !choice2.trim()) {
      setError('At least the first 2 answer choices must be populated.');
      return;
    }

    // Verify chosen correct answer isn't blank
    const choices = [choice1, choice2, choice3, choice4, choice5];
    if (!choices[correctAnswerIndex] || !choices[correctAnswerIndex].trim()) {
      setError('The marked correct answer choice cannot be empty.');
      return;
    }

    addQuestion({
      text: text.trim(),
      categoryTag: category,
      choice1: choice1.trim(),
      choice2: choice2.trim(),
      choice3: choice3.trim(),
      choice4: choice4.trim(),
      choice5: choice5.trim(),
      correctAnswerIndex,
      imageUri,
    });

    // Reset
    setText('');
    setImageUri(null);
    setChoice1('');
    setChoice2('');
    setChoice3('');
    setChoice4('');
    setChoice5('');
    setCorrectAnswerIndex(0);
    setCategory('General');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-question-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-purple-100 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8DEF8] flex items-center justify-center text-[#6750A4]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="add-question-title" className="text-lg sm:text-xl font-bold text-[#1C1B1F]">
                Compile Host Question
              </h2>
              <p className="text-xs text-gray-500">
                Register a new challenge into the offline classroom database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Subject Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-[#6750A4] text-white shadow-xs'
                      : 'bg-[#F3EDF7] text-[#49454F] hover:bg-[#E8DEF8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label htmlFor="q-text" className="block text-xs font-semibold text-gray-700 mb-1">
              Question Text *
            </label>
            <textarea
              id="q-text"
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. What is the powerhouse of the cell?"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-sm bg-gray-50 focus:bg-white resize-none"
            />
          </div>

          {/* Image Attachment (Simulates Multer disk storage) */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#6750A4] flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Question Image (Offline File)
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {imageUri ? 'Attachment linked' : 'Optional reference graphic'}
                  </p>
                </div>
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-[#6750A4] hover:bg-[#523e85] text-white rounded-lg text-xs font-medium shadow-xs transition-colors">
                Attach File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {imageUri && (
              <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200 max-h-40 bg-black/5 flex items-center justify-center">
                <img
                  src={imageUri}
                  alt="Attachment preview"
                  className="max-h-40 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setImageUri(null)}
                  aria-label="Remove attached image"
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Answer choices (up to 5) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">
                Answer Choices (Select the radio of the correct choice) *
              </label>
              <span className="text-[11px] text-gray-500">Min 2 required</span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Choice 1', val: choice1, set: setChoice1, idx: 0 },
                { label: 'Choice 2', val: choice2, set: setChoice2, idx: 1 },
                { label: 'Choice 3', val: choice3, set: setChoice3, idx: 2 },
                { label: 'Choice 4', val: choice4, set: setChoice4, idx: 3 },
                { label: 'Choice 5', val: choice5, set: setChoice5, idx: 4 },
              ].map((item) => (
                <div
                  key={item.idx}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                    correctAnswerIndex === item.idx
                      ? 'border-[#6750A4] bg-purple-50/50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <label className="flex items-center cursor-pointer pl-1">
                    <input
                      type="radio"
                      name="correct_answer_choice"
                      checked={correctAnswerIndex === item.idx}
                      onChange={() => setCorrectAnswerIndex(item.idx)}
                      className="w-4 h-4 text-[#6750A4] focus:ring-[#6750A4]"
                    />
                  </label>
                  <input
                    type="text"
                    value={item.val}
                    onChange={(e) => item.set(e.target.value)}
                    placeholder={`${item.label} ${item.idx === 0 ? '(e.g. Mitochondria)' : ''}`}
                    className="w-full px-3 py-1.5 rounded-lg border border-transparent focus:border-gray-300 focus:bg-white text-xs bg-transparent focus:outline-hidden"
                  />
                  {correctAnswerIndex === item.idx && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Correct
                    </span>
                  )}
                </div>
              ))}
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

          {/* Dialog Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Add to Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
