/**
 * Converts cleaned HTML into clean Markdown without heavy external dependencies.
 */
export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return nodeToMarkdown(doc.body).trim();
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  // Child content recursive
  const getChildrenMarkdown = () => {
    return Array.from(el.childNodes)
      .map(nodeToMarkdown)
      .join('');
  };

  switch (tag) {
    case 'h1':
      return `\n\n# ${getChildrenMarkdown().trim()}\n\n`;
    case 'h2':
      return `\n\n## ${getChildrenMarkdown().trim()}\n\n`;
    case 'h3':
      return `\n\n### ${getChildrenMarkdown().trim()}\n\n`;
    case 'h4':
      return `\n\n#### ${getChildrenMarkdown().trim()}\n\n`;
    case 'h5':
      return `\n\n##### ${getChildrenMarkdown().trim()}\n\n`;
    case 'h6':
      return `\n\n###### ${getChildrenMarkdown().trim()}\n\n`;

    case 'p': {
      const content = getChildrenMarkdown().trim();
      return content ? `\n\n${content}\n\n` : '\n';
    }

    case 'br':
      return '  \n';

    case 'hr':
      return '\n\n---\n\n';

    case 'strong':
    case 'b': {
      const content = getChildrenMarkdown().trim();
      return content ? `**${content}**` : '';
    }

    case 'em':
    case 'i': {
      const content = getChildrenMarkdown().trim();
      return content ? `*${content}*` : '';
    }

    case 's':
    case 'strike':
    case 'del': {
      const content = getChildrenMarkdown().trim();
      return content ? `~~${content}~~` : '';
    }

    case 'u': {
      // Markdown doesn't have standard underline, keeping content or HTML u
      const content = getChildrenMarkdown().trim();
      return content ? `_${content}_` : '';
    }

    case 'code': {
      // If parent is PRE, handled in pre
      if (el.parentElement?.tagName.toLowerCase() === 'pre') {
        return el.textContent || '';
      }
      const code = el.textContent || '';
      return code ? `\`${code}\`` : '';
    }

    case 'pre': {
      const codeEl = el.querySelector('code');
      const text = codeEl ? codeEl.textContent : el.textContent;
      return `\n\n\`\`\`\n${text?.trim() || ''}\n\`\`\`\n\n`;
    }

    case 'blockquote': {
      const inner = getChildrenMarkdown().trim();
      const quoted = inner
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
      return `\n\n${quoted}\n\n`;
    }

    case 'a': {
      const href = el.getAttribute('href') || '';
      const text = getChildrenMarkdown().trim() || href;
      if (!href) return text;
      return `[${text}](${href})`;
    }

    case 'img': {
      const src = el.getAttribute('src') || '';
      const alt = el.getAttribute('alt') || 'image';
      return src ? `![${alt}](${src})` : '';
    }

    case 'ul': {
      const items = Array.from(el.children)
        .filter((c) => c.tagName.toLowerCase() === 'li')
        .map((li) => {
          const itemText = nodeToMarkdown(li).trim();
          return `- ${itemText.replace(/\n/g, '\n  ')}`;
        })
        .join('\n');
      return `\n\n${items}\n\n`;
    }

    case 'ol': {
      let idx = 1;
      const items = Array.from(el.children)
        .filter((c) => c.tagName.toLowerCase() === 'li')
        .map((li) => {
          const itemText = nodeToMarkdown(li).trim();
          return `${idx++}. ${itemText.replace(/\n/g, '\n   ')}`;
        })
        .join('\n');
      return `\n\n${items}\n\n`;
    }

    case 'li':
      return getChildrenMarkdown();

    case 'table': {
      const rows = Array.from(el.querySelectorAll('tr'));
      if (rows.length === 0) return '';

      let mdTable = '\n\n';
      const matrix: string[][] = [];

      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('th, td')).map((cell) =>
          cell.textContent?.trim().replace(/\|/g, '\\|') || ''
        );
        if (cells.length > 0) {
          matrix.push(cells);
        }
      });

      if (matrix.length === 0) return '';

      const colCount = Math.max(...matrix.map((r) => r.length));

      // Header row
      const headerRow = matrix[0];
      while (headerRow.length < colCount) headerRow.push('');
      mdTable += `| ${headerRow.join(' | ')} |\n`;
      mdTable += `| ${new Array(colCount).fill('---').join(' | ')} |\n`;

      // Data rows
      for (let i = 1; i < matrix.length; i++) {
        const row = matrix[i];
        while (row.length < colCount) row.push('');
        mdTable += `| ${row.join(' | ')} |\n`;
      }

      return mdTable + '\n';
    }

    default:
      return getChildrenMarkdown();
  }
}

