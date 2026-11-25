import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterOptions, SanitizerResult } from './types';
import { DEFAULT_FILTER_OPTIONS, Preset } from './utils/presets';
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
  // Theme state: default to clean light mode unless dark is explicitly saved
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pastemagic_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return false; // Crisp light mode by default
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

  // Core filter options & presets
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [currentPresetId, setCurrentPresetId] = useState<string>('doc-ready');
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

  // Handle Preset selection
  const handleSelectPreset = (preset: Preset) => {
    setCurrentPresetId(preset.id);
    setFilterOptions(preset.options);
    showToast(`Preset: ${preset.name}`, 'info');
  };

  // Handle custom filter change
  const handleCustomFilterChange = (newOptions: FilterOptions) => {
    setFilterOptions(newOptions);
    setCurrentPresetId('custom');
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterOptions(DEFAULT_FILTER_OPTIONS);
    setCurrentPresetId('doc-ready');
    showToast('Reset to default rules', 'info');
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
  // 1. Listen for global paste events anywhere on page
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // If user is pasting into an explicit input or textarea element (like a modal search), allow default
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
        showToast('Pasted & cleaned automatically (Ctrl+V)', 'info');
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [showToast]);

  // 2. Global Keyboard Shortcuts & Auto-Copy on Ctrl+C / Cmd+C
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Close modals on Escape
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
        // If the user hasn't selected specific text on the page, copy the clean version!
        if (!selection && sanitized.cleanHtml.trim()) {
          e.preventDefault();
          const ok = await copyRichText(sanitized.cleanHtml, sanitized.cleanText);
          if (ok) {
            showToast('Clean version copied automatically (Ctrl+C)', 'info');
          }
          return;
        }
      }

      // Fallback Auto-Paste trigger on Ctrl+V if paste event wasn't captured
      if (isModifier && e.key.toLowerCase() === 'v') {
        // If not focused on an input/textarea, try reading clipboard directly
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          // Let native paste event fire first, but if clipboard API is available, support it
          try {
            const clip = await readClipboard();
            if (clip && (clip.html.trim() || clip.text.trim())) {
              const content = clip.html.trim() ? clip.html : clip.text;
              if (content !== rawInput) {
                setRawInput(content);
                showToast('Pasted & cleaned automatically (Ctrl+V)', 'info');
              }
            }
          } catch {
            // Native paste event handler will catch it
          }
        }
      }

      // Ctrl+Enter: Explicit Copy Formatted
      if (isModifier && e.key === 'Enter') {
        e.preventDefault();
        if (sanitized.cleanHtml.trim()) {
          const ok = await copyRichText(sanitized.cleanHtml, sanitized.cleanText);
          if (ok) {
            showToast('Copied formatted rich text', 'info');
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
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#141415] text-neutral-900 dark:text-neutral-100 transition-colors font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        historyCount={history.length}
      />

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        {/* CHECKBOX OPTIONS ON TOP OF THE BOX */}
        <QuickOptionsBar
          options={filterOptions}
          onChange={handleCustomFilterChange}
          currentPresetId={currentPresetId}
          onSelectPreset={handleSelectPreset}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
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

        {/* Feature Comparison Section */}
        <section className="mt-6 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
          <div className="max-w-xl mx-auto text-center mb-6">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Why not Notepad?
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Notepad strips every styling element, including bold emphasis, lists, and links that should be kept.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#19191b] border border-neutral-200/80 dark:border-neutral-800">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                Notepad strips everything
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Pasting into plain text strips all formatting, but it also destroys lists, bold emphasis, headings, and working hyperlinks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#19191b] border border-neutral-200/80 dark:border-neutral-800">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                Direct paste copies noise
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Copying directly from blogs or office documents brings along custom fonts, inline colors, and tracking tags in links.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#19191b] border border-neutral-200/80 dark:border-neutral-800">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                PasteMagic selective filter
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Preserve structure (bold, italics, lists, clean tables, headings) while removing font families, colors, and tracking tags.
              </p>
            </div>
          </div>

          {/* Workflow Sequence */}
          <div className="mt-6 p-3.5 rounded-xl bg-white dark:bg-[#19191b] border border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center justify-around gap-3 text-center">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-neutral-400 font-bold">1</span>
              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px]">Ctrl+V</kbd> anywhere on page to paste
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-neutral-400 font-bold">2</span>
              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                Options filter content live
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-neutral-400 font-bold">3</span>
              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px]">Ctrl+C</kbd> to copy clean version
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-neutral-400 font-bold">4</span>
              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                Paste cleanly into Docs or Word
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-4 px-4 text-center text-xs text-neutral-400 bg-white dark:bg-[#141415]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">PasteMagic</span>
            <span>·</span>
            <span>Clipboard style sanitizer</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Shortcuts
            </button>
            <span>·</span>
            <button
              onClick={() => setShowStatsModal(true)}
              className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Report
            </button>
            <span>·</span>
            <span>100% Client-side privacy</span>
          </div>
        </div>
      </footer>

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
