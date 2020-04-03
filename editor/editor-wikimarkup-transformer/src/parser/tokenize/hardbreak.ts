import { TokenParser } from './';
import { parseNewlineOnly } from './whitespace';

export const hardbreak: TokenParser = ({ input, position, schema }) => {
  // Look for normal hardbreak \r, \n, \r\n
  const length = parseNewlineOnly(input.substring(position));

  if (length === 0) {
    // not a valid hardbreak
    return {
      type: 'text',
      text: input.substr(position, 1),
      length: 1,
    };
  }

  return {
    type: 'pmnode',
    nodes: [schema.nodes.hardBreak.createChecked()],
    length,
  };
};
