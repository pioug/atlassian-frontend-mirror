import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

const clipboard = (): EditorPlugin => ({
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
