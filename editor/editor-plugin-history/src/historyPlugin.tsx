import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginFactory } from '@atlaskit/editor-common/utils';

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

const createPlugin = (dispatch: Dispatch) =>
	new SafePlugin({
		state: createPluginState(dispatch, getInitialState),
		key: historyPluginKey,
		// @ts-ignore - Workaround for help-center local consumption

		appendTransaction: (transactions, oldState, newState) => {
			if (
				// @ts-ignore - Workaround for help-center local consumption

				transactions.find(
					// @ts-ignore - Workaround for help-center local consumption

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
	return {
		name: 'history',
		pmPlugins() {
			return [
				{
					name: 'history',
					plugin: ({ dispatch }) => createPlugin(dispatch),
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
