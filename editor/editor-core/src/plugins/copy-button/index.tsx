import createPlugin from './pm-plugins/main';
import type { CopyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';

const copyButtonPlugin: CopyButtonPlugin = () => ({
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
