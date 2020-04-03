import { isSafeUrl } from '@atlaskit/adf-schema';
import { decode } from '../utils/url';
import { Token, TokenParser } from './';

// the regex should exclude the period and exclamation mark as the last character
export const LINK_TEXT_REGEXP = /^((?:(?:https?|ftps?):\/\/)|irc:\/\/|mailto:)([\w?!~^\/\\#$%&'()*+,\-.\/:;<=@]*[\w~^\/\\#$%&'()*+,\-\/:;<=@])/i;

export const linkText: TokenParser = ({ input, position, schema }) => {
  const match = input.substring(position).match(LINK_TEXT_REGEXP);

  if (!match) {
    return fallback(input, position);
  }

  // Remove mailto:
  const textRepresentation = match[1] === 'mailto:' ? match[2] : match[0];
  // parse and correctly encode any illegal characters, and
  // so no longer need to be encoded when used below
  const url = decode(unescape(match[0]));

  if (!isSafeUrl(url)) {
    return fallback(input, position);
  }

  const mark = schema.marks.link.create({
    href: url,
  });
  const textNode = schema.text(textRepresentation, [mark]);

  return {
    type: 'pmnode',
    nodes: [textNode],
    length: match[0].length,
  };
};

function unescape(url: string) {
  let result = '';
  for (let i = 0; i < url.length; i++) {
    const char = url[i];
    if (char !== '\\') {
      result += char;
      continue;
    }
    const nextChar = url[i + 1];
    if (nextChar) {
      result += nextChar;
      i++;
    }
  }
  return result;
}

function fallback(input: string, position: number): Token {
  return {
    type: 'text',
    text: input.substr(position, 1),
    length: 1,
  };
}
