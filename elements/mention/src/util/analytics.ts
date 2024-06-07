import {
	type UIAnalyticsEvent,
	type WithAnalyticsEventsProps,
	type CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import {
	type GasPayload,
	OPERATIONAL_EVENT_TYPE,
	UI_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { ELEMENTS_CHANNEL } from '../_constants';

import { isSpecialMentionText } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const SLI_EVENT_TYPE = 'sli';
export const SMART_EVENT_TYPE = 'smart';
export enum SliNames {
	SEARCH = 'searchUser',
	SEARCH_TEAM = 'searchTeam',
	INITIAL_STATE = 'initialState',
	SELECT = 'select',
	SELECT_TEAM = 'selectTeam',
}

export enum ComponentNames {
	TYPEAHEAD = 'mentionTypeahead',
	MENTION = 'mention',
}

export enum Actions {
	VIEWED = 'viewed',
	CLICKED = 'clicked',
	CLOSED = 'closed',
	SUCCEEDED = 'succeeded',
	FAILED = 'failed',
}

export const fireAnalyticsMentionTypeaheadEvent =
	(props: WithAnalyticsEventsProps) =>
	(action: string, duration: number, userIds: string[] = [], query?: string): void => {
		if (props.createAnalyticsEvent) {
			const eventPayload: GasPayload = {
				action,
				actionSubject: ComponentNames.TYPEAHEAD,
				attributes: {
					packageName,
					packageVersion,
					componentName: ComponentNames.MENTION,
					duration: Math.round(duration),
					userIds,
					queryLength: query ? query.length : 0,
				},
				eventType: OPERATIONAL_EVENT_TYPE,
			};
			const analyticsEvent: UIAnalyticsEvent = props.createAnalyticsEvent(eventPayload);
			analyticsEvent.fire(ELEMENTS_CHANNEL);
		}
	};

export const fireAnalyticsMentionEvent =
	(createEvent: CreateUIAnalyticsEvent) =>
	(
		actionSubject: string,
		action: string,
		text: string,
		id: string,
		accessLevel?: string,
	): UIAnalyticsEvent => {
		const payload: GasPayload = {
			action,
			actionSubject,
			eventType: UI_EVENT_TYPE,
			attributes: {
				packageName,
				packageVersion,
				componentName: ComponentNames.MENTION,
				accessLevel,
				isSpecial: isSpecialMentionText(text),
				userId: id,
			},
		};
		const event = createEvent(payload);
		event.fire(ELEMENTS_CHANNEL);
		return event;
	};

export const fireSliAnalyticsEvent =
	(props: WithAnalyticsEventsProps) =>
	(actionSubject: string, action: string): void => {
		if (props.createAnalyticsEvent) {
			const eventPayload = buildSliPayload(actionSubject, action);
			props.createAnalyticsEvent(eventPayload).fire(ELEMENTS_CHANNEL);
		}
	};

export const buildSliPayload = (
	actionSubject: string,
	action: string,
	attributes?: {
		[key: string]: any;
	},
): GasPayload => {
	const eventPayload: GasPayload = {
		action,
		actionSubject,
		eventType: OPERATIONAL_EVENT_TYPE,
		attributes: {
			packageName,
			packageVersion,
			componentName: ComponentNames.MENTION,
			...attributes,
		},
	};
	return eventPayload;
};

export const fireAnalyticsMentionHydrationEvent =
	(props: WithAnalyticsEventsProps) =>
	(action: string, userId: string, fromCache: boolean, duration: number): void => {
		if (props.createAnalyticsEvent) {
			const eventPayload: GasPayload = {
				action,
				actionSubject: ComponentNames.MENTION,
				actionSubjectId: 'hydration',
				attributes: {
					packageName,
					packageVersion,
					componentName: ComponentNames.MENTION,
					userId,
					fromCache,
					duration: Math.round(duration),
				},
				eventType: OPERATIONAL_EVENT_TYPE,
			};
			const analyticsEvent: UIAnalyticsEvent = props.createAnalyticsEvent(eventPayload);
			analyticsEvent.fire(ELEMENTS_CHANNEL);
		}
	};

// OLD Analytics
const MENTION_ANALYTICS_PREFIX = 'atlassian.fabric.mention';

export const fireAnalytics =
	(firePrivateAnalyticsEvent?: Function) =>
	(eventName: string, text: string, accessLevel?: string) => {
		if (firePrivateAnalyticsEvent) {
			firePrivateAnalyticsEvent(`${MENTION_ANALYTICS_PREFIX}.${eventName}`, {
				accessLevel,
				isSpecial: isSpecialMentionText(text),
			});
		}
	};
