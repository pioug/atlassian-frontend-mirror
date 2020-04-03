import { CollabEditProvider } from '@atlaskit/editor-common';
import { Transaction, EditorState } from 'prosemirror-state';
import { getSendableSelection } from '../actions';
import { CollabEventTelepointerData } from '../types';
import { pluginKey } from '../plugin-key';

type Props = {
  transaction: Transaction;
  oldEditorState: EditorState;
  newEditorState: EditorState;
};

export const sendTransaction = ({
  transaction,
  oldEditorState,
  newEditorState,
}: Props) => (provider: CollabEditProvider) => {
  const currentPluginState = pluginKey.getState(newEditorState);

  if (!currentPluginState.isReady) {
    return;
  }

  if (
    !transaction.getMeta('isRemote') &&
    // TODO: ED-8995
    // We need to do this check to reduce the number of race conditions when working with tables.
    // This metadata is coming from the scaleTable command in table-resizing plugin
    !transaction.getMeta('scaleTable') &&
    transaction.docChanged
  ) {
    provider.send(transaction, oldEditorState, newEditorState);
  }

  const prevPluginState = pluginKey.getState(oldEditorState);
  const { activeParticipants: prevActiveParticipants } = prevPluginState;
  const { activeParticipants, sessionId } = currentPluginState;
  const selectionChanged = !oldEditorState.selection.eq(
    newEditorState.selection,
  );
  const participantsChanged = !prevActiveParticipants.eq(activeParticipants);
  if (
    (sessionId && selectionChanged && !transaction.docChanged) ||
    (sessionId && participantsChanged)
  ) {
    const selection = getSendableSelection(newEditorState.selection);
    const message: CollabEventTelepointerData = {
      type: 'telepointer',
      selection,
      sessionId,
    };
    provider.sendMessage(message);
  }
};
