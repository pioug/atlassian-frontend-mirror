import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { DatePluginSharedState } from '@atlaskit/editor-plugin-date';
import type { FloatingToolbarPluginState } from '@atlaskit/editor-plugin-floating-toolbar';
import type { ConfigWithNodeInfo } from '@atlaskit/editor-plugin-floating-toolbar';
import type { StatusState } from '@atlaskit/editor-plugin-status';
import { areSameItems } from '@atlaskit/editor-common/floating-toolbar';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { ViewUpdateSubscription } from '..';
import { trackerStore } from '..';

type SubscribeToToolbarAndPickerUpdatesCallbackArgs = {
  dateState?: DatePluginSharedState;
  statusState?: StatusState;
  toolbarConfig: ConfigWithNodeInfo | null | undefined;
};

type SubscribeToToolbarAndPickerUpdates = (
  editorView: EditorView,
  cb: (args: SubscribeToToolbarAndPickerUpdatesCallbackArgs) => void,
) => () => void;

const areToolbarsSame = (
  left: ConfigWithNodeInfo | null | undefined,
  right: ConfigWithNodeInfo | null | undefined,
) => {
  if (!left && !right) {
    return true;
  }
  if ((left && !right) || (!left && right)) {
    return false;
  }

  const leftConfig = left!.config;
  const rightConfig = right!.config;

  if (!leftConfig && !rightConfig) {
    return true;
  }
  if ((!leftConfig && rightConfig) || (leftConfig && !rightConfig)) {
    return false;
  }

  const leftItems = Array.isArray(leftConfig!.items)
    ? leftConfig!.items
    : leftConfig!.items(left!.node);
  const rightItems = Array.isArray(rightConfig!.items)
    ? rightConfig!.items
    : rightConfig!.items(right!.node);

  return areSameItems(leftItems, rightItems);
};

export const subscribeToToolbarAndPickerUpdates: SubscribeToToolbarAndPickerUpdates =
  (editorView: EditorView, cb) => {
    let lastUpdatedState: EditorState | null = null;

    const subscription: ViewUpdateSubscription = ({ newEditorState }) => {
      // Creating fake plugin keys for these plugins for the mean time until all these plugins are extracted.
      const typeAheadPluginKey = {
        key: 'typeAheadPlugin$',
        getState: (state: EditorState) => {
          return (state as any)['typeAheadPlugin$'];
        },
      };

      const datePluginKey = {
        key: 'datePlugin$',
        getState: (state: EditorState) => {
          return (state as any)['datePlugin$'];
        },
      };

      const statusPluginKey = {
        key: 'statusPlugin$',
        getState: (state: EditorState) => {
          return (state as any)['statusPlugin$'];
        },
      };

      const floatingToolbarPluginKey = {
        key: 'floatingToolbarPluginKey$',
        getState: (state: EditorState) => {
          return (state as any)['floatingToolbarPluginKey$'];
        },
      };

      const isTypeAheadOpen = (editorState: EditorState) => {
        const typeAheadState = typeAheadPluginKey.getState(newEditorState);
        return !!typeAheadState.decorationSet?.find().length;
      };
      // TypeAhead has priority in the mobile-bridge
      // In case it is open we don't need to send
      // any toolbar updates don't need to be send
      if (isTypeAheadOpen(newEditorState)) {
        return;
      }

      const dateState = datePluginKey.getState(newEditorState);
      const statusState = statusPluginKey.getState(newEditorState);
      const { getConfigWithNodeInfo } = floatingToolbarPluginKey.getState(
        newEditorState,
      ) as FloatingToolbarPluginState;
      const toolbarConfig = getConfigWithNodeInfo(newEditorState);
      let shouldCallback = false;

      if (lastUpdatedState) {
        const oldDateState = datePluginKey.getState(lastUpdatedState);
        const oldStatusState = statusPluginKey.getState(lastUpdatedState);
        const { getConfigWithNodeInfo: getOldConfigWithNodeInfo } =
          floatingToolbarPluginKey.getState(
            lastUpdatedState,
          ) as FloatingToolbarPluginState;
        const oldToolbarConfig = getOldConfigWithNodeInfo(lastUpdatedState);

        const isToolbarEqual = areToolbarsSame(toolbarConfig, oldToolbarConfig);

        if (
          dateState !== oldDateState ||
          statusState !== oldStatusState ||
          // Sometimes the toolbar changes while a picker is open, we dont care about this
          // EG A nested status or date node in a table
          (!isToolbarEqual &&
            !statusState?.showStatusPickerAt &&
            !dateState?.showDatePickerAt)
        ) {
          shouldCallback = true;
        }
      } else {
        shouldCallback = true;
      }

      if (shouldCallback) {
        cb({ dateState, statusState, toolbarConfig });
      }
      lastUpdatedState = newEditorState;
    };

    const tracker = trackerStore.get(editorView);
    if (tracker) {
      tracker.add(subscription);
    }

    return () => {
      const tracker = trackerStore.get(editorView);
      if (tracker) {
        tracker.remove(subscription);
      }
    };
  };
