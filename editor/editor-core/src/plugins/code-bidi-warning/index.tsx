import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

const codeBidiWarning = (): EditorPlugin => ({
  name: 'codeBidiWarning',

  pmPlugins() {
    return [
      {
        name: 'codeBidiWarning',
        plugin: (options) => createPlugin(options),
      },
    ];
  },
});

export default codeBidiWarning;
