import { NodeSpec } from 'prosemirror-model';

const name = 'unknownBlock';

export default {
  group: 'block',
  content: 'inline+',
  marks: '_',
  toDOM() {
    return ['div', { 'data-node-type': name }, 0];
  },
  parseDOM: [{ tag: `div[data-node-type="${name}"]` }],
} as NodeSpec;
