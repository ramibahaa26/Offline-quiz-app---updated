import React, { useState } from 'react';
import { KeyRound, X, Check } from 'lucide-react';
import { useQuiz } from '../context/QuizContext.tsx';

interface ChangeMasterPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeMasterPinModal: React.FC<ChangeMasterPinModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateMasterPin } = useQuiz();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPin.trim().length < 4) {
      setError('PIN must contain at least 4 characters/digits.');
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setError('PINs do not match. Please verify.');
      return;
    }
    const ok = updateMasterPin(newPin.trim());
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNewPin('');
        setConfirmPin('');
        onClose();
      }, 1000);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setNewPin('');
    setConfirmPin('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-pin-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100">
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#E8DEF8] flex items-center justify-center text-[#6750A4]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 id="change-pin-title" className="text-xl font-bold text-[#1C1B1F]">
              Change Master PIN
            </h2>
            <p className="text-xs text-[#49454F]">
              Current Master PIN: <span className="font-mono font-bold text-[#6750A4]">{settings.masterPin}</span>
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-800">Master PIN Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="new-pin-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                New Master PIN
              </label>
              <input
                id="new-pin-input"
                type="text"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new master PIN"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-sm bg-gray-50 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-pin-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Confirm New Master PIN
              </label>
              <input
                id="confirm-pin-input"
                type="text"
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Re-enter new master PIN"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] text-sm bg-gray-50 focus:bg-white font-mono"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-center"
              >
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#6750A4] hover:bg-[#523e85] text-white font-medium text-sm shadow-md transition-all"
              >
                Save PIN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
