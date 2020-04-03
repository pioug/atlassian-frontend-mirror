import { ParagraphDefinition, Inline } from '@atlaskit/adf-schema';
import { createTextNodes } from '../utils/create-text-nodes';

export const paragraph = (
  ...content: Array<Inline | string>
): ParagraphDefinition => ({
  type: 'paragraph',
  content: createTextNodes(content),
});
