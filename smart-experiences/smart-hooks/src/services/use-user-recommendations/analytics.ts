import { type EventType, TRACK_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { FabricChannel } from '@atlaskit/analytics-listeners/types';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
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

export const findUserPosition = (loadedUsers: UserSearchItem[], userId: string): number => {
	return loadedUsers.findIndex((val) => val.id === userId);
};

export const createDefaultAttributes = (
	props: UseUserRecommendationsProps,
	renderId: string,
	sessionId: string,
	query: string,
): {
	context: string;
	childObjectId: string | undefined;
	containerId: string | undefined;
	includeTeams: boolean | undefined;
	maxNumberOfResults: number | undefined;
	objectId: string | undefined;
	preload: boolean | undefined;
	principalId: string | undefined;
	productKey: string;
	queryLength: number;
	renderId: string;
	sessionId: string;
	tenantId: string;
} => {
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
): UIAnalyticsEvent =>
	createAndFireEventInElementsChannel(
		createEvent(TRACK_EVENT_TYPE, 'selected', 'user', payloadAttributes),
	)(createAnalyticsEvent);
