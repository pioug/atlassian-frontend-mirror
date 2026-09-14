import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { EventCreator, UserPickerSession } from './analytics';
import { createDefaultPickerAttributes } from './createDefaultPickerAttributes';
import { createEvent } from './createEvent';
import { downKeyCount } from './downKeyCount';
import { numberOfResults } from './numberOfResults';
import { optionData2Analytics } from './optionData2Analytics';
import { queryLength } from './queryLength';
import { sessionDuration } from './sessionDuration';
import { spaceInQuery } from './spaceInQuery';
import { type Option, type UserPickerProps, type UserPickerState } from './types';
import { upKeyCount } from './upKeyCount';

const selectedCustomGroupAnalyticsAttributes = (
	props: UserPickerProps,
	option?: Option,
): {
	hasCustomGroupLabels?: true;
	selectedLabel?: string;
} => {
	if (!props.customGroupLabels) {
		return {};
	}

	const selectedType = option?.data.type;
	const analyticsLabel = selectedType
		? props.customGroupAnalyticsLabels?.[selectedType]
		: undefined;

	return {
		hasCustomGroupLabels: true,
		...(analyticsLabel ? { selectedLabel: analyticsLabel } : {}),
	};
};

function selectEventType(session?: UserPickerSession): string {
	return session && session.lastKey === 13 ? 'pressed' : 'clicked';
}

function position(state: UserPickerState, value?: Option) {
	return value ? state.options.findIndex((option) => option === value.data) : -1;
}

function result(option?: Option) {
	return option ? optionData2Analytics(option.data) : null;
}

export const selectEvent: EventCreator = (
	props: UserPickerProps,
	state: UserPickerState,
	session?: UserPickerSession,
	journeyId?: string,
	...args: any[]
) => {
	return createEvent('ui', selectEventType(session), 'userPicker', {
		...createDefaultPickerAttributes(props, session, journeyId),
		sessionDuration: sessionDuration(session),
		position: position(state, args[0]),
		queryLength: queryLength(state),
		spaceInQuery: spaceInQuery(state),
		upKeyCount: upKeyCount(session),
		downKeyCount: downKeyCount(session),
		result: result(args[0]),
		numberOfResults: numberOfResults(state),
		...(fg('jsm_routing_recommended_agent_minor_fix')
			? selectedCustomGroupAnalyticsAttributes(props, args[0])
			: {}),
	});
};
