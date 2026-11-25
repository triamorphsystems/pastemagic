export interface FilterOptions {
  // Inline Emphasis
  keepBold: boolean;
  keepItalic: boolean;
  keepUnderline: boolean;
  keepStrikethrough: boolean;
  keepSubSuper: boolean;
  keepInlineCode: boolean;

  // Structure
  keepHeadings: boolean;
  headingHandling: 'preserve' | 'flatten_to_bold' | 'flatten_to_p';
  keepBlockquotes: boolean;
  keepCodeBlocks: boolean;
  keepHorizontalRules: boolean;
  keepParagraphs: boolean;

  // Lists & Tables
  keepUnorderedLists: boolean;
  keepOrderedLists: boolean;
  keepTables: boolean;
  tableHandling: 'clean_table' | 'flatten_to_text';

  // Links & Media
  keepLinks: boolean;
  stripTrackingParams: boolean;
  openLinksInNewTab: boolean;
  keepImages: boolean;

  // Styling & CSS
  stripFontFamily: boolean;
  stripFontSize: boolean;
  stripTextColor: boolean;
  stripBackgroundColor: boolean;
  stripInlineStyles: boolean;
  stripClassesAndIds: boolean;

  // Deep Clean & Whitespace
  straightenQuotes: boolean;
  removeZeroWidthChars: boolean;
  normalizeNonBreakingSpaces: boolean;
  collapseBlankLines: boolean;
  removeEmptyTags: boolean;
  stripWordDocsArtifacts: boolean;
}

export interface SanitizerStats {
  originalLength: number;
  cleanedLength: number;
  tagsRemovedCount: number;
  stylesStrippedCount: number;
  trackingParamsRemovedCount: number;
  charactersSaved: number;
  reductionPercentage: number;
  removedElementsSummary: string[];
}

export interface SanitizerResult {
  cleanHtml: string;
  cleanText: string;
  cleanMarkdown: string;
  stats: SanitizerStats;
}

