import { NodeSpec } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';

/**
 * @name blockquote_node
 */
export interface BlockQuoteDefinition {
  type: 'blockquote';
  /**
   * @minItems 1
   * @allowUnsupportedBlock true
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
