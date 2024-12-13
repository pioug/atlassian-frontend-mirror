import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginFactory } from '@atlaskit/editor-common/utils';

import { HistoryActionTypes } from './editor-actions/actions';
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
		appendTransaction: (transactions, oldState, newState) => {
			if (transactions.find((tr) => tr.docChanged && tr.getMeta('addToHistory') !== false)) {
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

const historyPlugin: HistoryPlugin = () => ({
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

		return historyPluginKey.getState(editorState);
	},
});

export default historyPlugin;
