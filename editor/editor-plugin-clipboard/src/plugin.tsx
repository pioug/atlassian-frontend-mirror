import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import { createPlugin } from './pm-plugins/main';

export type ClipboardPlugin = NextEditorPlugin<'clipboard'>;

const clipboard: ClipboardPlugin = () => ({
  name: 'clipboard',

  pmPlugins() {
    return [
      {
        name: 'clipboard',
        plugin: options => createPlugin(options),
      },
    ];
  },
});

export default clipboard;
