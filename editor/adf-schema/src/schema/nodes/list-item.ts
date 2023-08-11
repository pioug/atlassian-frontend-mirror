import { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export const listItem: NodeSpec = {
  content:
    '(paragraph | mediaSingle | codeBlock | unsupportedBlock) (paragraph | bulletList | orderedList | mediaSingle | codeBlock | unsupportedBlock)*',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  defining: true,
  selectable: false,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};
