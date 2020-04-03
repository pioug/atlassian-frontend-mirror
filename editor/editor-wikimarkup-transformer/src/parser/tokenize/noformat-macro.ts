import { Schema, Node as PMNode } from 'prosemirror-model';
import { Token, TokenParser } from '.';
import { Context } from '../../interfaces';
import { commonMacro } from './common-macro';
import { parseAttrs } from '../utils/attrs';
import { title } from '../utils/title';

export const noformatMacro: TokenParser = ({
  input,
  position,
  schema,
  context,
}) => {
  return commonMacro(input.substring(position), schema, {
    keyword: 'noformat',
    paired: true,
    context,
    rawContentProcessor,
  });
};

const rawContentProcessor = (
  rawAttrs: string,
  rawContent: string,
  length: number,
  schema: Schema,
  _context: Context,
): Token => {
  const output: PMNode[] = [];
  const { codeBlock } = schema.nodes;

  const parsedAttrs = parseAttrs(rawAttrs);
  const trimedContent = rawContent.replace(/^\s+|\s+$/g, '');
  const textNode = trimedContent.length
    ? schema.text(trimedContent)
    : undefined;

  if (parsedAttrs.title) {
    output.push(title(parsedAttrs.title, schema));
  }

  output.push(codeBlock.createChecked({}, textNode));

  return {
    type: 'pmnode',
    nodes: output,
    length,
  };
};
