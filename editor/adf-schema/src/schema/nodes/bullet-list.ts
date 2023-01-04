import { NodeSpec } from 'prosemirror-model';

export const bulletListSelector = '.ak-ul';

export const bulletList: NodeSpec = {
  group: 'block',
  content: 'listItem+',
  selectable: false,
  parseDOM: [{ tag: 'ul' }],
  marks: 'unsupportedMark unsupportedNodeAttribute',
  toDOM() {
    const attrs = {
      class: bulletListSelector.substr(1),
    };
    return ['ul', attrs, 0];
  },
};
