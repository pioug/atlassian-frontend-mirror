import { Node as PMNode } from 'prosemirror-model';
import { Token, TokenParser, TokenType } from './';
import { hasAnyOfMarks } from '../utils/text';
import { commonFormatter } from './common-formatter';
import { parseString } from '../text';

export const strong: TokenParser = ({ input, position, schema, context }) => {
  /**
   * The following token types will be ignored in parsing
   * the content of a strong mark
   */
  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.ISSUE_KEY,
    TokenType.TABLE,
  ];
  // Adding strong mark to all text
  const contentDecorator = (pmNode: PMNode) => {
    const mark = schema.marks.strong.create();
    // We don't want to mix `code` mark with others
    if (
      pmNode.type.name === 'text' &&
      !hasAnyOfMarks(pmNode, ['strong', 'code'])
    ) {
      return pmNode.mark([...pmNode.marks, mark]);
    }

    return pmNode;
  };

  const rawContentProcessor = (raw: string, length: number): Token => {
    const content = parseString({
      schema,
      context,
      ignoreTokenTypes: ignoreTokenTypes,
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
    opening: '*',
    closing: '*',
    context,
    rawContentProcessor,
  });
};
