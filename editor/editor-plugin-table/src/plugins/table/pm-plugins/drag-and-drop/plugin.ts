import type {
  Dispatch,
  EventDispatcher,
} from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { DropTargetType } from './consts';
import { createPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';

export const createPlugin = (
  dispatch: Dispatch,
  eventDispatcher: EventDispatcher,
) => {
  return new SafePlugin({
    state: createPluginState(dispatch, {
      // TODO: This is example placeholder state. We could use this to track which row/col is currently set as the drop target
      // This would result in a blue highlight being displayed on the corrisponding row/column to single the drop target location.
      dropTargetType: DropTargetType.NONE,
      dropTargetIndex: 0,
    }),
    key: pluginKey,
    view: (editorView: EditorView) => {
      // TODO: Add Pragmatic DnD monitor when the view is constructed.
      return {
        // TODO: Cleanup monitor instance
        // destroy: cleanup,
      };
    },
  });
};
