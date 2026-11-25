import { FilterOptions, SanitizerResult, SanitizerStats } from '../types';
import { htmlToMarkdown } from './toMarkdown';

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'fbclid',
  'gclid',
  'gclsrc',
  'dclid',
  'zanpid',
  'msclkid',
  'mc_eid',
  'mc_cid',
  '_hsenc',
  '_hsmi',
  'ref',
  'ref_src',
  'source',
  'si',
]);

/**
 * Main sanitization pipeline
 */
export function sanitizeContent(
  rawInput: string,
  options: FilterOptions
): SanitizerResult {
  if (!rawInput || !rawInput.trim()) {
    return {
      cleanHtml: '',
      cleanText: '',
      cleanMarkdown: '',
      stats: {
        originalLength: 0,
        cleanedLength: 0,
        tagsRemovedCount: 0,
        stylesStrippedCount: 0,
        trackingParamsRemovedCount: 0,
        charactersSaved: 0,
        reductionPercentage: 0,
        removedElementsSummary: [],
      },
    };
  }

  const originalLength = rawInput.length;
  let tagsRemovedCount = 0;
  let stylesStrippedCount = 0;
  let trackingParamsRemovedCount = 0;
  const removedElementsSummary: string[] = [];

  // Pre-cleaning: Remove Office / XML comments and HTML comments
  let preprocessed = rawInput
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '')
    .replace(/<title[\s\S]*?<\/title>/gi, '');

  if (options.stripWordDocsArtifacts) {
    // Strip XML tags like <o:p>, <w:WordDocument>, etc.
    preprocessed = preprocessed.replace(/<\/?\w+:[^>]*>/gi, '');
  }

  // Text level pre-cleaning
  if (options.straightenQuotes) {
    preprocessed = preprocessed
      .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  }

  if (options.removeZeroWidthChars) {
    preprocessed = preprocessed.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');
  }

  if (options.normalizeNonBreakingSpaces) {
    preprocessed = preprocessed.replace(/(&nbsp;|\u00A0)/g, ' ');
  }

  // Parse into DOM
  const parser = new DOMParser();
  // If the raw input doesn't contain HTML tags, treat as text wrapped in paragraphs
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(preprocessed);
  const doc = parser.parseFromString(
    isHtml ? preprocessed : `<p>${escapeHtml(preprocessed).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>')}</p>`,
    'text/html'
  );

  // Traverse and sanitize elements
  const body = doc.body;

  // First pass: extract Google Docs span styles into semantic tags
  normalizeGoogleDocsSpans(body, options);

  // Second pass: recursively process nodes
  processNode(body, options, {
    onTagRemoved: (tag) => {
      tagsRemovedCount++;
      if (removedElementsSummary.length < 15 && !removedElementsSummary.includes(tag)) {
        removedElementsSummary.push(tag);
      }
    },
    onStyleStripped: (count = 1) => {
      stylesStrippedCount += count;
    },
    onTrackingParamRemoved: (count = 1) => {
      trackingParamsRemovedCount += count;
    },
  });

  // Third pass: Clean empty tags if requested
  if (options.removeEmptyTags) {
    cleanEmptyNodes(body);
  }

  // Format clean HTML
  let cleanHtml = body.innerHTML.trim();

  // Whitespace post-processing
  if (options.collapseBlankLines) {
    cleanHtml = cleanHtml
      .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')
      .replace(/(<p>\s*(<br\s*\/?>|&nbsp;|\s)*<\/p>\s*){2,}/gi, '<p><br></p>');
  }

  // Generate clean plain text
  const cleanText = getCleanPlainText(body, options);

  // Generate clean markdown
  const cleanMarkdown = htmlToMarkdown(cleanHtml);

  const cleanedLength = cleanHtml.length;
  const charactersSaved = Math.max(0, originalLength - cleanedLength);
  const reductionPercentage =
    originalLength > 0 ? Math.round((charactersSaved / originalLength) * 100) : 0;

  return {
    cleanHtml,
    cleanText,
    cleanMarkdown,
    stats: {
      originalLength,
      cleanedLength,
      tagsRemovedCount,
      stylesStrippedCount,
      trackingParamsRemovedCount,
      charactersSaved,
      reductionPercentage,
      removedElementsSummary,
    },
  };
}

/**
 * Google Docs pastes wrap text in spans with CSS styles like font-weight:700 or font-style:italic.
 * Convert them to semantic strong/em/u/s if enabled.
 */
