import React from 'react';
import { Info, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast.show) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        );
      case 'error':
        return (
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        );
      case 'warning':
        return (
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
            <Info className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div
      id="toast"
      className="fixed top-5 right-5 z-50 transition-all duration-300 max-w-sm w-full bg-white border border-purple-500/30 shadow-2xl rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4"
    >
      {renderIcon()}
      <div className="flex-1">
        <h4 className="font-bold text-sm text-slate-800">{toast.title}</h4>
        <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
      </div>
      <div className="flex-shrink-0">
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
