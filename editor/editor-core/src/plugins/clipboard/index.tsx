import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { createPlugin } from './pm-plugins/main';

const clipboard: NextEditorPlugin<'clipboard'> = () => ({
  name: 'clipboard',

  pmPlugins() {
    return [
      {
        name: 'clipboard',
        plugin: (options) => createPlugin(options),
      },
    ];
  },
});

export default clipboard;
