import { type Schema } from '@atlaskit/editor-prosemirror/model';
import { type Token, type TokenParser } from '.';
import { type Context } from '../../interfaces';
import { commonMacro } from './common-macro';

export const anchorMacro: TokenParser = ({
  input,
  position,
  schema,
  context,
}) => {
  return commonMacro(input.substring(position), schema, {
    keyword: 'anchor',
    paired: false,
    context,
    rawContentProcessor,
  });
};

const rawContentProcessor = (
  _rawAttrs: string,
  _rawContent: string,
  length: number,
  _schema: Schema,
  _context: Context,
): Token => {
  return {
    type: 'text',
    text: '',
    length,
  };
};
