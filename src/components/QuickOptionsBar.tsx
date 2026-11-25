import React from 'react';
import { FilterOptions } from '../types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface QuickOptionsBarProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
  onReset: () => void;
  showAllRules: boolean;
  onToggleAllRules: () => void;
}

export const QuickOptionsBar: React.FC<QuickOptionsBarProps> = ({
  options,
  onChange,
  onReset,
  showAllRules,
  onToggleAllRules,
}) => {
  const toggle = <K extends keyof FilterOptions>(key: K) => {
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  const areListsEnabled = options.keepUnorderedLists && options.keepOrderedLists;
  const toggleLists = () => {
    const next = !areListsEnabled;
    onChange({
      ...options,
      keepUnorderedLists: next,
      keepOrderedLists: next,
    });
  };

  return (
    <div className="bg-white dark:bg-[#19191b] border border-neutral-200/90 dark:border-neutral-800/90 rounded-xl px-4 py-3 shadow-2xs transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Core essential checkboxes shown at all times */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mr-0.5">
            Keep:
          </span>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={options.keepBold}
              onChange={() => toggle('keepBold')}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span className={`text-xs ${options.keepBold ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
              Bold
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={options.keepItalic}
              onChange={() => toggle('keepItalic')}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span className={`text-xs ${options.keepItalic ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
              Italic
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={options.keepUnderline}
              onChange={() => toggle('keepUnderline')}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span className={`text-xs ${options.keepUnderline ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
              Underline
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={areListsEnabled}
              onChange={toggleLists}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span className={`text-xs ${areListsEnabled ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
              Lists
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={options.keepHeadings}
              onChange={() => toggle('keepHeadings')}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span className={`text-xs ${options.keepHeadings ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
              Headings
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={options.keepLinks}
              onChange={() => toggle('keepLinks')}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span className={`text-xs ${options.keepLinks ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
              Links
            </span>
          </label>
        </div>

        {/* Right actions: Reset and optional Advanced toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Reset to default options"
          >
            <RotateCcw className="w-3 h-3 stroke-[1.75]" />
            <span>Reset</span>
          </button>

          <button
            onClick={onToggleAllRules}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              showAllRules
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium'
                : 'text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 stroke-[1.75]" />
            <span>{showAllRules ? 'Hide advanced' : 'Advanced'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
