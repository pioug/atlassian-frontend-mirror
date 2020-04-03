import { Token, TokenParser } from '../index';
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

  if (!match) {
    return fallback();
  }

  const content = parseContentLink(match[1]);

  return resolveLink(content, schema, context);
};

function fallback(): Token {
  return {
    type: 'text',
    text: '[',
    length: 1,
  };
}
