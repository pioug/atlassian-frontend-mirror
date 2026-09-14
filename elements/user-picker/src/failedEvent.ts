import type { EventCreator, UserPickerSession } from './analytics';
import { createDefaultPickerAttributes } from './createDefaultPickerAttributes';
import { createEvent } from './createEvent';
import { type UserPickerProps, type UserPickerState } from './types';

export const failedEvent: EventCreator = (
	props: UserPickerProps,
	_: UserPickerState,
	session?: UserPickerSession,
	journeyId?: string,
) =>
	createEvent('operational', 'failed', 'userPicker', {
		...createDefaultPickerAttributes(props, session, journeyId),
	});
