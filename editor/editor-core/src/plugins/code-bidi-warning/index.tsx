import type { EditorPlugin, EditorProps } from '../../types';
import { createPlugin } from './pm-plugins/main';

const codeBidiWarning = ({
  appearance,
}: {
  appearance: EditorProps['appearance'];
}): EditorPlugin => ({
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
