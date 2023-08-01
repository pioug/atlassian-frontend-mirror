import { MarkSpec } from '@atlaskit/editor-prosemirror/model';

export const unsupportedNodeAttribute: MarkSpec = {
  toDOM() {
    return ['span'];
  },
  attrs: { type: {}, unsupported: {} },
};
