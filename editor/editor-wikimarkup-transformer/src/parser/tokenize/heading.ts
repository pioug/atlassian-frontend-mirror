import { parseString } from '../text';
import { Token, TokenType, TokenParser } from './';

// h1. HEADING
const HEADING_REGEXP = /^h([1-6])\.(.*)/;

export const heading: TokenParser = ({ input, position, schema, context }) => {
  /**
   * The following token types will be ignored in parsing
   * the content of a strong mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
  ];

  const match = input.substring(position).match(HEADING_REGEXP);

  if (!match) {
    return fallback(input, position);
  }

  const level = parseInt(match[1], 10);
  const content = parseString({
    schema,
    ignoreTokenTypes,
    context,
    input: match[2],
  });

  try {
    const headingNode = schema.nodes.heading.createChecked(
      {
        level,
      },
      content,
    );

    return {
      type: 'pmnode',
      nodes: [headingNode],
      length: match[0].length,
    };
  } catch (err) {
    /**
     * If the heading fails to rendering, we want to skip the text
     * "h1."
     */
    return {
      type: 'text',
      text: '',
      length: 4,
    };
  }
};

function fallback(input: string, position: number): Token {
  return {
    type: 'text',
    text: input.substr(position, 1),
    length: 1,
  };
}
