import { AnalyticPluginTypes } from './actions';
import type { AnalyticPluginAction } from './actions';
import type { AnalyticPluginState } from './types';
import { defaultState } from './types';

export const reducer = (
	state: AnalyticPluginState,
	action: AnalyticPluginAction,
): AnalyticPluginState => {
	switch (action.type) {
		case AnalyticPluginTypes.UpdateRowOrColumnMovedAction:
			return {
				...state,
				rowOrColumnMoved: {
					...state.rowOrColumnMoved,
					...action.data,
				},
			};
		case AnalyticPluginTypes.RemoveRowOrColumnMovedAction:
			return {
				...state,
				rowOrColumnMoved: defaultState.rowOrColumnMoved,
			};
		default:
			return state;
	}
};
