import type {
  EditorCommand,
  NextEditorPlugin,
  EditorCommandWithMetadata,
} from '@atlaskit/editor-common/types';
import type { SelectionSharedState } from '@atlaskit/editor-common/selection';

import { createPlugin } from './pm-plugins/selection-main';
import type { SelectionPluginOptions } from './types';
import { selectionPluginKey } from './types';
import selectionKeymapPlugin from './pm-plugins/keymap';

import gapCursorPlugin from './pm-plugins/gap-cursor-main';
import { gapCursorPluginKey } from './pm-plugins/gap-cursor-plugin-key';
import gapCursorKeymapPlugin from './pm-plugins/gap-cursor-keymap';

import { selectNearNode } from './commands';

export type SelectionPlugin = NextEditorPlugin<
  'selection',
  {
    pluginConfiguration: SelectionPluginOptions | undefined;
    commands: {
      displayGapCursor: (toggle: boolean) => EditorCommand;
      selectNearNode: EditorCommandWithMetadata;
    };
    sharedState: SelectionSharedState;
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
    selectNearNode,
  },

  getSharedState(editorState) {
    if (!editorState) {
      return undefined;
    }
    const pluginState = selectionPluginKey.getState(editorState);
    return {
      selectionRelativeToNode: pluginState?.selectionRelativeToNode,
    };
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
