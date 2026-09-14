import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { EventCreator, UserPickerSession } from './analytics';
import { createEvent } from './createEvent';
import { optionData2Analytics } from './optionData2Analytics';
import { sessionId } from './sessionId';
import { type UserPickerProps, type UserPickerState } from './types';

export const deleteEvent: EventCreator = (
	props: UserPickerProps,
	state: UserPickerState,
	session?: UserPickerSession,
	journeyId?: string,
	...args: any[]
) =>
	createEvent('ui', 'deleted', 'userPickerItem', {
		context: props.fieldId,
		sessionId: sessionId(session),
		journeyId,
		value: optionData2Analytics(args[0]),
		pickerOpen: state.menuIsOpen,
		...(isExperimentEnabled('team_member_suggestions_while_creating_team') &&
		args[0]?.isSuggestedMember !== undefined
			? { isSuggestedMember: args[0].isSuggestedMember }
			: {}),
	});
