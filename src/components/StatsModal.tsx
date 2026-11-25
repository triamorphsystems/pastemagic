import React from 'react';
import { SanitizerStats } from '../types';
import { X } from 'lucide-react';

interface StatsModalProps {
  stats: SanitizerStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#19191b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-5 shadow-lg space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              Sanitization report
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Removed inline styles, junk tags, and tracking code
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
            <span className="text-xs text-neutral-500 font-normal">
              Size reduction
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 tabular-nums font-mono">
                {stats.reductionPercentage}%
              </span>
              <span className="text-xs text-neutral-400 font-mono">smaller</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 font-mono tabular-nums">
              {stats.charactersSaved.toLocaleString()} chars removed
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
            <span className="text-xs text-neutral-500 font-normal">
              Styles stripped
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 tabular-nums font-mono">
                {stats.stylesStrippedCount}
              </span>
              <span className="text-xs text-neutral-400 font-mono">rules</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Fonts, colors, heights & margins
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
            <span className="text-xs text-neutral-500 font-normal">
              Tracking queries
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 tabular-nums font-mono">
                {stats.trackingParamsRemovedCount}
              </span>
              <span className="text-xs text-neutral-400 font-mono">tags</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              UTM, Facebook & Google click IDs
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
            <span className="text-xs text-neutral-500 font-normal">
              Elements stripped
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 tabular-nums font-mono">
                {stats.tagsRemovedCount}
              </span>
              <span className="text-xs text-neutral-400 font-mono">tags</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Wrappers and empty spans
            </p>
          </div>
        </div>

        {/* Removed tags summary */}
        {stats.removedElementsSummary.length > 0 && (
          <div>
            <span className="text-xs text-neutral-500 block mb-1.5">
              Tags stripped:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {stats.removedElementsSummary.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                >
                  &lt;{tag}&gt;
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-neutral-500 font-mono">
            <span>Original: {stats.originalLength.toLocaleString()}</span>
            <span>Clean: {stats.cleanedLength.toLocaleString()}</span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex">
            <div
              className="bg-neutral-900 dark:bg-neutral-100 h-full"
              style={{
                width: `${stats.originalLength > 0 ? (stats.cleanedLength / stats.originalLength) * 100 : 100}%`,
              }}
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white font-medium text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
