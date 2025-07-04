import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import type { CollabEditProvider, CollabTelepointerPayload } from '@atlaskit/editor-common/collab';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getSendableSelection } from '../actions';
import { pluginKey } from '../main/plugin-key';

type Props = {
	originalTransaction: Readonly<Transaction>;
	transactions: readonly Transaction[];
	oldEditorState: EditorState;
	newEditorState: EditorState;
	useNativePlugin: boolean;
	hideTelecursorOnLoad: boolean;
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

		if (
			sessionId &&
			viewMode === 'edit' &&
			((selectionChanged && !docChangedTransaction) ||
				(participantsChanged && !hideTelecursorOnLoad))
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
