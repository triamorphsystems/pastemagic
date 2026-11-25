import { describe, it, expect } from 'vitest';
import { sanitizeContent } from '../utils/sanitizer';
import { DEFAULT_FILTER_OPTIONS, PRESETS } from '../utils/presets';
import { htmlToMarkdown } from '../utils/toMarkdown';

describe('PasteMagic Sanitizer Engine', () => {
  it('strips inline styles (font-family, color, background) while preserving bold and italic tags', () => {
    const raw = `<p style="font-family: 'Comic Sans MS'; color: red; background-color: yellow;">
      Hello <b style="font-size: 24px; color: blue;">World</b> and <em style="color: green;">Everyone</em>!
    </p>`;

    const res = sanitizeContent(raw, DEFAULT_FILTER_OPTIONS);

    expect(res.cleanHtml).toContain('<b>World</b>');
    expect(res.cleanHtml).toContain('<em>Everyone</em>');
    expect(res.cleanHtml).not.toContain('Comic Sans MS');
    expect(res.cleanHtml).not.toContain('background-color');
    expect(res.cleanHtml).not.toContain('color: red');
  });

  it('normalizes Google Docs styled spans into semantic strong and em tags', () => {
    const raw = `<div>
      <span style="font-weight: 700; font-family: Arial;">Important Note</span>
      <span style="font-style: italic; font-size: 14pt;">Secondary Note</span>
    </div>`;

    const res = sanitizeContent(raw, DEFAULT_FILTER_OPTIONS);

    expect(res.cleanHtml).toContain('<strong>Important Note</strong>');
    expect(res.cleanHtml).toContain('<em>Secondary Note</em>');
    expect(res.cleanHtml).not.toContain('font-family: Arial');
  });

  it('strips tracking query parameters from links while keeping the anchor text and clean URL', () => {
    const raw = `<p>Check out our <a href="https://example.com/pricing?utm_source=twitter&utm_medium=cpc&fbclid=12345&foo=bar">Pricing Page</a>.</p>`;

    const res = sanitizeContent(raw, {
      ...DEFAULT_FILTER_OPTIONS,
      keepLinks: true,
      stripTrackingParams: true,
    });

    expect(res.cleanHtml).toContain('href="https://example.com/pricing?foo=bar"');
    expect(res.cleanHtml).not.toContain('utm_source');
    expect(res.cleanHtml).not.toContain('fbclid');
    expect(res.stats.trackingParamsRemovedCount).toBeGreaterThanOrEqual(2);
  });

  it('straightens smart quotes and removes zero-width spaces', () => {
    const raw = `<p>“Smart quotes” and ‘single quotes’ with zero\u200Bwidth\uFEFFspaces.</p>`;

    const res = sanitizeContent(raw, {
      ...DEFAULT_FILTER_OPTIONS,
      straightenQuotes: true,
      removeZeroWidthChars: true,
    });

    expect(res.cleanHtml).toContain('"Smart quotes"');
    expect(res.cleanHtml).toContain("'single quotes'");
    expect(res.cleanHtml).not.toContain('\u200B');
    expect(res.cleanHtml).not.toContain('\uFEFF');
  });

  it('strips Microsoft Word MsoNormal and XML artifacts', () => {
    const raw = `<!--[if gte mso 9]><xml><w:WordDocument></w:WordDocument></xml><![endif]-->
      <p class="MsoNormal" style="mso-margin-top-alt:auto;">Hello from Word</p>`;

    const res = sanitizeContent(raw, DEFAULT_FILTER_OPTIONS);

    expect(res.cleanHtml).not.toContain('MsoNormal');
    expect(res.cleanHtml).not.toContain('WordDocument');
    expect(res.cleanHtml).toContain('Hello from Word');
  });

  it('flattens headings when keepHeadings is false and headingHandling is flatten_to_bold', () => {
    const raw = `<h2>Quarterly Objectives</h2><p>Here are the goals.</p>`;

    const res = sanitizeContent(raw, {
      ...DEFAULT_FILTER_OPTIONS,
      keepHeadings: false,
      headingHandling: 'flatten_to_bold',
    });

    expect(res.cleanHtml).not.toContain('<h2>');
    expect(res.cleanHtml).toContain('<strong>Quarterly Objectives</strong>');
  });

  it('converts clean HTML to Markdown accurately', () => {
    const html = `<h2>Header 2</h2>
      <p>This is <strong>bold</strong> and <em>italic</em>.</p>
      <ul><li>Item A</li><li>Item B</li></ul>
      <p><a href="https://example.com">Visit Site</a></p>`;

    const md = htmlToMarkdown(html);

    expect(md).toContain('## Header 2');
    expect(md).toContain('**bold**');
    expect(md).toContain('*italic*');
    expect(md).toContain('- Item A');
    expect(md).toContain('- Item B');
    expect(md).toContain('[Visit Site](https://example.com)');
  });

  it('Plain Ultra Clean preset strips all markup and returns sanitized plain text', () => {
    const plainPreset = PRESETS.find((p) => p.id === 'plain-ultra-clean')!;
    const raw = `<h1>Title</h1><p><b>Bold</b> text with <a href="https://test.com">a link</a>.</p>`;

    const res = sanitizeContent(raw, plainPreset.options);

    expect(res.cleanHtml).not.toContain('<h1>');
    expect(res.cleanHtml).not.toContain('<b>');
    expect(res.cleanHtml).not.toContain('<a href');
    expect(res.cleanText).toContain('Title');
    expect(res.cleanText).toContain('Bold text with a link');
  });
});
