/**
 * Slack uses &, <, and > as control characters for special parsing in text objects,
 * so they must be converted to HTML entities.
 *
 */
export const escapeMarkdown = (str: string): string => {
  return str.replace(/[`*_~&<>]/g, (matched) => {
    switch (matched) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      default:
        return `\\${matched}`;
    }
  });
};
