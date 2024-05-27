import {
  type ParagraphDefinition,
  type BlockQuoteDefinition,
} from '@atlaskit/adf-schema';

export const blockQuote = (
  ...content: Array<ParagraphDefinition>
): BlockQuoteDefinition => ({
  type: 'blockquote',
  content,
});
