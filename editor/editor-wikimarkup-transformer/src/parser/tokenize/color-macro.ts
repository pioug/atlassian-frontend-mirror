import { Schema } from 'prosemirror-model';
import { Token, TokenType, TokenParser } from '.';
import { Context } from '../../interfaces';
import { commonMacro } from './common-macro';
import { parseAttrs } from '../utils/attrs';
import { parseString } from '../text';
import { getEditorColor } from '../color';
import { hasAnyOfMarks } from '../utils/text';

export const colorMacro: TokenParser = ({
  input,
  position,
  schema,
  context,
}) => {
  return commonMacro(input.substring(position), schema, {
    keyword: 'color',
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
  context: Context,
): Token => {
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.ISSUE_KEY,
    TokenType.TABLE,
  ];

  const parsedAttrs = parseAttrs(rawAttrs);
  const content = parseString({
    ignoreTokenTypes,
    schema,
    context,
    input: rawContent,
  });
  const decoratedContent = content.map((n) => {
    const mark = schema.marks.textColor.create({
      color: getEditorColor(parsedAttrs) || '#000000',
    });

    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['textColor', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
  });

  return {
    type: 'pmnode',
    nodes: decoratedContent,
    length,
  };
};
