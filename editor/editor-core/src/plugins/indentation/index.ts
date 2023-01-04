import { indentation } from '@atlaskit/adf-schema';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { keymapPlugin } from './pm-plugins/keymap';

const indentationPlugin: NextEditorPlugin<'indentation'> = () => ({
  name: 'indentation',

  marks() {
    return [{ name: 'indentation', mark: indentation }];
  },

  pmPlugins() {
    return [
      {
        name: 'indentationKeymap',
        plugin: () => keymapPlugin(),
      },
    ];
  },
});

export default indentationPlugin;
