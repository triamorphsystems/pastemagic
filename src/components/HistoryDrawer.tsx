import React from 'react';
import { X, Trash2, Clock, ArrowRight } from 'lucide-react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  snippet: string;
  html: string;
  cleanText: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClearAll: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClearAll,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white dark:bg-[#141415] border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400 stroke-[1.75]" />
            <h3 className="font-medium text-xs text-neutral-900 dark:text-neutral-100">
              Recent clips
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              ({history.length})
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 font-mono">
          Stored locally in your browser
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <p className="text-xs text-neutral-500">
                No recent clips
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="group p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-[#19191b] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center gap-2">
                    <span>{item.cleanText.length} chars</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-neutral-700 dark:hover:text-neutral-200 transition-opacity"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3 h-3 stroke-[1.75]" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2 font-mono">
                  {item.snippet || 'Empty snippet'}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                  <span>Restore clip</span>
                  <ArrowRight className="w-3 h-3 stroke-[1.75]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
