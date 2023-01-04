import { NodeSpec } from 'prosemirror-model';

export const listItem: NodeSpec = {
  content:
    '(paragraph | mediaSingle | codeBlock) (paragraph | bulletList | orderedList | mediaSingle | codeBlock)*',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  defining: true,
  selectable: false,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};
