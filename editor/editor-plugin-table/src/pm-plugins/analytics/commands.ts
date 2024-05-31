import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { AnalyticPluginTypes } from './actions';
import { createCommand, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import type { ActionType, RowOrColumnMovedState } from './types';
import { getMovedPayload } from './utils/moved-event';

export const updateRowOrColumnMoved = (
	nextState: Omit<RowOrColumnMovedState, 'currentActions'>,
	nextAction: ActionType,
) =>
	createCommand(
		(state) => {
			const { rowOrColumnMoved } = getPluginState(state);
			const data = getMovedPayload(nextState, nextAction, rowOrColumnMoved);

			return {
				type: AnalyticPluginTypes.UpdateRowOrColumnMovedAction,
				data,
			};
		},
		(tr) => tr.setMeta('addToHistory', false),
	);

// --- transforms, prefer these over commands to avoid an extra 'dispatch'
export const resetRowOrColumnMovedTransform = () => (tr: Transaction) => {
	const payload = {
		type: AnalyticPluginTypes.RemoveRowOrColumnMovedAction,
	};

	return tr.setMeta(pluginKey, payload);
};

export const updateRowOrColumnMovedTransform =
	(nextState: Omit<RowOrColumnMovedState, 'currentActions'>, nextAction: ActionType) =>
	(state: EditorState, tr: Transaction) => {
		const { rowOrColumnMoved } = getPluginState(state);
		const data = getMovedPayload(nextState, nextAction, rowOrColumnMoved);

		const payload = {
			type: AnalyticPluginTypes.UpdateRowOrColumnMovedAction,
			data,
		};

		return tr.setMeta(pluginKey, payload);
	};
