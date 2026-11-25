import React from 'react';
import { PRESETS, Preset } from '../utils/presets';
import { FilterOptions } from '../types';
import {
  FileText,
  Code2,
  Feather,
  Link as LinkIcon,
  Type,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

interface PresetsBarProps {
  currentPresetId: string;
  onSelectPreset: (preset: Preset) => void;
  showCustomFilters: boolean;
  onToggleCustomFilters: () => void;
  filterOptions: FilterOptions;
}

const ICONS_MAP: Record<string, React.FC<{ className?: string }>> = {
  FileText,
  Code2,
  Feather,
  Link: LinkIcon,
  Type,
};

export const PresetsBar: React.FC<PresetsBarProps> = ({
  currentPresetId,
  onSelectPreset,
  showCustomFilters,
  onToggleCustomFilters,
  filterOptions,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Preset Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            Presets:
          </span>

          {PRESETS.map((preset) => {
            const Icon = ICONS_MAP[preset.icon] || FileText;
            const isSelected = currentPresetId === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                title={preset.description}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{preset.name}</span>
                {preset.badge && !isSelected && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.2 rounded-full font-semibold">
                    {preset.badge}
                  </span>
                )}
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Toggle Custom Granular Filters button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleCustomFilters}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              showCustomFilters
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Rules</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                showCustomFilters
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-900'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              }`}
            >
              {currentPresetId === 'custom' ? 'Custom' : 'Active'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

