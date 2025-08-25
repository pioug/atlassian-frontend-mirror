import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

export const ANALYTICS_CHANNEL = 'editor';

export type createAnalyticsEvent = (event: object) => UIAnalyticsEvent;

export enum trackEventActions {
	created = 'created',
	updated = 'updated',
	deleted = 'deleted',
}

export enum actionSubjectIds {
	createCommentButton = 'createCommentButton',
	createCommentInput = 'createCommentInput',
	editButton = 'editButton',
	cancelFailedRequestButton = 'cancelFailedRequestButton',
	retryFailedRequestButton = 'retryFailedRequestButton',
	deleteButton = 'deleteButton',
	saveButton = 'saveButton',
	cancelButton = 'cancelButton',
	replyButton = 'replyButton',
}

export enum eventTypes {
	UI = 'ui',
	TRACK = 'track',
}

export interface AnalyticsEvent {
	attributes: object;
	fire: (channel: string) => void;
	update: (attributes: object) => void;
}

export type EventAttributes = {
	nestedDepth?: number;
};

export type EventData = {
	action?: string;
	actionSubject?: string;
	actionSubjectId?: string;
	attributes?: EventAttributes;
	containerId?: string;
	eventType?: eventTypes;
	nestedDepth?: number;
	objectId?: string;
};

export function fireEvent(analyticsEvent: UIAnalyticsEvent, eventData: EventData) {
	analyticsEvent.update({
		...eventData,
		eventType: eventData.eventType || eventTypes.UI,
		attributes: {
			...analyticsEvent,
			...eventData.attributes,
		},
	});
	analyticsEvent.fire(ANALYTICS_CHANNEL);
}
