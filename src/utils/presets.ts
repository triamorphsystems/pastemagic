import { FilterOptions } from '../types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  options: FilterOptions;
}

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  // Inline Emphasis
  keepBold: true,
  keepItalic: true,
  keepUnderline: false,
  keepStrikethrough: true,
  keepSubSuper: true,
  keepInlineCode: true,

  // Structure
  keepHeadings: true,
  headingHandling: 'preserve',
  keepBlockquotes: true,
  keepCodeBlocks: true,
  keepHorizontalRules: true,
  keepParagraphs: true,

  // Lists & Tables
  keepUnorderedLists: true,
  keepOrderedLists: true,
  keepTables: true,
  tableHandling: 'clean_table',

  // Links & Media
  keepLinks: true,
  stripTrackingParams: true,
  openLinksInNewTab: true,
  keepImages: false,

  // Styling & CSS
  stripFontFamily: true,
  stripFontSize: true,
  stripTextColor: true,
  stripBackgroundColor: true,
  stripInlineStyles: true,
  stripClassesAndIds: true,

  // Deep Clean & Whitespace
  straightenQuotes: true,
  removeZeroWidthChars: true,
  normalizeNonBreakingSpaces: true,
  collapseBlankLines: true,
  removeEmptyTags: true,
  stripWordDocsArtifacts: true,
};

export const PRESETS: Preset[] = [
  {
    id: 'doc-ready',
    name: 'Doc ready',
    description: 'Keep bold, italics, lists, headings and tables. Strip fonts, sizes and background highlights.',
    icon: 'FileText',
    options: {
      ...DEFAULT_FILTER_OPTIONS,
      keepBold: true,
      keepItalic: true,
      keepUnderline: false,
      keepHeadings: true,
      keepUnorderedLists: true,
      keepOrderedLists: true,
      keepTables: true,
      keepLinks: true,
      stripInlineStyles: true,
      stripFontFamily: true,
      stripFontSize: true,
      stripTextColor: true,
      stripBackgroundColor: true,
    },
  },
  {
    id: 'semantic-clean',
    name: 'Semantic only',
    description: 'Clean HTML tags with zero inline CSS or classes.',
    icon: 'Code2',
    options: {
      ...DEFAULT_FILTER_OPTIONS,
      keepBold: true,
      keepItalic: true,
      keepUnderline: true,
      keepStrikethrough: true,
      keepHeadings: true,
      keepBlockquotes: true,
      keepCodeBlocks: true,
      keepTables: true,
      keepImages: true,
      stripInlineStyles: true,
      stripClassesAndIds: true,
    },
  },
  {
    id: 'minimalist-notes',
    name: 'Minimal notes',
    description: 'Keep only basic bold, italics, bullet lists, and links. Flatten headers to bold.',
    icon: 'Feather',
    options: {
      ...DEFAULT_FILTER_OPTIONS,
      keepBold: true,
      keepItalic: true,
      keepUnderline: false,
      keepStrikethrough: false,
      keepHeadings: false,
      headingHandling: 'flatten_to_bold',
      keepBlockquotes: false,
      keepTables: false,
      tableHandling: 'flatten_to_text',
      keepImages: false,
      stripInlineStyles: true,
    },
  },
  {
    id: 'links-only',
    name: 'Text and links',
    description: 'Strip all formatting while preserving hyperlinks.',
    icon: 'Link',
    options: {
      ...DEFAULT_FILTER_OPTIONS,
      keepBold: false,
      keepItalic: false,
      keepUnderline: false,
      keepStrikethrough: false,
      keepHeadings: false,
      headingHandling: 'flatten_to_p',
      keepBlockquotes: false,
      keepTables: false,
      tableHandling: 'flatten_to_text',
      keepLinks: true,
      stripTrackingParams: true,
      stripInlineStyles: true,
    },
  },
  {
    id: 'plain-ultra-clean',
    name: 'Plain text',
    description: 'Plain text with straightened quotes and zero-width characters removed.',
    icon: 'Type',
    options: {
      ...DEFAULT_FILTER_OPTIONS,
      keepBold: false,
      keepItalic: false,
      keepUnderline: false,
      keepStrikethrough: false,
      keepSubSuper: false,
      keepInlineCode: false,
      keepHeadings: false,
      headingHandling: 'flatten_to_p',
      keepBlockquotes: false,
      keepCodeBlocks: false,
      keepHorizontalRules: false,
      keepUnorderedLists: false,
      keepOrderedLists: false,
      keepTables: false,
      tableHandling: 'flatten_to_text',
      keepLinks: false,
      keepImages: false,
      stripInlineStyles: true,
      straightenQuotes: true,
      removeZeroWidthChars: true,
      normalizeNonBreakingSpaces: true,
      collapseBlankLines: true,
    },
  },
];
