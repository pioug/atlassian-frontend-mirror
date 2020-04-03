import { Node as PMNode } from 'prosemirror-model';
import { Token, TokenType, TokenParser } from './';
import { hasAnyOfMarks } from '../utils/text';
import { commonFormatter } from './common-formatter';
import { parseString } from '../text';

export const emphasis: TokenParser = ({ input, position, schema, context }) => {
  /**
   * The following token types will be ignored in parsing
   * the content of a  mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.ISSUE_KEY,
    TokenType.TABLE,
  ];
  // Add underline mark to each text
  const contentDecorator = (n: PMNode) => {
    const mark = schema.marks.em.create();
    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['em', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
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
    opening: '_',
    closing: '_',
    context,
    rawContentProcessor,
  });
};
