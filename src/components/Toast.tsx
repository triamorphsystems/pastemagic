import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2400);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-normal shadow-md">
        <span>{toast.text}</span>
        <button
          onClick={onDismiss}
          className="ml-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X className="w-3 h-3 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
