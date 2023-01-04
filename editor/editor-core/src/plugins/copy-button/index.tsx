import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import createPlugin from './pm-plugins/main';

const copyButtonPlugin: NextEditorPlugin<'copyButton'> = () => ({
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
