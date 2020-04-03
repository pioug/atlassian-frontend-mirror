import { NodeSpec } from 'prosemirror-model';

/**
 * @name hardBreak_node
 */
export interface HardBreakDefinition {
  type: 'hardBreak';
  attrs?: {
    text?: '\n';
  };
}

export const hardBreak: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() {
    return ['br'];
  },
};
