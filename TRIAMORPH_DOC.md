# PasteMagic — Smart Clipboard Styling Sanitizer
**Product Case Study & Technical Documentation for Tria Morph Systems**

- **Live Application:** [https://pastemagic.vercel.app/](https://pastemagic.vercel.app/)
- **Source Repository:** [https://github.com/triamorphsystems/pastemagic](https://github.com/triamorphsystems/pastemagic)
- **Built By:** Tria Morph Systems
- **Target Audience:** Developers, writers, researchers, students, and professionals copying rich text into Google Docs, Microsoft Word, Notion, Slack, and email.

---

## 1. Executive Summary

When copying text from modern web pages, Google Docs, or Microsoft Office documents, users don’t just copy words—they copy dozens of hidden, intrusive styling rules: garish colors, inconsistent font sizes, Comic Sans or Times New Roman overrides, highlighter backgrounds, and tracking parameters appended to links.

The universal workaround has always been pasting into **Notepad** first. However, Notepad is a sledgehammer: it obliterates *all* formatting, stripping the bold emphasis, italics, bullet points, numbered lists, headings, and hyperlinks that the user actually wanted to keep.

**PasteMagic** is a fast, 100% client-side web application that acts as a surgical filter between messy sources and clean documents. It gives users immediate, granular control over which styles to keep and which to strip—complete with zero-friction global hotkeys (`Ctrl+V` to auto-paste and clean, `Ctrl+C` to auto-copy the sanitized version).

---

## 2. The Problem

| Problem Dimension | What Happens in the Clipboard | User Impact |
| :--- | :--- | :--- |
| **Bloated Inline Styles** | Elements arrive with `style="font-family: Arial; font-size: 13.5px; color: #333; background-color: #fff2cc;"` | Pasting into a formatted Google Doc or Word document destroys document styling consistency. |
| **Tracking Pollution** | Hyperlinks contain marketing tags: `?utm_source=newsletter&utm_medium=email&fbclid=...` | Messy, bloated links that track users across the web. |
| **Office/XML Cruft** | Word pastes include `class="MsoNormal"`, `<!--[if gte mso 9]>`, and Office XML tags. | Incompatible markup that breaks CMS editors and web formatting. |
| **Invisible Artifacts** | Zero-width spaces (`\u200B`), non-breaking spaces (`&nbsp;`), and curly "smart" quotes. | Broken code snippets, failed regex searches, and corrupted text encoding. |
| **The Notepad Trap** | Pasting into plain text strips colors, but also destroys headings, lists, tables, and links. | Users spend minutes manually re-bolding and re-linking documents. |

---

## 3. The PasteMagic Solution

PasteMagic provides a clean, two-pane studio workspace:
1. **Always-On Essential Checkboxes**: Prominent toggles right on top of the workspace:
   - **Bold** (`<strong>`, `<b>`)
   - **Italic** (`<em>`, `<i>`)
   - **Underline** (`<u>`)
   - **Lists** (`<ul>`, `<ol>`, `<li>`)
   - **Headings** (`<h1>`–`<h6>`)
   - **Links** (`<a>`)
2. **Automatic Background Sanitization**:
   - Strips all font families and custom font sizes.
   - Cleans inline text colors and highlighter backgrounds.
   - Strips marketing query parameters (`utm_*`, `fbclid`, `gclid`).
   - Straightens curly quotes (`“”` $\rightarrow$ `""`, `‘’` $\rightarrow$ `''`).
   - Strips Microsoft Word and Google Docs XML cruft.
3. **Zero-Friction Hotkey Loop**:
   - **Global Auto-Paste (`Ctrl+V` / `⌘+V`)**: Pressing `Ctrl+V` anywhere on the page automatically captures the clipboard, populates the input, and runs sanitization with 0ms latency.
   - **Global Auto-Copy (`Ctrl+C` / `⌘+C`)**: Pressing `Ctrl+C` anywhere on the page automatically writes the clean, formatted rich text back to the system clipboard.
4. **Multi-Format Export**:
   - **Visual WYSIWYG Preview**: Exact representation of how text will paste into Google Docs or Word.
   - **Rich Text Copy**: Uses the modern `ClipboardItem` API to write both `text/html` and `text/plain` simultaneously.
   - **Clean Markdown**: Zero-dependency transformer generating clean GitHub-flavored Markdown.
   - **Clean HTML**: Pristine, semantic markup free of inline CSS.
   - **Sanitized Plain Text**: Straightened plain text with collapsed line breaks.

---

## 4. Architecture & Technical Implementation

```
                                  PasteMagic System Architecture
                                  
      [ User Clipboard ] (Web / Word / Google Docs)
              │
              ▼
    [ Global Paste Handler ] (Ctrl+V anywhere on window)
              │
              ▼
   ┌─────────────────────────────────────────────────────────────┐
   │             PasteMagic Core Sanitization Engine              │
   ├─────────────────────────────────────────────────────────────┤
   │  1. Preprocessing                                           │
   │     • Strip Word XML namespaces (<o:p>, <w:WordDocument>)   │
   │     • Straighten smart quotes ("" and '')                   │
   │     • Remove invisible zero-width spaces (\u200B, \uFEFF)   │
   │     • Normalize non-breaking spaces (&nbsp; -> space)       │
   │                                                             │
   │  2. Sandboxed DOM Traversal (Native DOMParser)              │
   │     • Convert Google Docs styled spans into <strong> & <em> │
   │     • Filter tags against user options (bold, italic, etc.) │
   │     • Strip inline styles (font-family, color, background)  │
   │     • Clean URLs: sanitize tracking queries (UTM/fbclid)    │
   │     • Security: neutralize dangerous schemes (javascript:)  │
   │                                                             │
   │  3. Post-Processing & Normalization                         │
   │     • Prune empty spans and wrapper tags                    │
   │     • Collapse consecutive blank lines                      │
   └─────────────────────────────────────────────────────────────┘
              │
              ├────────────────────────┬────────────────────────┐
              ▼                        ▼                        ▼
     [ Visual Preview ]       [ Markdown Engine ]     [ Plain Text Engine ]
     Document Typography      GFM Syntax Generator    Collapsed Linebreaks
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                                       ▼
                   [ Multi-MIME ClipboardItem Writer ]
                   navigator.clipboard.write([
                     new ClipboardItem({ "text/html": ..., "text/plain": ... })
                   ])
                                       │
                                       ▼
       [ Clean Paste into Destination ] (Google Docs, Word, Notion, Slack)
```

### Key Technical Decisions

#### A. DOMParser Sandboxing
Instead of using regex replacement for HTML manipulation (which is notoriously fragile and insecure), PasteMagic feeds raw input into the browser’s native `DOMParser()`. This creates an isolated DOM tree inside browser memory without executing any embedded scripts or rendering external stylesheets.

#### B. Google Docs Nested Span Recovery
Google Docs formats text using deeply nested `<span>` elements with inline CSS (e.g., `<span style="font-weight: 700; font-style: italic;">`). PasteMagic inspects these computed style values and lifts them into semantic `<strong>` and `<em>` tags before removing the spans, preserving intentional formatting while eliminating junk CSS.

#### C. Asynchronous Multi-MIME Clipboard API
When the user clicks "Copy Formatted" or hits `Ctrl+C`, PasteMagic leverages:
```ts
const item = new ClipboardItem({
  'text/html': new Blob([cleanHtml], { type: 'text/html' }),
  'text/plain': new Blob([cleanText], { type: 'text/plain' })
});
await navigator.clipboard.write([item]);
```
This ensures destination applications receive the format they prefer: rich text editors (Docs, Word, Notion, Mail) render the clean bolding and lists, while terminal windows or code editors receive the clean plain-text fallback.

---

## 5. UI/UX Design & The Unslopping Process

PasteMagic was refined using the **`unslop`** design methodology to avoid the common tropes of AI-generated interfaces:
- **No Purple Gradients or Glowing Blobs**: Grounded on a timeless, tactile neutral palette (Graphite `#141415` for dark mode, crisp `#ffffff` on `#f8fafc` for light mode).
- **Strict 4px Rhythm**: All paddings, margins, gaps, and heights follow a strict 4px grid.
- **Typography**: Paired **Inter** for clean interface text with **JetBrains Mono** for code snippets and telemetry counters.
- **No Floating Marketing Noise**: Replaced promotional badges and step boxes with an efficient, focused workbench layout.
- **Prominent Segmented Theme Switcher**: Explicit `[ ☀️ Light ] [ 🌙 Dark ]` toggle in the header, configured with Tailwind v4 class-based overrides (`@custom-variant dark (&:where(.dark, .dark *));`) so light mode renders with pure contrast regardless of OS defaults.

---

## 6. Verification, Testing & Performance

- **Automated Test Suite**: 8 unit test suites in `vitest` covering:
  - Inline style stripping while preserving semantic tags.
  - Google Docs span-to-tag conversion.
  - Tracking parameter removal from links.
  - Smart quote straightening and zero-width space removal.
  - Microsoft Word `MsoNormal` and XML artifact cleaning.
  - Heading flattening algorithms.
  - HTML-to-Markdown conversion fidelity.
  - Preset integrity tests.
- **Build Performance**:
  - Bundled with Vite 8.
  - Total production CSS: **38.72 kB** (gzip: 7.25 kB).
  - Total production JS: **292.43 kB** (gzip: 86.19 kB).
  - Production build time: **<700ms**.
- **Privacy Guarantee**:
  - Zero external API dependencies.
  - Zero telemetry or network tracking.
  - 100% of sanitization, parsing, and clipboard interactions occur exclusively in the user’s local browser memory.

---

## 7. Deployment & Hosting

The project is deployed on **Vercel** with continuous deployment from GitHub:
- **Production URL:** [https://pastemagic.vercel.app/](https://pastemagic.vercel.app/)
- **Configuration:** `vercel.json` provides SPA routing rewrites and 1-year immutable caching for static assets.
- **Repository:** [https://github.com/triamorphsystems/pastemagic](https://github.com/triamorphsystems/pastemagic)

---

*Authored by Tria Morph Systems · 2026*