function normalizeGoogleDocsSpans(root: HTMLElement, options: FilterOptions) {
  const spans = Array.from(root.querySelectorAll('span'));
  for (const span of spans) {
    const style = span.getAttribute('style') || '';
    const fontWeight = span.style.fontWeight || '';
    const fontStyle = span.style.fontStyle || '';
    const textDecoration = span.style.textDecoration || '';

    const isBold =
      fontWeight === 'bold' ||
      fontWeight === '700' ||
      fontWeight === '800' ||
      fontWeight === '900' ||
      /font-weight:\s*(bold|[7-9]00)/i.test(style);

    const isItalic =
      fontStyle === 'italic' ||
      /font-style:\s*italic/i.test(style);

    const isUnderline =
      textDecoration.includes('underline') ||
      /text-decoration[^;]*underline/i.test(style);

    const isStrike =
      textDecoration.includes('line-through') ||
      /text-decoration[^;]*line-through/i.test(style);

    if (isBold && options.keepBold) {
      const strong = root.ownerDocument.createElement('strong');
      wrapNode(span, strong);
    }
    if (isItalic && options.keepItalic) {
      const em = root.ownerDocument.createElement('em');
      wrapNode(span, em);
    }
    if (isUnderline && options.keepUnderline) {
      const u = root.ownerDocument.createElement('u');
      wrapNode(span, u);
    }
    if (isStrike && options.keepStrikethrough) {
      const s = root.ownerDocument.createElement('s');
      wrapNode(span, s);
    }
  }
}

function wrapNode(target: HTMLElement, wrapper: HTMLElement) {
  target.parentNode?.insertBefore(wrapper, target);
  wrapper.appendChild(target);
}

interface ProcessCallbacks {
  onTagRemoved: (tag: string) => void;
  onStyleStripped: (count?: number) => void;
  onTrackingParamRemoved: (count?: number) => void;
}

function processNode(
  node: Node,
  options: FilterOptions,
  callbacks: ProcessCallbacks
) {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();

      // Check structural tags
      if (/^h[1-6]$/.test(tag)) {
        if (!options.keepHeadings) {
          if (options.headingHandling === 'flatten_to_bold') {
            const p = el.ownerDocument.createElement('p');
            const strong = el.ownerDocument.createElement('strong');
            while (el.firstChild) {
              strong.appendChild(el.firstChild);
            }
            p.appendChild(strong);
            el.parentNode?.replaceChild(p, el);
            processNode(p, options, callbacks);
            callbacks.onTagRemoved(tag);
            continue;
          } else {
            // flatten to p
            const p = el.ownerDocument.createElement('p');
            while (el.firstChild) {
              p.appendChild(el.firstChild);
            }
            el.parentNode?.replaceChild(p, el);
            processNode(p, options, callbacks);
            callbacks.onTagRemoved(tag);
            continue;
          }
        }
      }

      // Emphasis tags
      if ((tag === 'b' || tag === 'strong') && !options.keepBold) {
        unwrap(el);
        callbacks.onTagRemoved(tag);
        continue;
      }
      if ((tag === 'i' || tag === 'em') && !options.keepItalic) {
        unwrap(el);
        callbacks.onTagRemoved(tag);
        continue;
      }
      if (tag === 'u' && !options.keepUnderline) {
        unwrap(el);
        callbacks.onTagRemoved(tag);
        continue;
      }
      if ((tag === 's' || tag === 'strike' || tag === 'del') && !options.keepStrikethrough) {
        unwrap(el);
        callbacks.onTagRemoved(tag);
        continue;
      }
      if ((tag === 'sub' || tag === 'sup') && !options.keepSubSuper) {
        unwrap(el);
        callbacks.onTagRemoved(tag);
        continue;
      }
      if (tag === 'code' && !options.keepInlineCode && el.parentElement?.tagName.toLowerCase() !== 'pre') {
        unwrap(el);
        callbacks.onTagRemoved(tag);
        continue;
      }

      // Pre / Code blocks
      if (tag === 'pre' && !options.keepCodeBlocks) {
        const p = el.ownerDocument.createElement('p');
        p.textContent = el.textContent || '';
        el.parentNode?.replaceChild(p, el);
        callbacks.onTagRemoved(tag);
        continue;
      }

      // Blockquote
      if (tag === 'blockquote' && !options.keepBlockquotes) {
        const p = el.ownerDocument.createElement('p');
        while (el.firstChild) {
          p.appendChild(el.firstChild);
        }
        el.parentNode?.replaceChild(p, el);
        processNode(p, options, callbacks);
        callbacks.onTagRemoved(tag);
        continue;
      }

      // Horizontal Rules
      if (tag === 'hr' && !options.keepHorizontalRules) {
        el.parentNode?.removeChild(el);
        callbacks.onTagRemoved(tag);
        continue;
      }

      // Lists
      if (tag === 'ul' && !options.keepUnorderedLists) {
        flattenList(el, 'bullet');
        callbacks.onTagRemoved(tag);
        continue;
      }
      if (tag === 'ol' && !options.keepOrderedLists) {
        flattenList(el, 'number');
        callbacks.onTagRemoved(tag);
        continue;
      }

      // Tables
      if (tag === 'table') {
        if (!options.keepTables || options.tableHandling === 'flatten_to_text') {
          flattenTableToText(el);
          callbacks.onTagRemoved(tag);
          continue;
        } else {
          cleanTableAttributes(el);
        }
      }

      // Links
      if (tag === 'a') {
        if (!options.keepLinks) {
          unwrap(el);
          callbacks.onTagRemoved('a');
          continue;
        } else {
          sanitizeLink(el as HTMLAnchorElement, options, callbacks);
        }
      }

      // Images
      if (tag === 'img') {
        if (!options.keepImages) {
          el.parentNode?.removeChild(el);
          callbacks.onTagRemoved('img');
          continue;
        } else {
          cleanImageAttributes(el as HTMLImageElement);
        }
      }

      // Generic container unwrap if span / font / center
      if (tag === 'font' || tag === 'center') {
        unwrap(el);
        callbacks.onTagRemoved(tag);
        continue;
      }

      if (tag === 'span' && options.stripInlineStyles) {
        // If span has no attributes left or only stripped ones, unwrap it
        unwrap(el);
        continue;
      }

      // Strip attributes & inline styles
      sanitizeAttributes(el, options, callbacks);

      // Recursive descent
      processNode(el, options, callbacks);
    }
  }
}

