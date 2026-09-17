import state from './state';

// Deliberately preserve lastActiveInteraction, matching the legacy reset behavior.
export const clearState = (): void => {
	state.startTimes.clear();
	state.spanStates.clear();
};
