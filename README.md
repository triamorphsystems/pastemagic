# 🪄 PasteMagic — Smart Clipboard Styling Sanitizer

> **Keep the styling you need, strip the junk you don't.**  
> A surgical, client-side clipboard filter between messy web pages and your clean documents.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-8%20passed-success)]()
[![Zero Cloud Leakage](https://img.shields.io/badge/privacy-100%25%20client--side-blue)]()
[![License](https://img.shields.io/badge/license-MIT-purple)]()

---

## 🎯 The Problem

When you copy text from modern websites, blogs, Microsoft Word, or Google Docs, you don't just copy words—you copy dozens of invisible, unwanted styling rules:
- Unwanted custom font families (*Comic Sans*, *Times New Roman*, *Impact*)
- Garish neon highlighter colors and dark/light background fills
- Inconsistent font sizes (*13.7px*, *28pt*)
- Massive tracking URLs embedded in links (`utm_source`, `utm_campaign`, `fbclid`, `gclid`)
- Microsoft Word XML wrappers (`class="MsoNormal"`, `mso-pagination`)
- Google Docs nested `<span>` hierarchies
- Curly smart quotes that break code and zero-width spaces (`\u200B`)

### Why Notepad isn't the solution
Using **Notepad** is the old-school workaround, but it acts like a sledgehammer: it obliterates **everything**, including your **bold emphasis**, *italics*, bullet points, numbered lists, headings, and working hyperlinks. You end up wasting time manually reformatting the text.

### The PasteMagic Solution
**PasteMagic** is a surgical clipboard sanitizer. It lets you select exactly which styling you want to preserve and which to strip—or simply use one-click presets like **Doc Ready**.

---

## ✨ Features

- **⚡ Instant 1-Click Presets**:
  - **Doc Ready (Popular)**: Keeps bold, italics, headings, lists, tables, code, and clean links. Strips all font families, font sizes, colors, and background highlights.
  - **Pure Semantic**: 100% clean HTML tags (`H1-H6`, `p`, `ul`, `ol`, `a`, `b`, `i`) with zero inline CSS or classes.
  - **Minimal Notes**: Preserves only basic bold, italics, bullets, and links; flattens headings to bold.
  - **Text + Links**: Strips all styling but preserves clean hyperlinks.
  - **Sanitized Plain**: Standard plain text with straightened quotes, non-breaking space normalization, and zero-width characters removed.
- **🎛️ Granular Rule Controls**:
  - **Inline Emphasis**: Bold (`<strong>`), Italic (`<em>`), Underline (`<u>`), Strikethrough (`<s>`), Sub/Superscript (`<sub>`/`<sup>`), Inline code (`<code>`).
  - **Structure**: Headings (`H1`-`H6`, option to preserve, flatten to bold, or flatten to plain text), Blockquotes, Code blocks (`<pre>`), Divider lines (`<hr>`).
  - **Lists & Tables**: Unordered lists (`<ul>`), Ordered lists (`<ol>`), Data tables (clean semantic tables vs flatten to text).
  - **Links & Tracking**: Keep links, strip tracking parameters (`utm_*`, `fbclid`, `gclid`, etc.), open links in new tabs (`target="_blank"`), preserve or strip images.
  - **CSS & Colors**: Strip font families, strip font sizes, strip text colors, strip background highlights, strip all inline `style="..."` attributes, strip `class` and `id` attributes.
  - **Deep Clean**: Straighten smart quotes (`“”` $\rightarrow$ `""`), delete invisible zero-width characters (`\u200B`), normalize non-breaking spaces (`&nbsp;` $\rightarrow$ ` `), collapse redundant blank lines, prune empty tags, strip Word & Docs XML cruft.
- **📋 Real Rich Clipboard Copying**:
  - The **"Copy Formatted"** primary button copies both `text/html` and `text/plain` to the system clipboard via the modern Async Clipboard API (`ClipboardItem`). When you paste into Google Docs, Word, Apple Notes, Notion, Slack, or Gmail, the clean formatting is seamlessly applied!
  - Secondary 1-click copy options: **Copy Markdown**, **Copy HTML**, **Copy Plain Text**.
- **📊 Sanitization Report & Stats**:
  - Live metric of characters saved, percentage reduction, style rules stripped, tracking tags removed, and exact tags cleaned.
- **🕒 Local History & Privacy**:
  - Automatic local history of recent pastes stored in `localStorage`.
  - **100% Client-Side**: No servers, no tracking, zero clipboard data ever leaves your device.
- **⌨️ Keyboard Shortcuts**:
  - `Ctrl + V` / `Cmd + V`: Paste rich clipboard
  - `Ctrl + Enter` / `Cmd + Enter`: Copy clean formatted rich text
  - `Alt + M`: Copy clean Markdown
  - `Alt + H`: Copy clean HTML
  - `Alt + T`: Copy plain text
  - `Alt + C`: Clear editor

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v22.16.0)
- npm 9+

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd "PasteMagic"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Run automated test suite:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   ```
   The production-ready static assets will be in `dist/`.

---

## 🛠️ Tech Stack & Architecture

- **UI Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8 + Vitest
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Animation & Delight**: Canvas Confetti
- **Testing**: Vitest with JSDOM environment
- **Clipboard Engine**: Asynchronous Clipboard API (`ClipboardItem`) with DOM fallback

---

## 📜 License

MIT License. Designed and crafted with precision.
