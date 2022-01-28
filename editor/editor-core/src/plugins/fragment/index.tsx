import { fragment } from '@atlaskit/adf-schema';
import { Plugin } from 'prosemirror-state';

import { pluginKey } from './plugin-key';
import { createPlugin as createFragmentMarkConsistencyPlugin } from './pm-plugins/fragment-consistency';
import { EditorPlugin } from '../../types';

export function createPlugin(): Plugin {
  return new Plugin({
    key: pluginKey,
  });
}

const fragmentMarkPlugin = (): EditorPlugin => ({
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

export default fragmentMarkPlugin;
