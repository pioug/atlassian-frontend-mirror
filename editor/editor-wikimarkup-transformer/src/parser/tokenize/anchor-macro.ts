import { Schema } from 'prosemirror-model';
import { Token, TokenParser } from '.';
import { Context } from '../../interfaces';
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
