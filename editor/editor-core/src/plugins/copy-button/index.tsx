import { EditorPlugin } from '../../types';
import createPlugin from './pm-plugins/main';

const copyButtonPlugin = (): EditorPlugin => ({
  name: 'copyButton',
  pmPlugins() {
    return [
      {
        name: 'copyButton',
        plugin: () => createPlugin(),
      },
    ];
  },
});

export default copyButtonPlugin;
