import { Token, TokenParser, TokenType } from '../';
import { parseString } from '../../text';
import { resolveLink } from './link-resolver';
import { parseContentLink } from './link-parser';

// [http://www.example.com] and [Example|http://www.example.com]
const LINK_FORMAT_REGEXP = /^\[([^\[\]\n]+)]/;

export const linkFormat: TokenParser = ({
  input,
  position,
  schema,
  context,
}) => {
  const match = input.substring(position).match(LINK_FORMAT_REGEXP);

  /**
   * The following token types will be ignored in parsing
   * the content of a table cell
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.TABLE,
    TokenType.RULER,

    // We want to avoid recursion
    TokenType.LINK_TEXT,
    TokenType.LINK_FORMAT,
  ];

  if (!match) {
    return fallback();
  }

  const content = parseContentLink(match[1]);

  const resolvedLink = resolveLink(content, schema, context);

  if (resolvedLink) {
    return resolvedLink;
  }

  const nodes = parseString({
    schema,
    context,
    ignoreTokenTypes: ignoreTokenTypes,
    input: match[0],
  });

  return {
    type: 'pmnode',
    nodes: nodes,
    length: match[0].length,
  };
};

function fallback(): Token {
  return {
    type: 'text',
    text: '[',
    length: 1,
  };
}
