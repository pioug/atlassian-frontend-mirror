import { MarkSpec } from 'prosemirror-model';

export const unsupportedNodeAttribute: MarkSpec = {
  toDOM() {
    return ['span'];
  },
  attrs: { type: {}, unsupported: {} },
};
