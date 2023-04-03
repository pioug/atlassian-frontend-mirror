import { fragment } from '@atlaskit/adf-schema';
import { createPlugin as createFragmentMarkConsistencyPlugin } from './pm-plugins/fragment-consistency';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';

const fragmentMarkPlugin: NextEditorPlugin<'fragmentPlugin'> = () => ({
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
