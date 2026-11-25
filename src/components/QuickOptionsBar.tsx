import React from 'react';
import { FilterOptions } from '../types';
import { PRESETS, Preset } from '../utils/presets';
import { SlidersHorizontal, RotateCcw, CheckSquare, Sparkles } from 'lucide-react';

interface QuickOptionsBarProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
  currentPresetId: string;
  onSelectPreset: (preset: Preset) => void;
  onReset: () => void;
  showAllRules: boolean;
  onToggleAllRules: () => void;
}

export const QuickOptionsBar: React.FC<QuickOptionsBarProps> = ({
  options,
  onChange,
  currentPresetId,
  onSelectPreset,
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

  return (
    <div className="bg-white dark:bg-[#19191b] border border-neutral-200/90 dark:border-neutral-800/90 rounded-xl p-3.5 shadow-2xs transition-colors">
      {/* Top Header: Presets and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-neutral-100 dark:border-neutral-800/70">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-1">
            Presets:
          </span>
          {PRESETS.map((preset) => {
            const isSelected = currentPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Reset options to default"
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
            <span>{showAllRules ? 'Hide extra rules' : 'More rules'}</span>
          </button>
        </div>
      </div>

      {/* Checkboxes Row */}
      <div className="space-y-2">
        {/* Row 1: What to Keep */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider min-w-[45px]">
            Keep:
          </span>

          <Checkbox
            label="Bold"
            checked={options.keepBold}
            onChange={() => toggle('keepBold')}
          />
          <Checkbox
            label="Italic"
            checked={options.keepItalic}
            onChange={() => toggle('keepItalic')}
          />
          <Checkbox
            label="Underline"
            checked={options.keepUnderline}
            onChange={() => toggle('keepUnderline')}
          />
          <Checkbox
            label="Headings"
            checked={options.keepHeadings}
            onChange={() => toggle('keepHeadings')}
          />
          <Checkbox
            label="Lists (ul/ol)"
            checked={options.keepUnorderedLists && options.keepOrderedLists}
            onChange={() => {
              const next = !(options.keepUnorderedLists && options.keepOrderedLists);
              onChange({
                ...options,
                keepUnorderedLists: next,
                keepOrderedLists: next,
              });
            }}
          />
          <Checkbox
            label="Tables"
            checked={options.keepTables}
            onChange={() => toggle('keepTables')}
          />
          <Checkbox
            label="Links"
            checked={options.keepLinks}
            onChange={() => toggle('keepLinks')}
          />
          <Checkbox
            label="Code blocks"
            checked={options.keepCodeBlocks}
            onChange={() => toggle('keepCodeBlocks')}
          />
        </div>

        {/* Row 2: What to Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider min-w-[45px]">
            Strip:
          </span>

          <Checkbox
            label="Custom fonts"
            checked={options.stripFontFamily}
            onChange={() => toggle('stripFontFamily')}
          />
          <Checkbox
            label="Font sizes"
            checked={options.stripFontSize}
            onChange={() => toggle('stripFontSize')}
          />
          <Checkbox
            label="Text colors"
            checked={options.stripTextColor}
            onChange={() => toggle('stripTextColor')}
          />
          <Checkbox
            label="Highlight backgrounds"
            checked={options.stripBackgroundColor}
            onChange={() => toggle('stripBackgroundColor')}
          />
          <Checkbox
            label="Tracking (UTM/fbclid)"
            checked={options.stripTrackingParams}
            onChange={() => toggle('stripTrackingParams')}
          />
          <Checkbox
            label="Curly smart quotes"
            checked={options.straightenQuotes}
            onChange={() => toggle('straightenQuotes')}
          />
          <Checkbox
            label="Word/Docs cruft"
            checked={options.stripWordDocsArtifacts}
            onChange={() => toggle('stripWordDocsArtifacts')}
          />
        </div>
      </div>
    </div>
  );
};

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="inline-flex items-center gap-1.5 cursor-pointer select-none group py-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 accent-neutral-900 dark:accent-neutral-200 cursor-pointer focus:ring-0 focus:ring-offset-0"
      />
      <span
        className={`text-xs transition-colors ${
          checked
            ? 'text-neutral-900 dark:text-neutral-100 font-medium'
            : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
        }`}
      >
        {label}
      </span>
    </label>
  );
};
