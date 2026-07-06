import React, { useState, useEffect } from 'react';
import { Database, X } from 'lucide-react';

interface ApiConfigModalProps {
  showModal: boolean;
  onClose: () => void;
  currentApiUrl: string;
  onSaveApiUrl: (url: string) => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  showModal,
  onClose,
  currentApiUrl,
  onSaveApiUrl
}) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(currentApiUrl);
  }, [currentApiUrl, showModal]);

  if (!showModal) return null;

  const handleSave = () => {
    onSaveApiUrl(url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Koneksi Google Sheets
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Masukkan URL Web App hasil Deploy Google Apps Script Anda untuk sinkronisasi database Google Sheets yang sesungguhnya.
        </p>
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Web App URL (Google Apps Script)
          </label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Simpan & Hubungkan
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
