import { EditorPlugin } from '../../types';

import { createPlugin } from './pm-plugins/selection-main';
import { SelectionPluginOptions } from './types';
import selectionKeymapPlugin from './pm-plugins/keymap';

import gapCursorPlugin from './pm-plugins/gap-cursor-main';
import gapCursorKeymapPlugin from './pm-plugins/gap-cursor-keymap';

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
      {
        name: 'gapCursorKeymap',
        plugin: () => gapCursorKeymapPlugin(),
      },
      {
        name: 'gapCursor',
        plugin: () => gapCursorPlugin,
      },
    ];
  },
});

export default selectionPlugin;
