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
> = ({ appearance }) => ({
  name: 'codeBidiWarning',

  pmPlugins() {
    return [
      {
        name: 'codeBidiWarning',
        plugin: (options) => {
          return createPlugin(options, { appearance });
        },
      },
    ];
  },
});

export default codeBidiWarning;
