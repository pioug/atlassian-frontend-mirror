import { TextToken } from '../tokenize';

/**
 * In Jira, following characters are escaped
 * private static final Pattern ESCAPING_PATTERN = Pattern.compile("(^|(?<!\\\\))\\\\([\\-\\#\\*\\_\\+\\?\\^\\~\\|\\%\\{\\}\\[\\]\\(\\)\\!\\@])");
 * https://stash.atlassian.com/projects/JIRACLOUD/repos/jira/browse/jira-components/jira-renderer/src/main/java/com/atlassian/renderer/v2/components/BackslashEscapeRendererComponent.java
 */
const escapedChar = [
  '-',
  '#',
  '*',
  '_',
  '+',
  '?',
  '^',
  '~',
  '|',
  '%',
  '{',
  '}',
  '[',
  ']',
  '(',
  ')',
  '!',
  '@',
];

export function escapeHandler(input: string, position: number): TextToken {
  let buffer = [];
  const char = input.charAt(position);
  const prevChar = input.charAt(position - 1);
  const nextChar = input.charAt(position + 1);
  /**
   * Ported from Jira:
   * If previous char is also a backslash, then this is not a valid escape
   */
  if (escapedChar.indexOf(nextChar) === -1 || prevChar === '\\') {
    // Insert \ in buffer mode
    buffer.push(char);
  }
  buffer.push(nextChar);

  return {
    type: 'text',
    text: buffer.join(''),
    length: 2,
  };
}
