import React, { useState } from 'react';
import {
  Copy,
  Check,
  Eye,
  Code,
  FileText,
  AlignLeft,
  ArrowRight,
} from 'lucide-react';
import { SanitizerResult } from '../types';
import { copyRichText, copyPlainText } from '../utils/clipboard';

interface OutputPaneProps {
  sanitized: SanitizerResult;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onOpenStats: () => void;
}

type TabType = 'preview' | 'markdown' | 'html' | 'text';

export const OutputPane: React.FC<OutputPaneProps> = ({
  sanitized,
  onShowToast,
  onOpenStats,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const { cleanHtml, cleanText, cleanMarkdown, stats } = sanitized;
  const hasContent = Boolean(cleanHtml && cleanHtml.trim());

  const handleCopyFormatted = async () => {
    if (!hasContent) return;
    const ok = await copyRichText(cleanHtml, cleanText);
    if (ok) {
      setCopiedFormat('formatted');
      setTimeout(() => setCopiedFormat(null), 1800);
      onShowToast('Copied formatted text', 'info');
    } else {
      onShowToast('Clipboard access denied', 'error');
    }
  };

  const handleCopyMarkdown = async () => {
    if (!hasContent) return;
    const ok = await copyPlainText(cleanMarkdown);
    if (ok) {
      setCopiedFormat('markdown');
      setTimeout(() => setCopiedFormat(null), 1800);
      onShowToast('Copied Markdown', 'info');
    }
  };

  const handleCopyHtml = async () => {
    if (!hasContent) return;
    const ok = await copyPlainText(cleanHtml);
    if (ok) {
      setCopiedFormat('html');
      setTimeout(() => setCopiedFormat(null), 1800);
      onShowToast('Copied HTML', 'info');
    }
  };

  const handleCopyPlain = async () => {
    if (!hasContent) return;
    const ok = await copyPlainText(cleanText);
    if (ok) {
      setCopiedFormat('text');
      setTimeout(() => setCopiedFormat(null), 1800);
      onShowToast('Copied plain text', 'info');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#19191b] border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl overflow-hidden transition-colors">
      {/* Pane Header Tabs */}
      <div className="px-4 py-2 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-wrap items-center justify-between gap-2">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'markdown'
                ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Markdown</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'html'
                ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>HTML</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Plain</span>
          </button>
        </div>

        {/* Copy CTAs */}
        <div className="flex items-center gap-1.5">
          {/* Main Primary CTA: Quiet, high contrast, solid button */}
          <button
            disabled={!hasContent}
            onClick={handleCopyFormatted}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              hasContent
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
            }`}
            title="Copy rich formatted text"
          >
            {copiedFormat === 'formatted' ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>Copy formatted</span>
              </>
            )}
          </button>

          {/* Secondary format actions */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              disabled={!hasContent}
              onClick={handleCopyMarkdown}
              title="Copy as Markdown"
              className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer font-mono"
            >
              {copiedFormat === 'markdown' ? '✓ MD' : 'MD'}
            </button>
            <button
              disabled={!hasContent}
              onClick={handleCopyHtml}
              title="Copy clean HTML"
              className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer font-mono"
            >
              {copiedFormat === 'html' ? '✓ HTML' : 'HTML'}
            </button>
            <button
              disabled={!hasContent}
              onClick={handleCopyPlain}
              title="Copy plain text"
              className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer font-mono"
            >
              {copiedFormat === 'text' ? '✓ Plain' : 'Plain'}
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry bar: quiet, monospace, exact */}
      {hasContent && (
        <div className="px-4 py-1.5 bg-neutral-50/80 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2 tabular-nums">
            <span>{stats.cleanedLength.toLocaleString()} chars</span>
            {stats.reductionPercentage > 0 && (
              <>
                <span>·</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  {stats.reductionPercentage}% smaller
                </span>
                <span>·</span>
                <span>{stats.charactersSaved.toLocaleString()} removed</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {stats.stylesStrippedCount > 0 && (
              <span className="tabular-nums">
                {stats.stylesStrippedCount} styles removed
              </span>
            )}
            <button
              onClick={onOpenStats}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 underline cursor-pointer"
            >
              Report
            </button>
          </div>
        </div>
      )}

      {/* Content View */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[360px] max-h-[600px]">
        {!hasContent ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400 select-none">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Clean preview will appear here
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'preview' && (
              <div
                className="sanitized-preview text-neutral-900 dark:text-neutral-100"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            )}

            {activeTab === 'markdown' && (
              <pre className="font-mono text-xs text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900/70 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-neutral-200/60 dark:border-neutral-800/60">
                {cleanMarkdown}
              </pre>
            )}

            {activeTab === 'html' && (
              <pre className="font-mono text-xs text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900/70 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-neutral-200/60 dark:border-neutral-800/60">
                {cleanHtml}
              </pre>
            )}

            {activeTab === 'text' && (
              <pre className="font-mono text-xs text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900/70 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-neutral-200/60 dark:border-neutral-800/60">
                {cleanText}
              </pre>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-neutral-900/20 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
        <span>Ready for Word, Docs, Notion & Slack</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px]">
            Ctrl+Enter
          </kbd>{' '}
          to copy
        </span>
      </div>
    </div>
  );
};
