import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { MoveAnalyticPluginTypes } from './actions';
import { createCommand, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import type { ActionType, ContentMoved } from './types';

export const updateContentMoved = (
	nextState: Omit<ContentMoved, 'currentActions'>,
	nextAction: ActionType,
) =>
	createCommand(
		(state) => {
			const { contentMoved } = getPluginState(state);

			const data = {
				currentActions: [...contentMoved.currentActions, nextAction],
				size: nextState?.size || contentMoved.size,
				nodeName: nextState?.nodeName,
			};

			return {
				type: MoveAnalyticPluginTypes.UpdateMovedAction,
				data,
			};
		},
		(tr) => tr.setMeta('addToHistory', false),
	);

export const resetContentMoved = () =>
	createCommand(
		() => {
			return {
				type: MoveAnalyticPluginTypes.RemoveMovedAction,
			};
		},
		(tr) => tr.setMeta('addToHistory', false),
	);

export const resetContentMovedTransform = () => (tr: Transaction) => {
	const payload = {
		type: MoveAnalyticPluginTypes.RemoveMovedAction,
	};

	return tr.setMeta(pluginKey, payload);
};
