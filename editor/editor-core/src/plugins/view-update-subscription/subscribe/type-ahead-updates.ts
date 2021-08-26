import { EditorView } from 'prosemirror-view';
import { trackerStore, ViewUpdateSubscription } from '..';
import { pluginKey as typeAheadPluginKey } from '../../type-ahead/pm-plugins/key';
import type { TypeAheadPluginState } from '../../type-ahead/types';

type Props = {
  oldPluginState: TypeAheadPluginState;
  newPluginState: TypeAheadPluginState;
};
type SubscribeTypeAheadUpdates = (
  editorView: EditorView,
  cb: (props: Props) => void,
) => () => void;
export const subscribeTypeAheadUpdates: SubscribeTypeAheadUpdates = (
  editorView: EditorView,
  cb,
) => {
  const subscription: ViewUpdateSubscription = ({
    newEditorState,
    oldEditorState,
  }) => {
    const newPluginState = typeAheadPluginKey.getState(newEditorState);
    const oldPluginState = typeAheadPluginKey.getState(oldEditorState);

    if (!oldPluginState || !newPluginState) {
      return;
    }

    cb({ oldPluginState, newPluginState });
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
