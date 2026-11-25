import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterOptions, SanitizerResult } from './types';
import { DEFAULT_FILTER_OPTIONS } from './utils/presets';
import { sanitizeContent } from './utils/sanitizer';
import { SAMPLES } from './utils/samples';
import { copyRichText, copyPlainText, readClipboard } from './utils/clipboard';
import { Navbar } from './components/Navbar';
import { QuickOptionsBar } from './components/QuickOptionsBar';
import { FilterControls } from './components/FilterControls';
import { InputPane } from './components/InputPane';
import { OutputPane } from './components/OutputPane';
import { StatsModal } from './components/StatsModal';
import { HistoryDrawer, HistoryItem } from './components/HistoryDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Toast, ToastMessage } from './components/Toast';

export const App: React.FC = () => {
  // Theme state: default to clean light mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pastemagic_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pastemagic_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pastemagic_theme', 'light');
    }
  }, [darkMode]);

  // Core filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [showCustomFilters, setShowCustomFilters] = useState<boolean>(false);

  // Raw input & sanitization
  const [rawInput, setRawInput] = useState<string>('');

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pastemagic_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      id: String(Date.now()),
      text,
      type,
    });
  }, []);

  // Compute Sanitization result reactively
  const sanitized: SanitizerResult = useMemo(() => {
    return sanitizeContent(rawInput, filterOptions);
  }, [rawInput, filterOptions]);

  // Save to history debounce
  useEffect(() => {
    if (!rawInput.trim() || !sanitized.cleanText.trim()) return;

    const timer = setTimeout(() => {
      const plainSnippet = sanitized.cleanText.slice(0, 100);
      const newItem: HistoryItem = {
        id: String(Date.now()),
        timestamp: Date.now(),
        snippet: plainSnippet,
        html: rawInput,
        cleanText: sanitized.cleanText,
      };

      setHistory((prev) => {
        if (prev.length > 0 && prev[0].snippet === plainSnippet) return prev;
        const updated = [newItem, ...prev.slice(0, 9)];
        localStorage.setItem('pastemagic_history', JSON.stringify(updated));
        return updated;
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [rawInput, sanitized.cleanText]);

  // Handle custom filter change
  const handleCustomFilterChange = (newOptions: FilterOptions) => {
    setFilterOptions(newOptions);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterOptions(DEFAULT_FILTER_OPTIONS);
    showToast('Reset to default options', 'info');
  };

  // Load sample content
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setRawInput(sample.html);
      showToast(`Loaded ${sample.title}`, 'info');
    }
  };

  // Clear all
  const handleClear = () => {
    setRawInput('');
    showToast('Cleared input', 'info');
  };

  // History Actions
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setRawInput(item.html);
    showToast('Restored clip', 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('pastemagic_history');
    showToast('History cleared', 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('pastemagic_history', JSON.stringify(updated));
  };

  // AUTO INSERT & AUTO COPY: Global Window Listeners
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        return;
      }

      const html = e.clipboardData?.getData('text/html') || '';
      const text = e.clipboardData?.getData('text/plain') || '';
      const content = html.trim() ? html : text;

      if (content.trim()) {
        e.preventDefault();
        setRawInput(content);
        showToast('Pasted & cleaned automatically', 'info');
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [showToast]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowStatsModal(false);
        setShowHistoryDrawer(false);
        setShowShortcutsModal(false);
        return;
      }

      const isModifier = e.ctrlKey || e.metaKey;

      // Auto-Copy on Ctrl+C / Cmd+C (when no text is selected on screen)
      if (isModifier && e.key.toLowerCase() === 'c') {
        const selection = window.getSelection()?.toString().trim();
        if (!selection && sanitized.cleanHtml.trim()) {
          e.preventDefault();
          const ok = await copyRichText(sanitized.cleanHtml, sanitized.cleanText);
          if (ok) {
            showToast('Cleaned content copied (Ctrl+C)', 'info');
          }
          return;
        }
      }

      // Fallback Auto-Paste trigger on Ctrl+V if paste event wasn't captured
      if (isModifier && e.key.toLowerCase() === 'v') {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          try {
            const clip = await readClipboard();
            if (clip && (clip.html.trim() || clip.text.trim())) {
              const content = clip.html.trim() ? clip.html : clip.text;
              if (content !== rawInput) {
                setRawInput(content);
                showToast('Pasted & cleaned automatically', 'info');
              }
            }
          } catch {
            // Handled by global paste
          }
        }
      }

      // Ctrl+Enter: Explicit Copy Formatted
      if (isModifier && e.key === 'Enter') {
        e.preventDefault();
        if (sanitized.cleanHtml.trim()) {
          const ok = await copyRichText(sanitized.cleanHtml, sanitized.cleanText);
          if (ok) {
            showToast('Copied formatted text', 'info');
          }
        }
        return;
      }

      // Alt shortcuts
      if (e.altKey) {
        if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          if (sanitized.cleanMarkdown.trim()) {
            await copyPlainText(sanitized.cleanMarkdown);
            showToast('Copied Markdown', 'info');
          }
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          if (sanitized.cleanHtml.trim()) {
            await copyPlainText(sanitized.cleanHtml);
            showToast('Copied HTML', 'info');
          }
        } else if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          if (sanitized.cleanText.trim()) {
            await copyPlainText(sanitized.cleanText);
            showToast('Copied plain text', 'info');
          }
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleClear();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sanitized, rawInput, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0e1117] text-slate-900 dark:text-neutral-100 transition-colors font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        historyCount={history.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3.5">
        {/* Core essential checkboxes on top of the box */}
        <QuickOptionsBar
          options={filterOptions}
          onChange={handleCustomFilterChange}
          onReset={handleResetFilters}
          showAllRules={showCustomFilters}
          onToggleAllRules={() => setShowCustomFilters((prev) => !prev)}
        />

        {/* Detailed Granular Filter Controls (if expanded) */}
        {showCustomFilters && (
          <FilterControls
            options={filterOptions}
            onChange={handleCustomFilterChange}
            onReset={handleResetFilters}
          />
        )}

        {/* Dual Pane Layout: Input on left, Clean Output on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch flex-1">
          {/* Left: Raw Input Dropzone */}
          <div className="h-full">
            <InputPane
              rawInput={rawInput}
              onInputChange={setRawInput}
              onClear={handleClear}
              onLoadSample={handleLoadSample}
              onShowToast={showToast}
            />
          </div>

          {/* Right: Sanitized Live Output */}
          <div className="h-full">
            <OutputPane
              sanitized={sanitized}
              onShowToast={showToast}
              onOpenStats={() => setShowStatsModal(true)}
            />
          </div>
        </div>

        {/* Quiet Quick Guide Bar */}
        <div className="py-2.5 px-4 rounded-xl bg-white dark:bg-[#16181d] border border-slate-200/70 dark:border-neutral-800/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[10px] text-slate-700 dark:text-neutral-300">
                Ctrl+V
              </kbd>
              <span>anywhere auto-pastes</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[10px] text-slate-700 dark:text-neutral-300">
                Ctrl+C
              </kbd>
              <span>auto-copies clean formatted</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 dark:text-neutral-500">
            <span>100% Client-side · Private</span>
            <span>·</span>
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="hover:text-slate-800 dark:hover:text-neutral-200 underline cursor-pointer"
            >
              Shortcuts
            </button>
          </div>
        </div>
      </main>

      {/* Modals & Trays */}
      {showStatsModal && (
        <StatsModal
          stats={sanitized.stats}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {showHistoryDrawer && (
        <HistoryDrawer
          isOpen={showHistoryDrawer}
          onClose={() => setShowHistoryDrawer(false)}
          history={history}
          onSelect={handleSelectHistoryItem}
          onClearAll={handleClearHistory}
          onDeleteItem={handleDeleteHistoryItem}
        />
      )}

      {showShortcutsModal && (
        <ShortcutsModal onClose={() => setShowShortcutsModal(false)} />
      )}

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
