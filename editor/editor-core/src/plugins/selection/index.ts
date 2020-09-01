import { EditorPlugin } from '../../types';

import { createPlugin } from './plugin';
import { SelectionPluginOptions } from './types';
import selectionKeymapPlugin from './pm-plugins/keymap';

export const selectionPlugin = (
  options?: SelectionPluginOptions,
): EditorPlugin => ({
  name: 'selection',

  pmPlugins() {
    return [
      {
        name: 'selection',
        plugin: ({ dispatch, dispatchAnalyticsEvent }) =>
          createPlugin(dispatch, dispatchAnalyticsEvent, options),
      },
      {
        name: 'selectionKeymap',
        plugin: selectionKeymapPlugin,
      },
    ];
  },
});

export default selectionPlugin;
