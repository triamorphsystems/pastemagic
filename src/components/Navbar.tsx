import React from 'react';
import {
  FileText,
  Sun,
  Moon,
  History,
  Keyboard,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenHistory: () => void;
  onOpenShortcuts: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenHistory,
  onOpenShortcuts,
  historyCount,
}) => {
  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-[#141415]/95 backdrop-blur-xs sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center">
            <FileText className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
              PasteMagic
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
              Clipboard style sanitizer
            </span>
          </div>
        </div>

        {/* Center privacy notice: quiet, clean text, no colored pills */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 stroke-[1.75]" />
          <span>Client-side only · no data leaves this browser</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Keyboard Shortcuts */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Keyboard className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            title="Recent clips"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer relative"
          >
            <History className="w-4 h-4 stroke-[1.75]" />
            {historyCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 stroke-[1.75]" />
            ) : (
              <Moon className="w-4 h-4 stroke-[1.75]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