function unwrap(el: HTMLElement) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function flattenList(listEl: HTMLElement, type: 'bullet' | 'number') {
  const parent = listEl.parentNode;
  if (!parent) return;

  const items = Array.from(listEl.querySelectorAll('li'));
  let idx = 1;
  for (const li of items) {
    const p = listEl.ownerDocument.createElement('p');
    const prefix = type === 'bullet' ? '• ' : `${idx++}. `;
    p.textContent = prefix + (li.textContent?.trim() || '');
    parent.insertBefore(p, listEl);
  }
  parent.removeChild(listEl);
}

function flattenTableToText(tableEl: HTMLElement) {
  const parent = tableEl.parentNode;
  if (!parent) return;

  const rows = Array.from(tableEl.querySelectorAll('tr'));
  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('th, td'));
    const line = cells.map((c) => c.textContent?.trim() || '').join(' | ');
    if (line) {
      const p = tableEl.ownerDocument.createElement('p');
      p.textContent = line;
      parent.insertBefore(p, tableEl);
    }
  }
  parent.removeChild(tableEl);
}

function cleanTableAttributes(tableEl: HTMLElement) {
  tableEl.removeAttribute('width');
  tableEl.removeAttribute('height');
  tableEl.removeAttribute('border');
  tableEl.removeAttribute('cellspacing');
  tableEl.removeAttribute('cellpadding');
  tableEl.removeAttribute('style');
  tableEl.removeAttribute('bgcolor');

  const allCells = Array.from(tableEl.querySelectorAll('th, td, tr, thead, tbody, tfoot'));
  for (const cell of allCells) {
    cell.removeAttribute('style');
    cell.removeAttribute('width');
    cell.removeAttribute('height');
    cell.removeAttribute('bgcolor');
    cell.removeAttribute('align');
    cell.removeAttribute('valign');
  }
}

function cleanImageAttributes(img: HTMLImageElement) {
  const allowedAttrs = ['src', 'alt', 'title'];
  for (const attr of Array.from(img.attributes)) {
    if (!allowedAttrs.includes(attr.name.toLowerCase())) {
      img.removeAttribute(attr.name);
    }
  }
  // Remove 1x1 tracking beacons
  const width = img.getAttribute('width');
  const height = img.getAttribute('height');
  if (width === '1' && height === '1') {
    img.parentNode?.removeChild(img);
  }
}

