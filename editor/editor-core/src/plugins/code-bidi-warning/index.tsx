import type { NextEditorPlugin, EditorProps } from '../../types';
import { createPlugin } from './pm-plugins/main';

type Config = {
  appearance: EditorProps['appearance'];
};
const codeBidiWarning: NextEditorPlugin<
  'codeBidiWarning',
  {
    pluginConfiguration: Config;
  }
> = ({ config }) => ({
  name: 'codeBidiWarning',

  pmPlugins() {
    return [
      {
        name: 'codeBidiWarning',
        plugin: (options) => {
          return createPlugin(options, config);
        },
      },
    ];
  },
});

export default codeBidiWarning;
