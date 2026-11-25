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
    <header className="border-b border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#141415] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-bold">
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

        {/* Center: Global Hotkey indicator */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-800/60 px-3 py-1 rounded-full border border-neutral-200/60 dark:border-neutral-700/60">
          <span className="flex items-center gap-1 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-[10px] text-neutral-700 dark:text-neutral-300 font-semibold shadow-2xs">
              Ctrl+V
            </kbd>
            <span>Auto-Paste</span>
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">·</span>
          <span className="flex items-center gap-1 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-[10px] text-neutral-700 dark:text-neutral-300 font-semibold shadow-2xs">
              Ctrl+C
            </kbd>
            <span>Auto-Copy Clean</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Prominent Light / Dark Mode Segmented Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 text-xs">
            <button
              onClick={() => setDarkMode(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                !darkMode
                  ? 'bg-white text-neutral-900 font-medium shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="Light mode"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 stroke-[2]" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                darkMode
                  ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="Dark mode"
            >
              <Moon className="w-3.5 h-3.5 text-neutral-300 stroke-[2]" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Keyboard className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            title="Recent clips"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer relative"
          >
            <History className="w-4 h-4 stroke-[1.75]" />
            {historyCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
