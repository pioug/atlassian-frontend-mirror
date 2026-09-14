import type { EventCreator, UserPickerSession } from './analytics';
import { createDefaultPickerAttributes } from './createDefaultPickerAttributes';
import { createEvent } from './createEvent';
import { downKeyCount } from './downKeyCount';
import { queryLength } from './queryLength';
import { sessionDuration } from './sessionDuration';
import { spaceInQuery } from './spaceInQuery';
import { type UserPickerProps, type UserPickerState } from './types';
import { upKeyCount } from './upKeyCount';

export const cancelEvent: EventCreator = (
	props: UserPickerProps,
	_: UserPickerState,
	session?: UserPickerSession,
	journeyId?: string,
	...args: any[]
) =>
	createEvent('ui', 'cancelled', 'userPicker', {
		...createDefaultPickerAttributes(props, session, journeyId),
		sessionDuration: sessionDuration(session),
		queryLength: queryLength(args[0]),
		spaceInQuery: spaceInQuery(args[0]),
		upKeyCount: upKeyCount(session),
		downKeyCount: downKeyCount(session),
	});
