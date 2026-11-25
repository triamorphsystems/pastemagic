import React from 'react';
import { SanitizerStats } from '../types';
import { X, CheckCircle2, ShieldAlert, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface StatsModalProps {
  stats: SanitizerStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Sanitization Report
              </h3>
              <p className="text-xs text-slate-400">
                Detailed breakdown of removed styles, junk tags, and tracking code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Size Reduction
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.reductionPercentage}%
              </span>
              <span className="text-xs text-slate-500">lighter</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.charactersSaved.toLocaleString()} bloated chars removed
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Style Rules Stripped
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.stylesStrippedCount}
              </span>
              <span className="text-xs text-slate-500">rules</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Fonts, colors, heights & margins
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Tracking Parameters
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {stats.trackingParamsRemovedCount}
              </span>
              <span className="text-xs text-slate-500">cleaned</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              UTM, Facebook & Google click IDs
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Elements Processed
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-violet-600 dark:text-violet-400">
                {stats.tagsRemovedCount}
              </span>
              <span className="text-xs text-slate-500">tags</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Unwanted wrappers & empty spans
            </p>
          </div>
        </div>

        {/* Removed elements tags */}
        {stats.removedElementsSummary.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tags & Wrappers Stripped:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stats.removedElementsSummary.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                >
                  &lt;{tag}&gt;
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Original: {stats.originalLength.toLocaleString()} chars</span>
            <span>Clean: {stats.cleanedLength.toLocaleString()} chars</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
            <div
              className="bg-indigo-600 h-full"
              style={{
                width: `${stats.originalLength > 0 ? (stats.cleanedLength / stats.originalLength) * 100 : 100}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Close Report
        </button>
      </div>
    </div>
  );
};

