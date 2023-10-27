import { fragment } from '@atlaskit/adf-schema';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import { createPlugin as createFragmentMarkConsistencyPlugin } from './pm-plugins/fragment-consistency';

export type FragmentPlugin = NextEditorPlugin<'fragmentPlugin'>;

export const fragmentPlugin: FragmentPlugin = () => ({
  name: 'fragmentPlugin',

  marks() {
    return [
      {
        name: 'fragment',
        mark: fragment,
      },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'fragmentMarkConsistency',
        plugin: ({ dispatch }) => createFragmentMarkConsistencyPlugin(dispatch),
      },
    ];
  },
});
