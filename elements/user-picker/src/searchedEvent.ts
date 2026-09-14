import type { EventCreator, UserPickerSession } from './analytics';
import { createDefaultPickerAttributes } from './createDefaultPickerAttributes';
import { createEvent } from './createEvent';
import { optionData2Analytics } from './optionData2Analytics';
import { queryLength } from './queryLength';
import { sessionDuration } from './sessionDuration';
import { type UserPickerProps, type UserPickerState } from './types';

function durationSinceInputChange(session?: UserPickerSession) {
	return session ? Date.now() - session.inputChangeTime : null;
}

function results(state: UserPickerState) {
	return (state.options || []).map(optionData2Analytics);
}

function isLoading(props: UserPickerProps, state: UserPickerState) {
	return state.count > 0 || props.isLoading;
}

export const searchedEvent: EventCreator = (
	props: UserPickerProps,
	state: UserPickerState,
	session?: UserPickerSession,
	journeyId?: string,
) => {
	const searchResults = results(state);
	return createEvent('operational', 'searched', 'userPicker', {
		...createDefaultPickerAttributes(props, session, journeyId),
		sessionDuration: sessionDuration(session),
		durationSinceInputChange: durationSinceInputChange(session),
		queryLength: queryLength(state),
		isLoading: isLoading(props, state),
		results: searchResults,
		numberOfResults: searchResults.length,
	});
};
