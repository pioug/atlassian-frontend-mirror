import { Node as PMNode } from 'prosemirror-model';
import { Token, TokenType, TokenParser } from './';
import { commonFormatter } from './common-formatter';
import { parseString } from '../text';

export const monospace: TokenParser = ({
  input,
  position,
  schema,
  context,
}) => {
  /**
   * The following token types will be ignored in parsing
   * the content
   */
  const ignoreTokenTypes = [
    TokenType.ADF_MACRO,
    TokenType.ANCHOR_MACRO,
    TokenType.CODE_MACRO,
    TokenType.QUOTE_MACRO,
    TokenType.NOFORMAT_MACRO,
    TokenType.PANEL_MACRO,
    TokenType.COLOR_MACRO,
    TokenType.LOREM_MACRO,
    TokenType.QUOTE,
    TokenType.STRING,
    TokenType.ISSUE_KEY,
    TokenType.LINK_FORMAT,
    TokenType.LINK_TEXT,
    TokenType.MEDIA,
    TokenType.HEADING,
    TokenType.LIST,
    TokenType.TABLE,
    TokenType.RULER,
    TokenType.HARD_BREAK,
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.STRONG,
    TokenType.MONOSPACE,
    TokenType.SUPERSCRIPT,
    TokenType.SUBSCRIPT,
    TokenType.EMPHASIS,
    TokenType.CITATION,
    TokenType.DELETED,
    TokenType.INSERTED,
    TokenType.EMOJI,
    TokenType.FORCE_LINE_BREAK,
  ];
  // Add code mark to each text
  const contentDecorator = (n: PMNode) => {
    const mark = schema.marks.code.create();
    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && n.marks.length) {
      return n;
    }
    return n.mark([mark]);
  };

  const rawContentProcessor = (raw: string, length: number): Token => {
    const content = parseString({
      ignoreTokenTypes,
      schema,
      context,
      input: raw,
    });
    const decoratedContent = content.map(contentDecorator);

    return {
      type: 'pmnode',
      nodes: decoratedContent,
      length,
    };
  };

  return commonFormatter(input, position, schema, {
    opening: '{{',
    closing: '}}',
    context,
    rawContentProcessor,
  });
};
