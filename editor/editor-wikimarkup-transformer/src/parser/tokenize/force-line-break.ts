import { Token, TokenParser } from './';

/**
 * Jira is using the following regex to match force line break
 * private static final Pattern FORCE_NEWLINE = Pattern.compile("(?<!\\\\)\\\\{2}(?!\\S*\\\\)");
 */

const FORCE_LINE_BREAK_REGEX = /^\\{2}(?!\S*\\)/;

export const forceLineBreak: TokenParser = ({ input, position, schema }) => {
  if (position > 0) {
    const charBefore = input.charAt(position - 1);
    if (charBefore === '\\') {
      return fallback(input, position);
    }
  }

  const match = input.substring(position).match(FORCE_LINE_BREAK_REGEX);

  if (match) {
    return {
      type: 'pmnode',
      nodes: [schema.nodes.hardBreak.createChecked()],
      length: 2,
    };
  }

  return fallback(input, position);
};

function fallback(input: string, position: number): Token {
  return {
    type: 'text',
    text: input.substr(position, 2),
    length: 2,
  };
}
