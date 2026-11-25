import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterOptions, SanitizerResult } from './types';
import { DEFAULT_FILTER_OPTIONS, PRESETS, Preset } from './utils/presets';
import { sanitizeContent } from './utils/sanitizer';
import { SAMPLES } from './utils/samples';
import { copyRichText, copyPlainText } from './utils/clipboard';
import { Navbar } from './components/Navbar';
import { PresetsBar } from './components/PresetsBar';
import { FilterControls } from './components/FilterControls';
import { InputPane } from './components/InputPane';
import { OutputPane } from './components/OutputPane';
import { StatsModal } from './components/StatsModal';
import { HistoryDrawer, HistoryItem } from './components/HistoryDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Toast, ToastMessage } from './components/Toast';
import {
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('pastemagic_theme') === 'dark' ||
      (!('pastemagic_theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
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
        // Prevent duplicate immediate paste
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
    showToast(`Switched to "${preset.name}" preset`, 'info');
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
    showToast('Reset to default Doc-Ready rules', 'info');
  };

  // Load sample content
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setRawInput(sample.html);
      showToast(`Loaded "${sample.title}" sample`, 'info');
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
    showToast('Restored past clip', 'success');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('pastemagic_history');
    showToast('Cleared paste history', 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('pastemagic_history', JSON.stringify(updated));
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Escape closes modals
      if (e.key === 'Escape') {
        setShowStatsModal(false);
        setShowHistoryDrawer(false);
        setShowShortcutsModal(false);
        return;
      }

      // Ctrl+Enter or Cmd+Enter: Copy Formatted
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (sanitized.cleanHtml.trim()) {
          const ok = await copyRichText(sanitized.cleanHtml, sanitized.cleanText);
          if (ok) {
            showToast('Copied formatted rich text!', 'success');
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
            showToast('Copied Markdown!', 'success');
          }
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          if (sanitized.cleanHtml.trim()) {
            await copyPlainText(sanitized.cleanHtml);
            showToast('Copied clean HTML!', 'success');
          }
        } else if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          if (sanitized.cleanText.trim()) {
            await copyPlainText(sanitized.cleanText);
            showToast('Copied plain text!', 'success');
          }
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleClear();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sanitized, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        historyCount={history.length}
      />

      {/* Presets Bar */}
      <PresetsBar
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        showCustomFilters={showCustomFilters}
        onToggleCustomFilters={() => setShowCustomFilters((prev) => !prev)}
        filterOptions={filterOptions}
      />

      {/* Granular Filter Controls Drawer / Accordion */}
      {showCustomFilters && (
        <FilterControls
          options={filterOptions}
          onChange={handleCustomFilterChange}
          onReset={handleResetFilters}
        />
      )}

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: Raw Input Dropzone / Area */}
          <div className="h-full">
            <InputPane
              rawInput={rawInput}
              onInputChange={setRawInput}
              onClear={handleClear}
              onLoadSample={handleLoadSample}
              onShowToast={showToast}
            />
          </div>

          {/* Right: Sanitized Live Output & Copy CTAs */}
          <div className="h-full">
            <OutputPane
              sanitized={sanitized}
              onShowToast={showToast}
              onOpenStats={() => setShowStatsModal(true)}
            />
          </div>
        </div>

        {/* Feature Explainer & Comparison Section */}
        <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Why use PasteMagic instead of Notepad?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Notepad is the classic workaround, but it acts like a sledgehammer—it wipes away bolding, lists, and links you actually wanted to keep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: The Notepad Problem */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                The Notepad Sledgehammer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pasting into Notepad wipes out garish colors, but it also destroys all your bullet points, bold emphasis, headings, and working hyperlinks. You end up having to manually re-format everything.
              </p>
            </div>

            {/* Card 2: The Direct Web Paste Problem */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                The Direct Paste Mess
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Copying directly from blogs, Word, or Google Docs brings along Comic Sans, 13.5px font sizes, highlighter yellow backgrounds, and 100-character UTM marketing trackers in your hyperlinks.
              </p>
            </div>

            {/* Card 3: The PasteMagic Solution */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-100 mb-2">
                PasteMagic Surgical Filter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Keep the structure you need (bold, italics, lists, clean tables, headings) while surgically stripping all font families, sizes, inline colors, and tracking tags in 1 millisecond.
              </p>
            </div>
          </div>

          {/* Workflow Badges */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 flex flex-wrap items-center justify-around gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Copy text from web or doc
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Paste in PasteMagic (Ctrl+V)
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click Copy Formatted (Ctrl+Enter)
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Paste pristine formatted text!
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">PasteMagic</span>
            <span>•</span>
            <span>Fast, Private & Smart Clipboard Styling Sanitizer</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Shortcuts
            </button>
            <span>•</span>
            <button
              onClick={() => setShowStatsModal(true)}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Sanitizer Specs
            </button>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              100% Client-Side Privacy
            </span>
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

