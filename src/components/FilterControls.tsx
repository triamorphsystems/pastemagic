import React from 'react';
import { FilterOptions } from '../types';
import { RotateCcw } from 'lucide-react';

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
    <div className="bg-neutral-50 dark:bg-[#111112] border-b border-neutral-200/80 dark:border-neutral-800/80 p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
              Sanitization rules
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Select elements to preserve. Preview updates live.
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 cursor-pointer px-2 py-1 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3 stroke-[1.75]" />
            <span>Reset to default</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Section 1: Emphasis */}
          <div className="bg-white dark:bg-[#19191b] rounded-xl p-3.5 border border-neutral-200/80 dark:border-neutral-800">
            <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Inline emphasis
            </h4>
            <div className="space-y-2">
              <ToggleItem
                label="Keep bold"
                description="Preserves bold text"
                checked={options.keepBold}
                onChange={(c) => updateOption('keepBold', c)}
              />
              <ToggleItem
                label="Keep italic"
                description="Preserves italics"
                checked={options.keepItalic}
                onChange={(c) => updateOption('keepItalic', c)}
              />
              <ToggleItem
                label="Keep underline"
                description="Preserves underlined text"
                checked={options.keepUnderline}
                onChange={(c) => updateOption('keepUnderline', c)}
              />
              <ToggleItem
                label="Keep strikethrough"
                description="Preserves deleted / crossed text"
                checked={options.keepStrikethrough}
                onChange={(c) => updateOption('keepStrikethrough', c)}
              />
              <ToggleItem
                label="Keep sub and superscripts"
                description="Preserves mathematical indices"
                checked={options.keepSubSuper}
                onChange={(c) => updateOption('keepSubSuper', c)}
              />
              <ToggleItem
                label="Keep inline code"
                description="Preserves code snippets"
                checked={options.keepInlineCode}
                onChange={(c) => updateOption('keepInlineCode', c)}
              />
            </div>
          </div>

          {/* Section 2: Structure */}
          <div className="bg-white dark:bg-[#19191b] rounded-xl p-3.5 border border-neutral-200/80 dark:border-neutral-800">
            <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Structure and headings
            </h4>
            <div className="space-y-2">
              <ToggleItem
                label="Keep headings (H1-H6)"
                description="Keep headers as heading tags"
                checked={options.keepHeadings}
                onChange={(c) => updateOption('keepHeadings', c)}
              />
              {!options.keepHeadings && (
                <div className="ml-5 pl-2 border-l border-neutral-200 dark:border-neutral-700 space-y-1.5 py-1">
                  <span className="text-[11px] text-neutral-400">
                    When stripped:
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateOption('headingHandling', 'flatten_to_bold')}
                      className={`text-xs px-2 py-0.5 rounded ${
                        options.headingHandling === 'flatten_to_bold'
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                          : 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                      }`}
                    >
                      Turn into bold
                    </button>
                    <button
                      type="button"
                      onClick={() => updateOption('headingHandling', 'flatten_to_p')}
                      className={`text-xs px-2 py-0.5 rounded ${
                        options.headingHandling === 'flatten_to_p'
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                          : 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                      }`}
                    >
                      Turn into paragraph
                    </button>
                  </div>
                </div>
              )}
              <ToggleItem
                label="Keep blockquotes"
                description="Preserve quote blocks"
                checked={options.keepBlockquotes}
                onChange={(c) => updateOption('keepBlockquotes', c)}
              />
              <ToggleItem
                label="Keep code blocks"
                description="Preserve multi-line code boxes"
                checked={options.keepCodeBlocks}
                onChange={(c) => updateOption('keepCodeBlocks', c)}
              />
              <ToggleItem
                label="Keep divider lines"
                description="Preserve horizontal rules"
                checked={options.keepHorizontalRules}
                onChange={(c) => updateOption('keepHorizontalRules', c)}
              />
            </div>
          </div>

          {/* Section 3: Lists & Tables */}
          <div className="bg-white dark:bg-[#19191b] rounded-xl p-3.5 border border-neutral-200/80 dark:border-neutral-800">
            <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Lists and tables
            </h4>
            <div className="space-y-2">
              <ToggleItem
                label="Keep bullet lists"
                description="Preserve bulleted list hierarchy"
                checked={options.keepUnorderedLists}
                onChange={(c) => updateOption('keepUnorderedLists', c)}
              />
              <ToggleItem
                label="Keep numbered lists"
                description="Preserve numbered step lists"
                checked={options.keepOrderedLists}
                onChange={(c) => updateOption('keepOrderedLists', c)}
              />
              <ToggleItem
                label="Keep tables"
                description="Preserve table structures"
                checked={options.keepTables}
                onChange={(c) => updateOption('keepTables', c)}
              />
              {options.keepTables && (
                <div className="ml-5 pl-2 border-l border-neutral-200 dark:border-neutral-700 space-y-1.5 py-1">
                  <span className="text-[11px] text-neutral-400">
                    Table format:
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateOption('tableHandling', 'clean_table')}
                      className={`text-xs px-2 py-0.5 rounded ${
                        options.tableHandling === 'clean_table'
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                          : 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                      }`}
                    >
                      Clean table
                    </button>
                    <button
                      type="button"
                      onClick={() => updateOption('tableHandling', 'flatten_to_text')}
                      className={`text-xs px-2 py-0.5 rounded ${
                        options.tableHandling === 'flatten_to_text'
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                          : 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                      }`}
                    >
                      Flatten to text
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Links */}
          <div className="bg-white dark:bg-[#19191b] rounded-xl p-3.5 border border-neutral-200/80 dark:border-neutral-800">
            <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Links and media
            </h4>
            <div className="space-y-2">
              <ToggleItem
                label="Keep hyperlinks"
                description="Preserve links (keeps text if off)"
                checked={options.keepLinks}
                onChange={(c) => updateOption('keepLinks', c)}
              />
              <ToggleItem
                label="Strip tracking queries"
                description="Removes utm_*, fbclid, gclid"
                checked={options.stripTrackingParams}
                onChange={(c) => updateOption('stripTrackingParams', c)}
              />
              <ToggleItem
                label="Open links in new tab"
                description="Adds target='_blank'"
                checked={options.openLinksInNewTab}
                onChange={(c) => updateOption('openLinksInNewTab', c)}
              />
              <ToggleItem
                label="Keep images"
                description="Preserves embedded images"
                checked={options.keepImages}
                onChange={(c) => updateOption('keepImages', c)}
              />
            </div>
          </div>

          {/* Section 5: Styles & CSS */}
          <div className="bg-white dark:bg-[#19191b] rounded-xl p-3.5 border border-neutral-200/80 dark:border-neutral-800">
            <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Inline styles and fonts
            </h4>
            <div className="space-y-2">
              <ToggleItem
                label="Strip all inline styles"
                description="Removes entire style attribute"
                checked={options.stripInlineStyles}
                onChange={(c) => updateOption('stripInlineStyles', c)}
              />
              {!options.stripInlineStyles && (
                <div className="ml-4 space-y-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <ToggleItem
                    label="Strip font families"
                    description="Removes custom fonts"
                    checked={options.stripFontFamily}
                    onChange={(c) => updateOption('stripFontFamily', c)}
                  />
                  <ToggleItem
                    label="Strip font sizes"
                    description="Removes custom sizes"
                    checked={options.stripFontSize}
                    onChange={(c) => updateOption('stripFontSize', c)}
                  />
                  <ToggleItem
                    label="Strip text colors"
                    description="Resets font colors"
                    checked={options.stripTextColor}
                    onChange={(c) => updateOption('stripTextColor', c)}
                  />
                  <ToggleItem
                    label="Strip background colors"
                    description="Removes highlights"
                    checked={options.stripBackgroundColor}
                    onChange={(c) => updateOption('stripBackgroundColor', c)}
                  />
                </div>
              )}
              <ToggleItem
                label="Strip classes and IDs"
                description="Removes class and id attributes"
                checked={options.stripClassesAndIds}
                onChange={(c) => updateOption('stripClassesAndIds', c)}
              />
            </div>
          </div>

          {/* Section 6: Cleanup */}
          <div className="bg-white dark:bg-[#19191b] rounded-xl p-3.5 border border-neutral-200/80 dark:border-neutral-800">
            <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Whitespace and cleanup
            </h4>
            <div className="space-y-2">
              <ToggleItem
                label="Straighten smart quotes"
                description="Converts curly quotes to straight quotes"
                checked={options.straightenQuotes}
                onChange={(c) => updateOption('straightenQuotes', c)}
              />
              <ToggleItem
                label="Remove zero-width spaces"
                description="Deletes invisible Unicode characters"
                checked={options.removeZeroWidthChars}
                onChange={(c) => updateOption('removeZeroWidthChars', c)}
              />
              <ToggleItem
                label="Normalize non-breaking spaces"
                description="Converts &nbsp; to standard spaces"
                checked={options.normalizeNonBreakingSpaces}
                onChange={(c) => updateOption('normalizeNonBreakingSpaces', c)}
              />
              <ToggleItem
                label="Collapse blank lines"
                description="Caps consecutive blank lines to one"
                checked={options.collapseBlankLines}
                onChange={(c) => updateOption('collapseBlankLines', c)}
              />
              <ToggleItem
                label="Remove empty tags"
                description="Prunes empty spans, bold and paragraphs"
                checked={options.removeEmptyTags}
                onChange={(c) => updateOption('removeEmptyTags', c)}
              />
              <ToggleItem
                label="Strip Word artifacts"
                description="Removes MsoNormal and XML tags"
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
        <span className="text-xs font-normal text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
          {label}
        </span>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-tight">
          {description}
        </p>
      </div>

      <div
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={`w-8 h-4.5 rounded-full transition-colors relative shrink-0 p-0.5 mt-0.5 cursor-pointer ${
          checked ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'
        }`}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full transition-transform ${
            checked
              ? 'translate-x-3.5 bg-white dark:bg-neutral-900'
              : 'translate-x-0 bg-white dark:bg-neutral-400'
          }`}
        />
      </div>
    </label>
  );
};
