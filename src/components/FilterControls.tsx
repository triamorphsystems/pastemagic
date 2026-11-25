import React from 'react';
import { FilterOptions } from '../types';
import {
  Type,
  Heading,
  List,
  Link,
  Palette,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { DEFAULT_FILTER_OPTIONS } from '../utils/presets';

interface FilterControlsProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
  onReset: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  options,
  onChange,
  onReset,
}) => {
  const updateOption = <K extends keyof FilterOptions>(
    key: K,
    val: FilterOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: val,
    });
  };

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Granular Styling & Sanitization Rules
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Toggle specific elements to preserve or strip. Changes apply immediately to your preview.
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer font-medium px-2.5 py-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Doc-Ready</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Section 1: Inline Emphasis */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700/70 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>Inline Emphasis</span>
            </div>
            <div className="space-y-2.5">
              <ToggleItem
                label="Keep Bold (strong)"
                description="Preserves bold & heavy text"
                checked={options.keepBold}
                onChange={(c) => updateOption('keepBold', c)}
              />
              <ToggleItem
                label="Keep Italic (em)"
                description="Preserves italics & emphasis"
                checked={options.keepItalic}
                onChange={(c) => updateOption('keepItalic', c)}
              />
              <ToggleItem
                label="Keep Underline"
                description="Preserves underlined text"
                checked={options.keepUnderline}
                onChange={(c) => updateOption('keepUnderline', c)}
              />
              <ToggleItem
                label="Keep Strikethrough"
                description="Preserves deleted / crossed text"
                checked={options.keepStrikethrough}
                onChange={(c) => updateOption('keepStrikethrough', c)}
              />
              <ToggleItem
                label="Keep Sub / Superscripts"
                description="Preserves mathematical subscripts"
                checked={options.keepSubSuper}
                onChange={(c) => updateOption('keepSubSuper', c)}
              />
              <ToggleItem
                label="Keep Inline Code"
                description="Preserves `code` snippets"
                checked={options.keepInlineCode}
                onChange={(c) => updateOption('keepInlineCode', c)}
              />
            </div>
          </div>

          {/* Section 2: Structure & Headings */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700/70 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
              <Heading className="w-3.5 h-3.5 text-indigo-500" />
              <span>Structure & Headers</span>
            </div>
            <div className="space-y-2.5">
              <ToggleItem
                label="Keep Headings (H1-H6)"
                description="Keep headers as real heading tags"
                checked={options.keepHeadings}
                onChange={(c) => updateOption('keepHeadings', c)}
              />
              {!options.keepHeadings && (
                <div className="ml-6 pl-2 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-1.5 py-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    When headings are stripped:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateOption('headingHandling', 'flatten_to_bold')}
                      className={`text-xs px-2 py-1 rounded ${
                        options.headingHandling === 'flatten_to_bold'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Turn into Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => updateOption('headingHandling', 'flatten_to_p')}
                      className={`text-xs px-2 py-1 rounded ${
                        options.headingHandling === 'flatten_to_p'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Turn into Plain P
                    </button>
                  </div>
                </div>
              )}
              <ToggleItem
                label="Keep Blockquotes"
                description="Preserve quotation callout blocks"
                checked={options.keepBlockquotes}
                onChange={(c) => updateOption('keepBlockquotes', c)}
              />
              <ToggleItem
                label="Keep Code Blocks (<pre>)"
                description="Preserve multi-line code boxes"
                checked={options.keepCodeBlocks}
                onChange={(c) => updateOption('keepCodeBlocks', c)}
              />
              <ToggleItem
                label="Keep Divider Lines (<hr>)"
                description="Preserve horizontal separators"
                checked={options.keepHorizontalRules}
                onChange={(c) => updateOption('keepHorizontalRules', c)}
              />
            </div>
          </div>

          {/* Section 3: Lists & Tables */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700/70 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
              <List className="w-3.5 h-3.5 text-indigo-500" />
              <span>Lists & Tables</span>
            </div>
            <div className="space-y-2.5">
              <ToggleItem
                label="Keep Bullet Lists (<ul>)"
                description="Preserve bulleted list hierarchy"
                checked={options.keepUnorderedLists}
                onChange={(c) => updateOption('keepUnorderedLists', c)}
              />
              <ToggleItem
                label="Keep Numbered Lists (<ol>)"
                description="Preserve numbered step lists"
                checked={options.keepOrderedLists}
                onChange={(c) => updateOption('keepOrderedLists', c)}
              />
              <ToggleItem
                label="Keep Tables"
                description="Preserve table grid structures"
                checked={options.keepTables}
                onChange={(c) => updateOption('keepTables', c)}
              />
              {options.keepTables && (
                <div className="ml-6 pl-2 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-1.5 py-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Table formatting:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateOption('tableHandling', 'clean_table')}
                      className={`text-xs px-2 py-1 rounded ${
                        options.tableHandling === 'clean_table'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Clean Semantic Table
                    </button>
                    <button
                      type="button"
                      onClick={() => updateOption('tableHandling', 'flatten_to_text')}
                      className={`text-xs px-2 py-1 rounded ${
                        options.tableHandling === 'flatten_to_text'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Flatten to Text
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Links & Tracking */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700/70 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
              <Link className="w-3.5 h-3.5 text-indigo-500" />
              <span>Links & Media</span>
            </div>
            <div className="space-y-2.5">
              <ToggleItem
                label="Keep Hyperlinks (<a>)"
                description="Preserve hyperlinks (keeps text if off)"
                checked={options.keepLinks}
                onChange={(c) => updateOption('keepLinks', c)}
              />
              <ToggleItem
                label="Strip Tracking URLs"
                description="Removes utm_*, fbclid, gclid from links"
                checked={options.stripTrackingParams}
                onChange={(c) => updateOption('stripTrackingParams', c)}
              />
              <ToggleItem
                label="Open Links in New Tab"
                description="Adds target='_blank' rel='noopener'"
                checked={options.openLinksInNewTab}
                onChange={(c) => updateOption('openLinksInNewTab', c)}
              />
              <ToggleItem
                label="Keep Images (<img>)"
                description="Preserves embedded images"
                checked={options.keepImages}
                onChange={(c) => updateOption('keepImages', c)}
              />
            </div>
          </div>

          {/* Section 5: Inline CSS & Colors */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700/70 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span>Styles, Colors & Fonts</span>
            </div>
            <div className="space-y-2.5">
              <ToggleItem
                label="Strip All Inline Styles"
                description="Removes entire style='...' attributes"
                checked={options.stripInlineStyles}
                onChange={(c) => updateOption('stripInlineStyles', c)}
              />
              {!options.stripInlineStyles && (
                <div className="ml-4 space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <ToggleItem
                    label="Strip Font Families"
                    description="Removes Arial, Comic Sans, etc."
                    checked={options.stripFontFamily}
                    onChange={(c) => updateOption('stripFontFamily', c)}
                  />
                  <ToggleItem
                    label="Strip Font Sizes"
                    description="Removes 13.5px, 18pt overrides"
                    checked={options.stripFontSize}
                    onChange={(c) => updateOption('stripFontSize', c)}
                  />
                  <ToggleItem
                    label="Strip Text Colors"
                    description="Resets custom font colors"
                    checked={options.stripTextColor}
                    onChange={(c) => updateOption('stripTextColor', c)}
                  />
                  <ToggleItem
                    label="Strip Background Colors"
                    description="Removes highlighter backgrounds"
                    checked={options.stripBackgroundColor}
                    onChange={(c) => updateOption('stripBackgroundColor', c)}
                  />
                </div>
              )}
              <ToggleItem
                label="Strip Classes & IDs"
                description="Removes class='...' and id='...'"
                checked={options.stripClassesAndIds}
                onChange={(c) => updateOption('stripClassesAndIds', c)}
              />
            </div>
          </div>

          {/* Section 6: Whitespace & Deep Clean */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700/70 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Deep Clean & Whitespace</span>
            </div>
            <div className="space-y-2.5">
              <ToggleItem
                label="Straighten Smart Quotes"
                description="Converts “ ” ‘ ’ to straight &quot; '"
                checked={options.straightenQuotes}
                onChange={(c) => updateOption('straightenQuotes', c)}
              />
              <ToggleItem
                label="Remove Zero-Width Characters"
                description="Deletes invisible Unicode \\u200B / BOM"
                checked={options.removeZeroWidthChars}
                onChange={(c) => updateOption('removeZeroWidthChars', c)}
              />
              <ToggleItem
                label="Normalize &nbsp; to Spaces"
                description="Converts non-breaking spaces to standard"
                checked={options.normalizeNonBreakingSpaces}
                onChange={(c) => updateOption('normalizeNonBreakingSpaces', c)}
              />
              <ToggleItem
                label="Collapse Blank Lines"
                description="Caps consecutive blank lines to max 1"
                checked={options.collapseBlankLines}
                onChange={(c) => updateOption('collapseBlankLines', c)}
              />
              <ToggleItem
                label="Remove Empty Tags"
                description="Prunes empty spans, bold, and paragraphs"
                checked={options.removeEmptyTags}
                onChange={(c) => updateOption('removeEmptyTags', c)}
              />
              <ToggleItem
                label="Strip Word / Docs Artifacts"
                description="Removes MsoNormal, XML tags & namespaces"
                checked={options.stripWordDocsArtifacts}
                onChange={(c) => updateOption('stripWordDocsArtifacts', c)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToggleItemProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-start justify-between gap-3 cursor-pointer group select-none">
      <div className="flex-1">
        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {label}
        </span>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
          {description}
        </p>
      </div>

      <div
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 p-0.5 mt-0.5 ${
          checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform flex items-center justify-center text-[10px] shadow-xs ${
            checked ? 'translate-x-4 text-indigo-600' : 'translate-x-0 text-slate-400'
          }`}
        >
          {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
        </div>
      </div>
    </label>
  );
};

