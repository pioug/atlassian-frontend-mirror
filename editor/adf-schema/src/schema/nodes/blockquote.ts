import { NodeSpec } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';

/**
 * @name blockquote_node
 * @allowUnsupportedBlock true
 */
export interface BlockQuoteDefinition {
  type: 'blockquote';
  /**
   * @minItems 1
   */
  content: Array<Paragraph>;
}

export const blockquote: NodeSpec = {
  content: '(paragraph | unsupportedBlock)+',
  group: 'block',
  defining: true,
  selectable: false,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0];
  },
};
