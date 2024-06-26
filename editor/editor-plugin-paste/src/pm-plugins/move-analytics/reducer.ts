import { MoveAnalyticPluginTypes, type MoveAnalyticsPluginAction } from './actions';
import type { MoveAnalyticsPluginState } from './types';
import { defaultState } from './types';

export const reducer = (
	state: MoveAnalyticsPluginState,
	action: MoveAnalyticsPluginAction,
): MoveAnalyticsPluginState => {
	switch (action.type) {
		case MoveAnalyticPluginTypes.UpdateMovedAction:
			return {
				...state,
				contentMoved: {
					...state.contentMoved,
					...action.data,
				},
			};
		case MoveAnalyticPluginTypes.RemoveMovedAction:
			return {
				...state,
				contentMoved: defaultState.contentMoved,
			};
		default:
			return state;
	}
};
