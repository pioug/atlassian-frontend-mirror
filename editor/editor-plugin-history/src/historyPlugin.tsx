import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { undo } from '@atlaskit/prosemirror-history/undo';

import { type HistoryAction, HistoryActionTypes } from './editor-actions/actions';
import reducer from './editor-actions/reducer';
import { getPmHistoryPluginState } from './editor-actions/utils';
import type { HistoryPlugin, HistoryPluginState } from './historyPluginType';
import { historyPluginKey } from './pm-plugins/plugin-key';

const getInitialState = (): HistoryPluginState => ({
	canUndo: false,
	canRedo: false,
});

const { createPluginState, getPluginState } = pluginFactory(historyPluginKey, reducer);

type EditorViewRef = { current: EditorView | undefined };

/**
 * Expose prosemirror-history's `undo` as an `EditorCommand`. `undo(state, dispatch)`
 * builds its own transaction, so capture that transaction and return it in place of the
 * one passed in. Nothing is re-implemented: the returned transaction is exactly what
 * pressing Cmd+Z would dispatch, and callers may add metadata to it before it is
 * dispatched by `api.core.actions.execute`.
 */
const undoCommand =
	(editorViewRef: EditorViewRef): EditorCommand =>
	({ tr }) => {
		const state = editorViewRef.current?.state;
		// The caller's `tr` is discarded, so refuse if it already carries changes or is stale.
		if (!state || tr.steps.length > 0 || tr.before !== state.doc) {
			return null;
		}

		let undoTr: Transaction | null = null;
		undo(state, (built) => {
			undoTr = built;
		});
		return undoTr;
	};

const createPlugin = (dispatch: Dispatch, editorViewRef: EditorViewRef) =>
	new SafePlugin({
		state: createPluginState(dispatch, getInitialState),
		key: historyPluginKey,
		view: (editorView) => {
			editorViewRef.current = editorView;
			return {
				destroy: () => {
					if (editorViewRef.current === editorView) {
						editorViewRef.current = undefined;
					}
				},
			};
		},
		appendTransaction: (transactions, oldState, newState) => {
			if (
				transactions.find(
					(tr) =>
						(tr.docChanged && tr.getMeta('addToHistory') !== false) ||
						tr.getMeta('endHistorySlice'),
				)
			) {
				const pmHistoryPluginState = getPmHistoryPluginState(newState);
				if (!pmHistoryPluginState) {
					return;
				}

				const canUndo = pmHistoryPluginState.done.eventCount > 0;
				const canRedo = pmHistoryPluginState.undone.eventCount > 0;
				const { canUndo: prevCanUndo, canRedo: prevCanRedo } = getPluginState(newState);

				if (canUndo !== prevCanUndo || canRedo !== prevCanRedo) {
					const action = {
						type: HistoryActionTypes.UPDATE,
						canUndo,
						canRedo,
					};
					return newState.tr.setMeta(historyPluginKey, action);
				}
			}
		},
	});

const historyPlugin: HistoryPlugin = ({ api }) => {
	let currentId: string | null = null;
	const editorViewRef: EditorViewRef = { current: undefined };
	return {
		name: 'history',
		pmPlugins() {
			return [
				{
					name: 'history',
					plugin: ({ dispatch }) => createPlugin(dispatch, editorViewRef),
				},
			];
		},
		getSharedState: (editorState) => {
			if (!editorState) {
				return undefined;
			}

			const historyPluginState = historyPluginKey.getState(editorState);
			if (!historyPluginState) {
				return undefined;
			}

			const { done, undone } = getPmHistoryPluginState(editorState) ?? {};

			return {
				canUndo: historyPluginState.canUndo,
				canRedo: historyPluginState.canRedo,
				done: {
					eventCount: done?.eventCount ?? 0,
				},
				undone: {
					eventCount: undone?.eventCount ?? 0,
				},
			};
		},
		commands: {
			undo: undoCommand(editorViewRef),
			updatePluginState: ({ tr }) => {
				const { done, undone } = api?.history.sharedState.currentState() ?? {};
				if (done === undefined || undone === undefined) {
					return tr;
				}

				const canUndo = done.eventCount > 0;
				const canRedo = undone.eventCount > 0;

				const action: HistoryAction = {
					type: HistoryActionTypes.UPDATE,
					canUndo,
					canRedo,
				};
				return tr.setMeta(historyPluginKey, action);
			},
			startHistorySlice:
				(id: string) =>
				({ tr }) => {
					if (currentId) {
						return null;
					}
					currentId = id;
					return tr.setMeta('startHistorySlice', true);
				},
			endHistorySlice:
				(id: string) =>
				({ tr }) => {
					if (currentId !== id) {
						return null;
					}
					currentId = null;
					return tr.setMeta('endHistorySlice', true);
				},
		},
	};
};

export default historyPlugin;
