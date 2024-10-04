import type { TaskDecisionPluginState } from '../types';

import type { TaskDecisionFocusByLocalIdAction, TaskDecisionSetProviderAction } from './types';

export const focusTaskDecision = (
	state: TaskDecisionPluginState,
	action: TaskDecisionFocusByLocalIdAction,
): TaskDecisionPluginState => {
	return {
		...state,
		focusedTaskItemLocalId: action.data,
	};
};

export const setProvider = (
	state: TaskDecisionPluginState,
	action: TaskDecisionSetProviderAction,
): TaskDecisionPluginState => {
	return {
		...state,
		taskDecisionProvider: action.data,
	};
};
