import React from 'react';
import { ConfirmModalState } from '../types';

interface ConfirmModalProps {
  confirmModal: ConfirmModalState;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ confirmModal, onClose }) => {
  if (!confirmModal.show) return null;

  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800">{confirmModal.title}</h3>
        <p className="text-sm text-slate-600">{confirmModal.message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
