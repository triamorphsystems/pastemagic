import React, { useRef, useEffect } from 'react';
import {
  Clipboard,
  Trash2,
  FileCode,
  Sparkles,
  Info,
  ArrowDownToLine,
} from 'lucide-react';
import { SAMPLES } from '../utils/samples';
import { readClipboard } from '../utils/clipboard';

interface InputPaneProps {
  rawInput: string;
  onInputChange: (newRaw: string) => void;
  onClear: () => void;
  onLoadSample: (sampleId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const InputPane: React.FC<InputPaneProps> = ({
  rawInput,
  onInputChange,
  onClear,
  onLoadSample,
  onShowToast,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);

  // Sync state to editable ref when changed externally (e.g. sample load or clear)
  useEffect(() => {
    if (editableRef.current && editableRef.current.innerHTML !== rawInput) {
      editableRef.current.innerHTML = rawInput;
    }
  }, [rawInput]);

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    const contentToUse = html && html.trim() ? html : text;
    onInputChange(contentToUse);
    onShowToast('Pasted and sanitized instantly!', 'success');
  };

  const handleManualPasteClick = async () => {
    try {
      const clip = await readClipboard();
      if (!clip || (!clip.html && !clip.text)) {
        onShowToast('Clipboard is empty or access was denied.', 'info');
        return;
      }
      const content = clip.html && clip.html.trim() ? clip.html : clip.text;
      onInputChange(content);
      onShowToast('Pasted from system clipboard!', 'success');
    } catch {
      onShowToast('Press Ctrl+V / Cmd+V directly to paste.', 'info');
    }
  };

  const handleInput = () => {
    if (editableRef.current) {
      onInputChange(editableRef.current.innerHTML);
    }
  };

  const isHtml = /<\/?[a-z][\s\S]*>/i.test(rawInput);
  const inputLength = rawInput.length;
  const wordCount = rawInput
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
      {/* Pane Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Raw Input
          </h2>
          {rawInput && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {isHtml ? 'Rich HTML' : 'Plain Text'}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sample Selector */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                onLoadSample(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="" disabled>
              ⚡ Try a Sample...
            </option>
            {SAMPLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          {/* Direct Paste Button */}
          <button
            onClick={handleManualPasteClick}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 cursor-pointer transition-colors"
            title="Paste from your system clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>

          {/* Clear Button */}
          {rawInput && (
            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Clear input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 p-4 overflow-y-auto min-h-[360px] max-h-[620px] focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        {/* Placeholder overlay when empty */}
        {!rawInput && (
          <div
            onClick={() => editableRef.current?.focus()}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center cursor-text pointer-events-auto select-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
              <ArrowDownToLine className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Paste your copied text here
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Ctrl+V</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Cmd+V</kbd> to paste rich text from web pages, Word, Google Docs, or Notion.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-slate-400">or try a sample:</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadSample('messy-article');
                }}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Messy Blog Post
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadSample('word-doc');
                }}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Word Doc Cruft
              </button>
            </div>
          </div>
        )}

        {/* Contenteditable box */}
        <div
          ref={editableRef}
          contentEditable
          onPaste={handlePasteEvent}
          onInput={handleInput}
          className="min-h-full text-sm text-slate-800 dark:text-slate-200 outline-none whitespace-pre-wrap break-words"
          tabIndex={0}
        />
      </div>

      {/* Pane Footer Stats */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-3">
          <span>{inputLength.toLocaleString()} characters</span>
          <span>•</span>
          <span>{wordCount.toLocaleString()} words</span>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Pastes preserve original clipboard HTML tags for filtering</span>
        </div>
      </div>
    </div>
  );
};

