import React from 'react';
import { X } from 'lucide-react';

interface ShortcutsModalProps {
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Ctrl + V / ⌘ + V', desc: 'Paste into raw input' },
    { key: 'Ctrl + Enter / ⌘ + Enter', desc: 'Copy formatted rich text' },
    { key: 'Alt + M', desc: 'Copy clean Markdown' },
    { key: 'Alt + H', desc: 'Copy clean HTML' },
    { key: 'Alt + T', desc: 'Copy plain text' },
    { key: 'Alt + C', desc: 'Clear raw input' },
    { key: 'Esc', desc: 'Close open dialogs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#19191b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-sm w-full p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
            Keyboard shortcuts
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.75]" />
          </button>
        </div>

        <div className="space-y-1.5">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/80 text-xs"
            >
              <span className="text-neutral-600 dark:text-neutral-400">
                {s.desc}
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white font-medium text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