function sanitizeLink(
  link: HTMLAnchorElement,
  options: FilterOptions,
  callbacks: ProcessCallbacks
) {
  let href = link.getAttribute('href') || '';

  // Prevent javascript: / data: xss urls
  if (/^(javascript|vbscript|data):/i.test(href.trim())) {
    link.removeAttribute('href');
    return;
  }

  if (options.stripTrackingParams && href.includes('?')) {
    try {
      // Support relative and absolute URLs
      const dummyBase = 'https://example.com';
      const isRelative = !href.startsWith('http://') && !href.startsWith('https://');
      const url = new URL(href, dummyBase);

      let paramsStripped = 0;
      const keysToDelete: string[] = [];
      url.searchParams.forEach((_, key) => {
        if (TRACKING_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith('utm_')) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach((key) => {
        url.searchParams.delete(key);
        paramsStripped++;
      });

      if (paramsStripped > 0) {
        callbacks.onTrackingParamRemoved(paramsStripped);
        const search = url.searchParams.toString();
        const pathAndQuery = url.pathname + (search ? `?${search}` : '') + url.hash;
        if (isRelative) {
          link.setAttribute('href', pathAndQuery);
        } else {
          link.setAttribute('href', url.origin + pathAndQuery);
        }
      }
    } catch {
      // Ignore URL parse errors
    }
  }

  if (options.openLinksInNewTab) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
}

function sanitizeAttributes(
  el: HTMLElement,
  options: FilterOptions,
  callbacks: ProcessCallbacks
) {
  // Strip classes & IDs
  if (options.stripClassesAndIds) {
    el.removeAttribute('class');
    el.removeAttribute('id');
  }

  // Security: always remove inline event handlers (onclick, onload, etc.)
  for (const attr of Array.from(el.attributes)) {
    if (attr.name.toLowerCase().startsWith('on')) {
      el.removeAttribute(attr.name);
    }
  }

  // Handle inline styles
  if (options.stripInlineStyles) {
    if (el.hasAttribute('style')) {
      el.removeAttribute('style');
      callbacks.onStyleStripped(1);
    }
    return;
  }

  // Granular style filtering if not stripping entire style attribute
  const styleAttr = el.getAttribute('style');
  if (styleAttr) {
    let styles = styleAttr.split(';').map((s) => s.trim()).filter(Boolean);
    const initialCount = styles.length;

    styles = styles.filter((rule) => {
      const colonIdx = rule.indexOf(':');
      if (colonIdx === -1) return false;
      const prop = rule.slice(0, colonIdx).trim().toLowerCase();

      if (options.stripFontFamily && prop === 'font-family') return false;
      if (options.stripFontSize && prop === 'font-size') return false;
      if (options.stripTextColor && (prop === 'color' || prop === '-webkit-text-fill-color')) return false;
      if (
        options.stripBackgroundColor &&
        (prop === 'background' ||
          prop === 'background-color' ||
          prop === 'background-image')
      )
        return false;

      return true;
    });

    const stripped = initialCount - styles.length;
    if (stripped > 0) {
      callbacks.onStyleStripped(stripped);
    }

    if (styles.length > 0) {
      el.setAttribute('style', styles.join('; '));
    } else {
      el.removeAttribute('style');
    }
  }
}

function cleanEmptyNodes(root: HTMLElement) {
  // Remove empty span, b, i, u, s, p, div tags with no meaningful text or children
  const emptyCandidates = root.querySelectorAll('span, b, strong, i, em, u, s, p, div, a');
  for (const node of Array.from(emptyCandidates)) {
    const tag = node.tagName.toLowerCase();
    // Do not remove if it contains an image or hr
    if (node.querySelector('img, hr, br, table, input')) continue;
    if (!node.textContent || node.textContent.trim() === '') {
      node.parentNode?.removeChild(node);
    }
  }
}

function getCleanPlainText(root: HTMLElement, options: FilterOptions): string {
  // Create clone to format plain text with linebreaks
  const clone = root.cloneNode(true) as HTMLElement;

  // Insert explicit linebreaks before block elements
  const blockEls = clone.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, tr');
  for (const block of Array.from(blockEls)) {
    const newline = clone.ownerDocument.createTextNode('\n');
    block.parentNode?.insertBefore(newline, block);
  }

  let text = clone.textContent || '';

  if (options.collapseBlankLines) {
    text = text.replace(/\n{3,}/g, '\n\n').trim();
  }

  return text;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

