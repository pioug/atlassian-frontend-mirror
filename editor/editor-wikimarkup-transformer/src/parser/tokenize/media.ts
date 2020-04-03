import getMediaSingleNodeView from '../nodes/mediaSingle';
import { Token, TokenParser } from './';
import { parseAttrs } from '../utils/attrs';
import { commonFormatter } from './common-formatter';

export const media: TokenParser = ({ input, position, schema, context }) => {
  const rawContentProcessor = (raw: string, length: number): Token => {
    /**
     * !image.gif|align=right, vspace=4|ignore-this!
     * If it splits into more than 2 items, we ignore the rest
     */
    const [rawContent, rawAttrs = ''] = raw.split('|');

    const node = getMediaSingleNodeView(
      schema,
      rawContent,
      parseAttrs(rawAttrs, ','),
      context,
    );

    return {
      type: 'pmnode',
      nodes: [node],
      length,
    };
  };

  return commonFormatter(input, position, schema, {
    opening: '!',
    closing: '!',
    context,
    rawContentProcessor,
  });
};
