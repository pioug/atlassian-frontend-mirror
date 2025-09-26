import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import type { CollabEditProvider, CollabTelepointerPayload } from '@atlaskit/editor-common/collab';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import type {
	EditorState,
	Transaction,
	SelectionBookmark,
} from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getSendableSelection } from '../actions';
import { pluginKey } from '../main/plugin-key';

type Props = {
	hideTelecursorOnLoad: boolean;
	newEditorState: EditorState;
	oldEditorState: EditorState;
	originalTransaction: Readonly<Transaction>;
	transactions: readonly Transaction[];
	useNativePlugin: boolean;
	viewMode?: ViewMode;
};

export const sendTransaction =
	({
		originalTransaction,
		transactions,
		oldEditorState,
		newEditorState,
		useNativePlugin,
		viewMode,
		hideTelecursorOnLoad,
	}: Props) =>
	(provider: CollabEditProvider) => {
		const docChangedTransaction = transactions.find((tr) => tr.docChanged);
		const currentPluginState = pluginKey.getState(newEditorState);
		const trNoAnalytics = oldEditorState.tr;

		docChangedTransaction?.steps.forEach((step) => {
			if (!(step instanceof AnalyticsStep)) {
				trNoAnalytics.step(step);
			}
		});

		if (!currentPluginState?.isReady) {
			return;
		}

		const newTransaction = editorExperiment('platform_editor_reduce_noisy_steps_ncs', true, {
			exposure: true,
		})
			? trNoAnalytics
			: docChangedTransaction;

		const shouldSendStepForSynchronyCollabProvider =
			!originalTransaction.getMeta('isRemote') &&
			// TODO: ED-8995 - We need to do this check to reduce the number of race conditions when working with tables.
			// This metadata is coming from the scaleTable command in table-resizing plugin
			!originalTransaction.getMeta('scaleTable') &&
			(editorExperiment('platform_editor_reduce_noisy_steps_ncs', true)
				? newTransaction?.docChanged
				: true);

		if (useNativePlugin || shouldSendStepForSynchronyCollabProvider) {
			provider.send(newTransaction as Transaction, oldEditorState, newEditorState);
		}

		const prevPluginState = pluginKey.getState(oldEditorState);
		const { activeParticipants: prevActiveParticipants } = prevPluginState || {};
		const { activeParticipants, sessionId } = currentPluginState;
		const selectionChanged = !oldEditorState.selection.eq(newEditorState.selection);
		const participantsChanged =
			prevActiveParticipants && !prevActiveParticipants.eq(activeParticipants);

		if (fg('aifc_create_enabled')) {
			if (!sessionId || viewMode !== 'edit') {
				return;
			}

			// uiEvent is standard metdata (docs: https://prosemirror.net/docs/ref/#state.Transaction)
			const isPaste = docChangedTransaction?.getMeta('uiEvent') === 'paste';

			// If this metadata is truthy then it means a selection bookmark might be declared as the meta value OR the transaction
			// doesn't want the tr.selection to be sent to remote users at all.
			const remoteSelectionBookmark: SelectionBookmark | boolean | undefined =
				originalTransaction.getMeta('useSelectionBookmarkForRemote');

			if (!!remoteSelectionBookmark) {
				if (remoteSelectionBookmark !== true && 'resolve' in remoteSelectionBookmark) {
					const selection = remoteSelectionBookmark.resolve(newEditorState.doc);

					const message: CollabTelepointerPayload = {
						type: 'telepointer',
						selection: getSendableSelection(selection),
						sessionId,
					};
					provider.sendMessage(message);
				}
			} else if (
				// Broadcast the position if the selection has changed, and the doc hasn't changed (it is mapped
				// by the receiver).
				// If we're pasting content though make an exception (as doc has changed)
				// as on a ranged selection it results in not clearing the ranged selection after the paste
				(selectionChanged && (!docChangedTransaction || isPaste)) ||
				(participantsChanged && !hideTelecursorOnLoad)
			) {
				const selection = getSendableSelection(newEditorState.selection);
				const message: CollabTelepointerPayload = { type: 'telepointer', selection, sessionId };
				provider.sendMessage(message);
			}
		} else {
			if (
				sessionId &&
				viewMode === 'edit' &&
				((selectionChanged && !docChangedTransaction) ||
					(participantsChanged && !hideTelecursorOnLoad))
			) {
				const selection = getSendableSelection(newEditorState.selection);
				const message: CollabTelepointerPayload = { type: 'telepointer', selection, sessionId };
				provider.sendMessage(message);
			}
		}
	};
