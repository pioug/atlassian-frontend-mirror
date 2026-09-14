import type { EventCreator, UserPickerSession } from './analytics';
import { createDefaultPickerAttributes } from './createDefaultPickerAttributes';
import { createEvent } from './createEvent';
import { type UserPickerProps, type UserPickerState } from './types';
import { values } from './values';

export const clearEvent: EventCreator = (
	props: UserPickerProps,
	state: UserPickerState,
	session?: UserPickerSession,
	journeyId?: string,
) =>
	createEvent('ui', 'cleared', 'userPicker', {
		...createDefaultPickerAttributes(props, session, journeyId),
		pickerOpen: state.menuIsOpen,
		values: values(state),
	});
