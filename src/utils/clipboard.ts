/**
 * Rich text clipboard helper
 */
export async function copyRichText(
  cleanHtml: string,
  cleanText: string
): Promise<boolean> {
  // Try modern Async Clipboard API first
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const htmlBlob = new Blob([cleanHtml], { type: 'text/html' });
      const textBlob = new Blob([cleanText], { type: 'text/plain' });

      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });

      await navigator.clipboard.write([item]);
      return true;
    } catch (err) {
      console.warn('ClipboardItem write failed, falling back to execCommand:', err);
    }
  }

  // Fallback: Use hidden contenteditable element
  try {
    const container = document.createElement('div');
    container.contentEditable = 'true';
    container.innerHTML = cleanHtml;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.opacity = '0';
    document.body.appendChild(container);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection?.removeAllRanges();
    selection?.addRange(range);

    const successful = document.execCommand('copy');
    selection?.removeAllRanges();
    document.body.removeChild(container);

    if (successful) return true;
  } catch (err) {
    console.error('Fallback execCommand copy failed:', err);
  }

  // Last resort: copy plain text
  return copyPlainText(cleanText);
}

export async function copyPlainText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}

export interface ReadClipboardResult {
  html: string;
  text: string;
}

export async function readClipboard(): Promise<ReadClipboardResult | null> {
  if (!navigator.clipboard?.read) {
    // If read() is not supported, try readText()
    if (navigator.clipboard?.readText) {
      try {
        const text = await navigator.clipboard.readText();
        return { html: '', text };
      } catch {
        return null;
      }
    }
    return null;
  }

  try {
    const items = await navigator.clipboard.read();
    let html = '';
    let text = '';

    for (const item of items) {
      if (item.types.includes('text/html')) {
        const blob = await item.getType('text/html');
        html = await blob.text();
      }
      if (item.types.includes('text/plain')) {
        const blob = await item.getType('text/plain');
        text = await blob.text();
      }
    }

    return { html, text };
  } catch (err) {
    console.warn('Could not read rich clipboard data:', err);
    // Fall back to plain text read
    if (navigator.clipboard?.readText) {
      try {
        const text = await navigator.clipboard.readText();
        return { html: '', text };
      } catch {
        return null;
      }
    }
    return null;
  }
}

