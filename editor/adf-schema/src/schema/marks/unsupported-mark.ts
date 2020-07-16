import { MarkSpec } from 'prosemirror-model';

export const unsupportedMark: MarkSpec = {
  toDOM() {
    return ['span'];
  },
  attrs: { originalValue: {} },
};
