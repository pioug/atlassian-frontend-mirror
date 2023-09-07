import type {
  EditorCommand,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';

import { createPlugin } from './pm-plugins/selection-main';
import type { SelectionPluginOptions } from './types';
import selectionKeymapPlugin from './pm-plugins/keymap';

import gapCursorPlugin from './pm-plugins/gap-cursor-main';
import { gapCursorPluginKey } from './pm-plugins/gap-cursor-plugin-key';
import gapCursorKeymapPlugin from './pm-plugins/gap-cursor-keymap';

type SelectionPlugin = NextEditorPlugin<
  'selection',
  {
    pluginConfiguration: SelectionPluginOptions | undefined;
    commands: { displayGapCursor: (toggle: boolean) => EditorCommand };
  }
>;

const displayGapCursor =
  (toggle: boolean): EditorCommand =>
  ({ tr }) => {
    return tr.setMeta(gapCursorPluginKey, {
      displayGapCursor: toggle,
    });
  };

export const selectionPlugin: SelectionPlugin = ({ config: options }) => ({
  name: 'selection',

  commands: {
    displayGapCursor,
  },

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
