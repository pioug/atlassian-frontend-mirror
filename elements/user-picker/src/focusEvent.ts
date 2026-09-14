import type { EventCreator, UserPickerSession } from './analytics';
import { createDefaultPickerAttributes } from './createDefaultPickerAttributes';
import { createEvent } from './createEvent';
import { optionData2Analytics } from './optionData2Analytics';
import { type Option, type UserPickerProps, type UserPickerState } from './types';

const buildValueForAnalytics = (value?: Option[] | Option | null) => {
	if (value) {
		const valueToConvert = Array.isArray(value) ? value : [value];
		return valueToConvert.map(({ data }) => optionData2Analytics(data));
	}

	return [];
};

export const focusEvent: EventCreator = (
	props: UserPickerProps,
	state: UserPickerState,
	session?: UserPickerSession,
	journeyId?: string,
) =>
	createEvent('ui', 'focused', 'userPicker', {
		...createDefaultPickerAttributes(props, session, journeyId),
		values: buildValueForAnalytics(state.value),
	});
