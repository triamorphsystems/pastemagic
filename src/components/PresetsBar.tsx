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
}) => {
  return (
    <div className="bg-white dark:bg-[#141415] border-b border-neutral-200/80 dark:border-neutral-800/80 py-2 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Preset Items */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none w-full sm:w-auto">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 mr-2 shrink-0 font-normal">
            Presets
          </span>

          {PRESETS.map((preset) => {
            const Icon = ICONS_MAP[preset.icon] || FileText;
            const isSelected = currentPresetId === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                title={preset.description}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle Custom Granular Filters button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleCustomFilters}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
              showCustomFilters
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium'
                : 'text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Rules</span>
            {currentPresetId === 'custom' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
