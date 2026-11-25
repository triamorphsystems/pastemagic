import React from 'react';
import {
  FileText,
  Sun,
  Moon,
  History,
  Keyboard,
  Sparkles,
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
    <header className="border-b border-slate-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-[#111318]/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-neutral-100">
              PasteMagic
            </span>
            <span className="text-[11px] text-slate-500 dark:text-neutral-400">
              Paste without unwanted styling
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Segmented Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200/80 dark:border-neutral-700/80 text-xs">
            <button
              onClick={() => setDarkMode(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                !darkMode
                  ? 'bg-white text-slate-900 font-medium shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="Light theme"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 stroke-[2]" />
              <span className="text-xs">Light</span>
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                darkMode
                  ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="Dark theme"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-300 stroke-[2]" />
              <span className="text-xs">Dark</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-neutral-800 mx-0.5" />

          {/* Shortcuts */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Keyboard className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            title="Recent clips"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer relative"
          >
            <History className="w-4 h-4 stroke-[1.75]" />
            {historyCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
