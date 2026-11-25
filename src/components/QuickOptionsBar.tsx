import React from 'react';
import { FilterOptions } from '../types';
import { RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

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
    <div className="bg-white dark:bg-[#16181d] border border-slate-200/90 dark:border-neutral-800/90 rounded-2xl p-3 shadow-xs transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Core essential checkboxes */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-neutral-500 mr-1 select-none">
            Keep:
          </span>

          <ToolbarToggle
            label="Bold"
            checked={options.keepBold}
            onChange={() => toggle('keepBold')}
          />
          <ToolbarToggle
            label="Italic"
            checked={options.keepItalic}
            onChange={() => toggle('keepItalic')}
          />
          <ToolbarToggle
            label="Underline"
            checked={options.keepUnderline}
            onChange={() => toggle('keepUnderline')}
          />
          <ToolbarToggle
            label="Lists"
            checked={areListsEnabled}
            onChange={toggleLists}
          />
          <ToolbarToggle
            label="Headings"
            checked={options.keepHeadings}
            onChange={() => toggle('keepHeadings')}
          />
          <ToolbarToggle
            label="Links"
            checked={options.keepLinks}
            onChange={() => toggle('keepLinks')}
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Reset options to default"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Reset</span>
          </button>

          <button
            onClick={onToggleAllRules}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              showAllRules
                ? 'bg-slate-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-slate-900 dark:border-neutral-100 font-medium'
                : 'text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>{showAllRules ? 'Less rules' : 'Advanced'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToolbarToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const ToolbarToggle: React.FC<ToolbarToggleProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer select-none ${
        checked
          ? 'bg-indigo-50/80 text-indigo-900 border-indigo-200/90 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800/80 shadow-2xs'
          : 'bg-transparent text-slate-500 dark:text-neutral-400 border-slate-200/70 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 hover:text-slate-800 dark:hover:text-neutral-200'
      }`}
    >
      <div
        className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
          checked
            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
            : 'border border-slate-300 dark:border-neutral-600'
        }`}
      >
        {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
      </div>
      <span>{label}</span>
    </button>
  );
};
