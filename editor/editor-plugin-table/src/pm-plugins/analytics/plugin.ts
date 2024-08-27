import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import {
	countCellsInSlice,
	getTableElementMoveTypeBySlice,
	getTableSelectionType,
	isInsideFirstCellOfRowOrColumn,
} from '../../commands/misc';

import { resetRowOrColumnMovedTransform, updateRowOrColumnMoved } from './commands';
import { createPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { defaultState } from './types';

export const createPlugin = (dispatch: Dispatch, dispatchAnalyticsEvent: DispatchAnalyticsEvent) =>
	new SafePlugin({
		key: pluginKey,
		state: createPluginState(dispatch, defaultState),
		appendTransaction: (transactions, oldState, newState) => {
			const tr = transactions.find((tr) =>
				tr.getMeta(pluginKey)?.data?.currentActions?.includes('pasted'),
			);

			if (tr) {
				const newTr = newState.tr;
				dispatchAnalyticsEvent({
					action: TABLE_ACTION.ROW_OR_COLUMN_MOVED,
					actionSubject: ACTION_SUBJECT.TABLE,
					actionSubjectId: null,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						type: tr.getMeta(pluginKey)?.data?.type,
					},
				});
				return resetRowOrColumnMovedTransform()(newTr);
			}

			return undefined;
		},
		props: {
			handlePaste: ({ state, dispatch }, event, slice) => {
				const { schema } = state;
				const type = getTableElementMoveTypeBySlice(slice, state);

				// if the selection wasn't in the first cell of a row or column, don't count it
				if (!type || !isInsideFirstCellOfRowOrColumn(state.selection, type)) {
					return;
				}

				const count = countCellsInSlice(slice, schema, type);

				updateRowOrColumnMoved(
					{
						numberOfCells: count,
						type,
					},
					'pasted',
				)(state, dispatch);
			},
			transformCopied: (slice, { state, dispatch }) => {
				const { schema } = state;

				const type = getTableSelectionType(state.selection);
				const count = countCellsInSlice(slice, schema, type);

				updateRowOrColumnMoved(
					{
						numberOfCells: count,
						type,
					},
					'copyOrCut',
				)(state, dispatch);

				return slice;
			},
		},
	});
