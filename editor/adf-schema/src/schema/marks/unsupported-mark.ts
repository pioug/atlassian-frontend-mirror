import { MarkSpec } from '@atlaskit/editor-prosemirror/model';

export const unsupportedMark: MarkSpec = {
  toDOM() {
    return ['span'];
  },
  excludes: '',
  attrs: { originalValue: {} },
};
