import type { CollabEditProvider, CollabTelepointerPayload } from '@atlaskit/editor-common/collab';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { getSendableSelection } from '../actions';
import { pluginKey } from '../main/plugin-key';

type Props = {
	originalTransaction: Readonly<Transaction>;
	transactions: readonly Transaction[];
	oldEditorState: EditorState;
	newEditorState: EditorState;
	useNativePlugin: boolean;
	viewMode?: 'view' | 'edit';
};

export const sendTransaction =
	({
		originalTransaction,
		transactions,
		oldEditorState,
		newEditorState,
		useNativePlugin,
		viewMode,
	}: Props) =>
	(provider: CollabEditProvider) => {
		const docChangedTransaction = fg('platform_editor_migrate_state_updates')
			? originalTransaction.docChanged
			: transactions.find((tr) => tr.docChanged);
		const currentPluginState = pluginKey.getState(newEditorState);

		if (!currentPluginState?.isReady) {
			return;
		}

		const shouldSendStepForSynchronyCollabProvider =
			!originalTransaction.getMeta('isRemote') &&
			// TODO: ED-8995
			// We need to do this check to reduce the number of race conditions when working with tables.
			// This metadata is coming from the scaleTable command in table-resizing plugin
			!originalTransaction.getMeta('scaleTable') &&
			docChangedTransaction;

		if (useNativePlugin || shouldSendStepForSynchronyCollabProvider) {
			if (fg('platform_editor_migrate_state_updates')) {
				provider.send(originalTransaction as Transaction, oldEditorState, newEditorState);
			} else {
				provider.send(docChangedTransaction as Transaction, oldEditorState, newEditorState);
			}
		}

		const prevPluginState = pluginKey.getState(oldEditorState);
		const { activeParticipants: prevActiveParticipants } = prevPluginState || {};
		const { activeParticipants, sessionId } = currentPluginState;
		const selectionChanged = !oldEditorState.selection.eq(newEditorState.selection);
		const participantsChanged =
			prevActiveParticipants && !prevActiveParticipants.eq(activeParticipants);

		if (
			sessionId &&
			viewMode === 'edit' &&
			((selectionChanged && !docChangedTransaction) || participantsChanged)
		) {
			const selection = getSendableSelection(newEditorState.selection);
			const message: CollabTelepointerPayload = {
				type: 'telepointer',
				selection,
				sessionId,
			};
			provider.sendMessage(message);
		}
	};
