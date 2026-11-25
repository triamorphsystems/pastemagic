import React, { useRef, useEffect } from 'react';
import {
  Clipboard,
  Trash2,
  ArrowDown,
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
    onShowToast('Content pasted', 'info');
  };

  const handleManualPasteClick = async () => {
    try {
      const clip = await readClipboard();
      if (!clip || (!clip.html && !clip.text)) {
        onShowToast('Clipboard is empty', 'info');
        return;
      }
      const content = clip.html && clip.html.trim() ? clip.html : clip.text;
      onInputChange(content);
      onShowToast('Pasted from clipboard', 'info');
    } catch {
      onShowToast('Use Ctrl+V or Cmd+V to paste', 'info');
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
    <div className="flex flex-col h-full bg-white dark:bg-[#19191b] border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl overflow-hidden transition-colors">
      {/* Pane Header */}
      <div className="px-4 py-2.5 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
            Raw input
          </span>
          {rawInput && (
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              {isHtml ? 'HTML' : 'Plain'}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* Sample Selector */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                onLoadSample(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="text-xs bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 cursor-pointer hover:border-neutral-400 focus:outline-none"
          >
            <option value="" disabled>
              Sample text
            </option>
            {SAMPLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          {/* Paste Button */}
          <button
            onClick={handleManualPasteClick}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Paste</span>
          </button>

          {/* Clear */}
          {rawInput && (
            <button
              onClick={onClear}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 p-4 overflow-y-auto min-h-[360px] max-h-[600px]">
        {!rawInput && (
          <div
            onClick={() => editableRef.current?.focus()}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center cursor-text select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-3">
              <ArrowDown className="w-4 h-4 stroke-[1.75]" />
            </div>
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Paste copied text here
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-xs">
              Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px]">Ctrl+V</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px]">⌘+V</kbd>
            </p>
          </div>
        )}

        <div
          ref={editableRef}
          contentEditable
          onPaste={handlePasteEvent}
          onInput={handleInput}
          className="min-h-full text-xs text-neutral-800 dark:text-neutral-200 outline-none whitespace-pre-wrap break-words font-sans leading-relaxed"
          tabIndex={0}
        />
      </div>

      {/* Pane Footer Stats */}
      <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
        <div className="flex items-center gap-2 tabular-nums">
          <span>{inputLength.toLocaleString()} chars</span>
          <span>·</span>
          <span>{wordCount.toLocaleString()} words</span>
        </div>
        <span className="text-[11px] text-neutral-400">Preserves original tags for filtering</span>
      </div>
    </div>
  );
};
