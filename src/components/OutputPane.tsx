import React, { useState } from 'react';
import {
  Copy,
  Check,
  Eye,
  Code,
  FileText,
  AlignLeft,
  Sparkles,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SanitizerResult } from '../types';
import { copyRichText, copyPlainText } from '../utils/clipboard';

interface OutputPaneProps {
  sanitized: SanitizerResult;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onOpenStats: () => void;
}

type TabType = 'preview' | 'html' | 'markdown' | 'text';

export const OutputPane: React.FC<OutputPaneProps> = ({
  sanitized,
  onShowToast,
  onOpenStats,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const { cleanHtml, cleanText, cleanMarkdown, stats } = sanitized;
  const hasContent = Boolean(cleanHtml && cleanHtml.trim());

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#3b82f6', '#10b981'],
      });
    } catch {
      // Ignore if confetti fails
    }
  };

  const handleCopyFormatted = async () => {
    if (!hasContent) return;
    const ok = await copyRichText(cleanHtml, cleanText);
    if (ok) {
      setCopiedFormat('formatted');
      setTimeout(() => setCopiedFormat(null), 2000);
      triggerConfetti();
      onShowToast('Copied formatted rich text! Ready to paste into Docs or Word.', 'success');
    } else {
      onShowToast('Could not access clipboard.', 'error');
    }
  };

  const handleCopyMarkdown = async () => {
    if (!hasContent) return;
    const ok = await copyPlainText(cleanMarkdown);
    if (ok) {
      setCopiedFormat('markdown');
      setTimeout(() => setCopiedFormat(null), 2000);
      onShowToast('Copied clean Markdown!', 'success');
    }
  };

  const handleCopyHtml = async () => {
    if (!hasContent) return;
    const ok = await copyPlainText(cleanHtml);
    if (ok) {
      setCopiedFormat('html');
      setTimeout(() => setCopiedFormat(null), 2000);
      onShowToast('Copied clean HTML!', 'success');
    }
  };

  const handleCopyPlain = async () => {
    if (!hasContent) return;
    const ok = await copyPlainText(cleanText);
    if (ok) {
      setCopiedFormat('text');
      setTimeout(() => setCopiedFormat(null), 2000);
      onShowToast('Copied plain text!', 'success');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
      {/* Pane Header Tabs */}
      <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-2">
        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'markdown'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'html'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Plain Text</span>
          </button>
        </div>

        {/* Copy Actions Group */}
        <div className="flex items-center gap-2">
          {/* Main Primary CTA: Copy Formatted */}
          <button
            disabled={!hasContent}
            onClick={handleCopyFormatted}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
              hasContent
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 ring-2 ring-indigo-500/20 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
            title="Copies rich text to clipboard (preserves bold, lists, headings in Docs & Word)"
          >
            {copiedFormat === 'formatted' ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied Rich Text!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Formatted</span>
              </>
            )}
          </button>

          {/* Quick Dropdown or Secondary Copy Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              disabled={!hasContent}
              onClick={handleCopyMarkdown}
              title="Copy as Markdown"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer font-medium"
            >
              {copiedFormat === 'markdown' ? '✓ MD' : 'MD'}
            </button>
            <button
              disabled={!hasContent}
              onClick={handleCopyHtml}
              title="Copy raw HTML"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer font-medium"
            >
              {copiedFormat === 'html' ? '✓ HTML' : 'HTML'}
            </button>
            <button
              disabled={!hasContent}
              onClick={handleCopyPlain}
              title="Copy plain text"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer font-medium"
            >
              {copiedFormat === 'text' ? '✓ Text' : 'Text'}
            </button>
          </div>
        </div>
      </div>

      {/* Reduction Stats Bar */}
      {hasContent && (
        <div className="px-4 py-2 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Cleaned: {stats.cleanedLength.toLocaleString()} chars</span>
            </span>

            {stats.reductionPercentage > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                -{stats.reductionPercentage}% bloated junk stripped
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {stats.stylesStrippedCount > 0 && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {stats.stylesStrippedCount} style rules stripped
              </span>
            )}

            {stats.trackingParamsRemovedCount > 0 && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                {stats.trackingParamsRemovedCount} tracking tags removed
              </span>
            )}

            <button
              onClick={onOpenStats}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1"
            >
              <BarChart3 className="w-3 h-3" />
              <span>Details</span>
            </button>
          </div>
        </div>
      )}

      {/* Pane Content View */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[360px] max-h-[620px]">
        {!hasContent ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 select-none">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Eye className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Clean preview will appear here
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
              Paste messy text into the left pane to watch PasteMagic instantly strip unwanted styles according to your rules.
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'preview' && (
              <div
                className="sanitized-preview prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            )}

            {activeTab === 'markdown' && (
              <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
                {cleanMarkdown}
              </pre>
            )}

            {activeTab === 'html' && (
              <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
                {cleanHtml}
              </pre>
            )}

            {activeTab === 'text' && (
              <pre className="font-sans text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
                {cleanText}
              </pre>
            )}
          </>
        )}
      </div>

      {/* Pane Footer Info */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Ready for Google Docs, Microsoft 365, Notion, Slack & Email</span>
        </div>
        <div>
          <span>Shortcut: <kbd className="font-mono px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">Ctrl+Enter</kbd> to copy</span>
        </div>
      </div>
    </div>
  );
};

