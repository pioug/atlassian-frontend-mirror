import { type EventType, TRACK_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
	type AnalyticsEventPayload,
	createAndFireEvent,
	type CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { type UserSearchItem } from '@atlaskit/smart-common';

import { type UseUserRecommendationsProps } from '../../types';

const createAndFireEventInElementsChannel = createAndFireEvent(FabricChannel.elements);

const createEvent = (
	eventType: EventType,
	action: string,
	actionSubject: string,
	attributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	source: '@atlaskit/smart-hooks/use-user-recommendations',
	attributes: {
		packageName: process.env._PACKAGE_NAME_,
		packageVersion: process.env._PACKAGE_VERSION_,
		...attributes,
	},
});

export const findUserPosition = (loadedUsers: UserSearchItem[], userId: string) => {
	return loadedUsers.findIndex((val) => val.id === userId);
};

export const createDefaultAttributes = (
	props: UseUserRecommendationsProps,
	renderId: string,
	sessionId: string,
	query: string,
) => {
	const {
		fieldId,
		objectId,
		containerId,
		childObjectId,
		preload,
		includeTeams,
		productKey,
		principalId,
		tenantId,
		maxNumberOfResults,
	} = props;

	return {
		context: fieldId,
		childObjectId,
		containerId,
		includeTeams,
		maxNumberOfResults,
		objectId,
		preload,
		principalId,
		productKey,
		queryLength: (query || '').length,
		renderId,
		sessionId,
		tenantId,
	};
};

export const fireUserSelectedEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	payloadAttributes: AnalyticsEventPayload,
) =>
	createAndFireEventInElementsChannel(
		createEvent(TRACK_EVENT_TYPE, 'selected', 'user', payloadAttributes),
	)(createAnalyticsEvent);
