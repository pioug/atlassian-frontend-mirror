import { border } from '@atlaskit/adf-schema';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type BorderPlugin = NextEditorPlugin<'border'>;

export const borderPlugin: BorderPlugin = () => ({
  name: 'border',

  marks() {
    return [
      {
        name: 'border',
        mark: border,
      },
    ];
  },
});
